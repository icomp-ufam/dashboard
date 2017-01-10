/**
 * Created by lgpbentes on 09/01/17.
 */
angular.module("teewa").controller("dashboardVendedorCtrl", function ($scope, $http, config) {
//$scope.state = $state;
    $scope.login = function () {
        if((user.username == config.user) && (user.password == config.password)){
            window.location.replace('index.html');
        }
    }
});
