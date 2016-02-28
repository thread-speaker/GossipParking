var app = require('./express.js');

const port = parseInt(process.env.PORT, 10) || 3000;
const localIP = require('my-local-ip')();
const serverState = require('./State').createEmptyServerState("http://"+localIP+":"+port+"/");

// setup body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post('/', function (req, res) {
	if (req.body && req.body.chatMessage) {
		var uid = req.body.uid;
		var user = req.body.user;
		var message = req.body.chatMessage;
		if (uid && user && message) {
			serverState.addUserChat(uid, user, message);
		}
	}
	
	if (req.body && req.body.url) {
		var url = req.body.url;
		serverState.connectTo(url);
	}
	
	res.redirect('/');
});