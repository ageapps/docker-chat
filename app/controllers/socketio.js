'use strict';

var userController = require('./user_controller');
var roomController = require('./room_controller');
var debug = require('debug')('docker-chat:socketio');

var MESSAGE_TYPE = {
    control: 'control',
    message: 'message',
    typing: 'typing'
};


exports.init = function (io) {
    var currentRoom = {}; // Map with connected user and sockets

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
        socket.on('room', function (room) {

            var user = socket.handshake.session.user;

            userController.getUser(user.name, function (foundUser) {
                if (!foundUser) {
                    return;
                }
                if (foundUser.messages) {
                    foundUser.messages.forEach(function (msg) {
                        // send them just to me
                        socket.emit('old message', msg);
                    });
                }
                socket.user = user._id;
                debug(`Roomssss <${JSON.stringify(io.sockets.adapter.rooms)}>`);
                socket.join(room, function () {

                    var socketRoom = io.sockets.adapter.rooms[room];
                    socketRoom.name = room;
                    currentRoom.name = room;
                    debug(`User <${user.name}> joined room <${JSON.stringify(io.sockets.adapter.rooms)}>`);

                    debug(`Room used ${JSON.stringify(socketRoom)}`);
                    broadcastMessage('chat', MESSAGE_TYPE.control, `${user.name} joined the chat`);

                    roomController.getRoom(currentRoom.name, function (thisRoom) {
                        debug(`Room <${JSON.stringify(thisRoom)}>`);

                        thisRoom.connectedUser(user._id, function (room) {
                            currentRoom = room;
                            debug("Number of users: " + room.connected.length);
                            broadcastMessage('onof', MESSAGE_TYPE.control, `${room.connected.length}`);

                        });
                    });
                });

            });
        });
        

        socket.on('typing', function (isTyping) {
            var user = socket.handshake.session.user;
            //console.log('User: ' + name + " is typing " + isTyping);
            broadcastMessage('typing', MESSAGE_TYPE.typing, isTyping);
            //socket.broadcast.emit('typing', isTyping, name);
        });

        socket.on('disconnect', function () {
            var user = socket.handshake.session.user;
            if (!user) {
                return
            }
            debug('User ' + user.name + ' DISCONNECTED');
            broadcastMessage('chat', MESSAGE_TYPE.control, `${user.name} left the chat`);

            roomController.getRoom(currentRoom.name, function (thisRoom) {
                thisRoom.disconnectedUser(user._id, function (room) {
                    currentRoom = room;

                    debug("Number of users: " + room.connected.length);
                    broadcastMessage('onof', MESSAGE_TYPE.control, `${room.connected.length}`);
                });
            });
        });

        function broadcastMessage(channel, action, msg) {
            var message = getFormatedMessage(action, msg, socket);
            debug(`Broadcast message in channel: ${channel}: ${JSON.stringify(message)}`);
            io.in(currentRoom.name).emit(channel, message);
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