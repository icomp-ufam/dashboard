/**
 * Created by marcos on 01/12/16.
 */
angular.module("teewa").controller("form_adminCtrl", function ($scope, $http) {
    if(sessionStorage.getItem('loginadmin') === '')
        $state.go('main.login.indexadmin');
});
