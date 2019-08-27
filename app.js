const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const multer = require('multer')


app.use("/upload/images/", express.static("upload/images/"));
app.use("/UPLOADS/images/services", express.static("UPLOADS/images/services"));
app.use("/UPLOADS/images/portfolio", express.static("UPLOADS/images/portfolio"));
app.use("/UPLOADS/images/clients", express.static("UPLOADS/images/clients"));
app.use("/UPLOADS/images/services_home", express.static("UPLOADS/images/services_home"));
app.use("/UPLOADS/images/sliding_image", express.static("UPLOADS/images/sliding_image"));
app.use("/UPLOADS/images/success_story", express.static("UPLOADS/images/success_story"));
app.use("/UPLOADS/images/clients", express.static("UPLOADS/images/clients"));
app.use("/UPLOADS/images/clients", express.static("uploads/images/clients"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());

require('./DB/DB_CONNECTION');


var index= require('./ROUTES/index');
var checkLoginEmail= require('./ROUTES/checkLoginEmail');
var checkLogin= require('./ROUTES/checkLogin');
var reviews= require('./ROUTES/review');

var clients = require('./ROUTES/clients');
var contact = require('./ROUTES/contact');
var home = require('./ROUTES/home');
var portfolio = require('./ROUTES/portfolio');
var services = require('./ROUTES/services');
var aboutus = require('./ROUTES/aboutus');
var services_home = require('./ROUTES/services_home');
var sliding_image = require('./ROUTES/sliding_image');
var success_story = require('./ROUTES/success_story');
var booking= require('./ROUTES/booking');

/* routes for frontend for front end */
app.use('/index', index);
app.use('/checkemail', checkLoginEmail);
app.use('/login', checkLogin);
app.use('/review', reviews)
app.use('/clients', clients);
app.use('/contact', contact);
app.use('/home', home);
app.use('/portfolio', portfolio);
app.use('/services', services);
app.use('/aboutus', aboutus);
app.use('/services_home', services_home);
app.use('/sliding_image', sliding_image);
app.use('/success_story', success_story);
app.use('/booking', booking);



/* routes for backend */




app.listen(1954);