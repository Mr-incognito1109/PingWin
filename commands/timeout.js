const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Times out a member for a specified duration.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The member to timeout')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration of the timeout (e.g., 10s, 5m, 1h, 2d)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the timeout')
                .setRequired(false)),

    async execute(interaction) {
        // Permissions Check
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "You don't have permission to timeout members!", ephemeral: true });
        }

        const targetMember = interaction.options.getMember('target');
        const durationString = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        // Timeout Logic (Using milliseconds for precision)
        let timeoutDurationMs = parseDuration(durationString); 
        if (!timeoutDurationMs) {
            return interaction.reply({ content: 'Invalid duration format. Please use units like s (seconds), m (minutes), h (hours), d (days).', ephemeral: true });
        }

        try {
            await targetMember.timeout(timeoutDurationMs, reason);

            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`✅ ${targetMember.user.tag} has been timed out for ${durationString}.\n**Reason:** ${reason}`)
                        .setColor('FF0000')
                ],
                ephemeral: false
            });
        } catch (error) {
            console.error(`Timeout Error: ${error}`);
            interaction.reply({ content: 'Oops! Something went wrong while timing out the member.', ephemeral: true });
        }
    }
};

// Helper Function to Parse Durations
function parseDuration(durationString) {
    const matches = durationString.match(/(\d+)([smhd])/);
    if (!matches) return null; 

    const amount = parseInt(matches[1]);
    const unit = matches[2];

    let multiplier;
    switch (unit) {
        case 's': multiplier = 1000; break; 
        case 'm': multiplier = 60 * 1000; break; 
        case 'h': multiplier = 60 * 60 * 1000; break;
        case 'd': multiplier = 24 * 60 * 60 * 1000; break;
        default: return null;
    }

    return amount * multiplier;
}
