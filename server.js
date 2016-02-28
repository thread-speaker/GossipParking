// setup server
var app = require('./backend/express.js');
var api = require('./backend/api');
const port = parseInt(process.argv[2]) || 3000;

// start the server
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
});
