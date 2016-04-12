// setup server
var app = require('./backend/express.js');
var api = require('./backend/api');
var http = require('http');
var https = require('https');

const port = parseInt(process.argv[2]) || 3000;
const sport = parseInt(process.argv[3]) || 5001;

http.createServer(app).listen(port, function () {
	var host = this.address().address;
	var port = this.address().port;
	console.log("http listening on port " + port);  
});

const fs = require('fs');
const options = {
	key: fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./cert.pem')
}

https.createServer(options, app).listen(sport, function () {
	var host = this.address().address;
	var port = this.address().port;
	console.log("https listening on port " + sport);  
});
