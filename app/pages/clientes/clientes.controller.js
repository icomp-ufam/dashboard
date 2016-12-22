/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("clientesCtrl", function ($scope, $http, config) {

    $scope.app = "Clientes";
    $scope.clientes = [];


    var carregarClientes = function () {
        $http({

            url : config.baseUrl + "/users",
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

            url : config.baseUrl + "/dash/users/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : '13/12/2016',
                'date_end' : '20/12/2016'
            }
        }).success(function(data){
            $scope.clientes = data;
            console.log(data);
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