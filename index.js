const dotenv = require('dotenv');
dotenv.config();
const Discord = require('discord.js'); // Main Discord.js package
const { Client, GatewayIntentBits } = Discord; 
const fs = require('node:fs');
const path = require('node:path');
const keepAlive = require('./keep_alive.js'); //For hosting through webservices


//declaring initial intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });
// const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENT] });


//Slash commands based
const eventsPath = path.join(__dirname , 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for(const file of eventFiles) {
    const filePath = path.join(eventsPath,file);
    const event = require(filePath);
    if(event.once){
        client.once(event.name, (...args)=> event.execute(...args));
    }else {
        client.on(event.name, (...args)=> event.execute(...args));
    }
}
client.login(process.env.TOKEN);

