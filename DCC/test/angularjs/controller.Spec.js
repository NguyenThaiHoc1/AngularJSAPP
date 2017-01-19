
describe('GetListCtrl Unit testing #1', function() {

    // Arrange
    var $rootScope;
    var deferred;
    var $q;
    beforeEach(angular.mock.module('myApp'));

    beforeEach(angular.mock.inject(function($controller, _$rootScope_, _$q_, CourseList) {
        $q = _$q_;
        $rootScope = _$rootScope_.$new();
        deferred = _$q_.defer();
        spyOn(CourseList, 'getCourses').and.returnValue(deferred.promise);
        $controller('GetListCtrl', {
            $scope: $rootScope,
            CourseList: CourseList
        });
    }));

    it('Test 1. CourseList service, true result', function() {
      deferred.resolve('test');
      $rootScope.$apply();
      expect($rootScope.coursesList).toBe('test');
    })

    it('Test 2. CourseList service, true result', function() {
      deferred.resolve('');
      $rootScope.$apply();
      expect($rootScope.coursesList).toBe('');
    })

    it('Test 3. CourseList service, false result', function() {
      deferred.resolve('test1');
      $rootScope.$apply();
      expect($rootScope.coursesList).not.toBe('test');
    })

    it('Test 4. CourseList service, false result', function() {
      deferred.resolve('');
      $rootScope.$apply();
      expect($rootScope.coursesList).not.toBe('test');
    })
    //----------------------------------------------------------
    it('Test 5: editCourse() test', inject(function() {
        var course = {
            id: 'agile training',
            name: 'agile',
            description: 'agile training',
            category: 'agile' ,
            test: 'test131',
            documents: 'agile131.pdf',
            // trainerIDJSON: '123321'
        };
        $rootScope.editCourse(course);
        expect($rootScope.courseslistEdit.courseIDEdit).toBe(course.id);
        expect($rootScope.courseslistEdit.courseNameEdit).toBe(course.name);
        expect($rootScope.courseslistEdit.courseDescriptionEdit).toBe(course.description);
        expect($rootScope.courseslistEdit.courseCategoryEdit).toBe(course.category);
        expect($rootScope.courseslistEdit.courseTestEdit).toBe(course.test);
        expect($rootScope.courseslistEdit.courseDocumentsEdit).toBe(course.documents);
        // expect($rootScope.courseslistEdit.courseTrainerIDEdit).toBe(course.trainerIDJSON);
    }));

    it('Test 6: editCourse() test', inject(function() {
        var course = {
            id: 'ICT training',
            name: 'ICT',
            description: 'ICT training',
            category: 'ICT' ,
            test: 'test for ICT course',
            documents: 'ict.pdf',
            // trainerIDJSON: '123321'
        };
        $rootScope.editCourse(course);
        expect($rootScope.courseslistEdit.courseIDEdit).toBe(course.id);
        expect($rootScope.courseslistEdit.courseNameEdit).toBe(course.name);
        expect($rootScope.courseslistEdit.courseDescriptionEdit).toBe(course.description);
        expect($rootScope.courseslistEdit.courseCategoryEdit).toBe(course.category);
        expect($rootScope.courseslistEdit.courseTestEdit).toBe(course.test);
        expect($rootScope.courseslistEdit.courseDocumentsEdit).toBe(course.documents);
        // expect($rootScope.courseslistEdit.courseTrainerIDEdit).toBe(course.trainerIDJSON);
    }));
    //----------------------------------------------------------

    it('Test 7: deleteCourse() test', inject(function() {
        var course = {
            id: 'ICT training',
            name: 'ICT',
            description: 'ICT training',
            category: 'ICT' ,
            test: 'test for ICT course',
            documents: 'ict.pdf',
            // trainerID: '123321',
            isDeleted: true
        };

        $rootScope.deleteCourse(course);
        expect($rootScope.courseslistDelete.courseIDDelete).toBe(course.id);
        expect($rootScope.courseslistDelete.courseNameDelete).toBe(course.name);
        expect($rootScope.courseslistDelete.courseIsDeletedDelete).toBe(course.isDeleted);
    }));

    it('Test 8: deleteCourse() test', inject(function() {
        var course = {
            id: 'agle training',
            name: 'agile',
            description: 'agile training',
            category: 'agile' ,
            test: 'test for agile course',
            documents: 'ict.pdf',
            // trainerID: '123456',
            isDeleted: false
        };

        $rootScope.deleteCourse(course);
        expect($rootScope.courseslistDelete.courseIDDelete).toBe(course.id);
        expect($rootScope.courseslistDelete.courseNameDelete).toBe(course.name);
        expect($rootScope.courseslistDelete.courseIsDeletedDelete).toBe(course.isDeleted);
    }));

});

