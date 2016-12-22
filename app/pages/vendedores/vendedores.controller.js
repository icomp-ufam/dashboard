/**
 * Created by marcos on 29/11/16.
 */

angular.module("teewa").controller("vendedoresCtrl", function ($scope, $http, config) {

    $scope.app = "Vendedores";
    $scope.vendedores = [];

    var carregarVendedores = function () {
        $http({

            url : config.baseUrl + "/sellers",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            }
            }).success(function(data){
                    $scope.vendedores = data;
            }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + data;
                    console.log("login error");
        });
        /*$http.get("http://localhost:3412/vendedores").success(function (data) {
            $scope.vendedores = data;
        }).error(function (data, status) {
            $scope.message = "Aconteceu um problema: " + data;
        });*/
    };

    /*$scope.adicionarVendedor = function (vendedor) {
        vendedor.data = new Date();
        $http.post("http://localhost:3412/vendedores", vendedor).success(function (data) {
            delete $scope.vendedor;
            $scope.vendedorForm.$setPristine();
            carregarvendedores();
        });
    };*/
    $scope.apagarVendedores = function (vendedores) {
        $scope.vendedores = vendedores.filter(function (vendedor) {
            if (!vendedor.selecionado) return vendedor;
        });
    };
    $scope.isVendedoreSelecionado = function (vendedores) {
        return vendedores.some(function (vendedor) {
            return vendedor.selecionado;
        });
    };
    $scope.ordenarPor = function (campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };

    carregarVendedores();
});