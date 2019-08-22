var express = require('express')
var router = express.Router();
var db = require('../DB/DB_CONNECTION');

var sql = 'select * from contact where id=1';

router.get('/getContact', function(req, res) {
    console.log('request received')
    db.query(sql, function(err, result, fields) {
        if (err) throw err;
        res.send(result)
    });

})

router.post('/add_contact', (req, res) => {
    var email = req.body.email;
    var phone_one = req.body.phone_one;
    var phone_two = req.body.phone_two;
    var map = req.body.map;
    var opening_hour = req.body.opening_hour;
    var address = req.body.address;

    var addContact = 'INSERT INTO Contact VALUES(1,"' + email + '","' + phone_one + '","' + phone_two + '","' + map + '","' + opening_hour + '","' + address + '")';
    console.log(addContact);
    db.query(addContact, function(err, result, fields) {
        if (err) throw err;
        res.json(result)
    });
})

router.put('/update/contact', (req, res) => {
    var email = req.body.email;
    var phone_one = req.body.phone_one;
    var phone_two = req.body.phone_two;
    var map = req.body.map;
    var opening_hour = req.body.opening_hour;
    var address = req.body.address;

    console.log(req.body);

    // var updateContact= 'UPDATE `contact` SET `email` = ' + email + ', `phone_one` = ' + phone_one +', `phone_two` = '+ phone_two +', `map` = ' + map +', `opening_hour` = ' + opening_hour +', `address` = '+ address +' WHERE `contact`.`id` = 1;'

    var updateContact = 'UPDATE contact SET email="' + email + '",phone_one="' + phone_one + '",phone_two="' + phone_two + '",map="' + map + '",opening_hour="' + opening_hour + '",address="' + address + '" WHERE id=1';
    console.log(updateContact);
    db.query(updateContact, function(err, result, fields) {
        if (err) throw err;
        res.send(true);
    });
})



module.exports = router;