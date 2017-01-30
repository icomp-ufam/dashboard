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

	//informações do admin salvas no navegador
	$scope.infoAdmin = localStorage.getItem('loginadmin');

	$scope.controle = function () {
		if(localStorage.getItem('loginadmin') == '' && localStorage.getItem('loginV') == ''){
            //console.log('false');
            return false;
		}else{
		    console.log('true');
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


	$scope.logout = function() {
        //Se vendedor
		localStorage.setItem('vendedor', JSON.stringify(false));
		$scope.vendedor = JSON.parse(localStorage.getItem('vendedor'));
        localStorage.setItem('vendedor_foto', '');
        localStorage.setItem('vendedor_nome', '');

		//se estabelecimento
        localStorage.setItem('Estabelecimento', JSON.stringify(false));
        $scope.Estabelecimento = JSON.parse(localStorage.getItem('Estabelecimento'));

        localStorage.setItem('loginadmin', '');
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

			url : config.baseUrl + "/users/"+ $scope.infoVendedorID,
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
            $scope.infoVendedorPhoto = $scope.infoVendedor.photo;
            $scope.infoVendedorNome = $scope.infoVendedor.name;


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

				'idseller' :$scope.infoVendedorID
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
