const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = Discord;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("time")
    .setDescription("Shows time information!"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("White")
      .setTitle("Time")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp()
      .setThumbnail('https://cdn.discordapp.com/attachments/1210471574273269800/1210472281537511505/3d-alarm.png?ex=65eaaf29&is=65d83a29&hm=cf09669c69841167db8304e01d384ecbe54abf2480f041367ee4130e44ddf52e&')
      .addFields(
        {
          name: "🌎 Your Time",
          value: `<t:${Math.floor(new Date().getTime() / 1000.0)}:F>`,
        }
        // ... more time zones
      )
      .setFooter({
        text: "Did you know? The concept of daylight saving time was first proposed by Benjamin Franklin!",
      });

    await interaction.reply({ embeds: [embed] });
  },
};

//interaction.reply(`<t:${Math.floor(new Date().getTime() / 1000.0)}:F>`);
