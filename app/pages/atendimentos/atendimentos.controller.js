/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("atendimentosCtrl", function ($scope, $http) {

    $scope.app = "Atendimentos";
     //$scope.estabelecimentos = [];
    //$scope.cases = [];
    $scope.atendimentos = [];
    //$scope.Natendimentos = [];

    
    var carregarAtendimentos = function () {
        $http({

            url : "http://54.233.67.111:8081/analytics/cases/situation",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            }
            }).success(function(data){
                    $scope.atendimentos = data;
            }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + data;
                    console.log("login error");
        });
    };
    
    $scope.ordenarPor = function (campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };

    /*$scope.adicionarEstabelecimento = function (estabelecimento) {
        estabelecimento.data = new Date();
        $http.post("http://localhost:3412/estabelecimentos", estabelecimento).success(function (data) {
            delete $scope.estabelecimento;
            $scope.estabelecimentoForm.$setPristine();
            carregarestabelecimentos();
        });
    };*/
    //carregarCases();
    carregarAtendimentos();
    //carregarNatendimentos();

});