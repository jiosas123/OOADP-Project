const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const moment = require('moment');
const Item = require('../models/item');
const ensureAuthenticated = require('../helpers/auth');
const fs = require('fs');
const upload = require('../helpers/imageUpload');
const Cart = require('../models/cart');

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
    let itemPrice = req.body.itemPrice;
    let Halaltype = req.body.Halaltype;
    let Vegtype = req.body.Vegtype === undefined ? '' : req.body.Vegtype.toString();
    let username = req.user.name;
    let LocationD= req.body.LocationD.toString();
    let DaysAvailable= req.body.DaysAvailable.toString();
    let dateTimeItem= date;
    let Cuisine = req.body.Cuisine
    let Quantity= req.body.Quantity;
    let timeAvailable = req.body.timeAvailable.toString();
    Item.create({
        itemName,
        posterURL,
        itemDescription,
        userId,
        Seenbyothers,
        itemPrice,
        Halaltype,
        Vegtype,
        username,
        DaysAvailable,
        LocationD,
        dateTimeItem,
        Cuisine,
        Quantity,
        timeAvailable

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
        res.redirect('/home');
    })
        .catch(err => console.log(err))

});



router.get('/buying/:id', ensureAuthenticated, (req, res) => {
    res.redirect('/video/listVideos');



    
});
function checkOptions(item) {
    // Language
    // video.chineseLang = (video.language.search('Chinese') >= 0) ? 'checked' : '';
    // video.englishLang = (video.language.search('English') >= 0) ? 'checked' : '';
    // video.malayLang = (video.language.search('Malay') >= 0) ? 'checked' : '';
    // video.tamilLang = (video.language.search('Tamil') >= 0) ? 'checked' : '';
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

    item.morning=(item.timeAvailable.search('morning') >= 0) ? 'checked' : '';
    
    item.afternoon=(item.timeAvailable.search('afternoon') >= 0) ? 'checked' : '';
    
    item.evening=(item.timeAvailable.search('evening') >= 0) ? 'checked' : '';
//timeAvalible
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
  
    let itemPrice = req.body.itemPrice;
    let Halaltype = req.body.Halaltype;
    let Vegtype = req.body.Vegtype === undefined ? '' : req.body.Vegtype.toString();
    let username = req.user.name;
    let LocationD= req.body.LocationD.toString();
    let DaysAvailable= req.body.DaysAvailable.toString();
    let dateTimeItem= date;
    let Cuisine = req.body.Cuisine;
    let Quantity = req.body.Quantity;
    let timeAvailable = req.body.timeAvailable.toString();
    
    Item.update({
        itemName,
        posterURL,
        itemDescription,
        userId,
        Seenbyothers,
    
        itemPrice,
        Halaltype,
        Vegtype,
        username,
        DaysAvailable,
        LocationD,
        dateTimeItem,
        Cuisine,
        Quantity,
        timeAvailable
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





router.get('/ShowAllCart', ensureAuthenticated, (req, res) => {

    const title = req.user.name + " Cart"
    Cart.findAndCountAll({
        where: {
            currentUser: req.user.id

        }

        , order: [
            ['itemName', 'ASC']
        ],
        raw: true
    }).then((cart) => {

        //
        Cart.findAll({
            where: {
                currentUser: req.user.id

            }

            , order: [
                ['itemName', 'ASC']
            ],
            raw: true
        }).then((cartAll) => {
            res.render('Item/CartHolder', { title: title, cart: cartAll, total: cart.count }) // renders views/index.handlebars)


        })
        //

    })







});

router.get('/addToCart/:id', ensureAuthenticated, (req, res) => {
   console.log("tyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    var itemID = req.params.id;
    Item.findOne({
        where: {
            id: itemID
        }
    }).then((item) => {

        var currentUser = req.user.id;
        let itemName = item.itemName;
        let itemDescription = item.itemDescription;
        let posterURL = item.posterURL;
        let userId = item.userId;
        let Seenbyothers = item.Seenbyothers
        let itemPrice = item.itemPrice;
        let Halaltype = item.Halaltype;
        let Vegtype = item.Vegtype;
        let username = item.name;
        let LocationD = item.LocationD;
        let DaysAvailable = item.DaysAvailable;
        let dateTimeItem = item.dateTimeItem;
        let Cuisine = item.Cuisine;
        let Quantity = item.Quantity; // this one need change 
        let timeAvailable = item.timeAvailable;

        Cart.create({
    
            itemID,
            currentUser,
            itemName,
            itemDescription,
            posterURL,
            userId,
            Seenbyothers,
            itemPrice,

            Halaltype,
            Vegtype,

            username,
            LocationD,
            DaysAvailable,
            dateTimeItem,
            Cuisine,

            Quantity,
            timeAvailable,


        }).then((cart) => {
            Item.update({
                existed: 'existed'
            }, {
                    where: {
                        id: itemID
                    }
                }).then(() => {
                    // After saving, redirect to router.get(/listVideos...) to retrieve all updated
                    // videos

                    alertMessage(res, 'success', 'item ID  ' + itemID + ' successfully Added into Cart.', 'fa fa-hand-peace-o', true);

                    res.redirect('/home');
                }).catch(err => console.log(err));


            // For icons to use, go to https://glyphsearch.com/
                    console.log("hjjhjhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
        }).catch(err => console.log(err));
    })
});

router.get('/deleteInCart/:id', ensureAuthenticated, (req, res) => {

    console.log(req.param.id+"testttttttttttttttttttttttttttttttttttttttttt")
    var itemID = req.params.id;
    Cart.findOne({
        where: {
            id: itemID
        }
    }).then((cart) => {
            console.log(cart.currentUser)
        if (cart.currentUser == req.user.id) {
            Item.update({
                existed: ''
            }, {
                    where: {
                        id: cart.itemID
                    }

                }).then((cart) => {
                    Cart.destroy({
                        where: {
                            id: itemID,
                            currentUser:req.user.id
                        }
                    }).then((cart) => {
                        // For icons to use, go to https://glyphsearch.com/
                        alertMessage(res, 'success', 'item ID ' + itemID + ' successfully deleted.', 'fa fa-hand-peace-o', true);

                        res.redirect('/item/ShowAllCart');
                    }).catch(err => console.log(err));
                })
        } else {
            // Video does not belong to the current user
            alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
            req.logout();
            res.redirect('/');
        }
    })
});

router.get('/deleteInCart2/:id', ensureAuthenticated, (req, res) => {
    
    console.log(req.param.id+"testttttttttttttttttttttttttttttttttttttttttt")
    var itemID = req.params.id;
    Cart.findOne({
        where: {
            itemID: itemID,
            currentUser:req.user.id
        }
    }).then((cart) => {
            console.log(cart.currentUser)
        if (cart.currentUser == req.user.id) {
            Item.update({
                existed: ''
            }, {
                    where: {
                        id: itemID
                    }

                }).then((cart) => {
                    Cart.destroy({
                        where: {
                            itemID: itemID,
                            currentUser:req.user.id
                        }
                    }).then((cart) => {
                        // For icons to use, go to https://glyphsearch.com/
                        alertMessage(res, 'success', 'item ID ' + itemID + ' successfully deleted.', 'fa fa-hand-peace-o', true);

                        res.redirect('/home');
                    }).catch(err => console.log(err));
                })
        } else {
            // Video does not belong to the current user
            alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
            req.logout();
            res.redirect('/');
        }
    })
});

router.get('/delete/:id', ensureAuthenticated, (req, res) => {
    var itemID = req.params.id;
    Item.findOne({
        where: {
            id: itemID
        }
    }).then((item) => {
        if (item.userId == req.user.id) {
            Item.destroy({
                where: {
                    id: itemID
                }
            }).then((item) => {
                // For icons to use, go to https://glyphsearch.com/
                alertMessage(res, 'success', 'item ID ' + itemID + ' successfully deleted.', 'fa fa-hand-peace-o', true);

                res.redirect('/item/displayUserItem');
            }).catch(err => console.log(err));
        } else {
            // Video does not belong to the current user
            alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
            req.logout();
            res.redirect('/');
        }
    })
});

router.get('/displayItemDesciption/:id',(req,res)=>{
    var itemID = req.params.id;
    Item.findOne({
        where: {
            id: itemID
        }
    }).then((item) => {
        checkOptions(item)
        res.render('Item/displayItemOnly',{
            item
        });
        
    })
});


router.put('/boughtItem/:id', (req, res) => {
    var itemID = req.params.id;       
     var amountbought = req.body.amountToBuy;
    Cart.findOne({

        where: {
            id: itemID
        }
    }).then((cart) => {

        console.log(amountbought)
        console.log(cart.Quantity)
        var final = cart.Quantity - amountbought;
        console.log(final)
        console.log('asdhahsshdshhdhs')
        Item.update({
            Quantity: final
        }, {
                where: {
                    id: cart.itemID
                }
            })
        Cart.update({
            Quantity: final
        }, {
                where: {
                    id: itemID
                }
            })

              function myFunc(arg) {	
            alertMessage(res, 'success', 'Ordered ' + amountbought +" set"+ ' of ' + cart.itemName)
            res.redirect('/item/ShowAllCart')
        }
              
              setTimeout(myFunc, 500, 'funky');
    })
})












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

const Sequelize = require('sequelize');

/*router.get("/search/ajax/:query", ensureAuthenticated, (req,res) => {
    let query = req.params.query;
    Item.findAll ({
        where:  {
            userId: req.user.id,
            itemName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("itemName")), 'LIKE', '%'+ query + '%')
        },
        order: [
            ['itemName','ASC']
        ],
        raw:true 
    }).then ((items) => {
        res.json({
            items: items
        })
        }).catch (err => console.log(err));
    })*/
    router.get("/search/ajax/:filter2", ensureAuthenticated, (req,res) => {
        let filter2 = req.params.filter2;
        Item.findAll ({
            where:  {
                Cuisine: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("Cuisine")),  filter2 )
            },
            order: [
                ['itemName','ASC']
            ],
            raw:true 
        }).then ((items) => {
            res.json({
                items: items
            })
            }).catch (err => console.log(err));
        })

    router.get("/search/ajax/:query/:filter", ensureAuthenticated, (req,res) => {
        let query = req.params.query;
        let filter = req.params.filter;
        Item.findAll ({
            where:  {
                /*userId: req.user.id,*/
                itemName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("itemName")), 'LIKE', '%'+ query + '%'),
                Cuisine: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("Cuisine")),  filter )        
                    },
            order: [
                ['itemName','ASC'],
            ],
            raw:true 
        }).then ((items) => {
            res.json({
                items: items
            })
            }).catch (err => console.log(err));
        })

router.get('/search', ensureAuthenticated, (req,res) =>
{
res.render('item/search', {});
})




module.exports = router;