var app = angular.module('parkingGossip');

app.controller('dashboardCtrl',["$scope",
	function($scope) {
		if (!localStorage.username || !localStorage.userkey) {
			window.location="#login";
		}
		else {
			$scope.loggedin = true;
			$scope.username = localStorage.username;
			$scope.userkey = localStorage.userkey;
		}
		
		$scope.refresh = function() {
			$.ajax({url: "/rumors", success: function(result){
				$("#display").html(result);
			}});
		};
		$scope.refresh();
	}
]);
