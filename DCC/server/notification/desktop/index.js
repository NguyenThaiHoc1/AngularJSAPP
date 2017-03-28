var io;
var onlineUsers = [];
var models = require('../../models');
function binarySearch(key, first, last) {
    var mid;
    key = key.toUpperCase();
    while (first <= last) {
        mid = Math.floor((last + first) / 2);
        if (key === onlineUsers[mid].email.toUpperCase())
            return mid;
        if (key > onlineUsers[mid].email.toUpperCase())
            first = mid + 1;
        if (key < onlineUsers[mid].email.toUpperCase())
            last = mid - 1;
    }
    return - 1;
}

var desktop = {
    send: function (receivers, subject, content, link) {
        var notification = { title: subject, msg: content };
        for (i = 0; i < receivers.length; i++) {
            var index = binarySearch(receivers[i], 0, onlineUsers.length - 1)
            if (index !== -1)
                onlineUsers[index].socket.emit('pushNotification', notification);

        }
    }
}

createServer = function (server_socket) {
    io = require('socket.io').listen(server_socket);
    io.on('connection', function (socket) {
        socket.on('disconnect', function (data) {
            for (i = 0; i < onlineUsers.length; i++) {
                if (onlineUsers[i].socket === socket) {
                    onlineUsers.splice(i, 1);
                    break;
                }
            }
        });

        // Use socket to communicate with this particular client only, sending it it's own id
        socket.on('sendEmail', function (data) {
            var item = {
                socket: socket,
                email: data.email
            };
            onlineUsers.push(item);
            //Sort list of user for optimize the search algorithm later
            models.Notifications.getNumberofNewNotification(data.email, function (notifications) {
                socket.emit('NewNotifications', notifications.count);
            });

            onlineUsers.sort(function (prevUser, nextUser) {
                var upper_prevUser = prevUser.email.toUpperCase();
                var upper_nextUser = nextUser.email.toUpperCase();
                return upper_prevUser < upper_nextUser ? -1 :
                    upper_prevUser > upper_nextUser ? 1 : 0;
            });
        });
    });
};
module.exports = desktop.send;
