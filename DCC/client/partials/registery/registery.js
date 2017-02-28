'use strict';

angular.module('registery', []);

//Routers
myApp.config(function ($stateProvider) {
    $stateProvider.state('registery', {
        url: '/registery',
        templateUrl: 'partials/registery/registery.html'
    });

});
//Factory
myApp.factory('registeryServices', ['$http', function ($http) {

    var factoryDefinitions = {
        addUser: function (user) {
            return $http.post("/user/userProfile/addUser", user).success(function (data) { return data; });

        }
    }
    return factoryDefinitions;
}
]);
//Controllers
myApp.controller('registeryCtrl', ['$scope', '$rootScope', 'registeryServices', function ($scope, $rootScope, registeryServices) {

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

        registeryServices.addUser($scope.NewUser).then(function (result) {
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
