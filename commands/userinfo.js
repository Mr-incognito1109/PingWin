const Discord = require('discord.js');
const { SlashCommandBuilder, EmbedBuilder } = Discord;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Fetches information about a user")
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to get info for')
                .setRequired(true))
        .setDMPermission(false),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const targetMember = await interaction.guild.members.fetch(targetUser.id);

        const embed = new EmbedBuilder()
            .setColor("90EE90")
            .setAuthor({ name: `${targetUser.username}'s Info`, iconURL: targetUser.displayAvatarURL() })
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
                { name: 'Username', value: targetUser.tag },
                { name: 'ID', value: targetUser.id },
                { name: 'Created At', value: `<t:${Math.floor(targetUser.createdAt / 1000)}:F>`},
                { name: 'Joined This Server', value: `<t:${Math.floor(targetMember.joinedAt / 1000)}:F>`},
                { name: 'Server Boosts', value: targetMember.premiumSince ? `<t:${Math.floor(targetMember.premiumSinceTimestamp / 1000)}:R>` : 'None' },
                { name: 'Roles have :', value: targetMember.roles.cache.map(role => role.toString()).join(', ') || 'None' },
                { name: 'Social Links', value: await getSocialLinks(targetMember) || 'None' },
                { name: 'Connections', value: await getConnectionLinks(targetMember) || 'None' }
                // ... Add more fields as needed
            );

        await interaction.reply({ embeds: [embed] });

        async function getSocialLinks(member) {
            let links = [];
        
            // Check activities for links (e.g., playing a game with URL)
            if (member.presence?.activities) {
                member.presence.activities.forEach(activity => {
                    if (activity.type === 'CUSTOM' && activity.url) {
                        links.push(activity.url);
                    }
                });
            }
        
            // Check client status (e.g., desktop, mobile)
            if (member.presence?.clientStatus) {
                const connections = Object.values(member.presence.clientStatus).flatMap(status => status.connections || []); // Get connections
                links = [...links, ...connections.map(c => `[${c.name}](${c.url})`)]; // Format connections
            }
            if (member.presence?.clientStatus) {
                const connections = Object.values(member.presence.clientStatus).flatMap(status => status.connections || []);
                links = [...links, ...connections.map(c => `[${c.name}](${c.url})`)];
            }   
        
            return links.join('\n') || null; 
        }

        async function getConnectionLinks(member) {
            let links = [];
            if (member.presence?.clientStatus) {
                const connections = Object.values(member.presence.clientStatus)
                                        .flatMap(status => status.connections || []);
                links = [...links, ...connections.map(c => {
                    const capitalizedName = c.name.charAt(0).toUpperCase() + c.name.slice(1); 
                    return `[${capitalizedName}](${c.url})`; 
                })]; 
            }
            return links.join('\n') || 'None';
        }
    }
    

    
};
