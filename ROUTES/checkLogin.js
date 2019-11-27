var express = require('express')
var router = express.Router();
var db= require('../DB/DB_CONNECTION');
var nodemailer = require('nodemailer');
router.post('/', function(req, res){
    var email=req.body.email;
    var password= req.body.password;


    var emailQuery= "SELECT * FROM admin_login WHERE email="+'"'+email+'" && password='+'"'+password+'"';

    db.query(emailQuery, function (err, result, fields) {
        if (err){
            throw err
        }

        else if(result.length>0){
            res.send(true)
        }

        else{
            res.send(false)
        }

      });
})



module.exports= router;