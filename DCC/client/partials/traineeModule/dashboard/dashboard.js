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
        getMyTraingPrograms: function(req) {
            return $http.post('/trainee/dashboard/getTrainingProgramByTPType', req).success(function(data) { return data; });
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
        sendRegisterRequest: function(request) {
            return $http.post('/trainee/courseRegister/sendRegisterRequest', request).success(function(data) { return data; });
        },
        //feedback
        sendFeedback: function(req) {
            return $http.post('/trainee/feedback/sendFeedback', req).success(function(data) { return data; });
        },
        getMyFeedbackByClass: function( classId) {
            return $http.post('/trainee/feedback/getMyFeedbackByClass', classId).success(function(data) { return data; });
        },
    }

    return factoryDefinitions;
}]);

//Controllers
myApp.controller('MyCoursesCtrl', ['$scope', 'dashboardServices','$rootScope', '$state', function($scope, dashboardServices, $rootScope, $state) {
    const STATUS_ENROLLED = 'Enrolled';
    const STATUS_LEARNED = 'Learned';

    //Init action text of button base on status of a course
    $scope.actionOneText = {}; $scope.actionTwoText = {};
    $scope.actionOneText[STATUS_LEARNED] = 'Give feedback';
    $scope.actionTwoText[STATUS_LEARNED] = 'Re-enroll';
    $scope.actionOneText[STATUS_ENROLLED] = 'View Schedule';
    $scope.actionTwoText[STATUS_ENROLLED] ='Un-enroll';


    //get all courses and training programs
    dashboardServices.getMyTraingPrograms(  $rootScope.userInfo ).then(function(result){
        result.data.trainingProgram.forEach(traningProgram => {
            if ( traningProgram.Courses.length == 0){
                    traningProgram.completePercent =0;
            }else
            {
                traningProgram.count = 0;
                traningProgram.Courses.forEach(course => {
                    if ( course.Classes.length == 0)
                    {
                            course.backgroundColor = 'red';
                            course.status = 'not learn';
                    }
                    else
                    {
                        // class id and status in class Record
                        course.classId = course.Classes[course.Classes.length - 1].ClassRecords[course.Classes[course.Classes.length - 1].ClassRecords.length - 1].classId;
                        course.status = course.Classes[course.Classes.length - 1].ClassRecords[course.Classes[course.Classes.length - 1].ClassRecords.length - 1].status;
                        // change color of courses base on its status (Learned/ Enrolled)
                        if (course.status == STATUS_ENROLLED) {course.backgroundColor = '#4FC3F7'}
                        else if (course.status == STATUS_LEARNED)
                        {
                            course.backgroundColor = '#8BC34A';
                            traningProgram.count = traningProgram.count + 1;
                        }
                        else {course.backgroundColor = 'black'}
                    }
                });
                traningProgram.completePercent = Math.ceil(traningProgram.count / traningProgram.Courses.length * 100);
            }
        });
        $scope.myTrainingProgramList = result.data.trainingProgram;
    });
    // un-Enroll or re-Enroll Course
    $scope.actionTwoClick = function(myCourse){
        if(myCourse.status == STATUS_ENROLLED ){
            console.log("un-enroll");
            //un-enroll
            dashboardServices.unEnrollCourse({traineeEmail: $rootScope.userInfo.email, classId: myCourse.classId}).then(function(result){
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
        }else if(myCourse.status == STATUS_LEARNED){
            console.log("re-enroll");
            //re-Enroll: function same function request Opening
            dashboardServices.sendRegisterRequest({userEmail:$rootScope.userInfo.email, courseId: myCourse.id}).then(function(result){
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
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                }
            });
        }
    };
    //Give feedback or View Schedule function
    $scope.hoveringOver = function(value) {
        $rootScope.overStar = value;
    };


    $scope.actionOneClick = function(myCourse){
        console.log('actionOneClick: ', myCourse.classId );
        dashboardServices.getMyFeedbackByClass(myCourse).then(function(result){
            $rootScope.courseFeedbackModel = result.data.feedback;
        });


        // if (myCourse.status == STATUS_ENROLLED){
        //     //View Schedule
        // }else if (myCourse.status == STATUS_LEARNED ){
        //     console.log("feedback");
        //     console.log (myCourse.classId);
        //     // show feedback modal
        // }
    };

    $scope.giveFeedbackClick = function(cmodel){
        console.log('giveFeedbackClick: ',cmodel.classId);
        dashboardServices.sendFeedback(cmodel).then(function(result){
            if(result.data.success){
                $rootScope.ShowPopupMessage("Rating success", "success");
            }else{
                $rootScope.ShowPopupMessage("Rating fail", "error");
            }

        });
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

//Feedback controller
myApp.controller('FeedbackCtrl',['$scope', 'dashboardServices', '$rootScope', function($scope, dashboardServices, $rootScope) {


}]);
