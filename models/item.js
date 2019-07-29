const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Item = db.define('item', {
    itemName: {
        type: Sequelize.STRING
    },
    itemDescription: {
        type: Sequelize.STRING(2000)
    },
    posterURL: {
        type: Sequelize.STRING
    },
    userId: {
        type: Sequelize.STRING
    },

    itemPrice: {
        type: Sequelize.STRING
    },
    Halaltype: {
        type: Sequelize.STRING
    },
    Vegtype: {
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    likes: {
        type: Sequelize.STRING
    },     
    DaysAvailable:{
        type: Sequelize.STRING
    },
    LocationD:{
        type: Sequelize.STRING
    },
    dateTimeItem:{
        type: Sequelize.DATEONLY
    },
    Cuisine:{
        type: Sequelize.STRING
    },
    Quantity:{
        type: Sequelize.INTEGER
    },
    timeAvailable:{
        type: Sequelize.STRING
    },
    existed:{
        type: Sequelize.STRING   
    }
    
    // ,
    // location:{
    //     type: Sequelize.STRING
    // }


});
module.exports = Item;