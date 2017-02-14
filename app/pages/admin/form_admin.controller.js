/**
 * Created by marcos on 01/12/16.
 */
angular.module("teewa").controller("form_adminCtrl", function ($scope, $http, config, $state) {
    if(localStorage.getItem('loginadmin') === ''){
        $state.go('main.login.indexadmin');
    }
    $scope.admins = [];
    $scope.admin = [];

    $scope.update = localStorage.getItem('adm_edit');
    $scope.admin.id = localStorage.getItem('adm_edit_id');
    $scope.admin.name = localStorage.getItem('adm_edit_name');
    $scope.admin.email = localStorage.getItem('adm_edit_email');

    $scope.carregarAdmins = function () {
        $http({
            url : config.baseUrl + "/dash/admins",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            }
        }).success(function(data){
            $scope.admins = data.admins;
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.adicionarAdmin = function (admin) {
        //console.log('nome:'+ admin.senha);
        foto = document.querySelector("#filename").files;
        var reader = new FileReader();
        console.log(foto);
        if (foto[0]){
            reader.readAsDataURL(foto[0]);
            reader.onload = function () {
                img_base64 = reader.result.split(',')[1];

                $http({
                    url : config.baseUrl + "/dash/register/admin",
                    method : 'post',
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization' : config.token
                    },
                    data: {
                        'name' : String(admin.name),
                        'email' : String(admin.email),
                        'password' : String(admin.senha),
                        'photo' : String(img_base64)
                    }
                }).success(function(data){
                    console.log(data);
                    $scope.carregarAdmins();
                    $state.go("main.admin.listar");
                }).error(function(error){
                    $scope.message = "Aconteceu um problema: " + error;
                });
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        } else{
            $http({
                url : config.baseUrl + "/dash/register/admin",
                method : 'post',
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization' : config.token
                },
                data: {
                    'name' : admin.name,
                    'email' : admin.email,
                    'password' : admin.senha,
                    'photo' : ""
                }
            }).success(function(data){
                console.log(data);
                $scope.carregarAdmins();
                $state.go("main.admin.listar");
            }).error(function(error){
                $scope.message = "Aconteceu um problema: " + error;
            });
        }
    };

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
                    $scope.carregarAdmins();
                    $state.go("main.admin.listar");
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
                $scope.carregarAdmins();
                $state.go("main.admin.listar");
            }).error(function (error) {
                $scope.message = "Aconteceu um problema: " + error;
            });
        }
    };

    $scope.apagarAdministrador = function (admin) {
        var apagar = confirm('Tem certeza que deseja excluir "'+admin.name+'" dos administradores do sistema?');
        if(apagar == true){
            $http({
                url : config.baseUrl + "/dash/remove/admin",
                method : 'put',
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization' : config.token
                },
                data: {
                    'idadmin': admin.id,
                }
            }).success(function(data){
                $scope.carregarAdmins();
                
            }).error(function(error){
                $scope.message = "Aconteceu um problema: " + error;
            });
        }

        $scope.submissionSuccess = "true";

    };

    $scope.isAdminSelecionado = function (admins) {
        return admins.some(function (admin) {
            return admin.selecionado;
        });
    };

    $scope.apagarAdministradores = function (admins) {
        var apagar = confirm('Tem certeza que deseja excluir os administradores selecionados?');
        if(apagar == true) {
            for (admin in admins) {
                if (admins[admin].selecionado == true) {
                    $http({
                        url: config.baseUrl + "/dash/remove/admin",
                        method: 'put',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': config.token
                        },
                        data: {
                            'idadmin': admins[admin].id,
                        }
                    }).success(function (data) {
                        $scope.carregarAdmins();
                    }).error(function (error) {
                        $scope.message = "Aconteceu um problema: " + error;
                    });
                }
            }
            alert('Os administradores serão excluidos em breve!')
        }

    };

    $scope.editAdministrador =  function (admin){
        $state.go('main.admin.new', {admin: admin}, {reload:false});
        localStorage.setItem('adm_edit', "true");
        localStorage.setItem('adm_edit_id', admin.id);
        localStorage.setItem('adm_edit_name', admin.name);
        localStorage.setItem('adm_edit_email', admin.email);
    };

    $scope.novoAdmin = function () {
        localStorage.setItem('adm_edit', "false");
        localStorage.setItem('adm_edit_id', "");
        localStorage.setItem('adm_edit_name', "");
        localStorage.setItem('adm_edit_email', "");
    };

    $scope.limparFormulario = function (admin) {
        delete $scope.admin;
    };

    $scope.ordenarPor = function (campo) {
        $scope.criterioDeOrdenacao = campo;
        $scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
    };


    $scope.carregarAdmins();

});


