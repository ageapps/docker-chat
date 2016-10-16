module.exports = function(mongoose) {
    var messageSchema = mongoose.Schema({
        text: String
    }, {
        timestamps: true
    });
    return messageSchema;
}
