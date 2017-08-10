/**
 * 本文件的功能是跟踪反馈页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var reqId = parent.window.layerViewData.reqId,
			taskId = parent.window.layerViewData.taskId,
			jobFlowId = parent.window.layerViewData.jobFlowId,
			reqSupType = parent.window.layerViewData.reqSupType,
			id = "",
			checkForm = $("#checkForm"),
			uploadFile = $(".upload-file");

		window.getTd(checkForm.find("table"));

		//请求跟踪内容
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "preSupport/track/findById",
			data: {"id": jobFlowId},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					var time = "";
					if (data.data.trackSpId)
					{
						$('[con_name="trackSpId"]').html(data.data.trackSpRealName);
					}
					if (data.data.trackSpTime)
					{
						time = window.formatDateTimesec(data.data.trackSpTime);
						$('[con_name="trackSpTime"]').html(time);
					}
					if (data.data.trackSpContent)
					{
						$('[con_name="trackSpContent"]').html(data.data.trackSpContent);
					}
				}
			}
		});

		if (reqSupType === "0")
		{
			$(".contract, .contracting").on("click", function ()
			{
				$(".contract-date").html("预计签订日期：");
				$(".contract-money").html("预计金额（元）：");
			});
			$(".contracted").on("click", function ()
			{
				$(".contract-date").html("合同日期：");
				$(".contract-money").html("合同金额（元）：");
			});
		}
		else
		{
			$(".contract-all").remove();
		}


		$("#checkForm").Validform({
			btnSubmit: ".btns-group .submit",
			tiptype:2,
			datatype: {
				"money": /^\d{1,13}((\.\d{1,2})?)$/,
				"date": /^\d{4}\-\d{2}\-\d{2}$/
			},
			beforeSubmit:function(curform){
				/*
				 * 提交跟踪反馈信息
				 * */
				var sendData = {},
					radios = null,
					arrP = null,
					strId = "",
					trackContractState = "",
					trackContractTime = "",
					trackContractSum = "",
					trackReContent = "";

				radios = $(".radio_box input");
				for(var i=0;i < radios.size();i++)
				{
					if(radios.get(i).checked === true)
					{
						trackContractState = radios.eq(i).val();
						break;
					}
				}

				sendData.trackContractState = trackContractState;
				sendData.trackContractTime = $('[con_name="trackContractTime"]').val();
				sendData.trackContractSum = $('[con_name="trackContractSum"]').val();
				sendData.trackReContent = $('[con_name="trackReContent"]').val();
				sendData.id = jobFlowId;
				sendData.requirementId = reqId;
				arrP = $(".file-list p");
				if (arrP.size() > 0)
				{
					$.each(arrP, function (i, v)
					{
						strId += "," + $(v).attr("attachId");
					});
					strId = strId.substr(1);
				}
				sendData.attachmentId = strId;
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "preSupport/track/update",
					data: sendData,
					dataType: "json",
					success: function(msg)
					{
						if (msg && msg.success === 0)
						{
							var index = parent.parent.layer.getFrameIndex(parent.window.name);
							parent.parent.window.location.replace(parent.parent.window.location.href);
							parent.parent.layer.close(index);
						}
					}
				});
			},
			callback:function(form){
				return false;
			}
		});



		uploadFile.on("change",function ()
		{
			var _this = this;

			fileUpload({
				ths: _this,
				msg: "正在上传请稍后",
				form: $("#upload"),
				fileList: $(".file-list"),
				sendData: {}
			});
		});
		
	});
}(jQuery, window, document));
