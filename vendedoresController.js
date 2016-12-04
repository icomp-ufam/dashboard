/**
 * Created by marcos on 29/11/16.
 */
angular.module("vendedores", ["ngMessages"]);
angular.module("vendedores").controller("vendedoresCtrl", function ($scope, $http) {

    $scope.app = "Vendedores";
    $scope.vendedores = [];



    var carregarVendedores = function () {
        //$http.defaults.headers.get.Authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOkn";
        $http.get('http://54.233.67.111:8081/sellers', {
            headers: {
                'Authorization' : 'Token token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOkn"'
            }
        }).success(function(response){
            console.log(response)
        }).error(function (data, status) {
            $scope.message = "Aconteceu um problema: " + data;
        });
    };

    $scope.adicionarVendedor = function (vendedor) {
        vendedor.data = new Date();
        $http.post("http://localhost:3412/vendedores", vendedor).success(function (data) {
            delete $scope.vendedor;
            $scope.vendedorForm.$setPristine();
            carregarvendedores();
        });
    };
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