describe("LoginCtrl Unit testing #2", function() {

    // Arrange
    var mockScope;
    var controller;
    var ToastService;
    var controller, $controller, $scope, $http, $rootScope, createController,$cookies;
    beforeEach(angular.mock.module("myApp"));
    beforeEach(function(){
      ToastService = {
        showToast: function(msg){}
      }
    });
    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $http = $injector.get('$http');
        $httpBackend = $injector.get('$httpBackend');
        $cookies=$injector.get('$cookies');
        createController = {
            loginCtrl: function() {
                return $controller('LoginCtrl', {
                    $scope: $rootScope
                });
            }
        }
    }));

    it('Test 1: LoginCtrl Be Defined', inject(function($controller) {
        controller = createController.loginCtrl();
        expect(controller).toBeDefined();
    }));

    it('Test 2: Check Login Success ', function() {
        controller = createController.loginCtrl();
        var user = {
            username: 'thach',
            password: 'thach123'
        };
        $rootScope.user = user;
        var data = {
            userid: 'thach',
            msg: 'You are authenticated!'
        };
        $rootScope.login();
        $httpBackend.whenPOST('/users/login', user).respond(data);
        $httpBackend.whenGET('/isLogged').respond(data);
        $httpBackend.flush();
        expect($rootScope.isAuthenticated).toBe(true);
    });

    it('Test 3: Check Login Fail: username true, password false ', function() {
        controller = createController.loginCtrl();
        var user = {
            username: 'thach',
            password: 'thach12'
        };
        $rootScope.user = user;
        var data = {
            userid: null,
            msg: 'You are not authenticated!'
        };
        $rootScope.login();
        $httpBackend.whenPOST('/users/login', user).respond(data);
        $httpBackend.whenGET('/isLogged').respond(data);
        $httpBackend.flush();
        expect($rootScope.isAuthenticated).toBe(false);
    });

    it('Test 4: Check Login Fail: username false, password true ', function() {
        controller = createController.loginCtrl();
        var user = {
            username: 'thach1',
            password: 'thach123'
        };
        $rootScope.user = user;
        var data = {
            userid: null,
            msg: 'You are not authenticated!'
        };
        $rootScope.login();
        $httpBackend.whenPOST('/users/login', user).respond(data);
        $httpBackend.whenGET('/isLogged').respond(data);
        $httpBackend.flush();
        expect($rootScope.isAuthenticated).toBe(false);
    });

    it('Test 5: Check Login Fail: username null', function() {
        controller = createController.loginCtrl();
        var user = {
            username: null,
            password: 'thach123'
        };
        $rootScope.user = user;
        var data = {
            userid: null,
            msg: 'You are not authenticated!'
        };
        $rootScope.login();
        $httpBackend.whenPOST('/users/login', user).respond(data);
        $httpBackend.whenGET('/isLogged').respond(data);
        $httpBackend.flush();
        expect($rootScope.isAuthenticated).toBe(false);
    });

    it('Test 6: Check Login Fail: password null ', function() {
        controller = createController.loginCtrl();
        var user = {
            username: 'thach',
            password: null
        };
        $rootScope.user = user;
        var data = {
            userid: '',
            msg: 'You are not authenticated!'
        };
        $rootScope.login();
        $httpBackend.whenPOST('/users/login', user).respond(data);
        $httpBackend.whenGET('/isLogged').respond(data);
        $httpBackend.flush();
        expect($rootScope.isAuthenticated).toBe(false);
    });

    it('Test 7: Check cookies when user logout ', function() {
      controller = createController.loginCtrl();
      var user = {
          username: 'thach',
          password: 'thach123'
      };
      $rootScope.user = user;
      var data = {
          userid: 'thach',
          msg: 'You are authenticated!'
      };
      $rootScope.login();
      $httpBackend.whenPOST('/users/login', user).respond(data);
      $httpBackend.whenGET('/isLogged').respond(data);
      $rootScope.logout();
      expect($cookies.get('userid')).toBe(undefined);
    });

    it('Test 8: Login success, redirect to userprofile.html ', function() {
      controller = createController.loginCtrl();
      var user = {
          username: 'thach',
          password: 'thach123'
      };
      $rootScope.user = user;
      var data = {
          userid: 'thach',
          msg: 'You are authenticated!'
      };
      $rootScope.login();
      $httpBackend.whenPOST('/users/login', user).respond(data);
      $httpBackend.whenGET('/isLogged').respond(data);
      $httpBackend.flush();
      setTimeout(function() {expect(location.href).toEqual('/users/userprofile'); },500);
    });

});

