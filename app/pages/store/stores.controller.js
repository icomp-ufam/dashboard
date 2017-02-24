angular.module("teewa").controller("storesCtrl", function ($filter, $scope, $state, $http, config) {
    if (localStorage.getItem('userID') === '')  $state.go('main.login.autenticacaoUser');


    $scope.app = "Loja";
    $scope.stores;
    $scope.isLoja = false;
    $scope.store ={"isDays":false, "is_max_radius":false, 'max_radius':10, "banner": '', "brand":''};

    $scope.urlImg = config.baseUrl + "/images/";

    $scope.categories = [];
    $scope.subCategories = [];
    $scope.idUser = localStorage.getItem('userID');
    $scope.idloja = localStorage.getItem('lojaID');

    $scope.subcat = [];

    $scope.diasSemana =[{"day": 0,"name":"Sunday", "openhour": "", "closehour":"", "nome":"Domingo"},
                        {"day": 1,"name":"Monday", "openhour": "", "closehour":"",  "nome":"Segunda"},
                        {"day": 2,"name":"Tuesday", "openhour": "", "closehour":"",  "nome":"Terça"},
                        {"day": 3,"name":"Wednesday", "openhour": "", "closehour":"",  "nome":"Quarta"},
                        {"day": 4,"name":"Thursday", "openhour": "", "closehour":"",  "nome":"Quinta"},
                        {"day": 5,"name":"Friday", "openhour": "", "closehour":"",  "nome":"Sexta"},
                        {"day": 6,"name":"Saturday", "openhour": "", "closehour":"",  "nome":"Sábado"}];

    $scope.work_days = [];


     $scope.editarLoja = function(){
        $scope.subcat = [];
        $http({
            url : config.baseUrl + "/stores/"+$scope.idloja,
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'id' : $scope.idloja,
            }
        }).success(function(data){
            $scope.store = data.store;

            $scope.diasSemana =[{"day": 0,"name":"Sunday", "openhour": $scope.store.start_sunday, "closehour":$scope.store.end_sunday, "nome":"Domingo"},
                                {"day": 1,"name":"Monday", "openhour": $scope.store.start_monday, "closehour":$scope.store.end_start_monday,  "nome":"Segunda"},
                                {"day": 2,"name":"Tuesday", "openhour": $scope.store.start_tuesday, "closehour":$scope.store.end_tuesday,  "nome":"Terça"},
                                {"day": 3,"name":"Wednesday", "openhour": $scope.store.start_wednesday, "closehour":$scope.store.end_wednesday,  "nome":"Quarta"},
                                {"day": 4,"name":"Thursday", "openhour": $scope.store.start_thursday, "closehour":$scope.store.end_thursday,  "nome":"Quinta"},
                                {"day": 5,"name":"Friday", "openhour": $scope.store.start_friday, "closehour":$scope.store.end_friday,  "nome":"Sexta"},
                                {"day": 6,"name":"Saturday", "openhour": $scope.store.start_saturday, "closehour":$scope.store.end_saturday,  "nome":"Sábado"}];

            $scope.store.max_radius = 10;
            console.log($scope.store);
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });


         $http({
                url : config.baseUrl + "/subcategories/"+$scope.idloja,
                method : 'get',
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization' : config.token
                },
                data: {
                    'id' : $scope.idloja,
                }
            }).success(function(data){
                console.log(data);
            }).error(function(error){
                $scope.message = "Aconteceu um problema: " + error;
            });



     };

    if($scope.idloja != '' && localStorage.getItem('loginV') != '') {
        $scope.editarLoja();
        $scope.isLoja = true;
    }



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
          //  console.log(data);
            $scope.stores = data;

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

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

    $scope.setarLoginV =  function(){
        $http({
            url : config.baseUrl + "/sellers",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            }
        }).success(function(data){

            angular.forEach( data.sellers, function(sell, key) {
                if(sell.id == $scope.idUser){
                    localStorage.setItem('loginV', sell.name);
                }
            });


        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    }

    $scope.salvarLoja =  function(store){
       html2canvas($("#mapa"), {
            useCORS: true,
            onrendered: function(canvas) {
                theCanvas = canvas;
                //document.body.appendChild(canvas);
               store.map_frame = (canvas.toDataURL()).slice(22);

                var aux_subCat = [];
                angular.forEach($scope.subcat, function(sub, k){
                    aux_subCat.push({"id": sub, "hasOption":false});
                });

                var aux_work_days = [];
                angular.forEach($scope.work_days, function(day, k){
                    aux_work_days.push({"day": day.day,"name": day.name, "openhour": day.openhour, "closehour":day.closehour});
                });

                store.lng = document.getElementById('txtLongitude').value;
                store.lat = document.getElementById('txtLatitude').value;

                store.banner = document.getElementById("filebanner"+'hidden').value;
                store.brand  = document.getElementById("filebrand"+'hidden').value;

                store.address = document.getElementById('txtEndereco').value;

                if(store.isDays) store.is24=false;
                else             store.is24=true;

                $http({
                    url : config.baseUrl + "/sellers/create/withnewstore",
                    method : 'post',
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization' : config.token
                    },
                    data: {
                        'iduser':$scope.idUser,
                        'name':String(store.name),
                        'cnpj':String(store.cnpj),
                        'lat': store.lat,
                        'lng': store.lng,
                        'address': String(store.address),
                        'zipcode':'',
                        'is24' :  store.is24,
                        'work_days' : JSON.stringify(aux_work_days),
                        'tzone': String((new Date()).getTimezoneOffset()),
                        'brand': store.brand,
                        'banner': store.banner,
                        'map_frame':store.map_frame,
                        'subcategories':JSON.stringify(aux_subCat),
                        'description':String(store.description),
                        'phone':String(store.phone),
                        'is_max_radius': store.is_max_radius,
                        'max_radius': store.is_max_radius ? parseInt(store.max_radius): -1
                    }

                }).success(function(data){
                    console.log(data);
                   // localStorage.setItem('loginV', user.name);
                     $scope.setarLoginV();
                     $state.go("main.dashboardVendedor.index");
                //   $state.go('main.dashboardVendedor.index');
                }).error(function(error){
                    console.log('error');
                    console.log(error);
                    $scope.message = "Aconteceu um problema: " + error;
                });
            }
       });

    };

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
                        'id' : $scope.idUser
                }
            }).success(function(data){
                alert('O cadastro realizado com sucesso. Aguarde a aprovação pelo Administrador do estabelecimento.');
                $state.go('main.login.index');
            }).error(function(error){
                console.log(error);
            });
        }
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
            $scope.categories = data.categories;
            angular.forEach( $scope.categories, function(cat, key) {
                $scope.listarSubCategorias(cat.id);
            });
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
                'id' : id
            }
        }).success(function(data){
            $scope.subCategories.push(data.category);
        }).error(function(error){
            console.log(error);
        });
    };


    $scope.addSubCat = function(idsub){
        var idx = $scope.subcat.indexOf(idsub);
        if (idx > -1) {
            $scope.subcat.splice(idx,1);
        }
        else {
             $scope.subcat.push(idsub);
        }
    };

    $scope.limparChecked = function(id){
         angular.forEach( $scope.subCategories, function(sub, key) {
            if(sub.id==id){
               angular.forEach(sub.subs, function(s, k){

                    var idx = $scope.subcat.indexOf(s.id);
                    if (idx > -1) {
                        $scope.subcat.splice(idx,1);
                    }
               });
            }

         });
    };


 $scope.atualizarLoja =  function(store){
       html2canvas($("#mapa"), {
            useCORS: true,
            onrendered: function(canvas) {
               theCanvas = canvas;
               store.map_frame = (canvas.toDataURL()).slice(22);

                var aux_subCat = [];
                angular.forEach($scope.subcat, function(sub, k){
                    aux_subCat.push({'id': 'sub', 'hasOption':'false'});
                });

                var aux_work_days = [];
                angular.forEach($scope.work_days, function(day, k){
                    aux_work_days.push({"day": day.day,"name": day.name, "openhour": day.openhour, "closehour":day.closehour});
                });


                store.lng = document.getElementById('txtLongitude').value;
                store.lat = document.getElementById('txtLatitude').value;

                store.banner = document.getElementById("filebanner"+'hidden').value;
                store.brand  = document.getElementById("filebrand"+'hidden').value;

                store.address = document.getElementById('txtEndereco').value;

                if(store.isDays) store.is24=false;
                else             store.is24=true;


                $http({
                    url : config.baseUrl + "/stores/update",
                    method : 'put',
                    headers : {
                        'Content-Type': 'application/json',
                        'Authorization' : config.token
                    },
                    data: {
                        'idstore':$scope.idloja ,
                        'iduser':$scope.idUser,
                        'name':String(store.name),
                        'cnpj':String(store.cnpj),
                        'lat': store.lat,
                        'lng': store.lng,
                        'address': String(store.address),
                        'zipcode':'',
                        'is24' :  store.is24,
                        'work_days' : JSON.stringify(aux_work_days),
                        'tzone': String((new Date()).getTimezoneOffset()),
                        'brand': store.brand,
                        'banner': store.banner,
                        'map_frame':store.map_frame,
                        'subcategories':JSON.stringify(aux_subCat),
                        'description':String(store.description),
                        'phone':String(store.phone),
                        'is_max_radius': store.is_max_radius,
                        'max_radius':  store.is_max_radius ? parseInt(store.max_radius): -1
                    }
                }).success(function(data){
                     $state.go("main.dashboardVendedor.index");
                    console.log(data);
                }).error(function(error){
                    console.log(error);
                    $scope.message = "Aconteceu um problema: " + error;
                });
            }
       });

    };


    $scope.stepsModel = []
    $scope.imageUpload = function (event ) {
        $scope.stepsModel = [];
        var files = event.target.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded;
            reader.readAsDataURL(file);
        }
    };$scope.imageIsLoaded = function (e) {
        $scope.$apply(function () {
            $scope.stepsModel.push(e.target.result);
        });
    };


    $scope.stepsModel2 = []
    $scope.imageUpload2 = function (event ) {
        $scope.stepsModel2 = [];
        var files = event.target.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.onload = $scope.imageIsLoaded2;
            reader.readAsDataURL(file);
        }
    };$scope.imageIsLoaded2 = function (e) {
        $scope.$apply(function () {
            $scope.stepsModel2.push(e.target.result);
        });
    };

    $scope.listarCategorias();
    $scope.listarLojas();


});