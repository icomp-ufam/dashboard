angular.module("teewa").controller("denunciasCtrl", function ($scope, $http, config) {

    $scope.app = "Denuncias";
    $scope.denuncias = [];

    var carregarDenunciasPorData = function (date_start, date_end) {
        var NovaDate_start = date_start.value.getDate() + "/" + (date_start.value.getMonth() +1) + "/" + date_start.value.getFullYear()
        var NovaDate_end = date_end.value.getDate() + "/" + (date_end.value.getMonth() +1) + "/" + date_end.value.getFullYear()
        console.log(NovaDate_start);
        console.log(NovaDate_end);
        $http({

            url : config.baseUrl + "/dash/complaints/",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
               'date_start' : NovaDate_start,
                'date_end' : NovaDate_end,
            }
        }).success(function(data){
            $scope.denuncias = data;
                        

            $scope.data_start = {
                        value: new Date(date_start.value.getFullYear(), date_start.value.getMonth(), date_start.value.getDate()),

            };
            $scope.data_end = {
                    value: new Date(date_end.value.getFullYear(), date_end.value.getMonth(), date_end.value.getDate()),

            };
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
            console.log("login error");
        });

    };
    var d = {
        value: new Date(),
    }

    var novaData = {
        value: new Date(d.value.getTime() - 10080*60000),
    }

    //carregarDenuncias();
    carregarDenunciasPorData(novaData, d);
});