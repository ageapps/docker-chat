'use strict';

var userController = require('./user_controller');
var debug = require('debug')('docker-chat:socketio');

var MESSAGE_TYPE = {
    control: 'control',
    message: 'message',
    typing: 'typing'
};

exports.init = function (io) {
    var connectedUsers = []; // Array with connected users' ids
    var socketMap = {}; // Map with connected user and sockets


    // start listen with socket.io
    debug('Socket Initialized');

    io.on('connection', function (socket) {
        debug('Socket Connected');

        /*
         When the user sends a chat message, publish it to everyone (including myself)
         Notice that we are getting user's name from session.
         */
        socket.on('chat', function (data) {
            debug(data);
            var msg = JSON.parse(data);
            userController.addMsg(socket.handshake.session.user.name, msg, function (sendedMessage) {
                broadcastMessage('chat', MESSAGE_TYPE.message, sendedMessage);
            });
        });
        
        /*
         When a user joins the channel, publish it to everyone (including myself)
         Notice that we are getting user's name from session.
         */
        socket.on('user', function (myName) {
            var user = socket.handshake.session.user;
            if (connectedUsers.indexOf(user._id) < 0) {
                connectedUsers.push(user._id);
                debug(`New User ${myName}:${socket.handshake.session.user.name} CONNECTED `);
                debug(`Socket User session ${JSON.stringify(socket.handshake.session.user)}`);
            }
            socketMap[socket.id] = user._id;

            debug("Number of users: " + connectedUsers.length);
            broadcastMessage('onof', MESSAGE_TYPE.control, `${connectedUsers.length}`);
            broadcastMessage('chat', MESSAGE_TYPE.control, `${user.name} joined the chat`);

            userController.getUser(user.name, function (foundUser) {
                if (foundUser && foundUser.messages) {
                    foundUser.messages.forEach(function (msg) {
                        // send them just to me
                        socket.emit('old message', msg);
                    });
                }
            });

        });

        socket.on('typing', function (isTyping) {
            var user = socket.handshake.session.user;
            //console.log('User: ' + name + " is typing " + isTyping);
            broadcastMessage('typing', MESSAGE_TYPE.typing, isTyping);
            //socket.broadcast.emit('typing', isTyping, name);
        });

        socket.on('disconnect', function () {
            if (!socketMap || !socketMap[socket.id]) {
                return;
            }
            
            debug('User ' + socketMap[socket.id] + ' DISCONNECTED');
            debug(connectedUsers.indexOf(socketMap[socket.id]) >= 0);
            var opennedSessions = 0;
           
            for ( var socketId in socketMap) {
                if (socketMap[socket.id] == socketMap[socketId]) {
                    opennedSessions++;
                }
                if (opennedSessions >= 2) {
                    break;
                }
            }
            if (opennedSessions <= 1) {
                connectedUsers.splice(connectedUsers.indexOf(socketMap[socket.id]), 1);
            }
            broadcastMessage('chat', MESSAGE_TYPE.control, `${socket.handshake.session.user.name} left the chat`);

            delete socketMap[socket.id];

            debug("Number of users: " + connectedUsers.length);
            broadcastMessage('onof', MESSAGE_TYPE.control, (connectedUsers.length));
        });

        function broadcastMessage(channel, action, msg) {
            var message = getFormatedMessage(action, msg, socket);
            debug(`Broadcast message in channel: ${channel}: ${JSON.stringify(message)}`);
            io.emit(channel, message);
        }

        function getFormatedMessage(action, msg) {
            return JSON.stringify({
                action: action,
                user: socket.handshake.session.user,
                msg: msg
            });
        }
    });
}
