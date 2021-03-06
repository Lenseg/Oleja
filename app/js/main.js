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
			$scope.video.on('play', function() {
				if(promise != null)
					$timeout.cancel(promise);
				else
			    	$timeout($scope.showVideo);
			});
			$scope.closeVideo = function(){
				$scope.video.pause();
				$scope.hideVideo();
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



	$scope.map = L.map('mapid',{zoomControl:false,attributionControl:false,dragging:false}).setView([61.66235,40.2058416666667], 6);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	    id: 'lenseg.00o6mm4a',
	    accessToken: 'pk.eyJ1IjoibGVuc2VnIiwiYSI6ImNpbm8yeTlqazB6bm91Nmx5OHhycnNwN3AifQ.2_7w87K3h6dfp_ohKsS1Gg'
	}).addTo($scope.map);

	var pointToLayer = function(feature, latlon) {
		var marker;

		var className =  'map-celebration-point';
		var popclass = 'popup';
		var position = L.point(125, -50);
		if(feature.properties.bigicon)
			className = className+'-big';
		if(feature.properties.alwaysvisible)
			className = className+' map-celebration-point-alwaysvisible';
		if(feature.properties.leftsided){
			position = L.point(-272,80);
			popclass = popclass + ' ' + popclass+'-leftsided';
		}
		var template = "<div class='"+popclass+"'><a href='' class='popup_media' ng-click='showSlides("+JSON.stringify(feature.properties.slides)+")'>Фото <div class='popupposter' style='background-image:url("+feature.properties.photobg+")'></div></a><a href='' class='popup_media' ng-click='playVideo("+JSON.stringify(feature.properties.video)+")'>Видео<div class='popupposter' style='background-image:url("+feature.properties.videobg+")'></div></a><p class='popup_discription'>"+feature.properties.Description+"</p></div>";
        var linkFn = $compile(template);
        var content = linkFn($scope);
		var popup = L.popup({closeButton:false,autoPan: false}).setContent(content[0]);
		
		marker = L.marker(latlon,{icon:L.divIcon({
			    className : className,
			    popupAnchor : position,
			    html:'<span class="marker-title">'+feature.properties.Name+'</span>'
			})
		});
		marker.bindPopup(popup);
		return marker;
    }

    geoJsonObj = [
		{ 
			"type": "Feature",
			"properties": {
				"photobg" : '/img/popupposters/1/photo.jpg',
				"videobg" : '/img/popupposters/1/video.jpg',
				"video" : [
					{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
					{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
				], 
				"slides": [{
					'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"
					}
					},{'photo':{
						"src":'https://pp.vk.me/c629630/v629630927/1c2e/Ci9yMB-KWR8.jpg',
						'discr':"sadadas"
					}},{'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"}
					}],
				"Name": "Кронштадт", 
				"Description": "gjgjhg" 
			}, 
			"geometry": { 
				"type": "Point",
				"coordinates": [ 29.777497222222198, 59.992766666666697, 0.0 ] 
			} 
		}
		,
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
				"slides": [{
					'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"
					}
					},{'photo':{
						"src":'https://pp.vk.me/c629630/v629630927/1c2e/Ci9yMB-KWR8.jpg',
						'discr':"sadadas"
					}},{'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"}
					}],
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "bigicon" : true, "alwaysvisible":true, "Name": "Санкт-Петербург", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 30.3353111111111, 59.931363888888903, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"leftsided" :true,
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
				"slides": [{
					'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"
					}
					},{'photo':{
						"src":'https://pp.vk.me/c629630/v629630927/1c2e/Ci9yMB-KWR8.jpg',
						'discr':"sadadas"
					}},{'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"}
					}],
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Коноша", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 40.253905555555598, 60.9735333333333, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"leftsided" :true,
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
				"slides": [{
					'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"
					}
					},{'photo':{
						"src":'https://pp.vk.me/c629630/v629630927/1c2e/Ci9yMB-KWR8.jpg',
						'discr':"sadadas"
					}},{'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"}
					}],
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Няндома", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 40.2058416666667, 61.66235, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"leftsided" :true,
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
				"slides": [{
					'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"
					}
					},{'photo':{
						"src":'https://pp.vk.me/c629630/v629630927/1c2e/Ci9yMB-KWR8.jpg',
						'discr':"sadadas"
					}},{'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"}
					}],
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Плесецк", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 40.295791666666702, 62.707947222222202, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"leftsided" :true,
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
				"slides": [{
					'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"
					}
					},{'photo':{
						"src":'https://pp.vk.me/c629630/v629630927/1c2e/Ci9yMB-KWR8.jpg',
						'discr':"sadadas"
					}},{'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"}
					}],
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "bigicon" : true, "Name": "Обозерская", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 40.311391666666701, 63.448888888888902, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"leftsided" :true,
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
				"slides": [{
					'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"
					}
					},{'photo':{
						"src":'https://pp.vk.me/c629630/v629630927/1c2e/Ci9yMB-KWR8.jpg',
						'discr':"sadadas"
					}},{'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"}
					}],
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Архангельск", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 40.574722222222199, 64.550833333333301, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
				"slides": [{
					'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"
					}
					},{'photo':{
						"src":'https://pp.vk.me/c629630/v629630927/1c2e/Ci9yMB-KWR8.jpg',
						'discr':"sadadas"
					}},{'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"}
					}],
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Карпогоры", "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 44.404163888888903, 64.041669444444395, 0.0 ] } }
		,
		{ "type": "Feature", "properties": {
			"photobg" : '/img/popupposters/1/photo.jpg',
			"videobg" : '/img/popupposters/1/video.jpg',
				"slides": [{
					'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"
					}
					},{'photo':{
						"src":'https://pp.vk.me/c629630/v629630927/1c2e/Ci9yMB-KWR8.jpg',
						'discr':"sadadas"
					}},{'photo':{
						"src":'https://pp.vk.me/c631616/v631616927/28a4e/DPVvqyZ5JVc.jpg',
						'discr':"sadadas"}
					}],
			"video" : [
			{"type":"video/mp4", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"},
			{"type":"video/ogg", "src":"http://clips.vorwaerts-gmbh.de/big_buck_bunny.ogv"}
		], "Name": "Сура" , "alwaysvisible":true, "Description": "gjgjhg" }, "geometry": { "type": "Point", "coordinates": [ 45.6324, 63.575536111111099, 0.0 ] } }
	]
	var jsonLayer = L.geoJson(geoJsonObj,{pointToLayer:pointToLayer}).addTo($scope.map);
	  var polyline = L.polyline([],{color:"#f7f7f7",weight:2,opacity:1}).addTo($scope.map);
	  jsonLayer.eachLayer(function(l) {
	    polyline.addLatLng(l.getLatLng());
	});
	  var poptimeout = null
	  $scope.map.on('popupclose',function(){
	  	poptimeout = $timeout(function(){$scope.map.setView([61.66235,40.2058416666667], 6,{animate:true,pan:{easeLinearity:1}})},100)
	  });
	  $scope.map.on('popupopen', function(e){
	  		$timeout.cancel(poptimeout);
		    $scope.map.setView(e.popup._latlng, 9,{animate:true,pan:{easeLinearity:1}});
		});
	  var map = angular.element(document.getElementById('mapid'));
	  	var mapheight = map[0].offsetHeight/2;
	  	var mapwidth =  map[0].offsetWidth/2;
	  	var tiles = angular.element(document.getElementsByClassName("leaflet-tile-pane"));
	  	var pave =angular.element(document.getElementsByClassName('leaflet-objects-pane'));
	  	var clouds =angular.element(document.getElementsByClassName('cloudscontainer'));
	  	function updateLayers(e){
	  		var x = e.originalEvent.layerX;
		  	var y = e.originalEvent.layerY;
		  	
		  	var xdiff = mapwidth - x;
		  	var ydiff = mapheight - y;
		  	var pxx = ((xdiff/mapwidth)*(mapwidth*2))/50;
		  	var pxy = ((ydiff/mapheight)*(mapheight*2))/50;
		  	window.requestAnimationFrame(function() {
	            tiles[0].style.transform = "translate3d("+pxx+"px,"+pxy+"px,0)";
		  		pave[0].style.transform = "translate3d("+pxx/1.5+"px,"+pxy/1.5+"px,0)";
		  		clouds[0].style.transform="translate3d("+pxx/1.1+"px,"+pxy/1.1+"px,0)";
	        });
	  	}
	  $scope.map.on('mousemove',updateLayers)
	$scope.slidesVisibility = false;
	$scope.showSlides = function(slides){
		$scope.slides=slides;
		$scope.slides[0].visible = true;
		$scope.slidesVisibility = true;
	}
	$scope.closeSlides = function(){
		$scope.slidesVisibility = false;
		$scope.slides=[];
	};
	$scope.moveToSlide=function(p){
		var index=0;
		var pres = parseInt(p);
		angular.forEach($scope.slides,function(value,indexinn,obj){
			if(value.visible)
			{	
				if(indexinn==obj.length-1&&pres>0)
					index=-1;
				else if(indexinn==0&&pres<0)
					index=obj.length
				else
					index=indexinn;
			}
			value.visible = false;
		});
		$scope.slides[index+pres].visible=true;
	};
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
	$scope.map.addLayer(new cloudLayer(L.latLng(61.66235,40.2058416666667)));
	document.getElementsByClassName('cloudscontainer')[0].style.transform="none";
	for (var j = 0; j < 20 + Math.round( Math.random() * 10 ); j++) {
		generateCloud();
	};
	$scope.map.on('zoomend', function () {
		if ($scope.map.getZoom() < 7) {
		    document.getElementsByClassName('cloudscontainer')[0].style.transform="none";
		    document.getElementsByClassName('cloudscontainer')[0].style.visibility="visible";
		}
		if ($scope.map.getZoom() > 7)
		{
		    document.getElementsByClassName('cloudscontainer')[0].style.visibility="hidden";
		}   
	}); 
}]);

