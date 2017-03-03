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

    $scope.applyValue = function () {
        $scope.NewUser = {
            email: $scope.userEmail,
            password: $scope.userPassword,
            passworddAgain: $scope.passwordAgain,
            courseId: $scope.courseTypeId
        };

        registerServices.addUser($scope.NewUser).then(function (result) {
            if (result.data.success) {
                $rootScope.ShowPopupMessage(result.data.msg, "success");
                $scope.userEmail = '';
                $scope.userPassword = '';
                $scope.passwordAgain = '';
                $scope.courseTypeId = "Intern";
            } else {
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }
        });

    }
        ;
}]);
