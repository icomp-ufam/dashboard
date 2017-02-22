/**
 * Created by Larissa Fabíola on 30/11/16.
 * Modified by Saymon Souza on 20/02/17.
 */
angular.module("teewa").controller("estabelecimentosCtrl", function ($scope, $http, config, $state) {
    localStorage.setItem('expired', new Date().getTime());

    if(localStorage.getItem('loginadmin') === '')
        $state.go('main.login.indexadmin');
    $scope.app = "Estabelecimentos";
    $scope.estabelecimentos = [];
    $scope.storeID = 0;
    $scope.i = 0;
    $scope.rating = [];

    $scope.clickVendedores=function(idloja) {
        localStorage.setItem('lojaID', idloja);
        $state.go('main.dashboardEstabelecimento.index');
    };

    $scope.carregarPorData = function (date_start, date_end) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear();
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear();

        $http({
            url : config.baseUrl + "/dash/store",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end
            }
        }).success(function(data){
            $scope.estabelecimentos = data;
            graficoConsultasPorLoja(data);
            graficoAtendimentosPorLoja(data);
            graficoPorcentagemPorLoja(data);
            
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

    var d = {
        value: new Date(),
    }
    var novaData = {
        value: new Date(d.value.getTime() - 10080*60000),
    }

    function graficoAtendimentosPorLoja(dado) {
        var name = [];
        var atendimentos = [];
        
        for(dt in dado) {
            name[dt] = dado[dt].name;
            atendimentos[dt] = parseInt(dado[dt].atendimentos);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Nome');
            data.addColumn('number', 'Atendimentos');
            
            for(i = 0; i < name.length; i++){
                if(atendimentos[i] > 0)
                    data.addRow([name[i], atendimentos[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'Quantidade de consultas atendidas por loja'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoAtendimentosPorLoja'));
            chart.draw(data, options);
        };
    }

    function graficoConsultasPorLoja(dado){
        var name = [];
        var consultas = [];
        
        for(dt in dado) {
            name[dt] = dado[dt].name;
            consultas[dt] = parseInt(dado[dt].consultas);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);
        
        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Nome');
            data.addColumn('number', 'Consultas');
            
            for(i = 0; i < name.length; i++){
                if(consultas[i] > 0)
                    data.addRow([name[i], consultas[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'Total de consultas realizadas por loja'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoConsultasPorLoja'));
            chart.draw(data, options);
        };
    }

    function graficoPorcentagemPorLoja(dado){
        var name = [];
        var porcentagem = [];

        for(dt in dado) {
            name[dt] = dado[dt].name;
            porcentagem[dt] = parseInt(dado[dt].percentual);
        }

        google.charts.load('current', {'packages':['bar']});
        google.charts.setOnLoadCallback(drawStuff);

        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Nome');
            data.addColumn('number', 'Porcentagem (%)');

            for(i = 0; i < name.length; i++){
                console.log(porcentagem[i]);
                data.addRow([name[i], porcentagem[i]]);
            }

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: { position: 'none' },
                bars: 'horizontal', 
                axes: {
                    x: {
                        0: { side: 'top', label: 'Percentual de atendimento (%)'} 
                    }
                },
                bar: { groupWidth: 20 }
            };

            var chart = new google.charts.Bar(document.getElementById('graficoPorcentagemPorLoja'));
            chart.draw(data, options);
        };
    }

    $scope.carregarPorData(novaData, d);
});
