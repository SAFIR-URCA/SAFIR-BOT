const Verification_Code = require('../classes/Verification_Code');
const User = require('../classes/User');
const Error = require('../prepared_messages/Error');
const Config = require('../../config/config.json');
const Discord = require('discord.js');
const Text = require('../text/fr.json');
const Sequelize = require('sequelize');

const verifyCommand = async function(message, client) {

    let error;

    /* Si la commande n'a pas le bon nombre d'arguments */
    let args = message.content.split(' ').slice(1);
    if (args.length != 1) {
        error = new Discord.RichEmbed(Error.embedError)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    let current_user = await User.get_user_by_id(message.author.id);

    /* Si l'utilisateur est déjà vérifié */
    if(current_user && current_user.dataValues.is_verif == true) {
        error = new Discord.RichEmbed(Error.embedUserAlreadyVerifiedErr)
        error.setDescription("<@" + message.author.id + ">");
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

    let code_user = await Verification_Code.getVerification_CodeById(current_user.dataValues.id_verif_code);

    if(args[0] === code_user.dataValues.code) {

        /* Supprime les autres entrées de la DB avec la même adresse mail */
        User.destroy({
            where : {
                mail : current_user.dataValues.mail,
                id_user : {
                    [Sequelize.Op.ne] : message.author.id
                }
            }
        });

        /* Attribue et enlève si nécessaire les rôles "Etudiant" et "Professeur" */
        let role = "";
        if(current_user.dataValues.mail.split("@")[1] === "etudiant.univ-reims.fr") {
            role += "Etudiant";
        
            if(!client.guilds.get(Config.ID_SERVER).members.get(message.author.id).roles.find(r => r.id === Config.ID_ROLE_STUDENT)) {
                client.guilds.get(Config.ID_SERVER).members.get(message.author.id).addRole(Config.ID_ROLE_STUDENT);
            }
            
            if(client.guilds.get(Config.ID_SERVER).members.get(message.author.id).roles.find(r => r.id === Config.ID_ROLE_TEACHER)) {
                client.guilds.get(Config.ID_SERVER).members.get(message.author.id).removeRole(Config.ID_ROLE_TEACHER);
            }
        }
        else {
            role += "Professeur";
            
            if(client.guilds.get(Config.ID_SERVER).members.get(message.author.id).roles.find(r => r.id === Config.ID_ROLE_STUDENT)) {
                client.guilds.get(Config.ID_SERVER).members.get(message.author.id).removeRole(Config.ID_ROLE_STUDENT);
            }
            
            if(!client.guilds.get(Config.ID_SERVER).members.get(message.author.id).roles.find(r => r.id === Config.ID_ROLE_TEACHER)) {
                client.guilds.get(Config.ID_SERVER).members.get(message.author.id).addRole(Config.ID_ROLE_TEACHER);
            }
        }

        let validation = new Discord.RichEmbed()
            .setTitle(Text.commands.verify.title_valid)
            .setDescription(Text.commands.verify.descrip_valid + "\n<@" + message.author.id + ">")
            .setColor('BLUE');

        message.channel.send(validation)
            .catch(console.error);

        /* MaJ de l'utilisateur dans la DB */
        User.update( 
            {
                role : role,
                is_verif : true
            },
            {
                where : {
                    id_user : message.author.id
                }
            }
        );
    }
    /* Le code est incorrect */
    else {
        error = new Discord.RichEmbed(Error.embedIncorrectCodeErr)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);   
    }
}

module.exports.VerifyCommand = verifyCommand;