/**
 * Created by marcos on 29/11/16.
 */
angular.module("teewa").controller("dashboardCtrl", function ($scope, $http) {
    //$scope.state = $state;
    $scope.app = "Dashboard";
    //$scope.estabelecimentos = [];
    $scope.cases = [];
    $scope.clientes = [];
    $scope.atendimentos = [];

    var carregarClientes = function () {
        $http({
            url : "http://54.233.67.111:8081/users",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
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

            url : "http://api.teewa.com.br:8081/dash/calls/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : date_start,
                'date_end' : date_end
                //'idcategory' : '5'
            }
        }).success(function(data,date){
            $scope.atendimentos = data;
            console.log(data);
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });
            

    };

    var carregarCases = function () {
        $http({

            url : "http://54.233.67.111:8081/analytics/cases",
            method : 'GET',
            headers : {
                'Content-Type' : 'application/json',
            'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            }
            }).success(function(data){
                    $scope.cases = data;
            }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + data;
                    console.log("login error");
        });
        /*$http.get("http://localhost:3412/estabelecimentos").success(function (data) {
            $scope.estabelecimentos = data;
        }).error(function (data, status) {
            $scope.message = "Aconteceu um problema: " + data;
        });*/
    };
    $scope.UserbyCases = [];

    var carregarUsuariosEcasos = function () {
        $http({
            url : "http://54.233.67.111:8081/analytics/cases/by/users",
            method : 'GET',
        }).success(function(data){
            $scope.UserbyCases = data;
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
            console.log($scope.mensage);
        });
    };
    carregarUsuariosEcasos();

    /*$scope.adicionarEstabelecimento = function (estabelecimento) {
        estabelecimento.data = new Date();
        $http.post("http://localhost:3412/estabelecimentos", estabelecimento).success(function (data) {
            delete $scope.estabelecimento;
            $scope.estabelecimentoForm.$setPristine();
            carregarestabelecimentos();
        });
    };*/
    carregarCases();
    carregarClientes();


});