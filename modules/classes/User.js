const {DataTypes, Model} = require('sequelize');
const Error = require('../prepared_messages/Error');
const Fs = require("fs");
const Path = require("path");
const Text = require('../text/fr.json');
const Https = require("https");
const Verification_Code = require('../classes/Verification_Code');
const Discord = require('discord.js');
const Mail = require('../connexion/Mail');
const Config = require('../../config/config.json');
const MailMessages = require('../prepared_messages/MailMessages');

/*
    Classe représentant un utilisateur dans la base de données
*/
class User extends Model {
    
    /* 
        Méthode qui initialise la table "User" dans la base de données 
    */
    static init(sequelize) {
        return super.init( {
            id_user : {
                type : DataTypes.STRING(64),
                primaryKey : true
            },
            first_name : { type : DataTypes.STRING(64) },
            last_name : { type : DataTypes.STRING(64) },
            mail : { type : DataTypes.STRING(64) },
            role : { type : DataTypes.STRING(32) },
            cv_path : { type : DataTypes.STRING(64) },
            is_verif : { type : DataTypes.BOOLEAN }
        }, {
            tableName : "User",
            timestamps : false,
            sequelize
        });
    }

    /*
        Méthode pour récupérer un utilisateur avec son identifiant Discord
    */
    static async get_user_by_id(id) {
        let user = await User.findOne({
            where : {
                id_user : id
            }
        })
            .catch(error => console.log(error));

        return user;
    }

    /*
        Méthode pour récupérer un utilisateur vérifié avec l'adresse mail qu'il a fourni
    */
    static async get_verified_user_by_mail(mail_user) {
        let user = await User.findOne({
            where : {
                mail : mail_user,
                is_verif : true
            }
        })
            .catch(error => console.log(error));

        return user;
    }

    /* 
        Vérifie si l'adresse mail indiquée est correct et correspond au format de celles de l'URCA
        Si non, on envoie les messages d'erreurs à l'utilisateur
    */
    static check_mail_address(address, message) {

        let error;

        let mail_valide = true;

        /* Vérifie si c'est une adresse mail */
        let tab_address = address.split("@");
        if(tab_address.length != 2) {
            error = new Discord.RichEmbed(Error.embedNotMailErr)
            error.setDescription("<@" + message.author.id + ">");
            message.channel.send(error)
                .catch(console.error);
            mail_valide = false;
        }

        /* Vérifie le domaine de l'adresse mail */
        if (tab_address[1] != "etudiant.univ-reims.fr" && tab_address[1] != "univ-reims.fr") {
            error = new Discord.RichEmbed(Error.embedDomainMailUrcaErr)
            error.setDescription(error.description + "\n<@" + message.author.id + ">");
            message.channel.send(error)
                .catch(console.error);  
            mail_valide = false;
        }               

        let name = tab_address[0].split(".");
        let regex_first_name = /^[a-z]+([-]+[a-z]+)*$/gi;
        let regex_last_name = /^[a-z]+([-]+[a-z]+)*[0-9]*$/gi;

        /* Vérifie si la 1ère partie de l'adresse mail correspond au format */
        if(name.length != 2 || !(regex_first_name).test(name[0]) || !(regex_last_name).test(name[1]) ) {
            error = new Discord.RichEmbed(Error.embedNameMailUrcaErr)
            error.setDescription(error.description + "\n<@" + message.author.id + ">");
            message.channel.send(error)
                .catch(console.error);  
            mail_valide = false;
        }

        return mail_valide;
    }

    /*
        Supprime l'utilisateur et tout ce qui le concerne 
    */
    async delete_user(client, in_db) {
        /* Suppression du CV */
        if (this.dataValues.cv_path != null) {
            Fs.unlinkSync(Path.join("CV", this.dataValues.cv_path));
        }

        /* Suppression du rôle */
        if (this.dataValues.role == "Etudiant") {
            client.guilds.get(Config.ID_SERVER).members.get(this.dataValues.id_user).removeRole(Config.ID_ROLE_STUDENT);
        }
        else if (this.dataValues.role == "Professeur") {
            client.guilds.get(Config.ID_SERVER).members.get(this.dataValues.id_user).removeRole(Config.ID_ROLE_TEACHER);
        }

        /* Suppression dans la base de données */
        if (in_db) {
            await this.destroy();
        }
    }

    /*
        Change le CV d'un utilisateur (Ajout ou modification)
    */
    change_cv(message, is_modif) {

        let error;

        /* Vérifie s'il y a 1 fichier joint au message */
        if (message.attachments.size != 1) {
            error = new Discord.RichEmbed(Error.embedNoAttachmentErr)
            error.setDescription(error.description + "\n<@" + message.author.id + ">");
            message.channel.send(error)
                .catch(console.error);
            return false;
        }

        let filename = message.attachments.array()[0].filename;

        /* Vérifie si le fichier joint est un PDF */
        if(filename.substring(filename.length - "pdf".length, filename.length) != "pdf") {
            error = new Discord.RichEmbed(Error.embedNoPDFErr)
            error.setDescription(error.description + "\n<@" + message.author.id + ">");
            message.channel.send(error)
                .catch(console.error);
            return false;
        }

        /* Si on est dans le cas d'une modification de CV */
        if (is_modif) {
            Fs.unlinkSync(Path.join("CV", this.dataValues.cv_path));
        }

        /* Crée le fichier et stocke le contenu du fichier joint dedans */        
        let file = Fs.createWriteStream( Path.join("CV", "CV_" + this.dataValues.id_user + ".pdf") );
        Https.get(message.attachments.array()[0].url, function(response) {
            response.pipe(file);
        });

        return true;
    }

