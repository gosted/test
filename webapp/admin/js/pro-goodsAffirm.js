/**
 * 本文件是收货确认列表js文件
 * @ author 孙倩
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			detailName = "",
			tbody = $(".tbody"),data = {};
		var  tables = $(".form-table");
		window.getTd(tables);
		var workName = parent.window.layerViewData.workName;
		var workOrderId = parent.window.layerViewData.projectId,
			taskId = parent.window.layerViewData.taskId,
            workType = parent.window.layerViewData.workType,
            workOrderNum = parent.window.layerViewData.workOrderNum,
			workFlowId = parent.window.layerViewData.workFlowId;
		window.layerViewData =  parent.window.layerViewData;
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "/project/workOrder/findApproval",
			data: {workOrderId:workOrderId},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					$(".outOderPerson").text("出库人:  "+data.data.apprApprover);
					var date = new Date(data.data.apprTime);
					var date1 = window.formatDate(date);
					if(date1 == "NaN-NaN-NaN"){
						date1 = "";
					}
					$(".outOderTime").text("出库时间:  "+date1);
					$(".apprOption").text(data.data.apprRemark||"");
					var ids = data.data.attachmentId;
					if (ids)
					{
						$.myAjax({
							type: "POST",
							url: window.ajaxUrl + "project/attachment/findByIds",
							data: {"ids": ids},
							success: function (data)
							{
								if (data && data.success === 0)
								{
									var needInfo=$(".attach");
									setData(data,needInfo);
								}
							}
						});
					}
				}
			}
		});

		function setData (data,beforeBox)
		{
			var list = [],
				fileList = null,
				STr = null;

			fileList = $(".file-list");
			list = data.data;
			fileList.html("");

			$.each(list, function (i, v)
			{
				var img = $("<img />"),
					button = $("<a class='btn btn-success radius ml-10'><i class='Hui-iconfont'>&#xe6e2</i>删除</a>"),
					arrImg = [
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
					type = "unknown",
					p = $('<p></p>');

				if (v.attachName)
				{
					nameArr = v.attachName.split(".");
					str = nameArr[nameArr.length -1];
				}
				else
				{
					return false;
				}
				p.attr("attachId",v.attachId);
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
				img.attr("src","../../images/commen/"+ type +".png");
				p.append(img);
				p.append('<span title="点击下载文件" style="cursor: pointer">'+ v.attachName +'</span>');
				button.on("click", function ()
				{
					var _this = $(this),
						id = $(this).parent().attr("attachId");
					$.myAjax({
						type:"POST",
						url:ajaxUrl + "project/attachment/deleteFileById",
						data:{"id":id},

						success:function(data)
						{
							if(data.success === 0)
							{
								_this.parent().remove();
							}
						},
						error:function(msg)
						{
							layer.confirm('删除失败', {
								btn: ['确定','取消'],
								shade: 0.1
							});
						}
					});
				});
				fileList.append(p);
			});

			fileList.on("click", "p>span", function ()
			{
				var _this = $(this).parent(),
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
						$form[0].submit();
						$iframe.remove();
					};
				DownLoadFile({
					"url": window.ajaxUrl + "project/attachment/download",
					"method": "post",
					"data": {"attachId": _this.attr("attachId")}
				});
			});
		}

		/*
		 * 渲染表格方法传入请求到的数据
		 * */
		$(".workName").text("工单名称:  "+workName);
		$(".workCode").text("工单编号:  "+workOrderNum);
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

			//工单列表
			(function ()
			{
				$.each(list, function (i, v)
				{
					//var workOrderId = v.workOrderId,

						var dictCodeName = "",
						view = $('<a href="javascript:;"></a>');
					var startTime=new Date(v.detailStartDate);
                        if(v.detailStartDate==""||v.detailStartDate==null){
							startTime=""
						}
					else{
							startTime=window.formatDateTimesec(startTime);
						}
					var endTime=new Date(v.detailEndDate);
                        if(v.detailEndDate==""||v.detailEndDate==null){
							endTime=""
						}
					else{
							endTime=window.formatDateTimesec(endTime);
						}
					STr = $('<tr style="background:#eee" class="text-c" detailId="'+ v.id+'"></tr>');//一行

					if(v.equipmentIcon){
						STr.append($('<td style="line-height:30px;" class="text-c"></td>').text(v.detailName || "").append($("<img style='float:left;padding:2px 0 2px 12px;' src="+window.ajaxUrl+"project/attachment/downloadImage?id="+v.equipmentIcon+">")));
					}else{
						STr.append($('<td style="line-height:30px;" class="text-c"></td>').text(v.detailName || "").append($("<img style='float:left;padding:2px 0 2px 12px;' src='../../images/temporary/equ_logo.png'>")));
					}

					STr.append($('<td class="text-c"></td>').text(v.detailModel || ""));
					STr.append($('<td class="text-c"></td>').text(v.detailCompany));
					STr.append($('<td class="text-c"></td>').text(v.detailUnit || ""));
                    var sum = "<span style='color:red;'>"+v.outNum+"</span>";
                        sum+= "/";
                        sum += v.detailCount;
					STr.append($('<td class="text-c"></td>').html(sum));
					STr.append($('<td class="text-l" style="text-indent:8px;" colspan="2"></td>').text(v.detailRemark|| ""));
					tbody.append(STr);
					STr = $('<tr style="background:#fff;" class="text-c"></tr>');//一行
					STr.append($('<td style="color:#006fbb"  width="20" class="td-view text-c"></td>').text("序号"));
					STr.append($('<td style="color:#006fbb;line-height:30px;"  class="td-view text-c"></td>').text("设备名称"));
					STr.append($('<td style="color:#006fbb" ></td>').text("出库时间"));
					STr.append($('<td style="color:#006fbb" ></td>').text("出库单号"));
					STr.append($('<td style="color:#006fbb" ></td>').text("数量"));
					STr.append($('<td style="color:#006fbb" ></td>').text("快递"));
					STr.append($('<td style="color:#006fbb;" ></td>').text("备注"));
					tbody.append(STr);
					var len = list[i].outOrderList.length;
                    var dataList = list[i].outOrderList;
					if(len){
						for(var j = 0;j<len;j++){
							STr = $('<tr style="background:#fff" class="text-c" detailId="'+dataList[j].outOrderId+'"></tr>');//一行
							STr.append($('<td class="td-view text-c"></td>').text(j+1));
							STr.append($('<td></td>').text(dataList[j].outDetailName|| ""));
                            var date = new Date(dataList[j].outDetailTime);
							STr.append($('<td></td>').text(window.formatDate(date)));
							STr.append($('<td></td>').text(dataList[j].outOrderCode || ""));
							STr.append($('<td></td>').text(dataList[j].outDetailNum || ""));
							var replaceStr = ',';
							var str = dataList[j].logisticsId,str1 = "";
							if(str){
								str1 = str.replace(new RegExp(replaceStr,'gm'),' ');
							}

							STr.append($('<td width="150"></td>').text(str1 || ""));
							STr.append($('<td style="text-align:left;"></td>').text(dataList[j].outDetailRemark || ""));
							tbody.append(STr);
						}
					}else{
						var STr1 = $('<span style="height:30px;position:absolute;right:50%;margin-left:-20px;" class="text-c tmpNo"></span>');//一行
						tbody.append($("<tr style='height:30px;line-height:30px;display:block;border-left:1px solid #ddd'></tr>").append(STr1));
						$(".tmpNo").text("暂无数据");
					}

				});
			})();
		}


		/*渲染表格和分页的方法,传入要向后台传的数据*/
		function renderingPage (sendData)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "project/proDeviceList/findByWorkOrderIdDHQR",
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
										workOrderId:workOrderId

									};

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "project/proDeviceList/findByWorkOrderIdDHQR",
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
								'每页<i class="con_list_num">3</i>条'+
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

		renderingPage({
			pageSize: pageSize,
			pageNo: pageNo,
			workOrderId:workOrderId

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
			workOrderId ? sendData.workOrderId = workOrderId : false;
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

			detailName = search.find('[con_name="detailName"]').val();
			//workOrderId = search.find('[workOrderId="10000"]').val();
			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				workOrderId:workOrderId
			};

			detailName? sendData.detailName = detailName : false;
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
		$(".approval-btn").on("click",function(){
            window.layerShow("确认收货","pro-approval.html");
		});
		/*
		 * 列表内按钮区按钮点击事件
		 * */
		tbody.on("click", ".btns a", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				workId = "";

			if (!href)
			{
				return false;
			}
			workId = $(this).parents("tr").attr("workId");
			data.projectId = workId;
			window.layerViewData = data;
			window.layerShow(title,href);
		});

	});
}(jQuery, window, document));
