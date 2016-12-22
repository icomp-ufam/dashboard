/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("analiseCtrl", function ($scope, $http, config) {

   //$scope.state = $state;
    $scope.app = "AnaliseCasos";
    //$scope.estabelecimentos = [];
    $scope.cases = [];
    $scope.atendimentos = [];
    $scope.Natendimentos = [];

    var carregarCases = function () {
        $http({

            url : config.baseUrl + "/analytics/cases",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            }
            }).success(function(data){
                    $scope.cases = data;
            }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + data;
                    console.log("login error");
        });
    };
    var carregarAtendimentos = function () {
        $http({

            url : config.baseUrl + "/analytics/cases/situation",
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
    var carregarNatendimentos = function () {
        $http({
            url : config.baseUrl + "/analytics/cases/unattended",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            }).success(function(data){
                    $scope.Natendimentos = data;
            }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + data;
                    console.log("login error");
        });
    };

    var carregarEstabelecimentos = function () {
        $http({

            url : config.baseUrl + "/dash/store",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : '13/12/2015',
                'date_end' : '20/12/2016'
            }
        }).success(function(data){
            $scope.estabelecimentos = data;
            //console.log(data);

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.ordenarPor = function (campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };

    $scope.carregarGraficoRating = function(myArrRating) {
        //console.log(myArrRating);
        myArrRating.sort(function(a,b) {return a.media - b.media});
        dataJRating = [];
        for (el in myArrRating)
            dataJRating.push({media: myArrRating[el].media, qtd_av: myArrRating[el].qtd_avaliacoes});

        Morris.Bar({
            element: 'morris-bar-Rating',
            data: dataJRating,
            xkey: 'media',
            ykeys: ['qtd_av'],
            labels: ['avaliações'],
            barColors: ['#1caf9a']
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
    carregarCases();
    carregarAtendimentos();
    carregarNatendimentos();
    carregarEstabelecimentos();


});