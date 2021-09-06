const {Model, DataTypes} = require('sequelize');
const {postgres} = require('../utils/postgres');

class Languages extends Model {
}

Languages.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: postgres,
    modelName: 'languages',
    freezeTableName: true
});

module.exports.Languages = Languages;