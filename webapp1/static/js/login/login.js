(function(){
	app.controller("loginCtrl",["$scope","$cookieStore","getData",function($scope,$cookieStore,$getData){
		$scope.userName = "admin",
		$scope.password = "",
		$scope.rember = false;
		$scope.remberPass = function(){
			$scope.rember = !$scope.rember;
		}
		$scope.login = function(){
			$getData.data(baseUrl+"user.json",{}).then(function(data){
				console.log(data.data)
			},function(){

			})
		}

	}])
})()


