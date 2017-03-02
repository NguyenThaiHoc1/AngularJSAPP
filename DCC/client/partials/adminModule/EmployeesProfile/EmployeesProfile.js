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

myApp.controller('getProfilesController', ['$scope','$sce', 'EmployeesProfileService', function($scope,$sce, EmployeesProfileService) {
    EmployeesProfileService.getProfilesList().then(function(userData) {
        $scope.UsersList = userData.data.data;
        $scope.UsersListSearchResult = userData.data.data;
        $scope.sortbyName();
    });
    $scope.findUser = function(userSearchKey) {
        var SearchResult = [];
        $scope.UsersList.forEach(user => {
            if ((user.username.toUpperCase().indexOf(userSearchKey.toUpperCase()) !== -1) ||
                (user.belong2Team.toUpperCase().indexOf(userSearchKey.toUpperCase()) !== -1) ||
                (user.userType.toUpperCase().indexOf(userSearchKey.toUpperCase()) !== -1) ||
                (user.dob.toUpperCase().indexOf(userSearchKey.toUpperCase()) !== -1) ||
                (user.email.toUpperCase().indexOf(userSearchKey.toUpperCase()) !== -1) ||
                (user.phone.toUpperCase().indexOf(userSearchKey.toUpperCase()) !== -1))
                    SearchResult.push(user);
        });
            $scope.UsersListSearchResult = SearchResult ? SearchResult : $scope.UsersList;
    };
    $scope.highlight = function(text, search) {
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };
    $scope.sortbyArea = function() {
        $scope.UsersListSearchResult.sort(function(prevUser, nextUser) {
            var lower_prevUser = prevUser.userType.toUpperCase();
            var lower_nextUser = nextUser.userType.toUpperCase();

            return lower_prevUser < lower_nextUser ? -1 : lower_prevUser > lower_nextUser ? 1 : 0;
        });
    };
    $scope.sortbyTeam = function() {
        $scope.UsersListSearchResult.sort(function(prevUser, nextUser) {
            var lower_prevUser = prevUser.belong2Team.toUpperCase();
            var lower_nextUser = nextUser.belong2Team.toUpperCase();

            return lower_prevUser < lower_nextUser ? -1 : lower_prevUser > lower_nextUser ? 1 : 0;
        });
    };
    $scope.sortbyName = function() {
        $scope.UsersListSearchResult.sort(function(prevUser, nextUser) {
            var lower_prevUser = prevUser.username.toUpperCase();
            var lower_nextUser = nextUser.username.toUpperCase();

            return lower_prevUser < lower_nextUser ? -1 : lower_prevUser > lower_nextUser ? 1 : 0;
        });
    };

}]);
