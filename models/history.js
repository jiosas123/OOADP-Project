const Sequelize = require('sequelize');
const db = require('../config/DBConfig');



const history = db.define('his',{
    itemName:{
        type: Sequelize.STRING
    },
    QuantityBought:{
        type: Sequelize.INTEGER
    },
    datePurchased:{
        type: Sequelize.STRING
    },
    itemPrice:{
        type:Sequelize.STRING
    },
    posterURL:{
        type: Sequelize.STRING
    },
    currentUser:{
        type: Sequelize.STRING     
    }





});
module.exports = history;