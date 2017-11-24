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
    if (this.connected.length === 0) {
        this.connected.push({
            id: id,
            number: 1
        });
    } else {
        for (i = 0; i < this.connected.length; i++) {
            if (this.connected[i].id === id) {
                this.connected[i].number = this.connected[i].number + 1;
                break;
            } else {
                this.connected.push({
                    id: id,
                    number: 1
                });
                break;
            }
        }
    }
    const room = this;
    this.save(function () {
        return cb(room);
    });
};
roomSchema.methods.disconnectedUser = function (id, cb) {

    for (i = 0; i < this.connected.length; i++) {
        if (this.connected[i].id === id) {
            if (this.connected[i].number > 1) {
                this.connected[i].number = this.connected[i].number - 1;
            } else {
                this.connected.splice(i, 1);
            }
        }
    }
    const room = this;
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