'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
    'ui.router',
    'ui.bootstrap',
    'validation',
    'validation.rule',
    'textAngular',
    'users',
    'trainee_dashboard',
    'trainee_courseRegister',
    'home',
    'calendarModule',
    'courseDetail',
    'admin_courseManagement',
    'admin_dashboard',
    'EmployeesManagement',
    'register',
]);

//Config phase
myApp.config(function ($urlRouterProvider, $httpProvider) {
    //session check and redirect to specific state
    if (!window.sessionStorage["userInfo"]) {
        $urlRouterProvider.otherwise("home");
    }

});

//Run phase
myApp.run(function ($rootScope, $state) {
    $rootScope.$state = $state; //Get state info in view

    $rootScope.ShowPopupMessage = function (message, popupType) {
        $rootScope.popUpMessage = message;
        //--show the pop up to infor login result
        var popup = document.getElementById("popUpMessage")
        popup.className = popupType; //success (green), error (red), info(light blue).  custom more by add more style class to css/style.css
        setTimeout(function () { popup.className = "" }, 3000);
        //--end: show the pop
    }

    if (window.sessionStorage["userInfo"]) {
        $rootScope.userInfo = JSON.parse(window.sessionStorage["userInfo"]);
    }

    //Check session and redirect to specific page
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState && toState.data && toState.data.auth && !window.sessionStorage["userInfo"]) {
            event.preventDefault();
            window.location.href = "#home";
        }

        if (!toState && !toState.data && !toState.data.auth && window.sessionStorage["userInfo"]) {
            event.preventDefault();
            if ($rootScope.userInfo.role == 3) {
                window.location.href = "#trainee_dashboard";
            } else if ($rootScope.userInfo.role == 2) {
                window.location.href = "#trainer_dashboard";
            } else if ($rootScope.userInfo.role == 1) {
                window.location.href = "#admin_dashboard";
            }
        }
    });
});

//Datatable
myApp.factory('dataTable', ['$filter', 'ngTableParams', function ($filter, ngTableParams) {

    var factoryDefinition = {
        render: function ($scope, config, componentId, data) {

            if (!config) config = {};
            var config = angular.extend({}, { page: 1, count: 10 }, config)

            $scope[componentId] = new ngTableParams(config, {
                total: data.length, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var filteredData = params.filter() ?
                        $filter('filter')(data, params.filter()) :
                        data;
                    var orderedData = params.sorting() ?
                        $filter('orderBy')(filteredData, params.orderBy()) :
                        data;
                    params.total(orderedData.length); // set total for recalc pagination
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });


        }
    }

    return factoryDefinition;
}
]);

//For top sub menu (look others menu)
$(function () {
    $('.subnavbar').find('li').each(function (i) {
        var mod = i % 3;
        if (mod === 2) {
            $(this).addClass('subnavbar-open-right');
        }
    });
});
