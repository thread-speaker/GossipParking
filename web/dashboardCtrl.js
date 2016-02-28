var app = angular.module('gossipChat');

app.controller('dashboardCtrl',["$scope",
	function($scope) {
		if (!localStorage.username || !localStorage.userkey) {
			window.location="#login";
		}
		else {
			$scope.loggedin = true;
			$scope.username = localStorage.username;
			console.log("user is: " + $scope.username)
		}
	}
]);
