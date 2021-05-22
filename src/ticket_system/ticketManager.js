/**
 * Autor: Cofiee
 * Wersja: 1.0
 * Modul odpowiedzialny za dzialanie systemu ticketowego
 * @param {*} discord 
 * @param {*} settings 
 * @param {*} client 
 * @param {*} channels 
 */
module.exports = function(discord, settings, client, channels) {
    this.Discord = discord;
    this.settings = settings;
    this.ticketCreator = require("./ticketCreator.json");
    this.ticketSettings = require("./ticketSettings.json");
    this.channels = channels;

    this.ticketCreationMessage = null;
    this.ticketList = [];
    this.ticketCollectorList = [];

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
                this.ticketCreationMessage = message;
                message.react(this.ticketCreator.reaction)
                .catch(err => {
                    console.log('Error reacting');
                    console.log(err);
                });
            });
        }
    }

    /**
     * Listener reaguje na reakcje na wiadomosci this.ticketCreationMessage
     * Tworzy kanal tekstowy sluzaczy do obslugi zgloszenia
     * TODO: PRZEROBIC NA COLLECTOR REAKCJI
     */
    client.on('reaction', (reaction) => {
        if(this.ticketCreationMessage === null) return;
        if(reaction.message !== this.ticketCreationMessage) return;
        if(reaction !== this.ticketCreator.reaction)
        {
            reaction.message.reactions.cache.get(reaction).remove()
            .catch(error => console.error('Failed to clear reactions'));
        }
        const everyoneRole = client.guilds.get('SERVER ID').roles.find('name', '@everyone');
        const author = reaction.author;
        reaction.message.guild.createChannel(author.username, 'text')
            .then(c => {
                c.overwritePermissions(author.id, {VIEW_CHANNEL: true});
                c.overwritePermissions(client.id, {VIEW_CHANNEL: true});
                //TODO: ROLA MANAGERA
                c.overwritePermissions(everyoneRole, {VIEW_CHANNEL: false});
                let createTicketEmbeded = new this.Discord.MessageEmbed();
                createTicketEmbeded.setTitle("PLACEHOLDER TITLE");
                createTicketEmbeded.setDescription(this.ticketSettings.welcome_message);
                c.send(createTicketEmbeded).then(message => {
                    this.ticketList.push(message);
                    message.react(this.ticketSettings.closing_reaction)
                    .catch(err => {
                        console.log("Error while reacting ticket")
                        console.log(err);
                    });
                    
                    this.ticketCollectorList.push(collector);

                });
            })
            .catch(error => console.error('Failed to create ticket channel'));  
    });

    this.ticketReactionsCollectorCreator = (message) => {
        const collectorFilter = (reaction, user) => reaction.emoji.name === this.ticketSettings.closing_reaction;
        let collector = message.createReactionCollector(collectorFilter, {time: 15000});
        collector.on('collect', (reaction, user) => {
            if(reaction !== this.ticketSettings.closing_reaction)
            {
                reaction.message.reactions.cache.get(reaction).remove()
                .catch(error => console.error('Failed to clear reactions'));
                return;
            }
            //TODO: USUWANIE KANALU !!!!! KRYTYCZNE
        });
    }


}
