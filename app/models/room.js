module.exports = function (mongoose) {
    var roomSchema = mongoose.Schema({
        name: String,
        connected: {
            type: [{
                id: String,
                number: Number
            }],
            default: []
        }
    }, {
            timestamps: true
        });
    return roomSchema;
}
