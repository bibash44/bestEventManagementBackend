var express = require('express')
var router = express.Router();
var db= require('../DB/DB_CONNECTION');

var sql= 'select * from user';

router.get('/', function(req, res){
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.json(result)
      });
    
})



module.exports=router;