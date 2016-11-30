/**
 * Created by Larissa Fabíola on 30/11/16.
 */
angular.module("clientes", ["ngMessages"]);
angular.module("clientes").controller("clientesCtrl", function ($scope, $http) {

    $scope.app = "clientes";
    $scope.clientes = [
                {nome: "Vendedor1", telefone: "123", cidade: "Manaus"},
                {nome: "Vendedor2", telefone: "456", cidade: "RJ"},
                {nome: "Vendedor3", telefone: "789", cidade: "SP"}
    ];

    var carregarClientes = function () {
        $http.get("http://localhost:3412/clientes").success(function (data) {
            $scope.clientes = data;
        }).error(function (data, status) {
            $scope.message = "Aconteceu um problema: " + data;
        });
    };

    $scope.adicionarCliente = function (cliente) {
        cliente.data = new Date();
        $http.post("http://localhost:3412/clientes", cliente).success(function (data) {
            delete $scope.cliente;
            $scope.clienteForm.$setPristine();
            carregarClientes();
        });
    };
    $scope.apagarClientes = function (clientes) {
        $scope.clientes = clientes.filter(function (cliente) {
            if (!cliente.selecionado) return cliente;
        });
    };
    $scope.isClienteselecionado = function (clientes) {
        return clientes.some(function (cliente) {
            return cliente.selecionado;
        });
    };
    $scope.ordenarPor = function (campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };

    carregarClientes();
});