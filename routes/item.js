const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const moment = require('moment');
const Item = require('../models/item');
const ensureAuthenticated = require('../helpers/auth');
const fs = require('fs');
const upload = require('../helpers/imageUpload');
const Cart = require('../models/cart');

const History = require('../models/history');
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
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    let itemName = req.body.itemName;
    let itemDescription = req.body.itemDescription;
    let posterURL = req.body.posterURL;
    let userId = req.user.id;
    let itemPrice = req.body.itemPrice;
    let Halaltype = req.body.Halaltype;
    let Vegtype = req.body.Vegtype === undefined ? '' : req.body.Vegtype.toString();
    let username = req.user.name;
    let LocationD = req.body.LocationD.toString();
    let DaysAvailable = req.body.DaysAvailable.toString();
    let dateTimeItem = date;
    let Cuisine = req.body.Cuisine
    let Quantity = req.body.Quantity;
    let timeAvailable = req.body.timeAvailable.toString();
    Item.create({
        itemName,
        posterURL,
        itemDescription,
        userId,

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
    if (item != null) {

        item.vegi = (item.Vegtype.search('Veg') >= 0) ? 'checked' : '';

        //days
        item.dayMonday = (item.DaysAvailable.search('Monday') >= 0) ? 'checked' : '';
        item.dayTuesday = (item.DaysAvailable.search('Tuesday') >= 0) ? 'checked' : '';
        item.dayWednesday = (item.DaysAvailable.search('Wednesday') >= 0) ? 'checked' : '';
        item.dayThursday = (item.DaysAvailable.search('Thursday') >= 0) ? 'checked' : '';
        item.dayFriday = (item.DaysAvailable.search('Friday') >= 0) ? 'checked' : '';
        item.daySaturday = (item.DaysAvailable.search('Saturday') >= 0) ? 'checked' : '';
        item.daySunday = (item.DaysAvailable.search('Sunday') >= 0) ? 'checked' : '';
        //location LocationD
        item.NorthLO = (item.LocationD.search('North') >= 0) ? 'checked' : '';
        item.CentralLO = (item.LocationD.search('Central') >= 0) ? 'checked' : '';
        item.EastLO = (item.LocationD.search('East') >= 0) ? 'checked' : '';
        item.WestLO = (item.LocationD.search('West') >= 0) ? 'checked' : '';

        item.morning = (item.timeAvailable.search('morning') >= 0) ? 'checked' : '';
        item.afternoon = (item.timeAvailable.search('afternoon') >= 0) ? 'checked' : '';
        item.evening = (item.timeAvailable.search('evening') >= 0) ? 'checked' : '';
    }
}
//need copy into josh profile
router.get('/userItem', ensureAuthenticated, (req, res) => {

    userID = req.user.id
    Item.findAll({
        where: {
            userId: userID
        }
    }).then((item) => {
        res.render('Item/UserItems', {
            item: item
        });
    })



});

//need copy into josh profile
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
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    var itemID = req.params.id;
    let itemName = req.body.itemName;
    let itemDescription = req.body.itemDescription;
    let posterURL = req.body.posterURL;
    let userId = req.user.id;

    let itemPrice = req.body.itemPrice;
    let Halaltype = req.body.Halaltype;
    let Vegtype = req.body.Vegtype === undefined ? '' : req.body.Vegtype.toString();
    let username = req.user.name;
    let LocationD = req.body.LocationD.toString();
    let DaysAvailable = req.body.DaysAvailable.toString();
    let dateTimeItem = date;
    let Cuisine = req.body.Cuisine;
    let Quantity = req.body.Quantity;
    let timeAvailable = req.body.timeAvailable.toString();


    Item.findOne({
        where: {
            id: req.params.id
        }
    }).then((it) => {
        Cart.findAll({
            where: {
                itemID: it.id
            }
        }).then((cat) => {
            for (var i = 0; i < cat.length; i++) {
                Cart.destroy({
                    where: {
                        id: cat[i].id
                    }
                })


            }//endForLoop
        })

    })

    Item.update({
        itemName,
        posterURL,
        itemDescription,
        userId,

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
        }).then((asd) => {
            //     console.log("test start")

            // for (var i = 0; i < cart.length; i++) {
            //     Cart.update({
            //         itemName,
            //         itemDescription,
            //         posterURL,
            //         userId,
            //         itemPrice,
            //         Halaltype,
            //         Vegtype,
            //         DaysAvailable,
            //         LocationD,
            //         dateTimeItem,
            //         Cuisine,
            //         Quantity,
            //         timeAvailable


            //     }, {
            //             where: {
            //                 id: cart.id
            //             }
            //         })
            // }//for loop



            function myFunc(arg) {
                alertMessage(res, 'success', 'you have successfully updated ' + itemName)
                res.redirect('/profile/profile');
            }

            setTimeout(myFunc, 500, 'funky');



            // After saving, redirect to router.get(/listVideos...) to retrieve all updated
            // videos

        }).catch(err => console.log(err));
});





