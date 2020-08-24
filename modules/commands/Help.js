const Discord = require('discord.js');
const Text = require('../text/fr.json');
const Config = require('../../config/config.json');

const helpCommand = async function(message, client) {
    
    /* Introduction */
    let help = new Discord.RichEmbed()
        .attachFiles(['./assets/icones/help.png'])
        .setAuthor(Text.commands.help.intro.cmd_help)
        .setColor('ORANGE')
        .setThumbnail('attachment://help.png')
        .setDescription(Text.commands.help.intro.descrip_help);
    
    await message.channel.send(help)
        .catch(console.error);
    
    /* Aide pour les administrateurs */
    if (message.member.hasPermission('ADMINISTRATOR')) {
        await getCommandsMessage("admin", message.channel);
    }
    
    /* Aide pour les responsables */
    if (message.member.hasPermission('MANAGE_NICKNAMES')) {
        await getCommandsMessage("manager", message.channel);
    }
    
    /* Aide pour les utilisateurs classiques */
    await getCommandsMessage("user", message.channel);

    return ;
};

/* 
    Fonction qui affiche les commandes selon le rôle indiqué
*/
function getCommandsMessage(role, channel){

    let commands_list;
    let intro_role;

    if (role == "admin") {
        commands_list = Text.commands.help.admin;
        intro_role = Text.commands.help.intro.cmd_admin;
    }
    else if (role == "manager") {
        commands_list = Text.commands.help.manager;
        intro_role = Text.commands.help.intro.cmd_manager;
    }
    else if (role == "user") {
        commands_list = Text.commands.help.user;
        intro_role = Text.commands.help.intro.cmd_user;
    }

    let commands_help = new Discord.RichEmbed()
        .setAuthor(intro_role)
        .setColor('ORANGE');

    /* S'il y a des commandes pour ce rôle */
    if(Object.keys(commands_list).length > 1) {
        for (let key in commands_list) {
            if(key == "no_command") continue;

            commands_help.addField("```" + Config.PREFIX + commands_list[key].syntax + "```", commands_list[key].descrip, false);
        }
    }
    /* S'il n'y a pas de commandes pour ce rôle */
    else {
        commands_help.setDescription(commands_list.no_command);
    }
    
    channel.send(commands_help)
        .catch(console.error);
}

module.exports.HelpCommand = helpCommand;