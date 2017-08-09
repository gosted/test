(function(){
angular.module("app",["ngSanitize","ngCookies"])
.controller("myContral",function($scope){
	$scope.name = "zhangsan";
	$scope.showname = false;
	$scope.change = function(){
		$scope.showname = !$scope.showname;
		console.log(1)
	};
	$scope.tap = 1;
	$scope.data = {
		name:"ht"
	}
	$scope.$on("dataChanged", function(event,data){
		$scope.name = data;
		$scope.$broadcast("changeData",data); //执行了绑定的事件
	})	
})
.factory("Data",function(){
	return {
		name:"ht is so good",
		template:"<p>ht is very good</p><a>hahahaha</a>"
	}
})
.factory("getData",function($http,$q){
	return {
		getData:function(url,data){
			// return $http.post(url,data).then(function(resp){
			// 	return resp.data;
			// },function(resp){
			// 	return $.reject(resp.data)
			// })
			return $http.post(url,data,{
				headers : {'contentType' : 'application/json','url-mapping' : '/app/platform/modifypwd'}	
			}).success(function(Data,status,headers,config){
				var progress;
				for(var i = 0;i < Data.length; i++){
					progress = (i+1)/Data.length*100;
				}
				return Data;
			}).error(function(Data,status,headers,config){
				return $q.reject(Data);
			})
		}
	}
})
.directive("myDirective",function(){
	return {
		restrict:"AEC",
		replace:true,
		template:"<h3>这是一个模板，可以公用</h3>"
	}
})
.directive("myTest",function(){
	return {
		restrict:"AEC",
		replace:true,
		templateUrl:"myTest.html",
		controller:function($scope){
			$scope.data = "ht very good";
		},
		link:function(scope,element,attrs){
			//console.log(element)
			scope.test = function(){
				console.log(element);
			}
		}
	}
})
.controller("childCtral",function($scope){
	$scope.data = {name:"HT"}
})
.controller("childCtra2",['$scope', function($scope){
	$scope.change = function(){
		$scope.$emit("dataChanged",$scope.name); //注册了事件
	}
	$scope.$on("changeData",function(evnet,data){ // 绑定了事件
		$scope.name = data;
		console.log(data)
	})
}])
.controller("childCtra3",["$scope","Data",function($scope,Data){
	$scope.name = Data.name;
	$scope.template = Data.template;
}])
.controller("childCtra4",["$scope","Data",function($scope,Data){
	Data.name  = $scope.name ;
}])
.controller("content",function($scope){
	$scope.name = "lisi";
	$scope.users = [
					{name:'Jani',country:'Norway'},
				    {name:'Carl',country:'Sweden'},
				    {name:'Margareth',country:'England'},
				    {name:'Hege',country:'Norway'},
				    {name:'Joe',country:'Denmark'},
				    {name:'Gustav',country:'Sweden'},
				    {name:'Birgit',country:'Denmark'},
				    {name:'Mary',country:'England'},
				    {name:'Kai',country:'Norway'}
				];

})
.filter("myFilter", function() {
	return function(val) {
		return val + "@";
	}
})
.controller("directive",function($scope,$cookies,$http,$q,$cookieStore,getData,$q){
	console.log($scope.name);
	$http({
		method:"post",
		url:"data.json",
		data:{name:"1233"}
	}).then(function mySuccess(resp){
		$scope.users = resp.data;
	},function myError(){
		$scope.users = {};
	});
	$http.post("data.json",{id:"001"},{
		headers : {'contentType' : 'application/json','url-mapping' : '/app/platform/modifypwd'}
	}).success(function(data,status,headers,config){
		var expireDate = new Date();  
		expireDate.setDate(expireDate.getDate() + 30); 
		$cookies.put("uId","001", {'expires':  expireDate.toUTCString()});
		var id = $cookies.get("uId");
		$cookieStore.put("abc",{name:"123",age:"18"},{'expires':  expireDate.toUTCString()});
		var abc = $cookieStore.get("abc")  //加密处理		
		$cookieStore.remove("uid");
		//console.log(abc);
	});
	getData.getData("data.json",{id:"0001"})
	.then(function(data){
		$scope.data = data;
		return data;
	},function(error){
		$scope.data = error;
		console.log("cuowu");
	})
	.then(function(data){
		console.log(data);
	})

})
.controller("myForm",function($scope){

})	
})()


