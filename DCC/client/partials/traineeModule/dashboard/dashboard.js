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
      getMyTraingPrograms: function() {
        return $http.get('/trainee/dashboard/getTrainingProgram').success(function(data) { return data; });
      },
	}

    return factoryDefinitions;
  }
]);

//Controllers
myApp.controller('MyCoursesCtrl', ['$scope', 'dashboardServices', function($scope, dashboardServices) {

    //Init action text of button base on status of a course
    $scope.actionOneText = {}; $scope.actionTwoText = {};
    $scope.actionOneText['Enrolled'] = 'Give feedback';
    $scope.actionTwoText['Enrolled'] = 'Re-enroll';
    $scope.actionOneText['Learned'] = 'View Schedule';
    $scope.actionTwoText['Learned'] ='Un-enroll';

    //get all courses and training programs
    dashboardServices.getMyTraingPrograms().then(function(result){
        result.data.data.forEach(traningProgram => {
            traningProgram.Courses.forEach(course => {
                course.status = course.Classes[course.Classes.length - 1].ClassRecords[course.Classes.length - 1].status;
                if (course.status == 'Enrolled') {course.backgroundColor = '#4FC3F7'}
                else if (course.status == 'Learned') {course.backgroundColor = '#8BC34A'}
                else {course.backgroundColor = 'black'}
            });
        });
		$scope.myTrainingProgramList = result.data.data;

	});
}]);
