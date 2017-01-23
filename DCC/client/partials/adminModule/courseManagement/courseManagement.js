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
        // getCourseList: function() {
        //     return $http.get('/admin/courses/getCourseList').success(function(data) { return data; });
        // },
        getCourseTypeList: function(){
            return $http.get('/admin/courses/getCourseTypeList').success(function(data) { return data; });
        },
        //Course
        addCourse: function(course){
            return $http.post('/admin/courses/addCourse',  course).success(function(data) { return data; });
        },
        updateCourse: function(course){
            return $http.post('/admin/courses/updateCourse', course).success(function(data) { return data; });
        },
        deleteCourse: function(courseId){
            return $http.post('/admin/courses/deleteCourse', courseId).success(function(data) { return data; });
        },
        //Training Program
        getTrainingProgramList: function() {
            return $http.get('/admin/courses/getTrainingProgramList').success(function(data) { return data; });
        },
        addTrainingProgram: function(trainingProgram){
            return $http.post('/admin/courses/addTrainingProgram', trainingProgram).success(function(data){return data;});
        },
        updateTrainingProgram: function(trainingProgram){
            return $http.post('/admin/courses/updateTrainingProgram', trainingProgram).success(function(data){return data;});
        },
        deleteTrainingProgram: function(trainingProgram){
            return $http.post('/admin/courses/deleteTrainingProgram', trainingProgram).success(function(data){return data;});
        },
        //Class
        getClass: function(courseId){
            return $http.get('/admin/courses/getClass', courseId).success(function(data) { return data; });
        },
        addClass: function(Class){
            return $http.post('/admin/courses/addClass', Class).success(function(data){return data;});
        },
        updateClass: function(Class){
            return $http.post('/admin/courses/updateTrainingProgram', Class).success(function(data){return data;});
        },
        deleteClass: function(Class){
            return $http.post('/admin/courses/deleteClass', Class).success(function(data){return data;});
        }
    }

    return factoryDefinitions;
}
]);

//controller
myApp.controller('courseManagementCtrl', [ '$scope', '$rootScope','courseManagementServices', function($scope, $rootScope, courseManagementServices, $location) {
    //GetTrainingProgram
    courseManagementServices.getTrainingProgramList().then(function(result) {
        result.data.trainingProgram.forEach(traningProgram => {
            traningProgram.Courses.forEach(course => {
                course.Classes.forEach(adminclass => {

                });
                // // class id and status in class Record
                // course.classId = course.Classes[course.Classes.length - 1].ClassRecords[course.Classes[course.Classes.length - 1].ClassRecords.length - 1].classId;
                // course.status = course.Classes[course.Classes.length - 1].ClassRecords[course.Classes[course.Classes.length - 1].ClassRecords.length - 1].status;
            });
        });

        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
    });

    //dislay modal of edit & add course, trainning program or class

    $scope.showAddForm=function(){
        $rootScope.addEditFormIsEditForm =  false;
        //course
        $rootScope.addEditCourseFormTitle = 'Add Course';
        $rootScope.addEditCourseFormAction = 'Add';
        $rootScope.courseModel = {
            name: '',
            description: '',
            duration:'',
            documents: '',
            test: '',
            courseTypeId: {
                id: ''
            },
            trainingProgramId: ''

        };
        console.log($rootScope.courseModel.courseTypeId.id);

        // trainingProgram
        $rootScope.addEditTPFormTitle = 'Add Training Program';
        $rootScope.addEditTPFormAction = 'Add';
        $rootScope.adminTrainingProgramModel = {
            name: '',
            description: '',
            duration:''
        };

        //Class
        $rootScope.addEditClassFormTitle = 'Add Class';
        $rootScope.addEditClassFormAction = 'Add';
        $rootScope.adminClassModel = {
            courseId: '',
            location: '',
            //TODO
            // trainerId: '',
            startTime: '',
            duration: '',
            maxAttendant: '',
            note: ''
        };
    };

    $scope.showUpdateForm = function(trainingProgram, course, adminclass){
        $rootScope.addEditFormIsEditForm =  true;
        //course
        $rootScope.addEditFormTitle = 'Edit Course';
        $rootScope.addEditFormAction = 'Update';
        console.log(course); //debug
        $rootScope.courseModel = {
            id: course.id,
            name: course.name,
            description: course.description,
            duration: course.duration,
            documents: course.documents,
            test: course.test,
            //TODO
            courseTypeId: course.CourseType.id,
            trainingProgramId: trainingProgram.id
        };
        console.log($rootScope.courseModel);//debug

        //trainingProgram
        $rootScope.addEditTPFormTitle = 'Edit Training Program';
        $rootScope.addEditTPFormAction = 'Update Training Program';
        $rootScope.adminTrainingProgramModel = {
            id: trainingProgram.id,
            name: trainingProgram.name,
            description: trainingProgram.description,
            duration:trainingProgram.duration
        };

        //Class
        $rootScope.addEditClassFormTitle = 'Edit Class';
        $rootScope.addEditClassFormAction = 'Update Class';
        $rootScope.adminClassModel = {
            id: adminclass.id,
            courseId: course.id,
            location: adminclass.location,
            //TODO
            // trainerId: adminclass.trainerId,
            startTime: adminclass.startTime,
            duration: adminclass.duration,
            maxAttendant: adminclass.maxAttendant,
            note: adminclass.note
        };
    };

    $scope.showDeleteForm = function(trainingProgram){
        //course
        $rootScope.courseModel = {
            id: course.id,
            name: course.name
        };

        //training Program
        $rootScope.adminTrainingProgramModel = {
            id: trainingProgram.id,
        };
        //Class
        $rootScope.adminClassModel = {
            id: adminclass.id,
        };
    };


}]);

//Add and Edit Course Control
myApp.controller('addEditCourseCtrl', [ '$scope', '$rootScope','courseManagementServices', function($scope, $rootScope, courseManagementServices, $location) {
    //get TrainingProgram
    courseManagementServices.getTrainingProgramList().then(function(result){
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
                    //GetTrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function(result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
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
                    //GetTrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function(result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
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

//Add and Edit Training Program Control
myApp.controller('addEditTPCtrl', [ '$scope', '$rootScope','courseManagementServices', function($scope, $rootScope, courseManagementServices, $location) {

    $scope.addEditClick = function(){
        if ($rootScope.addEditFormIsEditForm){
            //edit trainning program
            courseManagementServices.updateTrainingProgram($rootScope.adminTrainingProgramModel).then(function(result){
                if (result.data.success){
                    //GetTrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function(result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                    });
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                    $location.path("#admin_courseManagement");
                }else{
                    $rootScope.ShowPopupMessage('Edit Training Program FAIL!',"error");
                }
            });
        }
        else {
            //add trainning program
            courseManagementServices.addTrainingProgram($rootScope.adminTrainingProgramModel).then(function(result) {
                if (result.data.success){
                    //GetTrainingProgram
                    courseManagementServices.getTrainingProgramList().then(function(result) {
                        $rootScope.adminTrainingProgramList = result.data.trainingProgram;
                    });
                    // $location.path("/userProfile");
                    $rootScope.ShowPopupMessage(result.data.msg, "success");
                } else {
                    $rootScope.ShowPopupMessage('Add Training Program FAIL!', "error");
                }
            });
        }
    };
}]);

//Add and Edit Class Control
myApp.controller('addEditClassCtrl', [ '$scope', '$rootScope','courseManagementServices', function($scope, $rootScope, courseManagementServices, $location) {

    $scope.addEditClick = function(){
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

//TODO
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
