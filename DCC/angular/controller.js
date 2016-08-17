var myApp = angular.module('myApp', ['ngCookies', 'ngTagsInput', 'textAngular','course']);
// creat angular controller
myApp.controller('LoginCtrl', function($scope, $http, $cookies, $rootScope) {
    // function to submit the form after all validation has occurred
    $http.get('/isLogged')
        .then(function(res) {
            $cookies.put('userid', res.data);
            $rootScope.userid = $cookies.get('userid');
        });
    if ($cookies.get('userid')) {
        $rootScope.userid = $cookies.get('userid');
    }
    // login/ logout message: success or fail
    $scope.message = '';
    // call the login function in service.js
    $scope.user = {
        username: '',
        password: ''
    };
    $scope.isAuthenticated = false;
    $scope.login = function() {
        $http.post('/users/login', $scope.user).then(function(result) {
            if (result.data.userid) {
                $scope.isAuthenticated = true;
                $cookies.put('userid', result.data.userid);
                $rootScope.userid = result.data.userid;
                $scope.message = result.data.msg;
            } else {
                $scope.isAuthenticated = false;
                $scope.message = result.data.msg;
            }
        });
    };
    // logout function
    $rootScope.logout = function() {
        $cookies.remove('userid');
    }
});

myApp.controller('SetCourseCtrl', function($scope, $http, $window,$sce) {
    var path = $window.location.pathname;
    path = path.split('/');
    var courseID = path.pop();
    $http.post('/course/getCourse', {
        courseID: courseID
    }).then(function(result) {
        var trainerJSON = result.data.courseTrainer;
        var trainers = [];
        for (var i = 0; i < trainerJSON.length; i++) {
            trainers.push(trainerJSON[i].text);
        }
        $scope.courseName = result.data.courseName;
        $scope.courseTrainer = trainers;
        $scope.courseTrainerPage = result.data.courseTrainerPage;
        $scope.courseDescription = $sce.trustAsHtml(result.data.courseDescription);
        $scope.courseCategory = result.data.courseCategory;
        $scope.courseDocuments = result.data.courseDocuments;
    });
});

myApp.controller('GetListCtrl', function($scope, $rootScope, $http,CourseList) {
    CourseList.getCourseList().then(function(result){
      $rootScope.coursesList = result;
    });

    // edit course
    $scope.editCourse = function(course) {
        $rootScope.courseslistEdit = {
            courseIDEdit: course.id,
            courseNameEdit: course.name,
            courseDescriptionEdit: course.description,
            courseCategoryEdit: course.category,
            courseTestEdit: course.test,
            courseDocumentsEdit: course.documents,
            courseTrainerIDEdit: course.trainerIDJSON
        }
    }

    // delete course
    $scope.deleteCourse = function(course) {
        $rootScope.courseslistDelete = {
            courseIDDelete: course.id,
            courseNameDelete: course.name,
            // courseDescriptionDelete: course.description,
            // courseCategoryDelete: course.category,
            // courseTestDelete: course.test,
            // courseDocumentsDelete: course.documents,
            // courseTrainerIDDelete: course.trainerID,
            courseIsDeletedDelete: course.isDeleted
        }
    }
});

myApp.controller('SetFeatureCtrl', function($scope, $http) {
    $http.get('/course/features').then(function(result) {
        $scope.courseDocuments = result.data.courseDocuments;
        $scope.courseFeedback = result.data.courseFeedback;
        $scope.courseTest = result.data.courseTest;
        $scope.courseRating = result.data.courseRating;

    });
});

myApp.controller('SetProfileCtrl', function($scope, $rootScope, $http, $window) {
    $scope.user = {
        pStatus: '',
        pName: '',
        pDoB: '',
        pPhone: '',
        pLocation: '',
        pEmail: '',
        pAvatar: ''
    };
    $http.get('/users/userprofileController').then(function(result) {
        $scope.user.pStatus = result.data.pStatus;
        $scope.user.pName = result.data.pName;
        $scope.user.pDoB = result.data.pDoB;
        $scope.user.pPhone = result.data.pPhone;
        $scope.user.pLocation = result.data.pLocation;
        $scope.user.pEmail = result.data.pEmail;
        $scope.user.pAvatar = result.data.pAvatar;
    });

    $scope.msg = '';
    $rootScope.edit = function() {
        $http.post('/users/userprofileReturnValue', $scope.user).then(function(result) {
            $scope.msg = result.data.msg;
            $window.location.href = '/users/userprofile';
        });
    }
});

// AddCourseCtrl: add course controller
myApp.controller('AddCourseCtrl', function($scope, $rootScope, $http,CourseList) {
    $scope.courseslist = {
        courseName: '',
        courseDescription: '',
        courseCategory: '',
        courseTest: '',
        courseDocuments: '',
        courseTrainerID: ''
    };
    $scope.postMsg = '';
    $scope.getMsg = '';
    $scope.addCourse = function() {

        $http.post('/course/addCourse', $scope.courseslist).then(function(result) {
            $scope.postMsg = result.data.msg;
            CourseList.getCourseList().then(function(result){
              $rootScope.coursesList = result;
            });
        });
    }
});

// UpdateCourseCtrl: edit course controller
myApp.controller('UpdateCourseCtrl', function($scope, $rootScope, $http,CourseList) {
    $scope.postMsg = '';
    $scope.getMsg = '';
    $scope.updateCourse = function() {
        $http.post('/course/updateCourse', $rootScope.courseslistEdit).then(function(result) {
            $scope.postMsg = result.data.msg;
            CourseList.getCourseList().then(function(result){
              $rootScope.coursesList = result;
            });
        });
    }
});

// IsDeletedCourseCtrl: delete course controller
myApp.controller('IsDeletedCourseCtrl', function($scope, $rootScope, $http,CourseList) {
    $scope.postMsg = '';
    $scope.getMsg = '';
    $scope.isDeletedCourse = function() {
        $http.post('/course/isDeletedCourse', $rootScope.courseslistDelete).then(function(result) {
            $scope.postMsg = result.data.msg;
            CourseList.getCourseList().then(function(result){
              $rootScope.coursesList = result;
            });
        });
    }
});

//controller for Feedback
myApp.controller('FeedbackCtrl', function($scope, $http, $window) {
    var path = $window.location.pathname;
    path = path.split('/');
    var courseID = path.pop();
    $scope.msg = '';
    $scope.comment = '';
    $scope.rating = '';
    $scope.addFeedback = function() {
        $http.post('/feedback/comment', {
            comment: $scope.comment,
            courseID: parseInt(courseID),
        }).then(function(result){
          $scope.msg = result.data.msg;
        });
    }
    $scope.addRating = function() {
        $http.post('/feedback/rating', {
            rating: $scope.rating,
            courseID: parseInt(courseID),
        }).then(function(result){
          $scope.msg = result.data.msg;
        });
    }
    $scope.showFeedback = function() {
        $scope.feedbackList = [];
        $http.post('/feedback/showFeedback', {
            courseID: courseID
        }).then(function(result) {
            $scope.feedbackList = result.data;
        });
    }
      $http.post('/feedback/showAverageRating',{
          courseID: courseID
      }).then(function(result){
        $scope.average = result.data.result;
      });
});
