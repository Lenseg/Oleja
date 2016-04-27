var ioann = angular.module('ioann',['ngRoute','angular-toArrayFilter']);

ioann.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
   	  when('/', {
        templateUrl: 'partials/land.html',
        controller: 'landCtrl'
      }).
      when('/family', {
        templateUrl: 'partials/family.html',
        controller: 'familyCtrl'
      }).
      when('/celebrations', {
        templateUrl: 'partials/celebrations.html',
        controller: 'celebrationsCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

ioann.controller('landCtrl',function ($scope) {
	
});
ioann.controller('familyCtrl',function ($scope) {
	
});
ioann.controller('celebrationsCtrl',['$scope', '$http', function ($scope, $http) {
	$scope.showpers = false;
	$scope.personalys=[];
	$scope.showpeople = function(){
		if(!$scope.personalys.lenght)
			$http.get('/data/personalys.json').then(
				function(res){
					$scope.personalys = res.data;
					$scope.showpers = !$scope.showpers;
				}
			)
		else
			$scope.showpers = !$scope.showpers;
	};
	$scope.selectPersonaly = function (mainpersonaly) {
		angular.forEach($scope.personalys,function(value){
			value.visible = false;
		});
		mainpersonaly.visible = true;
	}
}]);