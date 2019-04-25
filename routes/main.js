const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger.js');


router.get('/', (req, res) => {
	const title = 'Video Jotter';
	res.render('index', { title: title }) // renders views/index.handlebars
});


router.get('/showLogin', (req, res) => {
	res.render('user/login', {});
})

router.get('/showRegister', (req, res) => {
	res.render('user/register', {});
})

router.get('/about', (req, res) => {
	/*const s = 'Robert Lim';
	res.render('about', { name: s });
	
})*/
	const author = 'Denzel Washington';
	let success_msg = 'Success message';
	let error_msg = 'Error message using error_msg';

	alertMessage(res, 'success',
		'This is an important message', 'fas fa-sign-in-alt', true);
	alertMessage(res, 'danger',
		'Unauthorised access', 'fas fa-exclamation-circle', false);

		
	res.render('about', {
		author: author,
		success_msg: success_msg,
		error_msg: error_msg
	})

})

// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
