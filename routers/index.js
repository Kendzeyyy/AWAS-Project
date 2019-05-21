'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const sharp = require('sharp');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fileRouters = require('./fileRouter');
const users = require('./users');
const File = require ('../models/fileUpload');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const { ensureAuthenticated, notAuthenticated } = require('../config/auth');

// Passport config
require('../config/passport')(passport);


const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');
const options = {
    key: sslkey,
    cert: sslcert
};


console.log(process.env);

// storage to /public/uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // callback
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        // rename the image name with fieldname and date
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// init upload----------------------------------------------------------------------------------------------------------
const upload = multer ({
    storage: storage,
}).single('image');

// Connect to mongodb---------------------------------------------------------------------------------------------------
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/admin`, { useNewUrlParser: true }).then(() => {
    console.log('Connected successfully.');
    https.createServer(options, app).listen(process.env.APP_PORT);        // Local
}, err => {
    console.log('Connection to db failed :( ' + err);
});

// https redirection----------------------------------------------------------------------------------------------------
app.use((req, res, next) => {
    if (req.secure) {
        next();
    } else {
        res.redirect('https://' + req.headers.host + req.url);
    }
});

// Upload---------------------------------------------------------------------------------------------------------------
app.post('/upload', function(req, res, next){
    upload(req, res, (err) => {
        if(err){
            res.send(err);
        } else{
            if (req.file === undefined){
                res.sendStatus(404);
            } else {
                console.log(req.file);
                next();
            }
        }
    });
});

app.post('/upload', (req, res) => {
    const body = req.body;
    const file = req.file;
    console.log(body);
    console.log(body.path + body.filename);
    //console.log('User ' + req.user.username);
    File.create({
        uploader: req.body.user,
        title: body.title,
        category: body.category,
        description: body.description,
        location: body.location,
        imageurl: file.path,
        imagename: file.filename
    });
    res.redirect('/');
});

//PUG-------------------------------------------------------------------------------------------------------------------

app.get('/', notAuthenticated, (req, res) => {
    //res.redirect('/home');
    res.render('index.pug', {title: 'Home', message: 'Welcome!'});
});

app.get('/home', ensureAuthenticated, (req, res) => {
    console.log('Home page');
    res.render('index.pug', {title: 'Home', message: 'Welcome ' + req.user.username, user: req.use});
});


// Middleware
app.set('view engine', 'pug');
app.enable('trust proxy');
app.use('/file', fileRouters);
app.use('/users', users);
app.use(express.static('public'));
app.use(express.static('modules'));
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());
// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

