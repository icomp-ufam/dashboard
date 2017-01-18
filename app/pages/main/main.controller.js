/**
 * Created by Marcos Soares on 10/01/17
 * Edited by Luiz Gustavo on 11/01/17 and 15/01/17
 */
angular.module("teewa").controller("mainCtrl", function ($scope, $state, config, $http) {
	$scope.state = $state;

	$scope.urlPhotos = config.baseUrl + "/photos/";
	
	if(localStorage.getItem('todos')==='true'){
		$scope.vendedor = true;
	}else{
		$scope.vendedor = false;
	}
	
    //stub de login
	$scope.login = function(user) {
        /*sharedConn.login(config.user,'myserver',config.password);
        $scope.chats = sharedConn.getRoster();
        $scope.hideTime = true;
        $scope.data = {};
        $scope.myId = sharedConn.getConnectObj().jid;
        $scope.messages = [];
        $scope.to_id = ChatDetails.getTo();*/
		localStorage.setItem('todos', JSON.stringify(true));
		$scope.vendedor = JSON.parse(localStorage.getItem('todos'));
		$scope.carregaVendedor();
    };
	$scope.logout = function() {
        /*console.log("T");
        sharedConn.logout();
        $state.go('login', {}, {
            location: "replace",
            reload: true
        });*/
        localStorage.setItem('todos', JSON.stringify(false));
		$scope.vendedor = JSON.parse(localStorage.getItem('todos'));
		$scope.infoVendedor = "";
    };
    $scope.verifica = function () {
		return $scope.vendedor;
    };

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


		}).error(function(error){
			$scope.message = "Aconteceu um problema: " + error;
		});
	};

});