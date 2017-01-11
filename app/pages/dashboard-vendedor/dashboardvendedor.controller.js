/**
 * Created by lgpbentes on 09/01/17.
 */
angular.module("teewa").controller("dashboardVendedorCtrl", function ($scope, $http, config, $state) {
    $scope.app = "Dashboard Vendedor";
    $scope.chats = [];
    $scope.casos = [];
    $scope.qteChats = 0;
    $scope.qteCasos = 0;
    $scope.chatAtual = "";

    $scope.urlPhotos = config.baseUrl + "/photos/";
    $scope.urlFiles = config.baseUrl + "/case_images/";

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
                //id do teewa
                'idstore' : '1',
                //id do caio
                'idseller' :'652'
            }
        }).success(function(data){
            $scope.casos = data.cases;
            $scope.qteCasos = $scope.casos.length;

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
        });
    };

    $scope.aceitarCaso = function (idcase) {
        // so fazer essa parada quando tiver contas de teste
        // rota: /cases/accept, metodo PUT, params: idseller, idcase, idstore
        console.log(idcase);
        //criar a sala, passar o id do chat para a tela de chat (?)
        $state.go("main.dashboardVendedor.casosAbertos");
    };

    $scope.recusarCaso = function (idcase) {
        // so fazer essa parada quando tiver contas de teste
        // rota: /cases/deny, metodo PUT, params: idseller, idcase, idstore
        console.log(idcase);
        //apenas recarregar a pagina
        $state.reload();
    };

    $scope.clickChat = function (nome) {
        $scope.chatAtual = nome;
    };

    $scope.login = function () {
        if((user.username == config.user) && (user.password == config.password)){
            window.location.replace('index.html');
        }
    };

    $scope.carregarCasosAbertos();
    $scope.carregarCasosNovos();

});
