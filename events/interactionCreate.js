const {Client,Collection, GatewayIntentBits}  = require('discord.js')
const fs = require('fs');
const client  = new Client({intents : [GatewayIntentBits.Guilds]});

client.commands = getCommands('./commands');
module.exports = {
    name : 'interactionCreate',
    async execute(interaction){
        if (!interaction.isChatInputCommand()) return;

    let command = client.commands.get(interaction.commandName);

    try{
        if(interaction.replied)return;
        command.execute(interaction);
    }catch(error){
        console.error(error);
    }

    // for log.txt file
    const logMessage = `[${new Date().toLocaleString()}] ${interaction.user.username}#${interaction.user.discriminator} used command /${interaction.commandName} ${interaction.options.data.map(option => `(${option.name}: ${option.value})`).join(' ')}\n`;
    fs.appendFile('log.txt', logMessage, err => {
        if (err) console.error('Error writing to log file:', err);
    });


    }
}

function getCommands(dir){
    let commands = new Collection();
    const commandFiles = getFiles(dir);

    for(const commandFile of commandFiles) {
        let command = require("."+commandFile);
        commands.set(command.data.toJSON().name,command)
    }
    return commands;
}


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