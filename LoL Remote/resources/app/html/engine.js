var mainScope;
var mainApp = angular.module('LoL', []);
	mainApp.controller('1GB',['$scope','$filter','$http',function($scope,$filter,$http) {
		
		$scope.onScene = 3;
		
		var ws = null;
		
		$scope.readyCheck = function(r){
			ws.send(JSON.stringify(["ready-check",r]));
		}
		
		function init(){
			ws = new WebSocket("ws://127.0.0.1:10808/");
			ws.onopen = function(){
				 //alert('lol');
			}
			
			ws.onmessage = function(msg){
				
			  if(msg.data){
				var msg = JSON.parse(msg.data);	
				
				console.log(msg);
				
				switch(msg[0]){
					case "unqueue":
						$scope.onScene = 0;
						$scope.$apply();
					break;
					case "queue":
						if(msg[1].searchState=='Searching'){
							$scope.onScene = 1;
						}
						
						var _TIME = '';
						var Q = msg[1].timeInQueue;
						
						if(Q>59){
							var MIN = Math.floor(Q/60);
							if(MIN<10){
								MIN = '0'+MIN;
							}
							
							Q = Q - (MIN * 60);
							
							if(Q<10){
								Q = '0'+Q;
							}
							
							_TIME = MIN+':'+Q;
							
							
						}else{
							if(Q<10){
								Q = '0'+Q;
							}
							_TIME = '00:'+Q;
						}
						
						$scope.timeInQueue = _TIME;
						$scope.$apply();
					break;
					case "ready-check":
						$scope.onScene = 2;
						$scope.$apply();
					break;
				}
				
				//console.log(data.uri);
				
				///lol-champ-select/v1/session
				
				
				
			  }
			};
			
			

		}

		
		init();
		
	}]);