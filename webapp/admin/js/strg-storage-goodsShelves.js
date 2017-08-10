/**
 * 本文件的功能是货架定义js文件
 *@ author 王步华
 */

(function($, w, d){
	'use strict';

	$(function() {
		var strgRoomId = window.parent.layerViewData.strgRoomId;     //库房id
		var strgRoomName = window.parent.layerViewData.strgRoomName;     //库房名称
		var	tbody = $(".tbody"),
			pageSize = 20,
			pageNo = 1,
			first = true,
			treeArr = [];
		/*
		 * treeOnClick树形菜单点击回调函数
		 *
		 * */
		function treeOnClick()
		{
			var _this = $(this),
				id = _this.parents("a").eq(0).attr("dictCodeValue");
			var treeId = $(".tree .clr-blue").parents("li").attr("treeId");
			_this.parents(".tree").find(".tree-txt").removeClass("clr-blue");
			_this.addClass("clr-blue");
			$(".shelfName").val("");
			$(".shelfCode").val("");
			initTable ({pageSize: pageSize, pageNo: pageNo, dictCodeValue: id });
		}
		/*
		 * treeInit初始化树形菜单方法
		 *
		 * */
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

				if (obj.showIcon === true)
				{
					OA.append('<span class="tree-icon"></span>');
				}
				OA.append('<span class="tree-txt"></span>');

				$.each(v, function (j,va)
				{
					if (j === "children")
					{

					}
					else if (j === "shelfName")
					{
						OA.find(".tree-txt").html(va);
					}
					else if (j === "id")
					{
						OLi.attr("treeId", va);
					}
					else
					{
						OA.attr(j, va);
					}
				});
				OLi.append(OA);
				tree.append(OLi);
			});
			tree.on("click", ".tree-sw", function ()
			{
				var _this = $(this),
					OUl = _this.parent("li").children("ul"),
					id = _this.parent("li").attr("treeId");
				if (_this.hasClass("sw-open"))
				{
					_this.css({"background": 'url("../../images/commen/tree_0.png") no-repeat center'});
					_this.removeClass("sw-open");
					OUl.css({"display": "none"});
				}
				else
				{
					_this.css({"background": 'url("../../images/commen/tree_1.png") no-repeat center'});
					_this.addClass("sw-open");

					if (OUl.size() === 1)
					{
						OUl.css({"display": "block"});
					}
					else
					{
						$.myAjax({
							url: window.ajaxUrl + "operation/shelf/findTree",
							type: "POST",
							data: {storageId : strgRoomId,id : $(this).parents("li").attr("treeId")},
							success: function (data)
							{
								if (data && data.success === 0)
								{
									var treeArr = data.data,
										OUl = $('<ul></ul>');

									$.each(treeArr, function (i, v)
									{
										var OLi = $('<li></li>'),
											OA = $('<a href="javascript:;"></a>');

										OLi.append('<span class="tree-sw"></span>');

										if (obj.showIcon === true)
										{
											OA.append('<span class="tree-icon"></span>');
										}
										OA.append('<span class="tree-txt"></span>');

										$.each(v, function (j,va)
										{
											if (j === "children")
											{

											}
											else if (j === "shelfName")
											{
												OA.find(".tree-txt").html(va);
											}
											else if (j === "id")
											{
												OLi.attr("treeId", va);
											}
											else
											{
												OA.attr(j, va);
											}
										});
										OLi.append(OA);
										OUl.append(OLi);
									});
									_this.parent("li").append(OUl);
								}
							}
						});
					}
				}
				return false;
			});

			tree.on("click", ".tree-txt", treeOnClick);
		}
		var sendData ={};
		//请求树形菜单数据
		$.myAjax({
//			type: "POST",
			url: window.ajaxUrl + "operation/shelf/findTree",
			type: "POST",
			data: {storageId : strgRoomId},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					treeArr =data.data;
					treeInit({
						ele: "#tree",
						data: treeArr
					});
					$(".tree").find("a").eq(0).find("span").addClass("clr-blue");
				}
			}
		});

		/*
		 * 渲染表格方法传入请求到的数据
		 * */
		function setTable (data)
		{
			var list = [],
				tbody = $(".tbody"),
				STr = null;
			list = data.data.result;
			tbody.html("");
			if(list == null || list == ""){
				$(".no-data").show();
			}else {
				$(".no-data").hide();
				$.each(list, function (i, v) {
					STr = $('<tr class="text-c" libId="' + v.id + '" shelfname="'+v.shelfNameStr+'"></tr>');//一行

					//STr.append('<td class="text-l pl-3 shelfName">' + v.shelfNameStr + '</td>');
					STr.append($('<td class="text-l pl-3 shelfName"></td>').text(v.shelfNameStr || ""));
					//STr.append('<td>' + v.shelfCode + '</td>');
					STr.append($('<td></td>').text(v.shelfCode || ""));
					//STr.append('<td class="text-l pl-3">' + v.shelfRemark + '</td>');
					STr.append($('<td class="text-l pl-3"></td>').text(v.shelfRemark || ""));

					STr.append('<td class="btns">' +
						'<a style="text-decoration:none" class="mr-5 op" href="javascript:;" title="编辑" _href="strg-storage-goodsEdit.html">' +
						'<i class="Hui-iconfont">&#xe70c;</i></a>' +

						'<a style="text-decoration:none" class="mr-5 del" href="javascript:;" title="删除">' +
						'<i class="Hui-iconfont">&#xe6e2;</i></a>' +
						'</td>');

					tbody.append(STr);
					/*
					 * tr颜色间隔问题
					 * */
					var trs = tbody.find("tr");
					for (var i = 0; i < trs.length; i++) {
						if (i % 2 == 0) {
							trs.eq(i).css("background", "#fff");
						} else {
							trs.eq(i).css("background", "#eee");
						}
					}
				});
			}
		}



		/*
		 * 获取表格中数据
		 * */
		function initTable (obj)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "operation/shelf/findPage",
				data: {
					pageSize: obj.pageSize,
					pageNo: obj.pageNo,
					shelfName: $(".shelfName").val(),
					shelfCode:  $(".shelfCode").val(),
					storageId : strgRoomId,
					id:$(".tree .clr-blue").parents("li").attr("treeId")
				},
				success: function (data)
				{
					if (data && data.success === 0)
					{
						setTable(data);
						//分页
						laypage({
							cont: $('#pagination'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
							pages: data.data.pageCount, //通过后台拿到的总页数
							curr: data.data.pageNo || 1, //当前页
							first: '首页',
							last: '尾页',
							prev: false,
							next: false,
							skip: true, //是否开启跳页
							jump: function(obj, first){ //触发分页后的回调
								if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
									var sendData = {
										pageSize: pageSize,
										pageNo: obj.curr,
										shelfName: $(".shelfName").val(),
										shelfCode:  $(".shelfCode").val(),
										storageId : strgRoomId,
										id:$(".tree .clr-blue").parents("li").attr("treeId")
									};

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "operation/shelf/findPage",
										data: sendData,
										success: function (data)
										{
											if (data && data.success === 0)
											{
												setTable(data);
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
							$('.pagination').append("<div class='con_altogether'><span>共<span class='allpage'>"+data.data.totalCount+"</span>条</span></div>");
						}
						$(".allpage").text(data.data.totalCount);
						//分页结束
					}
				}
			});
		}
		sendData = {
			pageSize: pageSize,
			pageNo: pageNo,
		};
		initTable (sendData);

		/*每页显示多少条*/
		$(".pagination").on("click", ".con_much>i", function()
		{
			var _this = $(this),
				_ul = _this.parents(".con_much").children("ul");

			_ul.css({"display": "block"});
			return false;
		});
		$(".pagination").on("click", "ul span", function ()
		{
			var _num = $(".pagination").find(".con_much .con_list_num"),
				_ul = $(".pagination").find(".con_much").children("ul");
			pageSize = $(this).html();
			_num.html(pageSize);
			_ul.css({"display": "none"});
			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				shelfName: $(".shelfName").val(),
				shelfCode:  $(".shelfCode").val(),
				id:$(".tree .clr-blue").parents("li").attr("treeId")
			};
			initTable (sendData);
			return false;
		});
		$(document).on("click", function(e)
		{
			var evn = e || window.event;
			if ($(evn.target).parents(".con_much").size() === 0)
			{
				$(".con_much ul").hide();
			}
		});
		//选择每页显示多少条事件


		//initTable ({pageSize: pageSize, pageNo: pageNo, id: 0});

		/*
		 *点击列表名称跳至编辑页
		 * */
		tbody.on("click",".shelfName",function(){
			var href = "strg-storage-goodsEdit.html",
				title = "编辑",
				data = {},
				libId = "";

			libId = $(this).parents("tr").attr("libId");
			data.libId = libId;
			window.layerViewData = data;
			window.layerShow(title,href);
		});

		/*
		 * 右侧按钮区按钮点击事件
		 * */
		//编辑
		tbody.on("click", ".btns .op", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				libId = "",
				shelfname="";

			libId = $(this).parents("tr").attr("libId");
			shelfname = $(this).parents("tr").attr("shelfname");
			data.libId = libId;
			data.shelfname = shelfname;
			data.strgRoomId = strgRoomId;
			data.strgRoomName = strgRoomName;
			window.layerViewData = data;
			window.layerShow(title,href);
		});
		//删除
		tbody.on("click", ".btns .del", function ()
		{
			var userId = "";
			userId = $(this).parents("tr").attr("libId");
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "operation/shelf/delete",
				data: {id: userId},
				success: function (data)
				{
					initTable({pageSize: pageSize,pageNo: pageNo})
					/*if (data && data.success === 0)
					{
						if(data.data == null || data.data == ""){
							layer.confirm('确定要删除吗？', {
									btn: ['确定','取消'],
									shade: 0.1
								},
								function()
								{
									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "operation/shelf/create",
										data: {ids: userId},
										success: function (data)
										{
											if (data && data.success === 0)
											{
												window.location.reload();
											}
										}
									});
								},
								function()
								{
									layer.msg('已取消', {icon:5,time:1000});
								});
						}else{
							layer.confirm('该货架下有子货架，不能删除', {
								btn: ['确定'],
								shade: 0.1
							});

					}}*/
				}
			});


		});

		/*
		 * 列表上侧按钮区按钮点击事件
		 * */
		//添加
		$(".btn-add").on("click", function ()
		{
			var data = {},
				treeId = $(".tree .clr-blue").parents("li").attr("treeId"),
				kfText = $(".tree .clr-blue").text();

			data.treeId = treeId;
			data.kfText = kfText;
			data.strgRoomId = strgRoomId;
			data.strgRoomName = strgRoomName;
			window.layerViewData = data;
			window.layerShow("添加","strg-storage-goodsAdd.html");
		});

		/*
		 * 按钮区查询事件
		*/
		//查询
		function findList()
		{
			var treeId = $(".tree .clr-blue").parents("li").attr("treeId");
			var shelfName = $(".shelfName").val();
			var shelfCode = $(".shelfCode").val();
			initTable({pageSize: pageSize,pageNo: pageNo,shelfName: shelfName,shelfCode:  shelfCode,id:treeId})

		}
		$(".btn-find").on("click", findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});

	});
}(jQuery, window, document));
