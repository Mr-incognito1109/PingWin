const Discord = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder } = Discord;
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./pcoins.db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bet")
    .setDescription("Bet your p_coins on heads or tails")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Choose heads or tails")
        .setRequired(true)
        .addChoices(
          { name: "Heads", value: "heads" },
          { name: "Tails", value: "tails" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of p_coins to bet")
        .setRequired(true)
    ),

  async execute(interaction) {
    const choice = interaction.options.getString("choice").toLowerCase();
    const betAmount = interaction.options.getInteger("amount");

    if (choice !== "heads" && choice !== "tails") {
      return interaction.reply({
        content: "Invalid choice. Please choose 'heads' or 'tails'.",
        ephemeral: true,
      });
    }

    if (betAmount <= 0) {
      return interaction.reply({
        content: "You must bet a positive amount of p_coins.",
        ephemeral: true,
      });
    }

    db.get(
      "SELECT balance FROM pcoins WHERE user_id = ?",
      [interaction.user.id],
      (err, row) => {
        if (err) {
          console.error("Error fetching balance:", err);
          interaction.reply({
            content: "Oops! Something went wrong.",
            ephemeral: true,
          });
        } else {
          const currentBalance = row ? row.balance : 0;

          if (betAmount > currentBalance) {
            interaction.reply({
              content: "You don't have enough p_coins for that bet!",
              ephemeral: true,
            });
          } else {
            const result = Math.random() < 0.5 ? "heads" : "tails";
            const headsImageURL =
              "https://cdn.discordapp.com/attachments/1210471574273269800/1210838902177529926/penguin_heads.png?ex=65ec049a&is=65d98f9a&hm=a6b254e125ea82c6aa48f9878823d61559abf0e35938a02a965d9109123db8d9&";
            const tailsImageURL =
              "https://cdn.discordapp.com/attachments/1210471574273269800/1210838922482032670/penguin_tails.png?ex=65ec049f&is=65d98f9f&hm=bbf7942c766f88ad235424e804852197ca1eb17020b829cacedd06bfc4a492be&";
            const newBalance =
              result === choice
                ? currentBalance + betAmount
                : currentBalance - betAmount;

            db.run(
              "UPDATE pcoins SET balance = ? WHERE user_id = ?",
              [newBalance, interaction.user.id],
              (err) => {
                if (err) {
                  console.error("Error updating balance:", err);
                  interaction.reply({
                    content: "Oops! Something went wrong.",
                    ephemeral: true,
                  });
                } else {
                  let message = `**${
                    result === choice ? "You Won! <:wow:1213442782698537020> " : "You lost! <:pepeEEEEEE_owo:1077159854931709952> "
                  } ${betAmount} <:p_coins:1213423162138828921>**`;

                  const embed = new EmbedBuilder()
                    .setDescription(message)
                    .setImage(
                      result === "heads" ? headsImageURL : tailsImageURL
                    );

                  interaction.reply({ embeds: [embed] });
                }
              }
            );
          }
        }
      }
    );
  },
};
