const Rumor = require('./Rumor');
const SendableRumor = require('./SendableRumor');

exports.createEmptyServerState = function(endpoint, Bot, location, capacity) {
	return new ServerState(endpoint, Bot, location, capacity);
};

function ServerState(endpoint, Bot, location, capacity) {
	debugger;
	this.rumors = [];
	this.myEndpoint = endpoint;
	this.otherEndpoints = [];
	this.neighbors = [];
	this.location = location,
	this.capacity = capacity,
	this.lastAvailability = capacity
	
	this.cars = 0;
	this.Bot = Bot;
	
	this.myRumor = new Rumor.make(location,0,location,capacity,endpoint);
}

ServerState.prototype.connectTo = function(otherEndpoint) {
	var hasTarget = false;
	for (i=0;i<this.otherEndpoints.length;i++) {
		if (this.otherEndpoints[i]===otherEndpoint) {
			hasTarget = true;
			break;
		}
	}
	
	if (!hasTarget) {
		this.otherEndpoints.push(otherEndpoint);
	}
};

ServerState.prototype.getCars = function () {
	return this.cars;
};

ServerState.prototype.addCar = function () {
	console.log("Car entered");
	this.cars++;
};

ServerState.prototype.removeCar = function () {
	console.log("Car exited");
	this.cars--;
};

ServerState.prototype.getAvailibility = function () {
	return this.capacity - this.cars;
}

ServerState.prototype.getLocation = function () {
	return this.location;
}

ServerState.prototype.getCapacity = function() {
	return this.capacity;
}

ServerState.prototype.updateStatus = function () {
	const availibility = this.capacity - this.cars;
	const last = this.lastAvailability;

	if (availibility < last - 5
		|| availibility > last + 5
		|| (availibility < 1 && last > 0)
		|| (availibility > 0 && last < 1)) {
		
		console.log("\nTweet tweeted\n");
		this.lastAvailability = availibility;
			
		//Send a tweet
		if (availibility < 1) {
			var nearest = this.getNearestVacancy();
			if(nearest)
				this.Bot.tweet("I'm full! Check @" + nearest + ", it has some open spaces.");
			else
				this.Bot.tweet("I'm full! Every lot near here seems to be full as well.");
		}
		else {
			this.Bot.tweet("I have " + availibility + " spots left.");
		}
	}
}

ServerState.prototype.getNearestVacancy = function() {
	for(var i = 0; i < this.neighbors.length; i++){
		if(this.neighbors[i].vacancies > 0){
			return this.neighbors[i].location;
		}
	}
	return null;
}

ServerState.prototype.mark = function(index, target) {
	this.myRumor.sentTo(target);
};

/* ServerState.prototype.unmark = function(id, number, target) {
	var rumor = this.myRumor;
	if (rumor.getUserId() === id && parseInt(rumor.getNumber()) > number) {
		rumor.unmark(target);
	}
}; */

ServerState.prototype.updateRumor = function(id, username, text) {
	const cap = "" + this.getCapacity();
	this.myRumor = new Rumor.make(this.location,0,this.location,cap,this.myEndpoint);
};

ServerState.prototype.getRumor = function(rumorId, user, text) {
	//Make sure things parse correctly before doing anything
	if (rumorId) {
		var id = rumorId.split(":")[0];
		if (id) {
			var found = false;
			for (var i = 0; i < this.neighbors.length; i++) {
				var neighbor = this.rumors[i];
				if (neighbor.location === id) {
					this.neighbors[i].vacancies = parseInt(text);
					found = true;
					break;
				}
				else continue;
			}
			
			if (!found) {
				this.neighbors.push({
					vacancies: parseInt(text),
					location: id
				});
			}
		}
	}
};

ServerState.prototype.findSendableRumor = function() {
	const that = this;
	var result = null;
	
	that.shuffleEndpoints().forEach(function(endpoint) {
		if (!result) {
			var rumor = that.myRumor;
			if ( !rumor.hasSentTo(endpoint)) {
				const copiedRumor = rumor.cloneForSending(that.myEndpoint);
				result = new SendableRumor.make(i,copiedRumor,endpoint);
				return;
			}
		}
	});

	return result;
};

ServerState.prototype.shuffleEndpoints = function() {
	var array = this.otherEndpoints;
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
};