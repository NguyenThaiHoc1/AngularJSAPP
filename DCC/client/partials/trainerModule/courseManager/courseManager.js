'use strict';

angular.module('courseManager', []);

//Routers
myApp.config(function($stateProvider) {
    $stateProvider.state('courseManager', {
        url: '/courseManager',
        templateUrl: 'partials/trainerModule/courseManager/courseManager.html',
        data:{
            auth:true
        },
        controller: 'courseManagerCtrl'
    });
});

//Factory
myApp.factory('courseManagerServices', ['$http', function($http) {

    var factoryDefinitions = {
        //done
        getCourseList: function() {
            return $http.get('/admin/getCourseList').success(function(data) { return data; });
        },
        //TODO
        addCourse: function( cReq ){
            return $http.post('/admin/addCourse',  cReq ).success(function(data) { return data; });
        },
        updateCourse: function(Req){
            return $http.post('/admin/updateCourse', Req).success(function(data) { return data; });
        },
        isDeletedCourse: function(req){
            return $http.post('/admin/isDeletedCourse', req).success(function(data) { return data; });
        }
    }

    return factoryDefinitions;
}
]);

//controller
myApp.controller('courseManagerCtrl', [ '$scope', '$rootScope','courseManagerServices', function($scope, $rootScope, courseManagerServices, $location) {
    //init templates
    $scope.templates =[
        { name: 'addCourse.html', url: 'partials/trainerModule/courseManager/addCourse.html'},
        { name: 'editCourse.html', url: 'partials/trainerModule/courseManager/editCourse.html'},
        { name: 'deleteCourse.html', url: 'partials/trainerModule/courseManager/deleteCourse.html'}];
        $scope.coursesList ={};
        //GetCourseList
        courseManagerServices.getCourseList().then(function(result){
            $scope.coursesList=result.data.course;
        });
        //dislay modal of edit & add course
        $scope.funtionTitle = '';
        $scope.functionDone= '';

        //add course
        $scope.coursesProperty = {
            name: '',
            description: '',
            duration:'',
            documents: '',
            test: '',
        };
        $scope.addCourse=function(){
            $scope.funtionTitle = 'Add Course';
            $scope.functionDone = 'Add';
            courseManagerServices.addCourse($scope.coursesProperty).then(function(result) {
                if (result.data.success){
                    courseManagerServices.getCourseList().then(function(result) {
                        $scope.coursesList = result;
                    });
                    // $location.path("/userProfile");
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                } else {
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        };
        //update course
        $scope.updateCourse = function() {
            $scope.funtionTitle = 'Edit Course';
            $scope.functionDone = 'Edit';
            // clone $scope.coursesProperty to $scope.coursesPropertyEdit
            $scope.coursesPropertyEdit = (JSON.parse(JSON.stringify($scope.coursesProperty)));

            courseManagerServices.updateCourse($scope.coursesPropertyEdit).then(function(result){
                if (result.data.success){
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                    // $location.path("/userProfile");
                }else{
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        };
        //delete course
        $scope.isDeletedCourse = function() {
            // clone $scope.coursesProperty to $scope.coursesPropertyEdit
            $scope.coursesPropertyDelete = {
                id: course.id,
                name: course.name,
                isDeleted: course.isDeleted
            };
            courseManagerServices.updateCourse($scope.coursesPropertyDelete).then(function(result){
                if (result.data.success){
                    courseManagerServices.getCourseList().then(function(result) {
                        $scope.coursesList = result;
                    });
                    // $location.path("/userProfile");
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                } else {
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        };
    }]);
