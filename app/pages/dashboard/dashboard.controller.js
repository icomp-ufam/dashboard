/**
 * Created by marcos on 29/11/16.
 */
angular.module("teewa").controller("dashboardCtrl", function ($scope, $http, config) {
    //$scope.state = $state;
    $scope.app = "Dashboard";
    //$scope.estabelecimentos = [];
    $scope.cases = [];
    $scope.clientes = [];

    var carregarClientes = function () {
        $http({
            url : config.baseUrl + "/users",
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

    var carregarCases = function () {
        $http({

            url : config.baseUrl + "/analytics/cases",
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
    carregarUsuariosEcasos();
    carregarCases();
    carregarClientes();
});