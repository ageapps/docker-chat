const redis = require('socket.io-redis');
const redis_host = process.env.REDIS_HOST || 'redis';
const redis_port = process.env.REDIS_PORT || '6379';

exports.get = function () {
    return redis({
        host: redis_host,
        port: redis_port
    });
}