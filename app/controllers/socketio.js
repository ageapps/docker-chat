'use strict';

const userController = require('./user_controller');
const roomController = require('./room_controller');
const debug = require('debug')('docker-chat:socketio');

const MESSAGE_TYPE = {
    control: 'control',
    message: 'message',
    typing: 'typing'
};

const parseMessages = !!process.env.PARSE_MSG;

const parseData = function (data) {
    if (parseMessages) {
        return JSON.parse(data);
    }
    return data;
}
const stringifyData = function (data) {
    if (parseMessages) {
        return JSON.stringify(data);
    }
    return data;
}

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
            var msg = getMessage(data);
            debug(`Chat message: ${JSON.stringify(msg)}`);
            userController.addMsg(socket.handshake.session.user.name, msg, function (sendedMessage) {
                sendMessage('chat', MESSAGE_TYPE.message, sendedMessage);
            });
        });

        /*
        When a user joins the channel, publish it to everyone (including myself)
        Notice that we are getting user's name from session.
        */
        socket.on('room', function (data) {
            const room = getMessage(data);
            const user = socket.handshake.session.user;

            socket.user = user._id;
            debug(`Roomssss <${JSON.stringify(io.sockets.adapter.rooms)}>`);
            socket.join(room, function () {

                var socketRoom = io.sockets.adapter.rooms[room];
                socketRoom.name = room;
                currentRoom.name = room;
                debug(`User <${user.name}> joined room <${JSON.stringify(io.sockets.adapter.rooms)}>`);

                debug(`Room used ${JSON.stringify(socketRoom)}`);
                sendMessage('chat', MESSAGE_TYPE.control, `${user.name} joined the chat`);

                roomController.getRoom(currentRoom.name, function (thisRoom) {

                    thisRoom.connectedUser(user._id, function (room) {
                        currentRoom = room;
                        debug(`Room <${JSON.stringify(room)}>`);
                        debug("Number of users: " + room.connected.length);
                        sendMessage('onof', MESSAGE_TYPE.control, `${room.connected.length}`);

                        userController.getUser(user.name, function (foundUser) {
                            if (!foundUser) {
                                return;
                            }
                            if (foundUser.messages) {
                                foundUser.messages.forEach(function (msg) {
                                    // send them just to me
                                    sendMessage('old_message', MESSAGE_TYPE.message, msg);
                                });
                            }
                        });

                    });
                });
            });

        });


        socket.on('typing', function (data) {
            var user = socket.handshake.session.user;
            //console.log('User: ' + name + " is typing " + isTyping);
            sendMessage('typing', MESSAGE_TYPE.typing, getMessage(data));
            //socket.broadcast.emit('typing', isTyping, name);
        });

        socket.on('disconnect', function () {
            var user = socket.handshake.session.user;
            if (!user) {
                return
            }
            debug('User ' + user.name + ' DISCONNECTED');
            sendMessage('chat', MESSAGE_TYPE.control, `${user.name} left the chat`);

            roomController.getRoom(currentRoom.name, function (thisRoom) {
                thisRoom.disconnectedUser(user._id, function (room) {
                    currentRoom = room;

                    debug("Users: " + room.connected);
                    debug("Number of users: " + room.connected.length);
                    sendMessage('onof', MESSAGE_TYPE.control, `${room.connected.length}`);
                });
            });
        });

        function sendMessage(channel, action, msg) {
            var message = getFormatedMessage(action, msg, socket);
            debug(`Broadcast message in channel: ${channel}: ${JSON.stringify(message)}`);
            io.in(currentRoom.name).emit(channel, message);
        }

        function getFormatedMessage(action, msg) {
            return stringifyData({
                action: action,
                user: socket.handshake.session.user,
                msg: msg
            });
        }

        function getMessage(data) {
            return parseData(data).msg;
        }
    });
}