const Discord = require('discord.js');
const { SlashCommandBuilder, EmbedBuilder } = Discord;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Gets the avatar of yourself or a specified user.")
        .addUserOption(option => option
            .setName('target')
            .setDescription('The user whose avatar you want to see')
        ),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('target') || interaction.user; 

        const embed = new EmbedBuilder()
            .setColor("90EE90")
            .setAuthor({ name: `${targetUser.username}'s Avatar`, iconURL: targetUser.displayAvatarURL({ dynamic: true }) }) 
            .setImage(targetUser.displayAvatarURL({ size: 512 })); 

        await interaction.reply({ embeds: [embed] }); 
    }
};
