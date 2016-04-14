var app = require('./express.js');
var request = require("request");
var argv = require('minimist')(process.argv.slice(2));
var TwitterBot = require("node-twitterbot").TwitterBot;

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var fs = require('fs');
debugger;

var config;
try{
	config = JSON.parse(fs.readFileSync(argv.c, 'utf8'));
}
catch (e) {
	config = null;
}

runServer(config);

function runServer(conf) {
	if(!conf) {
		console.log("Config file invalid, using defualt configuration");
		config = {
			location: "800n500eProvo",
			capacity: 100,
			consKey: "yGzqNWxj8ztyBQH8GNGrytCmZ",
			consSecret: "DDMEINP3IeKhD0WMoeIJA21LzqW2JHO1DqTwS5f2hSKAbD3AOj",
			accessKey: "719635905661812736-o91JKSQXFzWKQJYp30OEjcsARweRW44",
			accessSecret: "MiMJbRVl2tx3Poo2NNwcXAPI85TpIiIEpHtnBoXPCCEq9"
		}; 
	}
	
	var location = config.location;
	var capacity = config.capacity;
	var consKey = config.consKey;
	var consSecret = config.consSecret;
	var accessKey = config.accessKey;
	var accessSecret = config.accessSecret;

	debugger;
	var Bot = new TwitterBot({
		"consumer_secret": consSecret,
		"consumer_key": consKey,
		"access_token": accessKey,
		"access_token_secret": accessSecret
	});

	//Bot.tweet("I'm on the interwebs!");

	const port = parseInt(process.argv[2]) || 3000;
	const localIP = require('my-local-ip')();
	debugger;
	const serverState = require('./State').createEmptyServerState("http://"+localIP+":"+port+"/", Bot, location, capacity);
	var requestType = 0;

	// setup body parser
	var bodyParser = require('body-parser');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.post('/car/entered', function(req, res) {
		serverState.addCar();
		
		updateState();
		res.json({ok: true});
	});

	app.post('/car/exited', function(req, res) {
		serverState.removeCar();
		
		updateState();
		res.json({ok: true});
	});

	app.post('/', function (req, res) {
		if (req.body) {
			if (req.body.url) { //User connected a node
				var url = req.body.url;
				if (url.toLowerCase().indexOf("http") == 0) {
					serverState.connectTo(url);
				}
			}
		}
		res.redirect('/');
	});

	app.get('/rumors', function (req, res) {
		var result = {};
		serverState.rumors.forEach(function(rumor) {
			result[rumor.getOriginator()] = result[rumor.getOriginator()] || [];
			result[rumor.getOriginator()].push(rumor);
		});
		
		var stringResult = "";
		for (var key in result) {
			// skip loop if the property is from prototype
			if (!result.hasOwnProperty(key)) continue;
			
			stringResult += "<h3>" + key + "</h3>";
			result[key].forEach(function(rumor) {
				stringResult += "<p>" + rumor.getText() + "</p>";
			});
		}
		
		res.send(stringResult);
	});

	function updateState() {
		var uid = serverState.getLocation();
		var user = serverState.getLocation();
		var message = serverState.getAvailibility();
		if (uid && user && message) {
			serverState.updateRumor(uid, user, message);
		}
	}

	function maybeTweet() {
		serverState.updateStatus();
	}
	setInterval(maybeTweet, 10000);

	function backgroundThread() {
		sendRumor();
	}
	setInterval(backgroundThread,1000);

	function sendRumor() {
		const sendableRumor = serverState.findSendableRumor();
		if ( sendableRumor ) {
			request(
				{
					uri: sendableRumor.getTarget(),
					method: "POST",
					form: sendableRumor.format(),
				},
				function(error, response, body) {
					if (!error) {
						serverState.mark(sendableRumor.getRumorIndex(), sendableRumor.getTarget());
					}
				}
			);
		}
	}
	
}



/* ------------------ DEPRECATED --------------------- */


/* 	app.get('/base64Token', function(req, res) {
	res.send(serverState.getBase64Token());
});

app.post('/connectTwitter', function(req, res) {
	if(req.body)
		serverState.setInfo(req.body);

	var url = "https://api.twitter.com/oauth2/token";
	var type = "POST";
	var contentType = "application/x-www-form-urlencoded;charset=UTF-8";
	var base64Token = serverState.getBase64Token();	
	var authorization = "Basic " + base64Token;
	var oauthData = {grant_type: "client_credentials"};

	request(
		{
			uri: url,
			method: type,
			headers: {
				'Authorization' : authorization,
				'Content-Type' : contentType
			},
			form: oauthData,
		},
		function(error, response, body) {
			if (!error) {
				serverState.setAccessToken(JSON.parse(body).access_token);
				res.json({ok: true});
			}
			else {
				console.log(response);
				res.json({ok: false});
			}
		}
	);
});
*/

