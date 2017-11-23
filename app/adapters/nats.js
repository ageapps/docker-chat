var nats = require('socket.io-nats');

const nats_host = process.env.NATS_HOST || 'nats';
var server = `nats://${nats_host}:4222`;

exports.get = function () {
    return nats({
        key: 'docker-chat',
        delimiter: '/',
        uri: server,
    });
}