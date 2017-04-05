'use strict';

angular.module('notification', []);

myApp.config(function ($stateProvider) {
    $stateProvider.state('notification', {
        url: "/notification",
        templateUrl: 'partials/notification/notification.html',
        controller: 'NotiController'
    });
});

myApp.factory('NotificationService', ['$http', '$rootScope', function ($http, $rootScope) {
    var factoryDefinition = {
        updateNotificationSetting: function () {
            return $http.post('/user/userProfile/updateUserProfile', $rootScope.userInfo).success(function (data) { return data; });
        },
        getNotifications: function () {
            return $http.post('/notification/notification/getNotifications', $rootScope.userInfo).success(function (data) { return data; });
        },
        UpdateNotificationStatus: function (notification) {
            return $http.post('/notification/notification/updateNotificationStatus', notification).success(function (data) { return data; });
        },
        getCoursebyName: function(CourseName) {
            return $http.post('/trainee/courseRegister/getCoursebyName', {name: CourseName}).success(function (data) { return data; });
        }
    }
    return factoryDefinition;
}]);

myApp.controller('NotiController', ['$scope', '$rootScope', '$location', '$state', '$anchorScroll', 'NotificationService', function ($scope, $rootScope, $location, $state, $anchorScroll, NotificationService) {
    $scope.Dates = Array.from(Array(31), (val, index) => index + 1);
    function convertDate(date) {
        var hour = date.getHours();
        var minute = date.getMinutes();
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
            + " " + (hour % 12 || 12) + ":" + (minute < 10 ? '0' : '') + minute
            + ' ' + (hour >= 12 ? 'PM' : 'AM');
    }

    Date.prototype.setDay = function (dayOfWeek) {
        this.setDate(this.getDate() - this.getDay() + dayOfWeek);
    };

    $scope.getNotificationsList = function () {
        NotificationService.getNotifications().then(function (notifications) {
            for (var i = 0, j = notifications.data.data.length - 1; i < j; i++ , j--) {
                var temp = notifications.data.data[i];
                notifications.data.data[i] = notifications.data.data[j];
                notifications.data.data[j] = temp;
            }

            for (var i = 0; i < notifications.data.data.length; i++) {
                var date = new Date(notifications.data.data[i].time);
                notifications.data.data[i].time = convertDate(date);
            }

            $rootScope.userInfo.userNotifications = notifications.data.data;
            $rootScope.userInfo.NumberofNewNotification = 0;
        });
    };

    $scope.SyncNotificationSetting = function () {
        $rootScope.userInfo.TimeOption = $rootScope.userInfo.TimeOption ? (new Date($rootScope.userInfo.TimeOption)) : (new Date());
        $rootScope.userInfo.WeekdayOption = $rootScope.userInfo.TimeOption.getDay();
        $rootScope.userInfo.DateOption = $rootScope.userInfo.TimeOption.getDate();
    };

    $scope.SaveSetting = function () {
        if ($rootScope.userInfo.isNotificationEmail) {
            switch ($rootScope.userInfo.EmailPeriod) {
                case 'Daily':   //This case has been handled synchronously
                    break;

                case 'Weekly':
                    $rootScope.userInfo.TimeOption.setDay($rootScope.userInfo.WeekdayOption);
                    break;

                case 'Monthly':
                    $rootScope.userInfo.TimeOption.setDate($rootScope.userInfo.DateOption);
                    break;

                // case 'Custom':   //not handled yet

                //     break;
                default:
                    $rootScope.userInfo.TimeOption = new Date();    //set to current time if other case happen
                    break;
            }
        }
        NotificationService.updateNotificationSetting().then(function (result) {
            if (result.data.success) {
                $rootScope.ShowPopupMessage("Settings saved", "success");
            }
            else {
                $rootScope.ShowPopupMessage("Fail to Update Settings", "error");
            }
        });
    };

    $scope.UpdateNotificationStatus = function (notification) {
        NotificationService.UpdateNotificationStatus(notification).then(function () {
            var link = notification.reference.split("/");
            if (link != null) {
                switch (link[0]){
                    case 'trainee_dashboard':
                        $state.go('trainee_dashboard').then(function() {
                            $location.hash(link[1]);
                            $anchorScroll(link[1]);
                        });
                        break;

                    case 'courseDetail':
                        NotificationService.getCoursebyName(link[1]).then(function(res) {
                            $state.go('courseDetail', {courseId: res.data.course.id}).then(function() {
                                $location.hash(link[1]);
                                $anchorScroll(link[1]);
                            });
                        });
                        break;
                    
                    case 'trainee_courseRegister':
                        $state.go('trainee_courseRegister').then(function() {
                                $location.hash(link[1]);
                                $anchorScroll(link[1]);
                        });
                        break;
                        
                    default:
                        $state.go('home');
                }
            }
        });
    }
}]);