angular.module('teewa').controller('chatCtrl', function($scope, $state, sharedConn, Chats, ChatDetails) {

    /*$scope.goToLogin = function() {
        $state.go('login', {}, {
            location: "replace",
            reload: true
        });
    }*/

    /*$scope.chatDetails = function(to_id) {
        ChatDetailsObj.setTo(to_id);
        $state.go('tabsController.chatDetails', {}, {
            location: "replace",
            reload: true
        });
    };*/

    /*$scope.goToRegister = function() {
        $state.go('register', {}, {
            location: "replace",
            reload: true
        });
    }
	
	$scope.reg = function(r) {
        r.domain = "jabberpl.org";
        sharedConn.register(r.jid, r.pass, r.domain);
    }

    */

    // var XMPP_DOMAIN = 'chatme.community'; // Domain we are going to be connected to.

    // $scope.login = function(user) {
    //     sharedConn.login(user.jid, XMPP_DOMAIN, user.pass);
    // }
    // sharedConn.login("leo32",XMPP_DOMAIN,"pandora561500");

    //var XMPP_DOMAIN = 'chatme.community'; // Domain we are going to be connected to.
    var XMPP_DOMAIN = 'myserver'; // vai conectar aqui!
    
    $scope.login = function(user) {
        sharedConn.login("teewa01",XMPP_DOMAIN,"12345678");
        $scope.chats = sharedConn.getRoster();
        $scope.hideTime = true;
        $scope.data = {};
        $scope.myId = sharedConn.getConnectObj().jid;
        $scope.messages = [];
        $scope.to_id = ChatDetails.getTo();
    };
    
    $scope.login();

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
