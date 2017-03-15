'use strict';

angular.module('trainee_dashboard', ['ui.calendar', 'ui.bootstrap']);

//Routers
myApp.config(function ($stateProvider) {
    $stateProvider.state('trainee_dashboard', {
        url: '/trainee_dashboard',
        templateUrl: 'partials/traineeModule/dashboard/dashboard.html',
        data: {
            auth: true
        }
    });

});

//Factories
myApp.factory('dashboardServices', ['$http', function ($http) {

    var factoryDefinitions = {
        getMyTraingPrograms: function (req) {
            return $http.post('/trainee/dashboard/getTrainingProgramByTPType', req).success(function (data) { return data; });
        },
        getRequestOpenCourse: function (req) {
            return $http.post('/trainee/dashboard/getRequestOpenCourse', req).success(function (data) { return data; });
        },
        deleteRequestOpenCourse: function (req) {
            return $http.post('/trainee/courseRegister/deleteRequestOpening', req).success(function (data) { return data; });
        },
        updateClassRecordStatus: function (req) {
            return $http.post('/trainee/courseRegister/updateClassRecordStatus', req).success(function (data) { return data; });
        },
        unEnrollCourse: function (req) {
            return $http.post('/trainee/courseRegister/unEnrollCourse', req).success(function (data) { return data; });
        },
        sendRegisterRequest: function (request) {
            return $http.post('/trainee/courseRegister/sendRegisterRequest', request).success(function (data) { return data; });
        },
        //feedback
        sendFeedback: function (req) {
            return $http.post('/trainee/feedback/sendFeedback', req).success(function (data) { return data; });
        },
        getMyFeedbackByClass: function (classId) {
            return $http.post('/trainee/feedback/getMyFeedbackByClass', classId).success(function (data) { return data; });
        },
        getEnrolledCourseList: function (userId) {
            return $http.post('trainee/viewSchedule/getEnrolledCourseList', userId).success(function (data) { return data; });
        }
    }

    return factoryDefinitions;
}]);

