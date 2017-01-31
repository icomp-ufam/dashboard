/**
 * Created by marcos on 01/12/16.
 */
angular.module("teewa").controller("form_adminCtrl", function ($scope, $http) {
    /*
    if(localStorage.getItem('loginadmin') === ''){
        $state.go('main.login.indexadmin');
    }
	*/
    $scope.email= "";
    $scope.nome= "";
    $scope.senha= "";
    $scope.confSenha= "";

    $scope.limpar= function(){
    	$scope.email= "";
    	$scope.nome= "";
    	$scope.senha= "";
    	$scope.confSenha= "";
    };

    $scope.editemail= "db@icomp.ufam.edu.br";
    $scope.editnome= "Duivilly Brito";
    $scope.editsenha= "";
    $scope.editconfSenha= "";

    $scope.editlimpar= function(){
        $scope.editnome= "";
        $scope.editsenha= "";
        $scope.editconfSenha= "";
    };

    $scope.btneditnome= "true";

    $scope.btneditnomeFunc= function(){
        $scope.btneditnome= "false";
    };
});
