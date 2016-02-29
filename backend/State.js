const Rumor = require('./Rumor');
const SendableRumor = require('./SendableRumor');

exports.createEmptyServerState = function(endpoint) {
	return new ServerState(endpoint);
};

function ServerState(endpoint) {
	this.rumors = [];
	this.myEndpoint = endpoint;
	this.otherEndpoints = [];
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

ServerState.prototype.mark = function(index, target) {
	this.rumors[index].sentTo(target);
}

ServerState.prototype.unmark = function(id, number, target) {
	const that = this;
	that.rumours.forEach(function(rumor) {
		if (rumor.getUserId() === id && rumor.getNumber() === number) {
			rumor.unmark(target);
		}
	});
}

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
}

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
}