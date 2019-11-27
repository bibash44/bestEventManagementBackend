var express = require('express')
var router = express.Router();
var db = require('../DB/DB_CONNECTION');
const app = express();
var multer = require('multer');
const path = require('path')
var fs = require('fs');

/* for date and time of comment */


/* actual route */

router.post('/', function (req, res) {

    var image = req.body.image;
    console.log(req.body);
    var insert_comment = "INSERT INTO `clients` (`id` , `image`) VALUES (NULL, " + '"' + image + '"' + ");";

    db.query(insert_comment, function (err, result, fields) {
        if (err) {
            console.log(err)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                database_failed: true

            }, null, 3));
        }

        else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true

            }, null, 3));
        }
    });
})


router.get('/', function (req, res) {
    var select_comment = "SELECT * FROM `clients` ";

    db.query(select_comment, function (err, result, fields) {
        
        if (err) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                database_failed: true

            }, null, 3));
        }

        else if (result.length > 0) {
            res.json(result);
        }
      

    });
})


// uploadImage
app.use("/uploads/images/clients", express.static("upload/images/clients"))

var ImagefileName = '';
var storage = multer.diskStorage({
    destination: 'uploads/images/clients',
    filename: function (req, file, callback) {
        const extension = path.extname(file.originalname);
        ImagefileName = file.fieldname + Date.now() + extension;
        callback(null, ImagefileName);

    }
});


var imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("You can upload only image files!"), false);
    }
    cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 10000000
    }
});

router.post('/upload/image', upload.single('image'), function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        image: ImagefileName
    }, null, 3));
}
)

router.delete('/', (req, res) => {
    var id = req.body.id;
    var imageName = req.body.image;
    fs.unlink('./uploads/images/clients/' + imageName, function (err) {
        if (err) {
            return console.log(err)
        } else {
            console.log('old file unlinked')
        }
    })

    var deleteReviews = 'DELETE FROM review WHERE id="' + id + '"';
    db.query(deleteReviews, function (err, result, fields) {
        if (err) throw err;
        res.json('true')
    });
})

module.exports = router;