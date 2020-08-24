const Discord = require('discord.js');
const Text = require('../text/fr.json');
const MailMessages = require('../prepared_messages/MailMessages');
const Error = require('../prepared_messages/Error');
const Verification_Code = require('../classes/Verification_Code');
const Mail = require('../connexion/Mail');
const User = require('../classes/User');
const UUID = require('uuid');
const Config = require('../../config/config.json');

/* Liste des utilisateurs qui doivent confirmer le changement d'adresse mail */
let in_changing_list = [];

const mailCommand = async function(message, client) {

    let error;

    /* L'utilisateur actuel est en cours de confirmation pour son changement d'adresse mail */
    if (in_changing_list.includes(message.author.id)) {
        error = new Discord.RichEmbed(Error.embedInChangingMailErr)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    /* Si la commande n'a pas le bon nombre d'arguments */
    let args = message.content.split(' ').slice(1);
    if (args.length != 1) {
        error = new Discord.RichEmbed(Error.embedError)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    let is_valid = User.check_mail_address(args[0], message);
    if (!is_valid) return;
    
    let current_user = await User.get_user_by_id(message.author.id);

    /* Si l'utilisateur n'existe pas */
    if (!current_user) {
        error = new Discord.RichEmbed(Error.embedInexistantUserErr)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    /* Si l'adresse indiquée est celle de l'utilisateur actuellement */
    else if(current_user.dataValues.mail == args[0]) {
        error = new Discord.RichEmbed(Error.embedSameMailErr)
        error.setDescription("<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);  
        return;
    }

    /* Vérifie si l'adresse mail est déjà utilisée par un utilisateur vérifié */
    let verified_user = await User.get_verified_user_by_mail(args[0]);
    if(verified_user) {
        error = new Discord.RichEmbed(Error.embedMailUsedErr)
        error.setDescription("<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);  
        return; 
    }

    /* Message pour confirmer le changement de mail */
    let confirm_message = new Discord.RichEmbed()
        .setColor('BLUE');

    if(current_user.dataValues.is_verif) {
        confirm_message.setDescription(Text.commands.mail.is_verified.replace("{mail}", args[0]));
    }
    else {
        confirm_message.setDescription(Text.commands.mail.not_verified.replace("{mail}", args[0]));
    }

    confirm_message.setDescription(confirm_message.description + "\n<@" + message.author.id + ">");

    message.channel.send(confirm_message)
        .then(async function(message_bot) {
            
            try {
                in_changing_list.push(message.author.id);

                await message_bot.react("\✅")
                    .catch(console.error);
                await message_bot.react("\❌")
                    .catch(console.error); 

                const filter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                };

                let collected = await message_bot.awaitReactions(filter, { max: 1 })
                    .catch(console.error);

                let reaction = collected.first() ;

                in_changing_list.splice(in_changing_list.indexOf(message.author.id), 1);

                if (reaction.emoji.name === '✅') {

                    current_user.delete_user(client, false);

                    let current_date = new Date();
                    let code_verif = UUID.v4();

                    /* MaJ de la database */
                    let verif_code = await Verification_Code.create({
                        date_create_code : current_date,
                        date_resend_code : new Date(current_date.getTime() + Config.TIME_RESEND*60000),
                        code : code_verif
                    })
                        .catch(error => console.error(error));

                    let name = args[0].split("@")[0].split(".");

                    User.update( 
                        {
                            first_name : name[0].toUpperCase(),
                            last_name : name[1].replace(/[0-9]+/gi, "").toUpperCase(),
                            mail : args[0],
                            role : null,
                            cv_path : null,
                            is_verif : false,
                            id_verif_code : verif_code.dataValues.id_verif_code
                        },
                        {
                            where : {
                                id_user : message.author.id
                            }
                        }
                    );

                    /* Envoie du mail contenant le code */
                    Mail.sendMail({
                        from: '"' + Config.MAIL_FROM_NAME + '" <' + Config.MAIL_FROM_ADR + '>', 
                        to: args[0], 
                        subject: Text.mail.verify_code.subject,
                        html: "<span>" + Text.mail.verify_code.intro + "<br\\>" + Config.PREFIX + "verify " + code_verif + MailMessages.signature_mail_safir, 
                    });

                    await User.resend_mail_loop(message, client);
                }
                else if (reaction.emoji.name === '❌') {
                    let cancel_message = new Discord.RichEmbed()
                        .setColor('BLUE')
                        .setDescription(Text.commands.mail.canceled + "\n<@" + message.author.id + ">");

                    message.channel.send(cancel_message)
                        .catch(console.error);
                }
            }
            catch (error) {
                console.error(error);
            };
        })
        .catch(console.error);

    return ;
}

module.exports.MailCommand = mailCommand;