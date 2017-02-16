/**
 * Created by lgpbentes on 09/01/17.
 * Alter by duivilly on 23/01/17.
 * Altered by Saymon on 25/01/17. ** Indenta o código e Corrige datas do filtro de atendimentos e vendedores **
 */
angular.module("teewa").controller("dashboardEstabelecimentoCtrl", function ($filter ,$scope, $http, config, $state, $stateParams, sharedConn, Chats, ChatDetails) {
    //console.log(localStorage.getItem('expired'));
    localStorage.setItem('expired', new Date().getTime());

    $scope.idloja = localStorage.getItem('lojaID');
    $scope.iduser = localStorage.getItem('userID');
    console.log('usseeerrrrQ!!'+ $scope.iduser);
    $scope.urlPhotos = config.baseUrl + "/photos/";
    //Perfil
    if(localStorage.getItem('loginE') === '' && localStorage.getItem('loginadmin') === '')
        $state.go('main.login.index');
    console.log('idloja'+ $scope.idloja);
    $scope.nomePerfil= "Minha Loja";
    $scope.enderecoPerfil= "Rua do pão";
    $scope.categoriaPerfil= "Informática";
    $scope.pacotePerfil= "Basic";

    $scope.limparPerfil= function(){
        $scope.nomePerfil= "";
        $scope.enderecoPerfil= "";
        $scope.categoriaPerfil= "";
        $scope.pacotePerfil= "";
    };

    //#######Todos os vendedores de uma loja#######
    $scope.app = "Vendedores";
    $scope.vendedores = [];

    //carrega vendedores ativos
     var carregarVendedoresLoja = function () {
        $http({
            url : config.baseUrl + "/stores/"+$scope.idloja+ "/sellers/enabled/"+$scope.iduser ,
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            }
        }).success(function(data){
            $scope.vendedores = data.sellers;
            console.log($scope.vendedores);

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
            console.log("login error");
        });
    };

    var carregarVendedoresPendentes = function () {
        $http({
            url : config.baseUrl + "/stores/" + $scope.idloja + "/sellers/disabled/"+$scope.iduser,
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            }
        }).success(function(data){
            $scope.solicitacoes = data.sellers;
            console.log('oi pendentes')
            console.log($scope.solicitacoes);

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
            console.log("login error");
        });
    };
    carregarVendedoresPendentes();

    $scope.mudarAdminLoja = function (id) {
        console.log(id);
        var deixar = confirm('Tem certeza que deseja tornar esse usuário um administrador?');
        if(deixar==true) {
            console.log('oi de novo');
            $http({
                url: config.baseUrl + "/stores/owner/update",
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': config.token
                },
                data: {
                    'idstore': $scope.idstore,
                    'idowner': id
                }
            }).success(function (data) {
                console.log(data);
            }).error(function (error) {
                $scope.message = "Aconteceu um problema: " + error;
            });

        }
    };


    $scope.desvincularVendedor = function (id){
        var deixar = confirm('Tem certeza que deseja desvincular esse vendedor?');
        if (deixar == true){
            $http({
                url : config.baseUrl + config.remove_vendedor,
                method : 'put',
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization' : config.token
                },
                data: {
                    'idstore' : $scope.idstore,
                    'idseller' : id,
                    'notify' : 'true'
                }
            }).success(function(data){
                console.log(data);
                carregarVendedoresLoja();
            }).error(function(error){
                console.log(error);
                $scope.message = "Aconteceu um problema: " + error;
            });

        }
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
    };
    var novaData = {
        value: new Date(d.value.getTime() - 10080*60000),
    };

    carregarVendedoresLoja();

    //#######Todas as denuncias de uma loja#######
    $scope.app = "Denuncias";
    $scope.denuncias = [];

    var carregarDenunciasPorData = function (date_start, date_end, idstore) {
        $http({
            url : config.baseUrl + "/dash/complaints/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {

                'date_start' : date_start,
                'date_end' : date_end,
                'idstore' : idstore
            }
        }).success(function(data){
            $scope.denuncias = data;

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
         $state.go("main.dashboardEstabelecimento.listarPorHora", {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),
        });
    };

    $scope.clickThisAtendimentosPorCategoria=function(date_start, date_end) {
         $state.go("main.dashboardEstabelecimento.listarPorCategoria", {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),
        });
    };

    $scope.clickThisAtendimentosPorDiaSemana=function(date_start, date_end) {
         $state.go("main.dashboardEstabelecimento.listarPorDiaSemana", {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),
        });
    };

    $scope.clickThisAtendimentosPorDate=function(date_start, date_end) {
         $state.go("main.dashboardEstabelecimento.listarPorDate", {
            data_startParametro: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),
            data_endParametro: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),
        });
    };

    $scope.carregarAtendimentos = function (date_start, date_end, idstore) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()

        $http({
            url : config.baseUrl + "/dash/calls/store",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'idstore' : idstore,
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end
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
    };
     var novaData = {
        value: new Date(d.value.getTime() - 10080*60000),
    };

    console.log(d);
    var carregarAtendimentosDefult = function () {
        $scope.carregarAtendimentos(novaData, d, $scope.idloja);
    };

    carregarAtendimentosDefult();

    $scope.carregarAtendimentosPorHora = function (date_start, date_end, idstore) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()

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
                        j++;
                    }else{
                        novo += '"'+i+'":{"case_hour":"'+i+'","ate":"'+0+'","neg":"'+0+'","nat":"'+0+'","tot":"'+0+'"}';
                        j = j;
                    }
                }else{
                    if(i == temp[j]['case_hour']) {
                        novo += '"'+temp[j]['case_hour']+'":{"case_hour":"'+temp[j]['case_hour']+'","ate":"'+temp[j]['ate']+'","neg":"'+temp[j]['neg']+'","nat":"'+temp[j]['nat']+'","tot":"'+temp[j]['tot']+'"},';
                        j++;
                    }else{
                        numero = i >= 10 ? i.toString() : "0"+i.toString();
                        novo += '"'+numero+'":{"case_hour":"'+numero+'","ate":"'+0+'","neg":"'+0+'","nat":"'+0+'","tot":"'+0+'"},';
                        j = j;
                    }
                }
            }
            novo += '}';

            $scope.atendimentosPorHorasCompleto = JSON.parse(novo);
           /* graficoAtendimentoPorHoraTOT(data);
            graficoAtendimentoPorHoraNEG(data);
            graficoAtendimentoPorHoraNAT(data);
            graficoAtendimentoPorHoraATE(data);*/

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
                'Authorization' : config.token
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
                'idstore' : idstore
            }
        }).success(function(data,date){
            $scope.atendimentosPorCategorias = data;
            /*graficoAtendimentoPorCategoriaTOT(data);
            graficoAtendimentoPorCategoriaNEG(data);
            graficoAtendimentoPorCategoriaNAT(data);
            graficoAtendimentoPorCategoriaATE(data);*/

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
                'Authorization' : config.token
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
                'idstore' : idstore
            }
        }).success(function(data,date){
            var temp = [];

            for (i = 0; i< 7; i++){
                let objetosTemp = {
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

            /*graficoAtendimentoPorDiaSemanaTOT(temp);
            graficoAtendimentoPorDiaSemanaNEG(temp);
            graficoAtendimentoPorDiaSemanaNAT(temp);
            graficoAtendimentoPorDiaSemanaATE(temp);*/

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
                'Authorization' : config.token
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
                'idstore' : idstore
            }
        }).success(function(data){
            $scope.atendimentosPorDates = data;

            graficoDenunciaPorDateTOT(data);
            /*graficoAtendimentoPorDateNEG(data);
            graficoAtendimentoPorDateNAT(data);
            graficoAtendimentoPorDateATE(data);*/

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

    $scope.anuncios;
    $scope.stepsModel = [];

    $scope.carregarAnunciosEstabelecimento = function(){
        $http({
            url : config.baseUrl + "/promos/stores/"+$scope.idloja,
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
             data: {
                    'id': $scope.idloja
             }
        }).success(function(data){
           $scope.anuncios = data.promos;
        }).error(function(error){
           $scope.message = "Aconteceu um problema: " + error;
        });
    };

    if (typeof localStorage.getItem('anuncio') !== "undefined"  && localStorage.getItem('anuncio') !== "undefined") {
        $scope.anuncio = angular.fromJson(localStorage.getItem('anuncio'));
    }else{
        $scope.anuncio;
    }

    $scope.goAnuncioForm = function(anuncio){
        $state.go('main.dashboardEstabelecimento.anunciosEstabelecimentoForm');
        localStorage.setItem('anuncio', JSON.stringify(anuncio));
    };

    $scope.saveAnuncioForm = function(anuncio, novo){
            $.getScript("app/assets/js/md5.js", function(){
            var data, url, method;
             if(novo){
                foto = document.querySelector("#filename").files;
                var reader = new FileReader();
                if (foto[0]){
                    reader.readAsDataURL(foto[0]);
                    var file;
                    reader.onload = function () {
                        img_base64 = String(reader.result.split(',')[1]);
                        $http({
                           url : config.baseUrl + '/promos/create',
                           method : 'post',
                           headers : {
                               'Content-Type': 'application/json',
                               'Authorization' : config.token
                           },
                           data : {
                                 'title' : anuncio.title,
                                 'description' : anuncio.description,
                                 'image' : img_base64,
                                 'hash':  CryptoJS.MD5(String($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss')+$scope.idloja)),
                                 'expires_at': $filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss'),
                                 'url': null,
                                 'idstore': $scope.idloja,
                                 'case_enabled': String(anuncio.case_enabled)
                           }
                        }).success(function(data){
                            console.log(data);
                            $state.go("main.dashboardEstabelecimento.anunciosEstabelecimento");
                        }).error(function(error){
                            console.log(error);
                            $scope.message = "Aconteceu um problema: " + error;
                        });

                    };
                }else{
                    $http({
                       url : config.baseUrl + '/promos/create',
                       method : 'post',
                       headers : {
                           'Content-Type': 'application/json',
                           'Authorization' : config.token
                       },
                       data : {'title' : anuncio.title,
                               'description' : anuncio.description,
                               'image' :  null,
                               'hash':  CryptoJS.MD5(String($filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss')+$scope.idloja)),
                               'expires_at': $filter('date')(anuncio.date ,'yyyy-MM-dd HH:mm:ss'),
                               'idstore': $scope.idloja,
                               'case_enabled': String(anuncio.case_enabled),
                               'url':  null,
                       }
                    }).success(function(data){
                        console.log(data);
                        $state.go("main.dashboardEstabelecimento.anunciosEstabelecimento");
                    }).error(function(error){
                        console.log(error);
                        $scope.message = "Aconteceu um problema: " + error;
                    });
                }
            }else{
                $http({
                   url : config.baseUrl + '/promos/stores',
                   method : 'put',
                   headers : {
                       'Content-Type': 'application/json',
                       'Authorization' : config.token
                   },
                   data : {'idpromo':anuncio.id,
                          'title' : anuncio.title,
                          'description' : anuncio.description,
                          'idstore': $scope.idloja,
                          'isActive': String(anuncio.isActive),
                          'case_enabled': String(anuncio.case_enabled)
                    }
                }).success(function(data){
                    console.log(data);
                    $state.go("main.dashboardEstabelecimento.anunciosEstabelecimento");
                }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + error;
                });
            }


         });
    };

    $scope.limparFormulario = function (anuncio) {
            delete $scope.anuncio;
    };

    $scope.imageUpload = function(event){
         $scope.stepsModel = [];
         var files = event.target.files;

         for (var i = 0; i < files.length; i++) {
             var file = files[i];
                 var reader = new FileReader();
                 reader.onload = $scope.imageIsLoaded;
                 reader.readAsDataURL(file);
         }
    };

    $scope.imageIsLoaded = function(e){
        $scope.$apply(function() {
            $scope.stepsModel.push(e.target.result);
        });
    };

    $scope.changeCheck = function(){
        if($scope.anuncio.isActive==true) $scope.anuncio.isActive=false;
        else $scope.anuncio.isActive=true;
    };

    function graficoDenunciaPorDateTOT(dado){
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
                        0: { side: 'top', label: 'TOTAL DE DENÚNCIAS'} // Top x-axis.
                    }
                },
                bar: { groupWidth: 20 }
            };
            //Construindo o gráfico
            var chart = new google.charts.Bar(document.getElementById('graficoDenunciaPorDateTOT'));
            chart.draw(data, options);
        };
    }



    $scope.carregarAnunciosEstabelecimento();

    $scope.carregarAtendimentos(novaData, d, $scope.idloja);
    //$scope.carregarAtendimentosPorHora(novaData, d, $scope.idloja);
    $scope.carregarAtendimentosPorCategoria(novaData, d, $scope.idloja);
    $scope.carregarAtendimentosPorDiaSemana(novaData, d, $scope.idloja);
    $scope.carregarAtendimentosPorDate(novaData, d, $scope.idloja);

    /*var carregarVendedoresLoja = function (date_start, date_end, idstore) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear();
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear();

        $http({

            url : config.baseUrl + "/dash/store/seller",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
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
    };*/
});
