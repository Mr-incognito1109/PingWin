module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        try {
            const welcomeRole = await member.guild.roles.cache.find(role => role.name === "member");
            if (!welcomeRole) return console.error('Could not find member role'); 

            await member.roles.add(welcomeRole);

            const welcomeChannel = await member.guild.channels.cache.get("1209776511163572296"); 
            if (!welcomeChannel) return console.error('Could not find welcome channel');

            await welcomeChannel.send(`Welcome to the server ${member.user} boi`);
        } catch (error) {
            console.error('Error welcoming member:', error);
        }
    }
};

