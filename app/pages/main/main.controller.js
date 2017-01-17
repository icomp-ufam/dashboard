/**
 * Created by Marcos Soares on 10/01/17
 * Edited by Luiz Gustavo on 11/01/17 and 15/01/17
 */
angular.module("teewa").controller("mainCtrl", function ($scope, $state, config) {
	$scope.state = $state;
	
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
    };
    $scope.verifica = function () {
		return $scope.vendedor;
    }
});