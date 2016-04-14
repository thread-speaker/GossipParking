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

				var data = {
					lotLocation: $scope.lotLocation,
					yCap: $scope.yCap
				};

				$.ajax({
					url: '/connectTwitter',
					type: 'POST',
					data: data,
					success: function(response){
						$scope.$apply();
					}
				})
			};
			
			$scope.simulateEnter = function () {
				$.ajax({
					url: '/car/entered',
					type: 'POST',
					success: function(response) {
						//I don't know if we need anything in here
						return;
					}
				});
			};
			
			$scope.simulateExit = function () {
				$.ajax({
					url: '/car/exited',
					type: 'POST',
					success: function(response) {
						//I don't know if we need anything in here
						return;
					}
				});
			};
		}
	}
]);
