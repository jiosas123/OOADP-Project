const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger.js');
// User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {
    let errors = [];
    let success_msg = '';
    let password = req.body.password;
    let password2 = req.body.password2;
    let name = req.body.name;
    let email = req.body.email;

    if (password.length < 4) {
        errors.push({ text: "Password must be at least 4 characters." });
    }
    if (password != password2) {
        errors.push({ text: "Passwords do not match." })

    }
    console.log(errors);
    if (errors.length == 0) {
        console.log("hello");
        success_msg = email + "Registered Successfully."
        alertMessage(res, 'success', success_msg, 'fas fa-sign-in-alt', true);
        res.redirect('/showLogin');
    } else {//there is some error
        res.render('user/register', {
            name: name,
            email: email,
            password: password,
            errors: errors
        })
    }



    // Do exercise 3 here
});
module.exports = router;