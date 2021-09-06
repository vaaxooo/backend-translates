const {Model, DataTypes} = require('sequelize');
const {postgres} = require('../utils/postgres');

class Translations extends Model {
}

Translations.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    translate: {
        type: DataTypes.BLOB,
        allowNull: false
    }
}, {
    sequelize: postgres,
    modelName: 'languages',
    freezeTableName: true
});

module.exports.Translations = Translations;