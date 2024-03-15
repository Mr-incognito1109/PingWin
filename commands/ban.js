const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member from the server')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the ban')
                .setRequired(false)),

    async execute(interaction) {
        // Check bot permissions
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "I don't have permission to ban members!", ephemeral: true });
        }

        // Check user permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "You don't have permission to ban members!", ephemeral: true });
        }

        const targetMember = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        // Cannot ban self
        if (targetMember.id === interaction.user.id) {
            return interaction.reply({ content: 'You cannot ban yourself!', ephemeral: true });
        }

        // Check if target member is bannable 
        if (!targetMember.bannable) {
            return interaction.reply({ content: 'This member cannot be banned. Check roles or permissions.', ephemeral: true });
        }

        // Ban the member
        targetMember.ban({ reason })
            .then(() => {
                interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setDescription(`✅ ${targetMember.user.tag} has been banned.\n**Reason:** ${reason}`)
                        .setColor('FF0000')]
                });
            })
            .catch((error) => {
                console.error('Error banning member:', error);
                interaction.reply({ content: 'Oops! Something went wrong while banning the member.', ephemeral: true });
            });
    }
};
