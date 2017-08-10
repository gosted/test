/**
 * 本文件的功能是出库工单基本信息js文件
 * @ author 孙倩
 */

(function($, w, d){
	'use strict';

	$(function()
	{
        var id = window.parent.layerViewData.orderId,
			pageSize = 1000,
			pageNo = 1,
            datas={},
			myWorkType="",
            tables = $(".form-table");

        window.getTd(tables);
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
		//请求工单信息
		$.myAjax({
			type:"get",
			url: window.ajaxUrl +"project/workOrder/findWorkOrder/"+id,
			data:{},
			dataType:"json",
			success:function(data){
				//判断文档类型
				function planpic(plantype) {
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
				if(data && data.success===0){
					var _data=data.data;
					var arr=[ "workType",
						"workOrderNum",
						"createTime",
						"workOrderName",
						"project",
						"site",
						"subProject",
						"contract",
						"contractNumber",
						"receiptConfRemark",
						"receiver",
						"receiverPhone",
						"receiverMail",
						"checkResult",
						"checkOpinion",
						"status",
						"remark"
					];
                    $.each(arr, function (i, v)
                    {
                        var keyVal=_data[v];

                        if (!(keyVal === null || keyVal === ""))
                        {
                            $('[con_name="'+ v +'"]').text(keyVal);
                        }
                    });



					if(_data.workType==2){

						myWorkType="施工工单";
						$('.workType').text(myWorkType);
					}
					else if(_data.workType==1)
					{
						myWorkType="出库工单";
						$('.workType').text(myWorkType);
					}
					$('.creatTimes').text(window.formatDates(_data.createTime || ""));


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

					if( data.data.subProjectId ){
						$.myAjax({
							type:"POST",
							url:window.ajaxUrl +"project/subProject/findByProjectId",
							data:{id:data.data.subProjectId},
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


					//联系人神马的
					if(data.data.extensionInfos)
					{
						var  list = data.data.extensionInfos,
							planimg="",
							sTr=null,
						listStr = JSON.parse(list);
						$.each(listStr,function(i,v){
							$(".contract").text(v.contract);
							$(".contractNumber").text(v.contractNumber);
							$(".consignee").text(v.consignee);
							$(".consigneePhone").text(v.consigneePhone);
							$(".storageName").text(v.storageName);
							$(".consigneeEmail").text(v.consigneeEmail);
							$(".consigneeAdd").text(v.consigneeAdd);
                            $(".download").attr("attachmentId", v.attachmentId);
							getFile(data.data.attachmentId,$(".download"));
						})

					}
					//请求清单信息
					$.myAjax({
						type:"POST",
						url: window.ajaxUrl +"project/proDeviceList/findByWorkOrderId",
						data:{
							workOrderId : id,
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
					//请求审批结果审批意见

					if( data.data.id ){
						$.myAjax({
							type:"post",
							url:window.ajaxUrl +"project/workOrder/findApproval",
							data:{workOrderId:data.data.id,processLinkName:"领导审批"},
							datatype:"json",
							success:function(data)
							{
								if(data.data && data.success === 0)
								{
									$("#jdApprApprover").text(data.data.apprApprover);
									$("#jdApprOption").text(data.data.apprOption==null?"":data.data.apprOption);
									$("#jdApprTime").text(window.formatDateTimesec(data.data.apprTime));
									if(data.data.apprResult != null && data.data.apprResult==1){
										$("#jdApprResult").text("同意")
									}
									else{
										$("#jdApprResult").text("不同意")
									}

								}

							}
						});
						
						$.myAjax({
							type:"post",
							url:window.ajaxUrl +"project/workOrder/findApproval",
							data:{workOrderId:data.data.id,processLinkName:"出库处理"},
							datatype:"json",
							success:function(data)
							{
								if(data.data && data.success === 0)
								{
									$("#ckApprApprover").text(data.data.apprApprover);
									$("#ckApprOption").text(data.data.apprRemark==null?"":data.data.apprRemark);
									$("#ckApprTime").text(window.formatDates(data.data.apprTime));
									getFile(data.data.attachmentId,$(".download-out"));
								}

							}
						});
						
						$.myAjax({
							type:"post",
							url:window.ajaxUrl +"project/proReceiptConf/find",
							data:{workOrderId:data.data.id},
							datatype:"json",
							success:function(data)
							{
								if(data.data && data.success === 0)
								{
									$("#shApprApprover").text(data.data.receiptConfContact);
									$("#receiptConfRemark").text(data.data.receiptConfRemark==null?"":data.data.receiptConfRemark);
									$("#shApprTime").text(window.formatDates(data.data.receiptConfTime));
									getFile(data.data.attachmentId,$(".downloadtwo"));
								}

							}
						});
					}
				}
			}
		});
	});
}(jQuery, window, document));
