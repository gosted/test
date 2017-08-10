/**
 * 本文件的功能是出库单js文件
 *@ author 王步华
 */

(function($, w, d){
	'use strict';

	$(function() {
		var	tbody = $(".tbody"),
			pageSize = 20,
			pageNo = 1,
			first = true,
			sendData ={};

		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "project/workOrder/findTodoTasks",
			data: {},
			success: function (data) {
				if (data && data.success === 0) {
					var dataResult = data.data.result;
					if(dataResult == "" || null){
						$(".lib-search").find(".c-red").css("display", "none");
					}else {
						$(".lib-search").find(".c-red").css("display", "block");
					}
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
			if(list != "" || null){
				$(".no-data").hide();
				$.each(list, function (i, v)
				{
					var outOrderTime = ((v.outOrderTime == null || "" || undefined) ? "" : window.formatDates(v.outOrderTime));
					STr = $('<tr class="text-c" libId="'+ v.id+'" outOrderState="'+ v.outOrderState+'"></tr>');//一行

					STr.append($('<td class="text-l pl-3 outOrderName"></td>').text(v.outOrderName || ""));

					STr.append($('<td></td>').text(v.outOrderCode || ""));

					STr.append($('<td></td>').text(v.outOrderContacts || ""));

					STr.append($('<td></td>').text(outOrderTime || ""));

					STr.append($('<td></td>').text(v.outOrderType || ""));

					if(v.outOrderState === "0" || v.outOrderState === "1"){
						STr.append('<td class="btns text-r">' +
							'<a style="text-decoration:none" class="mr-5 theLibrary" href="javascript:;" title="出库" _href="strg-storage-outstock-theLibrary.html">'+
							'<i class="fa fa-sign-out fa-lg" aria-hidden="true"></i></a>'+

							'<a style="text-decoration:none" class="mr-5 edit" href="javascript:;" title="编辑" _href="strg-storage-outstockEdit.html">'+
							'<i class="Hui-iconfont">&#xe70c;</i></a>'+

							'<a style="text-decoration:none" class="mr-5 del" href="javascript:;" title="删除">'+
							'<i class="Hui-iconfont">&#xe6e2;</i></a>'+
							'</td>');
					}else {
						STr.append('<td class="btns text-r">' +
							'<a style="text-decoration:none" class="mr-5 see" href="javascript:;" title="查看" _href="strg-storage-outstock-see.html">'+
							'<i class="fa fa-eye" aria-hidden="true"></i></a>'+
							/*'<a style="text-decoration:none" class="mr-5 edit" href="javascript:;" title="编辑" _href="strg-storage-outstockEdit.html">'+
							'<i class="Hui-iconfont">&#xe70c;</i></a>'+*/
							'<a style="text-decoration:none" class="mr-5 del" href="javascript:;" title="删除">'+
							'<i class="Hui-iconfont">&#xe6e2;</i></a>'+
							'</td>');
					}
					tbody.append(STr);
					/*
					 * tr颜色间隔问题
					 * */
					var trs = tbody.find("tr");
					for(var i=0; i<trs.length;i++){
						if(i%2 == 0){
							trs.eq(i).css("background","#fff");
						}else{
							trs.eq(i).css("background","#eee");
						}
					}
				});
			}else{
				$(".no-data").show();
			}
		}



		/*
		 * 获取表格中数据
		 * */
		function initTable (obj)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "operation/outboundorder/findPage",
				data: {
					pageSize: obj.pageSize,
					pageNo: obj.pageNo,
					outOrderName: $(".outOrderName").val(),
					outOrderCode:$(".outOrderCode").val()
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
										outOrderName: $(".outOrderName").val(),
										outOrderCode:  $(".outOrderCode").val()
									};

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "operation/outboundorder/findPage",
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
				outOrderName: $(".outOrderName").val(),
				outOrderCode:  $(".outOrderCode").val()
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

		/*
		*点击列表名称跳至查看页
		* */
		/*tbody.on("click",".outOrderName",function(){
			var href = "strg-storage-outstock-see.html",
				title = "查看",
				data = {},
				libId = "";

			libId = $(this).parents("tr").attr("libId");
			data.libId = libId;
			window.layerViewData = data;
			window.layerShow(title,href);
		});*/

		  /*
		  *右侧按钮区按钮点击事件
		  */

		//出库
		tbody.on("click", ".btns .theLibrary", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				libId = "";

			libId = $(this).parents("tr").attr("libId");
			data.libId = libId;
			window.layerViewData = data;
			window.layerShow(title,href);
		});

		/*//出库完成
		tbody.on("click",".btns .completion", function(){
			var sendData = {};
				sendData.workOrderId= $.cookie("lzg_projectId");
				sendData.step=3;
				sendData.workType=1;
				sendData.taskId= $.cookie("lzg_taskId");
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "project/workOrder/approval",
				data: sendData,
				success: function (data) {
					if (data && data.success === 0) {
						 $.cookie("lzg_taskId",null);
						 $.cookie("lzg_projectId",null);
					}
				}
			});
		})*/

		//编辑
		tbody.on("click", ".btns .edit", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				outOrderState="",
				libId = "";

			libId = $(this).parents("tr").attr("libId");
			outOrderState = $(this).parents("tr").attr("outOrderState");
			data.libId = libId;
			data.outOrderState = outOrderState;
			window.layerViewData = data;
			window.layerShow(title,href);
		});

		//查看
		tbody.on("click", ".btns .see", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				libId = "";

			libId = $(this).parents("tr").attr("libId");
			data.libId = libId;
			window.layerViewData = data;
			window.layerShow(title,href);
		});

		 //删除
		tbody.on("click", ".btns .del", function ()
		{
			var userId = "";
			userId = $(this).parents("tr").attr("libId");
			layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function() {
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "operation/outboundorder/delete",
						data: {id: userId},
						success: function (data) {
							if (data && data.success === 0) {
								window.location.reload();
							}
						}
					});
				},
				function(){

				});

		});

		/*
		 * 列表上侧按钮区按钮点击事件
		 * */
		//添加
		$(".btn-add").on("click", function ()
		{
			window.layerShow("添加","strg-storage-outstockAdd.html");
		});

		/*
		 * 按钮区查询事件
		*/
		//查询
		function findList()
		{
			var outOrderName = $(".outOrderName").val();
			var outOrderCode = $(".outOrderCode").val();
			initTable({pageSize: pageSize,pageNo: pageNo,outOrderName:outOrderName,outOrderCode:outOrderCode})
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
