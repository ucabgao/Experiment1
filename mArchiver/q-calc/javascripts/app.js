

'use strict';

angular.module('qCalcApp', [
    'ngRoute',
    'ngResource'
]).

config(function(
    $routeProvider
){
    $routeProvider.

    when('/', {
        templateUrl: 'views/main.html',
        controller: 'ListCtrl'
    }).

    otherwise({
        redirectTo: '/'
    });
});


