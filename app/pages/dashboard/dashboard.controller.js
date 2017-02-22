/**
 * Created by marcos on 29/11/16.
 */
angular.module("teewa").controller("dashboardCtrl", function ($scope, $state, $http, config) {
    //console.log(localStorage.getItem('expired'));
    localStorage.setItem('expired', new Date().getTime());

    //$scope.state = $state;
    if(localStorage.getItem('loginadmin') === '')
        $state.go('main.login.indexadmin');
    $scope.app = "Dashboard";
    //$scope.estabelecimentos = [];
    $scope.cases = [];
    $scope.clientes = [];
    $scope.clientesAntes = [];
    $scope.atendimentos = [];
    $scope.atendimentosAntes = [];
    $scope.estabelecimentos = [];
    $scope.estabelecimentosAntes = [];
    $scope.denuncias = [];
    $scope.denunciasAntes = [];
    //$scope.teste = $rootScope.usuario;

    var carregarClientes = function () {
        var today= new Date();
        var ddToday= today.getDate();
        var mmToday= today.getMonth()+1;
        var yyToday= today.getFullYear();
        var dataToday= ddToday+'/'+mmToday+'/'+yyToday;


        //quantidade de dias para voltar
        var dParaVoltar= 1;
        ///////////////////
        var ddAntes= ddToday;
        var mmAntes= mmToday;
        var yyAntes= yyToday;
        var todayS= mmAntes+'/'+ddAntes+'/'+yyAntes;

        var myDate = new Date(todayS);
        var dayOfMonth = myDate.getDate();
        myDate.setDate(dayOfMonth - dParaVoltar);
        var todayAntes= myDate.getDate()+'/'+(myDate.getMonth()+1)+'/'+myDate.getFullYear();

        $http({
            url : config.baseUrl + "/users",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : config.token
            }
        }).success(function(data){
            $scope.clientes = data;
            $scope.qtClientes = $scope.clientes.users.length;
            //console.log(data);
            //console.log(data.users);
            var clientesDataAtual= 0;
            for(var i= 0; i < data.users.length; i++){
                var arrayData= data.users[i]['created_at'];
                var arrayDataAtual= new Date(arrayData);
                var idDataAtual= arrayDataAtual.getDate()+'/'+(arrayDataAtual.getMonth()+1)+'/'+arrayDataAtual.getFullYear();
                console.log(idDataAtual+' -- '+dataToday);
                if(idDataAtual == dataToday){
                    clientesDataAtual= clientesDataAtual + 1;
                }
            }
            console.log(clientesDataAtual);
            //
            //calculo em percentagem
            var t4= $scope.qtClientes;
            var n4= clientesDataAtual;
            var p4= ((t4-(t4-n4))/t4)*100;
            if(p4 < 0){
                p4= p4*-1;
            }
            $scope.qtClientesAntes= clientesDataAtual;
            $scope.qtClientesAntesPer= p4;
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
            console.log("login error");
        });

    };


    $scope.carregarAtendimentos = function () {
        //console.log(date_start);
        //console.log(date_end);
        var today= new Date();
        var ddToday= today.getDate();
        var mmToday= today.getMonth()+1;
        var yyToday= today.getFullYear();
        var dataToday= ddToday+'/'+mmToday+'/'+yyToday;


        //quantidade de dias para voltar
        var dParaVoltar= 1;
        ///////////////////
        var ddAntes= ddToday;
        var mmAntes= mmToday;
        var yyAntes= yyToday;
        var todayS= mmAntes+'/'+ddAntes+'/'+yyAntes;

        var myDate = new Date(todayS);
        var dayOfMonth = myDate.getDate();
        myDate.setDate(dayOfMonth - dParaVoltar);
        var todayAntes= myDate.getDate()+'/'+(myDate.getMonth()+1)+'/'+myDate.getFullYear();

        $http({

            url : config.baseUrl + "/dash/calls/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : '01/01/2016',
                'date_end' : dataToday,
                //'idcategory' : '5'
            }
        }).success(function(data,date){
            $scope.atendimentos = data;
            $scope.qtAtendimentos = $scope.atendimentos.length;
            //console.log($scope.qtAtendimentos)
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });


        $http({

            url : config.baseUrl + "/dash/calls/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : todayAntes,
                'date_end' : dataToday,
                //'idcategory' : '5'
            }
        }).success(function(data,date){
            $scope.atendimentosAntes = data;
            $scope.qtAtendimentosAntes= $scope.atendimentosAntes.length;
            //calculo em percentagem
            var t3= $scope.qtAtendimentos;
            var n3= $scope.qtAtendimentosAntes;
            var p3= ((t3-(t3-n3))/t3)*100;
            if(p3 < 0){
                p3= p3*-1;
            }
            $scope.qtAtendimentosAntesPer= p3;

            //console.log($scope.qtAtendimentos)
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });
            

    };


    var carregarCases = function () {
        $http({

            url : config.baseUrl + "/analytics/cases",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : config.token
            }
            }).success(function(data){
                    $scope.cases = data;
            }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + data;
                    console.log("login error");
        });

    };


    $scope.UserbyCases = [];
    var carregarUsuariosEcasos = function () {
        $http({
            url : config.baseUrl + "/analytics/cases/by/users",
            method : 'GET'
        }).success(function(data){
            $scope.UserbyCases = data;
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
            console.log($scope.mensage);
        });
    };



    $scope.carregarEstabelecimentos = function () {
        var today= new Date();
        var ddToday= today.getDate();
        var mmToday= today.getMonth()+1;
        var yyToday= today.getFullYear();
        var dataToday= ddToday+'/'+mmToday+'/'+yyToday;


        //quantidade de dias para voltar
        var dParaVoltar= 1;
        ///////////////////
        var ddAntes= ddToday;
        var mmAntes= mmToday;
        var yyAntes= yyToday;
        var todayS= mmAntes+'/'+ddAntes+'/'+yyAntes;

        var myDate = new Date(todayS);
        var dayOfMonth = myDate.getDate();
        myDate.setDate(dayOfMonth - dParaVoltar);
        var todayAntes= myDate.getDate()+'/'+(myDate.getMonth()+1)+'/'+myDate.getFullYear();

        $http({

            url : config.baseUrl + "/dash/store",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : '01/01/2016',
                'date_end' : dataToday
            }
        }).success(function(data){
            $scope.estabelecimentos = data;
            $scope.qtEstalecimentos = $scope.estabelecimentos.length;
            //console.log(data);
            var lojasDataAtual= 0;
            for(var i= 0; i < data.length; i++){
                var arrayData= data[i]['created_at'];
                var arrayDataAtual= new Date(arrayData);
                var idDataAtual= arrayDataAtual.getDate()+'/'+(arrayDataAtual.getMonth()+1)+'/'+arrayDataAtual.getFullYear();
                //console.log(idDataAtual+' -- '+dataToday);
                if(idDataAtual == dataToday){
                    lojasDataAtual= lojasDataAtual + 1;
                }
            }
            //
            //calculo em percentagem
            var t2= $scope.qtEstalecimentos;
            var n2= lojasDataAtual;
            var p2= ((t2-(t2-n2))/t2)*100;
            if(p2 < 0){
                p2= p2*-1;
            }
            $scope.qtEstalecimentosAntes= lojasDataAtual;
            $scope.qtEstalecimentosAntesPer= p2;
            //console.log('total: '+lojasDataAtual);
            //console.log("estabelecimentos: " + $scope.qtEstalecimentos );

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
        
    };



    $scope.carregarDenuncias = function () {
        var today= new Date();
        var ddToday= today.getDate();
        var mmToday= today.getMonth()+1;
        var yyToday= today.getFullYear();
        var dataToday= ddToday+'/'+mmToday+'/'+yyToday;


        //quantidade de dias para voltar
        var dParaVoltar= 1;
        ///////////////////
        var ddAntes= ddToday;
        var mmAntes= mmToday;
        var yyAntes= yyToday;
        var todayS= mmAntes+'/'+ddAntes+'/'+yyAntes;

        var myDate = new Date(todayS);
        var dayOfMonth = myDate.getDate();
        myDate.setDate(dayOfMonth - dParaVoltar);
        var todayAntes= myDate.getDate()+'/'+(myDate.getMonth()+1)+'/'+myDate.getFullYear();

        //document.write('hoje: '+dataToday+' --- ');
        //document.write('anterior: '+todayAntes);

//pega todas as denuncias e o total
        $http({
            url : config.baseUrl + "/dash/complaints",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : '1/1/2016',
                'date_end' : dataToday
            }
        }).success(function(data){
            $scope.denuncias = data;
            $scope.qtDenuncias = $scope.denuncias.length;

            //console.log("denuncias: " + $scope.qtDenuncias);

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });

//pega as denuncias de um dia ou uma semana e o total
        $http({
            url : config.baseUrl + "/dash/complaints",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : todayAntes,
                'date_end' : dataToday
            }
        }).success(function(data){
            $scope.denunciasAntes = data;
            //calculo em percentagem
            var t1= $scope.qtDenuncias;
            var n1= $scope.denunciasAntes.length;
            var p1= ((t1-(t1-n1))/t1)*100;
            if(p1 < 0){
                p1= p1*-1;
            }
            $scope.qtDenunciasAntes= $scope.denunciasAntes.length;
            $scope.qtDenunciasAntesPer= p1;

            //document.write(p);
           
            //console.log("denuncias: " + $scope.qtDenuncias);

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });        
    };


    carregarUsuariosEcasos();
    carregarCases();
    carregarClientes();
    $scope.carregarAtendimentos();
    $scope.carregarEstabelecimentos();
    $scope.carregarDenuncias();
}); 