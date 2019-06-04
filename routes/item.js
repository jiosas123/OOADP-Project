const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const moment = require('moment');
const Item = require('../models/item');
const ensureAuthenticated = require('../helpers/auth');
const fs = require('fs');
const upload = require('../helpers/imageUpload');


router.get('/addItem', ensureAuthenticated, (req, res) => {

    const testung = req.user.id;

    res.render('item/addItem', { // pass object to listVideos.handlebar

        testung: testung


    });
});

router.post('/addItem', ensureAuthenticated, (req, res) => {
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



    let itemName = req.body.itemName;
    let itemDescription = req.body.itemDescription;
    let posterURL = req.body.posterURL;
    let userId = req.user.id;
    let Seenbyothers = req.body.Seenbyothers === undefined ? '' : req.body.Seenbyothers.toString();
    let availability = req.body.availability === undefined ? '' : req.body.availability.toString();
    let itemPrice = req.body.itemPrice;
    let Halaltype = req.body.Halaltype;
    let Vegtype = req.body.Vegtype === undefined ? '' : req.body.Vegtype.toString();
    let username = req.user.name;
    console.log(userId)
    Item.create({
        itemName,
        posterURL,
        itemDescription,
        userId,
        Seenbyothers,
        availability,
        itemPrice,
        Halaltype,
        Vegtype,
        username

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



router.get('/buying/:id', ensureAuthenticated, (req, res) => {
    console.log("tssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
    res.redirect('/video/listVideos');
});


// Upload poster
// router.post('/upload', ensureAuthenticated, (req, res) => {
//     console.log("tester22222222222222222")
//     // Creates user id directory for upload if not exist
//     if (!fs.existsSync('./public/uploads/' + req.user.id)) {
//         fs.mkdirSync('./public/uploads/' + req.user.id);
//     }

//     upload(req, res, (err) => {
//         if (err) {
//             res.json({ file: '/img/no-image.jpg', err: err });
//         } else {
//             if (req.file === undefined) {
//                 res.json({ file: '/img/no-image.jpg', err: err });
//             } else {
//                 res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
//             }
//         }
//     });
// })


module.exports = router;