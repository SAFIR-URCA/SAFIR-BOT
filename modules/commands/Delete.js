const User = require('../classes/User');
const Error = require('../prepared_messages/Error');
const Text = require('../text/fr.json');
const Discord = require('discord.js');

/* Liste des utilisateurs qui doivent répondre au message de confirmation */
let in_deleting_list = [];

const deleteCommand = async function(message, client) {

    let error;

    /* L'utilisateur actuel est en cours de confirmation de la suppression */
    if (in_deleting_list.includes(message.author.id)) {
        error = new Discord.RichEmbed(Error.embedInDeletingAccountErr)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    /* Si la commande n'a pas le bon nombre d'arguments */
    let args = message.content.split(' ').slice(1);
    if (args.length != 0) {
        error = new Discord.RichEmbed(Error.embedError)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    let user = await User.get_user_by_id(message.author.id);

    /* Si l'utilisateur n'existe pas */
    if(!user) {
        error = new Discord.RichEmbed(Error.embedInexistantUserErr)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    /* Message de confirmation */
    let delete_confirm = new Discord.RichEmbed()
        .setColor('BLUE')
        .setTitle(Text.commands.delete.confirming)
        .setDescription("<@" + message.author.id + ">");

    message.channel.send(delete_confirm)
        .then(async function(message_bot) {
            
            try {
                in_deleting_list.push(message.author.id);

                /* Place les réactions sur le message */
                await message_bot.react("\✅")
                    .catch(console.error);
                await message_bot.react("\❌")
                    .catch(console.error);

                const filter = (reaction, user_react) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user_react.id === message.author.id;
                };

                message_bot.awaitReactions(filter, { max: 1 })
                    .then(collected => {

                        in_deleting_list.splice(in_deleting_list.indexOf(message.author.id), 1);

                        let reaction = collected.first() ;

                        if (reaction.emoji.name === '✅') {
                            user.delete_user(client, true);

                            /* Message de confirmation */
                            let message_destroy = new Discord.RichEmbed()
                                .setColor('BLUE')
                                .setTitle(Text.commands.delete.confirmed)                              
                                .setDescription("<@" + message.author.id + ">");

                            message.channel.send(message_destroy)
                                .catch(console.error);
                        }
                        else if (reaction.emoji.name === '❌') {
                            let message_cancel = new Discord.RichEmbed()
                                .setColor('BLUE')
                                .setTitle(Text.commands.delete.canceled)                              
                                .setDescription("<@" + message.author.id + ">");

                            message.channel.send(message_cancel)
                                .catch(console.error);
                        }
                    })
                    .catch(console.error);
            }
            catch(error) {
                console.error(error);
            }
        })
        .catch(console.error);

    return ;
}

module.exports.DeleteCommand = deleteCommand;