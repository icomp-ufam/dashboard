angular.module("teewa").controller("denunciasCtrl", function ($scope, $http, config) {

    $scope.app = "Denuncias";
    $scope.denuncias = [];

    var carregarDenunciasPorData = function (date_start, date_end) {
        $http({

            url : config.baseUrl + "/dash/complaints/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'date_start' : '01/01/2016',
                'date_end' : '22/12/2016'
            }
        }).success(function(data){
            $scope.denuncias = data;
            console.log(data);
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });

    };

    //carregarDenuncias();
    carregarDenunciasPorData("01/01/201","22/12/2016");
});