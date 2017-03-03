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
myApp.factory('userServices', ['$http', function ($http) {

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
                    if ($rootScope.userInfo.role == 3) {
                        $location.path("/trainee_dashboard");
                    } else if ($rootScope.userInfo.role == 2) {
                        $location.path("/trainer_dashboard");
                    } else if ($rootScope.userInfo.role == 1) {
                        $location.path("/admin_dashboard");
                    }

                } else {
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        }
    };
}]);
myApp.controller('changePasswordController', ['$scope', 'userServices', '$location', '$rootScope', function ($scope, userServices, $location, $rootScope) {
    $scope.changePassword = {};
    $scope.confirmChange = function () {
        // get user info to check password, also ensure untouched field not null when update profile
        userServices.getUserProfile($rootScope.userInfo).then(function (userData) {
            userData.data.role = $rootScope.userInfo.role;
            $rootScope.userInfo = userData.data;
            $scope.userDetail = (JSON.parse(JSON.stringify($rootScope.userInfo)));
        })
        if ($scope.changePassword.oldPassword == $scope.userInfo.password)   //check old password
        {
            if ($scope.changePassword.newPassword == $scope.changePassword.newPasswordAgain) //check password match
            {
                $scope.userDetail.password = $scope.changePassword.newPassword;
                userServices.updateUserProfile($scope.userDetail).then(function (result)    //call update profile service
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
                $rootScope.ShowPopupMessage("Password not match, re-type please!", "error");
            }
        }
        else {
            $rootScope.ShowPopupMessage("Current password is not correct!", "error");
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
