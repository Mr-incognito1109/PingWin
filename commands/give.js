const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = Discord;
const sqlite3 = require("sqlite3").verbose();

// Connect to your SQLite3 database
const db = new sqlite3.Database("./pcoins.db");

// Define the ID of the channel where transaction logs will be sent
const transactionLogChannelId = '1213776032948031498';

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
        } else {
            return value; // No multiplier implies a direct number of p_coins
        } 
    }

    return null;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Transfer <:p_coins:1213423162138828921> to another user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to give <:p_coins:1213423162138828921> to')
                .setRequired(true))
        .addStringOption(option => // Change to StringOption to accept the new keywords
            option.setName('amount')
                .setDescription('The amount of <:p_coins:1213423162138828921> to give (use "half", "all" or "k" for thousands)')
                .setRequired(true)),

    async execute(interaction) {
        // Fetch the current balance of the sender
        db.get("SELECT balance FROM pcoins WHERE user_id = ?", [interaction.user.id], (err, row) => {
            if (err) {
                console.error("Error fetching balance (sender):", err);
                return interaction.reply({ 
                    embeds: [new EmbedBuilder()
                        .setColor('FF0000') // Error color
                        .setDescription("Oops! Something went wrong.")], 
                    ephemeral: true
                });
            } else {
                const currentBalance = row ? row.balance : 0;
                const targetUser = interaction.options.getUser('user'); // Define targetUser here
                const amountString = interaction.options.getString('amount');
                const amount = parseAmount(amountString, currentBalance);

                if (amount === null || isNaN(amount) || amount <= 0 || amount > currentBalance) {
                    return interaction.reply({ content: "Invalid amount or insufficient balance.", ephemeral: true });
                } else {
                    // Database Interaction (Check balance, deduct from sender, add to receiver) 
                    db.serialize(() => {
                        db.run("UPDATE pcoins SET balance = balance - ? WHERE user_id = ?", [amount, interaction.user.id]);
                        db.run("UPDATE pcoins SET balance = balance + ? WHERE user_id = ?", [amount, targetUser.id], (err) => {
                            if (err) {
                                console.error("Error updating balance (receiver):", err);
                                return interaction.reply({ 
                                    embeds: [new EmbedBuilder()
                                        .setColor('FF0000') // Error color
                                        .setDescription("Oops! Something went wrong.")], 
                                    ephemeral: false
                                });
                            } else {
                                const targetUserMention = targetUser.toString(); // Mention the target user
                                const logChannel = interaction.guild.channels.cache.get(transactionLogChannelId);
                                if (logChannel) {
                                    const logEmbed = new EmbedBuilder()
                                        .setColor('00FF00') // Success color
                                        .setTitle('Transaction Log')
                                        .setDescription(`Transfer: ${interaction.user.toString()} (${interaction.user.id}) -> ${targetUser.toString()} (${targetUser.id})`)
                                        .addFields({name:'Amount',value : `${amount} <:p_coins:1213423162138828921>`, inline:true});
                                    logChannel.send({ embeds: [logEmbed] });
                                }

                                return interaction.reply({ 
                                    embeds: [new EmbedBuilder()
                                        .setColor('00FF00') // Success color
                                        .setDescription(`You successfully gave ${amount} <:p_coins:1213423162138828921> to ${targetUserMention}.`)], 
                                    ephemeral: false
                                });
                            }
                        });
                    });
                }
            }
        });
    }
};
