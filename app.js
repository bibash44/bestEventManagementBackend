const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const multer = require('multer')


app.use("/upload/images/", express.static("upload/images/"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

require('./DB/DB_CONNECTION');


var index= require('./ROUTES/index');
var checkLoginEmail= require('./ROUTES/checkLoginEmail');
var checkLogin= require('./ROUTES/checkLogin');
var reviews= require('./ROUTES/review');


app.use('/index', index);
app.use('/checkemail', checkLoginEmail);
app.use('/login', checkLogin);
app.use('/review', reviews)




app.use("/uploads/images/clients", express.static("uploads/images/clients"));


app.listen(1954);