describe("AddCourseCtrl Unit testing #3", function() {
    var controller, $controller, $scope, $rootScope, createController;
    beforeEach(angular.mock.module("myApp"));
    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        createController = {
            addCourse: function() {
                return $controller('AddCourseCtrl', {
                    $scope: $rootScope
                });
            }
        }
    }));

    it('Test 1: AddCourseCtrl Be Defined', inject(function($controller) {
        controller = createController.addCourse();
        expect(controller).toBeDefined();
    }));

    it('Test 2: addCourse() test', inject(function($controller) {
        controller = createController.addCourse();
        var postData = {
            msg : 'Add course success!'
        };
        var course = {
            courseName: 'agile training',
            courseDescription: 'abc xyz',
            courseCategory: 'agile training',
            courseTest: 'test131',
            courseDocuments: 'agile131.pdf',
            // courseTrainerID: '123321'
        };
        var getData = {
          course: course,
          msg: 'send list success'
        };
        $rootScope.courseslist = course;
        $rootScope.addCourse();
        $httpBackend.whenPOST('/course/addCourse', $rootScope.courseslist).respond(postData)
        $httpBackend.whenGET('/course/list').respond(getData);
        $httpBackend.flush();
        expect($rootScope.postMsg).toBe(postData.msg);
    }));

});

describe("UpdateCourseCtrl Unit testing #4", function() {
    var controller, $controller, $scope, $rootScope, createController;
    beforeEach(angular.mock.module("myApp"));
    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        createController = {
            updateCourse: function() {
                return $controller('UpdateCourseCtrl', {
                    $scope: $rootScope
                });
            }
        }

    }));

    it('Test 1: UpdateCourseCtrl Be Defined', inject(function($controller) {
        controller = createController.updateCourse();
        expect(controller).toBeDefined();
    }));

    it('Test 2: updateCourse() test', inject(function($controller) {
        controller = createController.updateCourse();
        var postData = {
            msg : 'Edit course success!'
        };
        var course = {
            courseName: 'agile training',
            courseDescription: 'abc xyz',
            courseCategory: 'agile training',
            courseTest: 'test131',
            courseDocuments: 'agile131.pdf',
            // courseTrainerID: '123321'
        };
        var getData = {
          course: course,
          msg: 'send list success'
        };
        $rootScope.courseslist = course;
        $rootScope.updateCourse();
        $httpBackend.whenPOST('/course/updateCourse', $rootScope.courseslist).respond(postData)
        $httpBackend.whenGET('/course/list').respond(getData);
        $httpBackend.flush();
        expect($rootScope.postMsg).toBe(postData.msg);


    }));
});

