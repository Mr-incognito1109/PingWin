const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = Discord;
const sqlite3 = require('sqlite3').verbose();

// Connect to your SQLite3 database
const db = new sqlite3.Database('./pcoins.db'); 

// module.exports = {
//         data: new SlashCommandBuilder()
//             .setName('balance')
//             .setDescription('Checks your p_coins balance'),

//         async execute(interaction) {
//             db.get("SELECT balance FROM pcoins WHERE user_id = ?", [interaction.user.id], (err, row) => {
//                 if (err) {
//                     console.error("Error fetching balance:", err);
//                     interaction.reply({ content: "Oops! Something went wrong while checking your balance.", ephemeral: true }); // Ephemeral for privacy
//                 } else {
//                     const balance = row ? row.balance : 0;
//                     const embed = new EmbedBuilder()
//                         .setColor('90EE90')
//                         .setTitle(`${interaction.user.username}'s Balance <:DakiHehe_owo:1151174166809153678>`)
//                         .setDescription(`You have ${balance} <:p_coins:1213423162138828921>.`);
//                     interaction.reply({ embeds: [embed] }); 
//                 }
//             });
//         }
// };
module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Checks your p_coins balance or the balance of someone else.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose balance you want to view.')
                .setRequired(false)), // Make the option optional

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user; // Fetch target user or default to the command user

        db.get("SELECT balance FROM pcoins WHERE user_id = ?", [targetUser.id], (err, row) => {
            if (err) {
                console.error("Error fetching balance:", err);
                return interaction.reply({ content: "Oops! Something went wrong while checking the balance.", ephemeral: true }); 
            } else {
                const balance = row ? row.balance : 0;
                const embed = new EmbedBuilder()
                    .setColor('90EE90')
                    .setTitle(`${targetUser.username}'s Balance <:DakiHehe_owo:1151174166809153678>`) 
                    .setDescription(`They have ${balance} <:p_coins:1213423162138828921>.`);
                interaction.reply({ embeds: [embed] }); 
            }
        });
    }
};
