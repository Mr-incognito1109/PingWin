const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = Discord;
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./pcoins.db'); 


module.exports = { 
        data: new SlashCommandBuilder()
            .setName('leaderboard')
            .setDescription('Shows the p_coins leaderboard'),
    
        async execute(interaction) {
            db.all("SELECT user_id, balance FROM pcoins ORDER BY balance DESC LIMIT 10", async (err, rows) => {
                if (err) {
                    console.error("Error fetching leaderboard:", err);
                    interaction.reply({ content: "Oops! Couldn't fetch the leaderboard.", ephemeral: true });
                } else {
                    const leaderboardEmbed = new EmbedBuilder()
                        .setColor('90EE90')
                        .setTitle('<:RISE_owo:1078044047568027668> Leaderboard')
    
                    if (rows.length > 0) {
                        let leaderboardDescription = ''; 
                        for (let i = 0; i < rows.length; i++) {
                            const user = await interaction.client.users.fetch(rows[i].user_id); 
                            leaderboardDescription += `**${i + 1}. ${user.username} : ${rows[i].balance} <:p_coins:1213423162138828921>**\n`;
                        }
                        leaderboardEmbed.setDescription(leaderboardDescription);
                    } else {
                        leaderboardEmbed.setDescription('The leaderboard is empty. Get out there and earn some <:p_coins:1213423162138828921>!');
                    }
    
                    interaction.reply({ embeds: [leaderboardEmbed] });
                }
            });
        }
    
};