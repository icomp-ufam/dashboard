/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("atendimentosCtrl", function ($scope, $http, config, $state, $stateParams) {

    $scope.app = "Atendimentos";
    //$scope.estabelecimentos = [];
    //$scope.cases = [];
    $scope.atendimentos = [];
    $scope.atendimentosPorHoras = [];
    $scope.atendimentosPorDates = [];
    $scope.atendimentosPorDiaSemanas = [];
    $scope.atendimentosPorDiaMess = [];
    $scope.atendimentosPorCategorias = [];
    $scope.consultasPorHora = [];
    
    $scope.data_start = [];
    $scope.data_end = [];
    //$scope.Natendimentos = [];

    $scope.data_startParam = {
        value: new Date($stateParams.data_startParametro)
    }
    $scope.data_endParam = {
        value: new Date($stateParams.data_endParametro)
    }
    console.log(" $stateParams1 = " + $scope.data_startParam.value.getDate() );
     console.log(" $stateParams2 = " + $scope.data_endParam.value );


    $scope.clickThisAtendimentosPorHora=function(date_start, date_end) {
        // console.log("teste date_start : " + date_start.value);
        // console.log("teste date_end : " + date_end );
         $state.go("main.atendimentos.listarPorHora", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.clickThisAtendimentosPorDiaSemana=function(date_start, date_end) {
        // console.log("teste date_start : " + date_start.value);
        // console.log("teste date_end : " + date_end );
         $state.go("main.atendimentos.listarPorDiaSemana", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.clickThisAtendimentosPorDiaMes=function(date_start, date_end) {
        // console.log("teste date_start : " + date_start.value);
        // console.log("teste date_end : " + date_end );
         $state.go("main.atendimentos.listarPorDiaMes", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.clickThisAtendimentosPorCategoria=function(date_start, date_end) {
        // console.log("teste date_start : " + date_start.value);
        // console.log("teste date_end : " + date_end );
         $state.go("main.atendimentos.listarPorCategoria", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.clickThisAtendimentosPorDate=function(date_start, date_end) {
        // console.log("teste date_start : " + date_start.value);
        // console.log("teste date_end : " + date_end );
         $state.go("main.atendimentos.listarPorDate", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    
    $scope.orderByF2 = function(f){
        return parseInt(f.date_trunc);
    };

    $scope.carregarAtendimentos = function (date_start, date_end) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        console.log(NovaDate_start);
        console.log(NovaDate_end);

        console.log("teste data");

        $http({

            url : config.baseUrl + "/dash/calls/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
                //'idcategory' : '5'
            }
        }).success(function(data,date){
            $scope.atendimentos = data;
            
            $scope.data_start = {
                        value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

                };
                $scope.data_end = {
                    value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

                };
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });


    };
    $scope.carregaConsultasPorHora = function(){
         
        $http({

            url : config.baseUrl + "/analytics/hourly/queries/day/avg",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
        }).success(function(data){
            $scope.consultasPorHora = data;
            console.log(data);
            graficoConsultasPorHora(data);

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });

    };
    $scope.carregaConsultasPorHoraContagem = function(){
         
        $http({

            url : config.baseUrl + "/analytics/hourly/queries/day",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
        }).success(function(data){
            $scope.consultasPorHora = data;
            graficoConsultasPorHoraContagem(data);
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });

    };
    $scope.carregarAtendimentosPorHora = function (date_start, date_end) {
         var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        console.log(NovaDate_start);
        console.log(NovaDate_end);
        
        $http({

            url : config.baseUrl + "/dash/calls/hour/",
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
            $scope.atendimentosPorHoras = data;
            var temp = [];
            var novojsong = [];
            temp = angular.fromJson(data);
            var j = 0;
            var pets = '{"pets":[' +
                '               {"name":"jack"},' +
                '               {"name":"john"},' +
                '               {"name":"joe"}]' +
                '        }';
            var arr = JSON.parse(pets);
            var novo = '{';
            for (i = 0; i<= 23; i++){
                if(i == 23){
                    if(i == temp[j]['case_hour']) {
                        novo += '"'+i+'":{"case_hour":'+i+',"ate":"'+temp[j]['ate']+'","neg":"'+temp[j]['neg']+'","nat":"'+temp[j]['nat']+'","tot":"'+temp[j]['tot']+'"}';
                        //novojsong[i] = Array(i, Array(temp[j]['ate'],temp[j]['neg'],temp[j]['nat'],temp[j]['tot']));
                        j++;
                    }else{
                        novo += '"'+i+'":{"case_hour":'+i+',"ate":"'+0+'","neg":"'+0+'","nat":"'+0+'","tot":"'+0+'"}';
                        //novojsong[i] = Array(i, Array(0, 0, 0, 0));
                        j = j;
                    }
                }else{
                    if(i == temp[j]['case_hour']) {
                        novo += '"'+i+'":{"case_hour":'+i+',"ate":"'+temp[j]['ate']+'","neg":"'+temp[j]['neg']+'","nat":"'+temp[j]['nat']+'","tot":"'+temp[j]['tot']+'"},';
                        //novojsong[i] = Array(i, Array(temp[j]['ate'],temp[j]['neg'],temp[j]['nat'],temp[j]['tot']));
                        j++;
                    }else{
                        novo += '"'+i+'":{"case_hour":'+i+',"ate":"'+0+'","neg":"'+0+'","nat":"'+0+'","tot":"'+0+'"},';
                        //novojsong[i] = Array(i, Array(0, 0, 0, 0));
                        j = j;
                    }
                }

            }
            novo += '}';
            $scope.atendimentosPorHorasCompleto = JSON.parse(novo);
            console.log($scope.atendimentosPorHorasCompleto);
            graficoAtendimentoPorHoraTOT(data);
            graficoAtendimentoPorHoraNEG(data);
            graficoAtendimentoPorHoraNAT(data);
            graficoAtendimentoPorHoraATE(data);

            $scope.data_start = {
                        value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

                };
                $scope.data_end = {
                    value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

                };
            
            

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");


        });


    };
    $scope.carregarAtendimentosPorDate = function (date_start, date_end) {
         var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        console.log(NovaDate_start);
        console.log(NovaDate_end);
        $http({

            url : config.baseUrl + "/dash/calls/date/",
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
            $scope.atendimentosPorDates = data;
            graficoAtendimentoPorDateTOT(data);
            graficoAtendimentoPorDateNEG(data);
            graficoAtendimentoPorDateNAT(data);
            graficoAtendimentoPorDateATE(data);

           $scope.data_start = {
                        value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

                };
                $scope.data_end = {
                    value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

                };

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });


    };
    $scope.carregarAtendimentosPorDiaSemana = function (date_start, date_end) {
         var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        console.log(NovaDate_start);
        console.log(NovaDate_end);
        

        $http({

            url : config.baseUrl + "/dash/calls/day_week",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
            }
        }).success(function(data,date){
            $scope.atendimentosPorDiaSemanas = data;
            graficoAtendimentoPorDiaSemanaTOT(data);
            graficoAtendimentoPorDiaSemanaNEG(data);
            graficoAtendimentoPorDiaSemanaNAT(data);
            graficoAtendimentoPorDiaSemanaATE(data);

            $scope.data_start = {
                        value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

                };
                $scope.data_end = {
                    value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

                };
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });

    };
    $scope.carregarAtendimentosPorDiaMes = function (date_start, date_end) {
         var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        console.log(NovaDate_start);
        console.log(NovaDate_end);
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
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
            }
        }).success(function(data,date){
            $scope.atendimentosPorDiaMess = data;
            // console.log(data)
            // var temp = [];
            // var novojsong = [];
            // temp = angular.fromJson(data);
            // var j = 0;
           
            // var novo = '{';
            // for (i = 1; i<= 31; i++){
            //     if(i == 31){
            //         if(i == temp[j]['day_of_month']) {
            //             novo += '"'+i+'":{"day_of_month":'+i+',"ate":"'+temp[j]['ate']+'","neg":"'+temp[j]['neg']+'","nat":"'+temp[j]['nat']+'","tot":"'+temp[j]['tot']+'"}';
            //             //novojsong[i] = Array(i, Array(temp[j]['ate'],temp[j]['neg'],temp[j]['nat'],temp[j]['tot']));
            //             j++;
            //         }else{
            //             novo += '"'+i+'":{"day_of_month":'+i+',"ate":"'+0+'","neg":"'+0+'","nat":"'+0+'","tot":"'+0+'"}';
            //             //novojsong[i] = Array(i, Array(0, 0, 0, 0));
            //             j = j;
            //         }
            //     }else{
            //         console.log(temp[i]);
            //         if(i == temp[j]['day_of_month']) {
            //             novo += '"'+i+'":{"day_of_month":'+i+',"ate":"'+temp[j]['ate']+'","neg":"'+temp[j]['neg']+'","nat":"'+temp[j]['nat']+'","tot":"'+temp[j]['tot']+'"},';
            //             //novojsong[i] = Array(i, Array(temp[j]['ate'],temp[j]['neg'],temp[j]['nat'],temp[j]['tot']));
            //             j++;
            //         }else{
            //             novo += '"'+i+'":{"day_of_month":'+i+',"ate":"'+0+'","neg":"'+0+'","nat":"'+0+'","tot":"'+0+'"},';
            //             //novojsong[i] = Array(i, Array(0, 0, 0, 0));
            //             j = j;
            //         }
            //     }

            // }
            // novo += '}';
            // $scope.atendimentosPorDiaMesCompleto = JSON.parse(novo);
            // console.log( "Dia Mes: " + $scope.atendimentosPorDiaMesCompleto);
            graficoAtendimentoPorDiaMesTOT(data);
            graficoAtendimentoPorDiaMesNEG(data);
            graficoAtendimentoPorDiaMesNAT(data);
            graficoAtendimentoPorDiaMesATE(data);

            $scope.data_start = {
                        value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

                };
                $scope.data_end = {
                    value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

                };
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });

    };
    $scope.carregarAtendimentosPorCategoria = function (date_start, date_end) {
        
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        console.log(NovaDate_start);
        console.log(NovaDate_end);

        $http({

            url : config.baseUrl + "/dash/calls/category",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
               'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
            }
        }).success(function(data,date){
            $scope.atendimentosPorCategorias = data;
            graficoAtendimentoPorCategoriaTOT(data);
            graficoAtendimentoPorCategoriaNEG(data);
            graficoAtendimentoPorCategoriaNAT(data);
            graficoAtendimentoPorCategoriaATE(data);

            $scope.data_start = {
                        value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

                };
                $scope.data_end = {
                    value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

                };
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
    /*var baseURl = "http://api.teewa.com.br:8081";

     //usuarios por caso
     var xmlhttp3 = new XMLHttpRequest();
     var url3 = baseURl + "/analytics/users/by/cases";
     var myArr3;
     xmlhttp3.open("GET", url3, true);
     xmlhttp3.send();

     xmlhttp3.onload = function () {
     if(this.readyState==4 && this.status==200) {
     myArr3 = JSON.parse(this.responseText);
     }

     dataJ3 = [];
     for (el in myArr3)
     dataJ3.push({y: myArr3[el].casos, a: myArr3[el].usuarios})
     Morris.Bar({
     element: 'morris-bar-example',
     data: dataJ3,
     xkey: 'y',
     ykeys: ['a'],
     labels: ['Casos'],
     barColors: ['#2aabd2']
     });

     };*/
    function graficoConsultasPorHoraContagem(dado){
        var hora = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            hora[dt] = parseInt(dado[dt].hora);
            qtd[dt] = parseInt(dado[dt].casos);
        }
        //ordedando por hora
        var swapped;
        do {
            swapped = false;
            for (var i = 0; i < hora.length - 1; i++) {
                if (hora[i] > hora[i + 1]) {
                    var temp = hora[i];
                    var temp2 = qtd[i];
                    hora[i] = hora[i + 1];
                    qtd[i] = qtd[i + 1];
                    hora[i + 1] = temp;
                    qtd[i + 1] = temp2;
                    swapped = true;
                }
            }
        }while (swapped);

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'Hora');
            data.addColumn('number', 'Consultas');
            //Povoando o grafico
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'Consultas por hora (Contagem)'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoConsultasPorHoraContagem'));
            chart.draw(data, options);
        };
    }

    function graficoConsultasPorHora(dado){
        var hora = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            hora[dt] = parseInt(dado[dt].hora);
            qtd[dt] = parseInt(dado[dt].media_casos);
        }
        //ordenando por hora
        var swapped;
        do {
            swapped = false;
            for (var i = 0; i < hora.length - 1; i++) {
                if (hora[i] > hora[i + 1]) {
                    var temp = hora[i];
                    var temp2 = qtd[i];
                    hora[i] = hora[i + 1];
                    qtd[i] = qtd[i + 1];
                    hora[i + 1] = temp;
                    qtd[i + 1] = temp2;
                    swapped = true;
                }
            }
        }while (swapped);

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'Hora');
            data.addColumn('number', 'Consultas');
            //Povoando o grafico
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'Média por hora do dia'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoConsultasPorHora'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorHoraTOT(dado){
        var hora = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            hora[dt] = dado[dt].case_hour.toString();
            qtd[dt] = parseInt(dado[dt].tot);
        }
        //tamanho minimo do grafico
        if(hora.length < 5)
            for (i = 0; i < 3; i++){
                hora[i + (hora.length)] = "";
                qtd[i+ (hora.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Hora');
            data.addColumn('number', 'TOTAL');
            //Povoando o grafico
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'TOTAL DE LOJAS'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorHoraTOT'));
            chart.draw(data, options);
        };
    }
    function graficoAtendimentoPorHoraATE(dado){
        var hora = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            hora[dt] = dado[dt].case_hour.toString();
            qtd[dt] = parseInt(dado[dt].ate);
        }
        //tamanho minimo do grafico
        if(hora.length < 5)
            for (i = 0; i < 3; i++){
                hora[i + (hora.length)] = "";
                qtd[i+ (hora.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Hora');
            data.addColumn('number', 'ATENDERAM');
            //Povoando o grafico
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['green'],

                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE ATENDERAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorHoraATE'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorHoraNEG(dado){
        var hora = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            hora[dt] = dado[dt].case_hour.toString();
            qtd[dt] = parseInt(dado[dt].neg);
        }
        //tamanho minimo do grafico
        if(hora.length < 5)
            for (i = 0; i < 3; i++){
                hora[i + (hora.length)] = "";
                qtd[i+ (hora.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Hora');
            data.addColumn('number', 'NEGARAM');
            //Povoando o grafico
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                colors: ['red'],

                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NEGARAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorHoraNEG'));
            chart.draw(data, options);
        };
    }
    function graficoAtendimentoPorHoraNAT(dado){
        var hora = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            hora[dt] = dado[dt].case_hour.toString();
            qtd[dt] = parseInt(dado[dt].nat);
        }
        //tamanho minimo do grafico
        if(hora.length < 5)
            for (i = 0; i < 3; i++){
                hora[i + (hora.length)] = "";
                qtd[i+ (hora.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Hora');
            data.addColumn('number', 'NÃO ATENDERAM');
            //Povoando o grafico
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['yellow'],

                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NÃO ATENDERAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorHoraNAT'));
            chart.draw(data, options);
        };
    }




    function graficoAtendimentoPorDiaSemanaTOT(dado){
        var dia = [];
        var qtd = [];

        //dados para o grafico
        for(dt in dado) {
            dia[dt] = dado[dt].day_of_week.toString();
            qtd[dt] = parseInt(dado[dt].tot);
        }
        //tamanho minimo do grafico
        if(dia.length < 5)
            for (i = 0; i < 3; i++){
                dia[i + (dia.length)] = "";
                qtd[i+ (dia.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'TOTAL');
            //Povoando o grafico
            for(i = 0; i < dia.length; i++){
                console.log("montando");
                data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'TOTAL DE LOJAS'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaSemanaTOT'));
            chart.draw(data, options);
        };
    }
    function graficoAtendimentoPorDiaSemanaATE(dado){
        var dia = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            dia[dt] = dado[dt].day_of_week.toString();
            qtd[dt] = parseInt(dado[dt].ate);
        }
        //tamanho minimo do grafico
        if(dia.length < 5)
            for (i = 0; i < 3; i++){
                dia[i + (dia.length)] = "";
                qtd[i+ (dia.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'ATENDERAM');
            //Povoando o grafico
            for(i = 0; i < dia.length; i++){
                data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['green'],

                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE ATENDERAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaSemanaATE'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDiaSemanaNEG(dado){
        var dia = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            dia[dt] = dado[dt].day_of_week.toString();
            qtd[dt] = parseInt(dado[dt].neg);
        }
        //tamanho minimo do grafico
        if(dia.length < 5)
            for (i = 0; i < 3; i++){
                dia[i + (dia.length)] = "";
                qtd[i+ (dia.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'NEGARAM');
            //Povoando o grafico
            for(i = 0; i < dia.length; i++){
                data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                colors: ['red'],

                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NEGARAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaSemanaNEG'));
            chart.draw(data, options);
        };
    }
    function graficoAtendimentoPorDiaSemanaNAT(dado){
        var dia = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            dia[dt] = dado[dt].day_of_week.toString();
            qtd[dt] = parseInt(dado[dt].nat);
        }
        //tamanho minimo do grafico
        if(dia.length < 5)
            for (i = 0; i < 3; i++){
                dia[i + (dia.length)] = "";
                qtd[i+ (dia.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'NÃO ATENDERAM');
            //Povoando o grafico
            for(i = 0; i < dia.length; i++){
                data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['yellow'],

                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NÃO ATENDERAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaSemanaNAT'));
            chart.draw(data, options);
        };
    }


    function graficoAtendimentoPorDiaMesTOT(dado){
        var dia = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            dia[dt] = dado[dt].day_of_month.toString();
            qtd[dt] = parseInt(dado[dt].tot);
        }
        //tamanho minimo do grafico
        if(dia.length < 5)
            for (i = 0; i < 3; i++){
                dia[i + (dia.length)] = "";
                qtd[i+ (dia.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'TOTAL');
            //Povoando o grafico
            for(i = 0; i < dia.length; i++){
                data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'TOTAL DE LOJAS'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaMesTOT'));
            chart.draw(data, options);
        };
    }
    function graficoAtendimentoPorDiaMesATE(dado){
        var dia = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            dia[dt] = dado[dt].day_of_month.toString();
            qtd[dt] = parseInt(dado[dt].ate);
        }
        //tamanho minimo do grafico
        if(dia.length < 5)
            for (i = 0; i < 3; i++){
                dia[i + (dia.length)] = "";
                qtd[i+ (dia.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'ATENDERAM');
            //Povoando o grafico
            for(i = 0; i < dia.length; i++){
                data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['green'],

                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE ATENDERAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaMesATE'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDiaMesNEG(dado){
        var dia = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            dia[dt] = dado[dt].day_of_month.toString();
            qtd[dt] = parseInt(dado[dt].neg);
        }
        //tamanho minimo do grafico
        if(dia.length < 5)
            for (i = 0; i < 3; i++){
                dia[i + (dia.length)] = "";
                qtd[i+ (dia.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'NEGARAM');
            //Povoando o grafico
            for(i = 0; i < dia.length; i++){
                data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                colors: ['red'],

                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NEGARAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaMesNEG'));
            chart.draw(data, options);
        };
    }
    function graficoAtendimentoPorDiaMesNAT(dado){
        var dia = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            dia[dt] = dado[dt].day_of_month.toString();
            qtd[dt] = parseInt(dado[dt].nat);
        }
        //tamanho minimo do grafico
        if(dia.length < 5)
            for (i = 0; i < 3; i++){
                dia[i + (dia.length)] = "";
                qtd[i+ (dia.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'NÃO ATENDERAM');
            //Povoando o grafico
            for(i = 0; i < dia.length; i++){
                data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['yellow'],

                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NÃO ATENDERAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaMesNAT'));
            chart.draw(data, options);
        };
    }




    function graficoAtendimentoPorCategoriaTOT(dado){
        var categoria = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            categoria[dt] = dado[dt].categoria.toString();
            qtd[dt] = parseInt(dado[dt].tot);
        }
        //tamanho minimo do grafico
        if(categoria.length < 5)
            for (i = 0; i < 3; i++){
                categoria[i + (categoria.length)] = "";
                qtd[i+ (categoria.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'categoria');
            data.addColumn('number', 'TOTAL');
            //Povoando o grafico
            for(i = 0; i < categoria.length; i++){
                data.addRow([categoria[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'TOTAL DE LOJAS'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorCategoriaTOT'));
            chart.draw(data, options);
        };
    }
    function graficoAtendimentoPorCategoriaATE(dado){
        var categoria = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            categoria[dt] = dado[dt].categoria.toString();
            qtd[dt] = parseInt(dado[dt].ate);
        }
        //tamanho minimo do grafico
        if(categoria.length < 5)
            for (i = 0; i < 3; i++){
                categoria[i + (categoria.length)] = "";
                qtd[i+ (categoria.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'categoria');
            data.addColumn('number', 'ATENDERAM');
            //Povoando o grafico
            for(i = 0; i < categoria.length; i++){
                data.addRow([categoria[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['green'],

                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE ATENDERAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorCategoriaATE'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorCategoriaNEG(dado){
        var categoria = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            categoria[dt] = dado[dt].categoria.toString();
            qtd[dt] = parseInt(dado[dt].neg);
        }
        //tamanho minimo do grafico
        if(categoria.length < 5)
            for (i = 0; i < 3; i++){
                categoria[i + (categoria.length)] = "";
                qtd[i+ (categoria.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'categoria');
            data.addColumn('number', 'NEGARAM');
            //Povoaando o grafico
            for(i = 0; i < categoria.length; i++){
                data.addRow([categoria[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                colors: ['red'],

                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NEGARAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorCategoriaNEG'));
            chart.draw(data, options);
        };
    }
    function graficoAtendimentoPorCategoriaNAT(dado){
        var categoria = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            categoria[dt] = dado[dt].categoria.toString();
            qtd[dt] = parseInt(dado[dt].nat);
        }
        //tamanho minimo do grafico
        if(categoria.length < 5)
            for (i = 0; i < 3; i++){
                categoria[i + (categoria.length)] = "";
                qtd[i+ (categoria.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'categoria');
            data.addColumn('number', 'NÃO ATENDERAM');
            //Povoando o grafico
            for(i = 0; i < categoria.length; i++){
                data.addRow([categoria[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['yellow'],

                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NÃO ATENDERAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorCategoriaNAT'));
            chart.draw(data, options);
        };
    }




    function graficoAtendimentoPorDateTOT(dado){
        var date = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            date[dt] = dado[dt].case_date.substring(0, 10);
            qtd[dt] = parseInt(dado[dt].tot);
        }
        //tamanho minimo do grafico
        if(date.length < 5)
            for (i = 0; i < 3; i++){
                date[i + (date.length)] = "";
                qtd[i+ (date.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'date');
            data.addColumn('number', 'TOTAL');
            //Povondo o grafico
            for(i = 0; i < date.length; i++){
                data.addRow([date[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'TOTAL DE LOJAS'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDateTOT'));
            chart.draw(data, options);
        };
    }
    function graficoAtendimentoPorDateATE(dado){
        var date = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            date[dt] = dado[dt].case_date.substring(0, 10);
            qtd[dt] = parseInt(dado[dt].ate);
        }
        //tamanho minimo do grafico
        if(date.length < 5)
            for (i = 0; i < 3; i++){
                date[i + (date.length)] = "";
                qtd[i+ (date.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'date');
            data.addColumn('number', 'ATENDERAM');
            //Povondo o grafico
            for(i = 0; i < date.length; i++){
                data.addRow([date[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['green'],

                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE ATENDERAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDateATE'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDateNEG(dado){
        var date = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            date[dt] = dado[dt].case_date.substring(0, 10);
            qtd[dt] = parseInt(dado[dt].neg);
        }
        //tamanho minimo do grafico
        if(date.length < 5)
            for (i = 0; i < 3; i++){
                date[i + (date.length)] = "";
                qtd[i+ (date.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'date');
            data.addColumn('number', 'NEGARAM');
            //Povondo o grafico
            for(i = 0; i < date.length; i++){
                data.addRow([date[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                colors: ['red'],

                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NEGARAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDateNEG'));
            chart.draw(data, options);
        };
    }
    function graficoAtendimentoPorDateNAT(dado){
        var date = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            date[dt] = dado[dt].case_date.substring(0, 10);
            qtd[dt] = parseInt(dado[dt].nat);
        }
        //tamanho minimo do grafico
        if(date.length < 5)
            for (i = 0; i < 3; i++){
                date[i + (date.length)] = "";
                qtd[i+ (date.length)] = 0;
            }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'date');
            data.addColumn('number', 'NÃO ATENDERAM');
            //Povondo o grafico
            for(i = 0; i < date.length; i++){
                console.log(date[i]);
                data.addRow([date[i], qtd[i]]);
            }
            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['yellow'],

                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NÃO ATENDERAM'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDateNAT'));
            chart.draw(data, options);
        };
    }

//Pegando a data atual
    // d = new Date();
    // //console.log("d: " + d);
    // var dia = d.getDate();
    // var mes = d.getMonth() + 1;
    // var ano = d.getFullYear();
    // var dataAtual = dia + "/"+mes +"/"+  ano;

    // //pegando data da semana passada
    // var novaData = new Date(d.getTime() - 10080*60000);
    // //console.log("nova Data: " + novaData);
    // var dataPassada = novaData.getDate() +"/"+ (novaData.getMonth() +1) + "/" + novaData.getFullYear()
    // //carregando clientes da semana passada até hoje
    // console.log("semana passada: "+dataPassada +" hoje: "+ dataAtual);
    // //carregarClientesPorData2(dataPassada ,dataAtual);




    // //carregarCases();
    // var curr = new Date; // get current date
    // var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    // var last = first + 6; // last day is the first day + 6

    // var firstday = new Date(curr.setDate(first)).toLocaleDateString();
    // var lastday = new Date(curr.setDate(last)).toLocaleDateString();
    //console.log(firstday);

  // $scope.carregarAtendimentos("28/12/2016" ,dataAtual);
    //carregarNatendimentos();

    var d = {
        value: new Date(),
    }
     var novaData = {
        value: new Date(d.value.getTime() - 10080*60000),
    }
    $scope.carregarAtendimentos(novaData, d);
    $scope.carregarAtendimentosPorHora($scope.data_startParam, $scope.data_endParam);
    $scope.carregarAtendimentosPorDiaSemana($scope.data_startParam, $scope.data_endParam);
    $scope.carregarAtendimentosPorDiaMes($scope.data_startParam, $scope.data_endParam);
    $scope.carregarAtendimentosPorCategoria($scope.data_startParam, $scope.data_endParam);
    $scope.carregarAtendimentosPorDate($scope.data_startParam, $scope.data_endParam);
    // $scope.carregaConsultasPorHora();
    // $scope.carregaConsultasPorHoraContagem();

});
