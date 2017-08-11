(function(){
angular.module("app",['ngSanitize','ngCookies','ngAnimate'])
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
				console.log(element.attr("self_name"))
				console.log(element,attrs);
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
.controller("myForm",function($scope,$element){
	$scope.user = {
		name:""
	}
	$element.find(".panel-body").Validform(
	   {
            btnSubmit: ".save",
            tiptype:2,
            datatype: {
                "date": /^\d{4}\-\d{2}\-\d{2}$/,
                "phone": /^[0-9]\d{2,3}-?\d{7,8}$/,
                "Post": /^[0-9][0-9]{5}$/,
                "Number":/^\d{1,13}((\.\d{1,2})?)$/,
                "pre":/^\d{1,2}(\.\d{1,4})?$/,
                "pre1":/^\d{1,4}(\.\d{1,4})?$/
            },
            beforeSubmit:function(curform){
                console.log($scope.user)
            },
            beforeCheck:function(curform){
				
			},
            callback:function(form){
                return false;
        }
    });

    $scope.lay = function(){
  //   	layer.open({
		//   type: 1,
		//   title: false,
		//   offset:"100px",
		//   closeBtn: 2
		//   ,area: ['390px', '260px'],
		//   shadeClose: true,
		//   content: 'aaa.html'
		//   ,btn: ['确定', '取消']
		//   ,yes: function(index, layero){
		//     layer.close(index); 
		//   }
		//   ,btn2: function(index, layero){
		    
		//   }
		//   ,cancel: function(){ 
		   
		//   }
		// });

		
		var ind = layer.load(); //

		layer.open({
		   type: 2 //此处以iframe举例
		  ,title: " <a style='text-align:center;'>123<a/> "
		  ,area: ['390px', '330px']
		  ,shade: 0.3
		  ,shadeClose:true
		  ,offset: "100px"
		  ,maxmin: true
		  ,content: 'aaa.html'
		  ,btn: ['继续弹出', '关闭'] //只是为了演示
		  ,yes: function(){
		   	layer.close(ind)
		  }
		  ,btn2: function(){
		    layer.closeAll();
		  }
		  
		  ,zIndex: layer.zIndex //重点1
		  ,success: function(layero){
		    layer.setTop(layero); //重点2
		  }
	    });

    }
    $scope.lay1 = function(){
    	  //示范一个公告层
      // layer.open({
      //   type: 1
      //   ,title: false //不显示标题栏
      //   ,closeBtn: false
      //   ,area: '300px;'
      //   ,shade: 0.8
      //   ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
      //   ,btn: ['火速围观', '残忍拒绝']
      //   ,moveType: 1 //拖拽模式，0或者1
      //   ,content: '<div style="padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">你知道吗？亲！<br>layer ≠ layui<br><br>layer只是作为Layui的一个弹层模块，由于其用户基数较大，所以常常会有人以为layui是layerui<br><br>layer虽然已被 Layui 收编为内置的弹层模块，但仍然会作为一个独立组件全力维护、升级。<br><br>我们此后的征途是星辰大海 ^_^</div>'
      //   ,success: function(layero){
      //     var btn = layero.find('.layui-layer-btn');
      //     btn.css('text-align', 'center');
      //     btn.find('.layui-layer-btn0').attr({
      //       href: 'http://www.layui.com/'
      //       ,target: '_blank'
      //     });
      //   }
      // });
      //自定页
		// layer.open({
		//     type: 1,
		//     skin: 'layui-layer-demo', //样式类名
		//     closeBtn: 0, //不显示关闭按钮
		//     shift: 2,
		//     shadeClose: true, //开启遮罩关闭
		//     content: '内容'
		// });
        //示范一个公告层
      layer.open({
         type: 1
        ,title: false //不显示标题栏
        ,closeBtn: false
        ,shade: 0.4
        ,time:1000
        ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
        ,content: '<div><i class="fa fa-refresh fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>'
      });
    }
})
.controller("callback",function($scope,$element,getData){
	$scope.flag = false;
	$scope.flag1 = true;
	$scope.flag2 = false;
	$scope.next = function(par,selfName){
		
		getData.getData("dataSelect.json",{id:par}).then(function(data){
			if(data.data.success === 0){
				switch (selfName)
				{
					case 'select-first':
						$scope.data1 = data.data.data;
						$scope.flag = true;
					break;
		
					case 'select-two':
					    $scope.flag1 = true;
						$scope.data2 = data.data.data;
					break;

					case 'select-three':
						$scope.data3 = data.data.data;
						$scope.flag2 = true;
					break;
					default :
						return false;
				}
			}
		})
	}
})
.controller("btnGroup",function($scope){
	$scope.isShow = false;
	$scope.showLeft = function(){
		$scope.isShow = !$scope.isShow;
	}
})
.controller("laypage",function($scope,getData){
	  laypage({
	    cont: 'demo7',
		pages: 10, //通过后台拿到的总页数
		curr:  1, //当前页
		first: '首页',
		last: '尾页',
		prev: false,
		next: false,
		skip: true //是否开启跳页
		,jump: function(e, first){ //触发分页后的回调(单击页码后)
		    if(!first){ //一定要加此判断，否则初始时会无限刷新
		    var pageNo = e.curr;	
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
		    }
		}
	  });
})		

})()







