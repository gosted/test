/**
 * 本文件是库房定义页js文件
 * @author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			storageCode = "",
			storageName = "",
			tbody = $(".tbody");

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
			if (list.length === 0)
			{
				$(".no-data").show();
			}
			else
			{
				$(".no-data").hide();
			}

			$.each(list, function (i, v)
			{
				var strgRoomId = v.id,
					view = $('<a href="javascript:;"></a>');

				STr = $('<tr class="text-c" strgRoomId="'+ strgRoomId+'"></tr>');//一行
				STr.append('<td><input type="checkbox" value="" name=""></td>');
				STr.append($('<td></td>').text(v.storageCode || ""));
				STr.append($('<td class="text-l td-view"></td>').append(view.text(v.storageName || "")));
				STr.append($('<td></td>').text(v.storageContacts || ""));
				STr.append($('<td></td>').text(v.storagePhone || ""));
				STr.append($('<td class="text-l"></td>').text(v.storageAddr || ""));
				STr.append($('<td class="text-l"></td>').text(v.areaName || ""));
				STr.append($('<td class="text-l"></td>').text(v.storageRemark || ""));
				var tmpBtn = '<td class="btns">';
				tmpBtn += '<a style="text-decoration:none" class="mr-5 deal" href="javascript:;" title="修改" _href="strg-storage-room-edit.html">'+
					'<i class="Hui-iconfont">&#xe70c;</i></a>';

				tmpBtn += '<a style="text-decoration:none" class="mr-5 point" href="javascript:;" title="指定库房管理员">'+
					'<i class="Hui-iconfont">&#xe705</i></a>';

				/*tmpBtn += '<a style="text-decoration:none" class="mr-5" href="javascript:;" title="查看库存" _href="strg-view-list.html">'+
					'<i class="fa fa-eye fa-lg" aria-hidden="true"></i></a>';

				tmpBtn += '<a style="text-decoration:none" class="mr-5" href="javascript:;" title="查看布局" _href="strg-storage-room-view.html">'+
					'<i class="fa fa-building fa-lg" aria-hidden="true"></i></a>';

				tmpBtn += '<a style="text-decoration:none" class="mr-5" href="javascript:;" title="货架" _href="strg-storage-goodsShelves.html">'+
					'<i class="fa fa-cubes fa-lg" aria-hidden="true"></i></a>';*/

				tmpBtn += '<a style="text-decoration:none" class="mr-5 c-warning delete" href="javascript:;" title="删除">'+
					'<i class="Hui-iconfont">&#xe6e2;</i></a>' +
					'</td>';

				STr.append(tmpBtn);

				tbody.append(STr);
				/*
				 * tr颜色间隔问题
				 * */
				if(i%2 == 0){
					STr.css("background","#fff");
				}else{
					STr.css("background","#eee");
				}
			});
		}


		/*渲染表格和分页的方法,传入要向后台传的数据*/
		function renderingPage (sendData)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "operation/storage/findPage",
				data: sendData,
				success: function (data) {
					if (data && data.success === 0) {
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
										pageNo: obj.curr
									};
									storageCode ? sendData.storageCode = storageCode : false;
									storageName ? sendData.storageName = storageName : false;

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "operation/storage/findPage",
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

		renderingPage({
			pageSize: pageSize,
			pageNo: pageNo
		});

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
				_ul = $(".pagination").find(".con_much").children("ul"),
				sendData = {};
			pageSize = $(this).html();
			_num.html(pageSize);
			_ul.css({"display": "none"});

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo
			};
			storageCode ? sendData.storageCode = storageCode : false;
			storageName ? sendData.storageName = storageName : false;
			renderingPage(sendData);
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

		/*
		 * 查询方法
		 * */
		function findList()
		{
			var search = $(".search-area"),
				sendData = {};

			storageCode = search.find('[con_name="storageCode"]').val();
			storageName = search.find('[con_name="storageName"]').val();

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo
			};

			storageCode ? sendData.storageCode = storageCode : false;
			storageName ? sendData.storageName = storageName : false;
			renderingPage(sendData);
		}
		$(".find-btn").on("click", findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});

		/*
		 * 列表内按钮区按钮点击事件
		 * */
		tbody.on("click", ".btns a", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				strgRoomId = "",
				strgRoomName = "";

			if (!href)
			{
				return false;
			}
			strgRoomId = $(this).parents("tr").attr("strgRoomId");
			strgRoomName = $(this).parents("tr").find(".td-view a").eq(0).text();
			data.strgRoomId = strgRoomId;
			data.strgRoomName = strgRoomName;
			window.layerViewData = data;
			window.layerShow(title,href);
		});

		/*指定库房管理员*/
		tbody.on("click", ".btns .point", function ()
		{
			var title = $(this).attr("title"),
				data = {},
				strgRoomId = "",
				strgRoomName = "";

			strgRoomId = $(this).parents("tr").attr("strgRoomId");
			strgRoomName = $(this).parents("tr").find(".td-view a").eq(0).text();
			data.strgRoomId = strgRoomId;
			data.strgRoomName = strgRoomName;
			window.layerViewData = data;
			window.layerShow(title,"strg-storage-assignManager.html",null,null,true);
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
					var strgRoomId = "";

					strgRoomId = _this.parents("tr").attr("strgRoomId");

					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "operation/storage/deleteByIds",
						data: {ids: strgRoomId},
						dataType: "json",
						success: function(msg)
						{
							if (msg && msg.success === 0)
							{
								window.location.reload();
							}
						}
					});
				});

		});
		//点名称进编辑页
		tbody.on("click", ".td-view a", function ()
		{
			$(this).parents("tr").find(".deal").click();
		});

		/*添加*/
		$(".btn-add").on("click",function ()
		{
			window.layerShow("添加","strg-storage-room-add.html");
		});

	});
}(jQuery, window, document));
