/**
 * Created by Marcos Soares on 10/01/17
 * Edited by Luiz Gustavo on 11/01/17
 */
angular.module("teewa").controller("mainCtrl", function ($scope, $state, config) {
	$scope.state = $state;
	$scope.vendedor = false; // verificar!!!, esta voltando 
    //stub de login
	$scope.login = function(user) {
        /*sharedConn.login(config.user,'myserver',config.password);
        $scope.chats = sharedConn.getRoster();
        $scope.hideTime = true;
        $scope.data = {};
        $scope.myId = sharedConn.getConnectObj().jid;
        $scope.messages = [];
        $scope.to_id = ChatDetails.getTo();*/
        $scope.vendedor = true;
    };
	$scope.logout = function() {
        /*console.log("T");
        sharedConn.logout();
        $state.go('login', {}, {
            location: "replace",
            reload: true
        });*/
        $scope.vendedor = false;
    };
    $scope.verifica = function () {
		return $scope.vendedor;
    }
});