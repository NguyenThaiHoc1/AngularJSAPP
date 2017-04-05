'use strict';

angular.module('admin_courseManagement', ['textAngular', 'courseDetail']);

//Routers
myApp.config(function ($stateProvider) {
    $stateProvider.state('admin_courseManagement', {
        url: '/admin_courseManagement',
        templateUrl: 'partials/adminModule/courseManagement/courseManagement.html',
        data: {
            auth: true
        },
    });
});

//Factory
myApp.factory('courseManagementServices', ['$http', function ($http) {

    var factoryDefinitions = {
        getCourseTypeList: function () {
            return $http.get('/admin/courses/getCourseTypeList').success(function (data) { return data; });
        },
        //Course
        addCourse: function (course) {
            return $http.post('/admin/courses/addCourse', course).success(function (data) { return data; });
        },
        updateCourse: function (course) {
            return $http.post('/admin/courses/updateCourse', course).success(function (data) { return data; });
        },
        deleteCourse: function (courseId) {
            return $http.post('/admin/courses/deleteCourse', courseId).success(function (data) { return data; });
        },
        //Training Program
        getTrainingProgramList: function () {
            return $http.get('/admin/courses/getTrainingProgramList').success(function (data) { return data; });
        },
        addTrainingProgram: function (trainingProgram) {
            return $http.post('/admin/courses/addTrainingProgram', trainingProgram).success(function (data) { return data; });
        },
        updateTrainingProgram: function (trainingProgram) {
            return $http.post('/admin/courses/updateTrainingProgram', trainingProgram).success(function (data) { return data; });
        },
        deleteTrainingProgram: function (trainingProgram) {
            return $http.post('/admin/courses/deleteTrainingProgram', trainingProgram).success(function (data) { return data; });
        },
        //Class
        getClass: function (courseId) {
            return $http.post('/admin/courses/getClass', courseId).success(function (data) { return data; });
        },
        addClass: function (Class) {
            return $http.post('/admin/courses/addClass', Class).success(function (data) { return data; });
        },
        updateClass: function (Class) {
            return $http.post('/admin/courses/updateTrainingProgram', Class).success(function (data) { return data; });
        },
        deleteClass: function (Class) {
            return $http.post('/admin/courses/deleteClass', Class).success(function (data) { return data; });
        },
        getTrainerList:function() {
            return $http.get('/admin/courses/getAllTrainer').success(function (data) { return data; });
        },
    }

    return factoryDefinitions;
}
]);
var temp;
//controller
myApp.controller('courseManagementCtrl', ['$sce', '$scope', '$rootScope', 'courseManagementServices', function ($sce, $scope, $rootScope, courseManagementServices, $location) {
    $rootScope.getTrainerList = function() {
    courseManagementServices.getTrainerList().then(function (result) {
      $rootScope.trainerList = result.data.trainer;
    });
    }

    //GetTrainingProgram
    courseManagementServices.getTrainingProgramList().then(function (result) {
        result.data.trainingProgram.forEach(traningProgram => {
            traningProgram.Courses.forEach(course => {
                course.Classes.forEach(adminclass => {
                });
            });
        });

        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
    });

    //dislay modal of edit & add course, trainning program or class

    $scope.showAddCourseForm = function (trainingProgram) {
        $rootScope.addEditFormIsEditForm = false;
        //course
        $rootScope.addEditCourseFormTitle = 'Add Course';
        $rootScope.addEditCourseFormAction = 'Add';
        $rootScope.courseModel = {
            name: '',
            description: '',
            duration: '',
            documents: '',
            test: '',
            trainingProgramId: trainingProgram.id

        };
    };
    $scope.showAddTPForm = function () {
        $rootScope.addEditFormIsEditForm = false;
        // trainingProgram
        $rootScope.addEditTPFormTitle = 'Add Training Program';
        $rootScope.addEditTPFormAction = 'Add';
        $rootScope.adminTrainingProgramModel = {
            name: '',
            description: '',
            courseTypeId: {
                id: ''
            }
        };
    };

    $scope.showUpdateCourseForm = function (trainingProgram, course) {
        $rootScope.addEditFormIsEditForm = true;
        //course
        $rootScope.addEditCourseFormTitle = 'Edit Course';
        $rootScope.addEditCourseFormAction = 'Update';
        $rootScope.courseModel = {
            id: course.id,
            name: course.name,
            description: course.description,
            duration: course.duration,
            documents: course.documents,
            test: course.test,
            //TODO
            // trainerId: adminclass.trainerId,
            trainingProgramId: trainingProgram.id
        };

    };
    $scope.showUpdateTPForm = function (trainingProgram) {
        $rootScope.addEditFormIsEditForm = true;
        //trainingProgram
        $rootScope.addEditTPFormTitle = 'Edit Training Program';
        $rootScope.addEditTPFormAction = 'Update Training Program';
        $rootScope.adminTrainingProgramModel = {
            id: trainingProgram.id,
            name: trainingProgram.name,
            description: trainingProgram.description,
            courseTypeId: { id: trainingProgram.courseTypeId }
        };
    };
    $scope.showDeleteCourseForm = function (course) {
        $rootScope.deleteClickId = 1;
        //course
        $rootScope.deleteName = course.name + ' course';
        $rootScope.courseModel = {
            id: course.id,
        };
    };
    $scope.showDeleteTPForm = function (trainingProgram) {
        $rootScope.deleteClickId = 2;
        //training Program
        $rootScope.deleteName = trainingProgram.name + 'training program';
        $rootScope.adminTrainingProgramModel = {
            id: trainingProgram.id,
        };
    };
    $scope.showAddClassForm = function (course) {
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
            courseId: course.id,
            location: '',
            //TODO
            // trainerId: '',
            startTime: $rootScope.dateTimePicker,
            endTime: $rootScope.endTimePicker,
            maxAttendant: '',
        };
    };
    $scope.findCourse = function (courseSearchKey) {
        if((courseSearchKey!='r')&&(courseSearchKey!='p')&&(courseSearchKey!='<')&&(courseSearchKey!='>'))
        {
        var courseListSearchResult = []
        var listSearchResult = []
        $rootScope.adminTrainingProgramList.forEach(trainingProgram => {
            trainingProgram.Courses.forEach(course => {
                if ((course.name.toUpperCase().indexOf(courseSearchKey.toUpperCase()) !== -1) || (course.description.toUpperCase().indexOf(courseSearchKey.toUpperCase()) !== -1)) courseListSearchResult.push(course);
            });
        });
        }
        $scope.courseListSearchResult = courseListSearchResult;
    };
    $scope.highlight = function (text, search) {
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };
}]);

