var express = require('express')
var router = express.Router();
var db = require('../DB/DB_CONNECTION');
var fs = require('fs');
var sql = 'select * from portfolio';

const path = require('path')
const multer = require('multer')

router.get('/getPortfolio', function(req, res) {
    db.query(sql, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });

})

router.get('/get_portfolio_type/:type', function(req, res) {
    var type= req.params.type;
    portfolioType= 'select * from portfolio where type="' + type + '"';
    db.query(portfolioType, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
});

router.post('/addPortfolio', (req, res) => {
    var type = req.body.type;
    // var imageTitle = req.body.imageTitle;
    var image = req.body.image;

    var addPortfolio = 'INSERT INTO portfolio VALUES(NULL,"' + type + '","' + image + '")';
    console.log(addPortfolio)
    db.query(addPortfolio, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
})

//insert image
var TotalImage;
var storage = multer.diskStorage({
    destination: 'UPLOADS/images/portfolio',
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

router.put('/update/portfolio', (req, res) => {
    console.log(req.body)

    var id = req.body.id;
    var type = req.body.type;
    var image = req.body.image;
    var updatePortfolio = 'UPDATE portfolio SET type="' + type + '",image="' + image + '" where id="' + id + '"';
    var selectImage = 'SELECT image FROM portfolio WHERE id="' + id + '"';

    var OldImage = '';
    db.query(selectImage, function(err, result, fields) {
        if (err) throw err;
        for (let index = 0; index < result.length; index++) {
            OldImage = result[index].image
        }

        if (OldImage == image) {
            console.log('old file received')
        } else {
            fs.unlink('./UPLOADS/images/portfolio/' + OldImage, function(err) {
                if (err) {
                    return console.log(err)
                } else {
                    console.log('old file unlinked');
                }
            })
        }

        db.query(updatePortfolio, function(err, result, fields) {
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
    fs.unlink('./UPLOADS/images/portfolio/' + imageName, function(err) {
        if (err) {
            return console.log(err)
        } else {
            console.log('old file unlinked')
        }
    })

    var deletePortfolio = 'DELETE FROM portfolio WHERE id="' + id + '"';
    db.query(deletePortfolio, function(err, result, fields) {
        if (err) throw err;
        res.json('true')
    });


})

module.exports = router;