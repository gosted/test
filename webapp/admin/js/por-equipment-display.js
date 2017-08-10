/**
 * 本文件是出库确认列表js文件
 * @ author 王步华
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 1000,
			pageNo = 1,
			detailName = "",
			uploadFile = $(".upload-file"),
			tbody = $(".tbody"),data = {};
		var workName = parent.window.layerViewData.workName,
			workOrderId = parent.window.layerViewData.projectId,
			taskId = parent.window.layerViewData.taskId,
            workType = parent.window.layerViewData.workType,
            workOrderNum = parent.window.layerViewData.workOrderNum;
		window.layerViewData =  parent.window.layerViewData;
		window.getTd($(".form-table"));
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
					if(v.detailStartDate==""|| v.detailStartDate==null){
						startTime=""
					}
					else{
						startTime=window.formatDateTimesec(startTime);
					}
					var endTime=new Date(v.detailEndDate);
					if(v.detailEndDate==""|| v.detailEndDate==null){
						endTime=""
					}
					else{
						endTime=window.formatDateTimesec(endTime);
					}
					var atachms = "";
					if(v.equipmentIcon == null || v.equipmentIcon == ""){
						atachms = "../../images/temporary/equ_logo.png";
					}else{
						atachms = window.ajaxUrl+"project/attachment/downloadImage?id="+v.equipmentIcon
					}
					STr = $('<tr style="background:#eee" class="text-c" detailId="'+ v.id+'"></tr>');//一行
					STr.append($('<td class="text-c" style="line-height: 30px;"></td>').text(v.detailName || "").append($("<img style='float:left;padding:2px 0 2px 6px;' src="+atachms+">")));
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
					STr.append($('<td style="color:#006fbb" ></td>').text("备注"));
					tbody.append(STr);
					var len = list[i].outOrderList.length;
					var dataList = list[i].outOrderList;
					if(len){
						for(var j = 0;j<len;j++){
							var logisticsIdLen="",
								logLenSub="",
								logisticsId="";
							if(dataList[j].logisticsId == null || dataList[j].logisticsId == ""){
								logisticsId ="";
							}else{
								logisticsIdLen = (dataList[j].logisticsId).length;
								logLenSub = (dataList[j].logisticsId).substring(0,logisticsIdLen-1);
								logisticsId = logLenSub.replace(/[&\,\\\*^%$#@\-]/g," ");
							}

							STr = $('<tr style="background:#fff" class="text-c" detailId="'+dataList[j].outOrderId+'"></tr>');//一行
							STr.append($('<td class="td-view text-c"></td>').text(j+1));
							STr.append($('<td></td>').text(dataList[j].outDetailName|| ""));
							var date = new Date(dataList[j].outDetailTime);
							STr.append($('<td></td>').text(window.formatDate(date)));
							STr.append($('<td></td>').text(dataList[j].outOrderCode || ""));
							STr.append($('<td></td>').text(dataList[j].outDetailNum || ""));
							STr.append($('<td width="150"></td>').text(logisticsId || ""));
							STr.append($('<td></td>').text(dataList[j].outDetailRemark || ""));
							tbody.append(STr);
						}
					}else{
						var STr1 = $('<span style="height:30px;position:absolute;right:50%;margin-left:-20px;" class="text-c tmpNo"></span>');//一行
						tbody.append($("<tr style='height:30px;display:block;border-left:1px solid #ddd'></tr>").append(STr1));
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
					}
				}
			});
		}

		renderingPage({
			pageSize : pageSize,
			pageNo : pageNo,
			workOrderId:workOrderId
		});

	});
}(jQuery, window, document));
