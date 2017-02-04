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

    $scope.infoAdminNome = localStorage.getItem('loginadmin');

	$scope.infoLojaName = localStorage.getItem('loginE');
    $scope.infoLojaID = localStorage.getItem('lojaID');

	$scope.Estabelecimento = JSON.parse(localStorage.getItem('Estabelecimento'));

	//informações do admin salvas no navegador
	$scope.infoAdmin = localStorage.getItem('loginadmin');
	//verifica se ha alguém logado
	$scope.controle = function () {
		if((localStorage.getItem('loginadmin') == '' && localStorage.getItem('loginV') == '') && localStorage.getItem('loginE') == ''){
            //console.log('false');
            return false;
		}else{
		    //console.log('true');
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
		//false admin, true loja/vendedor
		var sair = false;
		if(localStorage.getItem('vendedor') === 'true'){
			sair = true;
		}
		localStorage.setItem('vendedor', JSON.stringify(false));
		$scope.vendedor = JSON.parse(localStorage.getItem('vendedor'));
        localStorage.setItem('vendedor_foto', '');
        localStorage.setItem('vendedor_nome', '');
		localStorage.setItem('loginE', '');
		//se estabelecimento
        localStorage.setItem('Estabelecimento', JSON.stringify(false));
        $scope.Estabelecimento = JSON.parse(localStorage.getItem('Estabelecimento'));

        localStorage.setItem('loginadmin', '');
		localStorage.setItem('loginV', '');
		localStorage.setItem('userID', '');

		console.log("desconectou!!");
		if(sair == true){
			$state.go('main.login.index', {}, {
				location: "replace",
				reload: true
			});
		}else{
			$state.go('main.login.indexadmin', {}, {
				location: "replace",
				reload: true
			});
			sharedConn.logout();
		}

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
	$scope.loginEstabelecimento = function() {
		//Estabelecimento

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
