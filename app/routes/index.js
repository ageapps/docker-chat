var express = require('express');
var router = express.Router();
var path = require('path');
var os = require("os");

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', {
        title: 'SocketIO Chat Demo',
        number_connected: req.userCount,
        host: os.hostname()
    });
});

module.exports = router;
