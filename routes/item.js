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

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

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
    let LocationD= req.body.LocationD.toString();
    let DaysAvailable= req.body.DaysAvailable.toString();
    let dateTimeItem= date;
    let Cuisine = req.body.Cuisine
    let Quantity= req.body.Quantity;
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
        username,
        DaysAvailable,
        LocationD,
        dateTimeItem,
        Cuisine,
        Quantity

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
        res.redirect('/');
    })
        .catch(err => console.log(err))

});



router.get('/buying/:id', ensureAuthenticated, (req, res) => {
    console.log("tssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
    res.redirect('/video/listVideos');



    
});
function checkOptions(item) {
    // Language
    // video.chineseLang = (video.language.search('Chinese') >= 0) ? 'checked' : '';
    // video.englishLang = (video.language.search('English') >= 0) ? 'checked' : '';
    // video.malayLang = (video.language.search('Malay') >= 0) ? 'checked' : '';
    // video.tamilLang = (video.language.search('Tamil') >= 0) ? 'checked' : '';
//avalibility
    item.available= (item.availability.search('availability') >= 0) ? 'checked' : '';
//canBeSeenByOthers
    item.can=(item.Seenbyothers.search('Seenbyothers') >= 0) ? 'checked' : '';
// veg??
    item.vegi=(item.Vegtype.search('Veg') >= 0) ? 'checked' : '';

//days
    item.dayMonday=(item.DaysAvailable.search('Monday') >= 0) ? 'checked' : '';
    item.dayTuesday=(item.DaysAvailable.search('Tuesday') >= 0) ? 'checked' : '';
    item.dayWednesday=(item.DaysAvailable.search('Wednesday') >= 0) ? 'checked' : '';
    item.dayThursday=(item.DaysAvailable.search('Thursday') >= 0) ? 'checked' : '';
    item.dayFriday=(item.DaysAvailable.search('Friday') >= 0) ? 'checked' : '';
    item.daySaturday=(item.DaysAvailable.search('Saturday') >= 0) ? 'checked' : '';
    item.daySunday=(item.DaysAvailable.search('Sunday') >= 0) ? 'checked' : '';
//location LocationD
    item.NorthLO =(item.LocationD.search('North') >= 0) ? 'checked' : '';
    item.CentralLO =(item.LocationD.search('Central') >= 0) ? 'checked' : '';
    item.EastLO =(item.LocationD.search('East') >= 0) ? 'checked' : '';
    item.WestLO =(item.LocationD.search('West') >= 0) ? 'checked' : '';
    // Subtitles
    // video.chineseSub = (video.subtitles.search('Chinese') >= 0) ? 'checked' : '';
    // video.englishSub = (video.subtitles.search('English') >= 0) ? 'checked' : '';
    // video.malaySub = (video.subtitles.search('Malay') >= 0) ? 'checked' : '';
    // video.tamilSub = (video.subtitles.search('Tamil') >= 0) ? 'checked' : '';

    
}

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Item.findOne({
        where: {
            id: req.params.id
        }
    }).then((item) => {
        if (req.user.id == item.userId) {

            console.log("testerertererere");
            checkOptions(item);
            // call views/video/editVideo.handlebar to render the edit video page
            res.render('Item/Edit_Item', {
                item // passes video object to handlebar
            });
        } else {
            // Video does not belong to the current user
            alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
            req.logout();
            res.redirect('/');
        }
    }).catch(err => console.log(err)); // To catch no video ID
});






router.put('/saveEditedItem/:id', ensureAuthenticated, (req, res) => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;



    var itemID = req.params.id;
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
    let LocationD= req.body.LocationD.toString();
    let DaysAvailable= req.body.DaysAvailable.toString();
    let dateTimeItem= date;
    let Cuisine = req.body.Cuisine;
    let Quantity = req.body.Quantity;
    Item.update({
        itemName,
        posterURL,
        itemDescription,
        userId,
        Seenbyothers,
        availability,
        itemPrice,
        Halaltype,
        Vegtype,
        username,
        DaysAvailable,
        LocationD,
        dateTimeItem,
        Cuisine,
        Quantity
    }, {
            where: {
                id: itemID
            }
        }).then(() => {
            // After saving, redirect to router.get(/listVideos...) to retrieve all updated
            // videos
            res.redirect('/item/displayUserItem');
        }).catch(err => console.log(err));
});


















//Upload poster
router.post('/upload', ensureAuthenticated, (req, res) => {
    // Creates user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + req.user.id)) {
        fs.mkdirSync('./public/uploads/' + req.user.id);
    }

    upload(req, res, (err) => {
        if (err) {
            res.json({ file: '/img/no-image.jpg', err: err });
        } else {
            if (req.file === undefined) {
                res.json({ file: '/img/no-image.jpg', err: err });
            } else {
                res.json({ file: `/uploads/${req.user.id}/${req.file.filename}` });
            }
        }
    });
})

router.get('/displayUserItem', ensureAuthenticated, (req, res) => {

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
        res.render('Item/DisplayOnlyUser', {
            item: item
        });
    }).catch(err => console.log(err));
})

module.exports = router;