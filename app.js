const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const multer = require('multer')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

require('./DB/DB_CONNECTION');


var index= require('./ROUTES/index');
var checkLoginEmail= require('./ROUTES/checkLoginEmail');
var checkLogin= require('./ROUTES/checkLogin');

app.use('/index', index);
app.use('/checkemail', checkLoginEmail);
app.use('/login', checkLogin);


app.listen(1954);