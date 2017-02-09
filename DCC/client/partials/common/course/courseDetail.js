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
        },
        addClass: function(Class){
            return $http.post('/admin/courses/addClass', Class).success(function(data){return data;});
        },
        updateClass: function(Class){
            return $http.post('/admin/courses/updateClass', Class).success(function(data){return data;});
        },
        deleteClass: function(Class){
            return $http.post('/admin/courses/deleteClass', Class).success(function(data){return data;});
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
    //Class
    $scope.showAddClassForm=function(){
        $rootScope.addEditFormIsEditForm =  false;
        //Class
        $rootScope.addEditClassFormTitle = 'Add Class';
        $rootScope.addEditClassFormAction = 'Add';
        $rootScope.adminClassModel = {
            courseId: $stateParams.courseId,
            location: '',
            //TODO
            // trainerId: '',
            startTime: '',
            duration: '',
            maxAttendant: '',
            note: ''
        };
    };
    $scope.showUpdateClassForm = function(Class){
        $rootScope.addEditFormIsEditForm =  true;
        $rootScope.addEditClassFormTitle = 'Edit Class';
        $rootScope.addEditClassFormAction = 'Update Class';
        $rootScope.adminClassModel = {
            id: Class.id,
            location: Class.location ,
            startTime: Class.startTime,
            duration: Class.duration,
            maxAttendant: Class.maxAttendant,
            note: Class.note,
            courseId:{
                id: Class.courseId
            }
        };
    };
    $scope.showDeleteClassForm = function(Class){
        $rootScope.deleteClass = Class.location + ' class';
        $rootScope.adminClassModel = {
            id: Class.id
        };
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

myApp.controller('addEditClassCtrl', [ '$scope', '$rootScope','courseDetailServices', function($scope, $rootScope, courseDetailServices, $location) {

    //Class
    $scope.addEditClassClick = function(){
        if ($rootScope.addEditFormIsEditForm){
            //edit class
            courseManagementServices.updateClass($rootScope.adminClassModel).then(function(result){
                if (result.data.success){
                    //Get Class List
                    courseDetailServices.getClassByCourseID($stateParams.courseId).then(function(result){
                        $scope.classList = result.data.data;
                    });
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                    $location.path("#courseDetail");
                }else{
                    $rootScope.ShowPopupMessage('Add Class FAIL!',"error");
                }
            });
        }
        else {
            //add Class
            courseManagementServices.addClass($rootScope.adminClassModel).then(function(result) {
                if (result.data.success){
                    //Get Class List
                    courseDetailServices.getClassByCourseID($stateParams.courseId).then(function(result){
                        $scope.classList = result.data.data;
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

myApp.controller('DatePickerCtrl', [ '$scope', function($scope) {
    //DatePicker
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    function getDayClass(data) {
        var date = data.date,
        mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }
}]);
