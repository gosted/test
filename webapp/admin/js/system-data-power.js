/**
 * 本文件的功能是数据权限列表页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tbody = $(".tbody"),
			pageSize = 20,
			pageNo = 1,
			userName = "",
			relativeI = "",
			arT = "",
			sendD = {};

		/*
		* setType渲染关联类型的方法，传入数组数据
		* */
		function setType (data)
		{
			var arType = $('[con_name="arType"]');
			arType.html("");
			arType.append('<option value="">请选择</option>');
			for (var i= 0, len=data.length; i<len; i++)
			{
				arType.append('<option value="'+
					data[i].dictCodeValue +'">'+
					data[i].dictCodeName +
					'</option>');
			}
		}
		/*
		* setTable渲染列表的方法，传入数组数据
		* */
		function setTable (data)
		{
			var OTr = null;
			tbody.html("");
			if (data.length === 0)
			{
				$(".no-data").show();
			}
			else
			{
				$(".no-data").hide();
			}
			for (var i= 0, len=data.length; i<len; i++)
			{
				OTr = $('<tr power_id="'+ data[i].id +
					'" relativeId="'+ data[i].relativeId +
					'" userName="'+ data[i].userName +
					'"></tr>');
				OTr.append('<td><input type="checkbox" value="" name=""></td>');
				OTr.append('<td class="text-l td-view relativeId">'+
					'<a class="text-primary" href="javascript:;">' + data[i].userName + '</a></td>');
				OTr.append('<td class="userRealName">' + data[i].userRealName + '</td>');
				OTr.append('<td class="arType">' + data[i].arType + '</td>');
				OTr.append('<td class="btns">'+'' +
					'<a style="text-decoration:none" class="mr-5 edit" href="javascript:;" title="编辑" _href="system-data-power-edit.html">' +
					'<i class="Hui-iconfont">&#xe70c;</i></a>'+
					'<a style="text-decoration:none" class="mr-5 c-warning delete" href="javascript:;" title="删除">' +
					'<i class="Hui-iconfont">&#xe6e2;</i></a>'+
					'</td>');
				tbody.append(OTr);
				if(i%2 == 0){
					OTr.css("background","#fff");
				}else{
					OTr.css("background","#eee");
				}
			}
		}

		/*渲染表格和分页的方法,传入要向后台传的数据*/
		function renderingPage (sendData)
		{
			var loading = "";
			loading = layer.msg('请稍后', {
				time: 0,
				icon: 16,
				shade: 0.1
			});
			/*
			 * 获取表格中数据
			 * */
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "preSupport/areaRelative/findPageDistinct",
				data: sendData,
				success: function (data)
				{
					if (data && data.success === 0)
					{
						layer.close(loading);
						setTable(data.data.result);
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
											userName: userName,
											arType: arT
										},
										loading = "";
									loading = layer.msg('请稍后', {
										time: 0,
										icon: 16,
										shade: 0.1
									});
									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "preSupport/areaRelative/findPageDistinct",
										data: sendData,
										success: function (data)
										{
											if (data && data.success === 0)
											{
												layer.close(loading);
												setTable(data.data.result);
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

		renderingPage({pageSize: pageSize, pageNo: pageNo});
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
			sendD = {
				pageSize: pageSize,
				pageNo: pageNo,
				userName: userName,
				arType: arT
			};
			renderingPage(sendD);
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
		/*每页显示多少条结束*/
		/*请求关联类型数据*/
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/dictionary/findDictionary",
			data: {dictCode: "SJQX"},
			success: function (data) {
				if (data && data.success === 0)
				{
					setType(data.data);
				}
			}
		});

		/*查询*/
		function findList()
		{
			var sendData = {};
			sendData.pageSize = pageSize;
			sendData.pageNo = pageNo;
			userName = $('[con_name="userName"]').val();
			arT = $('[con_name="arType"]').val();
			sendData.userName = userName;
			sendData.arType = arT;
			renderingPage(sendData);
		}
		$(".find-btn").on("click",findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});
		/*添加*/
		$(".btn-add").on("click",function ()
		{
			window.layerShow("添加","system-data-power-add.html");
		});
		/*
		 * 按钮区按钮点击事件
		 * */
		tbody.on("click", ".btns .edit", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				relativeId = "",
				userRealName = "",
				userName = "",
				arType = "";

			relativeId = $(this).parents("tr").attr("relativeId");
			userName = $(this).parents("tr").attr("userName");
			userRealName = $(this).parents("tr").find(".userRealName").text();
			arType = $(this).parents("tr").find(".arType").text();
			data.relativeId = relativeId;
			data.userName = userName;
			data.userRealName = userRealName;
			data.arType = arType;


			window.layerViewData = data;
			window.layerShow(title,href);
		});
		tbody.on("click", ".btns .delete", function ()
		{
			var _this = $(this);
			layer.confirm('确定要删除吗？', {
				btn: ['确定','取消'],
				shade: 0.1
			},
			function ()
			{
				var relativeId = "",
					arType = "",
					loading = "";

				relativeId = _this.parents("tr").attr("relativeId");
				arType = _this.parents("tr").find(".arType").html();
				loading = layer.msg('请稍后', {
					time: 0,
					icon: 16,
					shade: 0.1
				});
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "preSupport/areaRelative/delete",
					data: {relativeId: relativeId, arType: arType},
					dataType: "json",
					success: function(msg)
					{
						if (msg && msg.success === 0)
						{
							layer.close(loading);
							window.location.reload();
						}
						else
						{
							layer.confirm('操作失败', {
								btn: ['确定'],
								shade: 0.1
							});
						}
					},
					error: function (err)
					{
						layer.confirm('操作失败', {
							btn: ['确定'],
							shade: 0.1
						});
					}
				});
			});

		});
		/*
		 * 点需求单名进入查看详情页
		 * */
		tbody.on("click", ".td-view", function ()
		{
			var href = "system-data-power-edit.html",
			data = {},
				relativeId = "",
				userRealName = "",
				userName = "",
				arType = "";

			relativeId = $(this).parents("tr").attr("relativeId");
			userName = $(this).parents("tr").attr("userName");
			userRealName = $(this).parents("tr").find(".userRealName").text();
			arType = $(this).parents("tr").find(".arType").text();
			data.relativeId = relativeId;
			data.userName = userName;
			data.userRealName = userRealName;
			data.arType = arType;

			window.layerViewData = data;
			window.layerShow("编辑",href);
		});
	});
}(jQuery, window, document));
