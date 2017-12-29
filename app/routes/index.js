var express = require('express');
var router = express.Router();
var path = require('path');
var os = require("os");
var fs = require("fs");
var userController = require('../controllers/user_controller');
var debug = require('debug')('docker-chat:routes');
const multer = require('multer')
const storage_volume = process.env.STORAGE_VOLUME || '/uploads';
const avatar_path = '/avatars';
const upload_location = path.join(storage_volume, avatar_path);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', upload_location))
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        cb(null, file.fieldname.replace(/\W+/g, '-').toLowerCase() + '-' + Date.now() + ext)
    }
})

if (!fs.existsSync(storage_volume)) {
    fs.mkdirSync(storage_volume);
    if (!fs.existsSync(upload_location)) {
        fs.mkdirSync(upload_location);
    }
}

var upload = multer({
    storage: storage
})



/* GET home page. */
router.get('/', function (req, res, next) {
    if (!req.session.user) {
        res.redirect(path.join('/', url_prefix, '/login'));
    } else {
        res.render('index', {
            title: 'SocketIO Chat Demo',
            number_connected: req.userCount,
            host: os.hostname(),
            parse: process.env.PARSE_MSG
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

/* POST avatar. */
router.post('/avatar', upload.single('avatar'), function (req, res, next) {
    if (!req.session.user) {
        res.redirect(path.join('/', url_prefix, '/login'));
    } else {
        let file = path.join(avatar_path, req.file.filename);
        userController.uploadAvatar(req.session.user.name, file, function (user) {
            req.session.user = user;
            res.redirect('/');
        });
    }
});


/* GET logout page. */
router.get('/logout', function (req, res, next) {
    delete req.session.user;
    res.redirect(path.join('/', url_prefix, '/'));
});

router.get('/healthcheck', function (req, res, next) {
    res.send(200);
});

module.exports = router;