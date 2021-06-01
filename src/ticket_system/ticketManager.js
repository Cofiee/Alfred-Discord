const { User } = require("discord.js");

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

    /**
     * 
     */
    this.prepareTicketSystem = async () => {
        const targetChannel = this.channels.find(channel => channel.name === this.settings.TicketChannelName);
        if(targetChannel.type !== "text") return;
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
        /*
        const filter = (reaction, user) => {
            return reaction.emoji.name === "📩";
        };
        this.ticketCreationMessage.awaitReactions(filter)
        */
    }


    /**
     * Listener reaguje na reakcje na wiadomosci this.ticketCreationMessage
     * Tworzy kanal tekstowy sluzaczy do obslugi zgloszenia
     * TODO: PRZEROBIC NA COLLECTOR REAKCJI
     */
    /*
    client.on('messageReactionAdd', (reaction, user) => {
        if(reaction.me === true) 
            return;
        if(this.ticketCreationMessage === null) 
            return;
        if(reaction.message !== this.ticketCreationMessage) 
            return;
        if(reaction.emoji.name !== this.ticketCreator.reaction)
        {
            reaction.remove().catch(error => console.error('Failed to clear reactions'));
            return;
        }
        const guild = reaction.message.guild;
        const everyoneRole = guild.roles.everyone;
        guild.channels.create(user.username, 'text')
            .then(c => {
                c.setParent(this.ticketCreator.ticket_system_cat_id);
                c.overwritePermissions(user.id, {VIEW_CHANNEL: true});
                c.overwritePermissions(client.id, {VIEW_CHANNEL: true});
                c.overwritePermissions(this.ticketSettings.responsible_role_id, {VIEW_CHANNEL: true}); //Czlonek zarzadu
                c.overwritePermissions(everyoneRole, {VIEW_CHANNEL: false});
                let createTicketEmbeded = new this.Discord.MessageEmbed();
                createTicketEmbeded.setTitle("PLACEHOLDER TITLE");
                createTicketEmbeded.setDescription(this.ticketSettings.welcome_message);
                c.send(createTicketEmbeded).then(message => {
                    this.ticketList.push(message);
                    message.react(this.ticketSettings.closing_reaction)
                    .catch(err => {
                        console.log("Error while reacting ticket");
                        console.log(err);
                    });
                    //const collector = this.ticketReactionsCollectorCreator(message);
                    //this.ticketCollectorList.push(collector);

                });
            })
            .catch(err => {
                console.error('Failed to create ticket channel');
                console.error(err);
            });
        reaction.remove().catch(err => console.error('Failed to clear reactions'));
    });
    */


    /*
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
        return collector;
    }
    */
}
