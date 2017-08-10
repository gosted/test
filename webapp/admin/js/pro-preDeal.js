/**
 * 本文件是待办工单js文件
 * @ author 彭佳明
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			workOrderNum = "",
			workOrderName = "",
		    _href = "",
			tbody = $(".tbody");
		var Role = [];
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
			var userRole = $(".tbody").attr("userRole"),
				userRoleName = "KFGLY";
			var userRoleArr = userRole.split(','),
				userRoleArrs=[];
			userRoleArrs.push(userRoleName);

			//工单列表
			(function ()
			{
				$.each(list, function (i, v)
				{

					var workId = v.id,
						dictCodeName = "",
						role = "KFGLY",
						orleArr = [],
						splitArr = [],
						roleType = false,
						view = $('<a href="javascript:;"></a>');
					STr = $('<tr class="text-c" workFlowId="'+v.workFlowId+'" subId = "'+v.subProjectId+'" workType="'+v.workType+'" taskId="'+v.taskId+'" workId="'+ workId +'"></tr>');//一行
					STr.append('<td><input type="checkbox" value="" name=""></td>');
					STr.append($('<td class="td-view workOrderName"></td>').append(v.workOrderName||""));
					STr.append($('<td class="workOrderNum"></td>').text(v.workOrderNum || ""));
					if(v.workType == '1')
					{
						STr.append($('<td></td>').text('出库工单'));
					}
					else if(v.workType == '2')
					{
						STr.append($('<td></td>').text('施工工单'));
					}
					else if(v.workType == '3')
					{
						STr.append($('<td></td>').text('通用工单'));
					}
					STr.append($('<td class="project"></td>').text(v.project || ""));
					STr.append($('<td class="site"></td>').text(v.site || ""));
					var signTime = new Date(v.createTime);

					STr.append($('<td></td>').text(window.formatDate(signTime||"")));

					var tmpBtn = '<td class="btns">';

					if(v.workType == "1")
					{
						if(v.taskName == "领导审批")
						{
							STr.append($('<td></td>').text("等待审批"));
							tmpBtn += '<a style="text-decoration:none;position:relative;top:3px;" class="mr-5" href="javascript:;" title="办理" _href="pro-demand-retrievalOder.html">'+
								'<i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
						}else if(v.taskName == "出库处理"){
							STr.append($('<td></td>').text("出库中"));
							tmpBtn +=/* '<a style="text-decoration:none" class="mr-5 theLibrary" href="javascript:;" title="出库">'+
								'<i class="fa fa-sign-out fa-lg" aria-hidden="true"></i></a>'+*/
								'<a style="text-decoration:none;position:relative;top:3px;" class="mr-5" href="javascript:;" title="退回" _href="pro-return.html">'+
								'<i class="fa fa-external-link" aria-hidden="true"></i></a>'+
								'<a style="text-decoration:none" class="mr-5 completion" href="javascript:;" title="出库确认">'+
								'<i class="Hui-iconfont">&#xe676;</i></a>';
						}else if(v.taskName == "收货确认"){
							STr.append($('<td></td>').text("收货确认"));
							tmpBtn += '<a style="text-decoration:none;position:relative;top:3px;" class="mr-5 deal" href="javascript:;" title="办理" Myhref="pro-goodsAffirm.html">'+
								'<i class="fa fa-pencil-square-o" aria-hidden="true"></i> </a>';
						}else if(v.taskName == "发起出库申请工单"){
							STr.append($('<td></td>').text("发起出库单"));

							tmpBtn += '<a class="retrievalOder mr-5" style="text-decoration:none;position:relative;top:3px;" class="mr-5 " href="javascript:;" title="办理" _href="pro-retrievalOder-return.html">'+
								'<i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
							tmpBtn += '<a style="text-decoration:none" class="mr-5 end" href="javascript:;" valueCode="1" title="终止">'+
								'<i class="fa fa-stop-circle-o fa-lg endnonormal" aria-hidden="true"></i></a>';
						}

					}
					if(v.workType == "2")
					{
						if(v.taskName == "领导审批")
						{
							STr.append($('<td></td>').text("等待审批"));
							tmpBtn += '<a style="text-decoration:none;position:relative;top:3px;" class="mr-5 deal" href="javascript:;" title="办理" Myhref="pro-demand-constructionOder.html">'+
							 '<i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
						}else if(v.taskName == "施工中"){
							STr.append($('<td></td>').text("施工中"));
							tmpBtn += '<a style="text-decoration:none;position:relative;top:3px;" class="mr-5 deal" href="javascript:;" title="办理" Myhref="pro-construction-deal.html">'+
								'<i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
						}else if(v.taskName == "完工确认"){
							STr.append($('<td></td>').text("完工确认"));
							tmpBtn += '<a style="text-decoration:none;position:relative;top:3px;" class="mr-5 deal" href="javascript:;" title="办理" Myhref="pro-construction-approval.html">'+
								'<i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
						}else if(v.taskName == "发起施工申请工单"){
							STr.append($('<td></td>').text("发起施工"));
							tmpBtn += '<a style="text-decoration:none;position:relative;top:3px;" class="mr-5 deal" href="javascript:;" title="办理" Myhref="pro-constructionOder-return.html">'+
								'<i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>';
							tmpBtn += '<a style="text-decoration:none" class="mr-5 end" href="javascript:;" valueCode="1" title="终止">'+
							'<i class="fa fa-stop-circle-o fa-lg endnonormal" aria-hidden="true"></i></a>';
						}

					}
					if(v.workType == "3")
					{
						/*if(Role == "HZHB")
						{
							STr.append($('<td></td>').text("工单处理"));
							tmpBtn += '<a style="text-decoration:none" class="mr-5" href="javascript:;" title="退回" _href="pro-returnGeneral.html">'+
								'<i class="fa fa-external-link" aria-hidden="true"></i></a>'+
								'<a style="text-decoration:none" class="mr-5 ConsCurr" href="javascript:;" title="办理">'+
								'<i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>'+
								'<a style="text-decoration:none" class="mr-5 end" href="javascript:;" valueCode="1" title="终止">'+
								'<i class="fa fa-stop-circle-o fa-lg endnonormal" aria-hidden="true"></i></a>';
						}else
						{

						}*/

						STr.append($('<td></td>').text("工单处理"));
						tmpBtn += '<a style="text-decoration:none" class="mr-5" href="javascript:;" title="退回" _href="pro-returnGeneral.html">'+
							'<i class="fa fa-external-link" aria-hidden="true"></i></a>'+
							'<a style="text-decoration:none" class="mr-5 currency" href="javascript:;" title="办理">'+
							'<i class="fa fa-pencil-square-o" aria-hidden="true"></i></a>'+
							'<a style="text-decoration:none" class="mr-5 end" href="javascript:;" valueCode="1" title="终止">'+
							'<i class="fa fa-stop-circle-o fa-lg endnonormal" aria-hidden="true"></i></a>';


					}
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
			})();
		}



		/*渲染表格和分页的方法,传入要向后台传的数据*/
		function renderingPage (sendData)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "project/workOrder/findTodoTasks",
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
									var workOrderNum = $(".workOrderNu").val(),
										workOrderName = $(".workOrderNa").val();
									workOrderNum ? sendData.workOrderNum = workOrderNum : false;
									workOrderName ? sendData.workOrderName = workOrderName : false;

									$.myAjax({
										type: "POST",

										url: window.ajaxUrl + "project/workOrder/findTodoTasks",
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
						//分页结束
					}
				}
			});
		}

		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/user/findRoleByUserName1",
			data:{},
			dataType: "json",
			success: function (data)
			{
				if (data && data.success === 0)
				{
					var datas = data.data,
						detail = "";
					$.each(datas, function (i,v)
					{
						detail += "," + v.roleCode;
					});
					detail = detail.substr(1);
					Role = detail;
					$(".tbody").attr("userRole",detail);
					renderingPage({
						pageSize: pageSize,
						pageNo: pageNo
					});
				}
			}
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
			var workOrderNum = $(".workOrderNu").val(),
				workOrderName = $(".workOrderNa").val();
			workOrderNum ? sendData.workOrderNum = workOrderNum : false;
			workOrderName ? sendData.workOrderName = workOrderName : false;
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
			var data = {};
			data.reqId = "123";
			window.layerViewData = data;
			var search = $(".search-area"),
				sendData = {};
			workOrderNum = $(".workOrderNu").val();
			workOrderName =$(".workOrderNa").val();
			sendData = {
				pageSize: pageSize,
				pageNo: pageNo
			};

			workOrderNum ? sendData.workOrderNum = workOrderNum : false;
			workOrderName ? sendData.workOrderName = workOrderName : false;
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
				workId = "",workName = "",projectName = "",site = "",taskId = "",workType = "",subId = "",workFlowId="";

			if (!href)
			{
				return false;
			}
			workId = $(this).parents("tr").attr("workId");
			taskId = $(this).parents("tr").attr("taskId");
			workFlowId = $(this).parents("tr").attr("workFlowId");
			workType = $(this).parents("tr").attr("workType");
			subId = $(this).parents("tr").attr("subId");
			workName = $(this).parents("tr").find(".workOrderName").text();
			workOrderNum = $(this).parents("tr").find(".workOrderNum").text();
			projectName = $(this).parents("tr").find(".project").text();
			site = $(this).parents("tr").find(".site").text();
			data.projectId = workId;
			data.subId = subId;
			data.workType = workType;
			data.taskId = taskId;
			data.workFlowId = workFlowId;
			data.workName = workName;
			data.workOrderNum = workOrderNum;
			data.projectName = projectName;
			data.site = site;
			data.tabArr = [
				{
					title: title,
					src: href,
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
			window.layerViewData = data;
			window.layerShow('信息详情','pro-do-details.html');
		});

		/*
		 * 列表数据为通用工单时办理点击事件
		 * */
		tbody.on("click", ".btns .currency", function ()
		{
			var href = "pro-currency.html",
				title = $(this).attr("title"),
				data = {},
				workId = "",workName = "",projectName = "",site = "",taskId = "",workType = "",subId = "",workFlowId="";

			if (!href)
			{
				return false;
			}
			workId = $(this).parents("tr").attr("workId");
			taskId = $(this).parents("tr").attr("taskId");
			workFlowId = $(this).parents("tr").attr("workFlowId");
			workType = $(this).parents("tr").attr("workType");
			subId = $(this).parents("tr").attr("subId");
			workName = $(this).parents("tr").find(".workOrderName").text();
			workOrderNum = $(this).parents("tr").find(".workOrderNum").text();
			projectName = $(this).parents("tr").find(".project").text();
			site = $(this).parents("tr").find(".site").text();
			data.projectId = workId;
			data.subId = subId;
			data.workType = workType;
			data.taskId = taskId;
			data.workFlowId = workFlowId;
			data.workName = workName;
			data.workOrderNum = workOrderNum;
			data.projectName = projectName;
			data.site = site;
			data.tabArr = [
				{
					title: title,
					src: href,
					color: "blue",
					selected: true
				},
				{
					title: "处理过程",
					src: "pro-theCirculation.html",
					color: "blue"
				},
				{
					title:"工单入库设备",
					src:"por-warehousing-equipment.html",
					color:"blue"
				},
				{
					title:"工单出库设备",
					src:"por-equipment-display.html",
					color:"blue"
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
			window.layerViewData = data;
			window.layerShow('信息详情','pro-do-details.html');
		});
		tbody.on("click", ".btns .ConsCurr", function ()
		{
			var href = "pro-construction-currency.html",
				title = "工单处理",
				data = {},
				workId = "",workName = "",projectName = "",site = "",taskId = "",workType = "",subId = "",workFlowId="";

			if (!href)
			{
				return false;
			}
			workId = $(this).parents("tr").attr("workId");
			taskId = $(this).parents("tr").attr("taskId");
			workFlowId = $(this).parents("tr").attr("workFlowId");
			workType = $(this).parents("tr").attr("workType");
			subId = $(this).parents("tr").attr("subId");
			workName = $(this).parents("tr").find(".workOrderName").text();
			workOrderNum = $(this).parents("tr").find(".workOrderNum").text();
			projectName = $(this).parents("tr").find(".project").text();
			site = $(this).parents("tr").find(".site").text();
			data.projectId = workId;
			data.subId = subId;
			data.workType = workType;
			data.taskId = taskId;
			data.workFlowId = workFlowId;
			data.workName = workName;
			data.workOrderNum = workOrderNum;
			data.projectName = projectName;
			data.site = site;
			data.tabArr = [
				{
					title: title,
					src: href,
					color: "blue",
					selected: true
				},
				{
					title: "处理过程",
					src: "pro-theCirculation.html",
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
			window.layerViewData = data;
			window.layerShow('信息详情','pro-do-details.html');
		});

		//点名称进编辑页
		tbody.on("click", ".btns .deal", function ()
		{
			var href = $(this).attr("Myhref"),
				title = $(this).attr("title"),
				data = {},
				workId = "",workName = "",projectName = "",site = "",taskId = "",workType = "",subId = "",workFlowId="";

			if (!href)
			{
				return false;
			}
			workId = $(this).parents("tr").attr("workId");
			taskId = $(this).parents("tr").attr("taskId");
			workFlowId = $(this).parents("tr").attr("workFlowId");
			workType = $(this).parents("tr").attr("workType");
			subId = $(this).parents("tr").attr("subId");
			workName = $(this).parents("tr").find(".workOrderName").text();
			workOrderNum = $(this).parents("tr").find(".workOrderNum").text();
			projectName = $(this).parents("tr").find(".project").text();
			site = $(this).parents("tr").find(".site").text();
			data.projectId = workId;
			data.subId = subId;
			data.workType = workType;
			data.taskId = taskId;
			data.workFlowId = workFlowId;
			data.workName = workName;
			data.workOrderNum = workOrderNum;
			data.projectName = projectName;
			data.site = site;
			window.layerViewData = data;
			window.layerShow(title,href);
		});

		/*
		 * 出库确认按钮点击事件
		 * */
		tbody.on("click", ".btns .completion", function ()
		{
			var wordType = $(this).parents("tr").attr("workType"),
				data = {},
				workId = "",workName = "",projectName = "",site = "",taskId = "",workType = "",subId = "",workFlowId="";

			workId = $(this).parents("tr").attr("workId");
			taskId = $(this).parents("tr").attr("taskId");
			workFlowId = $(this).parents("tr").attr("workFlowId");
			workType = $(this).parents("tr").attr("workType");
			subId = $(this).parents("tr").attr("subId");
			workName = $(this).parents("tr").find(".workOrderName").text();
			workOrderNum = $(this).parents("tr").find(".workOrderNum").text();
			projectName = $(this).parents("tr").find(".project").text();
			site = $(this).parents("tr").find(".site").text();
			data.projectId = workId;
			data.subId = subId;
			data.workType = workType;
			data.taskId = taskId;
			data.workFlowId = workFlowId;
			data.workName = workName;
			data.workOrderNum = workOrderNum;
			data.projectName = projectName;
			data.site = site;
			window.layerViewData = data;
			if(wordType == "1" || wordType == "2"){
				var href = "pro-TLConfirm.html",
					title = $(this).attr("title");
					window.layerShow(title,href);
			}/*else{
				var href = "pro-TLAppoint.html",
					title = $(this).attr("title");
				window.layerShow(title,href);
			}*/

		});
		/*
		*出库列表
		* */
		tbody.on("click", ".btns .theLibrary", function ()
		{
			var href = "../storage/strg-storage-outstock.html",
				title = $(this).attr("title"),
				data = {},
				workId = "",workName = "",projectName = "",site = "",taskId = "",workType = "",subId = "",workFlowId="";

			workId = $(this).parents("tr").attr("workId");
			taskId = $(this).parents("tr").attr("taskId");
			workFlowId = $(this).parents("tr").attr("workFlowId");
			workType = $(this).parents("tr").attr("workType");
			subId = $(this).parents("tr").attr("subId");
			workName = $(this).parents("tr").find(".workOrderName").text();
			workOrderNum = $(this).parents("tr").find(".workOrderNum").text();
			projectName = $(this).parents("tr").find(".project").text();
			site = $(this).parents("tr").find(".site").text();
			data.projectId = workId;
			data.subId = subId;
			data.workType = workType;
			data.taskId = taskId;
			data.workFlowId = workFlowId;
			data.workName = workName;
			data.workOrderNum = workOrderNum;
			data.projectName = projectName;
			data.site = site;
			_href=""
			window.layerViewData = data;
			window.layerShow(title,href);
		});
		
		//任务
		tbody.on("click", ".btns .end", function ()
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
						taskId = "";
					sendData.valueCode='1';
					sendData.step=1;
					sendData.id = _this.parents("tr").attr("workId");
					sendData.taskId = _this.parents("tr").attr("taskId");
					url = window.ajaxUrl + 'project/workOrder/approval';
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

	});
}(jQuery, window, document));
