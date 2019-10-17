var express = require('express')
var router = express.Router();
var db = require('../DB/DB_CONNECTION');
const path = require('path');
var fs = require('fs');
const multer = require('multer');

// services section in homepage
router.get('/getHomeServices', function(req, res) {
    var sqlHome = 'select * from homeServices';

    db.query(sqlHome, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });

})

router.post('/addHomeServices', (req, res) => {

    var services_title = req.body.services_title;
    var image = req.body.image;

    var addHomeServices = 'INSERT INTO home_services VALUES(NULL,"' + services_title + '","' + image + '")';
    console.log(addHomeServices)
    db.query(addHomeServices, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
})


// our SuccessStory
router.get('/getOurSuccessStory', function(req, res) {
    var sqlHome = 'select * from OurSuccessStory';

    db.query(sqlHome, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });

})

router.post('/addOurSuccessStory', (req, res) => {

    var successTitle = req.body.successTitle;
    var image = req.body.image;

    var addOurSuccessStory = 'INSERT INTO success_story VALUES(NULL,"' + successTitle + '","' + image + '")';

    db.query(addOurSuccessStory, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
})


//insert image
var SuccessImage;
var storageSuccess = multer.diskStorage({
    destination: 'uploads/images/success_story',
    filename: function(req, file, callback) {
        const ext = path.extname(file.originalname);
        SuccessImage = file.fieldname + Date.now() + ext;
        console.log("total img" + SuccessImage)
        callback(null, SuccessImage);
    }
});

var imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG)$/)) {
        return cb(newError("You can upload only image files!!!"), false);
    } else {
        cb(null, true)
    }
}

var uploadsuccess = multer({
    storage: storageSuccess,
    fileFilter: imageFileFilter,
    limits: { fileSize: 99999999 }
});
router.post('/upload/image/success', uploadsuccess.single('image'), (req, res) => {
    console.log("/upload: " + SuccessImage)
    res.send(SuccessImage)
});




module.exports = router;