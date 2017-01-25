/**
 * Created by lgpbentes on 09/01/17.
 * Alter by duivilly on 23/01/17.
 */
angular.module("teewa").controller("dashboardEstabelecimentoCtrl", function ($scope, $http, config, $state , sharedConn, Chats, ChatDetails) {
    //$scope.app = "Dashboard Estabelecimento";

    $scope.idloja = 1;

    //#######Todos os vendedores de uma loja#######
    $scope.app = "Vendedores";
    $scope.vendedores = [];

    var carregarVendedoresLoja = function (date_start, date_end, idstore) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear();
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear();

        $http({

            url : config.baseUrl + "/dash/store/seller",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
                'idstore'  : idstore
            }
        }).success(function(data){
            $scope.vendedores = data;
            //console.log($scope.vendedores);

            $scope.data_start = {
                value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

            };
            $scope.data_end = {
                value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

            };

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
            console.log("login error");
        });
    };

    $scope.apagarVendedores = function (vendedores) {
        $scope.vendedores = vendedores.filter(function (vendedor) {
            if (!vendedor.selecionado) return vendedor;
        });
    };
    $scope.isVendedoreSelecionado = function (vendedores) {
        return vendedores.some(function (vendedor) {
            return vendedor.selecionado;
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
        value: new Date(2014, 12, 01),
    }

    carregarVendedoresLoja(novaData, d, $scope.idloja);


    //#######Todas as denuncias de uma loja#######
    $scope.app = "Denuncias";
    $scope.denuncias = [];

    var carregarDenunciasPorData = function (date_start, date_end, idstore) {
        $http({

            url : config.baseUrl + "/dash/complaints/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                
                'date_start' : date_start,
                'date_end' : date_end,
                'idstore' : idstore
            }
        }).success(function(data){
            $scope.denuncias = data;
                        console.log(date_start + " , " + date_end);

            console.log(data);
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });

    };

    carregarDenunciasPorData("01/01/2015","24/12/2019", $scope.idloja);
    
    //#######Todos os atendimentos de uma loja#######
    $scope.app = "Atendimentos";
    $scope.atendimentos = [];

    $scope.clickThisAtendimentosPorHora=function(date_start, date_end) {
         $state.go("main.dashboardEstabelecimento.listarPorHora", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.clickThisAtendimentosPorCategoria=function(date_start, date_end) {
         $state.go("main.dashboardEstabelecimento.listarPorCategoria", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.clickThisAtendimentosPorDiaSemana=function(date_start, date_end) {
         $state.go("main.dashboardEstabelecimento.listarPorDiaSemana", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.clickThisAtendimentosPorDate=function(date_start, date_end) {
         $state.go("main.dashboardEstabelecimento.listarPorDate", 
            {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

        });
    };

    $scope.carregarAtendimentos = function (date_start, date_end, idstore) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()

        $http({

            url : config.baseUrl + "/dash/calls",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
                'idstore' : idstore
            }
        }).success(function(data,date){
            $scope.atendimentos = data;
            
            console.log(data);
            
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

    var d = {
        value: new Date(),
    }
     var novaData = {
        value: new Date(d.value.getTime() - 10080*60000),
    }

    $scope.carregarAtendimentosPorHora = function (date_start, date_end, idstore) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        //console.log(NovaDate_start);
        //console.log(NovaDate_end);
        
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
                'idstore' : idstore
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
            console.log("login error");

        });

    };

    $scope.carregarAtendimentosPorCategoria = function (date_start, date_end, idstore) {
        
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()

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
                'idstore' : idstore
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

    $scope.carregarAtendimentosPorDiaSemana = function (date_start, date_end, idstore) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        

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
                'idstore' : idstore
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

    $scope.carregarAtendimentosPorDate = function (date_start, date_end, idstore) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()

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
                'idstore' : idstore
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

    $scope.carregarAtendimentos(novaData, d, $scope.idloja);
    $scope.carregarAtendimentosPorHora(novaData, d, $scope.idloja);
    $scope.carregarAtendimentosPorCategoria(novaData, d, $scope.idloja);
    $scope.carregarAtendimentosPorDiaSemana(novaData, d, $scope.idloja);
    $scope.carregarAtendimentosPorDate(novaData, d, $scope.idloja);

});
