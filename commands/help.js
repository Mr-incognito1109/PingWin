const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = Discord;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Open the help menu of the bot!"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Help Menu")
      .setColor("White")
      .setDescription("Bot help Menu")
      .setTimestamp()
      .addFields(
        {
          name: "📖 General slash commands",
          value: "`/pinwing` , `/pinguser`,`/hello`,`/time`,`/userinfo`",
        },
        {
          name: "Need More help ?",
          value: "Join our guild: [Zoro](https://discord.gg/yAMXvQPtx3)",
        }
      )

      .setFooter({
        text: "Created by zoro_mosshead • Join our guild: [Invite Link Here](https://discord.gg/yAMXvQPtx3)",
      });

    await interaction.reply({
      embeds: [embed],
    });
  },
};
