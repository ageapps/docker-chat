'use strict';

const models = require('../models');
const debug = require('debug')('docker-chat:models/user');


exports.getUser = function (username, cb) {
    models.User.findByName(username, function (err, user) {
        if (user) {
            //console.log(user.messages);
            // take only the last 5 
            if (user.messages.length > 5) {
                user.messages.splice(0, user.messages.length - 5);
            }
            debug(`Existing user ${user.name}`);
            cb(user);
        } else {
            addUser(username, cb);
        }
    });
};

exports.addMsg = function (username, msg, cb) {
    //console.log("addMsg: " + JSON.stringify(msg));
    models.User.findByName(username, function (err, user) {
        if (user) {
            var message = new models.Message({
                text: msg.text,
                createdAt: new Date(msg.createdAt)
            });
            user.addMsg(message, function (err, user) {
                cb(message);
            });
        }
    });
};

var addUser = function (userName, cb) {
    var newUser = new models.User({
        name: userName,
        messages: []
    });

    newUser.save(function (err, user) {
        if (err) return console.error(err);
        debug(`User ${user.name} saved`);
        cb(user);
    });
};
exports.uploadAvatar = function (username, file, cb) {
    models.User.findByName(username, function (err, user) {
        if (user) {
            //console.log(user.messages);
            user.avatar = file;
            user.save(function () {
                cb(user);
            });
        }
    });
};