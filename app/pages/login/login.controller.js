/**
 * Created by gisele on 26/01/17.
 */
angular.module("teewa").controller("loginController", function ($scope, $timeout, $state, config, $http, sharedConn, Chats, ChatDetails) {
    //console.log(localStorage.getItem('expired'));
    localStorage.setItem('expired', new Date().getTime());

    if(localStorage.getItem('loginadmin') !== '')
        $state.go('main.dashboard.listar');
    if(localStorage.getItem('loginV') !== '')
        $state.go('main.dashboardVendedor.index');

    $scope.app = "Dashboard";
    $scope.mensagem = '';
    $scope.infoLojaName = '';

    //Autentica o acesso para o usuário administrador.
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
            }
        }).success(function(data){
            $scope.admins = data;
            console.log($scope.admins.admin);
            //console.log($scope.admins);
            if($scope.admins.code == '200'){
                localStorage.setItem('loginadmin',$scope.admins.admin.name);
                localStorage.setItem('fotoadmin', $scope.admins.admin.photo);
                $scope.mensagem = '';
                $state.go("main.dashboard.listar", {}, {
                    location: "replace",
                    reload: true
                });
            }else{
                $scope.mensagem = 'Usuário ou senha inválidos';
                $timeout(function() {
                    $scope.mensagem = '';
                }, 2000);
            }

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    //Carregando user para verificar numero
    $scope.carregaUser = function () {
        $http({
            url : config.baseUrl + "/users",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            }
        }).success(function(data){
            $scope.usuarios = data.users;
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };
    $scope.carregaUser();

    //Carregando vendedores para verificar numero
    $scope.carregaVendedores = function () {
        $http({
            url : config.baseUrl + "/sellers",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            }
        }).success(function(data){
            $scope.vendedores = data;
            console.log($scope.vendedores);
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };
    $scope.carregaVendedores();
    $scope.loginV  = '';

    //Carregando vendedores para verificar numero- poder ir para tela de se vincular ou criar nova loja
    $scope.verificaVendedor = function (telefone) {
        $http({
            url : config.baseUrl + "/dash/mycode",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data:{
                'mobile':telefone,
                'send_notification': 'false'
            }
        }).success(function(data){
            if(data.user != null){
                $scope.souvendedor = true;
            }else{
                $scope.souvendedor = false;
            }
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
        if($scope.souvendedor == true){
            return true;
        }else{
            return false;
        }
    };

    $scope.verificaUsuario = function (pais,numero) {
        if(numero == '-') numero = null;
        if(numero != null){
            numero = numero.replace(' ', '');
            numero = numero.replace('-', '');
            if(pais == null) pais = 55;
            numero = pais + numero;
            //console.log('numero: ' + numero);
            var souvendedor = false;
            var souusuario = false;

            souvendedor = $scope.verificaVendedor(numero);

            for(user in $scope.usuarios){
                if($scope.usuarios[user].mobile === numero){
                    souusuario = true;
                }
            }
            //se for vendedor
            if(souvendedor){
                alert('Voce precisa sair da sua loja primeiro!');
            }else if (souusuario && !souvendedor){
                $state.go('main.store.lojaList', {}, {
                    location: "replace",
                    reload: true
                });
            }else{
                var sim = confirm('Você ainda não é usuário teewa, deseja baixar a aplicação?')
                if(sim == true){
                    window.open('https://play.google.com/store/apps/details?id=com.teewa.hermes&hl=pt_BR');
                }
            }

        }else{
            $scope.mensagem = 'Informe um número válido!';
            $timeout(function() {
                $scope.mensagem = '';
            }, 2000);
        }

    };


    $scope.verificaNumero = function (pais,numero) {
        if(numero == '-') numero = null;
        if(numero != null){
            numero = numero.replace(' ', '');
            numero = numero.replace('-', '');
            if(pais == null) pais = 55;
            numero = pais + numero;
            console.log('numero: ' + numero);
            for(vendedor in $scope.vendedores.sellers){
               // console.log($scope.vendedores.sellers[vendedor].mobile);
                if($scope.vendedores.sellers[vendedor].mobile === numero){
                    $scope.solicitacodigo(numero);
                    $scope.mensagem = '';
                    break;
                }else{
                    $scope.mensagem = 'Número informado não registrado na base de dados!';
                    $timeout(function() {
                        $scope.mensagem = '';
                    }, 2000);
                }
            }
        }else{
            $scope.mensagem = 'Informe um número!';
            $timeout(function() {
                $scope.mensagem = '';
            }, 2000);
        }

    };

    //Solicita código através do número do usuário vendedor/estabelecimento
    $scope.solicitacodigo = function (telefone) {
        $http({
            url : config.baseUrl + "/dash/mycode",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data:{
                'mobile':telefone,
                'send_notification': 'true'
            }
        }).success(function(data){
            $scope.usuario = data;
            if($scope.usuario.user != null){
                $scope.Proximo();
                $scope.infoVendedorNome = $scope.usuario.user.name;
                $scope.infoVendedorID = $scope.usuario.user.id;
                localStorage.setItem('userID',$scope.usuario.user.id);
                //se o usuario for dono de loja
                if($scope.usuario.user.store != null){
                    console.log('sou dono de loja!!!')
                    localStorage.setItem('lojaID',$scope.usuario.user.store.id);
                    $scope.infoLojaName=$scope.usuario.user.store.name;
                }
                console.log($scope.infoLojaName);
                console.log("idloja: " + localStorage.getItem('lojaID'));
            }else {
                alert('Você não é vendedor, entre em uma loja!');
            }

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    //Código é verificado a partir da solicitação do usuario
   $scope.verificaCodigo= function (code) {
        /*$http({
            url : config.baseUrl + "/dash/login",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data:{
                'iduser': localStorage.getItem('userID'),
                'code': code
            }
        }).success(function(data){
            $scope.codigoconfirmacao = data;
            if($scope.codigoconfirmacao.code == '200'){*/
                localStorage.setItem('loginV', $scope.infoVendedorNome);
                localStorage.setItem('vendedor', JSON.stringify(true));
                //se usuario for dono de loja
                //console.log('Info loja name '+$scope.infoLojaName);
                if($scope.infoLojaName != ''){
                    localStorage.setItem('loginE', $scope.infoLojaName);
                    localStorage.setItem('Estabelecimento', JSON.stringify(true));
                    //console.log('Entrou!!')
                }
                $scope.login();
                $scope.mensagem = '';
                $state.go("main.dashboardVendedor.index", {}, {
                    location: "replace",
                    reload: true
                });/*
            }else{
                $scope.mensagem = 'Codigo inválido';
                $timeout(function() {
                    $scope.mensagem = '';
                }, 2000);
            }

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });*/
    };

    XMPP_DOMAIN = config.XMPP_DOMAIN;

    $scope.login = function() {
        /*sharedConn.login($scope.infoVendedorID,XMPP_DOMAIN,config.password);
        $scope.chats = sharedConn.getRoster();
        $scope.hideTime = true;
        $scope.data = {};
        $scope.myId = sharedConn.getConnectObj().jid;
        $scope.messages = [];
        $scope.to_id = ChatDetails.getTo();
*/
        localStorage.setItem('vendedor', JSON.stringify(true));
        $scope.vendedor = JSON.parse(localStorage.getItem('vendedor'));

    };

    //Transição entre a tela de solicitar e validar código
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

    //Em caso de servidor indisponível
    /*$scope.validaadmin = function (email, password){
         localStorage.setItem('loginadmin',email);
         $scope.mensagem = '';
         $state.go("main.dashboard.listar", {}, {
         location: "replace",
         reload: true
         });
     };

     $scope.solicitacodigo = function (telefone) {
     };

     $scope.verificaNumero = function (pais,numero) {
         numero = numero.replace(' ', '');
         numero = numero.replace('-', '');
         numero = pais + numero;
         //console.log('true');
         $scope.solicitacodigo(numero);
         //aqui solicitação do codigo
         $scope.mensagem = '';
         $scope.Proximo();
     };
     //$scope.code = '555012';
     $scope.verificaCodigo = function (code) {
         localStorage.setItem('loginV', 'gisele');
         localStorage.setItem('vendedor', JSON.stringify(true));
         localStorage.setItem('loginE', 'loja top');
         localStorage.setItem('Estabelecimento', JSON.stringify(true));
         $scope.login();
         $scope.mensagem = '';
         $state.go("main.dashboardVendedor.index", {}, {
         location: "replace",
         reload: true
         });
     };*/

     $scope.recuperarSenha = function (email) {
        $http({
            url : config.baseUrl + "/dash/admin/password",
            method : 'put',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data:{
                'email': email
            }
        }).success(function(data){
            $scope.rec = data;
            if($scope.rec.code == '200'){
                $scope.mensagem = 'Uma nova senha foi enviada para o email informado.';
            }else{
                $scope.mensagem = 'Email informado não cadastrado!';
                $timeout(function() {
                    $scope.mensagem = '';
                }, 3000);
            }
        }).error(function(error){
            $scope.messagem = "Aconteceu um problema: " + error;
        });
    };
});
