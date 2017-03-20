'use strict';

angular.module('notification', []);

myApp.config(function ($stateProvider) {
    $stateProvider.state('notification', {
        url: "/notification",
        templateUrl: 'partials/notification/notification.html',
        controller: 'NotiController'
    });
});

myApp.factory('NotificationService',['$http','$rootScope', function($http, $rootScope) {
    var factoryDefinition = {
        updateNotificationSetting: function() {
            return $http.post('/user/userProfile/updateUserProfile', $rootScope.userInfo).success(function (data) { return data; });
        },
        getNotifications: function() {
            return $http.post('/notification/notification/getNotifications', $rootScope.userInfo).success(function (data) { return data; });            
        },
    }
    return factoryDefinition;
}]);

myApp.controller('NotiController', ['$scope', '$rootScope', 'NotificationService', function($scope, $rootScope, NotificationService) {
    function convertDate(date)
    {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
        + " " + (date.getHours() % 12 || 12) + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() 
        + ' ' + (date.getHours() >= 12 ? 'PM' : 'AM');
    }

    $scope.getNotificationsList = function(){
        NotificationService.getNotifications().then(function(notifications) {
            for(var i = 0; i < notifications.data.data.length; i++)
            {
                var date  = new Date(notifications.data.data[i].time);
                notifications.data.data[i].time = convertDate(date);

            }
                
            $rootScope.userInfo.userNotifications = notifications.data.data;
            $rootScope.userInfo.NumberofNewNotification = 0;
        });
    };

    $scope.SaveSetting = function() {
        NotificationService.updateNotificationSetting().then(function (result) {
            if (result.data.success) {
                $rootScope.ShowPopupMessage("Setting saved", "success");
            }
            else {
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }
        });
    };
}]);