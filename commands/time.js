const Discord = require('discord.js');
const {SlashCommandBuilder} = Discord;

module.exports = {
    data : new SlashCommandBuilder()
    .setName("time")
    .setDescription("Shows Actual Time !"),

    async execute(interaction) {
        interaction.reply(`<t:${Math.floor(new Date().getTime() / 1000.0)}:F>`);
    }
}