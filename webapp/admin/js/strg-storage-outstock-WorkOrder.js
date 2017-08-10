/**
 * 本文件的功能是关联出库工单js文件
 *@ author 王步华
 */

(function($, w, d){
	'use strict';

	$(function() {
		var	tbody = $(".tbody"),
			pageSize = 20,
			pageNo = 1,
			first = true,
			sendData ={};
			top.lzg_taskId = "";
			top.lzg_projectId = "";
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
			if(list != "" || null){
				$.each(list, function (i, v)
				{
					var createTime = ((v.createTime == null || "" || undefined) ? "" : window.formatDates(v.createTime));
					STr = $('<tr class="text-c" libId="'+ v.id+'" projectId="'+ v.id +'" taskId="'+ v.taskId +'" workOrderName = "'+ v.workOrderName +'"></tr>' );//一行

					STr.append('<td><input type="checkbox" name="chebox" workOrderName = '+v.workOrderName +'></td>');

					STr.append('<td class="text-l pl-3 workOrderName">' + v.workOrderName + '</td>');

					STr.append('<td>' + v.workOrderNum + '</td>');

					STr.append('<td>' + v.project + '</td>');

					STr.append('<td>' + v.site + '</td>');

					STr.append('<td>' + createTime + '</td>');

					STr.append('<td>' + v.taskName + '</td>');

					STr.append('<td class="btns">' +
						'<a style="text-decoration:none" class="mr-5 btn-add" title="关联" href="javascript:;">'+
						'<i class="fa fa-check-square-o fa-lg" aria-hidden="true"></i></a>'+
						'</td>');

					tbody.append(STr);
					/*
					 * tr颜色间隔问题
					 * */
					var trs = tbody.find("tr");
					for(var i=0; i<trs.length;i++){
						if(i%2 == 0){
							trs.eq(i).css("background","#fff");
						}else{
							trs.eq(i).css("background","#eee");
						}
					}
				});
			}
		}



		/*
		 * 获取表格中数据
		 * */
		function initTable (obj)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "project/workOrder/findTodoTasks",
				data: {
					pageSize: obj.pageSize,
					pageNo: obj.pageNo
				},
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
		sendData = {
			pageSize: pageSize,
			pageNo: pageNo,
		};
		initTable (sendData);

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
			initTable (sendData);
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
		//选择每页显示多少条事件

		/*
		 * 列表上侧按钮区按钮点击事件
		 * */
		//添加
		tbody.on("click",".btn-add", function ()
		{
			var data = "",
				nameId=[],
				taskId = "",
				projectId="",
				checkedlist="";

			//checkedlist = $(".tbody").find("input:checkbox:checked").length;
			/*tbody.find("input:checkbox:checked").each(function () {
				var objId =  $(this).parent().parent("tr").attr("libid");
				var objName =  $(this).attr("workOrderName");
				taskId = $(this).parent().parent("tr").attr("taskId");
				projectId = $(this).parent().parent("tr").attr("projectId");
				var sendArr = {};
				sendArr['objName'] = objName;
				sendArr['objId'] = objId;
				sendArr['taskId'] = taskId;
				sendArr['projectId'] = projectId;
				nameId.push(sendArr);
				//taskIds.push(taskId);
				//projectIds.push(projectId);
			});*/
			var sendArr = {};
			sendArr['objName'] = $(this).parent().parent("tr").attr("workOrderName");
			sendArr['objId'] = $(this).parent().parent("tr").attr("libid");
			sendArr['taskId'] = $(this).parent().parent("tr").attr("taskId");
			sendArr['projectId'] =  $(this).parent().parent("tr").attr("projectId");
			nameId.push(sendArr);
			var lzg_taskId =  $(this).parent().parent("tr").attr("taskId");
			var lzg_projectId =$(this).parent().parent("tr").attr("projectId");

			$.cookie("lzg_taskId",lzg_taskId,{
				expires:1,//有效日期
				secure:false //true,cookie的传输会要求一个安全协议,否则反之
				});
			$.cookie("lzg_projectId",lzg_projectId,{
				expires:1,//有效日期
				secure:false //true,cookie的传输会要求一个安全协议,否则反之
			});

			data = nameId;
			parent.getOutWorkOrder(data);
			layer_close();
		});

		/*
		 * 按钮区查询事件
		*/
		//查询
		function findList()
		{
			initTable({pageSize: pageSize,pageNo: pageNo})
		}
		$(".btn-find").on("click", findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});

	});
}(jQuery, window, document));
