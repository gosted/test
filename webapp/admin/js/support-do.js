/**
 * 本文件的功能是我的待办页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tbody = $(".tbody"),
			pageSize = 20,
			pageNo = 1,
			sendData = {};

		/*
		 * 打开一个弹框的方法
		 * */
		function viewState(t)
		{
			var _this = $(t),
				data = {},
				reqId = "",
				taskId = "",
				reqState = _this.parents("tr").find(".reqState").html();
			reqId = _this.parents("tr").attr("reqId");
			taskId = _this.parents("tr").attr("taskId");
			data.reqId = reqId;
			data.taskId = taskId;
			window.layerViewData = data;

			if (reqState === "负责人审批")
			{
				inDetails(t);
			}
			else if(reqState === "业务经理受理")
			{
				inDetails(t);
			}
			else if(reqState === "制定支撑方案")
			{
				inDetails(t);
			}
			else if (reqState === "填写需求单")
			{
				$.myAjax(
				{
					type:"POST",
					url:window.ajaxUrl + "preSupport/requirements/findApproval",
					data:{"reqId":reqId},
					success:function(data)
					{
						if(data.success === 0 && data.data)
						{	
							var thisTime = window.formatDateTimesec(data.data.apprTime);
							$(t).attr({"conStr":data.data.apprOption,"backperson":data.data.apprApprover,"backtime":thisTime,"attachmentId":data.data.attachmentId});
							inDetails(t);
						}
						else{
							window.layerShow("支撑需求单","support-my-launch.html");
						}
					}
				});
			}
			else if (reqState === "跟踪反馈")
			{
				inDetails(t);
			}
			else if (reqState === "确认反馈")
			{
				inDetails(t);
			}
			else
			{
				
			}
		}

		/*
		 * 渲染表格方法传入请求到的数据
		 * */
		function setTable (data)
		{
			var list = [],
				tbody = $(".tbody"),
				STr = null,
				clr = "";

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
					taskCreateTime = "";

				if (v.taskCreateTime)
				{
					taskCreateTime = formatDates(v.taskCreateTime);
				}
				STr = $('<tr class="text-c" reqId="'+ v.id+
					'" taskId="'+ v.taskId+
					'" processInstanceId="'+ v.jobFlowInstanceId+
					'" customerId="'+v.customerId+
					'" jobFlowId="'+ v.jobFlowId+
					'" reqSupType="'+ v.reqSupType+
					'"></tr>');//一行
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
				STr.append('<td>' + taskCreateTime + '</td>');
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
					'<span class="label radius reqState '+clr+'">'+
					v.reqProcessState +
					'</span></td>');
				if (v.reqProcessState === "方案填写")
				{
					STr.append('<td class="btns">' +
						'<a style="text-decoration:none" class="ml-5" href="javascript:;" title="处理">'+
						'<i class="fa fa-pencil-square-o fa-lg deal" aria-hidden="true"></i></a>'+

						'<a style="text-decoration:none" class="ml-5" href="javascript:;" title="结束" _href="support-launch-track.html">'+
						'<i class="fa fa-power-off fa-lg end" aria-hidden="true"></i></a>'+
						'</td>');
				}
				else if (v.reqProcessState === "制定支撑方案")
				{
					STr.append('<td class="btns">' +
						'<a style="text-decoration:none" class="ml-5" href="javascript:;" title="处理">'+
						'<i class="fa fa-pencil-square-o fa-lg deal" aria-hidden="true"></i></a>'+

						'<a style="text-decoration:none" class="ml-5" href="javascript:;" valueCode="1" title="终止">'+
						'<i class="fa fa-stop-circle-o fa-lg endnonormal" aria-hidden="true"></i></a>'+

						'<a style="text-decoration:none" class="ml-5" href="javascript:;" title="结束" _href="support-launch-track.html">'+
						'<i class="fa fa-power-off fa-lg end" aria-hidden="true"></i></a>'+
						'</td>');
				}
				else if(v.reqProcessState === "填写需求单" )
				{
					STr.append('<td class="btns">' +
						'<a style="text-decoration:none" class="ml-5" href="javascript:;" title="处理">'+
						'<i class="fa fa-pencil-square-o fa-lg deal" aria-hidden="true"></i></a>'+

						'<a style="text-decoration:none" class="ml-5" href="javascript:;" valueCode="1" title="终止">'+
						'<i class="fa fa-stop-circle-o fa-lg endnonormal" aria-hidden="true"></i></a>'+
						'</td>');
				}
				else
				{
					STr.append('<td class="btns">' +
						'<a style="text-decoration:none" class="ml-5" href="javascript:;" title="处理">'+
						'<i class="fa fa-pencil-square-o fa-lg deal" aria-hidden="true"></i></a>'+
						'</td>');
				}


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
				url: window.ajaxUrl + "preSupport/workFlow/findTodoTasks",
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
										pageNo: obj.curr
									};
									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "preSupport/workFlow/findTodoTasks",
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

		sendData.pageSize = pageSize;
		sendData.pageNo = pageNo;
		renderingPage(sendData);

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
				pageNo: pageNo
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

		tbody.on("click",".deal", function ()
		{
			viewState(this);
		});

		/*
		 * 点击结束
		 * */
		tbody.on("click", ".end", function ()
		{
			var _this = $(this);
			layer.confirm('确定要结束吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function()
				{
					var url = "",
						reqId = "",
						taskId = "";

					reqId = _this.parents("tr").attr("reqId");
					taskId = _this.parents("tr").attr("taskId");
					url = window.ajaxUrl + 'preSupport/workFlow/complete/'+taskId+'/' + reqId;
					$.myAjax({
						"url": url,
						"type": "POST",
						success: function (data)
						{
							if (data && data.success === 0)
							{
								layer.confirm('已结束', {
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
					})
				},
				function()
				{
					layer.msg('已取消', {icon:5,time:1000});
				});
		});
		
		tbody.on("click", ".endnonormal", function ()
		{
			var _this = $(this),
				msg = '确定要结束吗？',
				sendData = {};
			if (_this.parent().attr("valueCode") === "1")
			{
				msg = '确定要终止吗？';
				sendData = {"valueCode":"1"};
			}
			layer.confirm(msg, {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function()
				{
					var url = "",
						reqId = "",
						taskId = "";

					reqId = _this.parents("tr").attr("reqId");
					taskId = _this.parents("tr").attr("taskId");
					url = window.ajaxUrl + 'preSupport/workFlow/complete/'+taskId+'/' + reqId;
					$.myAjax({
						"url": url,
						"type": "POST",
						data: sendData,
						success: function (data)
						{
							if (data && data.success === 0)
							{
								layer.confirm('已结束', {
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
					})
				},
				function()
				{
					layer.msg('已取消', {icon:5,time:1000});
				});
		});

		/*
		* 进入详情页面方法传入点击的元素this
		* */
		function inDetails(t)
		{
			var href = "support-view-details.html",
				title = "信息详情",
				data = {},
				reqId = "",
				taskId = "",
				processInstanceId = "",
				customerId = "",
				jobFlowId = "",
				reqSupType = "",
				reqState = $(t).parents("tr").find(".reqState").html();

			reqId = $(t).parents("tr").attr("reqId");
			taskId = $(t).parents("tr").attr("taskId");
			processInstanceId = $(t).parents("tr").attr("processInstanceId");
			customerId = $(t).parents("tr").attr("customerId");
			jobFlowId = $(t).parents("tr").attr("jobFlowId");
			reqSupType = $(t).parents("tr").attr("reqSupType");
			data.reqId = reqId;
			data.taskId = taskId;
			data.processInstanceId = processInstanceId;
			data.customerId = customerId;
			data.jobFlowId = jobFlowId;
			data.reqSupType = reqSupType;
			
			data.conStr = $(t).attr("conStr");	//获取驳回内容
			data.backtime = $(t).attr("backtime");
			data.backperson = $(t).attr("backperson");
			data.attachmentId = $(t).attr("attachmentId");

			if (reqState === "负责人审批")
			{
				data.tabArr = [
					{
						title: "负责人审批",
						src: "support-demand-list.html",
						color: "orange"
					},
					{
						title: "申请信息",
						src: "support-details.html",
						selected: true
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
			else if (reqState === "填写需求单")
			{
				data.tabArr = [
					{
						title: "填写需求单",
						src: "support-reject-opinion.html",
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
			else if (reqState === "业务经理受理")
			{
				data.tabArr = [
					{
						title: "支撑受理",
						src: "support-accept-list.html",
						color: "orange"
					},

					{
						title: "申请信息",
						src: "support-details.html",
						selected: true
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
			else if (reqState === "跟踪反馈")
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
			else if (reqState === "确认反馈")
			{
				data.tabArr = [
					{
						title: "确认反馈",
						src: "support-sure-track.html",
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
			else if (reqState === "制定支撑方案")
			{
				data.tabArr = [
					{
						title: "制定方案",
						src: "support-SptMdlPro.html",
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

			window.layerViewData = data;
			window.layerShow("信息详情",href);
		}
		/*
		 * 点需求单名进入查看详情页
		 * */
		tbody.on("click", ".td-view", function ()
		{
			if($(this).parent("tr").find(".reqState").html() === "填写需求单")
			{
				viewState(this);
			}
			else
			{
				inDetails(this);
			}
		});
	});
}(jQuery, window, document));
