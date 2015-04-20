module.exports = {};

module.exports.authenticated = function(request, callback) {
  //retrieve the session info from the browser
  var session = request.session.get('hapi_twitter_session');

  //Check if session exists
  if (!session) {
    return callback ({ 
      "message": "Logged out",
      "authenticated": false 
    });
    // return will terminate the rest of the program
  }

  var db= request.server.plugins['hapi-mongodb'].db;
  db.collection('sessions').findOne({"session_id": session.session_key }, function(err, result) {
    if (result === null) {
      return callback ({
        "message": "Logged out",
        "authenticated": false 
      });
    } else {
      return callback ({ 
        "message": "Logged in",
        "authenticated": true 
      });
    }
  });
};