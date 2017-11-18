var express = require('express');
var router = express.Router();
var path = require('path');
var os = require("os");
var userController = require('../controllers/user_controller');
var debug = require('debug')('docker-chat:routes');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        res.render('index', {
            title: 'SocketIO Chat Demo',
            number_connected: req.userCount,
            host: os.hostname()
        });
    }
});

/* POST home page. */
router.post('/', function (req, res, next) {
    user = req.body.user;
    debug('User: ' + user + " LOGIN");
    userController.getUser(user, function (foundUser) {
        debug(foundUser.name);
        req.session.user = foundUser;
        res.redirect('/');
    });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.render('login', {
            title: 'SocketIO Chat Demo',
            host: os.hostname()
        });
    }
});

/* GET logout page. */
router.get('/logout', function (req, res, next) {
    delete req.session.user;
    res.redirect('/');
});

router.get('/healthcheck', function (req, res, next) {
    res.send(200);
});

module.exports = router;