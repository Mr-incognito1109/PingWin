const fs = require('fs');
const path = require('path');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;


function getFiles(dir){
    const files = fs.readdirSync(dir,{
        withFileTypes: true
    });
    let commandFiles = [];

    for(const file of files) {
        if(file.isDirectory()){
            commandFiles = [
                ...commandFiles,
                ...getFiles(`${dir}/${file.name}`),
            ]
        }else if (file.name.endsWith(".js")){
            commandFiles.push(`${dir}/${file.name}`);
        }
    }
    return commandFiles;
}

let commands = [];
const commandFiles = getFiles('./commands');

for(const file of commandFiles) {
    const command = require(file);
    commands.push(command.data.toJSON());
}

const rest = new REST ({version : '10'}).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId,guildId),{body : commands}) //use "Routes.applicationCommand" for Globally registring your Slashcommands (ALL the servers instead of only a server)
    .then(()=> console.log('Successfully registered application commands !'))
    .catch(console.error);
