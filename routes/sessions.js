var Bcrypt = require('bcrypt');

exports.register =  function(server, options, next){
  server.route([
    {
      //Creating a session / logging in 
      method: 'POST',
      path: '/sessions',
      handler: function(request, reply) {
        console.log("hi yang, im your server!");
        var db = request.server.plugins['hapi-mongodb'].db;
        var user = request.payload.user;

        db.collection('users').findOne({"username": user.username},function(err, userMongo) {
          if (err) { return reply ('Internal MongoDB error', err); }
          if (userMongo === null) {
            return reply({ "message": "User doesn't exist" });  
          }

          Bcrypt.compare(user.password, userMongo.password, function(err, match) {
            if (match) {
              function randomKeyGenerator() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
              }
 
              // Generate a random key
              var randomkey = (randomKeyGenerator() + randomKeyGenerator() + "-" + randomKeyGenerator() + "-4" + randomKeyGenerator().substr(0,3) + "-" + randomKeyGenerator() + "-" + randomKeyGenerator() + randomKeyGenerator() + randomKeyGenerator()).toLowerCase();
                            
              var newSession = {
                "session_id": randomKey,
                "user_id": userMongo._id
              };

              db.collection('sessions').insert(newSession, function(err, newResult){
                if (err) { return reply('Internal MongoDB error', err); }
                request.session.set('hapi_twitter_session', {
                  "session_key": randomKey,
                  "user_id": userMongo_id
              });

                return reply(writeResults);
              });

            } else {
              reply ({"message": "Not authorized"});
            }
          });


        });
      }
    },
    {
      method:'GET',
      path:'/authenticated',
      handler: function(request, reply) {
        var session = request.session.get('hapi_twitter_session');
        var db= request.server.plugins['hapi-mongo'].db;
        db.collection('sessions').findOne({"session_id": session.session_key }, function(err, result) {
          if (result === null) {
            return reply ({'message': "Unauthenticated"});
          } else {
            return reply({ 'message': "Authenticated"})
          }
        });
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'sessions-route',
  version: '0.0.1'
};