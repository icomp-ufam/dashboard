/**
 * Created by lgpbentes on 09/01/17.
 */
angular.module("teewa").controller("dashboardVendedorCtrl", function ($scope, $timeout, $rootScope, $http, config, $state , sharedConn, Chats, ChatDetails) {
    //console.log(localStorage.getItem('expired'));
    localStorage.setItem('expired', new Date().getTime());

    if(localStorage.getItem('loginV') === '')
        $state.go('main.login.index');
    $scope.app = "Dashboard Vendedor";
    $scope.chats = [];
    $scope.casos = [];
    $scope.qteChats = 0;
    $scope.qteCasos = 0;
    $scope.chatAtual = "carregando";

    $scope.urlPhotos = config.baseUrl + "/photos/";
    $scope.urlFiles = config.baseUrl + "/case_images/";
    $scope.urlChatImages = config.baseUrl + "/chat_images/";

    //flags
    $scope.precarregamento = true;
    $scope.carregando = false;
    $scope.loading = false;

    $scope.qteMsgsChats = [];
    $scope.composing = [];
    $scope.roster = [];

    var XMPP_DOMAIN = config.XMPP_DOMAIN;
    $scope.idVendedor = localStorage.getItem('userID');//'672';
    $scope.idstore =  localStorage.getItem('vendedor_idLoja'); //localStorage.getItem('lojaID');//'118';

    // imagem pra ser carregada nas mensagens do chat
    $scope.fotoVendedor = localStorage.getItem('vendedor_foto');

    /*casos_aceitos: "/accepted/cases",
     novos_casos: "/sellers/news/cases",
     aceitar_caso: "/cases/accept/xmpp",
     nao_tenho: "/cases/dont/have",
     recusar_caso: "/cases/deny",
     encerra_caso: "/chats/close",
     denunciar_cliente: "/stores/complaint",
     envio_de_imagem: "/chats/send/image"*/

    $scope.carregarCasosAbertos = function () {
        $http({

            url : config.baseUrl + "/sellers/"+ $scope.idVendedor + config.casos_aceitos,
            method : 'get',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            }
        }).success(function(data){
            $scope.chats = data.chats;
            if ($scope.chats.length > 0){
                //ao carregar pagina, abre primeiro chat da lista de casos
                $scope.chatAtual = $scope.chats[0];
            } else{
                $scope.chatAtual = "vazio";
            }
            //quantidade de casos abertos que é exibida no dashboard
            $scope.qteChats = $scope.chats.length;

            //configurando qual sala de chat esta sendo escutada
            ChatDetails.setTo("chat"+$scope.chatAtual.id+"@conference."+XMPP_DOMAIN);

            //atualiza id da sala de chat
            $scope.to_id = ChatDetails.getTo();
            $scope.initChats();
            $scope.addtime();
        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };


    $scope.joinChats = function(){
        sharedConn.joinChats($scope.chats);
    };

    $scope.carregarCasosNovos = function () {
        $http({
            url : config.baseUrl + config.novos_casos,
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
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
        $http({
            url : config.baseUrl + config.aceitar_caso,
            method : 'put',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
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
            ChatDetails.setTo("chat"+$scope.chatAtual.id+"@conference."+XMPP_DOMAIN);

            //atualiza id da sala de chat
            $scope.to_id = ChatDetails.getTo();

            //abre view de casos abertos
            $state.go("main.dashboardVendedor.casosAbertos");

        }).error(function(error){
            $scope.message = "Aconteceu um problema: " + error;
        });
    };

    $scope.naoTenho = function (idcase) {
        $http({
            url : config.baseUrl + config.nao_tenho,
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
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

    $scope.recusarCaso = function (idcase) {
        // so fazer essa parada quando tiver contas de teste
        // rota: /cases/deny, metodo PUT, params: idseller, idcase, idstore
        $http({
            url : config.baseUrl + config.recusar_caso,
            method : 'put',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
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
    
    $scope.deixarEstabelecimento = function (){
        var deixar = confirm('Tem certeza que deseja deixar o estabelecimento?');
        if (deixar == true){
            $http({
                url : config.baseUrl + config.remove_vendedor,
                method : 'put',
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization' : config.token
                },
                data: {
                    'idstore' : $scope.idstore,
                    'idseller' : $scope.idVendedor,
                    'notify' : 'true'
                }
            }).success(function(data){
                console.log(data);
                $scope.limparSessao();
                $state.go('main.login.index');
            }).error(function(error){
                console.log(error);
                $scope.message = "Aconteceu um problema: " + error;
            });

        }
    };

    $scope.limparSessao = function() {
        var sair = false;
        if(localStorage.getItem('vendedor') === 'true'){
            sair = true;
        }
        localStorage.setItem('vendedor', JSON.stringify(false));
        $scope.vendedor = JSON.parse(localStorage.getItem('vendedor'));
        localStorage.setItem('vendedor_foto', '');
        localStorage.setItem('vendedor_nome', '');
        localStorage.setItem('loginE', '');
        localStorage.setItem('lojaID', '');
        localStorage.setItem('lojaIDvendedor', '');
        //se estabelecimento
        localStorage.setItem('Estabelecimento', JSON.stringify(false));
        $scope.Estabelecimento = JSON.parse(localStorage.getItem('Estabelecimento'));

        localStorage.setItem('loginadmin', '');
        localStorage.setItem('loginV', '');
        localStorage.setItem('userID', '');

        console.log("desconectou!!");
        if(sair == true){
            sharedConn.logout();
            $state.go('main.login.index', {}, {
                location: "replace",
                reload: true
            });
        }else{
            $state.go('main.login.indexadmin', {}, {
                location: "replace",
                reload: true
            });
        }

    };

    $scope.encerrarCaso = function (idchat) {
        $http({
            url : config.baseUrl + config.encerra_caso,
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
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
            ChatDetails.setTo("chat"+$scope.chatAtual.id+"@conference."+XMPP_DOMAIN);

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
            url : config.baseUrl + config.denunciar_cliente,
            method : 'post',
            headers : {
                'Content-Type': 'application/json',
                'Authorization' : config.token
            },
            data: {
                'idstore' :  $scope.idstore,
                'idaccused' :  idcliente,
                'idwhistleblower' :   $scope.idVendedor,
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

    $scope.uploadFile = function (legenda) {

        // indica para a view que a imagem está sendo enviada
        $scope.loading = true;

        // pega o arquivo do input
        files = document.querySelector("#file-upload").files;

        // se não foi inserida uma legenda, envia o texto Imagem
        if (!legenda) {
            legenda = "Imagem";
        }

        // retorna o arquivo passado por parametro decodificado em base64
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = function () {
            // exclui o "data:image/png;base64," do retorno
            img_base64 =  reader.result.split(',')[1];

            // rota deve receber imagem em base64 para fazer upload para o servidor do teewa
            $http({
                url : config.baseUrl + config.envio_de_imagem,
                method : 'post',
                headers : {
                    'Content-Type': 'application/json',
                    'Authorization' : config.token
                },
                data: {
                    'image' : img_base64,
                    'id'    : $scope.idVendedor
                }
            }).success(function(data){
                //console.log(data);
                // depois de salvar a imagem no servidor, envia a mensagem com a url recebida
                $scope.sendImg($scope.to_id, legenda, data.image);

            }).error(function(error){
                console.log(error);
                $scope.message = "Aconteceu um problema: " + error;
            });

        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };

    //recebe informacoes da caixa de chat que foi selecionada
    $scope.clickChat = function (chat) {
        //recebe chat clicado
        $scope.chatAtual = chat;
        //configurando qual sala de chat esta sendo escutada
        ChatDetails.setTo("chat"+$scope.chatAtual.id+"@conference."+XMPP_DOMAIN);
        //atualiza id da sala de chat
        $scope.to_id = ChatDetails.getTo();

        document.getElementById(
            "msg"
        ).scrollTop = document.getElementById(
            "msg"
        ).scrollHeight;

        $scope.qteMsgsChats['chat'+$scope.chatAtual.id] = 0;
        //console.log($scope.qteMsgsChats);
        $scope.sc();
    };

    $scope.sc = function (){
        document.getElementById(
            "msg"
        ).scrollTop = document.getElementById(
            "msg"
        ).scrollHeight;
    };

    // carrega informacoes da mensagem com imagem no modal
    $scope.open_image_modal = function(src_img, text_img){
        document.querySelector("#image-big").src = src_img;
        if (text_img){
            document.querySelector("#text-image-big").innerHTML = text_img;
        } else{
            document.querySelector("#text-image-big").innerHTML = "Imagem";
        }
    };
    //move a barra de rolagem para a mensagem mais recente ao clicar sobre a conversa
    $scope.carregarCasosAbertos();
    $scope.carregarCasosNovos();

    $scope.login = function(user) {
        //localStorage.setItem('conectado', JSON.stringify(true));
        sharedConn.login($scope.idVendedor,XMPP_DOMAIN,config.password);
        $scope.chats = sharedConn.getRoster();
        $scope.hideTime = true;
        $scope.data = {};
        $scope.myId = sharedConn.getConnectObj().jid;

        $scope.messages = [];
        $scope.to_id = ChatDetails.getTo();

    };
    //if(localStorage.getItem('conectado') !== 'true')
    $scope.login();

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

        // concatena o endereco do servidor de imagens do teewa
        image = $scope.urlChatImages+image;

        // monta o xml da mensagem
        reply = $msg({
            to: to,
            from: $scope.myId,
            type: messagetype,
            id: 'dashboard'+$scope.chatAtual.id+timestamp
        }).c("body").t(message);

        reply.up().c("x", {
            xmlns: 'jabber:x:oob'
        }).c('url').t(image);

        reply.up().up().c("request", {
            xmlns: 'urn:xmpp:receipts'
        });

        // envia a mensagem
        sharedConn.getConnectObj().send(reply.tree());
        $scope.loading = false;
        document.querySelector("#close-upload-img").click();
        //console.log('I sent image' + to + ': ' + message, reply.tree());
    };

    // <request xmlns='urn:xmpp:receipts'/>
    $scope.sendMsg = function (to, message) {
        var messagetype = 'groupchat';
        var timestamp = new Date().getTime();
        var reply;
        reply = $msg({
            to: to,
            from: $scope.myId,
            type: messagetype,
            id: 'dashboard'+$scope.chatAtual.id+timestamp
        }).c("body").t(message);

        reply.up().c("request", {
            xmlns: 'urn:xmpp:receipts'
        });

        sharedConn.getConnectObj().send(reply.tree());
        //console.log('I sent ' + to + ': ' + message, reply.tree());
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

    //verifica de quem foi a última mensagem recebida
    $scope.remetente = 'desconhecido';
    $scope.fotoR = '';
    $scope.chatR = '';
    $scope.notificacao = function(from){
        for(chat in $scope.chats){
           if (from.includes($scope.chats[chat].id)){
               $scope.remetente = $scope.chats[chat].userTo.name;
               $scope.fotoR = $scope.urlPhotos + $scope.chats[chat].userTo.photo;
               $scope.chatR = $scope.chats[chat];
               break;
           }
        }
    };
    //verifica se há permissão e cria notificação
    $scope.notifyMe = function () {
        if (!("Notification" in window)) {
            alert("Seu navegador não suporta o serviço de notificações");
        }
        else if (Notification.permission === "granted") {
            var notification = new Notification($scope.remetente,{
                icon: $scope.fotoR,
                body: $scope.messages[$scope.messages.length - 1].text
            });
            notification.onclick = function () {
                $scope.clickChat($scope.chatR);
            }
        }
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    var notification = new Notification($scope.remetente,{
                        icon: $scope.fotoR,
                        body: $scope.messages[$scope.messages.length - 1].text
                    });
                    notification.onclick = function () {
                        $scope.clickChat($scope.chatR);
                    }
                }
            });
        }
    };
    //solicita permissão para exibir notificações
    Notification.requestPermission();
    function spawnNotification(corpo,icone,titulo) {
        var opcoes = {
            body: corpo,
            icon: icone
        };
        var n = new Notification(titulo,opcoes);
    }

    $scope.enviaConfirmacao = function (from, idMsg) {
        var messagetype = 'groupchat';
        var timestamp = new Date().getTime();
        var reply;
        reply = $msg({
            to: from.split('/')[0],
            from: $scope.myId,
            type: messagetype,
            id: 'dashboard'+$scope.chatAtual.id+timestamp
        });

        reply.c("received", {
            xmlns: 'urn:xmpp:receipts',
            id: idMsg
        });

        sharedConn.getConnectObj().send(reply.tree());
    };

    /*
    * <message
     from='kingrichard@royalty.england.lit/throne'
     id='bi29sg183b4v'
     to='northumberland@shakespeare.lit/westminster'>
     <received xmlns='urn:xmpp:receipts' id='richard2-4.1.247'/>
     </message>
    * */
    $scope.messageRecieve = function(msg) {
        //  var to = msg.getAttribute('to');
        var from = msg.getAttribute('from');
        var type = msg.getAttribute('type');
        var elems = msg.getElementsByTagName('body');
        var d = msg.getAttribute('id');

        //caso a mensagem contenha imagens
        var imagem = msg.getElementsByTagName('url');
        if (imagem.length > 0){
            imagem = imagem[0].textContent;
        } else {
            imagem = "";
        }

        // tratando o recebimento de mensagen e mandando confirmação de entrega
        var delivery_receipt = msg.getElementsByTagName('request');
        var delivery_ok = msg.getElementsByTagName('received');

        if (delivery_receipt.length > 0){
            $scope.enviaConfirmacao(from, d);

            if (type == "groupchat" && elems.length > 0) {

                var body = elems[0];
                var textMsg = Strophe.getText(body);

                //tratando a tag delay
                var time  = $(msg).find('delay').attr('stamp');
                if (!time) {
                    time = Date.now();
                }

                if(from.includes($scope.idVendedor)){
                    $scope.messages.push({
                        userId: from,
                        text: textMsg,
                        time: time,
                        image: imagem,
                        id: d,
                        received: false
                    });
                    //atualiza time em caso de envio de nova mensagem
                    $scope.msgtop(from, time);
                }else{
                    $scope.qteMsgsChats[from.split('@')[0]]++;
                    $scope.messages.push({
                            userId: from,
                            text: textMsg,
                            time: time,
                            image: imagem
                    });
                    $scope.precarregamento = true;
                    //passa os dados da ultima mensagem para a notificação.
                    $scope.notificacao(from);
                    //atualiza time caso ao receber nova mensagem
                    $scope.msgtop(from, time);
                    //chama notificação
                    $("#teste").trigger('click');
                }

                document.getElementById(
                    "msg"
                ).scrollTop = document.getElementById(
                    "msg"
                ).scrollHeight;
            }
        }

        // quando o cliente está na tela do chat
        var active = msg.getElementsByTagName('active')[0];
        if(active){
            //console.log(msg);
            $scope.roster[from.split('@')[0]] = "online";
        }

        // evento de digitando
        var composing = msg.getElementsByTagName('composing')[0];
        if (composing){
            //console.log(msg);
            $scope.composing[from.split('@')[0]] = true;
        }

        //evento de parou de digitar
        var paused = msg.getElementsByTagName('paused')[0];
        if(paused){
            //console.log(msg);
            $scope.composing[from.split('@')[0]] = false;
        }


        // tratando a confirmação de entrega (duplo check)
        if (delivery_ok.length > 0 && !from.includes($scope.idVendedor)){
            idMensagem = delivery_ok[0].id;
            $scope.findMsgById(idMensagem);
        }
        //Salva atividade do usuário
        //console.log(localStorage.getItem('expired'));
        localStorage.setItem('expired', new Date().getTime());

        $scope.$apply();
    };

    $scope.findMsgById = function (idMsg) {
        for (i = 0; i < $scope.messages.length; i++){
                if($scope.messages[i].id == idMsg){
                    $scope.messages[i].received = true;
                }
        }
    };

    $scope.$on('msgRecievedBroadcast', function(event, data) {
        $scope.messageRecieve(data);
    });

    $scope.$on('msgPresence', function(event, data) {
        //console.log(data);
        if(data.jid){
            jid = data.jid.split('@')[0];
            $scope.roster[jid] = data.pres;

            $scope.$apply();
        }
    });

    $scope.ponto = '.';
    //animação de ponto durante o carregamento
    $scope.animaPonto = function() {
        if( $scope.ponto == '...' ) {
            $scope.ponto = '.';
        } else {
            $scope.ponto += '.';
        }
        //enquanto não conectar, anima ponto
        if($rootScope.statusConexao != 'Conectado!')
            $timeout(function () {
                $scope.animaPonto();
            }, 300);
        //se conectar carrega chats
        else{
            $timeout.cancel();
            $scope.joinChats();
            $scope.precarregamento = false;
            //Exibe conectou! por 4 segundos
            $timeout(function() {
                $rootScope.statusConexao = '';
            }, 4000);
        }
    };
    $scope.animaPonto();

    $scope.initChats = function (){
        $scope.chats.forEach(function (value) {
            $scope.qteMsgsChats['chat'+value.id] = 0;
            $scope.composing['chat'+value.id] = false;
        });
    };

    //adiciona time a lista de casos
    $scope.addtime = function () {
        i = 0;
        for(chat in $scope.chats){
            $scope.chats[chat].time = new Date().getTime() - i;
            i++;
        }
    };
    //atualiza time de caso ao receber ou enviar nova mensagem
    $scope.msgtop = function (from, time) {
        for(chat in $scope.chats){
            if (from.includes($scope.chats[chat].id)){
                $scope.chats[chat].time =  new Date(time).getTime() ;
            }
        }
    };

    /*modelo
     <message xmlns="jabber:client" to="672@ip-172-31-47-155/web" id="yUei3-1292" type="groupchat">
        <composing xmlns="http://jabber.org/protocol/chatstates"/>
     </message>
     */
    $scope.sendComposing = function () {
        var timestamp = new Date().getTime();
        var msgComposing = $msg({
            xmlns: 'jabber:client',
            to:'chat'+$scope.chatAtual.id+'@conference.ip-172-31-47-155',
            id:$scope.chatAtual.id+"composing"+timestamp,
            type: "groupchat",
        }).c("composing", {xmlns: 'http://jabber.org/protocol/chatstates'});

        sharedConn.getConnectObj().send(msgComposing.tree());
    };

    /*modelo
     <message xmlns="jabber:client" to="672@ip-172-31-47-155/web" id="yUei3-1294" type="groupchat">
        <paused xmlns="http://jabber.org/protocol/chatstates"/>
     </message>
     */
    $scope.sendPaused = function () {
        var timestamp = new Date().getTime();
        var msgPaused = $msg({
            xmlns: 'jabber:client',
            to:'chat'+$scope.chatAtual.id+'@conference.ip-172-31-47-155',
            id:$scope.chatAtual.id+"paused"+timestamp,
            type: "groupchat",
        }).c("paused", {xmlns: 'http://jabber.org/protocol/chatstates'});

        sharedConn.getConnectObj().send(msgPaused.tree());
    };


    // digitando
    var textarea = $('#txtMsg');
    var lastTypedTime = new Date(0); // it's 01/01/1970
    var typingDelayMillis = 3000;
    var typingStatus = false;

    function refreshTypingStatus() {
        if (!textarea.is(':focus') || textarea.val() == '' || new Date().getTime() - lastTypedTime.getTime() > typingDelayMillis) {
            if (typingStatus == true){
                typingStatus = false;
                $scope.sendPaused();
            }

        } else {
            if (typingStatus == false){
                typingStatus = true;
                $scope.sendComposing();
            }
        }
    }
    function updateLastTypedTime() {
        lastTypedTime = new Date();
    }

    setInterval(refreshTypingStatus, 100);
    textarea.keypress(updateLastTypedTime);
    textarea.blur(refreshTypingStatus);

});
