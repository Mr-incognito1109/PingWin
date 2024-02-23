const Discord = require('discord.js');
const {SlashCommandBuilder} = Discord;

module.exports = {
    data : new SlashCommandBuilder()
    .setName("pingwin")
    .setDescription("Replies with Pongwin!"),

    async execute(interaction) {

        interaction.reply(`Pongwin!!🏓`);
        
    }
}