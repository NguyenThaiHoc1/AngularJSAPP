var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');
var passport = require('passport');
var models = require('./server/models');
var http = require('http');
var auto = require('./server/automatic');

// Init App
var app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // what is this ? It used process ldaps port 636 : open tls then use ssl in server 

// set view engine
app.use(expressLayouts);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    cookie: {
        maxAge: 10 * 24 * 3600 * 1000
    },
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

//register static dir
app.set('partials', path.join(__dirname, '/client'));
app.use(express.static(path.join(__dirname, '/client')));

//register router
app.use('/', require('./server/routes/index.js'));

//create database tables
// models.sequelize.sync({force:false});
auto.job_sendEmail.createJobSendEmail();
// Set Port
app.set('port', (process.env.PORT || 3210));
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Server started on port ' + app.get('port'));
});
module.exports = server;
