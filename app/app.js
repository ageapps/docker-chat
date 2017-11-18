var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express_session = require('express-session');
var routes = require('./routes/index');
var mongoose = require('mongoose');

var app = express();

var connectedUsers = []; // Array with connected users
app.socketMap = {}; // Map with connected user and sockets

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

var session = express_session({
    secret: "SocketIoExample",
    resave: false,
    saveUninitialized: true
});

app.use(session);
app.session = session;
app.use(express.static(path.join(__dirname, 'public')));

var port = process.env.DB_PORT || '27017';
var host = process.env.DB_HOST || 'db';
var mongo_pass = process.env.MONGO_PASSWORD || '';
var mongo_user = process.env.MONGO_USERNAME || '';
var mongo_db = process.env.MONGO_DATABASE || '';

var url = 'mongodb://' + mongo_user + ':' + mongo_pass + '@' + host + ':' + port + '/' + mongo_db;
/**
 * Initialize the connection.
 * @method init
 **/
mongoose.connect(url, {
    server: {
        autoReconnect: true,
        reconnectTries: 30,
        reconnectInterval: 1000
    }
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB to: " + url);
});


app.use(function (req, res, next) {
    res.locals.userCount = connectedUsers.length;
    res.locals.session = req.session;
    next();
});
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});




// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;