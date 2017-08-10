/**
 * 本文件是出库确认列表js文件
 * @ author 王步华
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
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
			pageSize: pageSize,
			pageNo: pageNo,
			workOrderId:workOrderId

		});

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
			var sendData = {},
				checkList = $(".checkbox").find(".check"),
				time=Date.parse(new Date()),
				strId = "",
				arrP = $(".file-list p");
			$.each(arrP, function (i, v)
			{
				strId += "," + $(v).attr("attachId");
			});
			strId = strId.substr(1);

			checkList.eq(0).prop("checked") == true?sendData.isSendEmail = 1:sendData.isSendEmail = 0;
			checkList.eq(1).prop("checked") == true?sendData.isSendMsg = 1:sendData.isSendMsg = 0;
			sendData.apprRemark = $(".appr_remark").val();
			sendData.apprTime = window.formatDates(time);
			sendData.apprApprover = $.cookie("sendusername");
			sendData.attachmentId = strId;
			 sendData.id= workOrderId;
			 sendData.step=3;
			 sendData.workType=1;
			 sendData.taskId= taskId;
			 $.myAjax({
				 type: "POST",
				 url: window.ajaxUrl + "project/workOrder/approval",
				 data: sendData,
				 success: function (data) {
					 if (data && data.success === 0) {
						 $.cookie("lzg_taskId",null);
						 $.cookie("lzg_projectId",null);
						 layer.confirm('提交成功', {
								 btn: ['确定'],
								 shade: 0.1
							 },
							 function () {
								 parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
							 },
							 function () {
								 parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
							 });
					 }
				 }
			 });
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

		/*
		 *上传文件
		 */
		uploadFile.on("change",function ()
		{
			var _this = this;

			fileUpload({
				ths: _this,
				msg: "正在上传文件",
				form: $("#upload"),
				fileList: $(".file-list"),
				createUrl: "project/attachment/create",//增加地址
				infoUrl: "project/attachment/createFileInfo",//返回信息地址
				delUrl: "project/attachment/deleteFileById",//删除的地址
				sendData: {}
			});
		});
		/*文件上传结束*/

		//附件下载
		$(".file-list").on("click","span",function ()
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
					$form[0].submit();
					$iframe.remove();
				};

			DownLoadFile({
				"url": window.ajaxUrl + "project/attachment/download",
				"method": "post",
				"data": {"attachId": _this.parents("p").attr("attachid")}
			});
		});

	});
}(jQuery, window, document));
