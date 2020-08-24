const Sequelize = require('sequelize');
const Config = require('../../config/config.json');

let timezone_nb = new Date().getTimezoneOffset();
let timezone_str = "";

/* Détermine le signe du fuseau horaire */
if(timezone_nb < 0) {
    timezone_str += "+";
    timezone_nb *= (-1);
}
else {
    timezone_str += "-";
}

let hour_timezone = Math.floor(timezone_nb/60);
let minute_timezone = timezone_nb - (hour_timezone * 60);

/* Rajoute un 0 si nécessaire devant les heures */
if(hour_timezone < 10) {
    timezone_str += "0";
}
timezone_str += hour_timezone + ":";

/* Rajoute un 0 si nécessaire devant les minutes */
if(minute_timezone < 10) {
    timezone_str += "0";
}
timezone_str += minute_timezone;

let sequelize = new Sequelize(Config.DB_NAME, Config.DB_USERNAME, Config.DB_PASSWORD, {
    dialect : "mysql",
    host : Config.DB_HOST,
    port : Config.DB_PORT,
    timezone : timezone_str
});

module.exports = sequelize;