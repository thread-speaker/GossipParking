var app = angular.module('parkingGossip');

app.controller('dashboardCtrl',["$scope",
	function($scope) {
		if (!localStorage.username || !localStorage.userkey) {
			window.location="#login";
		}
		else {
			$scope.loggedin = true;
			$scope.lotLocation =""
			$scope.yCap = ""
			
			$scope.collapsed = true;
			$scope.connectHidden = function() {
				return $scope.collapsed;
			}
			$scope.toggleConnect = function() {
				$scope.collapsed = !$scope.collapsed;
			}
		
			$scope.connectTwitter = function (lotLocation, yCap, gCap, aCap, startTime, endTime) {
				$.ajax({
					url: '/base64Key',
					success: function(token){
						var oauthData = "grant_type=client_credentials";
						var oauthHeaders = {
							Content-Type : "application/x-www-form-urlencoded;charset=UTF-8",
							Authorization : token
						}
						$.ajax({
							url: "https://api.twitter.com/oauth2/token",
							type: "POST",
							headers: oauthHeaders,
							data: oathData,
							success: function (twitterResult) {
								var data = {
									accessToken: twitterResult.access_token,
									lotLocation: $scope.lotLocation,
									yCap: $scope.yCap
								};
								//Get OAuth codes or whatever else, and save everything to data.
								//data["OAuth"] = "yadda";
							
								//Save to the server's state
								$.ajax({
									url: '/setsettings',
									type: "POST",
									data: data,
									success: function(result){
										console.log(result);
									}
								});
							}
						});						
					}
				})
				//data contains all the information from the input fields.
				//Connect to Twitter (uncomment below and fill in once the OAuth api is worked out)
			}
		}
	}
]);
