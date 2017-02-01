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
    $scope.usuario = '';

    $scope.mensagem = '';
   $scope.validaadmin = function (email, password){
        $http({
            url : config.baseUrl + "/dash/login/admin",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization': config.token
            },
            data:{
                'email': email,
                'password': password
            },
        }).success(function(data){
            $scope.admins = data;
            console.log($scope.admins);
            if($scope.admins.code == '200'){
                localStorage.setItem('loginadmin',$scope.admins.admin.name);
                $scope.mensagem = '';
                $state.go("main.dashboard.listar", {}, {
                    location: "replace",
                    reload: true
                });
            }else{
                $scope.mensagem = 'Codigo inválido';
            }

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
   }

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
            //console.log($scope.vendedores);
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.solicitacodigo = function (telefone) {
        $http({
            url : config.baseUrl + "/dash/mycode",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data:{
                'mobile':telefone
            },
        }).success(function(data){
            $scope.usuario = data;
            $scope.infoVendedorNome = $scope.usuario.user.name;
            localStorage.setItem('userID',$scope.usuario.user.id);
            $scope.infoVendedorID = localStorage.getItem('userID');
            if($scope.usuario.user.store != null){
                localStorage.setItem('lojaID',$scope.usuario.user.store.id);
                localStorage.setItem('lojaName',$scope.usuario.user.store.name);

            }
            console.log("idloja" + localStorage.getItem('lojaID'));
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };


    $scope.carregaVendedores();
    $scope.loginV  = '';
    $scope.verificaNumero = function (pais,numero) {
        numero = numero.replace(' ', '');
        numero = numero.replace('-', '');
        numero = pais + numero;
        for(vendedor in $scope.vendedores.sellers){
            //console.log($scope.vendedores.sellers[vendedor].mobile);
            if($scope.vendedores.sellers[vendedor].mobile === numero){
                //console.log('true');
                $scope.solicitacodigo(numero);
                //aqui solicitação do codigo
                $scope.mensagem = '';
                $scope.Proximo();
                break;
            }else{
                $scope.mensagem = 'Número informado não registrado na base de dados!';
            }
        }

    };

    //variavel que simula o codigo recebido
    //$scope.code = '555012';

    $scope.verificaCodigo= function (code) {
        $http({
            url : config.baseUrl + "/dash/login",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data:{
                'iduser': localStorage.getItem('userID'),
                'code': code
            },
        }).success(function(data){
            $scope.codigoconfirmacao = data;
            if($scope.codigoconfirmacao.code == '200'){
                localStorage.setItem('loginV', $scope.infoVendedorNome);
                localStorage.setItem('vendedor', JSON.stringify(true));
                $scope.login();
                $scope.mensagem = '';
                $state.go("main.dashboardVendedor.index", {}, {
                    location: "replace",
                    reload: true
                });
            }else{
                $scope.mensagem = 'Codigo inválido';
            }

        }).error(function(error){
            $scope.mensagem = 'Codigo inválido';
        });


    };

    XMPP_DOMAIN = config.XMPP_DOMAIN;

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
    };


});

/*
Login

Gerar Código:
    ROTA: http://api.teewa.com.br:8081/dash/mycode	(POST)

        PARAMS: mobile (String) *

        RESPONSE: (JSONObject)
{
    "code": 200,
    "message": "User successfully founded",
    "user": {
        "id": "652",
        "name": "Caio Pinheiro",
        "mobile": "5592981223874",
        "photo": null,
        "store":
            {      // esse objeto só vem na reposta SE E SOMENTE SE o usuário for dono da loja
            "id": 1,
            "name": "Teewa"
        }
    }
}

Conferir código:
    ROTA: http://api.teewa.com.br:8081/dash/login	(POST)

        PARAMS: iduser (Int)*
        code (String)*

        RESPONSE: (JSONObject)
{
    "code": 200,
    "message": "It's okay, you can go!"
}

OR

{
    "code": 401,
    "message": "This code is wrong. Please repeat the process"
}


Legenda: * campos obrigatórios.*/
