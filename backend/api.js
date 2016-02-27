var app = require('./express.js');

//
// API
//

// example GET api endpoint
app.get('/api/path/to/endpoint', function (req, res) {
	console.log("api was accessed!");
	res.json({api: true});
});

app.post('/api/users/register', function (req, res) {
	res.json({created: false, message:"Register not implemented"});
});

app.post('/api/users/login', function (req, res) {
	res.json({created: false, message:"Login not implemented"});
});

app.get('/api/users/profile', function (req, res) {
	res.json({profile: null, message:"Get profile not implemented"});
});

//Update a profile by id
app.put('/api/users/profile/:uid', function (req, res) {
	//uid is a var holding the profile id
	var profile_id = uid;
	res.json({updated: false, message:"Profile update not implemented"});
});
