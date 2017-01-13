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

    // id Larissa
    $scope.idVendedor = '672';

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
            console.log($scope.chats);
            sharedConn.joinChats($scope.chats);

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
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
                //id do chat-dashboard
                'idstore' : '118',

                'idseller' :$scope.idVendedor
            }
        }).success(function(data){
            $scope.casos = data.cases;
            $scope.qteCasos = $scope.casos.length;

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.aceitarCaso = function (idcase) {
        // rota: /cases/accept, metodo PUT, params: idseller, idcase, idstore
        $http({
            url : config.baseUrl + "/cases/accept",
            method : 'put',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                //id do chat-dashboard
                'idstore' : '118',
                'idseller' :$scope.idVendedor,
                'idcase' : idcase
            }
        }).success(function(data){
            $scope.chatAtual = data.chat;
            $state.go("main.dashboardVendedor.casosAbertos");

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });

    };

    $scope.recusarCaso = function (idcase) {
        // so fazer essa parada quando tiver contas de teste
        // rota: /cases/deny, metodo PUT, params: idseller, idcase, idstore
        $http({
            url : config.baseUrl + "/cases/deny",
            method : 'put',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                //id do chat-dashboard
                'idstore' : '118',
                'idseller' :$scope.idVendedor,
                'idcase' : idcase
            }
        }).success(function(data){
            // recarregar a página
            $state.reload();

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.encerrarCaso = function (idchat) {
        $http({
            url : config.baseUrl + "/chats/close",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'iduser' : $scope.idVendedor,
                'isseller' : 'true',
                'idschats' : "["+idchat+"]"
            }
        }).success(function(data){
            $scope.chatAtual = "";
            $state.reload();
        }).error(function(error){
            console.log(error);
            $scope.message = "Aconteceu um problema: " + error;
        });
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
        //$scope.to_id = "chat"+$scope.chatAtual.id+"@conference.myserver";
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

    $scope.sendMsg_old = function(to, body) {
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

    $scope.sendMsg = function (to, message) {
        var messagetype = 'groupchat';
        var timestamp = new Date().getTime();
        var reply;

        reply = $msg({
            to: to,
            from: $scope.myId,
            type: messagetype,
            id: timestamp
        }).c("body").t(message);

        sharedConn.getConnectObj().send(reply.tree());
        console.log('I sent ' + to + ': ' + message, reply.tree());

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

        if (type == "groupchat" && elems.length > 0) {

            var body = elems[0];
            var textMsg = Strophe.getText(body);


            $scope.messages.push({
                userId: from,
                text: textMsg,
                time: d
            });


            $scope.$apply();

            //console.log($scope.messages);
            //console.log('Message recieved from ' + from + ': ' + textMsg);
        }

    };

    $scope.$on('msgRecievedBroadcast', function(event, data) {
        $scope.messageRecieve(data);
    })

});
