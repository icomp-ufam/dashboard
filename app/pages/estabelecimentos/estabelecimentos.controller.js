/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("estabelecimentosCtrl", function ($scope, $http) {

    $scope.app = "Estabelecimentos";
    $scope.estabelecimentos = [];

    var carregarEstabelecimentos = function () {
        $http({

            url : "http://54.233.67.111:8081/stores",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            }
            }).success(function(data){
                    $scope.estabelecimentos = data;
            }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + data;
                    console.log("login error");
        });
    };

    /*$scope.adicionarEstabelecimento = function (estabelecimento) {
        estabelecimento.data = new Date();
        $http.post("http://localhost:3412/estabelecimentos", estabelecimento).success(function (data) {
            delete $scope.estabelecimento;
            $scope.estabelecimentoForm.$setPristine();
            carregarestabelecimentos();
        });
    };*/
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