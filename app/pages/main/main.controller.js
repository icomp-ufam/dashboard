/**
 * Created by Marcos Soares on 10/01/17.
 */
angular.module("teewa").controller("mainCtrl", function ($scope, $state, config) {
	$scope.state = $state;
	$scope.vendedor = false;
    //stub de login
	$scope.login = function () {
		$scope.vendedor = true;
    }
    $scope.logout = function () {
        $scope.vendedor = false;
    }
    $scope.verifica = function () {
		return $scope.vendedor;
    }
});