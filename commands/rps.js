const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ActionRowBuilder} = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./pcoins.db');

function parseAmount(amountString, currentBalance) {
    const lowerCaseAmountString = amountString.toLowerCase().trim();
    const multiplierMap = {
        k: 1000,
        m: 1000000
    };

    if (lowerCaseAmountString === "all") {
        return currentBalance;
    } else if (lowerCaseAmountString === "half") {
        return Math.floor(currentBalance / 2);
    }

    const regex = /(\d+(?:\.\d+)?)([kmb]?)/i;
    const match = lowerCaseAmountString.match(regex);

    if (match) {
        const value = parseFloat(match[1]);
        const multiplier = match[2] ? match[2].toLowerCase() : '';

        if (multiplier in multiplierMap) {
            return value * multiplierMap[multiplier];
        }

        return value;
    }

    return null;
}

function getRPSResult(playerChoice, opponentChoice) {
    if (playerChoice === opponentChoice) {
        return 'tie';
    }
    if (
        (playerChoice === 'rock' && opponentChoice === 'scissors') ||
        (playerChoice === 'paper' && opponentChoice === 'rock') ||
        (playerChoice === 'scissors' && opponentChoice === 'paper')
    ) {
        return 'win';
    }
    return 'lose';
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play Rock-Paper-Scissors with the bot')
        .addStringOption(option =>
            option.setName('amount')
                .setDescription('The amount of p_coins to bet (e.g., "5k" for 5000, "all" to bet all, "half" to bet half)')
                .setRequired(true)),

    async execute(interaction) {
        const amountString = interaction.options.getString('amount');
        const currentBalance = await new Promise((resolve, reject) => {
            db.get("SELECT balance FROM pcoins WHERE user_id = ?", [interaction.user.id], (err, row) => {
                if (err) {
                    console.error("Error fetching balance:", err);
                    reject(err);
                } else {
                    resolve(row ? row.balance : 0);
                }
            });
        });

        const betAmount = parseAmount(amountString, currentBalance);

        if (betAmount === null || isNaN(betAmount) || betAmount <= 0) {
            return interaction.reply({
                content: "Invalid amount. Please enter a valid positive number, 'all', or 'half'.",
                ephemeral: true,
            });
        }

        if (betAmount > currentBalance) {
            return interaction.reply({
                content: "You don't have enough p_coins for that bet!",
                ephemeral: true,
            });
        }

        const rpsEmbed = new EmbedBuilder()
            .setTitle('Rock-Paper-Scissors')
            .setDescription(`You've bet ${betAmount} <:p_coins:1213423162138828921>. Choose your move:`);

        const rockButton = new ButtonBuilder()
            .setCustomId('rock')
            .setLabel('Rock')
            .setStyle(ButtonStyle.Primary);

        const paperButton = new ButtonBuilder()
            .setCustomId('paper')
            .setLabel('Paper')
            .setStyle(ButtonStyle.Primary);

        const scissorsButton = new ButtonBuilder()
            .setCustomId('scissors')
            .setLabel('Scissors')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(rockButton, paperButton, scissorsButton);

        const message = await interaction.reply({ embeds: [rpsEmbed], components: [row], fetchReply: true });

        const filter = (btnInteraction) =>
            ['rock', 'paper', 'scissors'].includes(btnInteraction.customId) && btnInteraction.user.id === interaction.user.id;

        const collector = message.createMessageComponentCollector({ filter, time: 15000, max: 1 });

        collector.on('collect', async (btnInteraction) => {
            await btnInteraction.deferUpdate(); // Acknowledge the button click right away 

            const userChoice = btnInteraction.customId;
            const botChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];

            const result = getRPSResult(userChoice, botChoice);
            const newBalance = result === 'win' ? currentBalance + betAmount : result === 'lose' ? currentBalance - betAmount : currentBalance;

            db.run(
                "UPDATE pcoins SET balance = ? WHERE user_id = ?",
                [newBalance, interaction.user.id],
                (err) => {
                    if (err) {
                        console.error("Error updating balance:", err);
                        interaction.followUp({
                            content: "Oops! Something went wrong.",
                            ephemeral: true,
                        });
                    } else {
                        let message = `**${result === 'win' ? "You Won! <:wow:1213442782698537020> " : result === 'lose' ? "You lost! <:pepeEEEEEE_owo:1077159854931709952> " : "It's a tie! "}${betAmount} <:p_coins:1213423162138828921>**`;
                        if (result !== 'tie') {
                            message += ` Bot chose ${botChoice}.`;
                        }

                        const resultEmbed = new EmbedBuilder()
                            .setDescription(message);

                        interaction.followUp({ embeds: [resultEmbed] });
                    }
                }
            );
        });

        collector.on('end', () => {
            if (!collector.collected.size) {
                interaction.followUp({ content: 'You did not make a choice in time.', ephemeral: true });
            }
        });
    },
};
