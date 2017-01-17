'use strict';

angular.module('trainee_courseRegister', ['ui.toggle']);

//Routers
myApp.config(function($stateProvider) {
    $stateProvider.state('trainee_courseRegister', {
        url: '/trainee_courseRegister',
        templateUrl: 'partials/traineeModule/courseRegister/courseRegister.html',
        data:{
            auth:true
        }
    });

});

myApp.factory('courseRegisterServices', ['$http', function($http) {
    var factoryDefinitions = {
        getTrainingProgram: function() {
            return $http.get('/trainee/courseRegister/getTrainingProgram').success(function(data) { return data; });
        },
        getOpeningClass: function() {
            return $http.get('/trainee/courseRegister/getOpeningClass').success(function(data) { return data; });
        },
        getMyEnrolledClass: function(request) {
            return $http.post('trainee/courseRegister/getMyEnrolledClass', request).success(function(data) { return data; });
        },
        requestOpening: function(request) {
            return $http.post('/trainee/courseRegister/requestOpening', request).success(function(data) { return data; });
        },
        deleteRequestOpening: function(request) {
            return $http.post('/trainee/courseRegister/deleteRequestOpening', request).success(function(data) { return data; });
        },
        getRequestedOpeningCourse: function(request) {
            return $http.post('/trainee/courseRegister/getRequestedOpeningCourse', request).success(function(data) { return data; });
        },
    }
    return factoryDefinitions;
}
]);


//Controllers
myApp.controller('courseRegisterCtrl', ['$rootScope', '$scope', 'courseRegisterServices', function($rootScope ,$scope, courseRegisterServices) {
    courseRegisterServices.getMyEnrolledClass({userEmail:$rootScope.userInfo.email}).then(function(result){
        var myEnrolledCourse = [];
        result.data.classRecord.forEach(classRecord => {
            var today = new Date();
            var startTime = new Date(classRecord.Class.startTime);
            if(today < startTime) myEnrolledCourse.push(classRecord.Class.Course);
        });
        $scope.myEnrolledCourse = myEnrolledCourse;
    });

    courseRegisterServices.getTrainingProgram().then(function(result){
        var trainingProgram = result.data.data;
        for(var i=trainingProgram.length-1; i>=0; i--){
            for(var j=trainingProgram[i].Courses.length-1; j>=0; j--){
                for(var k=$scope.myEnrolledCourse.length-1; k>=0; k--){
                    if(trainingProgram[i].Courses[j].id == $scope.myEnrolledCourse[k].id){
                        trainingProgram[i].Courses.splice(j,1);
                    }
                }
            }
        }
        $scope.trainingProgramList = trainingProgram;
    });

    courseRegisterServices.getOpeningClass().then(function(result){
        var tempOpeningCourseList = [];
        result.data.openingClass.forEach(openingClass => {
            tempOpeningCourseList.push(openingClass.Course);
        });

        for(var i=tempOpeningCourseList.length-1; i>=0; i--){
            for(var j=$scope.myEnrolledCourse.length-1; j>=0; j--){
                if(tempOpeningCourseList[i].id == $scope.myEnrolledCourse[j].id) tempOpeningCourseList.splice(i,1);
            }
        }
        $scope.openingCourseList = tempOpeningCourseList;
    });

    courseRegisterServices.getRequestedOpeningCourse({userEmail:$rootScope.userInfo.email}).then(function(result){
        $scope.requestedOpeningCourse = result.data.requestedOpeningCourse;
    });

    $scope.initCourseRegisterStatus = function(id){
        for(var i=0; i<$scope.requestedOpeningCourse.length; i++){
            if($scope.requestedOpeningCourse[i].courseId == id) return false;
        }
        return true;
    };


    $scope.findCourse = function(courseSearchKey){
        var courseListSearchResult = []
        $scope.trainingProgramList.forEach(trainingProgram => {
            trainingProgram.Courses.forEach(course => {
                if(course.name.toUpperCase().indexOf(courseSearchKey.toUpperCase()) !== -1) courseListSearchResult.push(course);
            });
        });
        $scope.courseListSearchResult = courseListSearchResult;
    };

    $scope.registerCourse = function(courseId, courseRegisterStatus){
        // courseRegisterStatus = true : unregister;
        // courseRegisterStatus = false : register;
        var request = {
            courseId : courseId,
            userEmail : $rootScope.userInfo.email
        };
        if (courseRegisterStatus == false){
            courseRegisterServices.requestOpening(request).then(
                function(result)
                {
                    if (result.data.msg)
                        $rootScope.ShowPopupMessage(result.data.msg, "success");
                    else
                        $rootScope.ShowPopupMessage("Register Error", "error");
                }
            );
        }
        else{
            courseRegisterServices.deleteRequestOpening(request).then(
                function(result)
                {
                    $scope.test = "Un register";

                    if (result.data.msg)
                        $rootScope.ShowPopupMessage(result.data.msg, "success");
                    else
                        $rootScope.ShowPopupMessage("Delete Regiser Request Error", "error");
                }
            );
        }
    };
}]);
