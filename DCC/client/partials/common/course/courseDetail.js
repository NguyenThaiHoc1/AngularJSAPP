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
