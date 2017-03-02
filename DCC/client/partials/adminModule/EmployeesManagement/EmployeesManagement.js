'use strict';

angular.module('EmployeesManagement', []);

myApp.config(function($stateProvider) {
    $stateProvider.state('EmployeesManagement', {
            url: '/EmployeesManagement',
            templateUrl: 'partials/adminModule/EmployeesManagement/EmployeesManagement.html',
            controller: 'getProfilesController',
            data:{
                auth:true
            }
    });
});

myApp.factory('EmployeesManagementService', ['$http', function($http) {
    var factoryDefinition = {
        getProfilesList: function() {
            return $http.get('/user/userProfile/getAllUsers').success(function(data) { return data; });
        }
    }

    return factoryDefinition;
}]);

myApp.controller('getProfilesController', ['$scope','$sce', 'EmployeesManagementService', function($scope,$sce, EmployeesManagementService) {
    EmployeesManagementService.getProfilesList().then(function(userData) {
        for (var i=userData.data.data.length-1; i>=0; i--) {
            if (userData.data.data[i].status != "activated")
                userData.data.data.splice(i, 1);
        }
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
            var upper_prevUser = prevUser.userType.toUpperCase();
            var upper_nextUser = nextUser.userType.toUpperCase();

            return upper_prevUser < upper_nextUser ? -1 : upper_prevUser > upper_nextUser ? 1 : 0;
        });
    };
    $scope.sortbyTeam = function() {
        $scope.UsersListSearchResult.sort(function(prevUser, nextUser) {
            var upper_prevUser = prevUser.belong2Team.toUpperCase();
            var upper_nextUser = nextUser.belong2Team.toUpperCase();

            return upper_prevUser < upper_nextUser ? -1 : upper_prevUser > upper_nextUser ? 1 : 0;
        });
    };
    $scope.sortbyName = function() {
        $scope.UsersListSearchResult.sort(function(prevUser, nextUser) {
            var upper_prevUser = prevUser.username.toUpperCase();
            var upper_nextUser = nextUser.username.toUpperCase();

            return upper_prevUser < upper_nextUser ? -1 : upper_prevUser > upper_nextUser ? 1 : 0;
        });
    };

}]);
