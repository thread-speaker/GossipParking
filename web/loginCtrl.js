var app = angular.module('parkingGossip');

app.controller('loginCtrl',
	function($scope, $route) {
		delete localStorage.username;
		delete localStorage.userkey;
		var ref = new Firebase("https://462gossip.firebaseio.com/");
		var knownRef = ref.child('known');
		
		$scope.login = function() {
			var found = false;
			knownRef.once('value', function(dataSnapshot) {
				var known = dataSnapshot.val();
				for (var key in known) {
					if (!known.hasOwnProperty(key)) continue;
					if (known[key] == $scope.username) {
						localStorage.username = known[key];
						localStorage.userkey = key;
						found = true;
						break;
					}
				}
				
				if (!found) {
					var user = knownRef.push($scope.username);
					localStorage.username = $scope.username;
					localStorage.userkey = user.key();
				}
				
				localStorage.messagenumber = 0;
				window.location="/";
			});
		}
	}
);
