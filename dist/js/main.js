var ioann=angular.module("ioann",["ngRoute","angular-toArrayFilter"]);ioann.config(["$routeProvider",function(o){o.when("/",{templateUrl:"partials/land.html",controller:"landCtrl"}).when("/family",{templateUrl:"partials/family.html",controller:"familyCtrl"}).when("/celebrations",{templateUrl:"partials/celebrations.html",controller:"celebrationsCtrl"}).otherwise({redirectTo:"/"})}]),ioann.controller("landCtrl",["$scope",function(o){o.playVideo=function(){}}]),ioann.controller("familyCtrl",["$scope","$http",function(o,n){o.showpers=!1,o.personalys=[],o.points=[],o.showpeople=function(){0===o.personalys.length?n.get("/data/personalys.json").then(function(n){o.personalys=n.data,o.showpers=!o.showpers}):o.showpers=!o.showpers},o.selectPersonaly=function(n){angular.forEach(o.personalys,function(o){o.visible=!1}),n.visible=!0},o.getPoints=function(){n.get("/data/pointsmap.json").then(function(n){o.points=n.data,o.showpoints=!o.showpoints})},o.getPoints()}]),ioann.controller("celebrationsCtrl",["$scope","$http",function(o,n){o.showpers=!1,o.showchrons=!1,o.showpoints=!1,o.personalys=[],o.chronics=[],o.showPhotos=function(){},o.showVideo=function(){},o.showpeople=function(){0===o.personalys.length?n.get("/data/personalys.json").then(function(n){o.personalys=n.data,o.showpers=!o.showpers}):o.showpers=!o.showpers},o.selectPersonaly=function(n){angular.forEach(o.personalys,function(o){o.visible=!1}),n.visible=!0},o.showhroniks=function(){0===o.chronics.length?n.get("/data/chronics.json").then(function(n){o.chronics=n.data,o.chronics[Object.keys(o.chronics)[0]].visible=!0,o.chronicsvideo=o.chronics[Object.keys(o.chronics)[0]].video,o.showchrons=!o.showchrons}):o.showchrons=!o.showchrons},o.selectChronic=function(n){angular.forEach(o.chronics,function(o){o.visible=!1}),n.visible=!0},o.getPoints=function(){n.get("/data/points.json").then(function(n){o.points=n.data,o.showpoints=!o.showpoints})},o.showPoint=function(n){angular.forEach(o.points,function(o){o.visible=!1}),n.visible=!0},o.getPoints()}]);