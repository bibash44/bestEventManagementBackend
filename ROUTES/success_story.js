var express = require('express')
var router = express.Router();
var db = require('../DB/DB_CONNECTION');
var fs = require('fs');
const path = require('path')
const multer = require('multer')

var sql = 'select * from success_story';

router.get('/getSuccessStory', function(req, res) {
    db.query(sql, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });

})
router.get('/get_by_id', function(req, res) {
    var sqlbyid = 'select * from success_story where id="' + req.body.id + '"';
    console.log(sqlbyid)
    db.query(sqlbyid, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });

})


router.post('/addSuccessStory', (req, res) => {
    var title = req.body.title;
    var image = req.body.image;

    console.log(req.body)

    var addSuccessStory = 'INSERT INTO success_story VALUES(NULL,"' + image + '","' + title + '")';

    db.query(addSuccessStory, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
})

router.put('/update', (req, res) => {
    console.log(req.body)

    var id = req.body.id;
    var title = req.body.title;
    var image = req.body.image;
    var updateSuccessStory = 'UPDATE success_story SET title="' + title + '",image="' + image + '" where id="' + id + '"';
    var selectImage = 'SELECT image FROM success_story WHERE id="' + id + '"';

    var OldImage = '';
    db.query(selectImage, function(err, result, fields) {
        if (err) throw err;
        for (let index = 0; index < result.length; index++) {
            OldImage = result[index].image
        }

        if (OldImage == image) {
            console.log('old file received')
        } else {
            fs.unlink('./UPLOADS/images/success_story/' + OldImage, function(err) {
                if (err) {
                    return console.log(err)
                } else {
                    console.log('old file unlinked');
                }
            })
        }

        db.query(updateSuccessStory, function(err, result, fields) {
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
    fs.unlink('./UPLOADS/images/success_story/' + imageName, function(err) {
        if (err) {
            return console.log(err)
        } else {
            console.log('old file unlinked')
        }
    })

    var deleteSuccessStory = 'DELETE FROM success_story WHERE id="' + id + '"';
    db.query(deleteSuccessStory, function(err, result, fields) {
        if (err) throw err;
        res.json('true')
    });
})




//insert image
var TotalImage;
var storage = multer.diskStorage({
    destination: 'UPLOADS/images/success_story',
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