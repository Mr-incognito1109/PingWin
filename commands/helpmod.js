const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = Discord;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("helpmod")
        .setDescription("Displays information about moderation commands"),
        // .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers), // Restrict to mods

    async execute(interaction) {
        // Check if the user has moderation permissions
        // if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
        //     return interaction.reply({ content: "You don't have permission to use moderation commands.", ephemeral: true });
        // }

        const embed = new EmbedBuilder()
            .setTitle("<a:ban:1213797183929978891> Moderation Help")
            .setColor("FF0000") // Color associated with moderation
            .addFields(
                
                { name: "`/timeout`", value: "Timeouts a member for a specified time. \n**Usage:** `/timeout <member> <duration> [reason]`" },
                { name: ' ', value: ' ' },
                { name: "`/kick`", value: "Kicks a member from the server.\n**Usage:** `/kick <member> [reason]`" },
                { name: ' ', value: ' ' },
                { name: "`/ban`", value: "Bans a member from the server.\n**Usage:** `/ban <member> [reason]`"},
                { name: ' ', value: ' ' },
                { name: "`/unban`", value: "Unbans a member by their User ID.\n**Usage:** `/unban <user_id>`"}
                
            )
            .setFooter({ text: "Created by zoro_mosshead" }); 

        await interaction.reply({ embeds: [embed] });
    }
};
