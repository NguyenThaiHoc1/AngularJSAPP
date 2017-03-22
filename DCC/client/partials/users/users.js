'use strict';
angular.module('users', []);

//Routers
myApp.config(function ($stateProvider) {

    //Login
    $stateProvider.state('login', {
        templateUrl: 'partials/common/loginHeader.html',
        controller: 'loginController'
    });
    //Change Password
    $stateProvider.state('changePassword', {
        templateUrl: '',
        controller: 'changePasswordController',
        data: {
            auth: true
        }
    });
    //Logout
    $stateProvider.state('logout', {
        url: "/logout",
        template: "",
        controller: 'logoutController',
        data: {
            auth: true
        }
    });
    //userProfile
    $stateProvider.state('userProfile', {
        url: "/userProfile",
        templateUrl: 'partials/users/userProfile.html',
        controller: 'userProfileCtrl',
        data: {
            auth: true
        }
    });
    //editUserProfile
    $stateProvider.state('editUserProfile', {
        url: "/editUserProfile",
        templateUrl: 'partials/users/editUserProfile.html',
        controller: 'userProfileCtrl',
        data: {
            auth: true
        }
    });
});

//Factories
myApp.factory('userServices', ['$http', '$rootScope', function ($http, $rootScope) {

    var factoryDefinitions = {
        login: function (loginReq) {
            return $http.post('/login', loginReq).success(function (data) { return data; });
        },
        logout: function () {
            return $http.get('/logout').success(function (data) { return data; });
        },

        getUserProfile: function (user) {
            return $http.post('/user/userProfile/getUserInfo', user).success(function (data) { return data; });
        },
        updateUserProfile: function (emailReq) {
            return $http.post('/user/userProfile/updateUserProfile', emailReq).success(function (data) { return data; });
        },
        checkPassword: function (user) {
            return $http.post('/user/userProfile/checkPassword', user).success(function (data) { return data });
        },
        changePasswordMD5: function (emailReq) {
            return $http.post('/user/userProfile/changePasswordMD5', emailReq).success(function (data) { return data; });
        },
        getNumberofNewNotifications: function () {
            return $http.post('/notification/notification/getNumberofNewNotification', $rootScope.userInfo).success(function (data) { return data; });
        }
    }

    return factoryDefinitions;
}
]);

//Controllers
myApp.controller('loginController', ['$scope', 'userServices', '$location', '$rootScope', function ($scope, userServices, $location, $rootScope) {
    //$scope.login = {"username":"qwe@gmail.com", "password": "qwe"};
    $scope.login = {};
    $scope.doLogin = function () {
        if ($scope.loginForm.$valid) {
            userServices.login($scope.login).then(function (result) {
                $scope.data = result;

                if (result.data.success) {
                    window.sessionStorage["userInfo"] = JSON.stringify(result.data);
                    $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                    // redirect to dashboard after login
                    if ($rootScope.userInfo.status == 'newuser') {
                        ;
                    }
                    else {
                        if ($rootScope.userInfo.role == 3) {
                            $location.path("/trainee_dashboard");
                        } else if ($rootScope.userInfo.role == 2) {
                            $location.path("/trainer_dashboard");
                        } else if ($rootScope.userInfo.role == 1) {
                            $location.path("/admin_dashboard");
                        }
                    }
                    connectSocket($rootScope.userInfo.email);
                    userServices.getNumberofNewNotifications().then(function (NewNotification) {
                        $rootScope.userInfo.NumberofNewNotification = NewNotification.data.data;
                    });
                } else {
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        }
    };
}]);
myApp.controller('changePasswordController', ['$scope', 'userServices', '$location', '$rootScope', function ($scope, userServices, $location, $rootScope) {
    $scope.changePassword = {};

    $scope.passMeasuremessage = "";
    $scope.userDetail = {};
    $scope.confirmChange = function () {
        // get user info to check password, also ensure untouched field not null when update profile
        userServices.getUserProfile($rootScope.userInfo).then(function (userData) {
            userData.data.role = $rootScope.userInfo.role;
            $rootScope.userInfo = userData.data;
            $scope.userDetail = (JSON.parse(JSON.stringify($rootScope.userInfo)));
        })

        $scope.userDetail.password = $scope.changePassword.oldPassword;
        userServices.checkPassword($scope.userDetail).then(function (result) {
            if (result.data.success) {
                $scope.userDetail.password = $scope.changePassword.newPassword;
                userServices.changePasswordMD5($scope.userDetail).then(function (result)    //call update profile service
                {
                    if (result.data.success) {
                        userServices.getUserProfile($scope.userDetail).then(function (userData) {
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
myApp.controller('logoutController', ['$scope', 'userServices', '$location', '$rootScope', function ($scope, userServices, $location, $rootScope) {
    userServices.logout().then(function () {
        sessionStorage.clear();
        $rootScope.userInfo = false;
        $rootScope.ShowPopupMessage("Logout successfully", "success");
        // redirect ro home page after logout
        $location.path("/home");
    })
}]);

myApp.controller('userProfileCtrl', ['$scope', 'userServices', '$location', '$rootScope', function ($scope, userServices, $location, $rootScope) {
    userServices.getUserProfile($rootScope.userInfo).then(function (userData) {
        userData.data.role = $rootScope.userInfo.role;
        $rootScope.userInfo = userData.data;
        $scope.userDetail = (JSON.parse(JSON.stringify($rootScope.userInfo)));
    })

    //update User Profile

    $scope.updateUserProfile = function () {
        userServices.updateUserProfile($scope.userDetail).then(function (result) {

            if (result.data.success) {
                userServices.getUserProfile($scope.userDetail).then(function (userData) {
                    $rootScope.userInfo = userData.data;
                    window.sessionStorage["userInfo"] = JSON.stringify($rootScope.userInfo);
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                    $location.path("/userProfile");
                })

            } else {
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }

        });
    };

    $scope.cancel = function () {
        // reset user infor back to original

        $rootScope.ShowPopupMessage("Ignore all changes", "info");
        $location.path("/userProfile");
    }
}]);
