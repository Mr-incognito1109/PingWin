import 'dotenv/config';
import { Client, Events, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

const keep_Alive = require('./keep_alive.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Slash commands
    const pingwin = new SlashCommandBuilder()
        .setName("pingwin")
        .setDescription("Replies with Pongwin!");

    const time = new SlashCommandBuilder()
        .setName("time")
        .setDescription("Shows Actual Time !");

    const hello = new SlashCommandBuilder()
        .setName("hello")
        .setDescription("Greets the user !")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Says hello to a user")
                .setRequired(false)
        );

    const pinguser = new SlashCommandBuilder()
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
        );

    // Register commands
    client.application.commands.create(hello);
    client.application.commands.create(pingwin);
    client.application.commands.create(time);
    client.application.commands.create(pinguser);
});

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) return;

    const logMessage = `[${new Date().toLocaleString()}] ${interaction.user.username}#${interaction.user.discriminator} used command /${interaction.commandName} ${interaction.options.data.map(option => `(${option.name}: ${option.value})`).join(' ')}\n`;
    fs.appendFile('log.txt', logMessage, err => {
        if (err) console.error('Error writing to log file:', err);
    });

    if (interaction.commandName === "pingwin") {
        interaction.reply(`Pongwin!!🏓`);
    }

    if (interaction.commandName === "hello") {
        const user = interaction.options.getUser("user") || interaction.user;
        interaction.reply(`Hello there ${user.username}!!`);
    }

    if (interaction.commandName === "time") {
        interaction.reply(`<t:${Math.floor(new Date().getTime() / 1000.0)}:F>`);
    }

    if (interaction.commandName === "pinguser") {
      const targetUser = interaction.options.getUser("target");
      const targetChannel = interaction.options.getChannel("channel");
      const customMessage = interaction.options.getString("message");

      targetChannel.send(`${targetUser}! ${customMessage}`);
      interaction.reply('Message sent!');
  }
});

client.login(process.env.TOKEN); 



// https://discord.com/api/oauth2/authorize?client_id=1209347452268711976&permissions=8&scope=applications.commands+bot
