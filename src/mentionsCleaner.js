/**
 * Autor: Cofiee
 * Wersja: 1.1
 * Modul odpowiedzialny za usuwanie wzmianek userow i rol z kanalu
 * @param {*} message 
 */
module.exports = async (message) => {
    const settings = require("../confs/settings.json");
    if(message.channel.name === settings.TagClearingChannelName &&
        message.author.bot === false &&
        message.type === "DEFAULT" &&
        (message.mentions.members.size > 0 || 
        message.mentions.roles.size > 0))
    {   
        //Regexe jedna lub wiecej spacji
        const re = / +/gm;
        let splittedArr = message.content.split(re);
        if(splittedArr.length === message.mentions.members.size + message.mentions.roles.size)
        {
            let interval = 100//1000 * 60 * 30; //milisec * sec * minutes
            await setTimeout(() => {
                message.delete().catch(error => {
                    if (error.code !== 10008) {
                        console.error('Failed to delete the message:', error);
                    }
                });
              }, interval); 
            return "Alfred deleted " + message.author.username + " mention at \"" + message.channel.name + "\""
            + "\n Members length: " + message.mentions.members.size + " Content length: " + splittedArr.length;
        }
    }
    return null;
}