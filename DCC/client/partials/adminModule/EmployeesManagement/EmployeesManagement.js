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
        },

        deactivateUser: function(user) {    //change status to "deactivated"
            return $http.post('/user/userProfile/updateUserProfile', user).success(function (data) { return data; });
        }
    }

    return factoryDefinition;
}]);

myApp.controller('getProfilesController', ['$scope', '$rootScope', '$sce', 'EmployeesManagementService', function($scope, $rootScope, $sce, EmployeesManagementService) {
    EmployeesManagementService.getProfilesList().then(function(userData) {
        $scope.UsersList = userData.data.data;
        $scope.updateActivatedUser();
        $scope.UsersListSearchResult = $scope.UsersList;
        $scope.sortbyName();
    });
    $scope.updateActivatedUser = function() {   //remove all deactivated users
        for (var i=$scope.UsersList.length-1; i>=0; i--) {
            if ($scope.UsersList[i].status != "activated")
                $scope.UsersList.splice(i, 1);
        }
    }
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
    $scope.showDeactivateUserForm = function(user) {
        $rootScope.deactivateUser = user;
    };
}]);

myApp.controller('deactivateUserCtrl',['$scope', '$rootScope', 'EmployeesManagementService', function($scope, $rootScope, EmployeesManagementService) {
    $scope.deactivateClick = function() {
        $rootScope.deactivateUser.status = 'deactivated';
        EmployeesManagementService.deactivateUser($rootScope.deactivateUser).then(function (result) {
            if (result.data.success) {
                $rootScope.ShowPopupMessage($rootScope.deactivateUser.username + ' deactivated', "success");
                $rootScope.deactivateUser = undefined;
                $scope.updateActivatedUser();
            }
            else {
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }
        });
    };
}]);
