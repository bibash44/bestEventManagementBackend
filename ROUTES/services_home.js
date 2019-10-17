var express = require('express')
var router = express.Router();
var db = require('../DB/DB_CONNECTION');
var fs = require('fs');
const path = require('path')
const multer = require('multer')

var sql = 'select * from home_services';

router.get('/getServices', function(req, res) {
    db.query(sql, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });

})
router.get('/get_by_id', function(req, res) {
    var sqlbyid = 'select * from home_services where id="' + req.body.id + '"';
    console.log(sqlbyid)
    db.query(sqlbyid, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });

})


router.post('/addHomeServices', (req, res) => {
    var services_title = req.body.services_title;
    var image = req.body.image;

    var addServices = 'INSERT INTO home_services VALUES(NULL,"' + services_title + '","' + image + '")';

    db.query(addServices, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
})

router.put('/update/services_home', (req, res) => {
    console.log(req.body)

    var id = req.body.id;
    var services_title = req.body.services_title;
    var image = req.body.image;
    var updateServices = 'UPDATE home_services SET services_title="' + services_title + '",image="' + image + '" where id="' + id + '"';
    var selectImage = 'SELECT image FROM home_services WHERE id="' + id + '"';

    var OldImage = '';
    db.query(selectImage, function(err, result, fields) {
        if (err) throw err;
        for (let index = 0; index < result.length; index++) {
            OldImage = result[index].image
        }

        if (OldImage == image) {
            console.log('old file received')
        } else {
            fs.unlink('./uploads/images/services_home/' + OldImage, function(err) {
                if (err) {
                    return console.log(err)
                } else {
                    console.log('old file unlinked');
                }
            })
        }

        db.query(updateServices, function(err, result, fields) {
            if (err) throw err;
            res.json(true)
        });

    });
})

router.delete('/delete', (req, res) => {
    var id = req.body.id;
    var imageName = req.body.image;
    console.log(req.body)
    console.log(imageName)
    fs.unlink('./uploads/images/services_home/' + imageName, function(err) {
        if (err) {
            return console.log(err)
        } else {
            console.log('old file unlinked')
        }
    })

    var deleteServices = 'DELETE FROM home_services WHERE id="' + id + '"';
    db.query(deleteServices, function(err, result, fields) {
        if (err) throw err;
        res.json('true')
    });


})




//insert image
var TotalImage;
var storage = multer.diskStorage({
    destination: 'uploads/images/services_home',
    filename: function(req, file, callback) {
        const ext = path.extname(file.originalname);
        TotalImage = file.fieldname + Date.now() + ext;
        console.log("total img " + TotalImage)
        callback(null, TotalImage);
    }
});

var imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG)$/)) {
        return cb(newError("You can upload only image files!!!"), false);
    } else {
        cb(null, true)
    }
}

var upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 99999999 }
});
router.post('/upload/image', upload.single('image'), (req, res) => {
    console.log("/upload: " + TotalImage)
    res.send(TotalImage)
});


module.exports = router