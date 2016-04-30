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

ioann.controller('landCtrl',['$scope', function ($scope) {
	$scope.playVideo = function(){

	}	
}]);
ioann.controller('familyCtrl',['$scope', '$http', function ($scope, $http) {
	$scope.showpers = false;
	$scope.personalys=[];
	$scope.points = [];
	$scope.showpeople = function(){
		if($scope.personalys.length === 0)
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
	$scope.getPoints = function(){
		$http.get('/data/pointsmap.json').then(
			function(res){
				$scope.points = res.data;
				$scope.showpoints = !$scope.showpoints;
			}
		)
	}
	$scope.getPoints();
}]);
ioann.controller('celebrationsCtrl',['$scope', '$http', function ($scope, $http) {
	$scope.showpers = false;
	$scope.showchrons = false;
	$scope.showpoints = false;
	$scope.personalys=[];
	$scope.chronics=[];
	$scope.showPhotos = function(){

	}
	$scope.showVideo = function(){

	}
	$scope.showpeople = function(){
		if($scope.personalys.length === 0)
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
	$scope.showhroniks = function(){
		if($scope.chronics.length === 0)
			$http.get('/data/chronics.json').then(
				function(res){
					$scope.chronics = res.data;
					$scope.chronics[Object.keys($scope.chronics)[0]].visible=true;
					$scope.chronicsvideo = $scope.chronics[Object.keys($scope.chronics)[0]].video;
					$scope.showchrons = !$scope.showchrons;
				}
			)
		else
			$scope.showchrons = !$scope.showchrons;
	}
	$scope.selectChronic = function (chronic) {
		angular.forEach($scope.chronics,function(value){
			value.visible = false;
		});
		chronic.visible = true;
	};
	$scope.getPoints = function(){
		$http.get('/data/points.json').then(
			function(res){
				$scope.points = res.data;
				$scope.showpoints = !$scope.showpoints;
			}
		)
	};
	$scope.showPoint = function(point){
		angular.forEach($scope.points,function(value){
			value.visible = false;
		});
		point.visible = true;
	};
	$scope.getPoints();

}]);