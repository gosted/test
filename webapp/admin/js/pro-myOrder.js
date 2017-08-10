/**
 * 本文件是我的工单列表js文件
 * @ author 孙倩
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			workOrderNum = "",
			workOrderName = "",
			project="",
			subProject="",
			site="",
			workType="",
			//workTypenext="",
			startTime="",
			endTime="",
			tbody = $(".tbody"),
			windowData = {};

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
				var orderId = v.id,
					workType= v.workType,
					myWorkType="",
					nextAddress="",
					view = $('<a href="javascript:;"></a>');
				nextAddress="pro-myOrder-constructOrderDetail.html";
				if(v.workType==2)
				{
					myWorkType="施工工单";
				}
				else if(v.workType==1)
				{
					myWorkType="出库工单";
				}
				else
				{
					myWorkType="通用工单";
				}

				STr = $('<tr class="text-c" orderId="'+ orderId +'"'+'workType="'+ v.workType +'" taskId="'+v.taskId
						+'"processInstanceId="'+ v.workFlowId+'"></tr>');//一行
				STr.append('<td><input type="checkbox" value="" name=""></td>');

				STr.append($('<td class="td-view text-l"></td>').append(view.text(v.workOrderName)));
				STr.append($('<td></td>').text(v.workOrderNum  || ""));
				STr.append($('<td class="workType"></td>').text(myWorkType));
				STr.append($('<td></td>').text(v.project  || ""));
				STr.append($('<td></td>').text(v.site  || ""));
				STr.append($('<td></td>').text(v.subProject  || ""));
				STr.append($('<td></td>').text(v.workFlowStep  || ""));
				STr.append($('<td></td>').text(window.formatDate(new Date(v.createTime)||"")));
	



				var tmpBtn = '<td class="btns">';
				tmpBtn += '<a style="text-decoration:none" class="deal" href="javascript:;" title="查看详情" _href="'+nextAddress+'">'+
					'<i class="fa fa-eye" aria-hidden="true"></i></a></td>';


				//设置不同workType button的href为不同的页面


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
									workOrderNum ? sendData.workOrderNum = workOrderNum : false;
									workOrderName ? sendData.workOrderName = workOrderName: false;
									workType ? sendData.workType = workType: false;
									startTime ? sendData.startTime = startTime: false;
									endTime ? sendData. endTime = endTime: false;
									site ? sendData.site = site: false;
									subProject? sendData.subProject =subProject: false;
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
			workOrderNum ? sendData.workOrderNum = workOrderNum : false;
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
			var search = $(".search-area-my"),
				sendData = {};
			workOrderNum= search.find('[con_name="workOrderNum"]').val();
			project= search.find('[con_name="project"]').val();
			workType=search.find('[con_name="workType"]').val();
			startTime=search.find('[con_name="startTime"]').val();
			endTime=search.find('[con_name="endTime"]').val();
			site=search.find('[con_name="site"]').val();
			subProject=search.find('[con_name="subProject"]').val();
			sendData = {
				pageSize: pageSize,
				pageNo: pageNo
			};

			workOrderNum ? sendData.workOrderNum = workOrderNum : false;
			project ? sendData.project = project: false;
			workType ? sendData.workType = workType: false;
			startTime ? sendData.startTime = startTime: false;
			endTime ? sendData. endTime = endTime: false;
			site ? sendData.site = site: false;
			subProject? sendData.subProject =subProject: false;
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
				workTypes="",
				orderId = "";
			var workType=$(this).parents("tr").find(".workType").text();
			if (!href)
			{
				return false;
			}
			orderId=$(this).parents("tr").attr("orderId");
			workTypes=$(this).parents("tr").attr("workType");
			windowData.orderId = orderId;
			windowData.workTypes = workTypes;
			windowData.taskId = $(this).parents("tr").attr("taskId");
			windowData.processInstanceId = $(this).parents("tr").attr("processInstanceId");
			if(workTypes==1)
			{
				windowData.tabArr = [
					{
						title: "工单基本信息",
						src: "pro-myOrder-storageOrderBasicInfo.html",
						color: "blue",
						selected: true
					},
					{
						title: "业务日志",
						src: "pro-myOrder-storageOrderLogDetails.html",
						color: "blue"
					},
					{
						title: "流程跟踪",
						src: "pro-myOrder-storageOrderProcess.html",
						color: "blue"
					}

				];
			}
			else if(workTypes==2)
			{
				windowData.tabArr = [
					{
						title: "施工工单",
						src: "pro-myOrder-constructOrderConList.html",
						color: "blue",
						selected: true
					},
					{
						title: "施工方案",
						src: "pro-myOrder-constructOrderConMeans.html",
						color: "blue"
					},
					{
						title: "资产登记",
						src: "pro-myOrder-constructOrderPropertyAssign.html",
						color: "blue"
					},
					{
						title: "完工资料",
						src: "pro-myOrder-constructOrderCompletion.html",
						color: "blue"
					},
					{
						title: "业务日志",
						src: "pro-myOrder-storageOrderLogDetails.html",
						color: "blue"
					},
					{
						title: "流程跟踪",
						src: "pro-myOrder-storageOrderProcess.html",
						color: "blue"
					}

				];
			}
			else
			{
				windowData.tabArr = [
					{
						title: "工单信息",
						src: "pro-currency-info.html",
						color: "blue",
						selected: true
					},
					{
						title: "业务日志",
						src: "pro-myOrder-storageOrderLogDetails.html",
						color: "blue"
					},
					{
						title: "流程跟踪",
						src: "pro-myOrder-storageOrderProcess.html",
						color: "blue"
					}

				];
			}
			window.layerViewData = windowData;
			window.layerShow(title,href);
		});
		//点名称进查看页
		tbody.on("click", ".td-view a", function ()
		{
			$(this).parents("tr").find(".deal").click();
		});
	});
}(jQuery, window, document));
