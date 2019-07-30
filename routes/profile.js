const express = require('express');
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
var bcrypt = require('bcryptjs');
const passport = require('passport');
const Item = require('../models/item');
const ensureAuthenticated = require('../helpers/auth');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/video/listVideos', // Route to /video/listVideos URL
        failureRedirect: '/showLogin', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error
        message using the message given by the strategy's verify callback, if any.
        When a failure occur passport passes the message object as error */
    })(req, res, next);
});


router.post('/register', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/profile', ensureAuthenticated, (req, res) => {

    const title = 'Welcome back ';


    //User.findAll({
        //where: {
            //name: req.user.id
        //},
       // order: [
           // ['rating', 'ASC']
        //],
        //raw: true
    //}).then((user) => {


    Item.findAll({

        where: {
            userId: req.user.id
        },
        order: [
            ['itemName', 'ASC']
        ],
        raw: true
    }).then((item) => {
        // pass object to listVideos.handlebar
        res.render('profile/profile', {
            item: item, title: title  // renders views/index.handlebars

        });

    }).catch(err => console.log(err));

});



module.exports = router;