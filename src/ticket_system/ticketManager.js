module.exports = function (discord, settings, client, channels) {
    this.Discord = discord;
    this.settings = settings;
    this.ticketCreator = require("./ticketCreator.json");
    this.channels = channels;

    this.prepareTicketSystem = async () => {
        const targetChannel = this.channels.find(channel => channel.name === this.settings.TicketChannelName);
        if(targetChannel.type === "text")
        {
            targetChannel.messages.fetch().then(messages => {
                targetChannel.bulkDelete(messages);
            }).catch(err => {
                console.log('Error while doing Bulk Delete');
                console.log(err);
            });
            let createTicketEmbeded = new this.Discord.MessageEmbed();
            createTicketEmbeded.setTitle(this.ticketCreator.title);
            createTicketEmbeded.setDescription(this.ticketCreator.description);
            createTicketEmbeded.setColor(this.ticketCreator.color);
            targetChannel.send(createTicketEmbeded).then(message => {
                message.react(this.ticketCreator.reaction).catch(err => {
                    console.log('Error reacting');
                    console.log(err);
                });
            });
        }
    }

    client.on("reaction", reaction => {
        if(reaction.channel.name === this.settings.TicketChannelName)
        {
            
        }
    });
}