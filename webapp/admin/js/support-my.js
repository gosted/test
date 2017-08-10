/**
 * 本文件的功能是我的支撑页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tbody = $(".tbody"),
			pageSize = 20,
			pageNo = 1,
			sendD = {},
			reqN = "",
			customerN = "",
			startT = "",
			endT = "",
			reqSupT= "";

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
				var reqIsImportant = v.reqIsImportant,
					reqSupType = v.reqSupType,
					reqName = "",
					clr = "";

				STr = $('<tr class="text-c" reqId="'+ v.id+'" taskId="'+
					v.taskId+'" processInstanceId="'+ v.jobFlowInstanceId+'" customerId="'+
					v.customerId+'" reqCode="'+ v.reqCode+'" reqSupType = "'+v.reqSupType+'"></tr>');//一行

				STr.append('<td><input type="checkbox" value="" name=""></td>');
				switch(reqSupType)
				{
					case "0":reqName = "[项目支撑]";break;
					case "1":reqName = "[展会支撑]";break;
					case "2":reqName = "[培训支撑]";break;
					default:reqName = "[其它支撑]";break;
				}

				if(reqIsImportant == 1)
				{
					if (v.reqIsSpot == 1)
					{
						STr.append('<td class="text-l td-view">'+
							'<a class="text-primary" href="javascript:;">'+
							reqName + "[重大]" + "[现场] " + v.reqName +
							'</a></td>');
					}
					else
					{
						STr.append('<td class="text-l td-view">'+
							'<a class="text-primary" href="javascript:;">'+
							reqName + "[重大] " + v.reqName +
							'</a></td>');
					}
				}
				else
				{
					if (v.reqIsSpot == 1)
					{
						STr.append('<td class="text-l td-view">'+
							'<a class="text-primary" href="javascript:;">'+
							reqName + "[现场] " + v.reqName +
							'</a></td>');
					}
					else
					{
						STr.append('<td class="text-l td-view">'+
							'<a class="text-primary" href="javascript:;">'+
							reqName + " " + v.reqName+
							'</a></td>');
					}
				}
				STr.append('<td>' + v.reqCode + '</td>');
				var tmpCustomerName =v.customerName;
				if(tmpCustomerName==null || tmpCustomerName=='null')
					tmpCustomerName = '&nbsp;';
				
				STr.append('<td>' + tmpCustomerName + '</td>');
				STr.append('<td>' + window.formatDates(v.reqSubTime) + '</td>');
				if (v.reqProcessState === "填写需求单")
				{
					clr = "clr-blue";
				}
				else if (v.reqProcessState === "跟踪反馈")
				{
					clr = "shen-yellow";
				}
				else if (v.reqProcessState === "负责人审批")
				{
					clr = "qian-yellow";
				}
				else if (v.reqProcessState === "制定支撑方案")
				{
					clr = "qian-blue";
				}
				else if (v.reqProcessState === "业务经理受理")
				{
					clr = "green";
				}
				else if (v.reqProcessState === "结束")
				{
					clr = "black";
				}
				else
				{
					clr = "zi-blue";
				}
				STr.append('<td class="td-status">'+
					'<span class="label radius reqState '+clr+'">'+ v.reqProcessState+'</span></td>');
				var tmpBtn = '<td class="btns">';
				var userRoleArr = typeof (v.userRole) == 'string' ? v.userRole.split(",") : [];
				for (var j = 0, l = userRoleArr.length; j < l; j++)
				{
					if (userRoleArr[j] === "YWJL")
					{
						tmpBtn += '<a style="text-decoration:none" class="ml-5" href="javascript:;" title="发起跟踪" _href="support-view-details.html">'+
							'<i class="fa fa-location-arrow fa-lg launch-track" aria-hidden="true"></i></a>'+

							'<a style="text-decoration:none" class="ml-5" href="javascript:;" title="工作记录" _href="support-view-details.html">'+
							'<i class="Hui-iconfont work">&#xe687;</i></a>';
						break;
					}
				}
				tmpBtn += '<a style="text-decoration:none" class="ml-5" href="javascript:;" title="备注" _href="support-view-details.html">'+
				'<i class="Hui-iconfont remarks">&#xe647;</i></a>' +
				'';
				
				tmpBtn += '<a style="text-decoration:none" class="ml-5" href="javascript:;" title="取回任务" _href="without">'+
				'<i class="fa fa-reply fa-lg" aria-hidden="true"></i></a>' +
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
			/*
			 * 获取表格中数据
			 * */
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "preSupport/requirements/findPage",
				data: sendData,
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
											reqName: reqN,
											customerName: customerN,
											startTime: startT,
											endTime: endT,
											reqSupType: reqSupT
										};

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "preSupport/requirements/findPage",
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

		sendD.pageSize = pageSize;
		sendD.pageNo = pageNo;
		renderingPage(sendD);

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
				reqName: reqN,
				customerName: customerN,
				startTime: startT,
				endTime: endT,
				reqSupType: reqSupT
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

		/*
		* 查询方法
		* */
		function findList()
		{
			var search = $(".search-area-my"),
				sendData = {};

			reqN = search.find('[con_name="reqName"]').val();
			customerN = search.find('[con_name="customerName"]').val();
			startT = search.find('[con_name="startTime"]').val();
			endT = search.find('[con_name="endTime"]').val();
			reqSupT = search.find('[con_name="reqSupType"]').val();

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				reqName: reqN,
				customerName: customerN,
				startTime: startT,
				endTime: endT,
				reqSupType: reqSupT
			};

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
		* 按钮区按钮点击事件
		* */
		tbody.on("click", ".btns a", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				reqId = "",
				taskId = "",
				processInstanceId = "",
				customerId = "",
				reqSupType = "",
				recordCode = "";
			

			reqId = $(this).parents("tr").attr("reqId");
			taskId = $(this).parents("tr").attr("taskId");
			processInstanceId = $(this).parents("tr").attr("processInstanceId");
			customerId = $(this).parents("tr").attr("customerId");
			recordCode = $(this).parents("tr").attr("reqCode");
			reqSupType = $(this).parents("tr").attr("reqSupType");
			data.reqId = reqId;
			data.taskId = taskId;
			data.processInstanceId = processInstanceId;
			data.customerId = customerId;
			data.recordCode = recordCode;
			data.reqSupType = reqSupType;
			
			if($.trim(href)=='without'){
				layer.confirm('您确定要取回任务吗？<p>提示：在某些情况下任务会取回失败。比如：任务已经被处理、任务已经流转到其他节点等。</p>', {
						btn: ['确定','取消'],
						shade: 0.1
					},
					function()
					{
						$.myAjax({
							type: "GET",
							url: window.ajaxUrl + "preSupport/workFlow/withdraw/"+taskId+"/"+reqId,
							//data: sendData,
							success: function (data)
							{
								if (data && data.success)
								{
									layer.confirm(data.error, {
											btn: ['确定'],
											shade: 0.1
										},
										function()
										{
											window.location.reload();
										},
										function()
										{
											window.location.reload();
										});
								}

							}
						});
					},
					function()
					{

					});

				
				return ;
			}

			if (title === "发起跟踪")
			{
				data.tabArr = [
					{
						title: "发起跟踪",
						src: "support-launch-track.html",
						color: "orange",
						selected: true
					},
					{
						title: "申请信息",
						src: "support-details.html"
					},
					{
						title: "支撑方案",
						src: "support-ScheduleListPage.html"
					},
					{
						title: "工作记录",
						src: "support-workdetails.html"
					},
					{
						title: "支撑跟踪",
						src: "support-following-detail.html"
					},
					{
						title: "备注",
						src: "support-remarkdetails.html"
					},
					{
						title: "业务日志",
						src: "support-logdetails.html"
					},
					{
						title: "流程日志",
						src: "support-processdetails.html"
					}
				];
			}
			if (title === "跟踪反馈")
			{
				data.tabArr = [
					{
						title: "跟踪反馈",
						src: "support-track-return.html",
						color: "orange",
						selected: true
					},
					{
						title: "申请信息",
						src: "support-details.html"
					},
					{
						title: "支撑方案",
						src: "support-ScheduleListPage.html"
					},
					{
						title: "工作记录",
						src: "support-workdetails.html"
					},
					{
						title: "支撑跟踪",
						src: "support-following-detail.html"
					},
					{
						title: "备注",
						src: "support-remarkdetails.html"
					},
					{
						title: "业务日志",
						src: "support-logdetails.html"
					},
					{
						title: "流程日志",
						src: "support-processdetails.html"
					}
				];
			}
			if (title === "工作记录")
			{
				data.tabArr = [
					{
						title: "工作记录管理",
						src: "support-WorkRecord.html",
						color: "orange",
						selected: true
					},
					{
						title: "申请信息",
						src: "support-details.html"
					},
					{
						title: "支撑方案",
						src: "support-ScheduleListPage.html"
					},
					{
						title: "工作记录",
						src: "support-workdetails.html"
					},
					{
						title: "支撑跟踪",
						src: "support-following-detail.html"
					},
					{
						title: "备注",
						src: "support-remarkdetails.html"
					},
					{
						title: "业务日志",
						src: "support-logdetails.html"
					},
					{
						title: "流程日志",
						src: "support-processdetails.html"
					}
				];
			}
			if (title === "备注")
			{
				data.tabArr = [
					/*{
						title: "备注",
						src: "support-remark.html",
						color: "orange",
						selected: true

					},*/
					{
						title: "申请信息",
						src: "support-details.html",
					},
					{
						title: "支撑方案",
						src: "support-ScheduleListPage.html"
					},
					{
						title: "工作记录",
						src: "support-workdetails.html"
					},
					{
						title: "支撑跟踪",
						src: "support-following-detail.html"
					},
					{
						title: "备注",
						src: "support-remarkdetails.html",
						color: "orange",
						selected: true
					},
					{
						title: "业务日志",
						src: "support-logdetails.html"
					},
					{
						title: "流程日志",
						src: "support-processdetails.html"
					}
				];
			}
			window.layerViewData = data;
			window.layerShow("信息详情",href);
		});

		/*
		* 点需求单名进入查看详情页
		* */
		tbody.on("click", ".td-view", function ()
		{
			var href = "support-view-details.html",
				title = "信息详情",
				data = {},
				reqId = "",
				taskId = "",
				processInstanceId = "",
				customerId = "",
				recordCode = "",
				reqSupType = "";

			reqId = $(this).parents("tr").attr("reqId");
			taskId = $(this).parents("tr").attr("taskId");
			processInstanceId = $(this).parents("tr").attr("processInstanceId");
			customerId = $(this).parents("tr").attr("customerId");
			recordCode = $(this).parents("tr").attr("reqCode");
			reqSupType = $(this).parents("tr").attr("reqSupType");
			data.reqId = reqId;
			data.taskId = taskId;
			data.processInstanceId = processInstanceId;
			data.customerId = customerId;
			data.recordCode = recordCode;
			data.reqSupType = reqSupType;
			window.layerViewData = data;
			window.layerShow(title,href);
		});
	});
}(jQuery, window, document));
