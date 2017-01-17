angular.module('teewa').factory('ChatDetails', ['sharedConn', '$rootScope', function(sharedConn, $rootScope) {
    ChatDetailsObj = {};

    ChatDetailsObj.setTo = function(to_id) {
        ChatDetailsObj.to = to_id;
    };
    ChatDetailsObj.getTo = function() {
        //return "chat1096@conference.myserver";
        return ChatDetailsObj.to;
    };
    return ChatDetailsObj;
}]);