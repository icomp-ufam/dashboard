/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("clientesCtrl", function ($scope, $http) {

    $scope.app = "Clientes";
    $scope.clientes = [];


    var carregarClientes = function () {
        $http({

            url : "http://54.233.67.111:8081/users",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
        }).success(function(data){
            $scope.clientes = data;
            console.log("deu Serto");
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
            console.log("login error");
        });
    };

    var carregarClientesPorData = function () {
        $http({

            url : "http://api.teewa.com.br:8081/dash/users/",
            method : 'post',
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            body: {
                'date_start' : '13/12/2016',
                'date_end' : '20/12/2016'
            },
        }).success(function(data){
            $scope.clientes = data;
            console.log("deu Serto mesmo?");
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });



    };

    $scope.apagarClientes = function (clientes) {
        $scope.clientes = clientes.filter(function (cliente) {
            if (!cliente.selecionado) return cliente;
        });
    };
    $scope.isClienteselecionado = function (clientes) {
        return clientes.some(function (cliente) {
            return cliente.selecionado;
        });
    };
    $scope.ordenarPor = function (campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };

    //carregarClientes();
    carregarClientesPorData();
});