// setup server
var app = require('./backend/express.js');
var api = require('./backend/api');
var argv = require('minimist')(process.argv.slice(2));
var http = require('http');
var https = require('https');

const port = parseInt(argv.p) || 3000; //p is unsecure port
const sport = parseInt(argv.s) || 5001; //s is secure port

http.createServer(app).listen(port, function () {
	var host = this.address().address;
	var port = this.address().port;
});

const fs = require('fs');
const options = {
	key: fs.readFileSync('./key.pem'),
	cert: fs.readFileSync('./cert.pem')
}

https.createServer(options, app).listen(sport, function () {
	var host = this.address().address;
	var port = this.address().port;
});
