var express = require('express')
var router = express.Router();
var db = require('../DB/DB_CONNECTION');

var sql = 'select * from about_us';

router.get('/getAboutUs', function(req, res) {
    db.query(sql, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });

})

router.post('/addAboutUs', (req, res) => {
    var title = req.body.title;
    var content = req.body.content;

    var addAboutUs = 'INSERT INTO about_us VALUES(NULL,"' + title + '","' + content + '")';
    console.log(addAboutUs)
    db.query(addAboutUs, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
})



router.put('/update/aboutus', (req, res) => {
    console.log(req.body)

    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    var updateabout_us = 'UPDATE about_us SET title="' + title + '",content="' + content + '" where id="' + id + '"';

    db.query(updateabout_us, function(err, result, fields) {
        if (err) throw err;
        res.json(true)
    });
})



router.delete('/delete', (req, res) => {
    var id = req.body.id;
    console.log(req.body)

    var deleteabout_us = 'DELETE FROM about_us WHERE id="' + id + '"';
    db.query(deleteabout_us, function(err, result, fields) {
        if (err) throw err;
        res.json('true')
    });
})


module.exports = router;