describe("SetCourseCtrl Unit testing #5", function() {
    var controller, $controller, $scope, $rootScope, createController, $window;
    beforeEach(angular.mock.module('myApp', function($provide){
            $provide.value('$window', {
              location:{
                pathname:'thach/1'
              }
            });
            // $provide.value('$rootScope', {
            //   showToast: function(msg){
            //     console.log(msg);
            //   }
            // });
        }));

    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $window = $injector.get('$window');
        $httpBackend = $injector.get('$httpBackend');
        createController = {
            setCourse: function() {
                return $controller('SetCourseCtrl', {
                    $scope: $rootScope
                });
            }
        }
    }));

    it('Test 1: setCourse Be Defined', inject(function($controller) {
        controller = createController.setCourse();
        expect(controller).toBeDefined();
    }));

    it('Test 2: post /course/getCourse', inject(function($controller) {
        createController.setCourse();
        var courseID = '1';
        var result = {
            courseName: 'agile',
            // courseTrainer: [{text:'hihi'}],
            // courseTrainerPage: 'trainer page',
            courseDescription: 'description',
            courseCategory: 'category',
            courseDocuments: 'doc.pdf'
        };
        $httpBackend.whenPOST('/course/getCourse', {
            courseID: courseID
        }).respond(result);
        $httpBackend.flush();
        expect($rootScope.courseName).toBe(result.courseName);
        // expect($rootScope.courseTrainerPage).toBe(result.courseTrainerPage);
        // expect($rootScope.courseTrainer[0]).toBe('hihi');
        expect($rootScope.courseCategory).toBe(result.courseCategory);
        expect($rootScope.courseDocuments).toBe(result.courseDocuments);

    }));

    it('Test 3: post /course/getCourse: courseName null', inject(function($controller) {
        createController.setCourse();
        var courseID = '1';
        var result = {
            courseName: null,
            // courseTrainer: [{text:'hihi'}],
            // courseTrainerPage: 'trainer page',
            courseDescription: 'description',
            courseCategory: 'category',
            courseDocuments: 'doc.pdf'
        };
        $httpBackend.whenPOST('/course/getCourse', {
            courseID: courseID
        }).respond(result);
        $httpBackend.flush();
        expect($rootScope.courseName).toBe(result.courseName);
        // expect($rootScope.courseTrainerPage).toBe(result.courseTrainerPage);
        // expect($rootScope.courseTrainer[0]).toBe('hihi');
        expect($rootScope.courseCategory).toBe(result.courseCategory);
        expect($rootScope.courseDocuments).toBe(result.courseDocuments);
    }));

});

describe("IsDeletedCourseCtrl Unit testing #6", function() {
    var controller, $controller, $scope, $rootScope, createController;
    beforeEach(angular.mock.module("myApp"));
    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        createController = {
            isDeletedCourse: function() {
                return $controller('IsDeletedCourseCtrl', {
                    $scope: $rootScope
                });
            }
        }

    }));

    it('Test 1: IsDeletedCourseCtrl Be Defined', inject(function($controller) {
        controller = createController.isDeletedCourse();
        expect(controller).toBeDefined();
    }));

    it('Test 2: isDeletedCourse() test', inject(function($controller) {
        controller = createController.isDeletedCourse();
        var postData = {
            msg: 'Delete success!'
        };
        var course = {
            courseName: 'agile training',
            courseDescription: 'abc xyz',
            courseCategory: 'agile training',
            courseTest: 'test131',
            courseDocuments: 'agile131.pdf',
            // courseTrainerID: '123321'
        };
        var getData = {
          course: course,
          msg:'send list success'
        };
        $rootScope.courseslistDelete = course;
        $rootScope.isDeletedCourse();
        $httpBackend.whenPOST('/course/isDeletedCourse', $rootScope.courseslistDelete).respond(postData)
        $httpBackend.whenGET('/course/list').respond(getData);
        $httpBackend.flush();
        expect($rootScope.postMsg).toBe(postData.msg);
    }));

});

