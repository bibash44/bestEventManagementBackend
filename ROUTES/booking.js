var express = require('express')
var router = express.Router();
var db = require('../DB/DB_CONNECTION');
const app = express();
var multer = require('multer');
const path = require('path')
var fs = require('fs');
/* for date and time of booking */
var d = new Date();
var am_pm = 'AM';
var year = d.getFullYear();
var month = d.getMonth() + 1;
var day = d.getDate();

var hour = d.getHours();
var minutes = d.getMinutes();
var seconds = d.getSeconds();

if (hour > 12) {
    am_pm = 'PM'
    hour = hour - 12;
}


var fullDate = year + '/' + month + '/' + day;
var fullTime = hour + ':' + minutes + ':' + seconds + ' ' + am_pm;

/* actual route */

router.post('/', function(req, res) {

    console.log('request received')
    console.log(req.body)

    var date = fullDate + ' at ' + fullTime;
    var username = req.body.name;
    var useremail = req.body.email;
    var userphone = req.body.phone_number;
    var prefered_location = req.body.prefered_location;
    var booked_time = date;

    var insert_booking = "INSERT INTO booking (id, username, useremail, userphone , prefered_location, booked_time) VALUES (NULL, " + '"' + username + '"' + " ," + '"' + useremail + '"' + ", " + '"' + userphone + '"' + ", " + '"' + prefered_location + '"' + ", " + '"' + booked_time + '"' + ");";

    console.log(insert_booking);

    db.query(insert_booking, function(err, result, fields) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false

            }, null, 3));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true

            }, null, 3));
        }
    });
})


router.get('/', function(req, res) {
    var select_booking = "SELECT * FROM booking ORDER BY date DESC";

    db.query(select_booking, function(err, result, fields) {
        if (err) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                database_failed: true

            }, null, 3));
        } else if (result.length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: result

            }, null, 3));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                data: result

            }, null, 3));
        }

    });
})


// uploadImage
app.use("/uploads/images/booking", express.static("upload/images/booking"))

var ImagefileName = '';
var storage = multer.diskStorage({
    destination: 'uploads/images/booking',
    filename: function(req, file, callback) {
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

router.post('/upload/image', upload.single('image'), function(req, res) {
    console.log(ImagefileName)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        image: ImagefileName
    }, null, 3));
})

router.delete('/', (req, res) => {
    var id = req.body.id;
    var imageName = req.body.image;
    console.log(req.body)
    console.log(imageName)
    fs.unlink('./UPLOADS/images/booking/' + imageName, function(err) {
        if (err) {
            return console.log(err)
        } else {
            console.log('old file unlinked')
        }
    })

    var deletebooking = 'DELETE FROM booking WHERE id="' + id + '"';
    db.query(deletebooking, function(err, result, fields) {
        if (err) throw err;
        res.json('true')
    });
})

module.exports = router;