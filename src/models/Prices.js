const {Model, DataTypes} = require('sequelize');
const {postgres} = require('../utils/postgres');

class Prices extends Model {
}

Prices.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize: postgres,
    modelName: 'prices',
    freezeTableName: true
});

module.exports.Prices = Prices;