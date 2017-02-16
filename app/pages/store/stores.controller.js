angular.module("teewa").controller("storesCtrl", function ($scope, $state, $http, config) {
    //$scope.state = $state;
    $scope.app = "Loja";

    $scope.stores;


    $scope.listarLojas =  function(){
        $http({
                    url : config.baseUrl + "/dash/store",
                    method : 'post',
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization' : config.token
                    },
                    data: {
                        'date_start' : '01/01/2016',
                        'date_end' : '31/12/2016'
                    }
                }).success(function(data){
                    console.log(data);
                    $scope.stores = data;

                }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + error;
                });

    };

    $scope.listarLojas();


});