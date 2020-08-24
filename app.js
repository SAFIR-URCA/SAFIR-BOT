const Discord = require('discord.js');
const Config = require('./config/config.json');
const CommandReader = require('./modules/manager/CommandReader.js');
const Database = require('./modules/connexion/Database');
const Verification_Code = require('./modules/classes/Verification_Code');
const User = require('./modules/classes/User');
const Text = require('./modules/text/fr.json');
const Fs = require("fs"); 

let client = new Discord.Client();
let commandReader = new CommandReader();

/* Le bot est lancé */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}! v.${Config.VERSION}`);
    
    client.user.setActivity('Préfix : ' + Config.PREFIX + 'help', { type: 'Listening' })
        .catch(console.error);
    
    /* Connexion à la DB */
    Database.authenticate()
        .then(() => {
            console.log("Logged in database")

            Verification_Code.init(Database)
            User.init(Database)

            User.belongsTo(Verification_Code, {
                foreignKey : "id_verif_code"
            })

            Verification_Code.sync()
            User.sync()
        })
        .catch(error => console.log(error));

    /* Création du dossier CV si inexistant */
    if(!Fs.existsSync("CV")) {
        Fs.mkdirSync("CV");
    }
});

/* Un utilisateur a envoyé un message */
client.on("message", (message) => {
    if (message.author.bot) return;
    commandReader.handleMessage(message, client);
});

/* Un utlisateur est arrivé sur le serveur */
client.on('guildMemberAdd', member => {

    User.get_user_by_id(member.id)    
        .then(user => {

            let welcome_message = new Discord.RichEmbed()
                .setColor('BLUE');

            /* Si l'utilisateur existe dans la DB */
            if (user) {

                /* Si l'utilisateur est vérifié */
                if (user.dataValues.is_verif) {
                    welcome_message.setDescription(Text.welcome.verified_user
                                                        .split("{nom}").join(member.guild.name)
                                                        .split("{prefixe}").join(Config.PREFIX));

                    /* Remet le rôle à l'utilisateur */
                    if (user.dataValues.role == "Etudiant") {
                        member.addRole(Config.ID_ROLE_STUDENT);
                    }
                    else {
                        member.addRole(Config.ID_ROLE_TEACHER);
                    }
                }
                /* Si l'utilisateur n'est pas vérifié */
                else {
                    welcome_message.setDescription(Text.welcome.inexistant_unverified_user
                                                        .split("{nom}").join(member.guild.name)
                                                        .split("{prefixe}").join(Config.PREFIX));
                }
            
            /* Si l'utilisateur n'existe pas dans la DB */
            }
            else {
                welcome_message.setDescription(Text.welcome.inexistant_unverified_user
                                                    .split("{nom}").join(member.guild.name)
                                                    .split("{prefixe}").join(Config.PREFIX));
            }

            member.send(welcome_message)
                .catch(console.error);
        });

});

client.login(Config.BOT_TOKEN);