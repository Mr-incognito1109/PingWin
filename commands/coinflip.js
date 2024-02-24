const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = Discord;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flips a coin!"),

  async execute(interaction) {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    const headsImageURL =
      "https://cdn.discordapp.com/attachments/1210471574273269800/1210838902177529926/penguin_heads.png?ex=65ec049a&is=65d98f9a&hm=a6b254e125ea82c6aa48f9878823d61559abf0e35938a02a965d9109123db8d9&";
    const tailsImageURL =
      "https://cdn.discordapp.com/attachments/1210471574273269800/1210838922482032670/penguin_tails.png?ex=65ec049f&is=65d98f9f&hm=bbf7942c766f88ad235424e804852197ca1eb17020b829cacedd06bfc4a492be&"; 

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setColor("90EE90")
      .setDescription(`The coin landed on **${result}!**`)
      .setImage(result === "Heads" ? headsImageURL : tailsImageURL);

    await interaction.reply({ embeds: [embed] });
  },
};
