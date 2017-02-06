'use strict';
angular.module('courseDetail', []);

myApp.config(function($stateProvider) {
    $stateProvider.state('courseDetail', {
        url:"/courseDetail",
        templateUrl: 'partials/common/course/courseDetail.html',
        controller: 'courseDetailCtrl',
        params: {
            courseId: null,
        }
    });
});


//Factories
myApp.factory('courseDetailServices', ['$http', function($http) {

    var factoryDefinitions = {
        getCourseDetailById: function(courseId) {
            return $http.post('/common/course/getCourseDetail', {courseId : courseId}).success(function(data) { return data; });
        },
        // sendFeedback: function(req) {
        //     return $http.post('/course/giveFeedback', req).success(function(data) { return data; });
        // },
        getClassByCourseID: function(courseId){
            return $http.post('/common/course/getClassByCourseID', {courseId : courseId}).success(function(data) { return data; });
        }
    }

    return factoryDefinitions;
}
]);

//Controllers
myApp.controller('courseDetailCtrl', ['$scope', '$rootScope', '$stateParams', 'courseDetailServices', function($scope, $rootScope, $stateParams, courseDetailServices) {
    //getCourseDetail
    $scope.courseDetail = {};
    courseDetailServices.getCourseDetailById($stateParams.courseId).then(function(result){
        $scope.courseDetail = result.data.data;
    });

    $scope.classList = {};
    courseDetailServices.getClassByCourseID($stateParams.courseId).then(function(result){
        $scope.classList = result.data.data;
    });



    //
    // $scope.giveFeedback = function(){
    //     var req = {
    //         email: $rootScope.userInfo.email,
    //         courseId: $scope.courseDetail.id,
    //         rating: $scope.rate
    //     };
    //     courseDetailServices.sendFeedback(req).then(function(result){
    //         if(result.data.success){
    //             $rootScope.popUpMessage("Rating success", "success");
    //         }else{
    //             $rootScope.popUpMessage("Rating fail", "error");
    //         }
    //     });
    // }

    //Rating
    $scope.rate = 1;
    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
    };

}]);

// //Add and Edit Class Control
// $scope.showUpdateClassForm = function(course, adminclass){
//     $rootScope.addEditFormIsEditForm =  true;
//     //Class
//     $rootScope.addEditClassFormTitle = 'Edit Class';
//     $rootScope.addEditClassFormAction = 'Update Class';
//     console.log(  adminclass); //debug
//     $rootScope.adminClassModel = {
//         id: adminclass.id,
//         courseId: course.id,
//         location: adminclass.location,
//         //TODO
//         // trainerId: adminclass.trainerId,
//         startTime: adminclass.startTime,
//         duration: adminclass.duration,
//         maxAttendant: adminclass.maxAttendant,
//         note: adminclass.note
//     };
// };
//
// $scope.showDeleteClassForm = function(adminclass){
//     $rootScope.deleteClickId = 3;
//     //Class
//     $rootScope.adminClassModel = {
//         id: adminclass.id,
//     };
// };

myApp.controller('addEditClassCtrl', [ '$scope', '$rootScope','courseManagementServices', function($scope, $rootScope, courseManagementServices, $location) {

    $scope.addEditClassClick = function(){
        if ($rootScope.addEditFormIsEditForm){
            //edit class
            courseManagementServices.updateClass($rootScope.adminClassModel).then(function(result){
                if (result.data.success){
                    //Get Training Program
                    courseManagementServices.getTrainingProgramList().then(function(result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                    });
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                    $location.path("#admin_courseManagement");
                }else{
                    $rootScope.ShowPopupMessage('Add Class FAIL!',"error");
                }
            });
        }
        else {
            //add Class
            courseManagementServices.addClass($rootScope.adminClassModel).then(function(result) {
                if (result.data.success){
                    //GetTrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function(result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                    });
                    // $location.path("/userProfile");
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                } else {
                    $rootScope.ShowPopupMessage('Edit Class Info FAIL!', "error");
                }
            });
        }
    };
}]);
