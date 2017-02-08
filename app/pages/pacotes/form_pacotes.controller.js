var teewamodule = angular.module('teewa');
angular.module("teewa").controller("formPacotesCtrl", function ($scope, $state, $stateParams, $filter) {
    if(localStorage.getItem('loginadmin') === '')
        $state.go('main.login.indexadmin');
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

    $scope.pacotes_aux = [];

     $scope.limparFormulario = function(pacote){

        $scope.funcSel = [];
        delete $scope.pacote;
        delete $scope.package;
        $scope.form.pacote.$setPristine();
     };

     $scope.novoPacote = function(pacote){
        pacote.funcionalidades = angular.copy($scope.funcSel);
        $scope.pacotes.push(angular.copy(pacote));
        $scope.limparFormulario(pacote);

        $state.go('main.pacotes.list');
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

    $scope.apagarPacotes = function (pacotes){
    var aux = [];
        for(var i = pacotes.length - 1; i >= 0; i--){
            if(!pacotes[i].selecionado){
               aux.push(angular.copy($scope.pacotes[i]));
            }
        }
        $scope.pacotes=  angular.copy(aux);
    };


     $scope.updatePacote = function (pacote){
          $state.go('main.pacotes.list');
      };

     $scope.atualizarPacote();

      $scope.submitForm = function() {

         // check to make sure the form is completely valid
         if ($scope.userForm.$valid) {
             alert('our form is amazing');
         }

     };

 })
 .directive('onlyDigits', function () {
       return {
         require: 'ngModel',
         restrict: 'A',
         link: function (scope, element, attr, ctrl) {
           function inputValue(val) {
             if (val) {
               var digits = val.replace(/[^0-9.]/g, '');

               if (digits.split('.').length > 2) {
                 digits = digits.substring(0, digits.length - 1);
               }

               if (digits !== val) {
                 ctrl.$setViewValue(digits);
                 ctrl.$render();
               }
               return parseFloat(digits);
             }
             return undefined;
           }
           ctrl.$parsers.push(inputValue);
         }
       };
    });
teewamodule.$inject = ['$scope'];


    teewamodule.directive('format', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) return;


                ctrl.$formatters.unshift(function (a) {
                    return $filter(attrs.format)(ctrl.$modelValue)
                });


                ctrl.$parsers.unshift(function (viewValue) {

              elem.priceFormat({
                prefix: '',
                centsSeparator: ',',
                thousandsSeparator: '.'
            });

                    return elem[0].value;
                });
            }
        };
    }]);

    (function($){$.fn.priceFormat=function(options){var defaults={prefix:'US$ ',suffix:'',centsSeparator:'.',thousandsSeparator:',',limit:false,centsLimit:2,clearPrefix:false,clearSufix:false,allowNegative:false,insertPlusSign:false};var options=$.extend(defaults,options);return this.each(function(){var obj=$(this);var is_number=/[0-9]/;var prefix=options.prefix;var suffix=options.suffix;var centsSeparator=options.centsSeparator;var thousandsSeparator=options.thousandsSeparator;var limit=options.limit;var centsLimit=options.centsLimit;var clearPrefix=options.clearPrefix;var clearSuffix=options.clearSuffix;var allowNegative=options.allowNegative;var insertPlusSign=options.insertPlusSign;if(insertPlusSign)allowNegative=true;function to_numbers(str){var formatted='';for(var i=0;i<(str.length);i++){char_=str.charAt(i);if(formatted.length==0&&char_==0)char_=false;if(char_&&char_.match(is_number)){if(limit){if(formatted.length<limit)formatted=formatted+char_}else{formatted=formatted+char_}}}return formatted}function fill_with_zeroes(str){while(str.length<(centsLimit+1))str='0'+str;return str}function price_format(str){var formatted=fill_with_zeroes(to_numbers(str));var thousandsFormatted='';var thousandsCount=0;if(centsLimit==0){centsSeparator="";centsVal=""}var centsVal=formatted.substr(formatted.length-centsLimit,centsLimit);var integerVal=formatted.substr(0,formatted.length-centsLimit);formatted=(centsLimit==0)?integerVal:integerVal+centsSeparator+centsVal;if(thousandsSeparator||$.trim(thousandsSeparator)!=""){for(var j=integerVal.length;j>0;j--){char_=integerVal.substr(j-1,1);thousandsCount++;if(thousandsCount%3==0)char_=thousandsSeparator+char_;thousandsFormatted=char_+thousandsFormatted}if(thousandsFormatted.substr(0,1)==thousandsSeparator)thousandsFormatted=thousandsFormatted.substring(1,thousandsFormatted.length);formatted=(centsLimit==0)?thousandsFormatted:thousandsFormatted+centsSeparator+centsVal}if(allowNegative&&(integerVal!=0||centsVal!=0)){if(str.indexOf('-')!=-1&&str.indexOf('+')<str.indexOf('-')){formatted='-'+formatted}else{if(!insertPlusSign)formatted=''+formatted;else formatted='+'+formatted}}if(prefix)formatted=prefix+formatted;if(suffix)formatted=formatted+suffix;return formatted}function key_check(e){var code=(e.keyCode?e.keyCode:e.which);var typed=String.fromCharCode(code);var functional=false;var str=obj.val();var newValue=price_format(str+typed);if((code>=48&&code<=57)||(code>=96&&code<=105))functional=true;if(code==8)functional=true;if(code==9)functional=true;if(code==13)functional=true;if(code==46)functional=true;if(code==37)functional=true;if(code==39)functional=true;if(allowNegative&&(code==189||code==109))functional=true;if(insertPlusSign&&(code==187||code==107))functional=true;if(!functional){e.preventDefault();e.stopPropagation();if(str!=newValue)obj.val(newValue)}}function price_it(){var str=obj.val();var price=price_format(str);if(str!=price)obj.val(price)}function add_prefix(){var val=obj.val();obj.val(prefix+val)}function add_suffix(){var val=obj.val();obj.val(val+suffix)}function clear_prefix(){if($.trim(prefix)!=''&&clearPrefix){var array=obj.val().split(prefix);obj.val(array[1])}}function clear_suffix(){if($.trim(suffix)!=''&&clearSuffix){var array=obj.val().split(suffix);obj.val(array[0])}}$(this).bind('keydown.price_format',key_check);$(this).bind('keyup.price_format',price_it);$(this).bind('focusout.price_format',price_it);if(clearPrefix){$(this).bind('focusout.price_format',function(){clear_prefix()});$(this).bind('focusin.price_format',function(){add_prefix()})}if(clearSuffix){$(this).bind('focusout.price_format',function(){clear_suffix()});$(this).bind('focusin.price_format',function(){add_suffix()})}if($(this).val().length>0){price_it();clear_prefix();clear_suffix()}})};$.fn.unpriceFormat=function(){return $(this).unbind(".price_format")};$.fn.unmask=function(){var field=$(this).val();var result="";for(var f in field){if(!isNaN(field[f])||field[f]=="-")result+=field[f]}return result}})(jQuery);
