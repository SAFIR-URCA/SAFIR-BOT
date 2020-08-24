const Discord = require('discord.js');
const Text = require('../text/fr.json');
const MailMessages = require('../prepared_messages/MailMessages');
const Error = require('../prepared_messages/Error');
const Verification_Code = require('../classes/Verification_Code');
const Mail = require('../connexion/Mail');
const User = require('../classes/User');
const Config = require('../../config/config.json');

const resendCommand = async function(message, client) {

    let error;

    /* Si la commande n'a pas le bon nombre d'arguments */
    let args = message.content.split(' ').slice(1);
    if (args.length != 0) {
        error = new Discord.RichEmbed(Error.embedError)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    let user_resend = await User.get_user_by_id(message.author.id);

    /* Si l'utilisateur n'existe pas */
    if (!user_resend) {
        error = new Discord.RichEmbed(Error.embedInexistantUserErr)
        error.setDescription(error.description + "\n<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    /* Vérifie si l'utilisateur est déjà vérifié */
    else if (user_resend.dataValues.is_verif == true) {
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
        error = new Discord.RichEmbed(Error.embedTimeMailErr)
        error.setDescription("<@" + message.author.id + ">");
        message.channel.send(error)
            .catch(console.error);
        return ;
    }

    /* Renvoie du mail contenant le code */
    Mail.sendMail({
        from: '"' + Config.MAIL_FROM_NAME + '" <' + Config.MAIL_FROM_ADR + '>', 
        to: user_resend.dataValues.mail, 
        subject: Text.mail.verify_code.subject,
        html: "<span>" + Text.mail.verify_code.intro + "<br\\>" + Config.PREFIX + "verify " + code_user.dataValues.code + MailMessages.signature_mail_safir, 
    });

    /* Mise à jour du temps dans la DB */
    Verification_Code.update({
        date_resend_code : new Date(new Date().getTime() + Config.TIME_RESEND*60000)
    },
    {
        where : {
            id_verif_code : code_user.dataValues.id_verif_code
        }
    });

    let confirm_message = new Discord.RichEmbed()
        .setColor('BLUE')
        .setDescription(Text.commands.register.resend + "\n<@" + message.author.id + ">");
    
    message.channel.send(confirm_message)
        .catch(console.error);

    return ;
}

module.exports.ResendCommand = resendCommand;