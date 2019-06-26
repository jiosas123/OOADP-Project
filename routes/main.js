const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')
const Item = require('../models/item');
const sequelize = require('../config/DBConfig');
var num;

var result =[];
sequelize.query("SELECT * FROM foodfood.items", { type: sequelize.QueryTypes.SELECT}).then(results => {
	setvalue(results)
})
function setvalue(value){
	result = value
}

router.get('/', (req, res) => {
	num=1;
	const title = 'Listings';
	res.render('index', { title: title, listing: result}) // renders views/index.handlebars
});

router.get('/prev', (req, res) => {
	
	const title = 'Food Food';

	Item.findAll({
		
        raw: true
    }).then((item) => {
        // pass object to listVideos.handlebar
        res.render('index', {title: title        , 
            item: item , min:num-6 , max:num
		});
		num=num-6
    }).catch(err => console.log(err));
	 
	
	/*res.render('index', { title: title        
	
	
	})// renders views/index.handlebars*/
});


// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/about', (req, res) => {

	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';

	alertMessage(res, 'success',
		'This is an important message', 'fas fa-sign-in-alt', true);
	alertMessage(res, 'danger',
		'Unauthorised access', 'fas fa-exclamation-circle', false);

	var errorTexts = [
		{ text: "Error message using error object" },
		{ text: "First error message🙅‍♀️" },
		{ text: "Second error message 🚫" },
		{ text: "Third error message⛔" }
	];


	var dev_name = "🧐 Happy 脸😀"
	res.render('about', {
		developer_name: dev_name,
		success_msg: success_msg,
		error_msg: error_msg,
		errors: errorTexts
	}) // renders views/about.handlebars
});

router.get('/showLogin', (req, res) => {
	res.render('user/login') // renders views/user/login.handlebars
});

router.get('/showRegister', (req, res) => {
	res.render('user/register') // renders views/register.handlebars
});

module.exports = router;
