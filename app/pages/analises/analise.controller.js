/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("analiseCtrl", function ($scope, $http, config, $stateParams, $state) {

   //$scope.state = $state;
    $scope.app = "AnaliseCasos";
    //$scope.estabelecimentos = [];
    $scope.cases = [];
    $scope.atendimentos = [];
    $scope.Natendimentos = [];
    $scope.data_startParam = {
        value: new Date($stateParams.data_startParametro)
    }
    $scope.data_endParam = {
        value: new Date($stateParams.data_endParametro)
    }
    // console.log(" $stateParams1 = " + $scope.data_startParam.value.getDate() );
    // console.log(" $stateParams2 = " + $scope.data_endParam.value );

    

    $scope.carregarCases = function (date_start, date_end) {
        //console.log(" data_startParamDentroo:" + date_start.value);

        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        console.log(NovaDate_start);
        console.log(NovaDate_end);
        $http({

            url : config.baseUrl + "/analytics/cases",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            }
            }).success(function(data){
                    $scope.cases = data;
					
                    $scope.data_start = {
                        value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

                };
                $scope.data_end = {
                    value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

                };
            }).error(function(error, data){
                    $scope.message = "Aconteceu um problema: " + data;
                    console.log("login error");
        });
    };

    $scope.orderByFunction = function(friend){
        return parseInt(friend.caso);

    };

  $scope.carregarAtendimentos = function () {
        $http({

            url : config.baseUrl + "/analytics/cases/situation",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            }
            }).success(function(data){
                    $scope.atendimentos = data;
            }).error(function(error,data){
                    $scope.message = "Aconteceu um problema: " + data;
                    console.log("login error");
        });
    };
  $scope.carregarNatendimentos = function () {
        $http({
            url : config.baseUrl + "/analytics/cases/unattended",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            }).success(function(data){
                    $scope.Natendimentos = data;
            }).error(function(error,data){
                    $scope.message = "Aconteceu um problema: " + data;
                    console.log("login error");
        });
    };

    $scope.carregarEstabelecimentos = function () {
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

        }).error(function(error,data){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.carregarPorData = function (date_start, date_end) {
        $http({
            url : config.baseUrl + "/dash/store",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : date_start,
                'date_end' : date_end
            }
        }).success(function(data){
            $scope.estabelecimentos = data;
            carregarGraficoRating($scope.estabelecimentos);
            $scope.periodoatual = date_start +" a " +date_end;
            $scope.periodo1 = date_start;
            $scope.periodo2 = date_end;
        }).error(function(error,data){
            $scope.message = "Aconteceu um problema: " + error;
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

    function carregarGraficoRating(dado){
        var media = [];
        var loja = [];
        //dados para o grafico
        for(dt in dado) {
            media[dt] = parseInt(dado[dt].media);
            loja[dt] = dado[dt].name.toString();
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'loja');
            data.addColumn('number', 'media');

            //Povondo o grafico
            for(i = 0; i < media.length; i++){
                data.addRow([loja[i], media[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'lojas'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoRatingGeral'));
            chart.draw(data, options);
        };
    }
    var d = {
        value: new Date(),
    }
     var novaData = {
        value: new Date(d.value.getTime() - 10080*60000),
    }

    $scope.carregarCases($scope.data_startParam, $scope.data_endParam);
    //$scope.carregarCases(novaData, d);
    $scope.carregarAtendimentos();
    $scope.carregarNatendimentos();
    $scope.carregarEstabelecimentos();

    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6


    var lastday = new Date(curr.setDate(last)).toLocaleDateString();

    $scope.carregarPorData('01/01/2015', lastday);

});