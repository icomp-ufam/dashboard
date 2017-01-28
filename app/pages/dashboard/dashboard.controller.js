/**
 * Created by marcos on 29/11/16.
 */
angular.module("teewa").controller("dashboardCtrl", function ($scope, $state, $http, config) {
    //$scope.state = $state;
    if(sessionStorage.getItem('loginadmin') === '')
        $state.go('main.login.indexadmin');
    console.log('tina'+ sessionStorage.getItem('loginadmin'));
    $scope.app = "Dashboard";
    //$scope.estabelecimentos = [];
    $scope.cases = [];
    $scope.clientes = [];
    $scope.atendimentos = [];
    $scope.estabelecimentos = [];
    $scope.denuncias = [];
    //$scope.teste = $rootScope.usuario;

    var carregarClientes = function () {
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
            //$scope.qtClientes =
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
            console.log("login error");
        });
    };
    $scope.carregarAtendimentos = function () {
        //console.log(date_start);
        //console.log(date_end);

        $http({

            url : config.baseUrl + "/dash/calls/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : '01/01/2016',
                'date_end' : '31/12/2016',
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
            method : 'GET',
        }).success(function(data){
            $scope.UserbyCases = data;
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
            console.log($scope.mensage);
        });
    };

    $scope.carregarEstabelecimentos = function () {
        $http({

            url : config.baseUrl + "/dash/store",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : '01/01/2016',
                'date_end' : '31/12/2016'
            }
        }).success(function(data){
            $scope.estabelecimentos = data;
            $scope.qtEstalecimentos = $scope.estabelecimentos.length;

            //console.log("estabelecimentos: " + $scope.qtEstalecimentos );

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.carregarDenuncias = function () {
        $http({

            url : config.baseUrl + "/dash/complaints",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : '01/01/2016',
                'date_end' : '31/12/2016'
            }
        }).success(function(data){
            $scope.denuncias = data;
            $scope.qtDenuncias = $scope.denuncias.length;

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