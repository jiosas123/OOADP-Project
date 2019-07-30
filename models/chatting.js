const Sequelize = require('sequelize');
const db = require('../config/DBConfig');
/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
const Chat = db.define('chat', {
    //itemName: {
        //type: Sequelize.STRING
    //},
    name: {
        type: Sequelize.STRING
    },

    message:{
        type: Sequelize.STRING
    },

    output:{
        type:Sequelize.STRING
    },
    feedback:{
        type:Sequelize.STRING
    },
    rating:{
        type:Sequelize.STRING
    },


});
module.exports = Chat;