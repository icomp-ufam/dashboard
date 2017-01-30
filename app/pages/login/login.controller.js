/**
 * Created by gisele on 26/01/17.
 */
angular.module("teewa").controller("loginController", function ($scope, $state, config, $http, sharedConn, Chats, ChatDetails) {
    if(localStorage.getItem('loginadmin') !== '')
        $state.go('main.dashboard.listar');
    if(localStorage.getItem('loginV') !== '')
        $state.go('main.dashboardVendedor.index');

    $scope.infoVendedorID = '';
    $scope.app = "Dashboard";

    $scope.admins = [
        {nome: 'admin', password: '123' },
        {nome: 'cristina', password: '321' }
    ];
    $scope.mensagem = '';

    //login do admnistrador
    $scope.validaadmin = function (username, password) {
        for(admin in $scope.admins){
            if($scope.admins[admin].nome == username && $scope.admins[admin].password == password){
                console.log('true');
                localStorage.setItem('loginadmin',$scope.admins[admin].nome);
                $scope.mensagem = '';
                $state.go("main.dashboard.listar", {}, {
                    location: "replace",
                    reload: true
                });

                break;
            }else{
                $scope.mensagem = 'Usuário ou senha incorretos!';
            }
        }
    };
    //Carregando vendedores para verificar numero
    $scope.carregaVendedores = function () {
        $http({
            url : config.baseUrl + "/sellers",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
        }).success(function(data){
            $scope.vendedores = data;

            console.log($scope.vendedores);
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.carregaVendedores();
    $scope.loginV  = '';
    $scope.verificaNumero = function (numero) {
        var result = '';
        console.log(numero);
        for(vendedor in $scope.vendedores.sellers){
            //console.log($scope.vendedores.sellers[vendedor].mobile);
            if($scope.vendedores.sellers[vendedor].mobile === numero){
                //aqui solicitação do codigo
                $scope.infoVendedorNome = $scope.vendedores.sellers[vendedor].name;
                localStorage.setItem('userID',$scope.vendedores.sellers[vendedor].id);
                $scope.infoVendedorID = localStorage.getItem('userID');
                $scope.mensagem = '';
                $scope.Proximo();
                break;
            }else{
                $scope.mensagem = 'Numero informado não registrado na base de dados!';
            }
        }

    };

    //variavel que simula o codigo recebido
    $scope.code = '555012';

    $scope.verificaCodigo= function (code) {
        if($scope.code == code){
            localStorage.setItem('loginV', $scope.infoVendedorNome);
            localStorage.setItem('vendedor', JSON.stringify(true));
            $scope.login();
            $scope.mensagem = '';
            $state.go("main.dashboardVendedor.index", {}, {
                location: "replace",
                reload: true
            });
        }
        $scope.mensagem = 'Codigo inválido';
    };

    XMPP_DOMAIN = 'myserver';

    $scope.login = function() {
        sharedConn.login($scope.infoVendedorID,XMPP_DOMAIN,config.password);
        $scope.chats = sharedConn.getRoster();
        $scope.hideTime = true;
        $scope.data = {};
        $scope.myId = sharedConn.getConnectObj().jid;
        $scope.messages = [];
        $scope.to_id = ChatDetails.getTo();

        localStorage.setItem('vendedor', JSON.stringify(true));
        $scope.vendedor = JSON.parse(localStorage.getItem('vendedor'));

    };


    $scope.Proximo = function() {
        var display = document.getElementById('login2').style.display;
        if(display == "none") {
            document.getElementById('login').style.display = 'none';
            document.getElementById('login2').style.display = 'block';
        }else {
            document.getElementById('login').style.display = 'block';
            document.getElementById('login2').style.display = 'none';
        }
    };
    $scope.voltar = function() {
        $scope.mensagem = '';
        var display = document.getElementById('login').style.display;
        if(display == "none") {
            document.getElementById('login2').style.display = 'none';
            document.getElementById('login').style.display = 'block';
        }else {
            document.getElementById('login2').style.display = 'block';
            document.getElementById('login').style.display = 'none';
        }
    }


});