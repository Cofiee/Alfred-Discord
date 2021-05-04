const Discord = require("discord.js");
const auth = require("../confs/auth.json");
const settings = require("../confs/settings.json");
const client = new Discord.Client();
const channels = client.channels.cache;

const ticketManagerBuilder = require("./ticket_system/ticketManager.js");
const ticketManager = new ticketManagerBuilder(Discord, settings, client, channels);

client.on("ready", () => {
    ticketManager.prepareTicketSystem();
    console.log("I am ready!");
});

function myServerLog(activity)
{
    let targetChannel = conf.channels.find(channel => channel.name === settings.LogChannelName);
    let today = new Date();
    let date = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDay() + " " + today.getUTCHours() + ":" + today.getUTCMinutes() + ":" + today.getUTCSeconds() + " UTC - "
    targetChannel.send(date + activity);
}

client.on("message", async (message) => {
    if(message.channel.name === settings.TagClearingChannelName &&
        message.author.bot === false &&
        message.type === "DEFAULT" &&
        message.mentions.members.size > 0)
    {   
        //Regexe jedna lub wiecej spacji
        const re = / +/gm;
        let interval = 1000 * 60 * 20;//*/ //milisec * sec * minutes
        let splittedArr = message.content.split(re);   //TODO dodac obietnice bo sie wyjebie node.js
        //console.log(message.mentions.members.size);
        //console.log(splittedArr.length);
        if(splittedArr.length === message.mentions.members.size)
        {
            await setTimeout(() => {
                message.delete();
              }, interval); 
            myServerLog("Alfred deleted " + message.author.username + " mention at \"" + message.channel.name + "\""
            + "\n Members length: " + message.mentions.members.size + " Content length: " + splittedArr.length);
            // ^ wywala sie bo obietnica
        }
    }

    client.on("reaction", reaction => {
        if(reaction.channel.name === settings.LogChannelName)
        {
            
        }
    });
});


/*
var prepareTicketSystem = async () => {
    const targetChannel = channels.find(channel => channel.name === settings.TicketChannelName);
    if(targetChannel.type === "text")
    {
        targetChannel.messages.fetch().then(messages => {
            targetChannel.bulkDelete(messages);
        }).catch(err => {
            console.log('Error while doing Bulk Delete');
            console.log(err);
        });
        let createTicketEmbeded = new Discord.MessageEmbed();
        createTicketEmbeded.setTitle(ticketCreator.title);
        createTicketEmbeded.setDescription(ticketCreator.description);
        createTicketEmbeded.setColor(ticketCreator.color);
        targetChannel.send(createTicketEmbeded).then(message => {
            message.react(ticketCreator.reaction).catch(err => {
                console.log('Error reacting');
                console.log(err);
            });
        });
    }
}
//*/
//TODO: dokonczyc implementacje tworzenia ticketu na reakcje
/*
client.on("messageReactionAdd", async (reaction) => {
    let targetChannel = reaction.message.channel;
    if(targetChannel.name === settings.TicketChannelName && reaction.users)
    {
        
    }
});
*/
client.login(auth.token);