var temporaryClassID;
//Controllers
myApp.controller('MyCoursesCtrl', ['$scope', 'dashboardServices', '$rootScope', '$state', '$location', '$anchorScroll', function ($scope, dashboardServices, $rootScope, $state, $location, $anchorScroll) {
    const STATUS_ENROLLED = 'Enrolled';
    const STATUS_LEARNED = 'Learned';
    const STATUS_NOT_LEARNED = 'Not Learned';

    //Init action text of button base on status of a course
    $scope.actionOneText = {}; $scope.actionTwoText = {};
    $scope.actionOneText[STATUS_LEARNED] = 'Give feedback';
    $scope.actionTwoText[STATUS_LEARNED] = 'Re-enroll';
    $scope.actionOneText[STATUS_ENROLLED] = 'View Schedule';
    $scope.actionTwoText[STATUS_ENROLLED] = 'Un-enroll';


    //get all courses and training programs - REFRESH
    dashboardServices.getMyTraingPrograms({ traineeId: $rootScope.userInfo.id, email: $rootScope.userInfo.email, userType: $rootScope.userInfo.userType, isExperienced: $rootScope.userInfo.isExperienced }).then(function (result) {
        result.data.trainingProgram.forEach(trainingProgram => {
            if (trainingProgram.Courses.length == 0) {
                trainingProgram.completePercent = 0;
            }
            else {
                trainingProgram.count = 0;
                trainingProgram.Courses.forEach(course => {
                    if (course.Classes.length != 0) {
                        for (var i = 0; i < course.Classes.length; i++) {

                            if (course.Classes[i].ClassRecords.length == 0) {
                                course.backgroundColor = '#ffb84d';
                                course.status = 'Not Learned';
                            }
                            else {
                                for (var j = 0; j < course.Classes[i].ClassRecords.length; j++) {
                                    if (course.Classes[i].ClassRecords[j].traineeId == $rootScope.userInfo.id) {
                                        course.classId = course.Classes[i].ClassRecords[j].classId;
                                        course.status = course.Classes[i].ClassRecords[j].status;
                                    }
                                }
                                if (course.status == STATUS_ENROLLED) {
                                    course.Classes.forEach(classes => {
                                        var today = new Date();
                                        if (Date.parse(classes.endTime) < Date.parse(today)) {
                                            classes.ClassRecords.forEach(classRecord => {
                                                dashboardServices.updateClassRecordStatus(classRecord)
                                            });
                                            course.backgroundColor = '#8BC34A';
                                        }
                                        else course.backgroundColor = '#4FC3F7';
                                    });
                                }
                                else if (course.status == STATUS_LEARNED) {
                                    course.backgroundColor = '#8BC34A';
                                    trainingProgram.count = trainingProgram.count + 1;
                                }
                                else {
                                    course.backgroundColor = '#ffb84d';
                                    course.status = 'Not Learned';
                                }
                            }
                        }
                    }
                    else {
                        course.backgroundColor = '#ffb84d';
                        course.status = 'Not Learned';
                    }
                });
                trainingProgram.completePercent = Math.ceil(trainingProgram.count / trainingProgram.Courses.length * 100);
            }
        });
        $scope.myTrainingProgramList = result.data.trainingProgram;
    });
    // un-Enroll or re-Enroll Course
    $scope.actionTwoClick = function (myCourse) {
        if (myCourse.status == STATUS_ENROLLED) {
            //un-enroll
            dashboardServices.unEnrollCourse({ traineeId: $rootScope.userInfo.id, classId: myCourse.classId }).then(function (result) {
                if (result.data.success) {
                    //REFRESH
                    dashboardServices.getMyTraingPrograms({ traineeId: $rootScope.userInfo.id, email: $rootScope.userInfo.email, userType: $rootScope.userInfo.userType, isExperienced: $rootScope.userInfo.isExperienced }).then(function (result) {
                        result.data.trainingProgram.forEach(trainingProgram => {
                            if (trainingProgram.Courses.length == 0) {
                                trainingProgram.completePercent = 0;
                            }
                            else {
                                trainingProgram.count = 0;

                                trainingProgram.Courses.forEach(course => {
                                    if (course.Classes.length != 0) {
                                        for (var i = 0; i < course.Classes.length; i++) {

                                            if (course.Classes[i].ClassRecords.length == 0) {
                                                course.backgroundColor = '#ffb84d';
                                                course.status = 'Not Learned';
                                            }
                                            else {
                                                for (var j = 0; j < course.Classes[i].ClassRecords.length; j++) {
                                                    if (course.Classes[i].ClassRecords[j].traineeId == $rootScope.userInfo.id) {
                                                        course.classId = course.Classes[i].ClassRecords[j].classId;
                                                        course.status = course.Classes[i].ClassRecords[j].status;
                                                    }
                                                }
                                                if (course.status == STATUS_ENROLLED) { course.backgroundColor = '#4FC3F7' }
                                                else if (course.status == STATUS_LEARNED) {
                                                    course.backgroundColor = '#8BC34A';
                                                    trainingProgram.count = trainingProgram.count + 1;
                                                }
                                                else {
                                                    course.backgroundColor = '#ffb84d';
                                                    course.status = 'Not Learned';
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        course.backgroundColor = '#ffb84d';
                                        course.status = 'Not Learned';
                                    }
                                });
                                trainingProgram.completePercent = Math.ceil(trainingProgram.count / trainingProgram.Courses.length * 100);
                            }
                        });
                        $scope.myTrainingProgramList = result.data.trainingProgram;
                    });
                    //--END OF REFRESH
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                } else {
                    $rootScope.ShowPopupMessage(result.data.msg, "error");
                }
            });
        } else if (myCourse.status == STATUS_LEARNED) {
            //re-Enroll: function same function request Opening
            dashboardServices.sendRegisterRequest({ userId: $rootScope.userInfo.id, courseId: myCourse.id }).then(function (result) {
                if (result.data.success) {
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                    //REFRESH
                    dashboardServices.getMyTraingPrograms({ traineeId: $rootScope.userInfo.id, email: $rootScope.userInfo.email, userType: $rootScope.userInfo.userType, isExperienced: $rootScope.userInfo.isExperienced }).then(function (result) {
                        result.data.trainingProgram.forEach(trainingProgram => {
                            if (trainingProgram.Courses.length == 0) {
                                trainingProgram.completePercent = 0;
                            }
                            else {
                                trainingProgram.count = 0;

                                trainingProgram.Courses.forEach(course => {
                                    if (course.Classes.length != 0) {
                                        for (var i = 0; i < course.Classes.length; i++) {

                                            if (course.Classes[i].ClassRecords.length == 0) {
                                                course.backgroundColor = '#ffb84d';
                                                course.status = 'Not Learned';
                                            }
                                            else {
                                                for (var j = 0; j < course.Classes[i].ClassRecords.length; j++) {
                                                    if (course.Classes[i].ClassRecords[j].traineeId == $rootScope.userInfo.id) {
                                                        course.classId = course.Classes[i].ClassRecords[j].classId;
                                                        course.status = course.Classes[i].ClassRecords[j].status;
                                                    }
                                                }
                                                if (course.status == STATUS_ENROLLED) { course.backgroundColor = '#4FC3F7' }
                                                else if (course.status == STATUS_LEARNED) {
                                                    course.backgroundColor = '#8BC34A';
                                                    trainingProgram.count = trainingProgram.count + 1;
                                                }
                                                else {
                                                    course.backgroundColor = '#ffb84d';
                                                    course.status = 'Not Learned';
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        course.backgroundColor = '#ffb84d';
                                        course.status = 'Not Learned';
                                    }
                                });
                                trainingProgram.completePercent = Math.ceil(trainingProgram.count / trainingProgram.Courses.length * 100);
                            }
                        });
                        $scope.myTrainingProgramList = result.data.trainingProgram;
                    });
                    //--END OF REFRESH
                } else {
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                }
            });
        }
    };
    //Give feedback or View Schedule function
    $scope.hoveringOver = function (value) {
        $rootScope.overStar = value;
    };

    $scope.actionOneClick = function (myCourse) {

        if (myCourse.status == STATUS_ENROLLED) {
            //View Schedule
            $scope.scrollTo = function (scrollLocation) {
                $location.hash(scrollLocation);
                $anchorScroll();
            }
            $scope.scrollTo('mySchedule');
        } else if (myCourse.status == STATUS_LEARNED) {
            // show feedback modal
            $('#feedbackModal').modal('show');
            temporaryClassID = myCourse.classId;
            myCourse.traineeId = $rootScope.userInfo.id;
            dashboardServices.getMyFeedbackByClass(myCourse).then(function (result) {
                $rootScope.courseFeedbackModel = result.data.feedback;
            });
        }
    };

    $scope.giveFeedbackClick = function (feedbackModel) {
        feedbackModel.traineeId = $rootScope.userInfo.id;
        feedbackModel.classId = temporaryClassID;
        dashboardServices.sendFeedback(feedbackModel).then(function (result) {
            if (result.data.success) {
                $rootScope.ShowPopupMessage("Rating success", "success");
            } else {
                $rootScope.ShowPopupMessage("Rating fail", "error");
            }

        });
    };

}]);

//Request Open Course controller
myApp.controller('requestOpenCourseCtrl', ['$scope', 'dashboardServices', '$rootScope', function ($scope, dashboardServices, $rootScope) {
    dashboardServices.getRequestOpenCourse({ userId: $rootScope.userInfo.id }).then(function (result) {
        $scope.myRequestOpenCourseList = result.data.data;
    });

    $scope.cancelRequestClick = function (requestOpenCourseId) {
        dashboardServices.deleteRequestOpenCourse({ courseId: requestOpenCourseId, userId: $rootScope.userInfo.id }).then(function (result) {
            if (result.data.success) {
                $rootScope.ShowPopupMessage(result.data.msg, "success");

                //refesh the request open course list
                dashboardServices.getRequestOpenCourse({ userId: $rootScope.userInfo.id }).then(function (result) {
                    $scope.myRequestOpenCourseList = result.data.data;
                });
            } else {
                $rootScope.ShowPopupMessage(result.data.msg, "error");
            }
        });
    };
}]);

//Feedback controller
myApp.controller('FeedbackCtrl', ['$scope', 'dashboardServices', '$rootScope', function ($scope, dashboardServices, $rootScope) {


}]);


myApp.controller('viewScheduleCtrl', function ($scope, dashboardServices, $rootScope) {
    $scope.events = [];
    $scope.eventSources = [$scope.events];

    dashboardServices.getEnrolledCourseList({ userId: $rootScope.userInfo.id }).then(function (result) {
        var enrolledCourseList = result.data.data;
        angular.forEach(enrolledCourseList, function (value) {
            $scope.events.push({
                title: value.title,
                description: value.description,
                start: new Date(value.start),
                end: new Date(value.end),
                location: value.location,
                // allDay: value.IsFullDay,
                stick: true
            });
        });
    });

    // $scope.calendarView = 'month';
    // $scope.events = [
    //     {
    //         title: 'My event title', // The title of the event
    //         startsAt: new Date(), // A javascript date object for when the event starts
    //         //endsAt: new Date(2017, 3, 3, 15), // Optional - a javascript date object for when the event ends
    //         color: { // can also be calendarConfig.colorTypes.warning for shortcuts to the deprecated event types
    //             primary: '#e3bc08', // the primary event color (should be darker than secondary)
    //             secondary: '#fdf1ba' // the secondary event color (should be lighter than primary)
    //         },
    //         // actions: [{ // an array of actions that will be displayed next to the event title
    //         //     label: '<i class=\'glyphicon glyphicon-pencil\'></i>', // the label of the action
    //         //     cssClass: 'edit-action', // a CSS class that will be added to the action element so you can implement custom styling
    //         //     onClick: function (args) { // the action that occurs when it is clicked. The first argument will be an object containing the parent event
    //         //         console.log('Edit event', args.calendarEvent);
    //         //     }
    //         // }],
    //         // allDay: false // set to true to display the event as an all day event on the day view
    //     }
    // ];
    // $scope.calendarTitle = 'My Schedule';
    // $scope.viewDate = moment();
});

