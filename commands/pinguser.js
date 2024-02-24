const Discord = require('discord.js');
const {SlashCommandBuilder} = Discord;

module.exports = {
    data : new SlashCommandBuilder()
    .setName("pinguser")
    .setDescription("Pings a user and sends a message to another channel!")
    .addUserOption(option =>
        option
            .setName("target")
            .setDescription("The user to ping")
            .setRequired(true)
    )
    .addChannelOption(option =>
        option
            .setName("channel")
            .setDescription("The channel to send the message to")
            .setRequired(true)
    
    )
    .addStringOption(option =>
      option
          .setName("message")
          .setDescription("The custom message to send")
          .setRequired(true)
    )
    .setDMPermission(false),

    async execute(interaction) {

      const targetUser = interaction.options.getUser("target");
      const targetChannel = interaction.options.getChannel("channel");
      const customMessage = interaction.options.getString("message");

      targetChannel.send(`${targetUser}! ${customMessage}`);
      interaction.reply('Message sent!');

    }
}
