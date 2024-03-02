const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const sqlite3 = require('sqlite3').verbose();

// Connect to your SQLite3 database
const db = new sqlite3.Database('./pcoins.db'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('give or take coins from another user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to transfer coins to')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of coins to transfer')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Action: give or take')
                .setRequired(true)
                .addChoices(
                    { name: 'Give', value: 'give' },
                    { name: 'Take', value: 'take' }
                )),

    async execute(interaction) {
        // Check if the user executing the command is the owner of the bot
        const ownerId = process.env.OWNER_ID; // Fetch owner ID from environment variable
        if (interaction.user.id !== ownerId) {
            return interaction.reply({ 
                content: "Only the bot owner can use this command.", 
                ephemeral: true 
            });
        }

        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');
        const action = interaction.options.getString('action');

        if (amount <= 0) {
            return interaction.reply({ 
                content: "You must transfer a positive amount of <:p_coins:1213423162138828921>.", 
                ephemeral: true 
            });
        }

        // Database Interaction (Add or subtract balance)
        db.serialize(() => { // Ensure data integrity
            if (action === 'give') {
                db.run("UPDATE pcoins SET balance = balance + ? WHERE user_id = ?", [amount, targetUser.id], (err) => {
                    if (err) {
                        console.error("Error updating balance (receiver):", err);
                        interaction.reply({ 
                            embeds: [new EmbedBuilder()
                                .setColor('FF0000') // Error color
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
            } else if (action === 'take') {
                db.run("UPDATE pcoins SET balance = balance - ? WHERE user_id = ?", [amount, targetUser.id], (err) => {
                    if (err) {
                        console.error("Error updating balance (receiver):", err);
                        interaction.reply({ 
                            embeds: [new EmbedBuilder()
                                .setColor('FF0000') // Error color
                                .setDescription(`Something went wrong!`)]
                        }); 
                    } else {
                        interaction.reply({ 
                            embeds: [new EmbedBuilder()
                                .setColor('00FF00') // Success color
                                .setDescription(`You successfully took ${amount} <:p_coins:1213423162138828921> from ${targetUser.username}.`)]
                        }); 
                    }
                });
            } else {
                return interaction.reply({ 
                    content: "Invalid action. Please choose 'give' or 'take'.", 
                    ephemeral: true 
                });
            }
        });
    }
};
