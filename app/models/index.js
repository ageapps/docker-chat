var mongoose = require('mongoose');

var userSchema = require('./user')(mongoose);
var messageSchema = require('./message')(mongoose);
var roomSchema = require('./room')(mongoose);

// find user by name
userSchema.statics.findByName = function (name, cb) {
    return this.findOne({
        name: name
    }, cb);
};
// find user by name
userSchema.methods.addMsg = function (msg, cb) {
    this.messages.push(msg);
    return this.save(cb)
};

roomSchema.methods.connectedUser = function (id, cb) {
    var index = this.connected.indexOf(id);
    if (!(index > -1)) {
        this.connected.push(id);
    }
    room = this;
    this.save(function(){
        return cb(room);
    });
};
roomSchema.methods.disconnectedUser = function (id, cb) {
    var index = this.connected.indexOf(id);
    if (index > -1) {
        this.connected.splice(index, 1);
    }
    room = this;
    this.save(function () {
        return cb(room);
    });
};

roomSchema.statics.findByName = function (name, cb) {
    return this.findOne({
        name: name
    }, cb);
};

var User = mongoose.model('User', userSchema);
var Message = mongoose.model('Message', messageSchema);
var Room = mongoose.model('Room', roomSchema);

exports.User = User;
exports.Message = Message;
exports.Room = Room;