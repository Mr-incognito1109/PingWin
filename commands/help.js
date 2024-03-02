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
      .setDescription("__Bot help Menu")
      .setTimestamp()
      .addFields(
        {
          name: "📖 General slash commands",
          value: "- `/pinwing` replies with pongwin!\n- `/pinguser` ping a user in a specified channel.\n- `/hello` says hello\n- `/time` displays time\n- `/userinfo` gives user info\n- `/coinflip` flips a coin\n- `/avatar` displays avatar of user or another.",
        },
        {
          name: "<a:coin_rain:1213455638152089630> Gambling Commands",
          value: "- `/bet` bet your coins on head or tails\n- `/give` give your pcoins to others\n- `/balance` check your or others balnace\n- `/leaderboard` checks leaderboard of top 10 members",
        },
        {
          name : "How to earn <:p_coins:1213423162138828921> ?",
          value : "- type `owo` , any word contains owo or emoji in this cahnnel [get free coins](https://discord.com/channels/1076865708375425024/1165528231491948545)\n- ⚠ Dont use `/give` commands firstly register yourself here [get free coins](https://discord.com/channels/1076865708375425024/1165528231491948545) by typing owo then you can use the bot fully!! "
        },
        {
          name: "Need More help ?",
          value: "- Join our guild: [Zoro](https://discord.gg/yAMXvQPtx3)",
        }
      )

      .setFooter({
        text: "Created by zoro_mosshead ",
      });

    await interaction.reply({
      embeds: [embed],
    });
  },
};
