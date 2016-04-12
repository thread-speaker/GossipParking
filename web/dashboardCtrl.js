var app = angular.module('parkingGossip');

app.controller('dashboardCtrl',["$scope",
	function($scope) {
		if (!localStorage.username || !localStorage.userkey) {
			window.location="#login";
		}
		else {
			$scope.loggedin = true;
			$scope.lotLocation ="a"
			$scope.yCap = "b"
			$scope.gCap = "c"
			$scope.aCap = "d"
			$scope.startTime = "e"
			$scope.endTime = "f"
			
			$scope.collapsed = true;
			$scope.connectHidden = function() {
				return $scope.collapsed;
			}
			$scope.toggleConnect = function() {
				$scope.collapsed = !$scope.collapsed;
			}
		
			$scope.connectTwitter = function (lotLocation, yCap, gCap, aCap, startTime, endTime) {
				var data = {
					lotLocation: $scope.lotLocation,
					yCap: $scope.yCap,
					gCap: $scope.gCap,
					aCap: $scope.aCap,
					startTime: $scope.startTime,
					endTime: $scope.endTime
				};
				
				//data contains all the information from the input fields.
				//Connect to Twitter (uncomment below and fill in once the OAuth api is worked out)
				//$.ajax({
				//	url: "...",
				//	type: "...",
				//	data: "...",
				//	success: function (twitterResult) {
				//		//Get OAuth codes or whatever else, and save everything to data.
				//		//data["OAuth"] = "yadda";
					
						//Save to the server's state
						$.ajax({
							url: '/setsettings',
							type: "POST",
							data: data,
							success: function(result){
								console.log(result);
							}
						});
				//	}
				//});
			}
		}
	}
]);
