'use strict';

angular.module('register', []);
//Routers
myApp.config(function ($stateProvider) {
    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'partials/register/register.html'
    });

});
//Factory
myApp.factory('registerServices', ['$http', function ($http) {

    var factoryDefinitions = {
        addUser: function (user) {
            return $http.post("/user/userProfile/addUser", user).success(function (data) { return data; });

        }
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
    $scope.passMeasuremessage="";

    $scope.applyValue = function () {
        $scope.NewUser = {
            email: $scope.userEmail,
            password: $scope.userPassword,
            passworddAgain: $scope.passwordAgain,
            team: $scope.team,
            courseId: 'Intern'
        };
        registerServices.addUser($scope.NewUser).then(function (result) {
            if (result.data.success) {
                $rootScope.ShowPopupMessage(result.data.msg, "success");
                $scope.userEmail = '';
                $scope.userPassword = '';
                $scope.passwordAgain = '';
                $scope.team = '';
                $scope.courseTypeId = "Intern";
            } else {
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }
        });
    }
    $scope.passwordMeasure = function (newPassword) {
        // validate user password to ensure its security strength
        if(newPassword != null)
        {
            if(newPassword.match(/\d+/) != null)
            {
                if(( newPassword.match(/[a-z]/) != null ) && ( newPassword.match(/[A-Z]/) != null))
                {
                    if(newPassword.length > 7)
                    {
                        $scope.passStrengthError = false;
                    }
                    else
                    {
                        $scope.passMeasuremessage = 'Password should be at least 8 in length!';
                        $scope.passStrengthError = true;
                    }
                }
                else
                {
                    $scope.passMeasuremessage = 'Password should at least include 1 lower case char and 1 upper case char!';
                    $scope.passStrengthError = true;
                }
            }
            else
            {
                $scope.passMeasuremessage = 'Password should at least include one number!';
                $scope.passStrengthError = true;
            }
        }
        else
        {
            $scope.passMeasuremessage = 'This field should not be left empty!';
        }
     };
        ;
}]);
