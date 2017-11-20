'use strict';

var models = require('../models');
var debug = require('debug')('docker-chat:models/room');


var createRoom = function (name, cb) {
    var newRoom = new models.Room({
        name: name
    });
    newRoom.save(function (err, room) {
        if (err) return console.error(err);
        debug(`Chat ${room.name} saved`);
        cb(room);
    });
};
exports.getRoom = function (name, cb) {

    models.Room.findByName(name, function (err, room) {
        if (room) {
            debug(`Existing chat ${room.name}`);
            cb(room);
        } else {
            createRoom(name, cb);
        }
    });
};

