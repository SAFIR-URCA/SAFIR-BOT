const CommandTable = require('./CommandTable');
const Error = require('../prepared_messages/Error');
const Config = require('../../config/config.json');
const Discord = require('discord.js');

class CommandReader {
    constructor() {
    }

    /**
    * This function analyses the passed message and calls the associated function if there is one.
    * @param {*} message - A command posted by an user.
    * @param {*} client - The bot user in case we have to make him do things
    */
    async handleMessage(message, client) {
        let prefix = CommandReader.getPrefix(message);

        if (prefix == Config.PREFIX) {
            console.log("Commande '" + message + "' effectuée par :" + message.author.username);

            try {
                launchCommand(message, client);
            }
            catch {
                console.log("Erreur lors de l'exécution de la commande");
            }
        }
    }

    /**
    * Sanitizes the string and return the command. The command should always be the 1st argument.
    * @param {*} message - The message to extract the command from.
    * @returns {String} - The command, extracted from the message.
    */
    static getCommand(message) {
        return CommandReader.getArgs(message).shift().toLowerCase();
    }

    /**
    * Sanitizes the string and return the args. The 1st argument is not an args.
    * @param {*} message - The message to extract the command from.
    * @returns {string} - args, extracted from the message.
    */
    static getArgs(message) {
        return message.content.slice(Config.PREFIX.length).trim().split(/ +/g);
    }
    
    /**
    * Get the prefix that the user just used to make the command
    * @param {*} message - The message to extract the command from.
    */
    static getPrefix(message) {
        return message.content.substr(0, Config.PREFIX.length);
    }
}

/*
    Fonction qui exécute la commande indiquée par l'utilisateur
*/
function launchCommand(message, client) {
    let error;

    let command = CommandReader.getCommand(message);

    let bot_channel_cmd = CommandTable.get("bot_channel");

    if (message.channel.type == "text") {

        /* Si le message se trouve dans un des channels de la catégorie du bot */
        if(client.channels.get(message.channel.parentID).id == Config.ID_CATEGORY_BOT) {
            
            /* Si la commande demandée existe */
            if(bot_channel_cmd.has(command)) {
                bot_channel_cmd.get(command)(message, client);
            }
            /* Si la commande demandée n'existe pas */
            else {
                error = new Discord.RichEmbed(Error.embedError)
                error.setDescription(error.description + "\n<@" + message.author.id + ">");
                message.channel.send(error)
                    .catch (console.error);
            }
        }
        /* Si le message ne se trouve pas dans la bonne catégorie du serveur */
        else {
            error = new Discord.RichEmbed(Error.embedCategoryErr)
            error.setDescription("<@" + message.author.id + ">");
            message.channel.send(error)
                .catch (console.error);
        }
    } 
    /* Si le message ne se trouve pas sur le serveur */
    else {
        error = new Discord.RichEmbed(Error.embedChannelTypeErr)
        error.setDescription("<@" + message.author.id + ">");
        message.channel.send(error)
            .catch (console.error);
    }
}

module.exports = CommandReader;