//Add and Edit Course Control
myApp.controller('addEditCourseCtrl', ['$scope', '$rootScope', 'courseManagementServices', function ($scope, $rootScope, courseManagementServices, $location) {
    //get TrainingProgram
    courseManagementServices.getTrainingProgramList().then(function (result) {
        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
    });

    $scope.addEditCourseClick = function () {
        if ($rootScope.addEditFormIsEditForm) {
            //edit course
            courseManagementServices.updateCourse($rootScope.courseModel).then(function (result) {
                if (result.data.success) {
                    //GetTrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function (result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                    });
                    $rootScope.ShowPopupMessage("Edit Course Successfully", "success");
                    // $location.path("#admin_courseManagement");
                } else {
                    $rootScope.ShowPopupMessage("Fail to Edit Course", "error");
                }
            });
        }
        else {
            //add course
            courseManagementServices.addCourse($rootScope.courseModel).then(function (result) {
                if (result.data.success) {
                    //GetTrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function (result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                    });
                    // $location.path("/userProfile");
                    $rootScope.ShowPopupMessage("Add Course Successfully", "success");
                } else {
                    $rootScope.ShowPopupMessage("Fail to Add Course", "error");
                }
            });
        }
    };
}]);

//Add and Edit Training Program Control
myApp.controller('addEditTPCtrl', ['$scope', '$rootScope', 'courseManagementServices', function ($scope, $rootScope, courseManagementServices, $location) {

    //getCourseTypeList
    courseManagementServices.getCourseTypeList().then(function (result) {
        $scope.courseTypeList = result.data.courseType;
    });

    $scope.addEditTPClick = function () {
        if ($rootScope.addEditFormIsEditForm) {
            //edit trainning program
            courseManagementServices.updateTrainingProgram($rootScope.adminTrainingProgramModel).then(function (result) {
                if (result.data.success) {
                    //GetTrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function (result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                    });
                    $rootScope.ShowPopupMessage("Edit Training Program Successfully", "success");
                    // $location.path("#admin_courseManagement");
                } else {
                    $rootScope.ShowPopupMessage('Fail to Edit Training Program !', "error");
                }
            });
        }
        else {
            //add trainning program
            courseManagementServices.addTrainingProgram($rootScope.adminTrainingProgramModel).then(function (result) {
                if (result.data.success) {
                    //GetTrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function (result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                    });
                    // $location.path("/userProfile");
                    $rootScope.ShowPopupMessage("Add Training Program Successfully", "success");
                } else {
                    $rootScope.ShowPopupMessage('Fail to Add Training Program', "error");
                }
            });
        }
    };
}]);

