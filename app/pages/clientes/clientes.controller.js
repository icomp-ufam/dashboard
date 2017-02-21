/**
 * Created by Larissa Fabíola on 30/11/16.
 * Modified by Saymon Souza on 21/02/17.
 */
angular.module("teewa").controller("clientesCtrl", function ($scope, $http, config, $stateParams, $state) {
    localStorage.setItem('expired', new Date().getTime());

    if (localStorage.getItem('loginadmin') === '')
        $state.go('main.login.indexadmin');
    $scope.app = "Clientes";
    $scope.clientes = [];
    $scope.clientesGraphic = [];

    $scope.data_startParam = {
        value: new Date($stateParams.data_startParametro)
    }
    $scope.data_endParam = {
            value: new Date($stateParams.data_endParametro)
        }

    $scope.clickThisAnaliseCasos = function (date_start, date_end) {
        $state.go("main.analisesCasos.listar", {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),
        });
    };
    $scope.clickThisClientesGraphic = function (date_start, date_end) {
        $state.go("main.clientes.graphic", {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),
        });
    };

    $scope.carregarClientesPorData = function (date_start, date_end) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() + 1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() + 1) + "/" + date_end.value.getFullYear()
    
        $http({
            url: config.baseUrl + "/dash/users",
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': config.token
            },
            data: {
                'date_start': NovaDate_start,
                'date_end': NovaDate_end,
            }
        }).success(function (data) {
            $scope.clientes = data;

            $scope.data_start = {
                value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            };
            $scope.data_end = {
                value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),
            };
        }).error(function (error) {
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.carregarClientesPorData2 = function (date_start, date_end) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() + 1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() + 1) + "/" + date_end.value.getFullYear()
        console.log(NovaDate_start);
        console.log(NovaDate_end);

        $http({
            url: config.baseUrl + "/dash/users",
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': config.token
            },
            data: {
                'date_start': NovaDate_start,
                'date_end': NovaDate_end,
            }
        }).success(function (data) {
            $scope.clientesGraphic = data;
            grafico(data);

            $scope.data_start = {
                value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

            };
            $scope.data_end = {
                value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

            };

        }).error(function (error) {
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

    var d = {
        value: new Date(),
    }
    var novaData = {
        value: new Date(d.value.getTime() - 10080 * 60000),
    }

    $scope.carregarClientesPorData(novaData, d);
    $scope.carregarClientesPorData2(novaData, d);

    function grafico(dado) {
        var nome = [];
        var qtd = [];

        for (dt in dado) {
            nome[dt] = dado[dt].nome.toString();
            qtd[dt] = parseInt(dado[dt].qtde_casos);
        }
        google.charts.load('current', {
            'packages': ['bar']
        });
        google.charts.setOnLoadCallback(drawStuff);

        function drawStuff() {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Cliente');
            data.addColumn('number', 'casos');
            
            for (i = 0; i < nome.length; i++)
                data.addRow([nome[i], qtd[i]]);

            var options = {
                title: 'Chess opening moves',
                width: 950,
                height: data.getNumberOfRows() * 65,
                legend: {
                    position: 'none'
                },
                bars: 'horizontal', 
                axes: {
                    x: {
                        0: {
                            side: 'top',
                            label: 'Casos'
                        } 
                    }
                },
                bar: {
                    groupWidth: 20
                }
            };

            var chart = new google.charts.Bar(document.getElementById('top_x_div'));
            chart.draw(data, options);
        };
    }
});