const Sequelize= require("sequelize");

const connection = new Sequelize('blognodejs','dvs','1234567a',{
    host:'mysql669.umbler.com',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;