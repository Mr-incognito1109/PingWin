const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = Discord;
const sqlite3 = require('sqlite3').verbose();

// Connect to your SQLite3 database
const db = new sqlite3.Database('./pcoins.db'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('Transfer <:p_coins:1213423162138828921> to another user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to give <:p_coins:1213423162138828921> to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of <:p_coins:1213423162138828921> to give')
                .setRequired(true)),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (targetUser.id === interaction.user.id) {
            return interaction.reply({ 
                    embeds: [new EmbedBuilder()
                        .setColor('FF0000') // Error color
                        .setDescription("Silly you can't give <:p_coins:1213423162138828921> to yourself!")], 
                    ephemeral: false
                });
        }

        if (amount <= 0) {
            return interaction.reply({ content: "You must give a positive amount of <:p_coins:1213423162138828921>.", ephemeral: true });
        }

        // Database Interaction (Check balance, deduct from sender, add to receiver) 
        db.get("SELECT balance FROM pcoins WHERE user_id = ?", [interaction.user.id], (err, row) => {
            if (err) {
                console.error("Error fetching balance (sender):", err);
                return interaction.reply({ 
                    embeds: [new EmbedBuilder()
                        .setColor('FF0000') // Error color
                        .setDescription("Oops! Something went wrong.")], 
                    ephemeral: false
                });
            } else {
                const senderBalance = row ? row.balance : 0;

                if (amount > senderBalance) {
                    return interaction.reply({ 
                        embeds: [new EmbedBuilder()
                            .setColor('FF0000') // Error color
                            .setDescription("You don't have enough <:p_coins:1213423162138828921> to give that amount!")], 
                        ephemeral: false 
                    });
                } else {
                    // Atomic Transaction for Safe Transfer
                    db.serialize(() => { // Ensure data integrity
                        db.run("UPDATE pcoins SET balance = balance - ? WHERE user_id = ?", [amount, interaction.user.id]);
                        db.run("UPDATE pcoins SET balance = balance + ? WHERE user_id = ?", [amount, targetUser.id], (err) => {
                            if (err) {
                                console.error("Error updating balance (receiver):", err);
                                interaction.reply({ 
                                    embeds: [new EmbedBuilder()
                                        .setColor('00FF00') // Success color
                                        .setDescription(`Something went wrong!`)]
                                }); 
                            } else {
                                interaction.reply({ 
                                    embeds: [new EmbedBuilder()
                                        .setColor('00FF00') // Success color
                                        .setDescription(`You successfully gave ${amount} <:p_coins:1213423162138828921> to ${targetUser.username}.`)]
                                }); 
                            }
                        });
                    });
                }
            }
        });

    }
};