describe("SetFeatureCtrl Unit testing #7", function() {
    var controller, $controller, $scope, $rootScope, createController;
    beforeEach(angular.mock.module("myApp"));
    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        createController = {
            setFeature: function() {
                return $controller('SetFeatureCtrl', {
                    $scope: $rootScope
                });
            }
        }

    }));

    it('Test 1: SetFeatureCtrl Be Defined', inject(function($controller) {
        controller = createController.setFeature();
        expect(controller).toBeDefined();
    }));

    it('Test 2: get /course/features test', inject(function($controller) {
        controller = createController.setFeature();
        var data = {
            courseDocuments : 'This is document',
            courseFeedbackModel : 'This is Feedback',
            courseTest : 'This is test',
            courseRating :'This is rating'
        };
        $httpBackend.whenGET('/course/features').respond(data);
        $httpBackend.flush();
        expect($rootScope.courseDocuments).toBe(data.courseDocuments);
        expect($rootScope.courseFeedbackModel).toBe(data.courseFeedbackModel);
        expect($rootScope.courseTest).toBe(data.courseTest);
        expect($rootScope.courseRating).toBe(data.courseRating);

    }));

});

describe("SetProfileCtrl Unit testing #8", function() {
    var controller, $controller, $scope, $rootScope, createController;
    var action=[{
       id: '1',
       name: 'Admin Dashboard'
    }, {
       id: '2',
       name: 'Trainer Dashboard'
    }, {
       id: '3',
       name: 'Trainee Dashboard'
    },{
       id: '4',
       name: 'Trainee Dashboard'
    }];
    beforeEach(angular.mock.module('myApp', function($provide){
            $provide.value('$window', {
              location:{
                href:'/users/userprofile'
              }
            });
        }));
    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        createController = {
            setProfile: function() {
                return $controller('SetProfileCtrl', {
                    $scope: $rootScope
                });
            }
        }

    }));

    it('Test 1: SetProfileCtrl Be Defined', inject(function($controller) {
        controller = createController.setProfile();
        expect(controller).toBeDefined();
    }));

    it('Test 2: get /users/getUserInfo view Default Dashboard', inject(function($controller) {
        controller = createController.setProfile();
        var data = {
          pStatus: 'abc',
          pName: 'lam',
          pDoB: '10/11/95',
          pPhone: '123456689',
          pLocation: 'DEK',
          pEmail: 'lamz@gmail.com',
          pAvatar: 'acb',
          pAdmin: 0,
          pTrainer: 0,
          pTrainee: 0
        };
        $httpBackend.whenGET('/users/getUserInfo').respond(data);
        $httpBackend.flush();
        expect($rootScope.user.pStatus).toBe(data.pStatus);
        expect($rootScope.user.pName).toBe(data.pName);
        expect($rootScope.user.pDoB).toBe(data.pDoB);
        expect($rootScope.user.pPhone).toBe(data.pPhone);
        expect($rootScope.user.pLocation).toBe(data.pLocation);
        expect($rootScope.user.pEmail).toBe(data.pEmail);
        expect($rootScope.user.pAvatar).toBe(data.pAvatar);
        expect($rootScope.user.pAdmin).toBe(data.pAdmin);
        expect($rootScope.user.pTrainer).toBe(data.pTrainer);
        expect($rootScope.user.pTrainee).toBe(data.pTrainee);
        expect($rootScope.selectedAction.id).toBe(action[3].id);
    }));
    it('Test 3: get /users/getUserInfo view Admin Dashboard', inject(function($controller) {
        controller = createController.setProfile();
        var data = {
          pAdmin: 1,
          pTrainer: 0,
          pTrainee: 0
        };
        $httpBackend.whenGET('/users/getUserInfo').respond(data);
        $httpBackend.flush();
        expect($rootScope.selectedAction.id).toBe(action[0].id);
    }));
    it('Test 4: get /users/getUserInfo view Trainer Dashboard', inject(function($controller) {
        controller = createController.setProfile();

        var data = {
          pAdmin: 0,
          pTrainer: 1,
          pTrainee: 0
        };
        $httpBackend.whenGET('/users/getUserInfo').respond(data);
        $httpBackend.flush();
        expect($rootScope.selectedAction.id).toBe(action[1].id);
    }));
    it('Test 5: get /users/getUserInfo view Trainee Dashboard', inject(function($controller) {
        controller = createController.setProfile();
        var data = {
          pAdmin: 0,
          pTrainer: 0,
          pTrainee: 1
        };
        $httpBackend.whenGET('/users/getUserInfo').respond(data);
        $httpBackend.flush();
        expect($rootScope.selectedAction.id).toBe(action[2].id);
    }));
    it('Test 6: Edit userProfile', inject(function($controller) {
        controller = createController.setProfile();
        var user = {
          pStatus: 'status',
          pName: 'thach',
          pDoB: '10/11',
          pPhone: '123456789',
          pLocation: 'DEK',
          pEmail: 'thac@gmail.com',
          pAvatar: 'pukachu'
        };
        var data = {
          msg : 'Success'
        };
        $rootScope.user = user;
        $rootScope.edit();
        $httpBackend.whenGET('/users/getUserInfo').respond(user);
        $httpBackend.whenPOST('/users/userprofileReturnValue', user).respond(data);
        $httpBackend.flush();
        expect($rootScope.msg).toBe(data.msg);
    }));
  //   it('Test 4: Set Action', inject(function($controller) {
  //       controller = createController.setProfile();
  //       var action=[{
  //      id: '1',
  //      name: 'Admin Dashboard'
  //  }, {
  //      id: '2',
  //      name: 'Trainer Dashboard'
  //  }, {
  //      id: '3',
  //      name: 'Trainee Dashboard'
  //  }];
  //  controller.setAction(action[0]);
  //       expect($scope.admin).toBe(true);
  //         expect($scope.trainer).toBe(false);
  //           expect($scope.trainee).toBe(false);
  //   }));

});