router.get('/ShowAllCart', ensureAuthenticated, (req, res) => {
    // herehere
    const title = req.user.name + " Cart"
    Cart.findAndCountAll({
        where: {
            currentUser: req.user.id

        }
    }).then((cart) => {
        //
        Cart.findAll({
            where: {
                currentUser: req.user.id

            }

            , order: [
                ['dateInCart', 'DESC'],
                ['TimeInCart', 'DESC']
            ],
            raw: true
        }).then((cartAll) => {
            console.log('im here boyyyyyyyyyyyyyyyyyyyyyyyyyy')
            var today = new Date();
            var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
            // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            for (var i = 0; i < cartAll.length; i++) {
                var dd = cartAll[i].DaysAvailable
                console.log(dd)
                var numnum = dd.indexOf('(')
                var newdate = dd.substring(0, numnum)
                console.log(numnum)
                console.log(newdate)
                if (date > newdate) {
                    Item.update({
                        existed: ''
                    }, {
                            where: {
                                id: cartAll[i].itemID
                            }

                        })
                    Cart.destroy({
                        where: {
                            id: cartAll[i].id
                        }
                    })
                }
            }
        })
        function myFunc(arg) {

            Cart.findAll({
                where: {
                    currentUser: req.user.id

                }

                , order: [
                    ['dateInCart', 'DESC'],
                    ['TimeInCart', 'DESC']
                ],
                raw: true

            }).then((cartDis) => {
                console.log('asdasdasdasd')

                res.render('Item/CartHolder', { title: title, cart: cartDis, total: cart.count }) // renders views/index.handlebars)




            })
        }
        setTimeout(myFunc, 500, 'funky');




        //

    })







});
//print this
router.get('/step2AddingIntoCart/:id', ensureAuthenticated, (req, res) => {
    console.log("testherehere")


    Item.findOne({
        where: {
            id: req.params.id
        }
    }).then((item) => {
        checkOptions(item)


        res.render('Item/orderingItemDisplay', {
            item: item
        })



    })


});

//end print
router.put('/addToCart/:id', ensureAuthenticated, (req, res) => {

    var itemID = req.params.id;
    Item.findOne({
        where: {
            id: itemID
        }
    }).then((item) => {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var currentUser = req.user.id;
        let itemName = item.itemName;
        let itemDescription = item.itemDescription;
        let posterURL = item.posterURL;
        let userId = item.userId;
        let itemPrice = item.itemPrice * req.body.amountToBuy;
        let Halaltype = item.Halaltype;
        let Vegtype = item.Vegtype;
        let username = item.username;
        let LocationD = item.LocationD;
        let DaysAvailable = req.body.dayTobuy;
        let dateTimeItem = item.dateTimeItem;
        let Cuisine = item.Cuisine;
        let Quantity = req.body.amountToBuy; // this one need change 
        let timeAvailable = req.body.TimeToCollect;
        let DateInCart = date;
        let TimeInCart = time;
        Cart.create({

            itemID,
            currentUser,
            itemName,
            itemDescription,
            posterURL,
            userId,
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
            DateInCart,
            TimeInCart,

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

                    alertMessage(res, 'success', itemName + ' successfully Added into Cart.', 'fa fa-hand-peace-o', true);

                    res.redirect('/home');
                }).catch(err => console.log(err));


            // For icons to use, go to https://glyphsearch.com/
        }).catch(err => console.log(err));
    })
});

router.get('/deleteInCart/:id', ensureAuthenticated, (req, res) => {

    var itemID = req.params.id;
    Cart.findOne({
        where: {
            id: itemID
        }
    }).then((cart) => {
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
                            currentUser: req.user.id
                        }
                    }).then((cart) => {
                        // For icons to use, go to https://glyphsearch.com/

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

    var itemID = req.params.id;
    Cart.findOne({
        where: {
            itemID: itemID,
            currentUser: req.user.id
        }
    }).then((cart) => {
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
                            currentUser: req.user.id
                        }
                    }).then(() => {
                        // For icons to use, go to https://glyphsearch.com/

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



    Item.findOne({
        where: {
            id: req.params.id
        }
    }).then((it) => {
        Cart.findAll({
            where: {
                itemID: it.id
            }
        }).then((cat) => {
            for (var i = 0; i < cat.length; i++) {
                Cart.destroy({
                    where: {
                        id: cat[i].id
                    }
                })
            }//endForLoop
        })

    })





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


                function myFunc(arg) {


                    res.redirect('/profile/profile');
                }

                setTimeout(myFunc, 500, 'funky');
            }).catch(err => console.log(err));
        } else {
            // Video does not belong to the current user
            alertMessage(res, 'danger', 'Unauthorized Access.', 'fas fa-exclamation-circle', true);
            req.logout();
            res.redirect('/');
        }
    })
});

router.get('/displayItemDesciption/:id', (req, res) => {
    var itemID = req.params.id;
    Item.findOne({
        where: {
            id: itemID
        }
    }).then((item) => {
        checkOptions(item)
        res.render('Item/displayItemOnly', {
            item
        });

    })
});


