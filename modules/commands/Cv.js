const Error = require('../prepared_messages/Error');
const User = require('../classes/User');
const Fs = require("fs");
const Path = require("path");
const Discord = require('discord.js');
const Text = require('../text/fr.json');

const cvCommand = async function(message, client) {

    let error;

    /* Si la commande n'a pas le bon nombre d'arguments */
    let args = message.content.split(' ').slice(1);
    if(args.length != 1) {
        error = new Discord.RichEmbed(Error.embedError)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    /* Si l'utilisateur souhaite faire un changement concernant son CV */
    let current_user = null;
    if(args[0] == "add" || args[0] == "modify" || args[0] == "delete") {
        current_user = await User.get_user_by_id(message.author.id);
    
        /* Si l'utilisateur n'est pas vérifié */
        if(current_user && current_user.dataValues.is_verif == false) {
            error = new Discord.RichEmbed(Error.embedUnverifiedUserErr)
            error.setDescription(error.description + "\n<@" + message.author.id + ">");
            message.channel.send(error)
                .catch(console.error);
            return ;
        }

        /* Si l'utilisateur n'existe pas dans la DB */
        else if(!current_user) {
            error = new Discord.RichEmbed(Error.embedInexistantUserErr)
            error.setDescription(error.description + "\n<@" + message.author.id + ">");
            message.channel.send(error)
                .catch(console.error);
            return ;
        }
    }

    switch(args[0]) {

        case "add" :

            /* Si l'utilisateur a déjà enregistré un CV */
            if (current_user.dataValues.cv_path != null) {
                error = new Discord.RichEmbed(Error.embedCVExistErr)
                error.setDescription("<@" + message.author.id + ">");
                message.channel.send(error)
                    .catch(console.error);
                return ;
            }

            let is_add = current_user.change_cv(message, false);
            if (!is_add) return;

            /* MaJ de l'utilisateur dans la DB */
            User.update( 
                {
                    cv_path : "CV_" + message.author.id + ".pdf"
                },
                {
                    where : {
                        id_user : message.author.id
                    }
                }
            );

            /* Message de confirmation */
            let cv_confirm = new Discord.RichEmbed()
                .setTitle(Text.commands.cv.add_valid)
                .setColor('BLUE')
                .setDescription("<@" + message.author.id + ">");

            message.channel.send(cv_confirm)
                .catch(console.error);

            break;

        case "modify" :

            /* Si l'utilisateur n'a pas enregistré de CV */
            if (current_user.dataValues.cv_path == null) {
                error = new Discord.RichEmbed(Error.embedNoCVErr)
                error.setDescription("<@" + message.author.id + ">");
                message.channel.send(error)
                    .catch(console.error);
                return ;
            }

            let is_changed = current_user.change_cv(message, true);
            if (!is_changed) return;

            /* Message de confirmation */
            let modif_confirm = new Discord.RichEmbed()
                .setTitle(Text.commands.cv.modify_valid)
                .setColor('BLUE')
                .setDescription("<@" + message.author.id + ">");

            message.channel.send(modif_confirm)
                .catch(console.error);

            break;

        case "delete" :

            /* Si l'utilisateur n'a pas enregistré de CV */
            if (current_user.dataValues.cv_path == null) {
                error = new Discord.RichEmbed(Error.embedNoCVErr)
                error.setDescription("<@" + message.author.id + ">");
                message.channel.send(error)
                    .catch(console.error);
                return ;
            }
            
            /* Suppression du fichier */
            Fs.unlinkSync( Path.join("CV", current_user.dataValues.cv_path) );

            /* MaJ de l'utilisateur dans la DB */
            User.update( 
                {
                    cv_path : null
                },
                {
                    where : {
                        id_user : message.author.id
                    }
                }
            );

            /* Message de confirmation */
            let del_confirm = new Discord.RichEmbed()
                .setTitle(Text.commands.cv.delete_valid)
                .setColor('BLUE')
                .setDescription("<@" + message.author.id + ">");

            message.channel.send(del_confirm)
                .catch(console.error);

            break;

        default :
            let cv_path = await User.get_cv_by_mention(message);

            /* Si on a pu récupérer le chemin du CV de l'utilisateur mentionné */
            if(cv_path != "") {
                const cv_msg = new Discord.RichEmbed()
                    .setColor('BLUE')
                    .setTitle(Text.commands.cv.get_cv)
                    .attachFiles([ cv_path ])
                    .setDescription("<@" + message.author.id + ">");

                message.channel.send(cv_msg)
                    .catch(console.error);
            }

            break;
    }

    return ;
}

module.exports.CvCommand = cvCommand;