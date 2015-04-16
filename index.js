var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
	host:'0.0.0.0',
	port: process.env.PORT || 3000, //process.env.PORT: It's an environment variable prepared by Heroku Deployment. 
	routes: {cors: true}, // other domains can access my domain 
});

//This is where you include all your dependencies
var plugins = [	
  { register: require('./routes/users.js') },
  { register: require('./routes/sessions.js') },
  {
    register: require('hapi-mongodb'),
    options: {
      "url": "mongodb://127.0.0.1:27017/hapi-twitter",
      "settings": {
        "db": {
          "native_parser": false
        }
      }
    }
  },
  { 
    register: require('yar'),
    options: {
      cookieOptions: {
        password: 'password',
        isSecure: false //you can use it without https
      }
    }
  }
];

server.register(plugins, function(err) { 
	if (err) { throw err; } 

	server.start(function() {
		console.log( 'running server at' + server.info.uri );
	})
});
