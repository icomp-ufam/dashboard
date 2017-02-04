angular.module("teewa").controller("formPacotesCtrl", function ($scope, $state, $stateParams, $filter) {
	$scope.state = $state;
	$scope.count=0;

	$scope.package=[];

    $scope.pacotes = [
                    {"id":2, "nome":"tatat", "preco":66, 'vendedores':3, funcionalidades:["Acesso ao Chat","Alterar foto de vendedores"]},
                    {"id":3, "nome":"nanan", "preco":77, 'vendedores':5, funcionalidades:["Acesso ao Chat"]},
                    {"id":4, "nome":"papap", "preco":88, 'vendedores':6, funcionalidades:["Média de Atendimentos","Ratin"]},
                    {"id":5, "nome":"kakak", "preco":99, 'vendedores':2, funcionalidades:["Email ilimitado"]}

    ];

    $scope.funcionalidades = ["Acesso ao Chat","Alterar foto de vendedores","Denúncias","Média de Atendimentos","Ratin", "Email ilimitado"];

    $scope.funcSel = [];

     $scope.limparFormulario = function(pacote){
        $scope.funcSel = [];
        delete $scope.pacote;
     };

     $scope.novoPacote = function(pacote){
        pacote.funcionalidades = angular.copy($scope.funcSel);
        $scope.pacotes.push(angular.copy(pacote));

        $scope.limparFormulario();
        $scope.form.contato={};
     };

     $scope.funcSelecionado = function (func) {
           var idx = $scope.funcSel.indexOf(func);
           if (idx > -1) {
           $scope.funcSel.splice(idx, 1);
       }
       else {
          $scope.funcSel.push(func);
       }
     };

      $scope.atualizarPacote = function () {
          if($stateParams.id){
             for(var i = 0; i < $scope.pacotes.length; i++) {
                if($scope.pacotes[i].id == $stateParams.id) {
                    $scope.package = $scope.pacotes[i];
                    $scope.funcSel = $scope.pacotes[i].funcionalidades;
                    break;
                }
             }
          }else{
            $scope.funcSel = [];
          }
      };

     $scope.deletarPacote = function (pacoteId){
         if (confirm("Você Tem Certeza?")) {
            for(var i = 0; i < $scope.pacotes.length; i++) {
                if($scope.pacotes[i].id == pacoteId) {
                    $scope.pacotes.splice(i, 1);
                    break;
                }
            }
         }
     };

     $scope.updatePacote = function (pacote){
          if (confirm("Você Tem Certeza?")) {
            $scope.funcSel = [];
          }
      };

     $scope.atualizarPacote();

 });
