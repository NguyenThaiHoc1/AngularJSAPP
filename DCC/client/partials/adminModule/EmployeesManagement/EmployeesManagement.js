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

        updateUserStatus: function(user) {    //change status to "deactivated"
            return $http.post('/user/userProfile/updateUserProfile', user).success(function (data) { return data; });
        }
    }

    return factoryDefinition;
}]);

myApp.controller('getProfilesController', ['$scope', '$rootScope', '$sce', 'EmployeesManagementService', function($scope, $rootScope, $sce, EmployeesManagementService) {
    EmployeesManagementService.getProfilesList().then(function(userData) {
        $scope.UsersList = userData.data.data;
        $scope.UsersListDisplay = $scope.UsersList;
        $scope.sortbyName();
        $scope.opt = '1';
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
            $scope.UsersListDisplay = SearchResult ? SearchResult : $scope.UsersList;
    };

    $scope.highlight = function(text, search) {
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };

    $scope.sortbyArea = function() {
        $scope.UsersListDisplay.sort(function(prevUser, nextUser) {
            var upper_prevUser = prevUser.userType.toUpperCase();
            var upper_nextUser = nextUser.userType.toUpperCase();

            return upper_prevUser < upper_nextUser ? -1 :
                   upper_prevUser > upper_nextUser ? 1 : 0;
        });
    };

    $scope.sortbyTeam = function() {
        $scope.UsersListDisplay.sort(function(prevUser, nextUser) {
            var upper_prevUser = prevUser.belong2Team.toUpperCase();
            var upper_nextUser = nextUser.belong2Team.toUpperCase();

            return upper_prevUser < upper_nextUser ? -1 :
                   upper_prevUser > upper_nextUser ? 1 : 0;
        });
    };

    $scope.sortbyName = function() {
        $scope.UsersListDisplay.sort(function(prevUser, nextUser) {
            var upper_prevUser = prevUser.username.toUpperCase();
            var upper_nextUser = nextUser.username.toUpperCase();

            return upper_prevUser < upper_nextUser ? -1 :
                   upper_prevUser > upper_nextUser ? 1 : 0;
        });
    };

    $scope.showUserActivationForm = function(user) {
        $rootScope.selectedActivationUser = user;
    };

    $scope.userListFilterCondition = function(user) {
        return ((user.status=='activated') && ($scope.opt & '1')) ||
               ((user.status=='deactivated') && ($scope.opt & '2'));
    };
}]);

myApp.controller('deactivateUserCtrl',['$scope', '$rootScope', 'EmployeesManagementService', function($scope, $rootScope, EmployeesManagementService) {
    $scope.toggleUserActivationStatus = function() {
        $rootScope.selectedActivationUser.status = ($rootScope.selectedActivationUser.status == 'activated' ?  'deactivated' : 'activated');
        EmployeesManagementService.updateUserStatus($rootScope.selectedActivationUser).then(function (result) {
            if (result.data.success) {
                if ($rootScope.selectedActivationUser.status == 'activated')
                    $rootScope.ShowPopupMessage($rootScope.selectedActivationUser.username + ' reactivated', "success");
                else
                    $rootScope.ShowPopupMessage($rootScope.selectedActivationUser.username + ' deactivated', "error");

                $rootScope.selectedActivationUser = undefined;
            }
            else {
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }
        });
    };
}]);
