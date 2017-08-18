var app = angular.module('app', ["ngCookies",'pascalprecht.translate']);
// 调取接口的方法
var baseUrl = "http://localhost:3000/erp-web/webapp/static/data/";
app.factory("getData",function($http,$q){
	return {
		data:function(url,data){
			return $http.post(url,data,{
				headers : {'contentType' : 'application/json','url-mapping' : ''}
			}).success(function(Data,status,headers,config){
				return Data;
			}).error(function(Data,status,headers,config){
				return Data;
			})
		}
	}
})
// js页面切换中英文方法
.service('langData', function(getData) {
	this.data = function(){
		var promise = new Promise(function(resove,reject){
			getData.getData(""+baseUrl+"lang.json",{}).then(function(Data){
				localStorage.lang == "en" ? Data = Data.data.en : Data = Data.data.zh;
				resove(Data);
			},function(data){
				reject(data);
			})
		})
		return promise;	
	}	
})
.factory("verify",function(){
	return {
		verify:{
			"phone":"/^[0-9]\d{2,3}-?\d{7,8}$/", //手机
			"password":"^[a-zA-Z]\w{5,17}$", // 密码
			"Post":"[1-9]\d{5}(?!\d) " // 邮政编码
		}
	}
})
// html 页面中英文切换方法  使用{{ 'title' | translate }} <span translate="title"></span>
.config(function($translateProvider){
	 var Data = null;
	 $.ajax({
	  	url:""+baseUrl+"lang.json",
	  	method:"post",
	  	async: false,
	  	dataType:"json",
	  	success:function(data){
	  	   Data = data;
	  }})
	  $translateProvider.translations('en',Data.en);
      $translateProvider.translations('zh',Data.zh);	
      $translateProvider.preferredLanguage(localStorage.lang || 'zh');	 		   
})
