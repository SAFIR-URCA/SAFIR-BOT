const Discord = require('discord.js');
const Text = require('../text/fr.json');
const MailMessages = require('../prepared_messages/MailMessages');
const Error = require('../prepared_messages/Error');
const Verification_Code = require('../classes/Verification_Code');
const Mail = require('../connexion/Mail');
const User = require('../classes/User');
const UUID = require('uuid');
const Config = require('../../config/config.json');

/* Liste des utilisateurs qui doivent confirmer que l'adresse mail indiquée est bien la leur */
let in_confirming_list = [];

const registerCommand = async function(message, client) {

    let error;

    /* L'utilisateur actuel est en cours de confirmation de son adresse mail */
    if (in_confirming_list.includes(message.author.id)) {
        error = new Discord.RichEmbed(Error.embedInConfirmingMailErr)
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

    let current_user = await User.get_user_by_id(message.author.id);

    /* Si l'utilisateur est déjà vérifié */
    if(current_user && current_user.dataValues.is_verif == true) {
        error = new Discord.RichEmbed(Error.embedUserAlreadyVerifiedErr)
        error.setDescription("<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);    
        return ;
    }

    /* L'utilisateur est déjà enregistré dans la DB */
    else if(current_user) {
        error = new Discord.RichEmbed(Error.embedAlreadySignedUpErr)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    let is_valid = User.check_mail_address(args[0], message);
    if (!is_valid) return;

    /* Vérifie si l'adresse mail est déjà utilisée par un utilisateur vérifié */
    let verified_user = await User.get_verified_user_by_mail(args[0]);
    if(verified_user) {
        error = new Discord.RichEmbed(Error.embedMailUsedErr)
        error.setDescription("<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);  
        return; 
    }
    
    let confirm_mail = new Discord.RichEmbed()
        .setDescription(args[0] + "\n<@" + message.author.id + ">")
        .setColor('BLUE')
        .setTitle(Text.commands.register.confirming_mail);

    message.channel.send(confirm_mail)
        .then(async function (message_bot) {
            try {

                in_confirming_list.push(message.author.id);

                await message_bot.react("\✅")
                    .catch(console.error);
                await message_bot.react("\❌")
                    .catch(console.error);

                const filter = (reaction, user) => {
                    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                
                let reactions_list = await message_bot.awaitReactions(filter, { max: 1 })
                                    .catch(console.error);
                let reaction = reactions_list.first();

                in_confirming_list.splice(in_confirming_list.indexOf(message.author.id), 1);

                if (reaction.emoji.name === '✅') {

                    let current_date = new Date();
                    let code_verif = UUID.v4();

                    /* MaJ de la DB */
                    let verif_code = await Verification_Code.create({
                                        date_create_code : current_date,
                                        date_resend_code : new Date(current_date.getTime() + Config.TIME_RESEND*60000),
                                        code : code_verif
                    })
                                        .catch(error => console.error(error));

                    let name = args[0].split("@")[0].split(".");

                    let new_user = await User.create({
                                        id_user : message.author.id,
                                        id_verif_code : verif_code.dataValues.id_verif_code,
                                        first_name : name[0].toUpperCase(),
                                        last_name : name[1].replace(/[0-9]+/gi, "").toUpperCase(),
                                        mail : args[0],
                                        is_verif : false
                    })
                                        .catch(error => console.error(error));

                    /* Envoie du mail contenant le code */
                    Mail.sendMail({
                        from: '"' + Config.MAIL_FROM_NAME + '" <' + Config.MAIL_FROM_ADR + '>', 
                        to: new_user.dataValues.mail, 
                        subject: Text.mail.verify_code.subject,
                        html: "<span>" + Text.mail.verify_code.intro + "<br\\>" + Config.PREFIX + "verify " + code_verif + MailMessages.signature_mail_safir, 
                    });

                    await User.resend_mail_loop(message, client);                    
                }
                else if (reaction.emoji.name === '❌')  {
                    let mail_canceled = new Discord.RichEmbed()
                        .setDescription(Text.commands.register.canceled + "\n<@" + message.author.id + ">")
                        .setColor('BLUE');

                    message.channel.send(mail_canceled)
                        .catch(console.error);  
                }
            }
            catch (error) {
                console.error(error);
            }
        })
        .catch(console.error);

    return ;   
}

module.exports.RegisterCommand = registerCommand;