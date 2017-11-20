module.exports = function (mongoose) {
    var roomSchema = mongoose.Schema({
        name: String,
        connected: {
            type: [String],
            default: []
        }
    }, {
            timestamps: true
        });
    return roomSchema;
}
