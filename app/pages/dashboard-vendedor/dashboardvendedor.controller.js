/**
 * Created by lgpbentes on 09/01/17.
 */
angular.module("teewa").controller("dashboardVendedorCtrl", function ($scope, $http, config, $state , sharedConn, Chats, ChatDetails) {
    $scope.app = "Dashboard Vendedor";
    $scope.chats = [];
    $scope.casos = [];
    $scope.qteChats = 0;
    $scope.qteCasos = 0;
    $scope.chatAtual = "";

    $scope.urlPhotos = config.baseUrl + "/photos/";
    $scope.urlFiles = config.baseUrl + "/case_images/";

    // id do erick
    $scope.idVendedor = '650';

    $scope.carregarCasosAbertos = function () {
        $http({

            url : config.baseUrl + "/sellers/"+ $scope.idVendedor +"/accepted/cases",
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            }
        }).success(function(data){
            $scope.chats = data.chats;
            $scope.qteChats = $scope.chats.length;

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
        });
    };

    $scope.carregarCasosNovos = function () {
        $http({
            url : config.baseUrl + "/sellers/news/cases",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                //id do teewa
                'idstore' : '1',
                //id do caio
                'idseller' :'652'
            }
        }).success(function(data){
            $scope.casos = data.cases;
            $scope.qteCasos = $scope.casos.length;

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + data;
        });
    };

    $scope.aceitarCaso = function (idcase) {
        // so fazer essa parada quando tiver contas de teste
        // rota: /cases/accept, metodo PUT, params: idseller, idcase, idstore
        console.log(idcase);
        //criar a sala, passar o id do chat para a tela de chat (?)
        $state.go("main.dashboardVendedor.casosAbertos");
    };

    $scope.recusarCaso = function (idcase) {
        // so fazer essa parada quando tiver contas de teste
        // rota: /cases/deny, metodo PUT, params: idseller, idcase, idstore
        console.log(idcase);
        //apenas recarregar a pagina
        $state.reload();
    };

    $scope.clickChat = function (nome) {
        $scope.chatAtual = nome;
    };


    $scope.carregarCasosAbertos();
    $scope.carregarCasosNovos();


    //realizando conversa

    var XMPP_DOMAIN = 'myserver'; // Servidor de conexão

    $scope.login = function(user) {
        sharedConn.login(config.user,XMPP_DOMAIN,config.password);
        $scope.chats = sharedConn.getRoster();
        $scope.hideTime = true;
        $scope.data = {};
        $scope.myId = sharedConn.getConnectObj().jid;
        $scope.messages = [];
        $scope.to_id = ChatDetails.getTo();
    };

    $scope.login(); //registra usuario porem ainda não está online

    $scope.logout = function() {
        console.log("T");
        sharedConn.logout();
        $state.go('login', {}, {
            location: "replace",
            reload: true
        });
    };

    $scope.remove = function(chat) {
        Chats.removeRoster(chat);
    };


    $scope.add = function(add_jid) {
        Chats.addNewRosterContact(add_jid);
    };

    // To automate login

    $scope.sendMsg = function(to, body) {
        console.log(to);
        var to_jid = Strophe.getBareJidFromJid(to);
        var timestamp = new Date().getTime();
        var reqChannelsItems = $msg({
            id: timestamp,
            to: to_jid,
            type: 'chat'
        })
            .c("body").t(body);
        sharedConn.getConnectObj().send(reqChannelsItems.tree());
    };

    $scope.showSendMessage = function() {

        $scope.sendMsg($scope.to_id, $scope.data.message);

        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

        $scope.messages.push({
            userId: $scope.myId,
            text: $scope.data.message,
            time: d
        });

        delete $scope.data.message;

    };

    $scope.messageRecieve = function(msg) {

        //  var to = msg.getAttribute('to');
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');

        var d = new Date();
        d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

        if (type == "chat" && elems.length > 0) {

            var body = elems[0];
            var textMsg = Strophe.getText(body);


            $scope.messages.push({
                userId: from,
                text: textMsg,
                time: d
            });


            $scope.$apply();

            console.log($scope.messages);
            console.log('Message recieved from ' + from + ': ' + textMsg);
        }

    };

    $scope.$on('msgRecievedBroadcast', function(event, data) {
        $scope.messageRecieve(data);
    })

});
