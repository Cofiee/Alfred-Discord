const Discord = require("discord.js");
const auth = require("../confs/auth.json");
const settings = require("../confs/settings.json");
const client = new Discord.Client();
const channels = client.channels.cache;

client.on("ready", () => {
    console.log("I am ready!");
});

client.on("message", (message) => {
    if(message.channel.name === "testybota" &&
        message.author.bot === false)
    {
        message.reply("I'm here to serve");
        myServerLog("Alfred replied on " + message.author.username + " message at " + message.channel.name)
    }
});

function myServerLog(activity)
{
    let targetChannel = channels.find(channel => channel.name === settings.LogChannelName);
    let today = new Date();
    let date = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDay() + " " + today.getUTCHours() + ":" + today.getUTCMinutes() + ":" + today.getUTCSeconds() + " UTC - "
    targetChannel.send(date + activity);
}
client.login(auth.token);