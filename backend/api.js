var app = require('./express.js');
var request = require("request");

const port = parseInt(process.argv[2]) || 3000;
const localIP = require('my-local-ip')();
const serverState = require('./State').createEmptyServerState("http://"+localIP+":"+port+"/");

// setup body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post('/', function (req, res) {
	if (req.body) {
		if (req.body.Rumor) { //Incoming rumor
			var MessageID = req.body.MessageID;
			var Originator = req.body.Originator;
			var Text = req.body.Text;
			
			serverState.getRumor(MessageID,Originator,Text);
			serverState.connectTo(req.body.EndPoint);
			
			res.json({ok: true});
		}
		else if (req.body.Want) { //Incoming want
			//currently do nothing
		}
		else if (req.body.chatMessage) { //User typed a message
			var uid = req.body.uid;
			var user = req.body.user;
			var message = req.body.chatMessage;
			if (uid && user && message) {
				serverState.addUserChat(uid, user, message);
			}
			
			res.redirect('/');
		}
		else if (req.body.url) { //User connected a node
			var url = req.body.url;
			serverState.connectTo(url);
			
			res.redirect('/');
		}
	}
	else {
		res.redirect('/');
	}
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

function backgroundSendRumorThread() {
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
setInterval(backgroundSendRumorThread,1000);