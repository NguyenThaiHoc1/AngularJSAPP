'use strict';

angular.module('EmployeesProfile', []);

myApp.config(function($stateProvider) {
    $stateProvider.state('EmployeesProfile', {
            url: '/EmployeesProfile',
            templateUrl: 'partials/adminModule/EmployeesProfile/EmployeesProfile.html',
            controller: 'getProfilesController',
            data:{
                auth:true
            }
    });
});

myApp.factory('EmployeesProfileService', ['$http', function($http) {
    var factoryDefinition = {
        getProfilesList: function() {
            return $http.get('/user/userProfile/getAllUsers').success(function(data) { return data; });
        }
    }

    return factoryDefinition;
}]);

myApp.controller('getProfilesController', ['$scope', 'EmployeesProfileService', function($scope, EmployeesProfileService) {
    EmployeesProfileService.getProfilesList().then(function(userData) {
        $scope.UsersList = userData.data.data;
    });
}])
