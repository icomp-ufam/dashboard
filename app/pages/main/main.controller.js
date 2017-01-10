/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("mainCtrl", function ($scope, $state, config) {
	$scope.state = $state;
	$scope.vendedor = false;

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