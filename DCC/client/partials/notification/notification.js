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
        getNumberofNewNotifications: function() {
            return $http.post('notification/notification/getNumberofNewNotifications', $rootScope.userInfo).success(function (data) { return data; });
        }
    }
    return factoryDefinition;
}]);

myApp.controller('NotiController', ['$scope', '$rootScope', 'NotificationService', function($scope, $rootScope, NotificationService) {
    function convertDate(date)
    {
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
        + " " + date.getHours() + ":" + date.getMinutes();
    }

    $scope.getNotificationsList = function(){
        NotificationService.getNumberofNewNotifications().then(function(NewNotification) {
            $rootScope.userInfo.NumberofNewNotification = NewNotification.data.data;
        });
        NotificationService.getNotifications().then(function(notifications) {
            for(var i = 0; i < notifications.data.data.length; i++)
            {
                var date  = new Date(notifications.data.data[i].time);
                notifications.data.data[i].time = convertDate(date);

            }
                
            $rootScope.userInfo.userNotifications = notifications.data.data;
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