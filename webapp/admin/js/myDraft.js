/**
 * 本文件的功能是我的草稿js文件
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
					taskCreateTime = "";

				if (v.createTime)
				{
					taskCreateTime = formatDates(v.createTime);
				}
				STr = $('<tr class="text-c" reqId="'+ v.id+
					'" attachmentId="'+ v.attachmentId+
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

				STr.append('<td class="btns">' +
					'<a style="text-decoration:none" class="mr-5 deal" href="javascript:;" title="编辑">'+
					'<i class="Hui-iconfont">&#xe70c;</i></a>'+

					'<a style="text-decoration:none" class="mr-5 c-warning delete" href="javascript:;" title="删除">'+
					'<i class="Hui-iconfont">&#xe6e2;</i></a>'+
					'</td>');

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
				url: window.ajaxUrl + "preSupport/workFlow/findDrafts",
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
										url: window.ajaxUrl + "preSupport/workFlow/findDrafts",
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
		tbody.on("click", ".delete", function ()
		{
			var _this = $(this);
			layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function()
				{
					var url = "",
						id = "",
						attachmentId = "",
						data = {};

					id = _this.parents("tr").attr("reqId");
					attachmentId = _this.parents("tr").attr("attachmentId");
					data.id = id;
					if (attachmentId)
					{
						data.attachmentId = attachmentId;
					}
					url = window.ajaxUrl + 'preSupport/requirements/deleteDraft';
					$.myAjax({
						"url": url,
						"type": "POST",
						"data": data,
						success: function (data)
						{
							if (data && data.success === 0)
							{
								layer.confirm('已删除', {
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
		 * 点需求单名进入查看详情页
		 * */
		tbody.on("click", ".td-view", function ()
		{
			viewState(this);
		});
	});
}(jQuery, window, document));
