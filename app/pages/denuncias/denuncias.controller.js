angular.module("teewa").controller("denunciasCtrl", function ($scope, $http, config) {

    localStorage.setItem('expired', new Date().getTime());

    if(localStorage.getItem('loginadmin') === '')
        $state.go('main.login.indexadmin');
    $scope.app = "Denuncias";
    $scope.denuncias = [];

    var carregarDenunciasPorData = function (date_start, date_end) {
        $http({
            url : config.baseUrl + "/dash/complaints/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                
                'date_start' : date_start,
                'date_end' : date_end
            }
        }).success(function(data){
            console.log($scope.denuncias);
            $scope.denuncias = data;
            console.log($scope.denuncias);
            console.log(date_start + " , " + date_end);

            console.log(data);
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });

    };

    //carregarDenuncias();
    carregarDenunciasPorData("01/01/2015","24/12/2019");
});