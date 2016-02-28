'use strict';

exports.make = SendableRumor;

function SendableRumor(rumorIndex, rumor, targetEndpoint) {
  this.rumorIndex = rumorIndex;
  this.rumor = rumor;
  this.targetEndpoint = targetEndpoint;
}

SendableRumor.prototype.getRumorIndex = function() {
	return this.rumorIndex;
}

SendableRumor.prototype.getTarget = function() {
	return this.targetEndpoint;
}

SendableRumor.prototype.format = function() {
	var result = {};
	result["Rumor"] = {
			"MessageID": this.rumor.getMessageId(),
			"Originator": this.rumor.getOriginator(),
			"Text": this.rumor.getText()
		};
	result["EndPoint"] = this.rumor.getEndpoint();
	
	return result;
}