router.get('/boughtItem/:id', (req, res) => {
    var itemID = req.params.id;


    Cart.findAll({
        where: {
            currentUser: req.user.id

        }
    }).then((cartAll) => {

        
        console.log('im here boyyyyyyyyyyyyyyyyyyyyyyyyyy')
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        for (var i = 0; i < cartAll.length; i++) {
            var dd = cartAll[i].DaysAvailable
            console.log(dd)
            var numnum = dd.indexOf('(')
            var newdate = dd.substring(0, numnum)
            console.log(numnum)
            console.log(newdate)
            if (date > newdate) {
                Item.update({
                    existed: ''
                }, {
                        where: {
                            id: cartAll[i].itemID
                        }

                    })
                Cart.destroy({
                    where: {
                        id: cartAll[i].id
                    }
                })
            }
        }
    })
     function myworking(arg) {
         console.log("this is secondytyttytytytytytyttytyytytytytytyt");
    Cart.findOne({

        where: {
            id: itemID
        }
    }).then((cart) => {
        if(cart){
        console.log(cart.itemID)
        Item.findOne({
            where: {
                id: cart.itemID
            }
        }).then((things) => {
            if (cart.Quantity <= things.Quantity) {


                var final = things.Quantity - cart.Quantity;
                Item.update({
                    Quantity: final,
                    existed: ''
                }, {
                        where: {
                            id: cart.itemID
                        }
                    })
                Cart.destroy({
                    where: {
                        id: itemID
                    }
                })



                Cart.findOne({
                    where: {
                        id: itemID
                    }
                }).then((found) => {
                    var totalcost = found.itemPrice
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    // var dateTime = date + ' ' + time;
                    let itemName = found.itemName;
                    let QuantityBought = found.Quantity;
                    let datePurchased = date;
                    let posterURL = found.posterURL;
                    let itemPrice = totalcost;
                    let currentUser = req.user.name;
                    let dateTime = time;
                    History.create({
                        itemName,
                        QuantityBought,
                        datePurchased,
                        itemPrice,
                        posterURL,
                        currentUser,
                        dateTime


                    })
                })
                function myFunc(arg) {
                    alertMessage(res, 'success', 'Ordered ' + cart.Quantity + " set" + ' of ' + cart.itemName, true)
                    res.redirect('/item/ShowAllCart')
                }
            
                setTimeout(myFunc, 500, 'funky');
                
            } else {
                alertMessage(res, 'danger', cart.itemName + 'Ran out of stock ', true)
                res.redirect('/item/ShowAllCart')
            }

        })
    }else{
       
    alertMessage(res,'danger','All dates before today are deleted',true)
        res.redirect('/item/showAllCart')
    }
    })

}
    setTimeout(myworking, 500, 'funky');
})


router.get('/history', ensureAuthenticated, (req, res) => {
    History.findAll({
        where: {
            currentUser: req.user.name
        },
        order: [
            ['datePurchased', 'DESC'],
            ['dateTime', 'DESC']
        ],
        raw: true
    }).then((show) => {
        res.render('Item/ShowHistory', {
            show: show
        })


    })




});

router.get('/clear', ensureAuthenticated, (req, res) => {
    Cart.findAll({
        where: {
            currentUser: req.user.id
        }


    }).then((cart) => {
        for (var p = 0; p < cart.length; p++) {
            Item.update({
                existed: ''

            }, {
                    where: {
                        id: cart[p].itemID
                    }

                })
        }
    })


    Cart.destroy({
        where: {
            currentUser: req.user.id
        }
    }).then((userCart) => {
        // for (var i = 0; i < userCart.length; i++) {
        //     Cart.destory({
        //         where: {
        //             id: userCart[i].id
        //         }
        //     })
        // }



        function myFunc(arg) {
            res.redirect('/item/showAllCart')
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
router.get("/search/ajax/:filter3", ensureAuthenticated, (req, res) => {
    let filter3 = req.params.filter3;
    Item.findAll({
        where: {
            Cuisine: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("Cuisine")), filter3)
        },
        order: [
            ['itemName', 'ASC']
        ],
        raw: true
    }).then((items) => {
        res.json({
            items: items
        })
    }).catch(err => console.log(err));
})

router.get("/search/ajax/:filter2", ensureAuthenticated, (req, res) => {
    let filter2 = req.params.filter2;
    Item.findAll({
        where: {
            Cuisine: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("Cuisine")), filter2)
        },
        order: [
            ['itemName', 'ASC']
        ],
        raw: true
    }).then((items) => {
        res.json({
            items: items
        })
    }).catch(err => console.log(err));
})

router.get("/search/ajax/:query/:filter", ensureAuthenticated, (req, res) => {
    let query = req.params.query;
    let filter = req.params.filter;
    Item.findAll({
        where: {
            /*userId: req.user.id,*/
            itemName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("itemName")), 'LIKE', '%' + query + '%'),
            Cuisine: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col("Cuisine")), filter),
            /*Cuisine: 
                {
                    [filterlist.filterlist]: filter
                }*/
        },
        order: [
            ['itemName', 'ASC'],
        ],
        raw: true
    }).then((items) => {
        res.json({
            items: items
        })
    }).catch(err => console.log(err));
})

router.get('/search', ensureAuthenticated, (req, res) => {
    res.render('item/search', {});
})




module.exports = router;