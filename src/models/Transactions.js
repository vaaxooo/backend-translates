const {Model, DataTypes} = require('sequelize');
const {postgres} = require('../utils/postgres');

class Transactions extends Model {
}

Transactions.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payment_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ps_data: {
        type: DataTypes.JSON,
        allowNull: true
    },
    processed: DataTypes.STRING,
    status: DataTypes.STRING,
    success_link: DataTypes.STRING,
    fail_link: DataTypes.STRING
}, {
    sequelize: postgres,
    modelName: 'transactions',
    freezeTableName: true
});

module.exports.Transactions = Transactions;