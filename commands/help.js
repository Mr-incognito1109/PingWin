const Discord = require("discord.js");

const { SlashCommandBuilder, EmbedBuilder } = Discord;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Open the help menu of the bot!"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🚀 Help Menu")
      .setColor("#ff8c00")
      .setDescription("Here's how to use the bot:")
      .setTimestamp()
      .addFields(
        {
          name: "📖 General Commands",
          value: "`/ping`, `/hello`, `/time`, `/userinfo`, `/coinflip`, `/avatar`,`/helpmod`",
        }, 
        { name: ' ', value: ' ' },
        {
          name: "<a:coin_rain:1213455638152089630> Gambling Commands",
          value: "`/bet`, `/give`, `/balance`, `/leaderboard`, `/slots`, `/rps`",
        },
        { name: ' ', value: ' ' },
        {
          name: "💰 How to earn <:p_coins:1213423162138828921> ?",
          value: "Earn <:p_coins:1213423162138828921> by chatting and participating in events.",
        },
        { name: ' ', value: ' ' },
        // {
        //   name: "<a:ban:1213797183929978891> Moderation Commands",
        //   value: "`/timeout`, `/kick`, `/ban`, `/unban`",
        // },
        {
          name: "🔗 Need More Help?",
          value: "[Join our Guild](https://discord.gg/yAMXvQPtx3) for support.",
        }
      )
      .setFooter({
        text: "Created by zoro_mosshead",
      });

    await interaction.reply({
      embeds: [embed],
    });
  },
};
