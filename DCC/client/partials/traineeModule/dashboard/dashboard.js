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
        },
        unEnrollCourse: function(req){
            return $http.post('/trainee/courseRegister/unEnrollCourse', req).success(function(data) { return data; });
        },
        requestOpening: function(request) {
            return $http.post('/trainee/courseRegister/requestOpening', request).success(function(data) { return data; });
        }
    }

    return factoryDefinitions;
}]);

//Controllers
myApp.controller('MyCoursesCtrl', ['$scope', 'dashboardServices','$rootScope', function($scope, dashboardServices, $rootScope) {

    //Init action text of button base on status of a course
    $scope.actionOneText = {}; $scope.actionTwoText = {};
    $scope.actionOneText['Enrolled'] = 'Give feedback';
    $scope.actionTwoText['Enrolled'] = 'Re-enroll';
    $scope.actionOneText['Learned'] = 'View Schedule';
    $scope.actionTwoText['Learned'] ='Un-enroll';
    $scope.actionBool ['Learned'] = true;
    $scope.actionBool ['Enrolled'] = false;

    //get all courses and training programs
    dashboardServices.getMyTraingPrograms().then(function(result){
        result.data.data.forEach(traningProgram => {
            traningProgram.count = 0;
            traningProgram.Courses.forEach(course => {
                // class id and status in class Record
                course.classId = course.Classes[course.Classes.length - 1].ClassRecords[course.Classes[course.Classes.length - 1].ClassRecords.length - 1].classId;
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
    // un-Enroll or re-Enroll Course
    $scope.actionTwoTextClick = function(classId, courseId){
        if( $scope.actionBool  ){
            //un-enroll
            dashboardServices.unEnrollCourse({traineeEmail: $rootScope.userInfo.email, classId: classId}).then(function(result){
                if (result.data.success){
                    //refrsh list
                    dashboardServices.getMyTraingPrograms().then(function(result){
                        result.data.data.forEach(traningProgram => {
                            traningProgram.count = 0;
                            traningProgram.Courses.forEach(course => {
                                // class id and status in class Record
                                course.classId = course.Classes[course.Classes.length - 1].ClassRecords[course.Classes[course.Classes.length - 1].ClassRecords.length - 1].classId;
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
                    //
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                }else{
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        }else{
            //re-Enroll: function same function request Opening
            dashboardServices.requestOpening({userEmail:$rootScope.userInfo.email, courseId: courseId}).then(function(result){
                if(result.data.success){
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                    //refesh list
                    dashboardServices.getMyTraingPrograms().then(function(result){
                        result.data.data.forEach(traningProgram => {
                            traningProgram.count = 0;
                            traningProgram.Courses.forEach(course => {
                                // class id and status in class Record
                                course.classId = course.Classes[course.Classes.length - 1].ClassRecords[course.Classes[course.Classes.length - 1].ClassRecords.length - 1].classId;
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
                    //
                }else{
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        }
    };
    //Give feedback or View Schedule function
    $scope.actionOneTextClick = function(){

    };
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
