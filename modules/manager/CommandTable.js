const Help = require('../commands/Help');
const Annonce = require('../commands/Annonce');
const Menu = require('../commands/Menu');
const Register = require('../commands/Register');
const Verify = require('../commands/Verify');
const Cv = require('../commands/Cv');
const Resend = require('../commands/Resend');
const Delete = require('../commands/Delete');
const Mail = require('../commands/Mail');
const Feedback = require('../commands/Feedback');

/* Commandes exécutable dans un des channels de la catégorie du bot sur le serveur */
const BotChannelCommandTable = new Map( [
    ["annonce", Annonce.AnnonceCommand],
    ["help", Help.HelpCommand],
    ["menu", Menu.MenuCommand],
    ["verify", Verify.VerifyCommand],
    ["delete", Delete.DeleteCommand],
    ["resend", Resend.ResendCommand],
    ["cv", Cv.CvCommand],
    ["register", Register.RegisterCommand],
    ["mail", Mail.MailCommand]
]);

const BotDmCommandTable = new Map([])

const BotFeedbackCommand = new Map([
    ["feedback", Feedback.FeedbackCommand]
])
const CommandTable = new Map(
    [
        ["bot_channel", BotChannelCommandTable],
        ["dm_channel", BotDmCommandTable],
        ["feedback_channel", BotFeedbackCommand]
    ]
);

module.exports = CommandTable;
