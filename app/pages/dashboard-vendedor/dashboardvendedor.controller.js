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
    $scope.idVendedor = config.user;
    //id da loja chat-dashboard
    $scope.idstore = '118';

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
                'idstore' : $scope.idstore,

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
                'idstore' : $scope.idstore,
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
                'idstore' : $scope.idstore,
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

    $scope.denunciarCliente = function (idcliente, descricao, tipo) {
        $http({
            url : config.baseUrl + "/stores/complaint",
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODA2MjA2MjZ9.LL1jFE5Epo22h2usXTIEKySbUTGtSZlBpfWsQEL8nOk'
            },
            data: {
                'idstore' :  $scope.idstore,
                'idaccused' :  idcliente,
                'idwhistleblower' :  config.user,
                'description' :  descricao,
                'type' :  tipo
            }
        }).success(function(data){
            console.log(data);
            //encerra caso denunciado
            $scope.encerrarCaso($scope.chatAtual.id);

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
        $scope.sc();

    };
    $scope.flag = false;
    $scope.sc = function (){
        if($scope.flag == false) {
            $("#teste2").trigger('click');
            $scope.flag = true;
        }else{
            $scope.flag = false;
        }
        //move a barra de rolagem para a mensagem mais recente
        document.getElementById(
            "msg"
        ).scrollTop = document.getElementById(
            "msg"
        ).scrollHeight;
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

    // XEP-0066 - Envio de imagem
    // monta uma mensagem XML no formato abaixo
    /*<message from='stpeter@jabber.org/work' to='MaineBoy@jabber.org/home'>
         <body>Yeah, but do you have a license to Jabber?</body>
         <x xmlns='jabber:x:oob'>
            <url>http://www.jabber.org/images/psa-license.jpg</url>
         </x>
     </message>*/

    $scope.sendImg = function (to, message, image) {
        var messagetype = 'groupchat';
        var timestamp = new Date().getTime();
        var reply;
        reply = $msg({
            to: to,
            from: $scope.myId,
            type: messagetype,
            id: timestamp
        }).c("subject").t("imgFromSeller").up().c("body").t(message);

        reply.up().c("x", {
            xmlns: 'jabber:x:oob'
        //}).c('url').t("https://i.ytimg.com/vi/A8PPa41WUZY/hqdefault.jpg");
        }).c('url').t(image);

        sharedConn.getConnectObj().send(reply.tree());
        console.log('I sent image' + to + ': ' + message, reply.tree());
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
    $scope.notificacao = function(from){
        for(chat in $scope.chats){
           if (from.includes($scope.chats[chat].case.id)){
               console.log('nova mensagem de '+ $scope.chats[chat].case.id);
           }
        }
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
            if(from.includes('672')){
                $scope.messages.push({
                    userId: from,
                    text: textMsg,
                    time: d
                });
            }else{
                $scope.messages.push({
                        userId: from,
                        text: textMsg,
                        time: d
                });


                $scope.notificacao(from);
                $("#teste").trigger('click');
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
    });

});
