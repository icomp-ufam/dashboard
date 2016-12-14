angular.module('teewa').factory('Chats', ['sharedConn', '$rootScope', '$state', function(sharedConn, $rootScope, $state) {

    ChatsObj = {};

    connection = sharedConn.getConnectObj();
    ChatsObj.roster = [];
    console.log(connection);
    loadRoster = function() {
        

        
        // set up presence handler and send initial presence
        connection.addHandler(
            //on recieve precence iq
            function(presence) {
                /*var presence_type = $(presence).attr('type'); // unavailable, subscribed, etc...
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
						   */
                return true;
            }, null, "presence");

        connection.send($pres());

        connection.addHandler(
            //on recieve update roster iq
            function(iq) {

                console.log(iq);

                if (!iq || iq.length == 0)
                    return;

                //jquery load data after loading the page.This function updates data after jQuery loading
                $rootScope.$apply(function() {

                    $(iq).find("item").each(function() {

                        //roster update via Client 1(ie this client) accepting request
                        if ($(this).attr("subscription") == "from") {

                            ChatsObj.roster.push({
                                id: $(this).attr("jid"),
                                name: $(this).attr("name") || $(this).attr("jid"),
                                lastText: 'Available to Chat',
                                face: 'app/assets/images/users/no-image.jpg'
                            });
                        }
                        // Waiting for the Client 2 to accept the request
                        else if ($(this).attr("subscription") == "none" && $(this).attr("ask") == "subscribe") {

                            ChatsObj.roster.push({
                                id: $(this).attr("jid"),
                                name: $(this).attr("name") || $(this).attr("jid"),
                                lastText: 'Waiting to Accept',
                                face: 'app/assets/images/users/no-image.jpg'
                            });


                        }

                        //roster update via Client 2 deleting the roster contact
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