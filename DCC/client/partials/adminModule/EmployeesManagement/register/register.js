'use strict';

angular.module('register', []);
//Routers
myApp.config(function ($stateProvider) {
    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'partials/register/registerModal.html'
    });

});
//Factory
myApp.factory('registerServices', ['$http', function ($http) {

    var factoryDefinitions = {
        addUser: function (user) {
            return $http.post("/user/userProfile/addUser", user).success(function (data) { return data; });

        },
    }
    return factoryDefinitions;
}
]);
//Controllers
myApp.controller('registerCtrl', ['$scope', '$rootScope', 'registerServices', function ($scope, $rootScope, registerServices) {

    $scope.userEmail = '';
    $scope.userPassword = '';
    $scope.passwordAgain = '';
    $scope.courseTypeId = "Intern";
    $scope.passMeasuremessage = "";

    $scope.applyValue = function () {
        var randomstring = Math.random().toString(36).slice(-8);
        $scope.NewUser = {
            email: $scope.userEmail,
            username: $scope.userName,
            password: randomstring,
            team: $scope.team,
            userType: 'Intern'
        };
        registerServices.addUser($scope.NewUser).then(function (result) {
            if (result.data.success) {
                $rootScope.ShowPopupMessage(result.data.msg, "success");
                $scope.userEmail = '';
                username: $scope.userName = '';
                $scope.userPassword = '';
                $scope.passwordAgain = '';
                $scope.team = '';
                $scope.courseTypeId = "Intern";
            } else {
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }
        });
        var email = {
            subject: 'Resgister Noti',
            content: 'you are now registered!',
            listOfReceiver: [$scope.userEmail]
        }
    }
    $scope.passwordMeasure = function (newPassword, userEmail) {
        // validate user password to ensure its security strength
        if (newPassword != null) {
            if (newPassword.length > 7) {
                var passStrenght = 0;
                if (newPassword.match(/[a-z]/) != null) { passStrenght = passStrenght + 1; }
                if (newPassword.match(/[A-Z]/) != null) { passStrenght = passStrenght + 1; }
                if (newPassword.match(/\d+/) != null) { passStrenght = passStrenght + 1; }
                if (newPassword.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/) != null) { passStrenght = passStrenght + 1; }
                if (passStrenght > 2) {
                    var accountName = userEmail.split('@')[0];
                    if (newPassword.match(accountName) == null) {
                        $scope.passStrengthError = false;
                    }
                    else {
                        $scope.passMeasuremessage = 'Password should not contain account name!';
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
