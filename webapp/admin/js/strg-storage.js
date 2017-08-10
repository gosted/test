/**
 * 本文件是入库单列表页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			storelistCode = "",
			storelistName = "",
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
			var ASource = [{
				"type": "RKLX-HT",
				"url": "strg-contract-storage.html",
				"viewUrl": "strg-contract-storage-view.html"
			},{
				"type": "RKLX-GD",
				"url": "strg-work-order-storage.html",
				"viewUrl": "strg-work-order-storage-view.html"
			},{
				"type": "RKLX-QT",
				"url": "strg-unfounded-storage.html",
				"viewUrl": "strg-unfounded-storage-view.html"
			}];
			$.each(list, function (i, v)
			{
				var storelistId = v.id,
					OpTitle = "",
					OpUrl = "",
					viewUrl = "",
					storeState = "",
					source = $('<td><div class="code text-l"></div><div class="state"></div></td>'),
					view = $('<a href="javascript:;"></a>'),
					storeBtn = '',
					arr = [{
						"type": "RKLX-HT",
						"name": "合同"
					},{
						"type": "RKLX-GD",
						"name": "工单"
					},{
						"type": "RKLX-QT",
						"name": "其他"
					}];

				for (var j = 0, l = ASource.length; j < l; j++)
				{
					if (v.storelistType === ASource[j].type)
					{
						OpUrl = ASource[j].url;
						viewUrl = ASource[j].viewUrl;
						break;
					}
				}

				STr = $('<tr class="text-c" storelistId="'+ storelistId
					+'" sourceId="'+ v.sourceId
					+'" storageId="'+ v.storageId
					+'" storelistType="'+ v.storelistType
					+'" storeState="'+ v.storeState
					+'"></tr>');//一行
				STr.append('<td><input type="checkbox" value="" name=""></td>');
				STr.append($('<td class="text-l td-view"></td>').append(view.text(v.storelistName || "")));
				STr.append($('<td></td>').text(v.storelistCode || ""));
				STr.append($('<td></td>').text(v.storelistRecorder || ""));
				STr.append($('<td></td>').text(window.formatDates(v.storelistRecordTime) || ""));
				for (var k = 0, le = arr.length; k < le; k++)
				{
					if (v.storelistType === arr[k].type)
					{
						source.find('.code').text(arr[k].name + ':' + (v.sourceCode|| "--"));
						break;
					}
				}
				if (v.storeState === 0)
				{
					storeState = '完成入库';
				}
				else if (v.storeState === 1)
				{
					storeState = '待入库';
					storeBtn = '<a style="text-decoration:none" class="mr-5 store" href="javascript:;" title="入库" _href="'+ OpUrl +'">'+
						'<i class="fa fa-sign-in fa-lg" aria-hidden="true"></i></a>';
				}
				else
				{
					storeState = '入库中';
					storeBtn = '<a style="text-decoration:none" class="mr-5 store" href="javascript:;" title="入库" _href="'+ OpUrl +'">'+
						'<i class="fa fa-sign-in fa-lg" aria-hidden="true"></i></a>';
				}
				source.find('.state').text(storeState);
				STr.append(source);

				var tmpBtn = '<td class="btns text-r">';
				tmpBtn += storeBtn;

				tmpBtn += '<a style="text-decoration:none" class="mr-5 deal" href="javascript:;" title="编辑" _href="strg-storage-edit.html">'+
					'<i class="Hui-iconfont">&#xe70c;</i></a>';

				tmpBtn += '<a style="text-decoration:none" class="mr-5 see" href="javascript:;" _href="'+ viewUrl +'" title="查看">'+
					'<i class="fa fa-eye" aria-hidden="true"></i></a>';

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
				url: window.ajaxUrl + "operation/storelist/findPageWithAuth",
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
									storelistCode ? sendData.storelistCode = storelistCode : false;
									storelistName ? sendData.storelistName = storelistName : false;

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "operation/storelist/findPageWithAuth",
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
			storelistCode ? sendData.storelistCode = storelistCode : false;
			storelistName ? sendData.storelistName = storelistName : false;
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

			storelistCode = search.find('[con_name="storelistCode"]').val();
			storelistName = search.find('[con_name="storelistName"]').val();

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo
			};

			storelistCode ? sendData.storelistCode = storelistCode : false;
			storelistName ? sendData.storelistName = storelistName : false;
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
				storelistId = "",
				sourceId = "",
				storageId = "",
				storeState = "";

			if (!href)
			{
				return false;
			}
			storelistId = $(this).parents("tr").attr("storelistId");
			sourceId = $(this).parents("tr").attr("sourceId");
			storageId = $(this).parents("tr").attr("storageId");
			storeState = $(this).parents("tr").attr("storeState");
			data.storelistId = storelistId;
			data.sourceId = sourceId;
			data.storageId = storageId;
			data.storeState = storeState;
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
					var storelistId = "";

					storelistId = _this.parents("tr").attr("storelistId");

					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "operation/storelist/deleteByIds",
						data: {ids: storelistId},
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
			$(this).parents("tr").find(".store").click();
		});
		/*添加*/
		$(".btn-add").on("click",function ()
		{
			window.layerShow("添加","strg-storage-add.html");
		});

	});
}(jQuery, window, document));
