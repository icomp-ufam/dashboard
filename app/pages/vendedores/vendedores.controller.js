/**
 * Created by marcos on 29/11/16.
 */

angular.module("teewa").controller("vendedoresCtrl", function ($scope, $http) {

    $scope.app = "Vendedores";
    //$scope.vendedores = [];

    var carregarVendedores = function () {
         $http.get("http://localhost:3412/vendedores").success(function (data) {
            $scope.vendedores = data;
        }).error(function (data, status) {
            $scope.message = "Aconteceu um problema: " + data;
        });
       
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