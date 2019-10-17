var express = require('express')
var router = express.Router();
var db = require('../DB/DB_CONNECTION');
var fs = require('fs');
const path = require('path')
const multer = require('multer')


var sql = 'select * from sliding_image';



//  image slider
router.get('/getImageSlider', function(req, res) {
    db.query(sql, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });

})

//insert sliding image
var TotalImage;
var storage = multer.diskStorage({
    destination: 'uploads/images/sliding_image',
    filename: function(req, file, callback) {
        const ext = path.extname(file.originalname);
        TotalImage = file.fieldname + Date.now() + ext;
        console.log("total img" + TotalImage)
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
router.post('/upload/image/sliding', upload.single('image'), (req, res) => {
    console.log("/upload: " + TotalImage)
    res.send(TotalImage)
});


router.post('/addImageSlider', (req, res) => {
    var image = req.body.image;
    var slider_title = req.body.slider_title;
    var sub_title = req.body.sub_title;

    var addImageSlider = 'INSERT INTO sliding_image VALUES(NULL,"' + image + '","' + slider_title + '","' + sub_title + '")';

    db.query(addImageSlider, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
});

router.put('/update/slidingImage', (req, res) => {
    console.log(req.body)

    var id = req.body.id;
    var image = req.body.image;
    var slider_title = req.body.slider_title;
    var sub_title = req.body.sub_title;
    var updateSlidingImage = 'UPDATE sliding_image SET image="' + image + '",slider_title="' + slider_title + '",sub_title="' + sub_title + '" where id="' + id + '"';
    var selectImage = 'SELECT image FROM sliding_image WHERE id="' + id + '"';

    var OldImage = '';
    db.query(selectImage, function(err, result, fields) {
        if (err) throw err;
        for (let index = 0; index < result.length; index++) {
            OldImage = result[index].image
        }

        if (OldImage == image) {
            console.log('old file received')
        } else {
            fs.unlink('./uploads/images/sliding_image/' + OldImage, function(err) {
                if (err) {
                    return console.log(err)
                } else {
                    console.log('old file unlinked');
                }
            })
        }

        db.query(updateSlidingImage, function(err, result, fields) {
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
    fs.unlink('./uploads/images/sliding_image/' + imageName, function(err) {
        if (err) {
            return console.log(err)
        } else {
            console.log('old file unlinked')
        }
    })

    var deleteSlidingImage = 'DELETE FROM sliding_image WHERE id="' + id + '"';
    db.query(deleteSlidingImage, function(err, result, fields) {
        if (err) throw err;
        res.json('true')
    });


})

module.exports = router;