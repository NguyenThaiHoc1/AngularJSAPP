var io;
var onlineUsers = [];

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
        });

        socket.on('sendNoti', function (data) {
            for (i = 0; i < onlineUsers.length; i++) {
                if (onlineUsers[i].email === data.email) {
                    onlineUsers[i].socket.emit('pushNoti', data.noti);
                    break;
                }
            }
        });
    });
}
