angular.module('teewa').factory('sharedConn', ['$state', '$rootScope', 'config', function( $state, $rootScope, config) {

    var SharedConnObj = {};

    //SharedConnObj.BOSH_SERVICE = 'https://conversejs.org/http-bind/';
    //SharedConnObj.BOSH_SERVICE = 'http://localhost:7070/http-bind/';
    SharedConnObj.BOSH_SERVICE = 'http://api.teewa.com.br:7070/http-bind/';
    //SharedConnObj.BOSH_SERVICE = 'http://http://10.208.3.171:7070/http-bind/';
    SharedConnObj.connection = null; // The main Strophe connection object.
    SharedConnObj.loggedIn = false;
    SharedConnObj.roster = [];
    //verificando sessão ao recarragar
    $(window).unload(function() {
        if( SharedConnObj.connection != null ){
            SharedConnObj.rid = sessionStorage.getItem('rid');
            SharedConnObj.sid = sessionStorage.getItem('sid');
            SharedConnObj.jid = sessionStorage.getItem('jid');
        }else{
            sessionStorage.setItem('rid', null );
            sessionStorage.setItem('sid', null);
            sessionStorage.setItem('jid', null);
        }
    });

    console.log('rid '+SharedConnObj.rid +" sid "+SharedConnObj.sid+'jid '+ SharedConnObj.jid);

    //------------------------------------------HELPER FUNCTIONS---------------------------------------------------------------
    SharedConnObj.getConnectObj = function() {
        return SharedConnObj.connection;
    };

    SharedConnObj.getRoster = function() {
        return SharedConnObj.roster;
    };

    SharedConnObj.isLoggedIn = function() {
        return SharedConnObj.loggedIn;
    };

    SharedConnObj.getBareJid = function() {
        var str = SharedConnObj.connection.jid;
        str = str.substring(0, str.indexOf('/'));
        return str;
    };
    //------------------------------------------mantendo a conexão---------------------------------------------------------------


    //--------------------------------------***END mantendo a conexão***---------------------------------------------------------
    //funcao para entrar em todas as salas de chat do vendedor logado
    SharedConnObj.joinChats = function (chats) {
        for(i = 0; i < chats.length; i++){
            //SharedConnObj.connection.muc.join("chat"+chats[i].id+"@conference.myserver",config.user);
            SharedConnObj.connection.muc.join("chat"+chats[i].id+"@conference.ip-172-31-47-155",config.user);
        }

        console.log('consegui :)');

    };

    //--------------------------------------***END HELPER FUNCTIONS***----------------------------------------------------------

    //Login Function
    SharedConnObj.login = function(jid, host, pass) {
        SharedConnObj.connection = new Strophe.Connection(
            SharedConnObj.BOSH_SERVICE, {
                'keepalive': true
            }); // We initialize the Strophe connection.
        //Se já ouver uma conexão continua conectado, se não, inicia uma nova;
       if (SharedConnObj.rid != null || SharedConnObj.sid != null || SharedConnObj.jid != null) {
           //rid + 1 para seguir o fluxo de requisições
           SharedConnObj.connection.attach(SharedConnObj.jid, SharedConnObj.sid, (parseInt(SharedConnObj.rid) +1), null);
       } else {
           SharedConnObj.connection.connect(
               jid + '@' + host + "/web",
               pass,
               SharedConnObj.onConnect);
       }

    };

    //On connect XMPP
    SharedConnObj.onConnect = function(status) {
        if (status == Strophe.Status.CONNECTING) {
            console.log('Strophe is connecting.');
        } else if (status == Strophe.Status.CONNFAIL) {
            console.log('Strophe failed to connect.');
        } else if (status == Strophe.Status.DISCONNECTING) {
            console.log('Strophe is disconnecting.');
        } else if (status == Strophe.Status.DISCONNECTED) {
            console.log('Strophe is disconnected.');
        } else if (status == Strophe.Status.CONNECTED) {

            SharedConnObj.connection.addHandler(SharedConnObj.onMessage, null, 'message', null, null, null);
            SharedConnObj.connection.send($pres().tree());
            SharedConnObj.loggedIn = true;

            SharedConnObj.connection.addHandler(SharedConnObj.on_subscription_request, null, "presence", "subscribe");

            console.log('Conectou!');

            var iq = $iq({
            type: 'get'
        }).c('query', {
            xmlns: 'jabber:iq:roster'
        });
            SharedConnObj.connection.sendIQ(iq,
            //On recieve roster iq
            function(iq) {

                console.log(iq);

                if (!iq || iq.length == 0)
                    return;
                // jquery carregar dados depois de carregar a página. Esta função atualiza dados após o carregamento de jQuery
                $rootScope.$apply(function() {

                    $(iq).find("item").each(function() {

                        SharedConnObj.roster.push({
                            id: $(this).attr("jid"),
                            name: $(this).attr("name") || $(this).attr("jid"),
                            lastText: 'Available to Chat',
                            face: 'app/assets/images/users/no-image.jpg'

                        });
                        console.log("roster "+SharedConnObj.roster);

                    });

                });

            });
            //guardando parametros da conexão atual
            SharedConnObj.connection.xmlOutput = function (status) {
                RID = $(status).attr('rid');
                SID = $(status).attr('sid');
                JID = SharedConnObj.connection.jid;
                sessionStorage.setItem('rid', RID);
                sessionStorage.setItem('sid', SID);
                sessionStorage.setItem('jid', JID);
                console.log(' XMLOUTPUT INFO - OUTGOING RID=' + RID + ' [SID=' + SID + '] [JID ='+JID+']');
                //log(' XMLOUTPUT INFO - OUTGOING XML = \n'+e.outerHTML);
                //set some variables to keep track of our rid and sid
            };

        }
    };


    //When a new message is recieved
    SharedConnObj.onMessage = function(msg) {
        //console.log(msg);
        $rootScope.$broadcast('msgRecievedBroadcast', msg);
        return true;
    };

    SharedConnObj.register = function(jid, pass, domain) {
        //to add register function
        SharedConnObj.connection = new Strophe.Connection(SharedConnObj.BOSH_SERVICE);

        var callback = function(status) {
            if (status === Strophe.Status.REGISTER) {
                // fill out the fields
                SharedConnObj.connection.register.fields.username = jid;
                SharedConnObj.connection.register.fields.password = pass;
                // calling submit will continue the registration process
                SharedConnObj.connection.register.submit();
            } else if (status === Strophe.Status.REGISTERED) {
                console.log("registered!");
                // calling login will authenticate the registered JID.
                SharedConnObj.connection.authenticate();
            } else if (status === Strophe.Status.CONFLICT) {
                console.log("Contact already existed!");
            } else if (status === Strophe.Status.NOTACCEPTABLE) {
                console.log("Registration form not properly filled out.")
            } else if (status === Strophe.Status.REGIFAIL) {
                console.log("The Server does not support In-Band Registration")
            } else if (status === Strophe.Status.CONNECTED) {
                // do something after successful authentication
                $state.go('tabsController.chats', {}, {
                    location: "replace",
                    reload: true
                });
            } else {
                // Do other stuff
            }
        };

        SharedConnObj.connection.register.connect(domain, callback, 60, 1);
    };

    SharedConnObj.logout = function() {
        //limpando sessão da conexão conectados
        sessionStorage.setItem('rid', null );
        sessionStorage.setItem('sid', null);
        sessionStorage.setItem('jid', null);
        console.log("reached");
        SharedConnObj.connection.options.sync = true;// Alternar para usar solicitações síncronas, uma vez que isso normalmente é chamado onUnload.
        SharedConnObj.connection.flush();
        SharedConnObj.connection.disconnect();
    };

    //Helper Function------------------------------
    var accepted_map = {}; //store all the accpeted jid
    function is_element_map(jid) {
        if (jid in accepted_map) {
            return true;
        } else {
            return false;
        }
    }

    function push_map(jid) {
        accepted_map[jid] = true;
    }
    //--------------------------------------------


    SharedConnObj.on_subscription_request = function(stanza) {

        console.log(stanza);

        if (stanza.getAttribute("type") == "subscribe" && !is_element_map(stanza.getAttribute("from"))) {

            //the friend request is recieved from Client 2
            /*var confirmPopup = $ionicPopup.confirm({
                title: 'Confirm Friend Request!',
                template: ' ' + stanza.getAttribute("from") + ' wants to be your freind'
            });*/

            /*confirmPopup.then(function(res) {
                if (res) {
                    SharedConnObj.connection.send($pres({
                        to: stanza.getAttribute("from"),
                        type: "subscribed"
                    }));

                    push_map(stanza.getAttribute("from")); //helper
                } else {
                    SharedConnObj.connection.send($pres({
                        to: stanza.getAttribute("from"),
                        type: "unsubscribed"
                    }));
                }
            });*/

            return true;
        }

    };

    return SharedConnObj;
}]);