/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("atendimentosCtrl", function ($scope, $http) {

    $scope.app = "Atendimentos";
    $scope.atendimentos = [];

    var carregarAtendimentos = function () {
        $http({

            url : "http://54.233.67.111:8081/users/cases/5/chats",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            }
            }).success(function(data){
                    $scope.atendimentos = data;
                    console.log("deu Serto");
            }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + data;
                    console.log("login error");
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