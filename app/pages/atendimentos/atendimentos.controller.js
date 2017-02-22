/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("atendimentosCtrl", function ($scope, $http, config, $state, $stateParams) {
    //console.log(localStorage.getItem('expired'));
    localStorage.setItem('expired', new Date().getTime());

    if(localStorage.getItem('loginadmin') === '')
        $state.go('main.login.indexadmin');
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

    $scope.clickThisAtendimentosPorHora=function(date_start, date_end) {
         $state.go("main.atendimentos.listarPorHora", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.clickThisAtendimentosPorDiaSemana=function(date_start, date_end) {
         $state.go("main.atendimentos.listarPorDiaSemana", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.clickThisAtendimentosPorDiaMes=function(date_start, date_end) {
         $state.go("main.atendimentos.listarPorDiaMes", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.clickThisAtendimentosPorCategoria=function(date_start, date_end) {
         $state.go("main.atendimentos.listarPorCategoria", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.clickThisAtendimentosPorDate=function(date_start, date_end) {
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

        $http({

            url : config.baseUrl + "/dash/calls",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
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
        });

    };
    $scope.carregaConsultasPorHora = function(){
         
        $http({

            url : config.baseUrl + "/analytics/hourly/queries/day/avg",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
        }).success(function(data){
            $scope.consultasPorHora = data;
            graficoConsultasPorHora(data);

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });

    };
    $scope.carregaConsultasPorHoraContagem = function(){
         
        $http({

            url : config.baseUrl + "/analytics/hourly/queries/day",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
        }).success(function(data){
            $scope.consultasPorHora = data;
            graficoConsultasPorHoraContagem(data);
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });

    };
    $scope.carregarAtendimentosPorHora = function (date_start, date_end) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()

        //console.log(NovaDate_end);
        
        $http({

            url : config.baseUrl + "/dash/calls/hour/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
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
			var numero;
			
            var novo = '{';
            for (i = 0; i<= 23; i++){
                if(i == 23){
                    if(i == temp[j]['case_hour']) {
                        novo += '"'+temp[j]['case_hour']+'":{"case_hour":"'+temp[j]['case_hour']+'","ate":"'+temp[j]['ate']+'","neg":"'+temp[j]['neg']+'","nat":"'+temp[j]['nat']+'","tot":"'+temp[j]['tot']+'"}';
                        //novojsong[i] = Array(i, Array(temp[j]['ate'],temp[j]['neg'],temp[j]['nat'],temp[j]['tot']));
                        j++;
                    }else{
                        novo += '"'+i+'":{"case_hour":"'+i+'","ate":"'+0+'","neg":"'+0+'","nat":"'+0+'","tot":"'+0+'"}';
                        //novojsong[i] = Array(i, Array(0, 0, 0, 0));
                        j = j;
                    }
                }else{
                    if(i == temp[j]['case_hour']) {
                        novo += '"'+temp[j]['case_hour']+'":{"case_hour":"'+temp[j]['case_hour']+'","ate":"'+temp[j]['ate']+'","neg":"'+temp[j]['neg']+'","nat":"'+temp[j]['nat']+'","tot":"'+temp[j]['tot']+'"},';
                        //novojsong[i] = Array(i, Array(temp[j]['ate'],temp[j]['neg'],temp[j]['nat'],temp[j]['tot']));
                        j++;
                    }else{
						numero = i >= 10 ? i.toString() : "0"+i.toString();
                        novo += '"'+numero+'":{"case_hour":"'+numero+'","ate":"'+0+'","neg":"'+0+'","nat":"'+0+'","tot":"'+0+'"},';
                        //novojsong[i] = Array(i, Array(0, 0, 0, 0));
                        j = j;
                    }
                }

            }
            novo += '}';
			
            $scope.atendimentosPorHorasCompleto = JSON.parse(novo);
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
        

        });


    };
    $scope.carregarAtendimentosPorDate = function (date_start, date_end) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()

        $http({

            url : config.baseUrl + "/dash/calls/date/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
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
        

        $http({

            url : config.baseUrl + "/dash/calls/day_week",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
            }
        }).success(function(data,date){
			
			var temp = [];
			
			for (i = 0; i< 7; i++){
                let objetosTemp = { //Objeto igual ao 'data', que é inicializado com 0s, pra facilitar a copia de data pra ele 
                    ate: 0,
                    nat: 0,
                    neg: 0,
                    tot: 0,
                    day_of_week: i,
                }
				
				for(contData = 0; contData < data.length; contData++){
					
					if(i == data[contData].day_of_week){
						objetosTemp.ate = data[contData].ate;
						objetosTemp.nat = data[contData].nat;
						objetosTemp.neg = data[contData].neg;
						objetosTemp.tot = data[contData].tot;
					}
				}

                temp.push(objetosTemp);
            }
			
            $scope.atendimentosPorDiaSemanas = temp;
			
			//$scope.atendimentosPorDiaSemanas = data;
            graficoAtendimentoPorDiaSemanaTOT(temp);
            graficoAtendimentoPorDiaSemanaNEG(temp);
            graficoAtendimentoPorDiaSemanaNAT(temp);
            graficoAtendimentoPorDiaSemanaATE(temp);

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
         
        $http({

            url : config.baseUrl + "/dash/calls/day_month",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
            }
        }).success(function(data,date){
            var temp = [];
			
			for (i = 1; i<= 31; i++){
                let objetosTemp = { //Objeto igual ao 'data', que é inicializado com 0s, pra facilitar a copia de data pra ele 
                    ate: 0,
                    nat: 0,
                    neg: 0,
                    tot: 0,
                    day_of_month: i,
                }
				
				for(contData = 0; contData < data.length; contData++){
					
					if(i == data[contData].day_of_month){
						objetosTemp.ate = data[contData].ate;
						objetosTemp.nat = data[contData].nat;
						objetosTemp.neg = data[contData].neg;
						objetosTemp.tot = data[contData].tot;
					}
				}

                temp.push(objetosTemp);
            }
			
            $scope.atendimentosPorDiaMess = temp;
			
            graficoAtendimentoPorDiaMesTOT(temp);
            graficoAtendimentoPorDiaMesNEG(temp);
            graficoAtendimentoPorDiaMesNAT(temp);
            graficoAtendimentoPorDiaMesATE(temp);

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

        $http({

            url : config.baseUrl + "/dash/calls/category",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
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

    //************ GRÁFICO DOS ATENDIMENTOS POR HORA *************
    
    function graficoConsultasPorHoraContagem(dado){
        var hora = [];
        var qtd = [];

        for(dt in dado) {
            hora[dt] = parseInt(dado[dt].hora);
            qtd[dt] = parseInt(dado[dt].casos);
        }
        
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
           
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'Consultas por hora (Contagem)'} 
                    }
                },
                bar: { groupWidth: 20 }
            };
     
            var chart = new google.charts.Bar(document.getElementById('graficoConsultasPorHoraContagem'));
            chart.draw(data, options);
        };
    }

    function graficoConsultasPorHora(dado){
        var hora = [];
        var qtd = [];

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
           
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'Média por hora do dia'} 
                    }
                },
                bar: { groupWidth: 20 }
            };
     
            var chart = new google.charts.Bar(document.getElementById('graficoConsultasPorHora'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorHoraTOT(dado){
        var hora = [];
        var qtd = [];

        for(dt in dado) {
            hora[dt] = dado[dt].case_hour.toString();
            qtd[dt] = parseInt(dado[dt].tot);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Hora');
            data.addColumn('number', 'TOTAL');
           
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'TOTAL DE LOJAS'} 
                    }
                },
                bar: { groupWidth: 20 }
            };
     
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorHoraTOT'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorHoraATE(dado){
        var hora = [];
        var qtd = [];

        for(dt in dado) {
            hora[dt] = dado[dt].case_hour.toString();
            qtd[dt] = parseInt(dado[dt].ate);
        }
        
        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Hora');
            data.addColumn('number', 'ATENDERAM');
           
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['green'],

                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE ATENDERAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };
     
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorHoraATE'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorHoraNEG(dado){
        var hora = [];
        var qtd = [];

        for(dt in dado) {
            hora[dt] = dado[dt].case_hour.toString();
            qtd[dt] = parseInt(dado[dt].neg);
        }
        
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
           
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                colors: ['red'],

                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NEGARAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };
     
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorHoraNEG'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorHoraNAT(dado){
        var hora = [];
        var qtd = [];

        for(dt in dado) {
            hora[dt] = dado[dt].case_hour.toString();
            qtd[dt] = parseInt(dado[dt].nat);
        }
        
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
           
            for(i = 0; i < hora.length; i++){
                data.addRow([hora[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['yellow'],

                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NÃO ATENDERAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };
     
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorHoraNAT'));
            chart.draw(data, options);
        };
    }

    //************ GRÁFICO DOS ATENDIMENTOS POR DIA DA SEMANA *************

    function graficoAtendimentoPorDiaSemanaTOT(dado){
        var dia = [];
        var qtd = [];


        for(dt in dado) {
            dia[dt] = dado[dt].day_of_week.toString();
            qtd[dt] = parseInt(dado[dt].tot);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'TOTAL');
           
            for(i = 0; i < dia.length; i++){
                    data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'TOTAL DE LOJAS'} 
                    }
                },
                bar: { groupWidth: 20 }
            };
     
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaSemanaTOT'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDiaSemanaATE(dado){
        var dia = [];
        var qtd = [];

        for(dt in dado) {
            dia[dt] = dado[dt].day_of_week.toString();
            qtd[dt] = parseInt(dado[dt].ate);
        }
        
        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'ATENDERAM');
           
            for(i = 0; i < dia.length; i++){
                    data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['green'],

                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE ATENDERAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };
     
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaSemanaATE'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDiaSemanaNEG(dado){
        var dia = [];
        var qtd = [];

        for(dt in dado) {
            dia[dt] = dado[dt].day_of_week.toString();
            qtd[dt] = parseInt(dado[dt].neg);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'NEGARAM');

            for(i = 0; i < dia.length; i++){
                    data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                colors: ['red'],

                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NEGARAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };
     
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaSemanaNEG'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDiaSemanaNAT(dado){
        var dia = [];
        var qtd = [];

        for(dt in dado) {
            dia[dt] = dado[dt].day_of_week.toString();
            qtd[dt] = parseInt(dado[dt].nat);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'NÃO ATENDERAM');

            for(i = 0; i < dia.length; i++){
                    data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['yellow'],

                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NÃO ATENDERAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };
     
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaSemanaNAT'));
            chart.draw(data, options);
        };
    }

        //************ GRÁFICO DOS ATENDIMENTOS POR DIA DO MÊS *************

    function graficoAtendimentoPorDiaMesTOT(dado){
        var dia = [];
        var qtd = [];

        for(dt in dado) {
            dia[dt] = dado[dt].day_of_month.toString();
            qtd[dt] = parseInt(dado[dt].tot);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'TOTAL');

            for(i = 0; i < dia.length; i++){
                data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'TOTAL DE LOJAS'} 
                    }
                },
                bar: { groupWidth: 20 }
            };
     
            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaMesTOT'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDiaMesATE(dado){
        var dia = [];
        var qtd = [];

        for(dt in dado) {
            dia[dt] = dado[dt].day_of_month.toString();
            qtd[dt] = parseInt(dado[dt].ate);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'ATENDERAM');
           
            for(i = 0; i < dia.length; i++){
                data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['green'],

                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE ATENDERAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaMesATE'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDiaMesNEG(dado){
        var dia = [];
        var qtd = [];

        for(dt in dado) {
            dia[dt] = dado[dt].day_of_month.toString();
            qtd[dt] = parseInt(dado[dt].neg);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'NEGARAM');

            for(i = 0; i < dia.length; i++){
                    data.addRow([dia[i], qtd[i]]);
                
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                colors: ['red'],

                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NEGARAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaMesNEG'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDiaMesNAT(dado){
        var dia = [];
        var qtd = [];

        for(dt in dado) {
            dia[dt] = dado[dt].day_of_month.toString();
            qtd[dt] = parseInt(dado[dt].nat);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Dia');
            data.addColumn('number', 'NÃO ATENDERAM');

            for(i = 0; i < dia.length; i++){
                    data.addRow([dia[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['yellow'],

                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NÃO ATENDERAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDiaMesNAT'));
            chart.draw(data, options);
        };
    }

    //************ GRÁFICO DOS ATENDIMENTOS POR CATEGORIA *************

    function graficoAtendimentoPorCategoriaTOT(dado){
        var categoria = [];
        var qtd = [];

        for(dt in dado) {
            categoria[dt] = dado[dt].categoria.toString();
            qtd[dt] = parseInt(dado[dt].tot);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);

        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'categoria');
            data.addColumn('number', 'TOTAL');

            for(i = 0; i < categoria.length; i++){
                data.addRow([categoria[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'TOTAL DE LOJAS'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorCategoriaTOT'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorCategoriaATE(dado){
        var categoria = [];
        var qtd = [];

        for(dt in dado) {
            categoria[dt] = dado[dt].categoria.toString();
            qtd[dt] = parseInt(dado[dt].ate);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'categoria');
            data.addColumn('number', 'ATENDERAM');

            for(i = 0; i < categoria.length; i++){
                data.addRow([categoria[i], qtd[i]]);
            }
            var options = {
                title: '',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal',
                colors: ['green'],
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE ATENDERAM'}
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorCategoriaATE'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorCategoriaNEG(dado){
        var categoria = [];
        var qtd = [];
        
        for(dt in dado) {
            categoria[dt] = dado[dt].categoria.toString();
            qtd[dt] = parseInt(dado[dt].neg);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'categoria');
            data.addColumn('number', 'NEGARAM');
            
            for(i = 0; i < categoria.length; i++){
                data.addRow([categoria[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal',
                colors: ['red'],

                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NEGARAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorCategoriaNEG'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorCategoriaNAT(dado){
        var categoria = [];
        var qtd = [];

        for(dt in dado) {
            categoria[dt] = dado[dt].categoria.toString();
            qtd[dt] = parseInt(dado[dt].nat);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'categoria');
            data.addColumn('number', 'NÃO ATENDERAM');

            for(i = 0; i < categoria.length; i++){
                data.addRow([categoria[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['yellow'],

                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NÃO ATENDERAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorCategoriaNAT'));
            chart.draw(data, options);
        };
    }

    //************ GRÁFICO DOS ATENDIMENTOS POR DATA *************

    function graficoAtendimentoPorDateTOT(dado){
        var date = [];
        var qtd = [];
        
        for(dt in dado) {
            date[dt] = dado[dt].case_date.substring(0, 10);
            qtd[dt] = parseInt(dado[dt].tot);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'date');
            data.addColumn('number', 'TOTAL');
            
            for(i = 0; i < date.length; i++){
                data.addRow([date[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'TOTAL DE LOJAS'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDateTOT'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDateATE(dado){
        var date = [];
        var qtd = [];

        for(dt in dado) {
            date[dt] = dado[dt].case_date.substring(0, 10);
            qtd[dt] = parseInt(dado[dt].ate);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'date');
            data.addColumn('number', 'ATENDERAM');

            for(i = 0; i < date.length; i++){
                data.addRow([date[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['green'],

                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE ATENDERAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDateATE'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDateNEG(dado){
        var date = [];
        var qtd = [];

        for(dt in dado) {
            date[dt] = dado[dt].case_date.substring(0, 10);
            qtd[dt] = parseInt(dado[dt].neg);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'date');
            data.addColumn('number', 'NEGARAM');
            
            for(i = 0; i < date.length; i++){
                data.addRow([date[i], qtd[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal',
                colors: ['red'],

                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NEGARAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDateNEG'));
            chart.draw(data, options);
        };
    }

    function graficoAtendimentoPorDateNAT(dado){
        var date = [];
        var qtd = [];

        for(dt in dado) {
            date[dt] = dado[dt].case_date.substring(0, 10);
            qtd[dt] = parseInt(dado[dt].nat);
        }
        
        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'date');
            data.addColumn('number', 'NÃO ATENDERAM');
 
            for(i = 0; i < date.length; i++){
                data.addRow([date[i], qtd[i]]);
            }
            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                colors: ['yellow'],

                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'QUANTIDADE DE LOJAS QUE NÃO ATENDERAM'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentoPorDateNAT'));
            chart.draw(data, options);
        };
    }

    var d = {
        value: new Date()
    };
     var novaData = {
        value: new Date(d.value.getTime() - 10080*60000)
    };

	$scope.carregarAtendimentos(novaData, d);
	$scope.carregarAtendimentosPorHora($scope.data_startParam, $scope.data_endParam);
    $scope.carregarAtendimentosPorDiaSemana($scope.data_startParam, $scope.data_endParam);
    $scope.carregarAtendimentosPorDiaMes($scope.data_startParam, $scope.data_endParam);
    $scope.carregarAtendimentosPorCategoria($scope.data_startParam, $scope.data_endParam);
    $scope.carregarAtendimentosPorDate($scope.data_startParam, $scope.data_endParam);
	$scope.carregarAtendimentosPorDate($scope.data_startParam, $scope.data_endParam);
    $scope.carregaConsultasPorHora();
    $scope.carregaConsultasPorHoraContagem();
});