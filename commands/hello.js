const Discord = require('discord.js');
const {SlashCommandBuilder} = Discord;

module.exports = {
    data : new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Greets the user !")
    .addUserOption(option =>
        option
            .setName("user")
            .setDescription("Says hello to a user")
            .setRequired(false)
    ),

    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        interaction.reply(`Hello there ${user.username}!!`);
    }
}