//---------Test for SetTrainingProgram---------------------------------
describe("SetTrainingProgram Unit testing #10", function() {
    var controller, $controller, $scope, $rootScope, createController;

    beforeEach(angular.mock.module('myApp', function($provide){
            $provide.value('$window', {
              location:{
                href:'/users/trainingprogram'
              }
            });
        }));
    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        createController = {
            setProfile: function() {
                return $controller('SetTrainingProgram', {
                    $scope: $rootScope
                });
            }
        }

    }));

    it('Test 1: SetTrainingProgram Be Defined', inject(function($controller) {
        controller = createController.setProfile();
        expect(controller).toBeDefined();
    }));

    it('Test 2: get /users/trainingprogramController', inject(function($controller) {
        controller = createController.setProfile();
        var data = {
          pName: 'AXE',
        };
        $httpBackend.whenGET('/users/trainingprogramController').respond(data);
        $httpBackend.flush();
        expect($rootScope.trainingprogram.pName).toBe(data.pName);
    }));
});
//---------------------------------------------------------------------



// TODO: this controller must be done more
describe("FeedbackCtrl Unit testing #9", function() {
    var controller, $controller, $scope, $rootScope, createController;
    beforeEach(angular.mock.module('myApp', function($provide){
            $provide.value('$window', {
              location:{
                pathname:'test/1'
              }
            });
        }));
    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        createController = {
            feedback: function() {
                return $controller('FeedbackCtrl', {
                    $scope: $rootScope
                });
            }
        }

    }));

    it('Test 1: FeedbackCtrl Be Defined', inject(function($controller) {
        controller = createController.feedback();
        expect(controller).toBeDefined();
    }));

    // it('Test 2: addFeedback() test', inject(function($controller) {
    //     controller = createController.feedback();
    //     var res = {
    //       msg : 'success'
    //     }
    //     var data = {
    //         comment: '',
    //         courseID: 1
    //     }
    //     $rootScope.addFeedback();
    //     $httpBackend.whenPOST('/feedback/comment', data).respond(res);
    //     $httpBackend.flush();
    //     expect($rootScope.msg).toBe(res.msg);
    // }));

    // it('Test 3: addRating() test', inject(function($controller) {
    //     controller = createController.feedback();
    //     var res = {
    //       msg : 'success'
    //     }
    //     var data = {
    //         rating: '',
    //         courseID: 1
    //     }
    //     $rootScope.addRating();
    //     $httpBackend.whenPOST('/feedback/rating', data).respond(res);
    //     $httpBackend.flush();
    //     expect($rootScope.msg).toBe(res.msg);
    // }));

});

