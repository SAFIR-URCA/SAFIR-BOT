const Nodemailer = require('nodemailer');
const Config = require('../../config/config.json');

const transporter = Nodemailer.createTransport({
    host: Config.MAIL_HOST,
    port: Config.MAIL_PORT,
    secure: false, 
    auth: {
        user: Config.MAIL_USER,
        pass: Config.MAIL_PASS
    }
});

module.exports = transporter;