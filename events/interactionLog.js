const { EmbedBuilder } = require('discord.js'); // Import EmbedBuilder

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return; 

        try {
            const logChannel = interaction.guild.channels.cache.find(channel => channel.name === "penguin-logs"); 
            if (!logChannel) return console.error('Could not find interaction-logs channel');

            const logEmbed = new EmbedBuilder()
                .setColor('90EE90') 
                .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL() })
                .setTitle('Command Executed')
                .addFields(
                    { name: 'Command', value: `/${interaction.commandName}` },
                    { name: 'Options', value: interaction.options.data.map(option => `(${option.name}: ${option.value})`).join(' ') || 'None' }, // Handle no options case
                )
                .setTimestamp();

            await logChannel.send({ embeds: [logEmbed] }); 

        } catch (error) {
            console.error('Error logging interaction:', error);
        }
    }
};
