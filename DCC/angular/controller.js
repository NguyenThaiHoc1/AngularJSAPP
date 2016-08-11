var myApp = angular.module('myApp', ['ngCookies','ngTagsInput']);
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
        var trainerJSON = result.data.courseTrainer;
        var trainers = [];
        for (i=0;i<trainerJSON.length;i++){
          trainers.push(trainerJSON[i].text);
        }
        $scope.courseName = result.data.courseName;
        $scope.courseTrainer = trainers;
        $scope.courseTrainerPage = result.data.courseTrainerPage;
        $scope.courseDescription = result.data.courseDescription;
        $scope.courseCategory = result.data.courseCategory;
        $scope.courseDocuments = result.data.courseDocuments;
        console.log($scope.courseTrainer);
    });
});

myApp.controller('getList', function($scope,$rootScope, $http) {
    $http.get('/course/list').then(function(result) {
      $rootScope.coursesList = result.data.course;
      for(i=0;i<$rootScope.coursesList.length;i++){
        $rootScope.coursesList[i].trainerID = JSON.parse($rootScope.coursesList[i].trainerID);
        $rootScope.coursesList[i].trainerIDJSON = $rootScope.coursesList[i].trainerID;
        var trainers =$rootScope.coursesList[i].trainerID[0].text;
        for (j=1;j<$rootScope.coursesList[i].trainerID.length;j++){
          trainers = trainers + ' / '+ $rootScope.coursesList[i].trainerID[j].text;
        }
        $rootScope.coursesList[i].trainerID = trainers;
      }
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
        console.log($rootScope.courseslistEdit);
    }

    // delete course
    $scope.deleteCourse = function(course) {
        $rootScope.courseslistDelete = {
            courseIDDelete: course.id,
            courseNameDelete: course.name,
            courseDescriptionDelete: course.description,
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

myApp.controller('setProfile', function($scope, $rootScope, $http, $window) {
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

// add course controller
myApp.controller('addCourse', function($scope, $rootScope, $http, $window) {
    $scope.courseslist = {
        courseName: '',
        courseDescription: '',
        courseCategory: '',
        courseTest: '',
        courseDocuments: '',
        courseTrainerID: ''
    };
    $scope.msg = '';

    $scope.addCourse = function() {
        $http.post('/course/addCourse', $scope.courseslist).then(function(result) {
            $scope.msg = result.data.msg;
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
      $http.post('/course/coursesoverview/comment', {
          comment : $scope.comment,
          courseID : parseInt(courseID),
      })
      // .success(function(data, status, headers, config) {
      //     $scope.feedbacks.push({
      //       comment : $scope.comment,
      //       courseID : parseInt(courseID)
      //     });
      //     $scope.comment = '';
      // })
      ;
  }
  $scope.addRating = function(){
    $http.post('/course/coursesoverview/rating', {
        rating : $scope.rating,
        courseID : parseInt(courseID),
    })
    // .success(function(data, status, headers, config) {
    //     $scope.feedbacks.push({
    //       rating : $scope.rating,
    //       courseID : parseInt(courseID),
    //     });
    // })
    ;
  }
});
