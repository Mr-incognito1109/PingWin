const Discord = require('discord.js');
const sqlite3 = require('sqlite3').verbose();
const { EmbedBuilder } = Discord;

// Connect to your SQLite3 database
const db = new sqlite3.Database('./pcoins.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to pcoins database.');
    }
});

// Create the database table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS pcoins (
    user_id TEXT PRIMARY KEY,
    balance INTEGER
)`);

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot) return; // Ignore bot messages

        if ((message.content.toLowerCase().includes('owo') || message.content.toLowerCase().includes('uwu')) && (message.channel.id === '1165528231491948545' || message.channel.id === '1213721148962111518')) { 
            const randomNumber = Math.floor(Math.random() * 100) + 1;
            let coinsEarned = 0;

            if (randomNumber >= 90 && randomNumber <= 98) {
                coinsEarned = 300;
            }else if (randomNumber>= 50 && randomNumber<=60){
                coinsEarned = 200
            }else if (randomNumber === 99) {
                coinsEarned = 400;
            } else if (randomNumber === 100) {
                coinsEarned = 1000;
            } else if (randomNumber === 69) {
                coinsEarned = 2000;
            } else if (randomNumber ===1){
                coinsEarned = 500
            }

            db.run("UPDATE pcoins SET balance = COALESCE(balance, 0) + ? WHERE user_id = ?", [coinsEarned, message.author.id], (err) => {
                if (err) {
                    console.error("Error updating balance:", err);
                } else {
                    db.get("SELECT balance FROM pcoins WHERE user_id = ?", [message.author.id], (err, row) => {
                        if (err) {
                            console.error("Error fetching balance:", err);
                        } else {
                            const newBalance = row ? row.balance : 0;

                            if (coinsEarned > 0) {
                                // Success Embed
                                const successEmbed = new Discord.EmbedBuilder()
                                    .setColor('90EE90') 
                                    .setTitle('OwO Rewards')
                                    .setDescription(`Congrats ${message.author}!`)
                                    .addFields(
                                        { name: '<a:dice_roll:1213425867619831858> Roll', value: `${randomNumber}`, inline: true },
                                        { name: '<:p_coins:1213423162138828921> Earned', value: `${coinsEarned}`, inline: true },
                                        { name: 'New Balance', value: `${newBalance} <:p_coins:1213423162138828921>` }
                                    );
                                message.channel.send({ embeds: [successEmbed] });

                            } else {
                                // Better Luck Next Time Embed
                                const tryAgainEmbed = new Discord.EmbedBuilder()
                                    .setColor('90EE90') 
                                    .setTitle('Better Luck Next Time <:pepeLOL_owo:1077160384424853554>')
                                    .setDescription(`Aww, ${message.author}\nYou rolled ${randomNumber}. Try again for some <:p_coins:1213423162138828921> !`);
                                message.channel.send({ embeds: [tryAgainEmbed] });
                            }
                        }
                    });
                }
            });
        }
    }
};