//deletel Course, Class, Training program
myApp.controller('deleteCtrl', ['$scope', '$rootScope', 'courseManagementServices', function ($scope, $rootScope, courseManagementServices, $location) {

    $scope.deleteClick = function () {
        if ($rootScope.deleteClickId == 1) {
            //delete course
            courseManagementServices.deleteCourse($rootScope.courseModel).then(function (result) {
                if (result.data.success) {
                    //get TrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function (result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                    });
                    $rootScope.ShowPopupMessage("Delete Course Successfully", "success");
                } else {
                    $rootScope.ShowPopupMessage("Fail to Delete Course", "error");
                }
            });
        } else if ($rootScope.deleteClickId == 2) {
            //delete TP
            courseManagementServices.deleteTrainingProgram($rootScope.adminTrainingProgramModel).then(function (result) {
                if (result.data.success) {
                    //get TrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function (result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                    });
                    $rootScope.ShowPopupMessage("Delete Training Program Successfully", "success");
                } else {
                    $rootScope.ShowPopupMessage("Fail to Delete Training Program", "error");
                }
            });
        } else if ($rootScope.deleteClickId == 3) {
            //delete Class
            courseManagementServices.deleteClass($rootScope.adminClassModel).then(function (result) {
                if (result.data.success) {
                    //get TrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function (result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                    });
                    $rootScope.ShowPopupMessage("Delete Class Successfully", "success");
                } else {
                    $rootScope.ShowPopupMessage("Fail to Delete Class", "error");
                }
            });
        }

    };
}]);


myApp.controller('addEditClassCtrl', ['$scope', '$rootScope','courseManagementServices', 'courseDetailServices', '$stateParams', function ($scope, $rootScope,courseManagementServices, courseDetailServices, $location, $stateParams) {

    
    //Class
    $scope.addEditClassClick = function () {

        if ($rootScope.addEditFormIsEditForm) {
            $rootScope.dateTimePicker = $rootScope.adminClassModel.dayOfStart;
            $rootScope.dateTimePicker.setHours($rootScope.adminClassModel.timeOfStart.getHours());
            $rootScope.dateTimePicker.setMinutes($rootScope.adminClassModel.timeOfStart.getMinutes());
            $rootScope.adminClassModel.startTime = $rootScope.dateTimePicker;

            $rootScope.endTimePicker = $rootScope.adminClassModel.dayOfEnd;
            $rootScope.endTimePicker.setHours($rootScope.adminClassModel.timeOfEnd.getHours());
            $rootScope.endTimePicker.setMinutes($rootScope.adminClassModel.timeOfEnd.getMinutes());
            $rootScope.adminClassModel.endTime = $rootScope.endTimePicker;
            //edit class
            courseDetailServices.updateClass($rootScope.adminClassModel).then(function (result) {

                if (result.data.success) {
                    //Get Class List
                    courseDetailServices.getClassByCourseID($rootScope.adminClassModel.courseId.id).then(function (result) {
                        $rootScope.classList = result.data.data;
                    });

                    $rootScope.ShowPopupMessage("Edit Class Successfully", "success");
                    //$location.path("#courseDetail");
                } else {
                    $rootScope.ShowPopupMessage('Fail to Edit Class!', "error");
                }
            });
        }
        else {
            //add Class
            $rootScope.dateTimePicker = $rootScope.adminClassModel.dayOfStart;
            $rootScope.dateTimePicker.setHours($rootScope.adminClassModel.timeOfStart.getHours());
            $rootScope.dateTimePicker.setMinutes($rootScope.adminClassModel.timeOfStart.getMinutes());
            $rootScope.adminClassModel.startTime = $rootScope.dateTimePicker;

            $rootScope.endTimePicker = $rootScope.adminClassModel.dayOfEnd;
            $rootScope.endTimePicker.setHours($rootScope.adminClassModel.timeOfEnd.getHours());
            $rootScope.endTimePicker.setMinutes($rootScope.adminClassModel.timeOfEnd.getMinutes());
            $rootScope.adminClassModel.endTime = $rootScope.endTimePicker;

            courseDetailServices.addClass($rootScope.adminClassModel).then(function (result) {
                if (result.data.success) {

                    //Get Class List
                    courseDetailServices.getClassByCourseID($rootScope.adminClassModel.courseId).then(function (result) {
                        $rootScope.classList = result.data.data;

                    });
                    // $location.path("/userProfile");
                    $rootScope.ShowPopupMessage("Add Class Successfully", "success");
                } else {
                    $rootScope.ShowPopupMessage('Class Already Existed', "error");
                }

            });

        }
    };
}]);