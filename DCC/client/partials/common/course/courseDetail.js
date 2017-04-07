'use strict';
angular.module('courseDetail', []);

myApp.config(function ($stateProvider) {
    $stateProvider.state('courseDetail', {
        url: "/courseDetail",
        templateUrl: 'partials/common/course/courseDetail.html',
        controller: 'courseDetailCtrl',
        params: {
            courseId: null,
        },
        data: {
            auth: true
        }
    });
});


//Factories
myApp.factory('courseDetailServices', ['$http', function ($http) {

    var factoryDefinitions = {
        getCourseDetailById: function (courseId) {
            return $http.post('/common/course/getCourseDetail', { courseId: courseId }).success(function (data) { return data; });
        },
        // sendFeedback: function(req) {
        //     return $http.post('/course/giveFeedback', req).success(function(data) { return data; });
        // },
        getClassByCourseID: function (courseId) {
            return $http.post('/common/course/getClassByCourseID', { courseId: courseId }).success(function (data) { return data; });
        },
        addClass: function (Class) {
            return $http.post('/admin/courses/addClass', Class).success(function (data) { return data; });
        },
        updateClass: function (Class) {
            return $http.post('/admin/courses/updateClass', Class).success(function (data) { return data; });
        },
        deleteClass: function (Class) {
            return $http.post('/admin/courses/deleteClass', Class).success(function (data) { return data; });
        },
        getTrainerList:function() {
            return $http.get('/admin/courses/getAllTrainer').success(function (data) { return data; });
        }
    }

    return factoryDefinitions;
}
]);

//Controllers
myApp.controller('courseDetailCtrl', ['$scope', '$rootScope', '$stateParams', 'courseDetailServices', function ($scope, $rootScope, $stateParams, courseDetailServices) {
    //getCourseDetail
    $scope.courseDetail = {};
    courseDetailServices.getCourseDetailById($stateParams.courseId).then(function (result) {
        $scope.courseDetail = result.data.data;
    });

    $rootScope.classList = {};
    courseDetailServices.getClassByCourseID($stateParams.courseId).then(function (result) {
        $rootScope.classList = result.data.data;
    });

    //Rating
    $scope.rate = 1;
    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
    };
    //Class
    $scope.showAddClassForm = function () {
        $rootScope.addEditFormIsEditForm = false;
        //Class
        $rootScope.addEditClassFormTitle = 'Add Class';
        $rootScope.addEditClassFormAction = 'Add';
        //date and time

        $rootScope.timeOfStart = new Date();
        $rootScope.timeOfStart.setHours(10);
        $rootScope.timeOfStart.setMinutes(0);
        $rootScope.dayOfStart = new Date();

        $rootScope.timeOfEnd = new Date();
        $rootScope.timeOfEnd.setHours(12);
        $rootScope.timeOfEnd.setMinutes(0);
        $rootScope.dayOfEnd = new Date();

        $rootScope.adminClassModel = {
            dayOfStart: $rootScope.dayOfStart,
            timeOfStart: $rootScope.timeOfStart,
            dayOfEnd: $rootScope.dayOfEnd,
            timeOfEnd: $rootScope.timeOfEnd,
            courseId: $stateParams.courseId,
            location: '',
            //TODO
            // trainerId: '',
            startTime: $rootScope.dateTimePicker,
            endTime: $rootScope.endTimePicker,
            maxAttendant: '',
        };

    };
    $scope.showUpdateClassForm = function (Class) {
        $rootScope.addEditFormIsEditForm = true;
        $rootScope.addEditClassFormTitle = 'Edit Class';
        $rootScope.addEditClassFormAction = 'Update Class';

        Class.startTime = new Date(Class.startTime);
        $rootScope.dayOfStart = Class.startTime;
        $rootScope.timeOfStart = new Date();
        $rootScope.timeOfStart.setHours(Class.startTime.getHours());
        $rootScope.timeOfStart.setMinutes(Class.startTime.getMinutes());

        Class.endTime = new Date(Class.endTime);
        $rootScope.dayOfEnd = Class.endTime;
        $rootScope.timeOfEnd = new Date();
        $rootScope.timeOfEnd.setHours(Class.endTime.getHours());
        $rootScope.timeOfEnd.setMinutes(Class.endTime.getMinutes());
        $rootScope.location = Class.location;
        $rootScope.adminClassModel = {
            dayOfStart: $rootScope.dayOfStart,
            timeOfStart: $rootScope.timeOfStart,
            dayOfEnd: $rootScope.dayOfEnd,
            timeOfEnd: $rootScope.timeOfEnd,
            id: Class.id,
            trainer:{
                username: Class.trainerName,
                id: Class.trainerId
            },
            maxAttendant: Class.maxAttendant,
            location: Class.location,
            courseId: {
                id: Class.courseId
            }
        };
    };
    $rootScope.classDelete;
    $scope.sendDeleteClass = function (Class) {
        $rootScope.classDelete = Class;
    }

    $scope.DeleteClass = function () {
        var Class = $rootScope.classDelete;
        var courseID = Class.courseId;
        Class.courseName = $scope.courseDetail.name;
        courseDetailServices.deleteClass(Class).then(function (result) {
            if (result.data.success) {
                courseDetailServices.getClassByCourseID(Class.courseId).then(function (result) {
                    $rootScope.classList = result.data.data;
                });
                $rootScope.ShowPopupMessage("Delete Class Successfully", "success");
                //$location.path("#courseDetail");
            } else {
                $rootScope.ShowPopupMessage('Fail to Delete Class!', "error");
            }

        });
    };
}]);

myApp.controller('DateTimepickerCtrl', function ($scope, $rootScope, $log) {
    //time picker

    $scope.hstep = 1;
    $scope.mstep = 5;

    $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    $scope.ismeridian = false;
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };

    //DatePicker
    $rootScope.dayOfStart = '';
    $scope.today = function () {
        $rootScope.dayOfStart = new Date();
    };

    $scope.clear = function () {
        $rootScope.dayOfStart = null;
    };

    $scope.inlineOptions = {
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function () {
        $scope.popup2.opened = true;
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

});
