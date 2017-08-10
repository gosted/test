/**
 * 本文件是通用工单办理js文件
 * @ author 王步华
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 1000,
			pageNo = 1,
			tbody = $(".tbody"),
			workOrderId = parent.window.layerViewData.orderId,
			taskId = parent.window.layerViewData.taskId;
		window.getTd($(".form-table"));

		/*
		 * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
		 * */
		function setFormInfo (box,data)
		{
			var conNames = box.find('[con_name]'),
				_data = data.data,
				key = "",
				keyVal = "";
			for (var i= 0, len=conNames.size(); i<len; i++)
			{
				key = conNames.eq(i).attr("con_name");
				keyVal = _data[key];
				if (keyVal)
				{
					conNames.eq(i).text(keyVal);
				}
			}
		}

		//tab切换
		$.Huitab("#tab-category .tabBar span","#tab-category .tabCon","current","click",0);

		//显示清单方法
		function showList (data)
		{
			$.each(data, function (i, v)
			{
				var hiddenTr = $('[detailType="'+v.detailType+'"]').eq(0),
					tempTr = hiddenTr.clone().removeClass('hidden'),
					currTbody = hiddenTr.parents('tbody').eq(0),
					ATd = tempTr.children();
				$.each(ATd, function (j, va)
				{
					if ($(va).attr('con_name') === "detailStartDate" || $(va).attr('con_name') === "detailEndDate")
					{
						$(va).text(window.formatDates( v[$(va).attr('con_name')] ) || '');
					}
					else
					{
						$(va).text(v[$(va).attr('con_name')] || '');
					}
				});
				currTbody.append(tempTr);
			});

			//显示清单条数
			function showTipNum (_this)
			{
				var indClass = _this.attr('ind'),
					allNum = _this.find('.tbody tr').size(),
					editDisNum = allNum - 1;
				if (editDisNum > 0)
				{
					$('.' + indClass).find('.tip-num').text(editDisNum).show();
				}
				else
				{
					$('.' + indClass).find('.tip-num').hide();
				}

			}
			showTipNum($('.equipment-cnt'));
			showTipNum($('.server-cnt'));
			showTipNum($('.other-cnt'));
		}

		/*
		 * 传入附件ids 以逗号隔开的数组 显示到页面
		 * */
		function getFile(ids, fileList) {
			if(ids == null || ids == undefined || ids == "")
			{

			}
			else
			{
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "project/attachment/findByIds",
					data: {ids: ids},
					success: function (msg) {
						if (msg && msg.success === 0) {
							var attachm = msg.data,
								List="";
							$.each(attachm, function (i, data) {
								var plantype = data.attachName,  //文件名称
									index = plantype .lastIndexOf(".");
								plantype  = plantype .substring(index + 1, plantype .length);

								//判断文档类型
								function planpic() {
									var planimg = "";
									if (plantype == "doc" || plantype == "docx") {
										planimg = "../../images/commen/doc.png";
									}
									else if (plantype == "ppt" || plantype == "pptx") {
										planimg = "../../images/commen/ppt.png";
									}
									else if (plantype == "xls" || plantype == "xlsx") {
										planimg = "../../images/commen/xlsx.png";
									}
									else if (plantype == "zip" || plantype == "rar") {
										planimg = "../../images/commen/zip.png";
									}
									else if (plantype == "txt") {
										planimg = "../../images/commen/txt.png";
									}
									else if (plantype == "avi" || plantype == "mp4" || plantype == "wma" || plantype == "rmvb" || plantype == "3GP" || plantype == "flash" || plantype == "rm" || plantype == "mid") {
										planimg = "../../images/commen/video.png";
									}
									else if (plantype == "pdf") {
										planimg = "../../images/commen/pdf.png";
									}
									else if (plantype == "mp3") {
										planimg = "../../images/commen/audio.png";
									}
									else if (plantype == "jpg" || plantype == "png") {
										planimg = "../../images/commen/png.png";
									}
									else {
										planimg = "../../images/commen/unknown.png";
									}
									return planimg;
								}

								List += '<p lastmodified="" attachid="'+data.attachId+'">'+
									'<img src="'+ planpic() +'">'+
									'<a href="javascript:;" title="点击下载" class="ml-10">'+data.attachName+'</a>'+
									'</p>'
							});
							fileList.append(List);
						}
					}
				})
			}

		}

		//请求数据
		(function ()
		{
			//请求基本信息
			$.myAjax({
				type: "GET",
				url: window.ajaxUrl +"project/workOrder/findWorkOrder/"+workOrderId, //传入工单id
				data: {},
				dataType: "json",
				success: function(data)
				{
					if (data && data.success === 0)
					{
						var box = $("#workOrder"),
							list = null,
							attachmentIds = null,
							listStr = null;
						setFormInfo(box,data);//基本信息

						//请求清单信息
						$.myAjax({
							type:"POST",
							url: window.ajaxUrl +"project/proDeviceList/findByWorkOrderId",
							data:{
								workOrderId : workOrderId,
								pageSize : pageSize,
								pageNo : pageNo
							},
							datatype:"json",
							success:function(data)
							{
								if(data.data && data.success === 0)
								{
									showList(data.data.result);
								}
							}
						});

						//请求项目信息
						if( data.data.project ){
							$.myAjax({
								type:"POST",
								url: window.ajaxUrl +"project/project/findById",
								data:{id:data.data.project},
								datatype:"json",
								success:function(data)
								{
									if(data.data && data.success === 0)
									{
										$(".project").text(data.data.projectName)
									}

								}
							})
						}
						//请求工地信息
						if( data.data.site ){
							$.myAjax({
								type:"POST",
								url:window.ajaxUrl +"project/workSite/findByProjectId",
								data:{id:data.data.site},
								datatype:"json",
								success:function(data)
								{
									if(data.data && data.success === 0)
									{
										$(".worksite").text(data.data.worksiteName)
									}
								}
							})
						}

						//请求子项目
						if( data.data.subProject ){
							$.myAjax({
								type:"POST",
								url:window.ajaxUrl +"project/subProject/findByProjectId",
								data:{id:data.data.subProject},
								datatype:"json",
								success:function(data)
								{
									if(data.data && data.success === 0)
									{
										$(".subProject").text(data.data.subprojectName)
									}
								}
							})
						}

						//请求extensionInfos中的json数据
						if(data.data.extensionInfos)
						{
							list = data.data.extensionInfos;
							listStr = JSON.parse(list);
							$.each(listStr,function(i,v){
								$(".contract").text(v.contract);
								$(".contractNumber").text(v.contractNumber);
								$(".consignee").text(v.consignee);
								$(".assigner").text(v.assigner);
								attachmentIds= v.attachmentId;
								getFile(attachmentIds, $(".file-list-base"));
								//获取类型

								if(v.workOderType == "RKD") {
									$(".workOderType").text("入库单");
								}else if(v.workOderType == "CKD"){
									$(".workOderType").text("出库单");
								}else if(v.workOderType == "HSD"){
									$(".workOderType").text("回收单");
								}

							})

						}
					}
				}
			});
			//请求流转信息
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl +"project/workOrder/findApprovals", //传入工单id
				data: {workOrderId: workOrderId},
				dataType: "json",
				success: function(data)
				{
					if (data && data.success === 0)
					{
						$.each(data.data, function (i, v)
						{
							var tempTable = $('.history-info>.hidden').clone().removeClass('hidden');
							$.each(tempTable.find('[con_name]'), function (j, va)
							{
								if ($(va).attr('con_name') === 'apprTime')
								{
									$(va).text(window.formatDates(v[$(va).attr('con_name')]) || "");
								}
								else
								{
									$(va).text(v[$(va).attr('con_name')] || "");
								}
							});
							getFile(v.attachmentId,tempTable.find('.file-list'));//显示附件
							$('.history-info').append(tempTable);
						});
					}
				}
			});
		})();

		//附件下载
		$(".table-box").on("click",".file-list a",function ()
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
