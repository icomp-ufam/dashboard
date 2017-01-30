/**
 * Created by marcos on 01/12/16.
 */
angular.module("teewa").controller("form_adminCtrl", function ($scope, $http) {
	$scope.admins = [
			{nome: "Pedro", telefone: "9999-8888"},
			{nome: "Ana", telefone: "9999-8877"},
			{nome: "Maria", telefone: "9999-8866"}
	];
	$scope.adicionarAdministrador = function (admin) {
		$scope.admins.push(angular.copy(admin));
		console.log($scope.admin);
		delete $scope.admin;
	};
	$scope.apagarAdministradores = function (admins) {
		$scope.admins = admins.filter(function (admin) {
			if (!admin.selecionado) {return admin;}
		});
	}
});