var ioann = angular.module('ioann',['ngRoute','angular-toArrayFilter','ngAnimate']);

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

ioann.controller('landCtrl',['$scope','$timeout', function ($scope,$timeout) {
	$scope.videoplayng=false;
	var promise = null;
	if(videojs.getPlayers()['div_video']) {
		videojs('div_video').dispose();
	}
	videojs("div_video",{
    	bigPlayButton: false
	}).ready(function(){
		$scope.video = this;
		$scope.hideVideo = function(){
			$scope.videoplayng=false;
			$scope.video.posterImage.show();
			$scope.video.userActive(false);
			promise = null;
		}
		$scope.showVideo = function(){
			$scope.videoplayng=true;
		  	$scope.video.userActive(true);
		}
			$scope.video.on('ended', function() {
			    $timeout($scope.hideVideo);
				$scope.video.currentTime(0);
			});
			$scope.video.on('pause', function() {
			    promise = $timeout($scope.hideVideo,200);
			});
			$scope.video.on('play', function() {
				if(promise != null)
					$timeout.cancel(promise);
				else
			    	$timeout($scope.showVideo);
			});
			$scope.closeVideo = function(){
				$scope.video.pause();
			}
		  	$scope.playVideo = function(){
				$scope.video.play();
			}
	});
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
ioann.controller('celebrationsCtrl',['$scope', '$http','$compile','$timeout', function ($scope, $http,$compile,$timeout) {
	$scope.showpers = false;
	$scope.showchrons = false;
	$scope.showpoints = false;
	$scope.mousedown = false;
	$scope.showvideo = false;
	$scope.personalys=[];
	$scope.chronics=[];


	if(videojs.getPlayers()['div_video']) {
		videojs('div_video').dispose();
	}
	videojs("div_video",{
    	bigPlayButton: false
	}).ready(function(){
		$scope.video = this;
	});



	$scope.map = L.map('mapid',{zoomControl:false,attributionControl:false}).setView([61.66235,40.2058416666667], 6);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'lenseg.00o6mm4a',
	    accessToken: 'pk.eyJ1IjoibGVuc2VnIiwiYSI6ImNpbm8yeTlqazB6bm91Nmx5OHhycnNwN3AifQ.2_7w87K3h6dfp_ohKsS1Gg'
	}).addTo($scope.map);


	var pointIcon = L.divIcon({
	    className : "map-celebration-point",
	    popupAnchor : L.point(125, -50)
	});
	var pointIconBig = L.divIcon({
	    className : "map-celebration-point-big",
	    popupAnchor : L.point(125, -50)
	});

	var pointToLayer = function(feature, latlon) {
		var marker;
		var template = "<div class='popup'><a href='' class='popup_media'>Фото <div class='popupposter' style='background-image:url("+feature.properties.photobg+")'></div></a><a href='' class='popup_media' ng-click='playVideo("+JSON.stringify(feature.properties.video)+")'>Видео<div class='popupposter' style='background-image:url("+feature.properties.videobg+")'></div></a><p class='popup_discription'>"+feature.properties.Description+"</p></div>";
        var linkFn = $compile(template);
        var content = linkFn($scope);
		var popup = L.popup({closeButton:false}).setContent(content[0]);
		if(feature.properties.bigicon)
			marker = L.marker(latlon,{icon:pointIconBig});
		else
			marker = L.marker(latlon,{icon:pointIcon});
		marker.bindPopup(popup);
		return marker;
    }

    geoJsonObj = [
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Кронштадт", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 29.777497222222198, 59.992766666666697, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "bigicon" : true, "Name": "Санкт-Петербург", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 30.3353111111111, 59.931363888888903, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Коноша", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 40.253905555555598, 60.9735333333333, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Няндома", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 40.2058416666667, 61.66235, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Плесецк", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 40.295791666666702, 62.707947222222202, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "bigicon" : true, "Name": "Обозерская", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 40.311391666666701, 63.448888888888902, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Архангельск", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 40.574722222222199, 64.550833333333301, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Карпогоры", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 44.404163888888903, 64.041669444444395, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Сура", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 45.6324, 63.575536111111099, 0.0 ] } }
	]
	var jsonLayer = L.geoJson(geoJsonObj,{pointToLayer:pointToLayer}).addTo($scope.map);
	  var polyline = L.polyline([],{color:"#f7f7f7",weight:2,opacity:1}).addTo($scope.map);
	  jsonLayer.eachLayer(function(l) {
	    polyline.addLatLng(l.getLatLng());
	});
	  var poptimeout = null
	  $scope.map.on('popupclose',function(){
	  	poptimeout = $timeout(function(){$scope.map.setView([61.66235,40.2058416666667], 6,{animate:false})},100)
	  });
	  $scope.map.on('popupopen', function(e){
	  		$timeout.cancel(poptimeout);
		    $scope.map.setView(e.popup._latlng, 9,{animate:false});
		});
	$scope.showPhotos = function(){

	}
	$scope.playVideo = function(videoObj){
		$scope.video.src(videoObj);
		$scope.showvideo = true;
		$scope.video.play()
	}
	$scope.closeVideo = function(){
		$scope.showvideo = false;
		$scope.video.pause();
	}
	$scope.showhroniks = function(){
		if($scope.chronics.length === 0)
			$http.get('/data/chronics.json').then(
				function(res){
					$scope.chronics = res.data;
					$scope.chronics[Object.keys($scope.chronics)[0]].visible=true;
					$scope.chronicsscren = $scope.chronics[Object.keys($scope.chronics)[0]].screenshot;
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
	$scope.chronickMousover = function(chronic){
		if($scope.mousedown)
			$scope.selectChronic(chronic);
	}
	$scope.chronickMousedown = function(){
		$scope.mousedown = true;
	}
	document.documentElement.addEventListener('mouseup', function(e){
	   $scope.mousedown = false;
	}); 
}]);