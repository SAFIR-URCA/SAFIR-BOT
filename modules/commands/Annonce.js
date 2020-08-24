const Discord = require('discord.js');
const Text = require('../text/fr.json');
const Config = require('../../config/config.json');
const Error = require('../prepared_messages/Error');

const annonceCommand = async function(message, client) {

    let error;

    /* Si l'utilisateur n'a pas les permissions requises */
    if (!message.member.hasPermission('MANAGE_NICKNAMES')) {
        error = new Discord.RichEmbed(Error.embedPermErr)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    let args = message.content.split(' ').slice(1).join(" ");

    /* S'il n'y a pas le texte de l'annonce dans le message */
    if (!args) {
        error = new Discord.RichEmbed(Error.embedError)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return;
    }

    /* Ecriture dans le channel d'annonce et de logs */
    client.channels.get(Config.ID_CHANNEL_ANNONCE).send(args)
        .catch(console.error);

    let annonce_log = new Discord.RichEmbed()
        .setAuthor(Text.commands.annonce.add)
        .setColor('BLUE')
        .setDescription(Text.commands.annonce.author + message.author + "\n" + Text.commands.annonce.summary + args);
        
    client.channels.get(Config.ID_CHANNEL_LOG).send(annonce_log)
        .catch(console.error);

    return ;
}

module.exports.AnnonceCommand = annonceCommand;