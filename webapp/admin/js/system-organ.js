/**
 * 本文件的功能是机构管理js文件
 *@ author 陈安
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
		pageNo = 1,
		treeArr = [],
		first = true,
		areaIdNow = "",
		arIsCompatibilityNow = "",
		reqSupType = "",
		startTime = "",
		endTime = "",
		unitParentId = "",
		sendData = {};
		treeInfo(0);
		listInfo(0);

		/*树形参数加载方法*/
		function treeInfo(data,_this)
		{
			if(_this)
			{
				if($(this).hasClass("tree-sw"))
				{
					var _this = $(this);
				}
			}
			data==0?unitParentId=0:unitParentId=data;
			$.myAjax({
				type:"POST",
				url:window.ajaxUrl + "general/unit/findTree",
				data:{"id":unitParentId},
				success:function(msg)
				{
					if(msg && msg.success === 0)
					{
						treeArr = msg.data;
						if(unitParentId == 0)
						{
							var treeArr = msg.data;
							treeInit({
								"ele": "#tree",
								"data": treeArr
							});	
						}
						else
						{
							treeChild({
								ele:_this,
								data:treeArr
							});
						}
					}
				}
			});
		}
		/*列表参数加载*/
		function listInfo(data,event)
		{
			if($(this).hasClass("tree-txt"))
			{
				var _this = $(target);
			}
			data==0?unitParentId=0:unitParentId=data;
			$.myAjax({
				type:"POST",
				url:window.ajaxUrl + "general/unit/findPageWithTree",
				data:{"id":unitParentId,"pageNo":pageNo,"pageSize":pageSize},
				success:function(msg)
				{
					if(msg && msg.success === 0)
					{
						var treeArr = msg.data.result;
						listInit({
							"ele": ".tbody",
							"data": treeArr
						});
						$(".allpage").text(msg.data.totalCount);
						laypage({
							cont: $('#pagination'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
							pages: msg.data.pageCount, //通过后台拿到的总页数
							curr: msg.data.pageNo || 1, //当前页
							first: '首页',
							last: '尾页',
							prev: false,
							next: false,
							skip: true, //是否开启跳页
							jump: function(obj, first){ //触发分页后的回调
								if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
									pageNo = obj.curr
									var sendData = {
										pageSize: pageSize,
										pageNo: obj.curr,
										id:unitParentId
									};
									$.myAjax({
										type: "POST",
										url:window.ajaxUrl + "general/unit/findPageWithTree",
										data: sendData,
										success: function (data)
										{
											if (data && data.success === 0)
											{
												var treeArr = data.data.result;
												listInit({
													"ele": ".tbody",
													"data": treeArr
												});
											}
										}
									});
								}
							}
						});
						if ($('.pagination .con_much').size() === 0)
						{
							$('.pagination').append('<div class="con_much l">'+
								'<span>'+
								'每页<i class="con_list_num">20</i>条'+
								'</span>'+
								'<i></i>'+
								'<ul class="clear">'+
								'<li class="con_num_5"><span>10</span></li>'+
								'<li class="con_num_10"><span>20</span></li>'+
								'<li class="con_num_15"><span>50</span></li>'+
								'<li class="con_num_20"><span>100</span></li>'+
								'<li class="con_num_25"><span>200</span></li>'+
								'<li class="con_num_30"><span>1000</span></li>'+
								'</ul>'+
								'</div>');
							$('.pagination').append("<div class='con_altogether'><span>共<span class='allpage'>"+msg.data.totalCount+"</span>条</span></div>");
						}
					}
				}
			});
		}
		
		/*初始化树形内容*/
		function treeInit(obj)
		{
			var tree = $(obj.ele),
				data = obj.data;

			tree.html("");
			$.each(data, function (i, v)
			{
				var OLi = $('<li></li>'),
					OA = $('<a href="javascript:;"></a>');
				OLi.append('<span class="tree-sw"></span>');
				OA.append('<span class="tree-txt"></span>');
				$.each(v, function (j,va)
				{
					if (j === "unitName")
					{
						OA.find(".tree-txt").html(va);
					}
					else if (j === "id")
					{
						OLi.attr("unitParentId", va);
					}
					else
					{
						OA.attr(j, va);
					}
				});
				OLi.append(OA);
				tree.append(OLi);
				$(".l").attr({"unitParentId":OLi.attr("unitParentId"),"unitNameStr":OA.attr("unitNameStr")});
			});
			tree.on("click", ".tree-sw", function ()
			{
				var _this = $(this),
				unitParentId = _this.parent("li").attr("unitParentId");
				$("[con_name='unitName']").val("");
				if(_this.siblings("ul").length != 0)
				{
					treeChild({
						ele:_this
					});
				}
				else
				{
					treeInfo(unitParentId,_this);
				}
			});
			tree.on("click",".tree-txt",function()
			{
				var _this = $(this),
				unitParentId = _this.parent().parent("li").attr("unitParentId"),
				unitNameStr = _this.parent().attr("unitNameStr");
				_this.parents(".tree").find(".tree-txt").removeClass("clr-blue");
				_this.addClass("clr-blue");
				$(".l").attr({"unitParentId":unitParentId,"unitNameStr":unitNameStr});
				pageNo = 1;
				$("[con_name='unitName']").val("");
				listInfo(unitParentId);
			})
		}
		/*树形子节点渲染*/
		function treeChild(_this)
		{
			var obj = _this.ele;
			if(obj.siblings("ul").length == 0)
			{
				var data = _this.data;
				var OUL = $("<ul class='organCon'></ul>");
				$.each(data, function(i,v) {
					var OLi = $('<li></li>'),
					data = _this.data,
					OA = $('<a href="javascript:;"></a>');
					OLi.append('<span class="tree-sw"></span>');
					OLi.append(OA);
					OA.append('<span class="tree-txt"></span>');
					OUL.append(OLi);
					$.each(v, function(j,w) {
						if (j === "unitName")
						{
							OA.find(".tree-txt").html(w);
						}
						else if (j === "id")
						{
							OLi.attr("unitParentId", w);
						}
						else
						{
							OA.attr(j, w);
						}
					});
				});	
				obj.parent("li").append(OUL);
			}
			if (obj.hasClass("sw-open"))
			{
				obj.css({"background": 'url("../../images/commen/tree_0.png") no-repeat center'});
				obj.removeClass("sw-open");
				obj.siblings(".organCon").css({"display": "none"});
			}
			else
			{
				obj.css({"background": 'url("../../images/commen/tree_1.png") no-repeat center'});
				obj.addClass("sw-open");
				obj.siblings(".organCon").css({"display": "block"});
			}
		}
		
		/*列表渲染*/
		function listInit(obj)
		{
			var list = $(obj.ele),
			data = obj.data;
			list.html("");
			$.each(data, function(i,v) {
				var tr = $("<tr class='text-c'></tr>");
				tr.attr({"usefulid":v.id,"unitParentId":v.unitParentId});
				v.unitState==0?v.unitState="启用":v.unitState="禁用";
				var str = "<td><input type='checkbox' name='' value=''></td><td title='"+v.unitCode+"'>"+v.unitCode+"</td><td class='text-l pl-3' title='"+v.unitNameStr+"'>"+v.unitNameStr+"</td><td>"+v.unitState+"</td><td class='btns'><a style='text-decoration:none' class='mr-5 edi' href='javascript:;' title='编辑' _href='support-lib-edit.html'><i class='Hui-iconfont'>&#xe70c;</i></a><a style='text-decoration:none' class='mr-5 examine' href='javascript:;' title='查看'><i class='Hui-iconfont'>&#xe695;</i></a><a style='text-decoration:none' class='mr-5 del c-warning' href='javascript:;' title='删除'><i class='Hui-iconfont'>&#xe6e2;</i></a></td>"
				tr.append(str);
				list.append(tr);
				i%2==0?tr.css({"background":"#fff"}):tr.css({"background":"#eee"});
				tr.on("click",function ()
				{
					var libId = "";
					var e = event||window.event;
					var target = e.target||e.srcElement;
					var tagName = target.tagName.toLowerCase();
					
					if(tagName == "i" || tagName == "input")
					{
						
					}
					else
					{
						libId = $(this).attr("usefulid");
						window.layerShow("查看机构","system-organ-examine.html?libId="+libId);
					}
				});
			});
			
			
			function article_submit(obj,str)
	       	{
				if(str.indexOf("添加成功")>-1)
				{
					layer.confirm("添加成功",{
						shade:0.1
					},
					function()
					{
						suc();
					},
					function()
					{
						suc();
					})
				}
				else if(str.indexOf("操作失败")>-1)
				{
					layer.confirm("操作失败",{
						shade:0.1
					},
					function()
					{
						defeat();
					},
					function()
					{
						defeat();
						layer.msg("已取消",{icon:5});
					})
				}
				else
				{
					layer.confirm(str,function()
					{
						defeat();
					},
					function()
					{
						defeat();
						layer.msg("已取消");
					})
				}
			}
			/*查看按钮单击事件*/
			list.off("click");
			list.on("click", ".btns .examine", function (event)
			{
				var libId = "";
				libId = $(this).parents("tr").attr("usefulid");
				window.layerShow("查看机构","system-organ-examine.html?libId="+libId);
			});
			
			/*编辑按钮单击事件*/
			list.on("click", ".btns .edi", function ()
			{
				var libId = "",
				unitParentId = "";
				libId = $(this).parents("tr").attr("usefulid");
				unitParentId =$(this).parents("tr").attr("unitParentId");
				window.layerShow("编辑机构","system-organ-edi.html?libId="+libId+"&unitParentId="+unitParentId);
		});
			/*删除按钮单击事件*/
			list.on("click", ".btns .del", function ()
			{
				var _this = $(this);
				var libId = "";
				libId = $(this).parents("tr").attr("usefulid");
				layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function()
				{
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "general/unit/deleteByIds",
						data: {ids: libId},
						success: function (data)
						{
							$(".layui-layer").remove();
							$(".layui-layer-shade").remove();
							if (data.success === 0)
							{
								_this.parents("tr").remove();
								$("#tree").find("[unitparentid="+libId+"]").remove();
							}
						}
					});
				},
				function()
				{
					
				});
			});
		}
		
		/*添加按钮单击事件*/
		$(".btn-add").on("click", function ()
		{
			var libId = "",
				libId = $(this).parents(".l").attr("unitparentid"),
				unitNameStr = $(this).parents(".l").attr("unitNameStr"),
				URL = encodeURI("system-organ-add.html?libId="+libId+"&unitNameStr="+unitNameStr);
			window.layerShow("添加机构",URL);
		});
		
		/*条件检索列表展示方法*/
		function findList()
		{
			var unitName = $("[con_name='unitName']").val();
			pageNo = 1;
			$.myAjax({
				type:"POST",
				url:window.ajaxUrl+"general/unit/findPageWithTree",
				data:{"unitName":unitName,"pageNo":pageNo,"pageSize":pageSize,"id":unitParentId},
				success:function(msg)
				{
					if(msg.success === 0 && msg.data)
					{
						var treeArr = msg.data.result;
						listInit({
							"ele": ".tbody",
							"data": treeArr
						});

						laypage({
							cont: $('#pagination'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
							pages: msg.data.pageCount, //通过后台拿到的总页数
							curr: msg.data.pageNo || 1, //当前页
							first: '首页',
							last: '尾页',
							prev: false,
							next: false,
							skip: true, //是否开启跳页
							jump: function(obj, first){ //触发分页后的回调
								if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
									pageNo = obj.curr
									var sendData = {
										pageSize: pageSize,
										pageNo: obj.curr,
										id:unitParentId,
										unitName:unitName

									};
									$.myAjax({
										type: "POST",
										url:window.ajaxUrl + "general/unit/findPageWithTree",
										data: sendData,
										success: function (data)
										{
											if (data && data.success === 0)
											{
												var treeArr = data.data.result;
												listInit({
													"ele": ".tbody",
													"data": treeArr
												});
												$(".allpage").text(data.data.totalCount);
											}
										}
									});
								}
							}
						});
						if ($('.pagination .con_much').size() === 0)
						{
							$('.pagination').append('<div class="con_much l">'+
								'<span>'+
								'每页<i class="con_list_num">20</i>条'+
								'</span>'+
								'<i></i>'+
								'<ul class="clear">'+
								'<li class="con_num_5"><span>10</span></li>'+
								'<li class="con_num_10"><span>20</span></li>'+
								'<li class="con_num_15"><span>50</span></li>'+
								'<li class="con_num_20"><span>100</span></li>'+
								'<li class="con_num_25"><span>200</span></li>'+
								'<li class="con_num_30"><span>1000</span></li>'+
								'</ul>'+
								'</div>');
							$('.pagination').append("<div class='con_altogether'><span>共<span class='allpage'>"+msg.data.totalCount+"</span>条</span></div>");
						}
						$(".allpage").text(msg.data.totalCount);
					}	
				}
			})
		}
		$(".btn-find").on("click", findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});
		$(".pagination").on("click", ".con_much>i", function()
		{
			var _this = $(this),
				_ul = _this.parents(".con_much").children("ul"),
				_num = _this.parents(".con_much").find(".con_list_num");

			_ul.css({"display": "block"});
			_ul.find("span").off();
			_ul.find("span").on("click",function()
			{
				pageSize = $(this).html();
				pageNo = 1;
				_num.html(pageSize);
				_ul.css({"display": "none"});
				listInfo (unitParentId);
			});
			return false;
		});//选择每页显示多少条事件
		/*操作成功关闭弹出框刷新页面*/
		function suc()
       	{
       		$(".layui-layer").remove();
			$(".layui-layer-shade").remove();
			parent.window.location.reload();
			$(".layui-layer-shade",parent.document).remove();
			$(".layui-layer",parent.document).remove();
       	}
       	
       	/*操作失败方法只关闭弹出框*/
       	function defeat()
       	{
       		$(".layui-layer").remove();
			$(".layui-layer-shade").remove();
       	}
       	$(document).on("click", function(e)
		{
			var evn = e || window.event;
			if ($(evn.target).parents(".con_much").size() === 0)
			{
				$(".con_much ul").hide();
			}
		});
	});
	
}(jQuery, window, document));
