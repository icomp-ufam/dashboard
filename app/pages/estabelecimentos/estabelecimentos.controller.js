/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("estabelecimentosCtrl", function ($scope, $http) {

    $scope.app = "Estabelecimentos";
    $scope.estabelecimentos = [
                {nome: "Vendedor1", telefone: "123", nVendedores: "50"},
                {nome: "Vendedor2", telefone: "456", nVendedores: "20"},
                {nome: "Vendedor3", telefone: "789", nVendedores: "34"}
    ];

    var carregarEstabelecimentos = function () {
        $http.get("http://localhost:3412/estabelecimentos").success(function (data) {
            $scope.estabelecimentos = data;
        }).error(function (data, status) {
            $scope.message = "Aconteceu um problema: " + data;
        });
    };

    $scope.adicionarEstabelecimento = function (estabelecimento) {
        estabelecimento.data = new Date();
        $http.post("http://localhost:3412/estabelecimentos", estabelecimento).success(function (data) {
            delete $scope.estabelecimento;
            $scope.estabelecimentoForm.$setPristine();
            carregarestabelecimentos();
        });
    };
    $scope.apagarestabelecimentos = function (estabelecimentos) {
        $scope.estabelecimentos = estabelecimentos.filter(function (estabelecimento) {
            if (!estabelecimento.selecionado) return estabelecimento;
        });
    };
    $scope.isEstabelecimentoselecionado = function (estabelecimentos) {
        return estabelecimentos.some(function (estabelecimento) {
            return estabelecimento.selecionado;
        });
    };
    $scope.ordenarPor = function (campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };

    carregarEstabelecimentos();
});