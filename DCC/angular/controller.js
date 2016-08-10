var myApp = angular.module('myApp', ['ngCookies']);
// creat angular controller
myApp.controller('LoginCtrl', function($scope, $http, $cookies, $rootScope, $window) {
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
                $window.location.reload();
            } else {
                $scope.isAuthenticated = false;
                $scope.message = result.data.msg;
            }
        });
    };
    // logout function
    $rootScope.logout = function() {

            $cookies.remove('userid');
            $window.location.reload();

    }
});

myApp.controller('setCourse', function($scope, $http,$window) {
    var path = $window.location.pathname;
    path = path.split('/');
    var courseID = path.pop();
    $http.post('/course/getCourse',{courseID:courseID}).then(function(result) {
        $scope.courseName = result.data.courseName;
        $scope.courseTrainer = result.data.courseTrainer;
        $scope.courseTrainerPage = result.data.courseTrainerPage;
        $scope.courseDescription = result.data.courseDescription;
        $scope.courseCategory = result.data.courseCategory;
        $scope.courseDocuments = result.data.courseDocuments;
    });
});

myApp.controller('getList', function($scope,$rootScope, $http) {
    $http.get('/course/list').then(function(result) {
      $rootScope.coursesList = result.data.course;
    });

    // edit course
    $scope.editCourse = function(course) {
        $rootScope.courseslistEdit = {
            courseIDEdit: course.id,
            courseNameEdit: course.name,
            courseDescriptionEdit: course.courseDescription,
            courseCategoryEdit: course.category,
            courseTestEdit: course.test,
            courseDocumentsEdit: course.documents,
            courseTrainerIDEdit: course.trainerID
        }
    }

    // delete course
    $scope.deleteCourse = function(course) {
        $rootScope.courseslistDelete = {
            courseIDDelete: course.id,
            courseNameDelete: course.name,
            courseDescriptionDelete: course.courseDescription,
            courseCategoryDelete: course.category,
            courseTestDelete: course.test,
            courseDocumentsDelete: course.documents,
            courseTrainerIDDelete: course.trainerID,
            courseIsDeletedDelete: course.isDeleted
        }
    }
});

myApp.controller('setFeature', function($scope, $http) {
    $http.get('/course/features').then(function(result) {
        $scope.courseDocuments = result.data.courseDocuments;
        $scope.courseFeedback = result.data.courseFeedback;
        $scope.courseTest = result.data.courseTest;
        $scope.courseRating = result.data.courseRating;

    });
});

myApp.controller('setProfile', function($scope, $http, $window) {
    $http.get('/users/userprofileController').then(function(result) {
        $scope.pStatus = result.data.pStatus;
        $scope.pName = result.data.pName;
        $scope.pDoB = result.data.pDoB;
        $scope.pPhone = result.data.pPhone;
        $scope.pLocation = result.data.pLocation;
        $scope.pEmail = result.data.pEmail;
        $scope.pAvatar = result.data.pAvatar;
    });

    $scope.edit = function() {
        var user = {
          status: $scope.pStatus,
          dob: $scope.pDoB,
          phone: $scope.pPhone,
          location: $scope.pLocation,
          avatar: $scope.pAvatar
        }
        $http.post('/users/userprofileReturnValue', user).then(function(result) {
          $window.location.href = '/users/userprofile';
        });
    }
});

// add course controller
myApp.controller('addCourse', function($scope,$rootScope, $http) {
        $scope.courseslist = {
            courseName: '',
            courseDescription: '',
            courseCategory: '',
            courseTest: '',
            courseDocuments: '',
            courseTrainerID: ''
        };
        $scope.addCourse = function() {
            $http.post('/course/addCourse', $scope.courseslist).then(function(result) {
                $http.get('/course/list').then(function(result) {
                  $rootScope.coursesList = result.data.course;
                });
            });
            $window.location.reload();
        }

});

// updateCourse: edit course controller
myApp.controller('updateCourse', function($scope, $window, $rootScope, $http) {

    $scope.cancelEdit = function() {

        $window.location.reload();
    }

    $scope.updateCourse = function() {
        console.log($rootScope.courseslistEdit);
        $http.post('/course/updateCourse', $rootScope.courseslistEdit).then(function(result) {
            console.log(result.data.msg);
            $http.get('/course/list').then(function(result) {
              console.log(result.data);
              $rootScope.courseslistEdit = result.data.course;
            });
        });
        $window.location.reload();
    }
});

// isDeletedCourse: delete course controller
myApp.controller('isDeletedCourse', function($scope, $window, $rootScope, $http) {

    $scope.cancelDelete = function() {
        $window.location.reload();
    }

    $scope.isDeletedCourse = function() {
        // console.log($rootScope.courseslistDelete);
        $http.post('/course/isDeletedCourse', $rootScope.courseslistDelete).then(function(result) {
            // console.log(result.data.msg);
            $http.get('/course/list').then(function(result) {
            //   console.log(result.data);
              $rootScope.courseslistDelete = result.data.course;
            });
        });
        $window.location.reload();
    }
});

//controller for Feedback
myApp.controller('FeedbackCtrl',function($scope, $http, $window){
  var path = $window.location.pathname;
  path = path.split('/');
  var courseID = path.pop();
  $scope.addFeedback = function() {
    console.log($scope.comment);
      $http.post('/course/coursesoverview/comment', {
          comment : $scope.comment,
          courseID : parseInt(courseID),
      }).success(function(data, status, headers, config) {
          $scope.feedbacks.push({
            comment : $scope.comment,
            courseID : parseInt(courseID)
          });
          $scope.comment = '';
      });
  }
  $scope.addRating = function(){
    $http.post('/course/coursesoverview/rating', {
        rating : $scope.rating,
        courseID : parseInt(courseID),
    }).success(function(data, status, headers, config) {
        $scope.feedbacks.push({
          rating : $scope.rating,
          courseID : parseInt(courseID),
        });
    });
  }
});
