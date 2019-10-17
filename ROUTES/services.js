var express = require('express')
var router = express.Router();
var db = require('../DB/DB_CONNECTION');
var fs = require('fs');
const path = require('path')
const multer = require('multer')



router.get('/getServices', function(req, res) {
    var sql = 'select * from services';
    db.query(sql, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
});


router.get('/get_services_type/:type', function(req, res) {
    var type= req.params.type;
    servicesType= 'select * from services where type="' + type + '"';
    db.query(servicesType, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
});


router.get('/get_by_id', function(req, res) {
    var sqlbyid = 'select * from services where id="' + req.body.id + '"';
    console.log(sqlbyid)
    db.query(sqlbyid, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });

})


router.post('/addServices', (req, res) => {
    var type = req.body.type;
    var title = req.body.title;
    var image = req.body.image;
    var description = req.body.description;

    var addServices = 'INSERT INTO services VALUES(NULL,"' + type + '","' + title + '","' + image + '","' + description + '")';

    db.query(addServices, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
})

router.put('/update/services', (req, res) => {
    console.log(req.body)

    var id = req.body.id;
    var type = req.body.type;
    var title = req.body.title;
    var image = req.body.image;
    var description = req.body.description;
    var updateServices = 'UPDATE services SET type="' + type + '",title="' + title + '",image="' + image + '",description="' + description + '" where id="' + id + '"';
    var selectImage = 'SELECT image FROM services WHERE id="' + id + '"';

    var OldImage = '';
    db.query(selectImage, function(err, result, fields) {
        if (err) throw err;
        for (let index = 0; index < result.length; index++) {
            OldImage = result[index].image
        }

        if (OldImage == image) {
            console.log('old file received')
        } else {
            fs.unlink('./uploads/images/services/' + OldImage, function(err) {
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
    fs.unlink('./images/services/' + imageName, function(err) {
        if (err) {
            return console.log(err)
        } else {
            console.log('old file unlinked')
        }
    })

    var deleteServices = 'DELETE FROM services WHERE id="' + id + '"';
    db.query(deleteServices, function(err, result, fields) {
        if (err) throw err;
        res.json('true')
    });


})




//insert image
var TotalImage;
var storage = multer.diskStorage({
    destination: 'uploads/images/services',
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