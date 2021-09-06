const {Model, DataTypes} = require('sequelize');
const {postgres} = require('../utils/postgres');

class Users extends Model {
}

Users.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    twofactor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    twofactorCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    recoveryCode: {
        type: DataTypes.STRING(500),
        allowNull: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    lang: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "en"
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: postgres,
    modelName: 'users',
    freezeTableName: true
});

module.exports.Users = Users;