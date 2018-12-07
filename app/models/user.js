module.exports = function(mongoose) {
  var messageSchema = require('./message')(mongoose);

    var userSchema = mongoose.Schema({
        name: String,
        avatar: String,
        messages: [messageSchema]
    }, {
        timestamps: true,
        usePushEach: true,
    });
    return userSchema;
}
