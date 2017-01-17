'use strict';

angular.module('admin_dashboard', []);

//Routers
myApp.config(function($stateProvider) {
    $stateProvider.state('admin_dashboard', {
        url: '/admin_dashboard',
        templateUrl: 'partials/adminModule/dashboard/dashboard.html',
        data:{
            auth:true
        },
    });
});
