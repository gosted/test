// 创建herModule模块、注册服务
var Module = angular.module('changeLang', []);
Module.service('langData', function() {	
  this.data = function(){
	  var promise = new Promise(function(resolve, reject){
		    $.ajax({
		    	url:"../../data/lang.json",
		    	dataType:"json",
		    	type:"POST",
		    	success:function(data){
		    		resolve(data)
		    	},
		    	error:function(data){
		    		reject(data);
		    	}
		    })
  		});
  		return promise;
  	}	
})
 
