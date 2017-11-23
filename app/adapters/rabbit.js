var amqp = require('socket.io-amqp');
const rabbit_host = process.env.RABBIT_HOST || 'rabbit';

exports.get = function () {
    return amqp(`amqp://${rabbit_host}`, {
        prefix: 'docker-chat',
        useInputExchange: true,
        channelSeperator: '/',
        queueName: ''
    });
}