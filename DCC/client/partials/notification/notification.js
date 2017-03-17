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
        }
    }
    return factoryDefinition;
}]);

myApp.controller('NotiController', ['$scope', '$rootScope', 'NotificationService', function($scope, $rootScope, NotificationService) {
    $scope.NotiSetting = {desktop: false, email: false};
    $scope.SaveSetting = function() {
        $rootScope.userInfo.isNotificationDesktop = $scope.NotiSetting.desktop;
        $rootScope.userInfo.isNotificationEmail = $scope.NotiSetting.email;
        // $rootScope.userInfo.isNotificationSMS = $scope.NotiSetting.SMS ? 1 : 0;
        NotificationService.updateNotificationSetting().then(function (result) {
            if (result.data.success) {
                $rootScope.ShowPopupMessage("Setting saved", "success");
            }
            else {
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }
        });
    };
    $scope.getNotificationSetting = function() {
        $scope.NotiSetting.desktop = $rootScope.userInfo.isNotificationDesktop;
        $scope.NotiSetting.email = $rootScope.userInfo.isNotificationEmail;
        // $scope.NotiSetting.SMS = $rootScope.userInfo.isNotificationSMS;
    };
}]);