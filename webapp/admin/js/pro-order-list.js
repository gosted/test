/**
 * 本文件是工单列表js文件
 * @ author 鲍哲
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			projectCode = "",
			projectName = "",
			tbody = $(".tbody");
		var workType = window.parent.layerViewData.workType,
			subProjectId = window.parent.layerViewData.subProjectId,
			projectName = window.parent.layerViewData.projectName,
			subProjectName = window.parent.layerViewData.subProjectName;

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
				var workOrderId = v.id,
					view = $('<a href="javascript:;"></a>');

				STr = $('<tr class="text-c" workOrderType = "'+v.workType
					+'" workOrderId="'+ workOrderId
					+'" workOrderNum="'+ v.workOrderNum
					+'" workOrderName="'+ v.workOrderName
					+'"></tr>');//一行
				STr.append('<td><input type="checkbox" value="" name=""></td>');
				STr.append($('<td></td>').text(v.workOrderName=null?"":v.workOrderName));
				STr.append($('<td></td>').text(v.workOrderNum=null?"":v.workOrderNum));
				STr.append($('<td></td>').text(projectName));
				STr.append($('<td></td>').text(subProjectName));
				STr.append($('<td></td>').text(v.site=null?"":v.site));
				STr.append($('<td></td>').text(v.workFlowStep=null?"":v.workFlowStep));
				var tmpBtn = '<td class="btns">';
				tmpBtn += '<a style="text-decoration:none" class="ml-5 sure" href="javascript:;" title="选择">'+
					'<i class="fa fa-check-square-o fa-lg" aria-hidden="true"></i></a>' +
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
				url: window.ajaxUrl + "project/workOrder/findHistoryTasks1",
				data: sendData,
				success: function (data) {
					if (data && data.success === 0) {
						setTable(data);
						//分页
						laypage({
							cont: $('#pagination'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
							pages: data.data.pageCount, //通过后台拿到的总页数
							curr: data.data.pageNo || 1, //当前页
							first: false,
							last: false,
							skip: true, //是否开启跳页
							jump: function(obj, first){ //触发分页后的回调
								if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
									var sendData = {
										pageSize: pageSize,
										workType:workType,
										subProjectId:subProjectId,
										workOrderName:$(".search-area").find('[con_name="workOrderName"]').val(),
										workOrderNum:$(".search-area").find('[con_name="workOrderNum"]').val(),
										view:1,
										pageNo: obj.curr

									};

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "project/workOrder/findHistoryTasks1",
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
								'<li class="con_num_10"><span>10</span></li>'+
								'<li class="con_num_20"><span>20</span></li>'+
								'<li class="con_num_50"><span>50</span></li>'+
								'<li class="con_num_100"><span>100</span></li>'+
								'<li class="con_num_200"><span>200</span></li>'+
								'<li class="con_num_1000"><span>1000</span></li>'+
								'</ul>'+
								'</div>');
							$('.pagination').append("<div class='con_altogether'><span>共<span class='allpage'>"+data.data.totalCount+"</span>条</span></div>");
						}
						$(".allpage").text(data.data.totalCount);
					}
				}
			});
		}

		renderingPage({
			pageSize: pageSize,
			pageNo: pageNo,
			subProjectId:subProjectId,
			workType:workType,
			view:1
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
			var search = $(".search-area");
			var workOrderName = search.find('[con_name="workOrderName"]').val();
			var workOrderNum = search.find('[con_name="workOrderNum"]').val();
			pageSize = $(this).html();
			_num.html(pageSize);
			_ul.css({"display": "none"});

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				subProjectId:subProjectId,
				workOrderName:workOrderName,
				workOrderNum:workOrderNum,
				workType:workType,

			};
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
			var workOrderName = search.find('[con_name="workOrderName"]').val();
			var workOrderNum = search.find('[con_name="workOrderNum"]').val();
			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				subProjectId:subProjectId,
				workType:workType,
				view:1
			};
			workOrderName ? sendData.workOrderName = workOrderName : false;
			workOrderNum ? sendData.workOrderNum = workOrderNum : false;
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
		tbody.on("click", ".btns .sure", function ()
		{
			var _this = $(this),
				workOrderId = $(this).parents("tr").attr("workOrderId"),
				workOrderName = $(this).parents("tr").attr("workOrderName"),
				workOrderNum = $(this).parents("tr").attr("workOrderNum"),
				workOrderType = $(this).parents("tr").attr("workOrderType"),
				parentBody = parent.window.document.body,
				relevant = null;
			relevant = $(parentBody).find('.relevant');
			relevant.val(workOrderNum).attr({
				"workOrderId": workOrderId,
				"workOrderName": workOrderName,
				"workOrderNum": workOrderNum,
				"workOrderType": workOrderType
			});
			layer_close();
		});
	});
}(jQuery, window, document));
