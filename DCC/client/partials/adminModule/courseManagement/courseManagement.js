'use strict';

angular.module('courseManagement', []);

//Routers
myApp.config(function($stateProvider) {
    $stateProvider.state('courseManagement', {
        url: '/courseManagement',
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
            //return $http.get('partials/traineeModule/courseRegister/mock/trainingprogram.json').success(function(data) { return data; });
            //return $http.get('course/traineeModule/courseRegister/mock/trainingprogram.json').success(function(data) { return data; });
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
    courseManagementServices.getCourseList().then(function(result){
        $rootScope.coursesList = result.data.course;
    });

    //dislay modal of edit & add course
    $rootScope.addEditForm = {};

    $rootScope.showAddCourseForm=function(){
        $rootScope.addEditFormTitle = 'Add Course';
        $rootScope.addEditFormAction = 'Add';
        $rootScope.addEditFormIsEditForm = false;
    };

    $scope.showUpdateCourseForm = function(course){
        $rootScope.addEditFormTitle = 'Edit Course';
        $rootScope.addEditFormAction = 'Update';
        $rootScope.addEditFormIsEditForm = true;
        console.log(course);
    };
    // edit course
    $scope.editCourse = function(course) {
        // clone $scope.coursesProperty to $scope.coursesPropertyEdit
        $rootScope.courseModelEdit = (JSON.parse(JSON.stringify($rootScope.courseModel)));
        $rootScope.courseModelEdit = {
            id: course.id,
        };
    };


}]);

myApp.controller('addEditCourseCtrl', [ '$scope', '$rootScope','courseManagementServices', function($scope, $rootScope, courseManagementServices, $location) {
    // Course Model
    $rootScope.courseModel = {
        name: '',
        description: '',
        duration:'',
        documents: '',
        test: '',
        courseTypeId:'',
        trainingProgramId:''
    };

    //get TP
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
                        $rootScope.coursesList = result;
                    });
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                    // $location.path("/userProfile");
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
                        $rootScope.coursesList = result;
                    });
                    // $location.path("/userProfile");
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                } else {
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        }
    };


    // $scope.updateCourse = function() {
    //
    //     // clone $scope.coursesProperty to $scope.coursesPropertyEdit
    //     $scope.coursesPropertyEdit = (JSON.parse(JSON.stringify($scope.coursesModal)));
    //
    //     courseManagementServices.updateCourse($scope.coursesPropertyEdit).then(function(result){
    //         if (result.data.success){
    //             $rootScope.ShowPopupMessage(result.data.msg, "success");
    //             // $location.path("/userProfile");
    //         }else{
    //             $rootScope.ShowPopupMessage(result.data.msg, "error");
    //         }
    //     });
    // };

}]);

myApp.controller('deleteCourseCtrl', [ '$scope', '$rootScope','courseManagementServices', function($scope, $rootScope, courseManagementServices, $location) {
    //delete course
    $scope.deleteCourse = function(id) {
        courseManagementServices.deleteCourse(id).then(function(result){
            if (result.data.success){
                $rootScope.ShowPopupMessage(result.data.msg, "success");
                //GetCourseList
                courseManagementServices.getCourseList().then(function(result){
                    $scope.coursesList = result.data.course;
                });
            } else {
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }
        });
    };
}]);
