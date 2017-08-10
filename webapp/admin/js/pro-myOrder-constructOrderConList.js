/**
 * 本文件的功能是施工工单基本信息js文件
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
			planimg="",
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
		//请求工单信息
		function getType() {
			//请求类型
			$.myAjax({
				type: "get",
				url:  window.ajaxUrl +"project/workOrder/findWorkOrder/"+id,
				data: {},
				dataType: "json",
				success: function(data){
					if (data && data.success === 0) {

						$('.workOrderName').text(data.data.workOrderName);
						$('.workOrderNum').text(data.data.workOrderNum);
						$('.remark').text(data.data.remark);

						if(data.data.workType==2){

							myWorkType="施工工单";
							$('.workType').text(myWorkType);
						}
						else if(data.data.workType==1)
						{
							myWorkType="出库工单";
							$('.workType').text(myWorkType);
						}


						var creatTimes = new Date(data.data.createTime);
						if(data.data.createTime == null || data.data.createTime == "")
						{
							creatTimes = "";

						}
						else
						{
							creatTimes  = window.formatDates(creatTimes);
							$('.creatTimes').text(creatTimes);
						}
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
								listStr = JSON.parse(list);
							$.each(listStr,function(i,v){
								$(".contract").text(v.contract);
								$(".contractNumber").text(v.contractNumber);
								$(".consignee").text(v.consignee);
								$(".consigneePhone").text(v.consigneePhone);
								$(".storageName").text(v.storageName);
								$(".consigneeEmail").text(v.consigneeEmail);
								$(".download").attr("attachmentId", v.attachmentId);
								$('[con_name="partnerId"]').text(v.partnerId || "");
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
								if (v.attachmentId)
								{
									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "project/attachment/findByIds",
										data: {"ids": v.attachmentId},
										success: function (data) {
											if (data && data.success === 0) {
												//获取附件名字

												if (typeof (data.data) == "object" && data.data.length > 0)
												{
													$.each(data.data, function (i, v)
													{
														var planName = v.attachName,

															index = planName.lastIndexOf(".");

														var plantype = planName.substring(index + 1, planName.length);
														planpic(plantype);
														var sTr = $('<p><a href="javascript:;" attachId="'+v.attachId+'">' + '<img class="doSptMdlPro-name-img" src="' + planimg + '"/>' + planName + '</a></p>');
														$(".download").append(sTr);
													});

													//下载附件
													$(".download").on("click", "a", function(){

														var _this = $(this);
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
														$.myAjax({
															type: "POST",
															url: window.ajaxUrl + "preSupport/attachment/checkIsLogin",
															data: {},
															dataType: "json",
															success: function(data)
															{
																if (data && data.success === 0)
																{
																	DownLoadFile({
																		"url": window.ajaxUrl + "/project/attachment/findFileData",
																		"method": "post",
																		"data": {"attachId":_this.attr("attachId")}
																	});
																}

															}
														});

													})
												}
											}
										}
									});
								}
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
										$("#jdApprTime").text(window.formatDates(data.data.apprTime));
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
								data:{workOrderId:data.data.id,processLinkName:"施工中"},
								datatype:"json",
								success:function(data)
								{
									if(data.data && data.success === 0)
									{
										$("#sgApprApprover").text(data.data.apprApprover);
										$("#sgApprOption").text(data.data.apprOption==null?"":data.data.apprOption);
										$("#sgApprTime").text(window.formatDates(data.data.apprTime));

									}

								}
							});

							$.myAjax({
								type:"post",
								url:window.ajaxUrl +"project/workOrder/findApproval",
								data:{workOrderId:data.data.id,processLinkName:"完工确认"},
								datatype:"json",
								success:function(data)
								{
									if(data.data && data.success === 0)
									{
										$("#wgApprApprover").text(data.data.apprApprover);
										$("#wgApprOption").text(data.data.apprOption==null?"":data.data.apprOption);
										$("#wgApprTime").text(window.formatDates(data.data.apprTime));

									}

								}
							})
						}
						$.myAjax({
							type: "post",
							url: window.ajaxUrl + "data/project/proMyOrderConstructOrderConList.json",
							data: {id: id},
							dataType: "json",
							success: function (data) {
								if (data && data.success === 0) {
									var _data = data.data;
									var arr = ["workType",
										"workOrderCode",
										"createTime",
										"workOrderName",
										"project",
										"site",
										"subProject",
										"contract",
										"contractNumber",
										"clientName",
										"receiver",
										"receiverPhone",
										"receiverMail",
										"checkResult",
										"checkOpinion",
										"status",
										"constructContact",
										"constructPhone"
									];

									$.each(_data, function (i, v) {
										if (_data[i].id === id) {
											datas = _data[i];
										}
									});
									$.each(arr, function (i, v) {
										var keyVal = datas[v];

										if (!(keyVal === null || keyVal === "")) {
											$('[con_name="' + v + '"]').text(keyVal);
										}
									});
								}
							}
						})
					}
				}}

		)
		}
		getType();

	});
}(jQuery, window, document));
