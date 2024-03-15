const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the kick')
                .setRequired(false)),

    async execute(interaction) {
        // Check bot permissions
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "I don't have permission to kick members!", ephemeral: true });
        }

        // Check user permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "You don't have permission to kick members!", ephemeral: true });
        }

        const targetMember = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        // Cannot kick self
        if (targetMember.id === interaction.user.id) {
            return interaction.reply({ content: 'You cannot kick yourself!', ephemeral: false });
        }

        // Check if target member is kickable 
        if (!targetMember.kickable) {
            return interaction.reply({ content: 'This member cannot be kicked. Check roles or permissions.', ephemeral: true });
        }

        // Kick the member
        targetMember.kick(reason)
            .then(() => {
                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`✅ ${targetMember.user.tag} has been kicked.\n**Reason:** ${reason}`)
                        .setColor('90EE90')]
                });
            })
            .catch((error) => {
                console.error('Error kicking member:', error);
                interaction.reply({ content: 'Oops! Something went wrong while kicking the member.', ephemeral: true });
            });
    }
};
