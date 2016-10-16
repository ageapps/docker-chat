var app = require('../app');
var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'SocketIO Chat Demo',
        number_connected: req.userCount
    });
});

module.exports = router;
