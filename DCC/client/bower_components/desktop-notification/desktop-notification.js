var socket = io();

function connectSocket(email) {
    var data = {
        email: email
    }
    socket.emit('sendEmail', data);
}

function pushNotification(noti) {

    webNotification.showNotification(noti.title, {
        body: noti.msg,
        onClick: function onNotificationClicked() {
            hide();
        },
        icon: '/img/logo/DEK-Logo.png',
        autoClose: 14000 //auto close the notification after 4 seconds (you can manually close it via hide function)
    }, function onShow(error, hide) {
        if (error) {
            window.alert('Unable to show notification: ' + error.message);
        } else {
            setTimeout(function hideNotification() {
                hide(); //manually close the notification (you can skip this if you use the autoClose option)
            }, 5000);
        }
    });
};

socket.on('NewNotifications', function (numberNotification) {
    if (numberNotification > 0) {
        var noti = {
            title: 'Notice',
            msg: 'You have ' + numberNotification + ' new notifcations'
        }
        pushNotification(noti);
    }

});



socket.on('pushNotification', function (noti) {
    webNotification.showNotification(noti.title, {
        body: noti.msg,
        onClick: function onNotificationClicked() {
            hide();
        },
        icon: '/img/logo/DEK-Logo.png',
        autoClose: 14000 //auto close the notification after 4 seconds (you can manually close it via hide function)
    }, function onShow(error, hide) {
        if (error) {
            window.alert('Unable to show notification: ' + error.message);
        } else {
            setTimeout(function hideNotification() {
                hide(); //manually close the notification (you can skip this if you use the autoClose option)
            }, 5000);
        }
    });
});

socket.on('error', console.error.bind(console));
socket.on('message', console.log.bind(console));
