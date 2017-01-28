/**
 * Created by Marcos Soares on 10/01/17
 * Edited by Luiz Gustavo on 11, 15 and 23/01/17
 */
angular.module("teewa").controller("mainCtrl", function ($scope, $state, config, $http, sharedConn, Chats, ChatDetails) {
	$scope.state = $state;
    $scope.urlPhotos = config.baseUrl + "/photos/";

    //Informações do vendedor salvas no navegador
	$scope.infoVendedorPhoto = sessionStorage.getItem('vendedor_foto');
	$scope.infoVendedorNome = sessionStorage.getItem('vendedor_nome');
    console.log($scope.infoAdmin);
	$scope.infoAdmin = sessionStorage.getItem('loginadmin');
    console.log($scope.infoAdmin);
	$scope.controle = function () {
		if(sessionStorage.getItem('loginadmin') == ''){
            console.log('false');
            return false;
		}else{
		    console.log('true');
            return true;
		}
	};

    //Verificando login de vendedor
	if(sessionStorage.getItem('vendedor')==='true'){
		$scope.vendedor = true;
	}else{
		$scope.vendedor = false;
	}

    $scope.verifica = function () {
        return $scope.vendedor;
    };

    XMPP_DOMAIN = 'myserver';

    //stub de login e logout do vendedor
	$scope.login = function(user) {

        sharedConn.login(config.user,XMPP_DOMAIN,config.password);
        $scope.chats = sharedConn.getRoster();
        $scope.hideTime = true;
        $scope.data = {};
        $scope.myId = sharedConn.getConnectObj().jid;

        $scope.messages = [];
        $scope.to_id = ChatDetails.getTo();

		sessionStorage.setItem('vendedor', JSON.stringify(true));
		$scope.vendedor = JSON.parse(sessionStorage.getItem('vendedor'));
		$scope.carregaVendedor();
    };

	$scope.logout = function() {

        //Se vendedor
		sessionStorage.setItem('vendedor', JSON.stringify(false));
		sessionStorage.setItem('loginadmin', '');
		$scope.vendedor = JSON.parse(sessionStorage.getItem('vendedor'));
        sessionStorage.setItem('vendedor_foto', '');
        sessionStorage.setItem('vendedor_nome', '');
		$scope.infoVendedor = "";
		//se estabelecimento
        sessionStorage.setItem('Estabelecimento', JSON.stringify(false));
        $scope.Estabelecimento = JSON.parse(sessionStorage.getItem('Estabelecimento'));
        console.log("desconectou!!");
		$state.go('main.login.indexadmin', {}, {
			location: "replace",
			reload: true
		});
		sharedConn.logout();

    };

	//Verificando Login de Estabelecimento
	if(sessionStorage.getItem('Estabelecimento')==='true'){
		$scope.Estabelecimento = true;
	}else{
		$scope.Estabelecimento = false;
	}

	$scope.verificaEstabelecimento = function(){
		return $scope.Estabelecimento;
	};
	//Stub para estabelecimento
	$scope.loginEstabelecimento = function(user) {
		//Estabelecimento
		sessionStorage.setItem('Estabelecimento', JSON.stringify(true));
		$scope.Estabelecimento = JSON.parse(sessionStorage.getItem('Estabelecimento'));
		//Vendedor
		sessionStorage.setItem('vendedor', JSON.stringify(false));
		$scope.vendedor = JSON.parse(sessionStorage.getItem('vendedor'));
		sessionStorage.setItem('vendedor_foto', '');
		sessionStorage.setItem('vendedor_nome', '');
		$scope.infoVendedor = "";
	};


    //Carregando dados vendedor
    $scope.carregaVendedor = function () {
		$http({

			url : config.baseUrl + "/users/"+ config.user,
			method : 'get',
			headers : {
				'Content-Type': 'application/json',
				'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
			}
		}).success(function(data){
			$scope.infoVendedor = data.user;
			//guardando informações do vendedor
			sessionStorage.setItem('vendedor_foto', $scope.infoVendedor.photo);
			sessionStorage.setItem('vendedor_nome', $scope.infoVendedor.name);
            $scope.infoVendedorPhoto = $scope.infoVendedor.photo;
            $scope.infoVendedorNome = $scope.infoVendedor.name;


        }).error(function(error){
			$scope.message = "Aconteceu um problema: " + error;
		});
	};

    //Carregando casos para a barra de notificações
	$scope.carregarCasos = function () {
		$http({
			url : config.baseUrl + "/sellers/news/cases",
			method : 'post',
			headers : {
				'Content-Type': 'application/json',
				'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
			},
			data: {
				//id do chat-dashboard estatico (mudar)
				'idstore' : '118',

				'idseller' :config.user
			}
		}).success(function(data){
			$scope.novos = data.cases;
			$scope.qteNovos = data.cases.length;

		}).error(function(error){
			$scope.message = "Aconteceu um problema: " + error;
		});
	};

	$scope.carregarCasos();


});
