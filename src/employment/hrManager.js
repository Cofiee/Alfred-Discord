module.exports = function(discord, settings, client, channels) {
    this.Discord = discord;
    this.settings = settings;
    this.channels = channels;
    this.hrSettings = require("./hrSettings.json");
    this.hrMessage = null;

    this.prepareHRchannel = async () => {
        const targetChannel = this.channels.find(channel => channel.name === this.hrSettings.channelName);
        if(targetChannel.type !== "text") return;
        targetChannel.messages.fetch().then(messages => {
           targetChannel.bulkDelete(messages);
        }).catch(err => {
            console.log('Error while doing Bulk Delete');
            console.log(err);
        });
        let createTicketEmbeded = new this.Discord.MessageEmbed();
        createTicketEmbeded.setTitle(this.hrSettings.title);
        createTicketEmbeded.setDescription(this.hrSettings.description);
        createTicketEmbeded.setColor(this.hrSettings.color);
        targetChannel.send(createTicketEmbeded).then(message => {
            this.hrMessage = message;
            message.react(this.hrSettings.reaction)
            .catch(err => {
                console.log('Error reacting');
                console.log(err);
            });
        });
    };

    client.on('messageReactionAdd', (reaction, user) => {
        if(reaction.me === true) 
            return;
        if(this.hrMessage === null) 
            return;
        if(reaction.message !== this.hrMessage) 
            return;
        reaction.remove()
        .then(() => {
            this.hrMessage.react(this.hrSettings.reaction)
            .catch(err => {
                console.log('Error reacting');
                console.log(err);
            });
        })
        .catch(error => console.error('Failed to clear reactions'));
        /*
        if(reaction.emoji.name != this.hrMessage.reaction)
        {
            return;
        }
        */
        const guild = reaction.message.guild;
        const member = guild.members.cache.get(user.id);
        if (!member.roles.cache.get(this.hrSettings["role-id"])) {
            let role = guild.roles.cache.find(r => r.id === this.hrSettings["role-id"]);
            member.roles.add(role);
        }
    });
}