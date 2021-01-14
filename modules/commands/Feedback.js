const Discord = require('discord.js');
const Text = require('../text/fr.json');
const Config = require('../../config/config.json');
const Error = require('../prepared_messages/Error');

const feedbackCommand = async function(message, client) {

    let error;

    let args = message.content.split(' ').slice(1).join(" ");
    let attachment = message.attachments.first();

    /* S'il n'y a pas le texte de l'annonce dans le message */
    if (!args && !attachment) {
        error = new Discord.RichEmbed(Error.embedError)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
        .catch(console.error);
        return;
    }
    if(args){
        /* Ecriture dans le channel de feedback */
        client.channels.get(Config.ID_CHANNEL_FEEDBACK).send(args)
        .catch(console.error);
    }

    if(attachment){
        /* Ecriture dans le channel de feedback */
        client.channels.get(Config.ID_CHANNEL_FEEDBACK).send({file: attachment.url})
        .catch(console.error);
    }

    if (message.channel.type != "dm"){
        message.delete(100);
    }
    return;
}

module.exports.FeedbackCommand = feedbackCommand;
