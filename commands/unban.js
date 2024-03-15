const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server by their User ID')
        .addStringOption(option =>
            option.setName('user_id')
                .setDescription('The User ID of the banned user')
                .setRequired(true)),

    async execute(interaction) {
        // Check bot permissions
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "I don't have permission to unban members!", ephemeral: true });
        }

        // Check user permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "You don't have permission to unban members!", ephemeral: true });
        }

        const userId = interaction.options.getString('user_id');

        try {
            const bannedUser = await interaction.guild.bans.fetch(userId);
            await interaction.guild.members.unban(userId);

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`✅ ${bannedUser.user.tag} has been unbanned.`)
                        .setColor('90EE90')
                ]
            });

        } catch (error) {
            if (error.code === DiscordAPIError.UnknownBan) {
                return interaction.reply({ content: 'User is not banned.', ephemeral: true });
            } else {
                console.error(`Unban Error: ${error}`);
                return interaction.reply({ content: 'Oops! Something went wrong while unbanning the user.', ephemeral: true });
            }
        }
    }
};