ioann.directive('imageonload', function() {
return {
    restrict: 'A',
  
    link: function(scope, element) {
    element.on('load', function() {
         element.removeClass('spinner-hide');
         element.addClass('spinner-show');
         element.parent().find('span').remove();
     });
     scope.$watch('ngSrc', function() {
          element.addClass('spinner-hide');
          element.parent().append('<span class="spinner"></span>');
});
        }
    };
});

var cloudBases = [];
var clouds = [];
generateCloud = function (){
var map = angular.element(document.getElementById('mapid'));
var cloudLayer=document.getElementsByClassName('cloudscontainer')[0];
	var mapheight = map[0].offsetHeight;
	var mapwidth =  map[0].offsetWidth;
var div = {
	obj : document.createElement('div')
}
div.obj.className = 'cloudBase';
div.transform = {
	x:Math.round( Math.random() * mapwidth ),
	y:Math.round( Math.random() * mapheight)
}
var t = 'translateX( ' + div.transform.x + 'px ) \
    translateY( ' + div.transform.y + 'px )';
div.obj.style.transform = t;
div.obj.style.webkiTransform = t;
for( var j = 0; j < 5 + Math.round( Math.random() * 10 ); j++ ) {
var cloud ={
	obj : document.createElement( 'div' )
};
cloud.obj.className = 'cloud';
cloud.transform = {
	x :Math.round( Math.random() * 40 ),
	y:Math.round( Math.random() * 40 ),
	r:Math.round( Math.random() * 360 ),
	s:1+Math.random()
}
var t = 'translateX( ' + cloud.transform.x + 'px ) translateY( ' + cloud.transform.y + 'px ) rotate( ' + cloud.transform.r + 'deg ) scale(' + cloud.transform.s + ')';
cloud.obj.style.transform = t;
cloud.obj.style.webkiTransform = t;
div.obj.appendChild( cloud.obj );
clouds.push(cloud);
}
cloudLayer.appendChild(div.obj);
cloudBases.push(div);
requestAnimationFrame(function(){return udpadeClouds(new Date())});


udpadeClouds = function(date){
	var map = angular.element(document.getElementById('mapid'));
	var newtime = new Date();
	var dt = (date - newtime)/5000;
	var hc = false;
	for (var i = cloudBases.length - 1; i >= 0; i--) {
		cloudBases[i].transform.x = cloudBases[i].transform.x + (5*Math.random()*dt);
		cloudBases[i].transform.y = cloudBases[i].transform.y + (2*Math.random()*dt);
		if(cloudBases[i].transform.x<-100){
			cloudBases[i].transform.x=mapwidth+100;
			cloudBases[i].obj.style.transition = "none";
		}
		if(cloudBases[i].transform.y<-100){
			cloudBases[i].transform.y=mapheight+100;
			cloudBases[i].obj.style.transition = "none";
		}
		if(cloudBases[i].transform.y<mapheight+30&&cloudBases[i].transform.x<mapwidth+30)
			cloudBases[i].obj.style.transition = "transform 1000ms linear";
		var t = 'translateX( ' + cloudBases[i].transform.x + 'px ) \
        translateY( ' + cloudBases[i].transform.y + 'px )';
		cloudBases[i].obj.style.transform = t;

	};
	for (var i = clouds.length - 1; i >= 0; i--) {
		clouds[i].transform.r = clouds[i].transform.r + Math.random()*5* dt;
		var t = 'translateX( ' + clouds[i].transform.x + 'px ) translateY( ' + clouds[i].transform.y + 'px ) rotate( ' + clouds[i].transform.r + 'deg ) scale(' + clouds[i].transform.s + ')';
		clouds[i].obj.style.transform = t;
	};
	return requestAnimationFrame(function(){return udpadeClouds(newtime)})
	}
}
var cloudLayer = L.Class.extend({

    initialize: function (latlng) {
        // save position of the layer or any options from the constructor
        this._latlng = latlng;
    },

    onAdd: function (map) {
        this._map = map;

        // create a DOM element and put it into one of the map panes
        this._el = L.DomUtil.create('div', 'cloudscontainer leaflet-zoom-hide');
        map.getPanes().overlayPane.appendChild(this._el);

        // add a viewreset event listener for updating layer's position, do the latter
        map.on('viewreset', this._reset, this);
        this._reset();
    },

    onRemove: function (map) {
        // remove layer's DOM elements and listeners
        map.getPanes().overlayPane.removeChild(this._el);
        map.off('viewreset', this._reset, this);
    },

    _reset: function () {
        // update layer's position
        var pos = this._map.latLngToLayerPoint(this._latlng);
        L.DomUtil.setPosition(this._el, pos);
    }
});