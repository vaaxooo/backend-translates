const {Sequelize} = require('sequelize');

const config = process.env;

module.exports.postgres = new Sequelize(config.DBNAME, config.DBUSER, config.DBPASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    define: {
        charset: 'utf8',
        dialectOptions: {
            collate: 'utf8_general_ci'
        },
        timestamps: true
    }
});