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

            //quantidade de casos abertos que é exibida no dashboard
            $scope.qteChats = $scope.chats.length;

            //ao carregar pagina, abre primeiro chat da lista de casos
            $scope.chatAtual = $scope.chats[0];
            console.log($scope.chats);

            //configurando qual sala de chat esta sendo escutada
            ChatDetails.setTo("chat"+$scope.chatAtual.id+"@conference.myserver");

            //atualiza id da sala de chat
            $scope.to_id = ChatDetails.getTo();

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.joinChats = function(){
        sharedConn.joinChats($scope.chats);
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
            //carrega informacoes do chat aceito
            $scope.chatAtual = data.chat;

            //configurando qual sala de chat esta sendo escutada
            ChatDetails.setTo("chat"+$scope.chatAtual.id+"@conference.myserver");

            //atualiza id da sala de chat
            $scope.to_id = ChatDetails.getTo();

            //abre view de casos abertos
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
            //ao carregar pagina, abre primeiro chat da lista de casos
            $scope.chatAtual = $scope.chats[0];

            //configurando qual sala de chat esta sendo escutada
            ChatDetails.setTo("chat"+$scope.chatAtual.id+"@conference.myserver");

            //atualiza id da sala de chat
            $scope.to_id = ChatDetails.getTo();

            //recarrega página
            $state.reload();
        }).error(function(error){
            console.log(error);
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    //recebe informacoes da caixa de chat que foi selecionada
    $scope.clickChat = function (chat) {
        console.log(chat);
        //recebe chat clicado
        $scope.chatAtual = chat;
        //configurando qual sala de chat esta sendo escutada
        ChatDetails.setTo("chat"+$scope.chatAtual.id+"@conference.myserver");
        //atualiza id da sala de chat
        $scope.to_id = ChatDetails.getTo();
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
        console.log("desconectou!!");
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
            time: d,
            status: 0
        });

        delete $scope.data.message;

    };

    $scope.messageRecieve = function(msg) {

        //  var to = msg.getAttribute('to');
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');

        //var d = new Date();
        //d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
        var d = msg.getAttribute('id');

        if (type == "groupchat" && elems.length > 0) {

            var body = elems[0];
            var textMsg = Strophe.getText(body);

            if(from.includes('671')){
                $scope.messages[$scope.messages.length - 1].status = 1;
            }else {
                $scope.messages.push({
                    userId: from,
                    text: textMsg,
                    time: d,
                    status: 1
                });
            }

            $scope.$apply();
            document.getElementById(
                "msg"
            ).scrollTop = document.getElementById(
                "msg"
            ).scrollHeight;
        }

    };

    $scope.$on('msgRecievedBroadcast', function(event, data) {
        $scope.messageRecieve(data);
    })

});
