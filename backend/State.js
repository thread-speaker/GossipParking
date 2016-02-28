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
	this.otherEndpoints.push(otherEndpoint);
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

ServerState.prototype.findSendableRumor = function() {
	const that = this;
	var result = null;

	that.otherEndpoints.forEach(function(endpoint) {
		that.rumors.forEach(function(rumor) {
			if ( !rumor.hasSentTo(endpoint)) {
				rumor.sentTo(endpoint);
				const copiedRumor = rumor.cloneForSending(that.myEndpoint);
				result = new SendableRumor.make(copiedRumor,endpoint);
			}
		})
	});

	return result;
};









