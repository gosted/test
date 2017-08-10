/**
 * 本文件是待办工单js文件
 * @ author 彭佳明
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tbody = $(".tbody"),
			pageSize = 20,
			pageNo = 1;
		var　sendData　= {};
		var workName = parent.window.layerViewData.workName,
			projectName = parent.window.layerViewData.projectName,
			projectId = parent.window.layerViewData.projectId,
			site = parent.window.layerViewData.site,
			taskId = parent.window.layerViewData.taskId,
			workFlowId = parent.window.layerViewData.workFlowId;
		window.layerViewData = parent.window.layerViewData;

		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "project/workOrder/findApprovalConstruction",
			data: {workOrderId:projectId},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					var date = new Date(data.data.apprTime);
					var date2 = window.formatDate(date);
					if(date2 == "NaN-NaN-NaN"){
						date = "";
					}
					$(".overDate").text(date2||"");
					$(".person").text(data.data.apprApprover);
					var date1 = new Date(data.data.createTime);
					var date3 = window.formatDate(date1);
					if(date3 == "NaN-NaN-NaN"){
						date3 = "";
					}
					$(".upTime").text(date3||"");
					$(".appr-option").text(data.data.apprOption||"");
					$(".appr-option").attr("title",data.data.apprOption||"");
				}
			}
		});

		$(".btn-approval").on("click",function(){
			window.layerShow("完工确认","pro-construction-approvalOverAdd.html");

		});
		$(".btn-back").on("click",function(){
			window.layerShow("退回","pro-construction-approvalOverBack.html");
		});
		/*
		 * 渲染表格方法传入请求到的数据
		 * */
		function setTable (data)
		{
			var list = [],
				tbody = $(".tbody"),
				STr = null,type = "";

			list = data.data.result;
			if (list.length === 0)
			{
				$(".no-data").show();
			}
			else
			{
				$(".no-data").hide();
			}
			tbody.html("");
			$.each(list, function (i, v)
			{
				STr = $('<tr class="text-c" constructionId="'+ v.id+'"></tr>');//一行
				STr.append('<td title="下载" style="text-align:left;cursor:pointer;" class="down" attachment='+v.attachmentId+' class="td-view"><a class=" text-primary  href=javascript:;">' + v.planName + '</a></td>');

				STr.append('<td>' + v.createUserName + '</td>');
				STr.append('<td>' + v.createTimeStr + '</td>');
				STr.append('<td style="text-align:left;">' + v.remark + '</td>');

				STr.append('<td class="btns">' +
					'<a style="text-decoration:none" class="ml-5 op" href="javascript:;" title="查看" _href="pro-construction-checkData.html">'+
					'<i class="fa fa-eye" aria-hidden="true"></i></a>'+
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
			$(".tbody").find(".down").each(function(){
				var that = $(this);
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "project/attachment/findByIds",
					data: {"ids": that.attr("attachment")},
					success: function (data) {
						if (data && data.success === 0) {
							var arrImg = [
									"doc",
									"ppt",
									"xls",
									"zip",
									"txt",
									"pdf",
									"htm",
									"mp3",
									"mp4",
									"png"
								],
								nameArr = [],
								str = "",
								type = "unknown";

							if (data.data[0].attachName)
							{
								nameArr = data.data[0].attachName.split(".");
								str = nameArr[nameArr.length -1];
							}
							else
							{
								return false;
							}
							str = str.substr(0,3);
							$.each(arrImg, function (i, v)
							{
								if (str.toLowerCase() === v)
								{
									type = v;
								}
								else if ((str.toLowerCase() === "avi") || (str.toLowerCase() === "wmv"))
								{
									type = "mp4";
								}
								else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpg"))
								{
									type = "png";
								}
								else
								{

								}
							});
							that.append($("<img style='float:left;padding-left:6px;' src=../../images/commen/"+ type +".png>"));
						}
					}
				});
			});
		}
		$(".tbody").on("click", ".down", function ()
		{
			var _this = $(this),
				DownLoadFile = function (options)
				{
					var config = $.extend(true, { method: 'post' }, options);
					var $iframe = $('<iframe id="down-file-iframe" />');
					var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
					$form.attr('action', config.url);
					for (var key in config.data) {
						$form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
					}
					$iframe.append($form);
					$(document.body).append($iframe);
					$("#down-file-iframe").hide();
					$form[0].submit();
					$iframe.remove();
				};
			DownLoadFile({
				"url": window.ajaxUrl + "project/attachment/download",
				"method": "post",
				"data": {"attachId": _this.attr("attachment")}
			});
		});
		/*
		 * 获取表格中数据
		 * */
		function initTable (sendData)
		{
			var loading = "";
			loading = layer.msg('请稍后', {
				time: 0,
				icon: 16,
				shade: 0.1
			});


			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "project/construction/findPage",
				data:sendData,
				success: function (data)
				{
					if (data && data.success === 0)
					{
						layer.close(loading);
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
										type:"2",
										workOrderId:projectId
									};
									var planName = $(".search-area").find(".planName").val();
									planName ? sendData.planName = planName : false;
									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "project/construction/findPage",
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

		var sendData = {
			pageSize: "20",
			pageNo: "1",
			type:"2",
			workOrderId:projectId
		};
		initTable (sendData);


		/*每页显示多少条*/
		$(".pagination").on("click", ".con_much>i", function()
		{
			var _this = $(this),
				_ul = _this.parents(".con_much").children("ul"),
				_num = _this.parents(".con_much").find(".con_list_num");

			_ul.css({"display": "block"});
			_ul.find("span").off().on("click",function()
			{
				pageSize = $(this).html();
				_num.html(pageSize);
				_ul.css({"display": "none"});
				sendData = {
					pageSize: pageSize,
					pageNo: pageNo,
					type:"2",
					workOrderId:projectId

				};
				var planName = $(".search-area").find(".planName").val();
				planName ? sendData.planName = planName : false;
				initTable (sendData);
			});
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
		 * 按钮区按钮点击事件
		 * */
		tbody.on("click", ".btns .op", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				libId = "";
			var workName = parent.window.layerViewData.workName,
				projectName = parent.window.layerViewData.projectName,
				projectId = parent.window.layerViewData.projectId,
				site = parent.window.layerViewData.site;
			var constructionId = $(this).parents("tr").attr("constructionId");
			data.constructionId = constructionId;
			data.workName = workName;
			data.projectName = projectName;
			data.projectId = projectId;
			data.site = site;
			data.type = 2;
			window.layerViewData = data;
			window.layerShow(title,href);
		});
		tbody.on("click", ".btns .del", function ()
		{
			var libId = "";

			libId = $(this).parents("tr").attr("constructionId");
			layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function()
				{
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "project/construction/deleteById",
						data: {id: libId},
						success: function (data)
						{
							if (data && data.success === 0)
							{
								window.location.reload();
							}
						}
					});
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
			var DownLoadFile = function (options)
			{
				var config = $.extend(true, { method: 'post' }, options);
				var $iframe = $('<iframe id="down-file-iframe" />');
				var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
				$form.attr('action', config.url);
				for (var key in config.data) {
					$form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
				}
				$iframe.append($form);
				$(document.body).append($iframe);
				$form[0].submit();
				$iframe.remove();
			};

			DownLoadFile({
				"url": window.ajaxUrl + "project/attachment/download",
				"method": "post",
				"data": {"id": $(this).parent("td").attr("attachment")}
			})
		});

		/*
		 * 按钮区按钮点击事件
		 * */
		$(".btn-add").on("click", function ()
		{
			sessionStorage.setItem("constrcuctionType","2");
			window.layerShow("添加方案","pro-construction-add.html");
		});

		function findList()
		{
			var planName = $(".search-area").find(".planName").val();
			initTable ({pageSize: pageSize, pageNo: pageNo,planName:planName,workOrderId:projectId,type:"2"});
		}
		$(".find-btn").on("click", findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});
	});
}(jQuery, window, document));
