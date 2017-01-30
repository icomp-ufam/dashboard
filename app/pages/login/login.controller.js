/**
 * Created by gisele on 26/01/17.
 */
angular.module("teewa").controller("loginController", function ($scope, $state, config, $http, sharedConn, Chats, ChatDetails) {
    if(localStorage.getItem('loginadmin') !== '')
        $state.go('main.dashboard.listar');
    $scope.app = "Dashboard";
    $scope.clientes = [
        {nome: 'admin', password: '123' },
        {nome: 'cristina', password: '321' }
    ];
    $scope.valida = function (username, password) {
        var result = '';
        for(cliente in $scope.clientes){
            if($scope.clientes[cliente].nome == username && $scope.clientes[cliente].password == password){
                console.log('true');
                localStorage.setItem('loginadmin',$scope.clientes[cliente].nome);
                result = '';
                $state.go("main.dashboard.listar", {}, {
                    location: "replace",
                    reload: true
                });

                break;
            }else{
                result = 'usuário ou senha incorretos!';
            }
        }
        //alerta de usuario ou senha incorreto
        if(result != ''){
            alert(result);
        }
    };


});