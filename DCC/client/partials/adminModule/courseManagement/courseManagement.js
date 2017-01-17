'use strict';

angular.module('admin_courseManagement', ['textAngular']);

//Routers
myApp.config(function($stateProvider) {
    $stateProvider.state('admin_courseManagement', {
        url: '/admin_courseManagement',
        templateUrl: 'partials/adminModule/courseManagement/courseManagement.html',
        data:{
            auth:true
        },
    });
});

//Factory
myApp.factory('courseManagementServices', ['$http', function($http) {

    var factoryDefinitions = {
        //done
        getCourseList: function() {
            return $http.get('/admin/getCourseList').success(function(data) { return data; });
        },
        //TODO
        addCourse: function(course){
            return $http.post('/admin/addCourse',  course).success(function(data) { return data; });
        },
        updateCourse: function(course){
            return $http.post('/admin/updateCourse', course).success(function(data) { return data; });
        },
        deleteCourse: function(courseId){
            return $http.post('/admin/deleteCourse', courseId).success(function(data) { return data; });
        },
        getTrainingProgram: function() {
            return $http.get('/trainee/getTrainingProgram').success(function(data) { return data; });
        },
        getCourseTypeList: function(){
            return $http.get('/admin/getCourseTypeList').success(function(data) { return data; });
        }
    }

    return factoryDefinitions;
}
]);

//controller
myApp.controller('courseListCtrl', [ '$scope', '$rootScope','courseManagementServices', function($scope, $rootScope, courseManagementServices, $location) {
    //GetCourseList
    courseManagementServices.getCourseList().then(function(result) {
        $rootScope.coursesList = result.data.course;
    });

    //dislay modal of edit & add course

    $rootScope.showAddCourseForm=function(){
        $rootScope.addEditFormTitle = 'Add Course';
        $rootScope.addEditFormAction = 'Add';
        $rootScope.addEditFormIsEditForm = false;
        $rootScope.courseModel = {
            name: '',
            description: '',
            duration:'',
            documents: '',
            test: '',
            courseTypeId: {
                id: ''
            },
            trainingProgramId: {
                id: ''
            }
        };
        console.log($rootScope.courseModel.courseTypeId.id);
    };

    $scope.showUpdateCourseForm = function(course){
        $rootScope.addEditFormTitle = 'Edit Course';
        $rootScope.addEditFormAction = 'Update';
        $rootScope.addEditFormIsEditForm = true;
        console.log(course); //debug
        $rootScope.courseModel = {
            id: course.id,
            name: course.name,
            description: course.description,
            duration:course.duration,
            documents:course.documents,
            test: course.test,
            courseTypeId:course.courseTypeId,
            trainingProgramId:course.trainingProgramId
        };
        console.log($rootScope.courseModel);//debug
    };

    $scope.showDeleteForm = function(course){
        $rootScope.courseModel = {
            id: course.id,
            name: course.name
        };
    };
}]);

myApp.controller('addEditCourseCtrl', [ '$scope', '$rootScope','courseManagementServices', function($scope, $rootScope, courseManagementServices, $location) {

    //get TrainingProgram
    courseManagementServices.getTrainingProgram().then(function(result){
        $scope.trainingProgramList = result.data.data;
    });

    //getCourseTypeList
    courseManagementServices.getCourseTypeList().then(function(result){
        $scope.courseTypeList = result.data.courseType;
    });

    $scope.addEditClick = function(){
        if ($rootScope.addEditFormIsEditForm){
            //edit course
            courseManagementServices.updateCourse($rootScope.courseModel).then(function(result){
                if (result.data.success){
                    courseManagementServices.getCourseList().then(function(result) {
                        $rootScope.coursesList = result.data.course;
                    });
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                    $location.path("#admin_courseManagement");
                }else{
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        }
        else {
            //add course
            courseManagementServices.addCourse($rootScope.courseModel).then(function(result) {
                if (result.data.success){
                    courseManagementServices.getCourseList().then(function(result) {
                        $rootScope.coursesList = result.data.course;
                    });
                    // $location.path("/userProfile");
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                } else {
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        }
    };
}]);

myApp.controller('deleteCourseCtrl', [ '$scope', '$rootScope','courseManagementServices', function($scope, $rootScope, courseManagementServices, $location) {
    //delete course
    $scope.deleteCourse = function() {
        courseManagementServices.deleteCourse($rootScope.courseModel).then(function(result){
            if (result.data.success){
                //GetCourseList
                courseManagementServices.getCourseList().then(function(result) {
                    $rootScope.coursesList = result.data.course;
                });
                $rootScope.ShowPopupMessage(result.data.msg, "success");
            } else {
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }
        });
    };
}]);
