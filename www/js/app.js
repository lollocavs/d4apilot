// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'


var myApp = angular.module('d4_pilot', ['ionic']);

myApp.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(5);

//  // note that you can also chain configs
//  $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
	views.transition('android');
});

myApp.controller('d4a_pilot', function($scope) {
  ionic.Platform.ready(function() {
    // hide the status bar using the StatusBar plugin
    //StatusBar.hide();
  });
})

//myApp.run(function($ionicPlatform) {
//  $ionicPlatform.ready(function() {
//
//    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//    // for form inputs)
//
////    if(window.cordova && window.cordova.plugins.Keyboard) {
////      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
////    }
//    if(window.StatusBar) {
//      StatusBar.styleDefault();
//    }
//  });
//})


myApp.run(function($cordovaSplashscreen) {
  setTimeout(function() {
    $cordovaSplashscreen.hide()
  }, 5000)
})