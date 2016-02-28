var app = require('./express.js');

// setup body parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/', function (req, res) {
	if (req.body && req.body.chatMessage) {
		var user = req.body.user;
		var message = req.body.chatMessage;
		console.log("Save message for senging...");
	}
	
	if (req.body && req.body.url) {
		var url = req.body.url;
		console.log("Save node to send to...");
	}
	
	res.redirect('/');
});