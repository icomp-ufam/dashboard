/**
 * Created by lgpbentes on 09/01/17.
 */
angular.module("teewa").controller("dashboardVendedorCtrl", function ($scope, $http, config) {
    $scope.app = "Dashboard Vendedor";
    $scope.chats = [];
    $scope.casos = [];
    $scope.qteChats = 0;
    $scope.qteCasos = 0;

    $scope.urlPhotos = config.baseUrl + "/photos/";
    // id do erick
    $scope.idVendedor = '650';

    $scope.carregarCasosAbertos = function () {
        $http({

            url : config.baseUrl + "/sellers/"+ $scope.idVendedor +"/accepted/cases",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            }
        }).success(function(data){
            $scope.chats = data.chats;
            $scope.qteChats = $scope.chats.length;

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
        });
    };

    $scope.carregarCasosNovos = function () {
        $http({
            url : config.baseUrl + "/sellers/news/cases",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'idstore' : '1',
                'idseller' :'652'
            }
        }).success(function(data){
            $scope.casos = data.cases;
            $scope.qteCasos = $scope.casos.length;

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
        });
    };

    $scope.login = function () {
        if((user.username == config.user) && (user.password == config.password)){
            window.location.replace('index.html');
        }
    };

    $scope.carregarCasosAbertos();
    $scope.carregarCasosNovos();

});
