/**
 * 本文件是我的施工工单资产登记js文件
 * @ author 孙倩
 */

(function($, w, d){
	'use strict';

	$(function() {
		var orderId = window.parent.layerViewData.orderId,
			pageSize = 20,
			pageNo = 1,
			assetName = "",
			assetCode = "",
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
				var view = $('<a href="javascript:;"></a>');

				STr = $('<tr class="text-c" listId="'+ v.id
					+'" equipmentName="'+ v.equipmentName
					+'" assetStatus="'+ v.assetStatus
					+'" assetCode="'+ v.assetCode
					+'"></tr>');//一行
				STr.append('<td><input type="checkbox" value="" name=""></td>');

				STr.append($('<td class="td-view text-c"></td>').append(view.text(v.assetName || "")));
				STr.append($('<td></td>').text(v.assetCode || ""));
				STr.append($('<td class="text-l"></td>').text(v.assetTrackInfos ? (JSON.parse(v.assetTrackInfos).assetPosition || "") : ""));
				STr.append($('<td></td>').text(v.assetTrackInfos ? (JSON.parse(v.assetTrackInfos).installPeople || "") : ""));
				STr.append($('<td></td>').text(v.assetTrackInfos ? (JSON.parse(v.assetTrackInfos).installTime || "") : ""));
				STr.append($('<td></td>').text(v.remark || ""));
				var tmpBtn = '<td class="btns">';

				tmpBtn += '<a style="text-decoration:none" class="mr-5 see" href="javascript:;" _href="../assetManage/asset-check-lifeCycle.html" title="查看">'+
					'<i class="fa fa-eye" aria-hidden="true"></i></a>' +
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
				url: window.ajaxUrl + "project/assetRegistration/findPageTracking",
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
										pageNo: obj.curr,
										relativeId: orderId
									};
									assetName ? sendData.assetName = assetName : false;
									assetCode ? sendData.assetCode = assetCode : false;

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "project/assetRegistration/findPageTracking",
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
			pageNo: pageNo,
			relativeId: orderId
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
				pageNo: pageNo,
				relativeId: orderId
			};
			assetName ? sendData.assetName = assetName : false;
			assetCode ? sendData.assetCode = assetCode : false;
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

			assetName = search.find('[con_name="assetName"]').val();
			assetCode = search.find('[con_name="assetCode"]').val();

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				relativeId: orderId
			};

			assetName ? sendData.assetName = assetName : false;
			assetCode ? sendData.assetCode = assetCode : false;
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
				assetCo = '';

			if (!href)
			{
				return false;
			}
			assetCo = $(this).parents("tr").attr("assetCode");
			window.layerViewData = {};
			window.layerViewData.assetCo = assetCo;
			window.layerShow(title,href);
		});

		//点名称进编辑页
		tbody.on("click", ".td-view a", function ()
		{
			$(this).parents("tr").find(".see").click();
		});
	});
}(jQuery, window, document));
