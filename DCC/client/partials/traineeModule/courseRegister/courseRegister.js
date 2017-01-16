'use strict';

angular.module('courseRegister', ['ui.toggle']);

//Routers
myApp.config(function($stateProvider) {
    $stateProvider.state('courseRegister', {
        url: '/courseRegister',
        templateUrl: 'partials/traineeModule/courseRegister/courseRegister.html',
        data:{
            auth:true
        }
    });

});

//Factories
myApp.factory('courseRegisterServices', ['$http', function($http) {
    var factoryDefinitions = {
        getTrainingProgram: function() {
            //return $http.get('partials/traineeModule/courseRegister/mock/trainingprogram.json').success(function(data) { return data; });
            //return $http.get('course/traineeModule/courseRegister/mock/trainingprogram.json').success(function(data) { return data; });
            return $http.get('/trainee/getTrainingProgram').success(function(data) { return data; });
        },
        getOpeningCourse: function() {
            //return $http.get('partials/traineeModule/courseRegister/mock/openingCourse.json').success(function(data) { return data; });
            return $http.get('/trainee/getOpeningCourse').success(function(data) { return data; });
        },
        getMyEnrolledCourse: function() {
            return $http.get('partials/traineeModule/courseRegister/mock/myEnroll.json').success(function(data) { return data; });
        },
        registerCourse: function(requestOpening) {
            //return $http.get('partials/traineeModule/courseRegister/mock/openingCourse.json').success(function(data) { return data; });
            return $http.post('/trainee/registerCourse', requestOpening).success(function(data) { return data; });
        },
    }
    return factoryDefinitions;
}
]);


//Controllers
myApp.controller('courseRegisterCtrl', ['$rootScope', '$scope', 'courseRegisterServices', function($rootScope ,$scope, courseRegisterServices) {
    //Clone Object function
    function clone(obj) {
        var copy;
        if (null == obj || "object" != typeof obj) return obj;
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    courseRegisterServices.getMyEnrolledCourse().then(function(result){
        $scope.myEnrolledCourse = result.data;
    });

    courseRegisterServices.getTrainingProgram().then(function(result){
        // var temptrainingProgramList = clone(result.data);
        // for(var i = temptrainingProgramList.length - 1; i >= 0; i--){
        //     for(var j = temptrainingProgramList[i].Courses.length - 1; j >= 0; j--){
        //         for(var k = $scope.myEnrolledCourse.length - 1; k >= 0; k--) {
        //             if ($scope.myEnrolledCourse[k].id === temptrainingProgramList[i].Courses[j].id) {
        //                 temptrainingProgramList[i].Courses.splice(j,1);
        //             }
        //         }
        //     }
        // }
        //
        // $scope.trainingProgramList = temptrainingProgramList;
        $scope.trainingProgramList = result.data.data;
        //$scope.test = result.data.msg;
    });

    courseRegisterServices.getOpeningCourse().then(function(result){
        var openingClass = result.data.data;
        var tempOpeningCourse = [];
        for (var i = 0; i <  $scope.trainingProgramList.length; i++){
            for(var j = 0; j < $scope.trainingProgramList[i].Courses.length; j++){
                for(var k = 0; k < openingClass.length; k++){
                    if($scope.trainingProgramList[i].Courses[j].id == openingClass[k].courseId){
                        tempOpeningCourse.push($scope.trainingProgramList[i].Courses[j]);
                    }
                }
            }
        }
        $scope.openingCourseList = tempOpeningCourse;

    });


    $scope.findCourse = function(courseSearchKey){
        var key = $scope.courseSearchKey;
        var trainingProgram = clone($scope.trainingProgramList);
        // $scope.test = key;
        var courseListSearch = [];
        for(var i=trainingProgram.length-1; i>=0; i--){
            for(var j=trainingProgram[i].Courses.length-1; j>=0; j--){
                if((trainingProgram[i].Courses[j].name.toUpperCase()).indexOf(key.toUpperCase())===-1){
                    trainingProgram[i].Courses.splice(j,1);
                }
            }
        }
        for (var i = 0; i < trainingProgram.length; i++) {
            for (var j = 0; j < trainingProgram[i].Courses.length; j++) {
                courseListSearch.push(trainingProgram[i].Courses[j]);
            }
        }
        $scope.courseListSearchResult = courseListSearch;
    };

    $scope.registerCourse = function(courseId){
        // courseRegisterStatus = true : unregister;
        // courseRegisterStatus = false : register;
        var requestOpening = {
            courseId : courseId,
            userEmail : $rootScope.userInfo.email
        };
        if (!$scope.courseRegisterStatus){
            courseRegisterServices.registerCourse(requestOpening).then(
                function(result)
                {
                    if (result.data.msg)
                        $rootScope.ShowPopupMessage(result.data.msg, "success");
                    else
                        $rootScope.ShowPopupMessage("Can not register", "error");
                }
            );
            $scope.test = courseId;
        }
    };
}]);
