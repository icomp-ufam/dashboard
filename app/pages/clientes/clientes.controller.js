/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("clientesCtrl", function ($scope, $http, config, $stateParams, $state) {

    $scope.app = "Clientes";
    $scope.clientes = [];
     $scope.clientesGraphic = [];

    $scope.data_startParam = {
        value: new Date($stateParams.data_startParametro)
    }
    $scope.data_endParam = {
        value: new Date($stateParams.data_endParametro)
    }
    // console.log(" $stateParams1 = " + $scope.data_startParam.value.getDate() );
    // console.log(" $stateParams2 = " + $scope.data_endParam.value );


    $scope.clickThisAnaliseCasos=function(date_start, date_end) {
        // console.log("teste date_start : " + date_start.value);
        // console.log("teste date_end : " + date_end );
         $state.go("main.analisesCasos.listar", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };
    $scope.clickThisClientesGraphic=function(date_start, date_end) {
         //console.log("teste date_start : " + date_start.value);
        // console.log("teste date_end : " + date_end );
         $state.go("main.clientes.graphic", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.carregarClientesPorData = function (date_start, date_end) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
         console.log(NovaDate_start);
         console.log(NovaDate_end);

            $http({

                url : config.baseUrl + "/dash/users",
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
                $scope.clientes = data;
               //rafico(data);

                $scope.data_start = {
                        value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

                };
                $scope.data_end = {
                    value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

                };

            }).error(function(error){
                $scope.message = "Aconteceu um problema: " + error;
                //console.log("login error");
            });
        

    };

    $scope.carregarClientesPorData2 = function (date_start, date_end) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        console.log(NovaDate_start);
         console.log(NovaDate_end);

            $http({

                url : config.baseUrl + "/dash/users",
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
                $scope.clientesGraphic = data;
                grafico(data);

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

    $scope.apagarClientes = function (clientes) {
        $scope.clientes = clientes.filter(function (cliente) {
            if (!cliente.selecionado) return cliente;
        });
    };
    $scope.isClienteselecionado = function (clientes) {
        return clientes.some(function (cliente) {
            return cliente.selecionado;
        });
    };
    $scope.ordenarPor = function (campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };

    // //Pegando a data atual
    // d = new Date();
    // var dia = d.getDate();
    // var mes = d.getMonth() + 1;
    // var ano = d.getFullYear();
    // var dataAtual = dia + "/"+mes +"/"+  ano;

    // //pegando data da semana passada
    // var novaData = new Date(d.getTime() - 10080*60000);
    // var dataPassada = novaData.getDate() +"/"+ (novaData.getMonth() +1) + "/" + novaData.getFullYear()
    // //carregando clientes da semana passada até hoje
    // console.log("semana passada: "+dataPassada +" hoje: "+ dataAtual);
    var d = {
        value: new Date(),
    }
     var novaData = {
        value: new Date(d.value.getTime() - 10080*60000),
    }

    $scope.carregarClientesPorData(novaData, d);
	$scope.carregarClientesPorData2(novaData, d);
    //$scope.carregarClientesPorData2($scope.data_startParam, $scope.data_endParam);

    function grafico(dado){
        var nome = [];
        var qtd = [];
        //dados para o grafico
        for(dt in dado) {
            nome[dt] = dado[dt].nome.toString();
            qtd[dt] = parseInt(dado[dt].qtde_casos);
        }
		console.log(nome);
		console.log(qtd);
        // //tamanho minimo do grafico
        // if(nome.length < 5)
        //     for (i = 0; i < 3; i++){
        //         nome[i + (nome.length)] = "";
        //         qtd[i+ (nome.length)] = 0;
        //     }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
		
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Cliente');
            data.addColumn('number', 'casos');
            //Povondo o grafico
            for(i = 0; i < nome.length; i++)
                data.addRow([nome[i], qtd[i]]);

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', //orientação do gráfico
                axes: {
                    x: {
                        0: { side: 'top', label: 'Casos'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('top_x_div'));
            chart.draw(data, options);
        };
    }
});