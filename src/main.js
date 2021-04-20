const Discord = require("discord.js");
const auth = require("../confs/auth.json");
const settings = require("../confs/settings.json");
const ticketCreator = require("./ticket_system/ticketCreator.json");
const client = new Discord.Client();
const channels = client.channels.cache;

client.on("ready", () => {
    prepareTicketSystem();
    console.log("I am ready!");
});

function myServerLog(activity)
{
    let targetChannel = channels.find(channel => channel.name === settings.LogChannelName);
    let today = new Date();
    let date = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDay() + " " + today.getUTCHours() + ":" + today.getUTCMinutes() + ":" + today.getUTCSeconds() + " UTC - "
    targetChannel.send(date + activity);
}

client.on("message", async (message) => {
    if(message.channel.name === "testybota" &&
        message.author.bot === false &&
        message.type === "DEFAULT" &&
        message.mentions.members.size > 0)
    {
        await setTimeout(() => {
            message.delete();
          }, 5000);
        myServerLog("Alfred deleted " + message.author.username + " mention at \"" + message.channel.name + "\"");
    }
});

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