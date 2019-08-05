const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger')
const Item = require('../models/item');
const sequelize = require('../config/DBConfig');
const Cart = require('../models/cart')
const ensureAuthenticated = require('../helpers/auth')


router.get('/', (req, res) => {
	Cart.findAll({

	}).then((cartAll) => {
		var i;
		for (i = 0; i < cartAll.length; i++) {
			var itemID = cartAll[i].itemID;
			Item.update({
				existed: ''
			}, {
					where: {
						id: itemID
					}
				}).catch(err => console.log(err));
		}//forloop
	}).then((hi) => {
		function myFunc(arg) {
			var lists = new Promise(function (resolve) {
				var result = [];
				sequelize.query("SELECT * FROM foodfood.items ORDER BY id DESC", { type: sequelize.QueryTypes.SELECT }).then(results => {
					result = results
					resolve(result)
				})
			})

			const title = 'Listings';
			lists.then(function (value) {
				res.render('index', { title: title, listing: value, total: '0' }) // renders views/index.handlebars
			})
		}
		setTimeout(myFunc, 500, 'funcky')

	})



});

router.get('/home', ensureAuthenticated, (req, res) => {
	const title = 'Listings';
	Cart.findAndCountAll({
		where: {
			currentUser: req.user.id

		}
	}).then((cart) => {

		Cart.findAll({
			where: {
				currentUser: req.user.id
			}
		}).then((cartAll) => {
			var i;

			for (i = 0; i < cartAll.length; i++) {
				var itemID = cartAll[i].itemID;
				Item.update({
					existed: 'existed'
				}, {
						where: {
							id: itemID,


						}
					})


			}
		}).then((hi) => {




			function myFunc(arg) {


				var lists = new Promise(function (resolve) {
					var result = [];
					sequelize.query("SELECT * FROM foodfood.items", { type: sequelize.QueryTypes.SELECT }).then(results => {
						result = results
						resolve(result)

					})

				})
				lists.then(function (value) {
					res.render('index', { title: title, listing: value, total: cart.count })
				})
			}

			setTimeout(myFunc, 500, 'funky');
		})








		// 	console.log("im 4")
		// 		lists.then(function (value) {


		// 			console.log("huh3333333333333333333333333333333333333333huhuhuhuhuhuhuh")
		// 			// renders views/index.handlebars)
		// 			res.render('index', { title: title, listing: value, total: cart.count })
		// 		})
		// 	/*Item.findAll({
		// 	}).then((testts) => {
		// 		res.render('index', { title: title, listing: testts, total: cart.count })
		// 	lists.then(function (value) {
		//  // renders views/index.handlebars)

		// 	})
		// })*/




	})
});


router.get('/prev', (req, res) => {

	const title = 'Food Food';

	Item.findAll({

		raw: true
	}).then((item) => {
		// pass object to listVideos.handlebar
		res.render('index', {
			title: title,
			item: item, min: num - 6, max: num
		});
		num = num - 6
	}).catch(err => console.log(err));


	/*res.render('index', { title: title        
	
	
	})// renders views/index.handlebars*/
});


// Logout User
router.get('/logout', (req, res) => {


	Cart.findAll({

	}).then((cartAll) => {

		var i;
		for (i = 0; i < cartAll.length; i++) {

			var itemID = cartAll[i].itemID;
			Item.update({
				existed: ''
			}, {
					where: {
						id: itemID
					}
				}).then(() => {
					// After saving, redirect to router.get(/listVideos...) to retrieve all updated
					// videos


				}).catch(err => console.log(err));


		}

	}).then((hi) => {



		function myFunc(arg) {
			req.logout();
			res.redirect('/');

		}

		setTimeout(myFunc, 500, 'funky');
	})



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
