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

        updateUserStatus: function(user) {
            return $http.post('/user/userProfile/updateUserProfile', user).success(function (data) { return data; });
        }
    }

    return factoryDefinition;
}]);

myApp.controller('getProfilesController', ['$scope', '$rootScope', '$sce', 'EmployeesManagementService', function($scope, $rootScope, $sce, EmployeesManagementService) {
    EmployeesManagementService.getProfilesList().then(function(userData) {
        $scope.UsersList = userData.data.data;
        $scope.sortbyName();
        $scope.opt = '1';
    });

    $scope.highlight = function(text, search) {
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };

    $scope.sortbyArea = function() {
        $scope.UsersList.sort(function(prevUser, nextUser) {
            var upper_prevUser = prevUser.userType.toUpperCase();
            var upper_nextUser = nextUser.userType.toUpperCase();

            return upper_prevUser < upper_nextUser ? -1 :
                   upper_prevUser > upper_nextUser ? 1 : 0;
        });
    };

    $scope.sortbyTeam = function() {
        $scope.UsersList.sort(function(prevUser, nextUser) {
            var upper_prevUser = prevUser.belong2Team.toUpperCase();
            var upper_nextUser = nextUser.belong2Team.toUpperCase();

            return upper_prevUser < upper_nextUser ? -1 :
                   upper_prevUser > upper_nextUser ? 1 : 0;
        });
    };

    $scope.sortbyName = function() {
        $scope.UsersList.sort(function(prevUser, nextUser) {
            var upper_prevUser = prevUser.username.toUpperCase();
            var upper_nextUser = nextUser.username.toUpperCase();

            return upper_prevUser < upper_nextUser ? -1 :
                   upper_prevUser > upper_nextUser ? 1 : 0;
        });
    };

    $scope.sortbyStatus = function() {
        var head = 0, tail = $scope.UsersList.length - 1;
        var statusValues = ($scope.UsersList.sortOrder == 1) ? ['deactivated', 'activated'] : ['activated','deactivated'];
        while(head < tail) {
            while ($scope.UsersList[head].status == statusValues[0]) head++;
            while ($scope.UsersList[tail].status == statusValues[1]) tail--;
            //swap
            if (head < tail) {
                var temp = $scope.UsersList[head];
                $scope.UsersList[head] = $scope.UsersList[tail];
                $scope.UsersList[tail] = temp;
            }
        }
        $scope.UsersList.sortOrder = ($scope.UsersList.sortOrder == 1) ? 0 : 1;
    };

    $scope.showUserActivationForm = function(user) {
        $rootScope.selectedActivationUser = user;
    };

    $scope.userListFilterCondition = function(user) {
        var checkStatus = ((user.status == 'activated') && ($scope.opt & '1')) ||
            ((user.status == 'deactivated') && ($scope.opt & '2'));
        var checkSearch = true;

        if ($scope.userSearchKey) {
            checkSearch = (user.username.toUpperCase().includes($scope.userSearchKey.toUpperCase())
                || user.email.toUpperCase().includes($scope.userSearchKey.toUpperCase())
                || user.dob.toUpperCase().includes($scope.userSearchKey.toUpperCase())
                || (user.phone && user.phone.toUpperCase().includes($scope.userSearchKey.toUpperCase()))
                || (user.belong2Team && user.belong2Team.toUpperCase().includes($scope.userSearchKey.toUpperCase()))
                || (user.userType && user.userType.toUpperCase().includes($scope.userSearchKey.toUpperCase()))
            );

        }

        return checkStatus && checkSearch;
    };
    
    $scope.updateUserRole = function(user) {
        EmployeesManagementService.updateUserStatus(user).then(function (result) {
            if (result.data.success) {
                $rootScope.ShowPopupMessage("Role Saved", "success");
            }
            else {
                $rootScope.ShowPopupMessage("Fail to Update Role", "error");
            }
        });
    };
}]);

myApp.controller('activateUserCtrl',['$scope', '$rootScope', 'EmployeesManagementService', function($scope, $rootScope, EmployeesManagementService) {
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
                $rootScope.ShowPopupMessage("Fail to Update Status", "error");
            }
        });
    };
}]);
