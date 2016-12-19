/**
 * Created by Larissa Fabíola on 30/11/16.
 */
var rating;
angular.module("teewa").controller("estabelecimentosCtrl", function ($scope, $http) {

    $scope.app = "Estabelecimentos";
    $scope.estabelecimentos = [];
    $scope.storeID = 0;
    $scope.i = 0;
    $scope.rating = [];

    var carregarEstabelecimentos = function(){
            $http({

            url : "http://54.233.67.111:8081/stores",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            }
            }).success(function(data){
                    $scope.estabelecimentos = data;
                    //$scope.estabelecimentos.stores[0].avg_rating = 4.3;
                    //console.log($scope.estabelecimentos.stores[0]);
                    $scope.i = 0;
                    while ($scope.i < $scope.estabelecimentos.stores.length){

                        $scope.storeID = $scope.estabelecimentos.stores[$scope.i].id;
                        //console.log($scope.storeID);

                        (function (index) {
                            $http({
                                url : "http://54.233.67.111:8081/stores/"+$scope.storeID+"/avg",
                                method : 'GET',
                                headers : {
                                    'Content-Type' : 'application/json',
                                    'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
                                }

                            }).success(function(data){
                                $scope.rating = data;
                                if ($scope.rating.message == "No Ratings"){
                                    $scope.estabelecimentos.stores[index].avg_rating = 0;
                                    $scope.estabelecimentos.stores[index].sum_rating = 0;
                                } else{
                                    $scope.estabelecimentos.stores[index].avg_rating = $scope.rating.rating.avg_rating;
                                    $scope.estabelecimentos.stores[index].sum_rating = $scope.rating.rating.sum_rating;
                                }

                            }).error(function(error){
                                $scope.message = "Aconteceu um problema: " + data;
                            });
                        })($scope.i);

                        console.log($scope.estabelecimentos.stores[$scope.i]);
                        $scope.i+=1;
                    }

            }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + data;
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