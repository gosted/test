/**
 * 本文件的功能是发起跟踪页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var reqId = parent.window.layerViewData.reqId,
			taskId = parent.window.layerViewData.taskId,
			processInstanceId = parent.window.layerViewData.processInstanceId,
			checkForm = $("#checkForm");

		window.layerViewData = parent.window.layerViewData;

		window.getTd(checkForm.find("table"));

		checkForm.Validform({
			btnSubmit: ".submit",
			tiptype:2,
			beforeSubmit:function(curform){
				/*
				* 提交跟踪信息
				* */
				var trackSpContent = $(".track-sp-content").val(),
					sendData = {};

				sendData.requirementId = reqId;
				sendData.trackSpContent = trackSpContent;
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "preSupport/track/create",
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

	});
}(jQuery, window, document));
