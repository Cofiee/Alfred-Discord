const Discord = require("discord.js");
const auth = require("../confs/auth.json");
const settings = require("../confs/settings.json");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const channels = client.channels.cache;

const ticketManagerBuilder = require("./ticket_system/ticketManager.js");
const ticketManager = new ticketManagerBuilder(Discord, settings, client, channels);

/**
 * Przygotowywuje bota do dzialania przed zalogowaniem sie
 * Wczytuje komendy dynamicznie z folderu commands
 */
 (function ()
 {
     const fs = require('fs');
     const commandFiles = fs.readFileSync('./commands').filter(file => file.endsWith('.js'));
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
    ticketManager.prepareTicketSystem();
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
 * Czyszczenie samych wzmianek ludzi lub rol z kamalu
 */
client.on("message", async (message) => {
    if(message.channel.name === settings.TagClearingChannelName &&
        message.author.bot === false &&
        message.type === "DEFAULT" &&
        (message.mentions.members.size > 0 || 
        message.mentions.roles.size > 0))
    {   
        //Regexe jedna lub wiecej spacji
        const re = / +/gm;
        let interval = 1000 * 60 * 30; //milisec * sec * minutes
        let splittedArr = message.content.split(re);
        if(splittedArr.length === message.mentions.members.size)
        {
            await setTimeout(() => {
                message.delete().catch(error => {
                    if (error.code !== 10008) {
                        console.error('Failed to delete the message:', error);
                    }
                });
              }, interval); 
            myServerLog("Alfred deleted " + message.author.username + " mention at \"" + message.channel.name + "\""
            + "\n Members length: " + message.mentions.members.size + " Content length: " + splittedArr.length);
        }
    }

    client.on("reaction", reaction => {
        if(reaction.channel.name === settings.LogChannelName)
        {
            
        }
    });
});

/**
 * Logowanie bota
 */
client.login(auth.token);

