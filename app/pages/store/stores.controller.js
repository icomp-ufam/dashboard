angular.module("teewa").controller("storesCtrl", function ($scope, $state, $http, config) {
    $scope.app = "Loja";
    $scope.stores;
    $scope.store ={"isDays":false, "is_max_radius":false, 'max_radius':10, "banner": '', "brand":''};

    $scope.categories = [];
    $scope.subCategories;
    $scope.idUser = '672';//localStorage.getItem('userID');//'672';


    $scope.diasSemana =[{"day": 0,"name":"Sunday", "openhour": "", "closehour":"", "nome":"Domingo"},
                        {"day": 1,"name":"Monday", "openhour": "", "closehour":"",  "nome":"Segunda"},
                        {"day": 2,"name":"Tuesday", "openhour": "", "closehour":"",  "nome":"Terça"},
                        {"day": 3,"name":"Wednesday", "openhour": "", "closehour":"",  "nome":"Quarta"},
                        {"day": 4,"name":"Thursday", "openhour": "", "closehour":"",  "nome":"Quinta"},
                        {"day": 5,"name":"Friday", "openhour": "", "closehour":"",  "nome":"Sexta"},
                        {"day": 6,"name":"Saturday", "openhour": "", "closehour":"",  "nome":"Sábado"}];

    $scope.work_days = [];
    $scope.diasSelecionado = function (func) {
        var idx = $scope.work_days.indexOf(func);
        if (idx > -1) {
            $scope.work_days.splice(idx,1);
        }
        else {
            $scope.work_days.push(func);
        }
    };

    $scope.isInList = function(func){
        var idx = $scope.work_days.indexOf(func);
        if (idx > -1) return true;
        else          return false;
    };

    $scope.clearDays = function(){
        $scope.work_days=[];
        angular.forEach($scope.diasSemana, function(dia, key) {
            dia.openhour="";
            dia.closehour="";
        });
    };

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

    $("document").ready(function(){
        $("#filebanner").change(function() {
            $scope.getImgBase('filebanner');
        });
        $("#filebrand").change(function() {
            $scope.getImgBase('filebrand');
        });

    });

    $scope.getImgBase = function(idFile){

        foto = document.querySelector("#"+idFile).files;
        var reader = new FileReader();

        if (foto[0]){
            reader.readAsDataURL(foto[0]);
            reader.onload = function () {
                img_base64 = String(reader.result.split(',')[1]);
                document.getElementById(idFile+"hidden").value = img_base64;
            };
        }
    }

    $scope.salvarLoja =  function(store){

        store.lng = document.getElementById('txtLongitude').value;
        store.lat = document.getElementById('txtLatitude').value;

       store.banner = document.getElementById("filebanner"+'hidden').value;
       store.brand  = document.getElementById("filebrand"+'hidden').value;

        if(store.isDays) store.is24=false;
        else             store.is24=true;

        console.log(store);

        $http({
            url : config.baseUrl + "sellers/create/withnewstore",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'iduser':$scope.idUser,
                'name':store.name,
                'cnpj':store.cnpj,
                'lat': store.lat,
                'lng': store.lng,
                'address': store.address,
                'zipcode':'',
                'is24' :  store.is24,
                'work_days' : $scope.work_days,
                'tzone': (new Date()).getTimezoneOffset(),
                'brand': store.brand,
                'banner': store.banner,
                'map_frame':store.brand,
                'subcategories':$scope.subcategories,
                'description':store.description,
                'phone':store.phone,
                'is_max_radius': store.is_max_radius,
                'max_radius': store.max_radius

            }
        }).success(function(data){
            console.log(data);
        }).error(function(error){
            console.log(error);
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.listarCategorias = function(){
        $http({
            url : config.baseUrl + "/categories/all",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            }
        }).success(function(data){
            $scope.categories = data;
            console.log(data);
        }).error(function(error){
            console.log(error);
        });
    };



    $scope.listarSubCategorias = function(id){
        $http({
            url : config.baseUrl + "/subcategories/"+id,
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data : {
                'id' : 1
            }
        }).success(function(data){
            console.log(data);
        }).error(function(error){
            console.log(error);
        });

    };

    $scope.listarCategorias();

    $scope.vincularLoja = function(loja){
        if(confirm("Você dejesa se tornar vendedor em "+loja.name+
        "? Ao clicar sim, sua solicitação será enviada para aprovação pelo administrador do estabelecimento")){

            $http({
                url : config.baseUrl + "/sellers/create/withexistingstore",
                method : 'post',
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization' : config.token
                },
                data : {'idstore':loja.id,
                        'id' : parseInt($scope.idUser)
                }
            }).success(function(data){
                alert('O cadastro realizado com sucesso. Aguarde a aprovação pelo Administrador do estabelecimento.');
            }).error(function(error){
                console.log(error);
            });
        }
    };

});