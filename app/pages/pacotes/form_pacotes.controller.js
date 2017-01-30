/**
 * Created by Larissa Fabíola on 10/11/16.
 */
angular.module("teewa").controller("formPacotesCtrl", function ($scope, $state) {
	$scope.state = $state;
	if(localStorage.getItem('loginadmin') === '')
		$state.go('main.login.indexadmin');
});