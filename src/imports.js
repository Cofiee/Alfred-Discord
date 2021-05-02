module.exports = function() {
    const Discord = require("discord.js");
    const auth = require("../confs/auth.json");
    const settings = require("../confs/settings.json");
    const ticketCreator = require("./ticket_system/ticketCreator.json");
    const client = new Discord.Client();
    const channels = client.channels.cache;
}