describe("CalendarCtrl Unit testing #7", function() {
    var controller, $controller, $scope, $rootScope, createController;
    beforeEach(angular.mock.module("myApp"));
    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        createController = {
            calendarCtrl: function() {
                return $controller('CalendarCtrl', {
                    $scope: $rootScope
                });
            }
        }

    }));

    it('Test 1: CalendarCtrl Be Defined', inject(function($controller) {
        controller = createController.calendarCtrl();
        expect(controller).toBeDefined();
    }));

    it('Test 2: setDirection(): direction !== vertical,  dayFormat === d ', inject(function($controller) {
        controller = createController.calendarCtrl();
        var direction = 'test';
        $rootScope.setDirection(direction)
        expect($rootScope.direction).toBe(direction);
        expect($rootScope.dayFormat).toBe('d');
    }));

    it('Test 3: setDirection(): direction === vertical,  dayFormat === EEEE, MMMM d ', inject(function($controller) {
        controller = createController.calendarCtrl();
        var direction = 'vertical';
        $rootScope.setDirection(direction)
        expect($rootScope.direction).toBe(direction);
        expect($rootScope.dayFormat).toBe('EEEE, MMMM d');
    }));

    it('Test 4: setDirection(): direction === null,  dayFormat !== EEEE, MMMM d ', inject(function($controller) {
        controller = createController.calendarCtrl();
        var direction = null;
        $rootScope.setDirection(direction)
        expect($rootScope.direction).toBe(direction);
        expect($rootScope.dayFormat).not.toBe('EEEE, MMMM d');
    }));
//----------------------------------------------------------------------------------------------------

    it('Test 5: prevMonth()', inject(function($controller) {
        controller = createController.calendarCtrl();
        var data = {
          month: 1,
          year: 2016
        };
        $rootScope.prevMonth(data)
        expect($rootScope.msg).toBe('You clicked (prev) month ' + data.month + ', ' + data.year);
    }));
    //----------------------------------------------------------------------------
    it('Test 6: nextMonth()', inject(function($controller) {
        controller = createController.calendarCtrl();
        var data = {
          month: 1,
          year: 2016
        };
        $rootScope.nextMonth(data)
        expect($rootScope.msg).toBe('You clicked (next) month ' + data.month + ', ' + data.year);
    }));

    it('Test 6: nextMonth()', inject(function($controller) {
        controller = createController.calendarCtrl();
        var data = {
          month: 1,
          year: 2016
        };
        $httpBackend.whenGET('/getEvents').respond(data);
        $httpBackend.flush();
        expect($rootScope.msg).toBe('test');
    }));

});
