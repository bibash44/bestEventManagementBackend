var express = require('express')
var router = express.Router();
var db = require('../DB/DB_CONNECTION');
var fs = require('fs');
var sql = 'select * from clients';
const path = require('path')
const multer = require('multer')

router.get('/getClients', function(req, res) {
    db.query(sql, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
})

router.post('/addClients', (req, res) => {
    var client_name = req.body.client_name;
    var image = req.body.image;
    var comment = req.body.comment;
    var company = req.body.company;

    var addClients = 'INSERT INTO clients VALUES(NULL,"' + client_name + '","' + image + '","' + comment + '","' + company + '")';
    console.log(req.body)
    db.query(addClients, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
})

//insert image
var TotalImage;
var storage = multer.diskStorage({
    destination: 'UPLOADS/images/clients',
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
router.post('/upload/image', upload.single('image'), (req, res) => {
    console.log("/upload: " + TotalImage)
    res.send(TotalImage)
});



router.put('/update/clients', (req, res) => {
    console.log(req.body)

    var id = req.body.id;
    var client_name = req.body.client_name;
    var image = req.body.image;
    var comment = req.body.comment;
    var company = req.body.company;
    var updateClients = 'UPDATE clients SET client_name="' + client_name + '",image="' + image + '", comment="' + comment + '", company="' + company + '" where id="' + id + '"';
    var selectImage = 'SELECT image FROM clients WHERE id="' + id + '"';

    var OldImage = '';
    db.query(selectImage, function(err, result, fields) {
        if (err) throw err;
        for (let index = 0; index < result.length; index++) {
            OldImage = result[index].image
        }

        if (OldImage == image) {
            console.log('old file received')
        } else {
            fs.unlink('./UPLOADS/images/clients/' + OldImage, function(err) {
                if (err) {
                    return console.log(err)
                } else {
                    console.log('old file unlinked');
                }
            })
        }

        db.query(updateClients, function(err, result, fields) {
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
    fs.unlink('./UPLOADS/images/clients/' + imageName, function(err) {
        if (err) {
            return console.log(err)
        } else {
            console.log('old file unlinked')
        }
    })

    var deleteClients = 'DELETE FROM clients WHERE id="' + id + '"';
    db.query(deleteClients, function(err, result, fields) {
        if (err) throw err;
        res.json('true')
    });
})


module.exports = router;