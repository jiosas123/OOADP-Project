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
    Seenbyothers: {
        type: Sequelize.STRING
    },
    availability: {
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
    }


});
module.exports = Item;