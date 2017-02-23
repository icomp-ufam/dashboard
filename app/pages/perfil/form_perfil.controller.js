/**
 * Created by marcos on 01/12/16.
 */
angular.module("teewa").controller("form_perfilCtrl", function ($scope, $http, config, $state) {
    //console.log(localStorage.getItem('expired'));
    localStorage.setItem('expired', new Date().getTime());

    if(localStorage.getItem('loginadmin') === ''){
        $state.go('main.login.indexadmin');
    }
    $scope.admins = [];
    $scope.admin = [];

    $scope.update = localStorage.getItem('adm_edit1');
    $scope.admin.id = localStorage.getItem('adm_edit_id1');
    $scope.admin.name = localStorage.getItem('adm_edit_name1');
    $scope.admin.email = localStorage.getItem('adm_edit_email1');

    $scope.atualizarAdmin = function (admin) {
        console.log("aqui");
        foto = document.querySelector("#filename").files;
        var reader = new FileReader();
        if (foto[0]){
            console.log("aqui?");

            reader.readAsDataURL(foto[0]);
            reader.onload = function () {
                img_base64 = reader.result.split(',')[1];
                console.log(img_base64);
                $http({
                    url: config.baseUrl + "/dash/update/admin",
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': config.token
                    },
                    data: {
                        'idadmin': admin.id,
                        'name': admin.name,
                        'email': admin.email,
                        'password': admin.senha,
                        'photo' : String(img_base64)
                    }
                }).success(function(data){
                    console.log(data);
                    $state.reload();
                }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + error;
                });
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        } else{
            console.log("ou aqui?");

            $http({
                url: config.baseUrl + "/dash/update/admin",
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': config.token
                },
                data: {
                    'idadmin': admin.id,
                    'name': admin.name,
                    'email': admin.email,
                    'password': admin.senha,
                    'photo': ""
                }
            }).success(function (data) {
                console.log(data);
                $state.reload();
            }).error(function (error) {
                $scope.message = "Aconteceu um problema: " + error;
            });
        }
    };
});


