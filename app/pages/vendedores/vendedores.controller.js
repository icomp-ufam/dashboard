/**
 * Created by marcos on 29/11/16.
 */

angular.module("teewa").controller("vendedoresCtrl", function ($scope, $http, config, $stateParams) {
    if(localStorage.getItem('loginadmin') === '')
        $state.go('main.login.indexadmin');
    $scope.app = "Vendedores";
    $scope.vendedores = [];

    $scope.idloja = $stateParams.idloja;

    var carregarVendedoresLoja = function (date_start, date_end, idstore) {
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
        //noinspection JSAnnotator
        var novaData = {
            value: new Date(2014, 12, 01),
        }

    carregarVendedoresLoja(novaData, d,$scope.idloja);
});