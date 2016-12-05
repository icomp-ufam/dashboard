angular.module('teewa').factory('sharedConn', ['$state', '$rootScope', function( $state, $rootScope) {

    var SharedConnObj = {};

    SharedConnObj.BOSH_SERVICE = 'https://conversejs.org/http-bind/';
    SharedConnObj.connection = null; // The main Strophe connection object.
    SharedConnObj.loggedIn = false;
    SharedConnObj.roster = [];


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



    //--------------------------------------***END HELPER FUNCTIONS***----------------------------------------------------------

    //Login Function
    SharedConnObj.login = function(jid, host, pass) {
        SharedConnObj.connection = new Strophe.Connection(SharedConnObj.BOSH_SERVICE, {
            'keepalive': true
        }); // We initialize the Strophe connection.
        SharedConnObj.connection.connect(jid + '@' + host, pass, SharedConnObj.onConnect);
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

                //jquery load data after loading the page.This function updates data after jQuery loading
                $rootScope.$apply(function() {

                    $(iq).find("item").each(function() {

                        SharedConnObj.roster.push({
                            id: $(this).attr("jid"),
                            name: $(this).attr("name") || $(this).attr("jid"),
                            lastText: 'Available to Chat',
                            face: 'app/assets/images/users/no-image.jpg'
                        });

                    });

                });

            });
  
        }
    };


    //When a new message is recieved
    SharedConnObj.onMessage = function(msg) {
        $rootScope.$broadcast('msgRecievedBroadcast', msg);
        return true;
    };

    SharedConnObj.register = function(jid, pass, domain) {
        //to add register function
        SharedConnObj.connection = new Strophe.Connection("https://conversejs.org/http-bind/");

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
        console.log("reached");
        SharedConnObj.connection.options.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
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

    }

    return SharedConnObj;
}])