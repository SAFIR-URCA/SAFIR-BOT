const Discord = require('discord.js');
const Text = require('../text/fr.json');
const Config = require('../../config/config.json');
const Error = require('../prepared_messages/Error');

const menuCommand = async function(message, client) {

    /* Message de menu pour choisir sur quoi l'utilisateur souhaite recevoir des liens d'aide */
    const menu = new Discord.RichEmbed()
        .attachFiles(['./assets/icones/menu.png'])
        .setAuthor(Text.commands.menu.intro)
        .setColor('ORANGE')
        .setThumbnail('attachment://menu.png')
        .setTitle(Text.commands.menu.descrip)
        .setDescription(
            '<:urca:' + Config.ID_LOGO_URCA + '> : ' + Text.commands.menu.theme.urca +
            '<:html:' + Config.ID_LOGO_HTML + '> : ' + Text.commands.menu.theme.html +
            '<:css:' + Config.ID_LOGO_CSS + '> : ' + Text.commands.menu.theme.css +
            '<:js:' + Config.ID_LOGO_JS + '> : ' + Text.commands.menu.theme.js +
            '<:php:' + Config.ID_LOGO_PHP + '> : ' + Text.commands.menu.theme.php +
            '<:sql:' + Config.ID_LOGO_SQL + '> : ' + Text.commands.menu.theme.sql +
            '<:py:' + Config.ID_LOGO_PY + '> : ' + Text.commands.menu.theme.python +
            '<:java:' + Config.ID_LOGO_JAVA + '> : ' + Text.commands.menu.theme.java +
            '<:cpp:' + Config.ID_LOGO_CPP + '> : ' + Text.commands.menu.theme.cpp +
            '<:clang:' + Config.ID_LOGO_CLANG + '> : ' + Text.commands.menu.theme.clang
        )
        .addField(Text.commands.menu.invitation, 'https://discord.gg/T2vM2Tu', false)
        .addField(Text.commands.menu.add_link, Text.commands.menu.contact.replace("{contact}", Config.ID_ROLE_SAFIR));

    message.channel.send(menu)
        .then(async function (message_bot) {
            try {
                await message_bot.react(message_bot.guild.emojis.find(emoji => emoji.id == Config.ID_LOGO_URCA))
                        .catch(console.error); //URCA
                await message_bot.react(message_bot.guild.emojis.find(emoji => emoji.id == Config.ID_LOGO_HTML))
                        .catch(console.error); //HTML
                await message_bot.react(message_bot.guild.emojis.find(emoji => emoji.id == Config.ID_LOGO_CSS))
                        .catch(console.error); //CSS
                await message_bot.react(message_bot.guild.emojis.find(emoji => emoji.id == Config.ID_LOGO_JS))
                        .catch(console.error); //JS
                await message_bot.react(message_bot.guild.emojis.find(emoji => emoji.id == Config.ID_LOGO_PHP))
                        .catch(console.error); //PHP
                await message_bot.react(message_bot.guild.emojis.find(emoji => emoji.id == Config.ID_LOGO_SQL))
                        .catch(console.error); //SQL
                await message_bot.react(message_bot.guild.emojis.find(emoji => emoji.id == Config.ID_LOGO_PY))
                        .catch(console.error); //PY
                await message_bot.react(message_bot.guild.emojis.find(emoji => emoji.id == Config.ID_LOGO_JAVA))
                        .catch(console.error); //JAVA
                await message_bot.react(message_bot.guild.emojis.find(emoji => emoji.id == Config.ID_LOGO_CPP))
                        .catch(console.error); //CPP
                await message_bot.react(message_bot.guild.emojis.find(emoji => emoji.id == Config.ID_LOGO_CLANG))
                        .catch(console.error); //C

                client.on('messageReactionAdd', (reaction, user) => {

                    /* Un utilisateur réagit au message */
                    if (user.id !== client.user.id && reaction.message.id === message_bot.id) {

                        switch (reaction.emoji.name) {
                            case 'urca':
                                getLinks(message.channel, user, Text.commands.menu.link.urca);
                                break;

                            case 'html':
                                getLinks(message.channel, user, Text.commands.menu.link.html);
                                break;

                            case 'css':
                                getLinks(message.channel, user, Text.commands.menu.link.css);
                                break;

                            case 'javascript':
                                getLinks(message.channel, user, Text.commands.menu.link.js);
                                break;

                            case 'php':
                                getLinks(message.channel, user, Text.commands.menu.link.php);
                                break;

                            case 'sql':
                                getLinks(message.channel, user, Text.commands.menu.link.sql);
                                break;

                            case 'py':
                                getLinks(message.channel, user, Text.commands.menu.link.python);
                                break;
                                
                            case 'java':
                                getLinks(message.channel, user, Text.commands.menu.link.java);
                                break;    
                    
                            case 'cpp':
                                getLinks(message.channel, user, Text.commands.menu.link.cpp);
                                break;

                            case 'clang':
                                getLinks(message.channel, user, Text.commands.menu.link.clang);
                                break;

                            default :
                                let error = new Discord.RichEmbed(Error.embedEmoErr)
                                error.setDescription(error.description + "\n(<@" + user.id + ">)");
                                message.channel.send(error)
                                    .catch(console.error);
                                break;
                        }
                        reaction.remove(user.id);
                    }
                });
            }
            catch (error) {
                console.error(error);
            }
        })
        .catch(console.error);

    return ;
}

/*
    Fonction qui permet de récupérer les liens d'aide pour un thème choisi
*/
function getLinks(channel, user, link_theme) {
    var liens = new Discord.RichEmbed()
        .attachFiles(['./assets/icones/info.png'])
        .setAuthor(link_theme.title)
        .setColor('ORANGE')
        .setThumbnail('attachment://info.png')
        .setDescription("(<@" + user.id + ">)");

    for (let key in link_theme.list) {
        liens.addField('**' + link_theme.list[key].name + '**', link_theme.list[key].url, false);
    }

    channel.send(liens)
        .catch(console.error);
}

module.exports.MenuCommand = menuCommand;