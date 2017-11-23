var rabbit = require('./rabbit');
var redis = require('./redis');
var nats = require('./nats');


exports.getAdapter = function(){
    if (!!process.env.RABBIT_HOST){
        return rabbit.get();
    }
    if (!!process.env.REDIS_HOST){
        return redis.get();
    }
    if (!!process.env.NATS_HOST){
        return nats.get();
    }
}