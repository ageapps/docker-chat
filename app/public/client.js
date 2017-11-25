$(document).ready(function () {
    var socket = io();
    var myname;
    var defaultRoom = 'default';
    var parseMessages = !!$('#parse-flag').text();

    console.log("Parse messages " + parseMessages);

    if ($('#user_name').text()) {
        myName = $('#user_name').text();
        sendMessage('room', defaultRoom)
    } else {
        window.location.replace("/logout");
    }
    $('#avatar-image').click(function(){
        $("#avatar").click();
    })
    $('#chat_input').submit(function () {
        if ($('#m').val() && $('#m').val() != "") {
            var date = new Date();
            var message = {
                text: $('#m').val(),
                createdAt: date.toString()
            };
            sendMessage('chat', message)
            // appendMessage(true, message);
            $('#m').val('');
        }
        return false;
    });


    $("#avatar").change(function () {
        $("#avatar_submit").click();
    });

    socket.on('connect', function () {
        console.log('connected');
    });
    socket.on('connecting', function () {
        console.log('connecting');
    });
    socket.on('disconnect', function () {
        console.log('disconnect');
    });
    socket.on('connect_failed', function () {
        console.log('connect_failed');
    });
    socket.on('error', function (err) {
        console.log('error: ' + err);
    });
    socket.on('reconnect_failed', function () {
        console.log('reconnect_failed');
    });
    socket.on('reconnect', function () {
        console.log('reconnected ');
    });
    socket.on('reconnecting', function () {
        console.log('reconnecting');
    });

    socket.on('old_message', function (_data) {
        console.log('old message: ')
        console.log(_data);
        var msg = getMessage(_data);

        $("#old_messages_container").css("display", "block");
        appendOldMessage(msg);
    });
    socket.on('onof', function (_data) {
        var msg = getMessage(_data);
        console.log('onof: ' + msg);
        $('#users_connected').text(msg);
    });

    socket.on('chat', function (_data) {
        console.log('chat');
        var data = parseData(_data);
        var name = data.user.name;
        console.log(name + " me: " + myName);
        appendMessage(name == myName, data, name);
    });

    socket.on('typing', function (_data) {
        console.log('typing');
        var data = parseData(_data);
        var text = ""
        if (data.msg) {
            text = data.user.name + " is typing..."
        }
        $('#user_typing').text(text);
    });



    //setup before functions
    var typingTimer; //timer identifier
    var doneTypingInterval = 3000; //time in ms, 5 second for example
    var $input = $('#m');
    var main_container = $('div#messages_container');
    var old_container = $('div#old_messages_container');
    var writing = false;

    //on keyup, start the countdown
    $input.on('keyup', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    //on keydown, clear the countdown
    $input.on('keydown', function () {
        if (!writing) {
            writing = true;
            sendMessage('typing',true);
        }
        clearTimeout(typingTimer);
    });

    function stringifyData(data) {
        if (parseMessages) {
            return JSON.stringify(data);
        }
        return data;
    }
    function parseData(data) {
        if (parseMessages) {
            return JSON.parse(data);
        }
        return data;
    }

    function getMessage(data) {
        return parseData(data).msg;
    }

    function sendMessage(channel, msg) {
        var message = getFormatedMessage(msg);
        console.log(` Send Message in channel: ${channel}: ${JSON.stringify(message)}`);
        socket.emit(channel, message);
    }

    function getFormatedMessage(msg) {
        return stringifyData({
            msg: msg
        });
    }
    function appendMessage(mine, data, name) {

        var panelType = "";
        var person = "me";
        var time = "";

        var day = new Date(data.msg.createdAt);
        time = day.getHours() + ":" + day.getMinutes();
        if (!mine) {
            panelType = "_dark";
            person = name;
        }

        var struct = main_container.find('li.' + data.action + ':first');

        if (struct.length < 1) {
            console.log("Could not handle: " + data.msg.text);
            return;
        }

        // get a new message view from struct template
        var messageView = struct.clone();
        var text = '';
        if (data.action === 'control') {
            text = data.msg;
            var today = new Date();
            time = today.getHours() + ":" + today.getMinutes();
            panelType = "";
        } else {
            text = data.msg.text;
        }
        // contents
        messageView.find('.chat_hour').text(time);
        messageView.find('.chat_text').text(text);
        messageView.find('.chat_person').text(person);

        messageView.addClass(panelType);
        messageView.find('.direct-chat-text').addClass('direct-chat-text' + panelType);
        // append to container and scroll
        main_container.find('#new-messages').append(messageView.show());
        main_container.scrollTop(main_container.find('ul').innerHeight());
    }

    function appendOldMessage(msg) {
        var day = new Date(msg.createdAt);
        var time = day.getHours() + ":" + day.getMinutes();
        var person = "me";

        var struct = old_container.find('li' + ':first');

        if (struct.length < 1) {
            console.log("Could not handle: " + msg);
            return;
        }

        // get a new message view from struct template
        var messageView = struct.clone();

        // contents
        messageView.find('.chat_hour').text(time);
        messageView.find('.chat_text').text(msg.text);
        messageView.find('.chat_person').text(person);

        // append to container
        old_container.find('ul').append(messageView.show());
    }

    //user is "finished typing," do something
    function doneTyping() {
        sendMessage('typing', false);
        writing = false;
    }
});