const {DataTypes, Model} = require('sequelize');

class Verification_Code extends Model {

    /*
        Méthode permettant de créer la table dans la base de données si elle n'existe pas déjà
    */
    static init(sequelize) {
        return super.init( {
            id_verif_code : {
                type : DataTypes.INTEGER,
                autoIncrement : true,
                primaryKey : true
            },
            date_create_code : { type : DataTypes.DATE },
            date_resend_code : { type : DataTypes.DATE },
            code : {type : DataTypes.STRING(64)}
        }, {
            tableName : "Verification_Code",
            timestamps : false,
            sequelize
        });
    }

    /*
        Méthode permettant de récupérer un code de vérification avec son ID
    */
    static async getVerification_CodeById(id) {
        let code = await Verification_Code.findOne({
            where : {
                id_verif_code : id
            }
        })
            .catch(error => console.log(error));

        return code;
    }

}

module.exports = Verification_Code;