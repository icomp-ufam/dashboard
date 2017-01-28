/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("teewa").controller("estabelecimentosCtrl", function ($scope, $http, config, $state) {
    if(sessionStorage.getItem('loginadmin') === '')
        $state.go('main.login.indexadmin');
    $scope.app = "Estabelecimentos";
    $scope.estabelecimentos = [];
    $scope.storeID = 0;
    $scope.i = 0;
    $scope.rating = [];

    $scope.clickVendedores=function(idloja) {
        $state.go("main.vendedores.listar", { idloja: idloja });
    };

    $scope.carregarPorData = function (date_start, date_end) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear();
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear();

        $http({
            url : config.baseUrl + "/dash/store",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'date_start' : NovaDate_start,
                'date_end' : NovaDate_end
            }
        }).success(function(data){
            $scope.estabelecimentos = data;
            $scope.data_start = {
                        value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

                };
                $scope.data_end = {
                    value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

                };
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.apagarestabelecimentos = function (estabelecimentos) {
        $scope.estabelecimentos = estabelecimentos.filter(function (estabelecimento) {
            if (!estabelecimento.selecionado) return estabelecimento;
        });
    };
    $scope.isEstabelecimentoselecionado = function (estabelecimentos) {
        return estabelecimentos.some(function (estabelecimento) {
            return estabelecimento.selecionado;
        });
    };
    $scope.ordenarPor = function (campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };


    // var curr = new Date; // get current date
    // var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    // var last = first + 6; // last day is the first day + 6

    // var lastday = new Date(curr.setDate(last)).toLocaleDateString();

    var d = {
        value: new Date(),
    }
     //noinspection JSAnnotator
    var novaData = {
        value: new Date(2014, 12, 01),
    }


    $scope.carregarPorData(novaData, d);
});