    /* 
        Récupère le chemin du CV de l'utilisateur qui a été mentionné 
    */
    static async get_cv_by_mention(message) {

        let error;

        let mentions_list = message.mentions.members;

        /* Vérifie s'il y a 1 mention d'utilisateur */
        if(mentions_list.size != 1) {
            error = new Discord.RichEmbed(Error.embedError)
            error.setDescription(error.description + "\n<@" + message.author.id + ">");
            message.channel.send(error)
                .catch(console.error);
            return "";
        }

        let id_user = mentions_list.array()[0].user.id;

        let user = await User.get_user_by_id(id_user);

        /* Si l'utilisateur n'existe pas */
        if(!user) {
            error = new Discord.RichEmbed(Error.embedMentionCVInexistantUserErr)
            error.setDescription("<@" + message.author.id + ">");
            message.channel.send(error)
                .catch(console.error);
            return "";
        }

        /* Si l'utilisateur n'a pas enregistré de CV */
        else if(user.dataValues.cv_path == null) {
            error = new Discord.RichEmbed(Error.embedMentionNoCVErr)
            error.setDescription("<@" + message.author.id + ">");
            message.channel.send(error)
                .catch(console.error);
            return "";
        }

        return Path.join("CV", user.dataValues.cv_path);
    }

    /*
        Boucle pour renvoyer un mail avec le code ou tout supprimer de l'utilisateur
    */
    static async resend_mail_loop(message, client) {

        let error;

        let end_register = false;
        let num_message = 1;

        while(!end_register) {

            let mail_confirmed = new Discord.RichEmbed()
                .setColor('BLUE');

            /* 
                Change la description selon les cas suivants :
                    Cas 1 : L'utilisateur vient de confirmer son adresse mail
                    Cas 2 : Le mail a été renvoyé
                    Cas 3 : Le mail ne peut pas encore être renvoyé 
            */
            switch (num_message) {
                case 1 :
                    mail_confirmed.setDescription(Text.commands.register.mail_confirmed);
                    break;
                case 2 :
                    mail_confirmed.setDescription(Text.commands.register.resend);
                    break;
                case 3 :
                    mail_confirmed.setDescription(Text.commands.register.mail_time.replace("{time}", Config.TIME_RESEND))
                        .attachFiles(['./assets/icones/efficiency.png'])
                        .setThumbnail('attachment://efficiency.png');
                    break;
                default :
                    break;
            }

            mail_confirmed.setDescription(mail_confirmed.description + "\n<@" + message.author.id + ">");

            let message_confirm = await message.channel.send(mail_confirmed)
                                .catch(console.error);

            try {
                await message_confirm.react("\⛔")
                    .catch(console.error);
                await message_confirm.react("\🔄")
                    .catch(console.error);

                const filter = (reaction, user) => {
                    return ['⛔', '🔄'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                let reactions_list = await message_confirm.awaitReactions(filter, { max: 1 })
                    .catch(console.error);
                let reaction = reactions_list.first();

                if (reaction.emoji.name === '⛔') {
                    let user_now = await User.get_user_by_id(message.author.id);

                    /* Si l'utilisateur n'existe déjà plus */                    
                    if(!user_now) {
                        error = new Discord.RichEmbed(Error.embedInexistantUserErr)
                        error.setDescription(error.description + "\n<@" + message.author.id + ">");
                        message.channel.send(error)
                            .catch(console.error);
                        return ; 
                    }

                    user_now.delete_user(client, true);

                    /* Message de confirmation */
                    let mail_destroy = new Discord.RichEmbed()
                        .setColor('BLUE')
                        .setTitle(Text.commands.register.delete)                              
                        .setDescription("<@" + message.author.id + ">");

                    message.channel.send(mail_destroy)
                        .catch(console.error);

                    end_register = true;
                }
                else if (reaction.emoji.name === '🔄') {
                
                    let user_resend = await User.get_user_by_id(message.author.id);

                    /* Vérifie si l'utilisateur est déjà vérifié */
                    if (user_resend.dataValues.is_verif == true) {
                        error = new Discord.RichEmbed(Error.embedUserAlreadyVerifiedErr)
                        error.setDescription("<@" + message.author.id + ">");
                        message.channel.send(error)
                            .catch(console.error);
                        return ;
                    }
                    
                    let code_user = await Verification_Code.getVerification_CodeById(user_resend.dataValues.id_verif_code);
                    let date_now = new Date();

                    /* Vérifie si l'utilisateur peut demander à renvoyer le mail */
                    if(date_now < code_user.dataValues.date_resend_code) {
                        num_message = 3;
                        continue ;
                    }

                    /* Renvoie du mail contenant le code */
                    Mail.sendMail({
                        from: '"' + Config.MAIL_FROM_NAME + '" <' + Config.MAIL_FROM_ADR + '>', 
                        to: user_resend.dataValues.mail, 
                        subject: Text.mail.verify_code.subject,
                        html: "<span>" + Text.mail.verify_code.intro + "<br\\>" + Config.PREFIX + "verify " + code_user.dataValues.code + MailMessages.signature_mail_safir, 
                    });

                    /* Mise à jour du temps dans la DB */
                    Verification_Code.update(
                        {
                            date_resend_code : new Date(new Date().getTime() + Config.TIME_RESEND*60000)
                        },
                        {
                            where : {
                                id_verif_code : code_user.dataValues.id_verif_code
                            }
                        }
                    );

                    num_message = 2;
                }
            }
            catch(error) {
                console.error(error);
            }
        }
    }
}

module.exports = User;