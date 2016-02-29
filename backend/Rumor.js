exports.make = Rumor;

function Rumor(userId,messageNumber,originator,text,endpoint) {
	this.userId = userId;
	this.messageNumber = messageNumber;
	this.messageID = userId + ":" + messageNumber;
	this.originator = originator;
	this.text = text;
	this.endpoint = endpoint;

	this.endpointsSentTo = [];
}

Rumor.prototype.getOriginator = function() {
	return this.originator;
}

Rumor.prototype.getUserId = function() {
	return this.userId;
}

Rumor.prototype.getNumber = function() {
	return this.messageNumber;
}

Rumor.prototype.getEndpoint = function() {
	return this.endpoint;
}

Rumor.prototype.getMessageId = function() {
	return this.messageID;
}

Rumor.prototype.getText = function() {
	return this.text;
}

Rumor.prototype.hasSentTo = function(endpoint) {
	var result = false;

	this.endpointsSentTo.forEach(function(otherEndpoint){
		if ( otherEndpoint===endpoint )  {
			result = true;
		}
	});
	
	return result;
};

Rumor.prototype.sentTo = function(endpoint) {
	if ( !this.hasSentTo(endpoint)) {
		this.endpointsSentTo.push(endpoint);
	}
};

Rumor.prototype.unmark = function(target) {
	var index = endpointsSentTo.indexOf(target);
	if (index > -1) {
		target.splice(index, 1);
	}
};

Rumor.prototype.cloneForSending = function(newEndpoint) {
	var result = new Rumor(this.userId,this.messageNumber,this.originator,this.text,newEndpoint);
	return result;
};





