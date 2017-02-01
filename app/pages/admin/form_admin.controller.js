/**
 * Created by marcos on 01/12/16.
 */
angular.module("teewa").controller("form_adminCtrl", function ($scope, $http, config) {
	$scope.admins = [];

    var carregarAdministradores = function () {
        $http({
            url : config.baseUrl + "/dash/admins",
            method : 'GET',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            }
            /*data: {
                'name' : admin.nome,
                'email' : admin.email,
                'password' : admin.senha,
                'photo' : admin.foto,
            }*/
        }).success(function(data){
            $scope.admins = data;
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
	});

	$scope.adicionarAdministrador = function (email, name, senha, foto) {
		$http({
            url : config.baseUrl + "/dash/register/admin",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            }
            data: {
                'name' : name,
                'email' : email,
                'password' : senha,
                'photo' : foto,
            }
        }).success(function(data){
            carregarAdministradores();
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
		
	};
    $scope.limparFormulario = function (admin) {
        delete $scope.admin;
    }
	$scope.apagarAdministrador = function (admins) {
		$scope.admins = admins.filter(function (admin) {
			if (!admin.selecionado) {return admin;}
		});
	};
    $scope.isAdminSelecionado = function (admins) {
        return admins.some(function (admin) {
            return admin.selecionado;
        });
    };
    $scope.editAdministrador =  function (admin){
        alert(admin.nome);
        $scope.admins = admin;
        console.log($scope.admins);
         alert($scope.package.admin);
    };


    if(localStorage.getItem('loginadmin') === '')
        $state.go('main.login.indexadmin');
    }

	carregarAdministradores();
});

