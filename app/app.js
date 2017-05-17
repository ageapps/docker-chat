var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var HashMap = require('hashmap');
var routes = require('./routes/index');

var app = express();

// Set up socket.io in server
app.io = require('socket.io')();
app.users = new HashMap(); // Array with connected user

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
app.use(express.static(path.join(__dirname, 'public')));

// static imports
//  (web).../assets  == /bower_components (server)
app.use('/assets', express.static(__dirname + '/bower_components'));
app.use('/socket', express.static(__dirname + '/node_modules/socket.io-client/'));


app.use(function(req, res, next) {
    res.locals.userCount = app.users.count();
    next();
});
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});




// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// start listen with socket.io
app.io.on('connection', function(socket) {
    var userController = require('./controllers/user_controller');
    console.log('Connected');


    socket.on('chat message', function(msg) {
        if (!app.users.get(socket)) {
            app.io.to(socket.id).emit('not connected');
            return;
        }
        userController.addMsg(app.users.get(socket), msg, function(sendedMessage) {
            // console.log(sendedMessage);
            socket.broadcast.emit('chat message', sendedMessage, app.users.get(socket));
        });
    });
    socket.on('typing', function(isTyping, name) {
        //console.log('User: ' + name + " is typing " + isTyping);
        socket.broadcast.emit('typing', isTyping, name);
    });

    socket.on('new user', function(user) {
        console.log('User: ' + user + " CONNECTED");
        app.users.set(socket, user);
        console.log("Number of users: " + app.users.count());
        app.io.emit('connection on off', (app.users.count()));
        userController.newUser(user, function(messages) {
            if (messages) {
                messages.forEach(function(msg) {
                    // send them just to me
                    app.io.to(socket.id).emit('old message', msg, app.users.get(socket));
                });
            }
        });
    });


    socket.on('disconnect', function() {
        console.log('User ' + app.users.get(socket) + ' DISCONNECTED');
        app.users.remove(socket);
        console.log("Number of users: " + app.users.count());
        app.io.emit('connection on off', (app.users.count()));
    });
});


module.exports = app;
