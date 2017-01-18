'use strict';

angular.module('trainee_dashboard', []);

//Routers
myApp.config(function($stateProvider) {
    $stateProvider.state('trainee_dashboard', {
        url: '/trainee_dashboard',
        templateUrl: 'partials/traineeModule/dashboard/dashboard.html',
        data:{
            auth:true
        }
    });

});

//Factories
myApp.factory('dashboardServices', ['$http', function($http) {

    var factoryDefinitions = {
        getMyTraingPrograms: function() {
            return $http.get('/trainee/dashboard/getTrainingProgram').success(function(data) { return data; });
        },
        getRequestOpenCourse: function() {
            return $http.get('/trainee/dashboard/getRequestOpenCourse').success(function(data) { return data; });
        },
        deleteRequestOpenCourse: function(req){
            return $http.post('/trainee/courseRegister/deleteRequestOpening', req).success(function(data) { return data; });
        }
    }

    return factoryDefinitions;
}]);

//Controllers
myApp.controller('MyCoursesCtrl', ['$scope', 'dashboardServices', function($scope, dashboardServices) {

    //Init action text of button base on status of a course
    $scope.actionOneText = {}; $scope.actionTwoText = {};
    $scope.actionOneText['Enrolled'] = 'Give feedback';
    $scope.actionTwoText['Enrolled'] = 'Re-enroll';
    $scope.actionOneText['Learned'] = 'View Schedule';
    $scope.actionTwoText['Learned'] ='Un-enroll';

    //get all courses and training programs
    dashboardServices.getMyTraingPrograms().then(function(result){
        result.data.data.forEach(traningProgram => {
            traningProgram.count = 0;
            traningProgram.Courses.forEach(course => {
                course.status = course.Classes[course.Classes.length - 1].ClassRecords[course.Classes[course.Classes.length - 1].ClassRecords.length - 1].status;
                // change color of courses base on its status (Learned/ Enrolled)
                if (course.status == 'Enrolled') {course.backgroundColor = '#4FC3F7'}
                else if (course.status == 'Learned')
                {
                    course.backgroundColor = '#8BC34A';
                    traningProgram.count = traningProgram.count + 1;
                }
                else {course.backgroundColor = 'black'}
            });
            traningProgram.completePercent = Math.ceil(traningProgram.count / traningProgram.Courses.length * 100);
        });
        $scope.myTrainingProgramList = result.data.data;
    });
    // trainningProgram.completePercent
}]);

//Request Open Course controller
myApp.controller('requestOpenCourseCtrl', ['$scope', 'dashboardServices', '$rootScope', function($scope, dashboardServices, $rootScope) {
    dashboardServices.getRequestOpenCourse().then(function(result){
        $scope.myRequestOpenCourseList = result.data.data;
    });

    $scope.cancelRequestClick = function(requestOpenCourseId){
        dashboardServices.deleteRequestOpenCourse({courseId: requestOpenCourseId, userEmail: $rootScope.userInfo.email}).then(function(result){
            if(result.data.success){
                $rootScope.ShowPopupMessage(result.data.msg, "success");

                //refesh the request open course list
                dashboardServices.getRequestOpenCourse().then(function(result){
                    $scope.myRequestOpenCourseList = result.data.data;
                });
            }else{
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }
        });
    };
}]);
