'use strict';

angular.module('registery', []);

//Routers
myApp.config(function ($stateProvider) {
    $stateProvider.state('registery', {
        url: '/registery',
        templateUrl: 'partials/registery/registery.html',
        controller: 'registeryCtrl'
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


    $scope.applyValue = function () {
        $scope.NewUser = {
            email: $scope.emailName,
            password: $scope.password,
            passworddAgain: $scope.passworddAgain,
            courseId: $scope.courseTypeId
        }
        if (!$scope.NewUser.email) {
            $rootScope.ShowPopupMessage('Email not null', "error");
        } else if (!$scope.NewUser.password) {
            $rootScope.ShowPopupMessage('Password not null', "error");
        } else if (!$scope.NewUser.courseId) {
            $rootScope.ShowPopupMessage('Course Type Id not null', "error");
        } else if ($scope.NewUser.password == $scope.NewUser.passworddAgain) {

            registeryServices.addUser($scope.NewUser).then(function (result) {
                if (result.data.success) {
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                    //clear fields for next inputs
                    document.getElementById("useremail").value = "";
                    document.getElementById("password").value = "";
                    document.getElementById("passwordAgain").value = "";
                    document.getElementById("courseType").value = "";
                } else {
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        } else {
            $rootScope.ShowPopupMessage('These passwords dont match', "error");
        }

    };
    $scope.clear = function () {
        document.getElementById("useremail").value = "";
        document.getElementById("password").value = "";
        document.getElementById("passwordAgain").value = "";
        document.getElementById("courseType").value = "";
    };

}]);
