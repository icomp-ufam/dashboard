/**
 * Created by Larissa Fabíola on 30/11/16.
 */
var rating;
angular.module("teewa").controller("estabelecimentosCtrl", function ($scope, $http, config) {

    $scope.app = "Estabelecimentos";
    $scope.estabelecimentos = [];
    $scope.storeID = 0;
    $scope.i = 0;
    $scope.rating = [];

    /*var carregarEstabelecimentos = function(){
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
    };*/


    $scope.carregarPorData = function (date_start, date_end) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        console.log(NovaDate_start);
        console.log(NovaDate_end);

        $http({
            url : config.baseUrl + "/dash/store",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
            }
        }).success(function(data){
            $scope.estabelecimentos = data;
            $scope.data_start = {
                        value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

                };
                $scope.data_end = {
                    value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

                };
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
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


    // var curr = new Date; // get current date
    // var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    // var last = first + 6; // last day is the first day + 6

    // var lastday = new Date(curr.setDate(last)).toLocaleDateString();

    var d = {
        value: new Date(),
    }
     var novaData = {
        value: new Date(2014, 12, 01),
    }


    $scope.carregarPorData(novaData, d);
});