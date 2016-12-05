/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("atendimentosCtrl", function ($scope, $http) {


    $scope.atendimentos = [
                {nome: "Vendedor1", telefone: "123", cidade: "Manaus"},
                {nome: "Vendedor2", telefone: "456", cidade: "RJ"},
                {nome: "Vendedor3", telefone: "789", cidade: "SP"}
    ];

    var carregarAtendimentos = function () {
        $http.get("http://localhost:3412/atendimentos").success(function (data) {
            $scope.atendimentos = data;
        }).error(function (data, status) {
            $scope.message = "Aconteceu um problema: " + data;
        });
    };

    $scope.adicionaratendimento = function (atendimento) {
        atendimento.data = new Date();
        $http.post("http://localhost:3412/atendimentos", atendimento).success(function (data) {
            delete $scope.atendimento;
            $scope.atendimentoForm.$setPristine();
            carregaratendimentos();
        });
    };
    $scope.apagaratendimentos = function (atendimentos) {
        $scope.atendimentos = atendimentos.filter(function (atendimento) {
            if (!atendimento.selecionado) return atendimento;
        });
    };
    $scope.isatendimentoselecionado = function (atendimentos) {
        return atendimentos.some(function (atendimento) {
            return atendimento.selecionado;
        });
    };
    $scope.ordenarPor = function (campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };

    carregarAtendimentos();
});