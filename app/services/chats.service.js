angular.module('teewa').factory('Chats', ['sharedConn', '$rootScope', '$state', function(sharedConn, $rootScope, $state) {

    ChatsObj = {};

    connection = sharedConn.getConnectObj();
    ChatsObj.roster = [];
    console.log(connection);
    loadRoster = function() {


        // configura o manipulador de presença e envia presença inicial
        connection.addHandler(
            //on recieve precence iq
            function(presence) {
                var presence_type = $(presence).attr('type'); // unavailable, subscribed, etc...
                   var from = $(presence).attr('from'); // the jabber_id of the contact
                   if (presence_type != 'error'){
                     if (presence_type === 'unavailable'){
                        console.log("offline"); //alert('offline');
                     }else{
                       var show = $(presence).find("show").text(); // this is what gives away, dnd, etc.
                       if (show === 'chat' || show === ''){
                         console.log("online"); //alert('online');
                       }else{
                         console.log("etc");//alert('etc');
                       }
                     }
                   }

                return true;
            }, null, "presence");

        connection.send($pres());

        connection.addHandler(
            //on recieve update roster iq
            function(iq) {

                console.log(iq);

                if (!iq || iq.length == 0)
                    return;

                // jquery carregar dados depois de carregar a página. Esta função atualiza dados após o carregamento de jQuery
                $rootScope.$apply(function() {

                    $(iq).find("item").each(function() {
                        // atualização de lista através do cliente 1 (ou seja, este cliente) aceitando solicitação
                        if ($(this).attr("subscription") == "from") {

                            ChatsObj.roster.push({
                                id: $(this).attr("jid"),
                                name: $(this).attr("name") || $(this).attr("jid"),
                                lastText: 'Available to Chat',
                                face: 'app/assets/images/users/no-image.jpg'
                            });
                        }
                        // Esperando que o Cliente 2 aceite o pedido
                        else if ($(this).attr("subscription") == "none" && $(this).attr("ask") == "subscribe") {

                            ChatsObj.roster.push({
                                id: $(this).attr("jid"),
                                name: $(this).attr("name") || $(this).attr("jid"),
                                lastText: 'Waiting to Accept',
                                face: 'app/assets/images/users/no-image.jpg'
                            });


                        }
                        // Atualização da lista através do Cliente 2 excluindo o contato da lista
                        else if ($(this).attr("subscription") == "none") {
                            console.log($(this).attr("jid"));
                            ChatsObj.removeRoster(ChatsObj.getRoster($(this).attr("jid")));
                        }

                    });
                    $state.go('tabsController.chats', {}, {
                        location: "replace",
                        reload: true
                    });

                });

            }

            , "jabber:iq:roster", "iq", "set");


        return ChatsObj.roster;

    }



    ChatsObj.allRoster = function() {
        loadRoster();
        return ChatsObj.roster;
    }


    ChatsObj.removeRoster = function(chat) {
        ChatsObj.roster.splice(ChatsObj.roster.indexOf(chat), 1);
    }

    ChatsObj.getRoster = function(chatId) {
        for (var i = 0; i < ChatsObj.roster.length; i++) {
            if (ChatsObj.roster[i].id == chatId) {
                return ChatsObj.roster[i];
            }
        }
    }

    ChatsObj.addNewRosterContact = function(to_id) {
        console.log(to_id);
        connection.send($pres({
            to: to_id,
            type: "subscribe"
        }));
    }

    return ChatsObj;


}])