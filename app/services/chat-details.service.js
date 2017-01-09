angular.module('teewa').factory('ChatDetails', ['sharedConn', '$rootScope', function(sharedConn, $rootScope) {
    ChatDetailsObj = {};

    ChatDetailsObj.setTo = function(to_id) {
        ChatDetailsObj.to = to_id;
    };
    ChatDetailsObj.getTo = function() {
        // return "luis32@chatme.community";//ChatDetailsObj.to;
        return "teewa02@myserver";
    };
    return ChatDetailsObj;
}]);