const {Model, DataTypes} = require('sequelize');
const {postgres} = require('../utils/postgres');

class Orders extends Model {
}

Orders.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    langFrom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    langTo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    files: {
        type: DataTypes.JSON,
        allowNull: false
    },
    in_process: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: postgres,
    modelName: 'orders',
    freezeTableName: true
});

module.exports.Orders = Orders;