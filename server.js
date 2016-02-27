// setup server
var app = require('./backend/express.js');
var api = require('./backend/api');

// start the server
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
});
