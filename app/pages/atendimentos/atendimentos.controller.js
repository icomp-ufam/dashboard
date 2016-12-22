/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("atendimentosCtrl", function ($scope, $http, config) {

    $scope.app = "Atendimentos";
     //$scope.estabelecimentos = [];
    //$scope.cases = [];
    $scope.atendimentos = [];
        $scope.atendimentosPorHoras = [];
        $scope.atendimentosPorDiaSemanas = [];
        $scope.atendimentosPorDiaMess = [];
        $scope.atendimentosPorCategorias = [];
        var data_start;
        var data_end;
    //$scope.Natendimentos = [];

    
    /*var carregarAtendimentos = function () {
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
    };*/
    $scope.carregarAtendimentos = function (date_start, date_end) {
        

        $http({

            url : config.baseUrl + "/dash/calls/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : date_start,
                'date_end' : date_end
                //'idcategory' : '5'
            }
        }).success(function(data,date){
            $scope.atendimentos = data;
            console.log(data);
            console.log(date_start);
        console.log(date_end);
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });
            

    };
    $scope.carregarAtendimentosPorHora = function (date_start, date_end) {
        console.log("cima");
        console.log(date_start);
        console.log(date_end);

        $http({

            url : config.baseUrl + "/dash/calls/hour/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                //'date_start' : date_start,
                //'date_end' : date_end,
                'date_start' : date_start,
                'date_end' : date_end,
                //'idcategory' : '5'
            }
        }).success(function(data){
            $scope.atendimentosPorHoras = data;
            console.log(data);
            console.log("por hora")
            console.log(date_start);
            console.log(date_end);
            data_start = date_start;
            data_end = date_end;
            console.log("atendimentosPorHoras: " + $scope.atendimentosPorHoras);

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });


    };
    $scope.carregarAtendimentosPorDiaSemana = function (date_start, date_end) {
        //console.log(date_start);
        //console.log(date_end);

        $http({

            url : config.baseUrl + "/dash/calls/day_week",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : date_start,
                'date_end' : date_end,
               
                //'idcategory' : '5'
            }
        }).success(function(data,date){
            $scope.atendimentosPorDiaSemanas = data;
            console.log(data);
            
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });

    };
    $scope.carregarAtendimentosPorDiaMes = function (date_start, date_end) {
        //console.log(date_start);
        //console.log(date_end);

        $http({

            url : config.baseUrl + "/dash/calls/day_month",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : date_start,
                'date_end' : date_end,
                
                //'idcategory' : '5'
            }
        }).success(function(data,date){
            $scope.atendimentosPorDiaMess = data;
            console.log(data);
            
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });

    };
    $scope.carregarAtendimentosPorCategoria = function (date_start, date_end) {
        //console.log(date_start);
        //console.log(date_end);

        $http({

            url : config.baseUrl + "/dash/calls/category",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : date_start,
                'date_end' : date_end,
                
                //'idcategory' : '5'
            }
        }).success(function(data,date){
            $scope.atendimentosPorCategorias = data;
            console.log(data);
            
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
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
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first)).toLocaleDateString();
    var lastday = new Date(curr.setDate(last)).toLocaleDateString();
    //console.log(firstday);
    //console.log(lastday);

    $scope.carregarAtendimentos(firstday, lastday);
    //carregarNatendimentos();
    $scope.carregarAtendimentosPorHora(firstday, lastday);
    $scope.carregarAtendimentosPorDiaSemana(firstday, lastday);
    $scope.carregarAtendimentosPorDiaMes(firstday, lastday);
    $scope.carregarAtendimentosPorCategoria(firstday, lastday);



});
