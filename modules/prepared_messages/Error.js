const Text = require('../text/fr.json');
const Discord = require("discord.js");
const Config = require('../../config/config.json');

/* Erreur générale */
const embedError = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.command.error_type)
    .setDescription(Text.error.command.descrip.replace("{prefixe}", Config.PREFIX));
    
const embedPermErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/shield.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://shield.png')
    .setTitle(Text.error.permission.user.error_type)
    .setDescription(Text.error.permission.user.descrip.replace("{prefixe}", Config.PREFIX));

const embedEmoErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.emoji.error_type)
    .setDescription(Text.error.emoji.descrip);


/* Erreur mail */
const embedNotMailErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.mail.not_mail.error_type);

const embedDomainMailUrcaErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.mail.domain_mail.error_type)
    .setDescription(Text.error.mail.domain_mail.descrip);

const embedNameMailUrcaErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.mail.name_mail.error_type)
    .setDescription(Text.error.mail.name_mail.descrip);

const embedSameMailErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.mail.own_mail.error_type);

const embedMailUsedErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.mail.mail_used.error_type);

const embedInConfirmingMailErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.account.in_confirming.error_type)
    .setDescription(Text.error.account.in_confirming.descrip);

const embedTimeMailErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.commands.register.mail_time.replace("{time}", Config.TIME_RESEND));

/* Erreur CV */
const embedNoAttachmentErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.cv.no_file.error_type)   
    .setDescription(Text.error.cv.no_file.descrip); 

const embedNoPDFErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.cv.no_pdf.error_type)    
    .setDescription(Text.error.cv.no_pdf.descrip);  
    
const embedNoCVErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.cv.no_cv.error_type); 

const embedCVExistErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.cv.exist.error_type);    

const embedMentionCVInexistantUserErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.cv.mention_user_inexistant.error_type);   

const embedMentionNoCVErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.cv.mention_no_cv.error_type);   

/* Error account */
const embedInexistantUserErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.account.no_registered.error_type)
    .setDescription(Text.error.account.no_registered.descrip);

const embedUserAlreadyVerifiedErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.account.verified.error_type);

const embedUnverifiedUserErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.account.in_verifying.error_type)    
    .setDescription(Text.error.account.in_verifying.descrip);

const embedAlreadySignedUpErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.account.signed_up.error_type)
    .setDescription(Text.error.account.signed_up.descrip);

const embedIncorrectCodeErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.account.incorrect_code.error_type)
    .setDescription(Text.error.account.incorrect_code.descrip);

const embedInDeletingAccountErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.account.in_deleting.error_type)
    .setDescription(Text.error.account.in_deleting.descrip);

const embedInChangingMailErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.account.in_changing_mail.error_type)
    .setDescription(Text.error.account.in_changing_mail.descrip);   

/* Erreur channel */
const embedChannelTypeErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.channel.type.error_type);    

const embedCategoryErr = new Discord.RichEmbed()
    .attachFiles(['./assets/icones/problem.png'])
    .setAuthor(Text.error.title)
    .setColor('RED')
    .setThumbnail('attachment://problem.png')
    .setTitle(Text.error.channel.category.error_type);    

/* Erreur générale */
module.exports.embedError = embedError;
module.exports.embedPermErr = embedPermErr;
module.exports.embedEmoErr = embedEmoErr;

/* Erreur mail */
module.exports.embedNotMailErr = embedNotMailErr;
module.exports.embedDomainMailUrcaErr = embedDomainMailUrcaErr;
module.exports.embedNameMailUrcaErr = embedNameMailUrcaErr;
module.exports.embedSameMailErr = embedSameMailErr;
module.exports.embedMailUsedErr = embedMailUsedErr;
module.exports.embedInConfirmingMailErr = embedInConfirmingMailErr;
module.exports.embedTimeMailErr = embedTimeMailErr;

/* Erreur CV */
module.exports.embedNoAttachmentErr = embedNoAttachmentErr;
module.exports.embedNoPDFErr = embedNoPDFErr;
module.exports.embedNoCVErr = embedNoCVErr;
module.exports.embedCVExistErr = embedCVExistErr;
module.exports.embedMentionCVInexistantUserErr = embedMentionCVInexistantUserErr;
module.exports.embedMentionNoCVErr = embedMentionNoCVErr;

/* Error account */
module.exports.embedInexistantUserErr = embedInexistantUserErr;
module.exports.embedUserAlreadyVerifiedErr = embedUserAlreadyVerifiedErr;
module.exports.embedUnverifiedUserErr = embedUnverifiedUserErr;
module.exports.embedAlreadySignedUpErr = embedAlreadySignedUpErr;
module.exports.embedIncorrectCodeErr = embedIncorrectCodeErr;
module.exports.embedInDeletingAccountErr = embedInDeletingAccountErr;
module.exports.embedInChangingMailErr = embedInChangingMailErr;

/* Erreur channel */
module.exports.embedChannelTypeErr = embedChannelTypeErr;
module.exports.embedCategoryErr = embedCategoryErr;