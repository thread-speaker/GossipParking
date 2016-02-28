'use strict';

exports.make = SendableRumor;

function SendableRumor(rumor,targetEndpoint) {
  this.rumor = rumor;
  this.targetEndpoint = targetEndpoint;
}