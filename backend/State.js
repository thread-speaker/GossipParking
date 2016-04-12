const Rumor = require('./Rumor');
const SendableRumor = require('./SendableRumor');

exports.createEmptyServerState = function(endpoint) {
	return new ServerState(endpoint);
};

function ServerState(endpoint) {
	this.rumors = [];
	this.myEndpoint = endpoint;
	this.otherEndpoints = [];
	this.info = {};
	this.cars = {
		y: 0,
		g: 0,
		a: 0
	};
	this.TwitterKey = "OURC1agK5sbxfoJ7YgzPCYvRD";
	this.TwitterSecret = "iOpigIpYlCtx0JoHdDDfTUCSqiyynXehonRfaaNNz4GMGFrfO1";
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

ServerState.prototype.getInfo = function () {
	return this.info;
};

ServerState.prototype.setInfo = function (info) {
	this.info = info;
};

ServerState.prototype.getCars = function () {
	return this.cars;
};

ServerState.prototype.addYCars = function () {
	this.cars.y++;
};

ServerState.prototype.addGCars = function () {
	this.cars.g++;
};

ServerState.prototype.addACars = function () {
	this.cars.a++;
};

ServerState.prototype.decYCars = function () {
	this.cars.y--;
};

ServerState.prototype.decGCars = function () {
	this.cars.g--;
};

ServerState.prototype.decACars = function () {
	this.cars.a--;
};

ServerState.prototype.getAvailibility = function () {
	var spaces = {};
	if (this.info.yCap) {
		spaces.y = this.info.yCap - this.cars.y;
	}
	if (this.ingo.gCap) {
		spaces.g = this.info.gCap - this.cars.g;
	}
	if (this.info.aCap) {
		spaces.a = this.info.aCap - this.cars.a;
	}
	
	return JSON.stringify(spaces);
}

ServerState.prototype.mark = function(index, target) {
	this.rumors[index].sentTo(target);
};

ServerState.prototype.unmark = function(id, number, target) {
	const that = this;
	that.rumors.forEach(function(rumor) {
		if (rumor.getUserId() === id && parseInt(rumor.getNumber()) > number) {
			rumor.unmark(target);
		}
	});
};

ServerState.prototype.addUserChat = function(id, username, text) {
	var highest = 0;
	for (i = 0; i < this.rumors.length; i++) {
		if (username == this.rumors[i].getOriginator()) {
			highest = this.rumors[i].getNumber();
		}
	}
	
	const rumor = new Rumor.make(id,(highest+1),username,text,this.myEndpoint);
	this.rumors.push(rumor);
};

ServerState.prototype.getRumor = function(rumorId, user, text) {
	//Make sure things parse correctly before doing anything
	if (rumorId) {
		var id = rumorId.split(":")[0];
		var number = rumorId.split(":")[1];
		if (id && rumorId) {
			var found = false;
			this.rumors.forEach(function(rumor) {
				if (rumor.getMessageId() === rumorId) {
					found = true;
				}
			});
			
			if (!found) {
				const rumor = new Rumor.make(id,number,user,text,this.myEndpoint);
				this.rumors.push(rumor);
			}
		}
	}
};

ServerState.prototype.findSendableRumor = function() {
	const that = this;
	var result = null;
	
	that.shuffleEndpoints().forEach(function(endpoint) {
		if (!result) {
			for (i=0;i<that.rumors.length;i++) {
				var rumor = that.rumors[i];
				if ( !rumor.hasSentTo(endpoint)) {
					const copiedRumor = rumor.cloneForSending(that.myEndpoint);
					result = new SendableRumor.make(i,copiedRumor,endpoint);
					return;
				}
			}
		}
	});

	return result;
};

ServerState.prototype.findWants = function() {
	//Sort all known rumors
	this.rumors.sort(function(a, b){
		if (a.getUserId() < b.getUserId()) return -1;
		else if (a.getUserId() > b.getUserId()) return 1;
		else if (parseInt(a.getNumber()) < parseInt(b.getNumber())) return -1;
		else if (parseInt(a.getNumber()) > parseInt(b.getNumber())) return 1;
		return 0;
	});
	
	//Generate wants
	var currentUser = "";
	var wants = {};
	this.rumors.forEach(function(rumor) {
		if (rumor.getUserId() !== currentUser) {
			currentUser = rumor.getUserId();
			wants[currentUser] = parseInt(rumor.getNumber());
		}
		else {
			const number = parseInt(rumor.getNumber());
			if (wants[currentUser] < number) wants[currentUser] = number;
		}
	});
	const want = {Want:wants,EndPoint:this.myEndpoint};
	
	//Return wants + target
	return {
		want: want,
		target: this.shuffleEndpoints()[0]
	};
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