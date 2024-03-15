const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./pcoins.db");

// Define multipliers for different winning combinations
const slotSymbols = ["💎", "🍒", "🔔", "🍋", "🍀"];
const multipliers = {
    "💎💎💎": 35,
    "🍒🍒🍒": 10,
    "🔔🔔🔔": 5,
    "🍋🍋🍋": 1,
    "🍋🍋💎":1,
    "💎💎🍒": 5,
    "💎🍒💎":4,
    "💎🍋💎":4,
    "🍒🍒🔔": 2,
    "🔔🔔🍋": 1,
    "🍀🔔🔔":1,
    "🔔🍋🍋":1,
    "🍀💎💎":3,
    " 💎🍀💎":1,
    " 🍒💎💎":3,
};

function parseAmount(amountString, currentBalance) {
    const lowerCaseAmountString = amountString.toLowerCase().trim();
    
    // Check for special inputs: 'all' and 'half'
    if (lowerCaseAmountString === 'all') {
        return currentBalance;
    } else if (lowerCaseAmountString === 'half') {
        return Math.floor(currentBalance / 2);
    }

    // Check for 'k' multiplier
    if (lowerCaseAmountString.endsWith('k')) {
        const value = parseInt(lowerCaseAmountString);
        if (!isNaN(value)) {
            return value * 1000;
        }
    }

    // Check for 'm' multiplier
    if (lowerCaseAmountString.endsWith('m')) {
        const value = parseInt(lowerCaseAmountString);
        if (!isNaN(value)) {
            return value * 1000000;
        }
    }

    // Parse regular integer amounts
    const parsedAmount = parseInt(amountString);
    if (parsedAmount !== 0 && parsedAmount !== null && parsedAmount > 0) {
        return parsedAmount;
    }

    return 0; // Invalid input format
}

function calculateWinnings(betAmount, symbols) {
    const symbolCombination = symbols.join("");
    if (symbolCombination in multipliers) {
        return betAmount * multipliers[symbolCombination];
    } else {
        return 0; // No win
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slots")
        .setDescription("Play the slot machine and try your luck!")
        .addStringOption((option) =>
            option
                .setName("amount")
                .setDescription("The amount of p_coins to bet (e.g., '5k' for 5000, 'all' to bet all, 'half' to bet half)")
                .setRequired(true)
        ),

    async execute(interaction) {
        const amountString = interaction.options.getString("amount");
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
            return interaction.reply({ content: "Invalid amount.", ephemeral: true });
        }

        if (betAmount > currentBalance) {
            return interaction.reply({ content: "You don't have enough <:p_coins:1213423162138828921>!", ephemeral: false });
        }

        // Generate slot results
        const symbols = [];
        for (let i = 0; i < 3; i++) {
            symbols.push(slotSymbols[Math.floor(Math.random() * slotSymbols.length)]);
        }

        // Calculate winnings
        const winnings = calculateWinnings(betAmount, symbols);
        const newBalance = currentBalance + winnings - betAmount;

        // Update the database
        db.run(
            "UPDATE pcoins SET balance = ? WHERE user_id = ?",
            [newBalance, interaction.user.id],
            (err) => {
                if (err) {
                    console.error("Error updating balance:", err);
                    interaction.reply({ content: "Oops! Something went wrong.", ephemeral: true });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("Slots")
                        .setDescription(`You spun: ${symbols.join(" ")}`)
                        .addFields(
                            { name: 'Result', value: winnings > 0 ? `You bet ${betAmount} and won ${winnings} <:p_coins:1213423162138828921>!` : `You lost ${betAmount} <:p_coins:1213423162138828921>!` },
                            { name: 'New Balance', value: `${newBalance} <:p_coins:1213423162138828921>` }
                        );

                    interaction.reply({ embeds: [embed] });
                }
            }
        );
    },
};
