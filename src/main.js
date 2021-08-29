/**
 * Autor: Cofiee
 * Wersja: 1.3
 * Zmienil: Cofiee
 */
const Discord = require("discord.js");
const auth = require("../confs/auth.json");
const settings = require("../confs/settings.json");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const channels = client.channels.cache;

const ticketManagerBuilder = require("./ticket_system/ticketManager.js");
const ticketManager = new ticketManagerBuilder(Discord, settings, client, channels);

const lonelyMentionsCleaner = require("./mentionsCleaner.js");

const hrManagerBuilder = require("./employment/hrManager.js");
const hrManager = new hrManagerBuilder(Discord, settings, client, channels);
/**
 * Przygotowywuje bota do dzialania przed zalogowaniem sie
 * Wczytuje komendy dynamicznie z folderu commands
 */
 (function ()
 {
     const fs = require('fs');
    
     const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'));
     for(const file of commandFiles)
     {
         const command = require(`./commands/${file}`);
         client.commands.set(command.name, command);
     }
 })();

/**
 * Zestaw procedur wykonywanych po zalogowaniu sie bota
 */
client.on("ready", () => {
    //ticketManager.prepareTicketSystem();
    hrManager.prepareHRchannel();
    console.log("I am ready!");
});

/**
 * funkcja logów bota na serwerze
 * @param {*} activity 
 */
function myServerLog(activity)
{
    let targetChannel = channels.find(channel => channel.name === settings.LogChannelName);
    let today = new Date();
    let date = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDay() + " " + today.getUTCHours() + ":" + today.getUTCMinutes() + ":" + today.getUTCSeconds() + " UTC - "
    targetChannel.send(date + activity);
}

/**
 * Reakcja na wiadomosci
 * Wykona jedna z ponizszych reakcji:
 * Usunie samotna wzmianke
 * Wykona komende
 */
client.on("message", (message) => {
    if(!message.content.startsWith(settings.CommandPrefix) || message.author.bot)
    {
        let result = lonelyMentionsCleaner(message);
        //if(result !== null) myServerLog(result);
        return;
    }
    const args = message.content.slice(settings.CommandPrefix.length).trim().split(/ +/);
    const commandName = args.shift();
    if(!client.commands.has(commandName)) return;
    try{
        client.commands.get(commandName).execute(message, args);
    }catch(err){
        console.error(err);
        message.reply("Error occured during executing command. Please contact with support.");
    }
});

/**
 * Logowanie bota
 */
client.login(auth.token);

