/**
 * Created by Marcos Soares on 10/01/17
 * Edited by Luiz Gustavo on 11, 15 and 23/01/17
 */
angular.module("teewa").controller("mainCtrl", function ($scope, $state, config, $http, sharedConn, Chats, ChatDetails) {
	$scope.state = $state;
    $scope.urlPhotos = config.baseUrl + "/photos/";

    //Informações do vendedor salvas no navegador
	$scope.infoVendedorPhoto = localStorage.getItem('vendedor_foto');
	$scope.infoVendedorNome = localStorage.getItem('vendedor_nome');
	$scope.infoVendedorID = localStorage.getItem('userID');

	$scope.infoVendedorAvgRating = localStorage.getItem('vendedor_avaliacao');
	$scope.infoVendedorSumRating = localStorage.getItem('vendedor_qtdAvaliacoes');
	$scope.infoVendedorQtdAtd = localStorage.getItem('vendedor_qtdAtendimentos');

	$scope.infoAdmin = localStorage.getItem('loginadmin');
    //console.log($scope.infoAdmin);

	$scope.controle = function () {
		if(localStorage.getItem('loginadmin') == '' && localStorage.getItem('loginV') == ''){
            //console.log('false');
            return false;
		}else{
            return true;
		}
	};

    //Verificando login de vendedor
	if(localStorage.getItem('vendedor')==='true'){
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

		localStorage.setItem('vendedor', JSON.stringify(true));
		$scope.vendedor = JSON.parse(localStorage.getItem('vendedor'));
		$scope.carregaVendedor();
    };

	$scope.logout = function() {

        //Se vendedor
		localStorage.setItem('vendedor', JSON.stringify(false));
		localStorage.setItem('loginadmin', '');
		$scope.vendedor = JSON.parse(localStorage.getItem('vendedor'));
        localStorage.setItem('vendedor_foto', '');
        localStorage.setItem('vendedor_nome', '');

		//se estabelecimento
        localStorage.setItem('Estabelecimento', JSON.stringify(false));
        $scope.Estabelecimento = JSON.parse(localStorage.getItem('Estabelecimento'));

		localStorage.setItem('loginV', '');
		localStorage.setItem('userID', '');

		console.log("desconectou!!");
		$state.go('main.login.indexadmin', {}, {
			location: "replace",
			reload: true
		});
		sharedConn.logout();

    };

	//Verificando Login de Estabelecimento
	if(localStorage.getItem('Estabelecimento')==='true'){
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
		localStorage.setItem('Estabelecimento', JSON.stringify(true));
		$scope.Estabelecimento = JSON.parse(localStorage.getItem('Estabelecimento'));
		//Vendedor
		localStorage.setItem('vendedor', JSON.stringify(false));
		$scope.vendedor = JSON.parse(localStorage.getItem('vendedor'));
		localStorage.setItem('vendedor_foto', '');
		localStorage.setItem('vendedor_nome', '');
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
			localStorage.setItem('vendedor_foto', $scope.infoVendedor.photo);
			localStorage.setItem('vendedor_nome', $scope.infoVendedor.name);
			localStorage.setItem('vendedor_avaliacao', $scope.infoVendedor.avg_rating);
			localStorage.setItem('vendedor_qtdAvalicoes', $scope.infoVendedor.sum_rating);
			localStorage.setItem('vendedor_qtdAtendimentos', $scope.infoVendedor.ate);

            $scope.infoVendedorPhoto = $scope.infoVendedor.photo;
            $scope.infoVendedorNome = $scope.infoVendedor.name;
			$scope.infoVendedorAvgRating = $scope.infoVendedor.avg_rating;
			$scope.infoVendedorSumRating = $scope.infoVendedor.sum_rating;
			$scope.infoVendedorQtdAtd = $scope.infoVendedor.ate;



        }).error(function(error){
			$scope.message = "Aconteceu um problema: " + error;
		});
	};

	if($scope.infoVendedorID != '')
		$scope.carregaVendedor();

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
