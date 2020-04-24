const Sequelize = require("sequelize");
const Connection = require("../database/database");
const category = require("../Categories/Categories");

const articles = Connection.define('articles',{
    title:{ 
        type: Sequelize.STRING,
        allowNull: false
    }, slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
    
})

category.hasMany(articles); // uma categoria tem muitos artigos
articles.belongsTo(category); // um artigo pertence a uma categoria



module.exports = articles;