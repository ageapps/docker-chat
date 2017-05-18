var mongoose = require('mongoose');

var userSchema = require('./user')(mongoose);
var messageSchema = require('./message')(mongoose);

// find user by name
userSchema.statics.findByName = function(name, cb) {
    return this.findOne({
        name: name
    }, cb);
};
// find user by name
userSchema.methods.addMsg = function(msg, cb) {
    this.messages.push(msg);
    return this.save(cb)
};

var User = mongoose.model('User', userSchema);
var Message = mongoose.model('Message', messageSchema);

exports.User = User;
exports.Message = Message;