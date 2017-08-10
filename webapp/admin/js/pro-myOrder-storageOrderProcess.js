/**
 * 本文件是我的出库工单流程跟踪js文件
 * @ author 孙倩
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			datas="",
			tbody = $(".tbody");
		
		   var orderId = parent.window.layerViewData.orderId,
		     taskId = parent.window.layerViewData.taskId,
	         processInstanceId = parent.window.layerViewData.processInstanceId;
	        var img = $("#img").find("img");
	        img.attr("src",window.ajaxUrl + "project/workOrder/graphHistoryProcessInstance/"+processInstanceId+"");
		/*
		 * 渲染表格方法传入请求到的数据
		 * */
		function setTable (data)
		{
			var list = [],
				tbody = $(".tbody"),
				STr = null;

			list = data.data.historicTasks;


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
				var orderId = v.id,
					workType= v.workType,
					view = $('<a href="javascript:;"></a>');
				var timeDateStartTime = new Date(v.startTime);
				var timeDateEndTime = new Date(v.endTime);
				if(v.startTime == null || v.startTime == "")
			{
				timeDateStartTime = "";
			}
				else
				{
					timeDateStartTime = window.formatDateTimesec(timeDateStartTime);
				}
				if(v.endTime == null || v.endTime == "")
			{
				timeDateEndTime = "";
			}
				else
				{
					timeDateEndTime = window.formatDateTimesec(timeDateEndTime);
				}

				STr = $('<tr class="text-c" orderId="'+ orderId +'"></tr>');//一行
				STr.append($('<td></td>').text(v.name));
				STr.append($('<td></td>').text(timeDateStartTime));
				STr.append($('<td></td>').text(timeDateEndTime));
				STr.append($('<td></td>').text(v.assignee!=null?v.assignee:''));
				STr.append($('<td></td>').text(v.deleteReason));

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
				type: "GET",
				url: window.ajaxUrl +"project/workOrder/viewHistory/"+processInstanceId,
				data: sendData,
				success: function (data) {
					if (data && data.success === 0) {
						setTable(data);

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
			workOrderCode ? sendData.workOrderCode = workOrderCode : false;
			workOrderName ? sendData.workOrderName = workOrderName: false;
			workType ? sendData.workType = workType: false;
			startTime ? sendData.startTime = startTime: false;
			endTime ? sendData. endTime = endTime: false;
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

			workOrderCode= search.find('[con_name="workOrderCode"]').val();
			workOrderName= search.find('[con_name="workOrderName"]').val();
            workType=search.find('[con_name="workType"]').val();
            startTime=search.find('[con_name="startTime"]').val();
            endTime=search.find('[con_name="endTime"]').val();
			sendData = {
				pageSize: pageSize,
				pageNo: pageNo
			};

			workOrderCode ? sendData.workOrderCode = workOrderCode : false;
			workOrderName ? sendData.workOrderName = workOrderName: false;
			workType ? sendData.workType = workType: false;
			startTime ? sendData.startTime = startTime: false;
			endTime ? sendData. endTime = endTime: false;
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
				orderId = "";
			workType=$(this).parents("tr").find(".workType").text();
			if (!href)
			{
				return false;
			}
			orderId=$(this).parents("tr").attr("orderId");
			data.orderId = orderId;
			window.layerViewData = data;
			window.layerShow(title,href);
		});

		//点名称进编辑页
		tbody.on("click", ".td-view a", function ()
		{
			$(this).parents("tr").find(".deal").click();
		});

		/*添加*/
		$(".btn-add").on("click",function ()
		{
			window.layerShow("添加","pro-project-add.html");
		});

	});
}(jQuery, window, document));
