'use strict';
angular.module('calendarModule', ['ui.calendar', 'ui.bootstrap']);

//Routers
myApp.config(function($stateProvider) {

    //calendar
    $stateProvider.state('calendar', {
        templateUrl: 'partials/calendarModule/calendar.html',
        controller: 'calendarController'
    });
});

//Factories

//Controllers
myApp.controller('calendarController', ['$scope', '$location', '$rootScope', function($scope, $compile, $timeout, uiCalendarConfig) {

    /* config object */
    $scope.uiConfig = {
        calendar:{
            editable: false, //Not allow to edit events
            header:{
                left: 'month basicWeek basicDay agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            },
            eventClick: $scope.alertEventOnClick,
        }
    };

    /* event source that contains custom events on the scope */
    $scope.events = [];
    /* event sources array*/
    $scope.eventSources = [$scope.events]; // Calendar may have many sources

    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
    };

    /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) {
        element.attr({'tooltip': event.title,
        'tooltip-append-to-body': true});
        $compile(element)($scope);
    };

}]);
