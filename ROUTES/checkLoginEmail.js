var express = require('express')
var router = express.Router();
var db= require('../DB/DB_CONNECTION');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'bibashkatel4@gmail.com',
        pass: 'tejkmlnlqekzbfyq'
    },
    tls: {
        rejectUnauthorized: false
    }
});



router.post('/', function(req, res){
    var email=req.body.email;
    console.log(email)

    var emailQuery= "SELECT * FROM user WHERE email = "+'"'+email+'"';
    db.query(emailQuery, function (err, result, fields) {
        if (err){
            throw err
        }

        if(result.length>0){
            insertLoginDetails(email);
            res.send(true);
           
        }

        else{
            res.send(false);
        }
      });
})



function sendPasswordToRegisteredEmail(email, password){
    var mailOptions = {
        from: 'bibashkatel4@gmail.com',
        to: email,
        subject: 'New Password',
        text: password
            
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function insertLoginDetails(email){
    var password= Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    var date= new Date();
    var today= date.getFullYear()+'/'+date.getMonth()+'/'+date.getDay();


    var insert= "INSERT INTO `admin_login` (`id`, `email`, `password`, `login_date`) VALUES (NULL,"+'"'+email+'"'+" ,"+'"'+password+'"'+", "+'"'+today+'"'+")";
   
    db.query(insert , function (err, result, fields) {
        if (err){
            throw err
        }

        else{
            sendPasswordToRegisteredEmail(email, password);
        }

        
      });
}



module.exports=router;