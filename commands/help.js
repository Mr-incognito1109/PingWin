const Discord = require('discord.js');
const {SlashCommandBuilder , EmbedBuilder} = Discord;

module.exports = {
    data : new SlashCommandBuilder()
    .setName("help")
    .setDescription("Open the help menu of the bot!"),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Help Menu')
            .setColor("White")
            .setDescription("Bot help Menu")
            .setTimestamp()
            .addFields({
                name:"📖 General",
                value : "`/pinwing` , `/pinguser`,`/hello`,`/time`"

            })

        await interaction.reply({
            embeds : [embed]

        })
    }
}