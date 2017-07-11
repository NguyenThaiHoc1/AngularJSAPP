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
    function loginSucessDestination() {
        if ($rootScope.userInfo.status == 'newuser') {
            $('#firstPassword').modal({
                backdrop: 'static',
                keyboard: false
            })
            $('#firstPassword').modal('show');
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
    }

    $scope.CheckCookie = function () {
        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        var userEmail = getCookie("email");
        if (userEmail != "") {
            userServices.getUserProfile({ email: userEmail }).then(function (userData) {
                $rootScope.userInfo = userData.data;
                $rootScope.userInfo.role = $rootScope.userInfo.isAdmin ? 1 :
                    $rootScope.userInfo.isTrainer ? 2 :
                        $rootScope.userInfo.isTrainee ? 3 : 0;
                window.sessionStorage["userInfo"] = JSON.stringify($rootScope.userInfo);
                loginSucessDestination();
            });
        }
        if ($rootScope.userInfo) {
            $rootScope.userInfo.role = $rootScope.userInfo.isAdmin ? 1 :
                $rootScope.userInfo.isTrainer ? 2 :
                    $rootScope.userInfo.isTrainee ? 3 : 0;
        }
    }
    $scope.login = {};
    $scope.doLogin = function () {
        if ($scope.loginForm.$valid) {
            userServices.login($scope.login).then(function (result) {
                $scope.data = result;
                if (result.data.success) {
                    window.sessionStorage["userInfo"] = JSON.stringify(result.data.data);
                    $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
                    $rootScope.userInfo.role = result.data.role;
                    $rootScope.ShowPopupMessage("You Are Authenticated", "success");
                    loginSucessDestination();
                    //set the cookie to remember account
                    if ($scope.RememberMe && document.cookie) {
                        var time = new Date();
                        time.setFullYear(9999);//cookie never expires
                        document.cookie = "email=" + $rootScope.userInfo.email + ";" +
                            "expires=" + time + ";" +
                            "path=/";
                    }
                } else {
                    console.log(result.data.error);
                    $rootScope.ShowPopupMessage("Fail to Login", "error");
                }
            });
        }
    };
}]);
myApp.controller('changePasswordController', ['$scope', 'userServices', '$location', '$rootScope', function ($scope, userServices, $location, $rootScope) {
    $scope.changePassword = {};
    $scope.passMeasuremessage = "";
    $scope.confirmChange = function () {
        userServices.getUserProfile($rootScope.userInfo).then(function (userData) {
            userData.data.role = $rootScope.userInfo.role;
            $rootScope.userInfo = userData.data;
            $scope.userDetail = (JSON.parse(JSON.stringify($rootScope.userInfo)));
            $scope.userDetail.password = $scope.changePassword.oldPassword;
            userServices.checkPassword($scope.userDetail).then(function (result) {
                if (result.data.success) {
                    $scope.userDetail.password = $scope.changePassword.newPassword;
                    userServices.changePasswordMD5($scope.userDetail).then(function (result) {
                        if (result.data.success) {
                            userServices.getUserProfile($scope.userDetail).then(function (userData) {
                                $rootScope.userInfo = userData.data;
                                window.sessionStorage["userInfo"] = JSON.stringify($rootScope.userInfo);
                                $rootScope.ShowPopupMessage("Change Password Successfully", "success");
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
        });
    };
    $scope.firstPassword = {};
    $scope.firstConfirmChange = function () {
        $rootScope.userInfo.password = $scope.firstPassword.newPassword;
        userServices.changePasswordMD5($rootScope.userInfo).then(function (result) {
            if (result.data.success) {
                userServices.getUserProfile($rootScope.userInfo).then(function (userData) {
                    $rootScope.userInfo = userData.data;
                    window.sessionStorage["userInfo"] = JSON.stringify($rootScope.userInfo);
                    $rootScope.ShowPopupMessage("Change Password Successfully", "success");
                    $location.path("/userProfile");
                })
            }
            else {
                $rootScope.ShowPopupMessage("Fail to Change Password", "error");
            }
        });
    };
    //Password measurement
    $scope.passwordMeasure = function (newPassword, oldPassword) {
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
        $location.path("/home");
        //erase cookie
        document.cookie = "email=;expires=" + (Date.now() - 1000) + ";path=/";
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
                    $rootScope.ShowPopupMessage("Update User Profile Successfully", "success");
                    $location.path("/userProfile");
                })

            } else {
                $rootScope.ShowPopupMessage("Fail to Update User Profile", "error");
            }

        });
    };

    $scope.cancel = function () {
        $rootScope.ShowPopupMessage("Ignore all changes", "info");
        $location.path("/userProfile");
    };
}]);
