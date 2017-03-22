'use strict';

angular.module('first_Password', []);

//Routers
myApp.config(function ($stateProvider) {
    $stateProvider.state('first_Password', {
        url: '/first_Password',
        templateUrl: 'partials/common/newUser/firstPassword.html',
        data: {
            auth: true
        },
    });
});

//factory
myApp.factory('firstPasswordServices', ['$http', function ($http) {
    var factoryDefinitions = {
        checkPassword: function (user) {
            return $http.post('/user/userProfile/checkPassword', user).success(function (data) { return data });
        },
        getUserProfile: function (user) {
            return $http.post('/user/userProfile/getUserInfo', user).success(function (data) { return data; });
        },
        updateUserProfile: function (emailReq) {
            return $http.post('/user/userProfile/updateUserProfile', emailReq).success(function (data) { return data; });
        }
    }
    return factoryDefinitions;
}]);

//Controllers
myApp.controller('firstPasswordController', ['$scope', 'firstPasswordServices', '$location', '$rootScope', function ($scope, firstPasswordServices, $location, $rootScope) {
    $scope.firstPassword = {};

    $scope.passMeasuremessage = "";
    $scope.userDetail = {};
    $scope.confirmChange = function () {
        // get user info to check password, also ensure untouched field not null when update profile
        firstPasswordServices.getUserProfile($rootScope.userInfo).then(function (userData) {
            userData.data.role = $rootScope.userInfo.role;
            $rootScope.userInfo = userData.data;
            $scope.userDetail = (JSON.parse(JSON.stringify($rootScope.userInfo)));
        })

        $scope.userDetail.password = $scope.firstPassword.oldPassword;
        firstPasswordServices.checkPassword($scope.userDetail).then(function (result) {
            if (result.data.success) {
                $scope.userDetail.password = $scope.firstPassword.newPassword;
                firstPasswordServices.changePasswordMD5($scope.userDetail).then(function (result)    //call update profile service
                {
                    if (result.data.success) {
                        firstPasswordServices.getUserProfile($scope.userDetail).then(function (userData) {
                            $rootScope.userInfo = userData.data;
                            window.sessionStorage["userInfo"] = JSON.stringify($rootScope.userInfo);
                            $rootScope.ShowPopupMessage(result.data.msg, "success");
                            $location.path("/userProfile");
                        })
                    }
                    else {
                        $rootScope.ShowPopupMessage(result.data.msg, "error");
                    }
                });
            }
            else {
                $rootScope.ShowPopupMessage("Current password is not correct!", "error");
            }
        })
    };
    //Password measurement
    $scope.passwordMeasure = function (newPassword, oldPassword) {
        // validate user password to ensure its security strength
        if (newPassword != null) {
            if (newPassword.length > 7) {
                var passStrenght = 0;
                if (newPassword.match(/[a-z]/) != null) { passStrenght = passStrenght + 1; }
                if (newPassword.match(/[A-Z]/) != null) { passStrenght = passStrenght + 1; }
                if (newPassword.match(/\d+/) != null) { passStrenght = passStrenght + 1; }
                if (newPassword.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/) != null) { passStrenght = passStrenght + 1; }
                if (passStrenght > 2) {
                    if (newPassword != oldPassword) {
                        var accountName = $scope.userInfo.email.split('@')[0];
                        if (newPassword.match(accountName) == null) {
                            $scope.passStrengthError = false;
                        }
                        else {
                            $scope.passMeasuremessage = 'Password should not contain account name!';
                            $scope.passStrengthError = true;
                        }
                    }
                    else {
                        $scope.passMeasuremessage = 'Old password and new password should not be the same!';
                        $scope.passStrengthError = true;
                    }
                }
                else {
                    $scope.passMeasuremessage = 'Password must contain at least 3 out of 4 character types : uppercase, lowercase, number and symbol';
                    $scope.passStrengthError = true;
                }
            }
            else {
                $scope.passMeasuremessage = 'Password must have at least 8 characters!';
                $scope.passStrengthError = true;
            }
        }
        else {
            $scope.passMeasuremessage = 'Password must not be left null!';
        }
    };
}]);