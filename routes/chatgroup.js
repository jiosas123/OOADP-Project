const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const moment = require('moment');
const Chat = require('../models/chatting');
const ensureAuthenticated = require('../helpers/auth');
const fs = require('fs');
const upload = require('../helpers/imageUpload');


router.post('/chats', ensureAuthenticated, (req, res) => {

    const testung = req.user.id;

    //res.render('chatting/chattingsystem', { // pass object to listVideos.handlebar

        //testung: testung


    //});

 
});

router.post('/chatss', ensureAuthenticated, (req, res) => {
    /*
    let title = req.body.title;
    let story = req.body.story.slice(0, 1999);
    let dateRelease = moment(req.body.dateRelease, 'DD/MM/YYYY');
    let language = req.body.language.toString();
    let subtitles = req.body.subtitles === undefined ? '' : req.body.subtitles.toString();
    let classification = req.body.classification;
    let userId = req.user.id;
    let starring = req.body.starring;
    let posterURL = req.body.posterURL;
    */
    // Multi-value components return array of strings or undefined

    var rating = rating;

    let message = req.body.message;
    let output = req.body.output;
    let username = req.user.name;
    let feedback = req.user.feedback;
    //console.log(username)
    Chat.create({
        output,
        message,
        username,
        feedback,
        rating

        /*
        title,
        story,
        classification,
        language,
        subtitles,
        dateRelease,
        userId,
        starring,
        posterURL
        */


    }).then((item) => {
        res.redirect('/video/listVideos');
    })
        .catch(err => console.log(err))

});

router.get('/chatss/:id', ensureAuthenticated, (req, res) => {
    console.log("zssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
    res.redirect('/video/listVideos');
});

router.get('/',(req,res)=>{
    res.render('index')
});


module.exports = router;