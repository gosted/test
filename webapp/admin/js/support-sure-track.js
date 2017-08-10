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
			checkForm = $("#checkForm");

		window.getTd(checkForm.find("table"));
		if (reqSupType === "0")
		{
			$(".contract-all").show();
		}
		else
		{
			$(".contract-all").hide();
		}

		//请求跟踪内容
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "preSupport/track/findById",
			data: {"id": jobFlowId},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					var time = "",
						attachmentId = "",
						sta = "",
						date = "",
						trackId = data.data.id;
					if (data.data.trackSpRealName)
					{
						$('[con_name="trackSpRealName"]').html(data.data.trackSpRealName);
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
					if (data.data.trackReRealName)
					{
						$('[con_name="trackReRealName"]').html(data.data.trackReRealName);
					}
					if (data.data.trackReTime)
					{
						time = window.formatDateTimesec(data.data.trackReTime);
						$('[con_name="trackReTime"]').html(time);
					}
					if (data.data.trackContractState)
					{
						if (data.data.trackContractState === "HT-00")
						{
							sta = "未签订";
						}
						if (data.data.trackContractState === "HT-01")
						{
							sta = "签订中";
						}
						if (data.data.trackContractState === "HT-09")
						{
							sta = "已签订";
						}
						$('[con_name="trackContractState"]').html(sta);
					}
					if (data.data.trackContractTime)
					{
						date = window.formatDates(data.data.trackContractTime);
						$('[con_name="trackContractTime"]').html(date);
					}
					if (data.data.trackContractSum)
					{
						$('[con_name="trackContractSum"]').html(data.data.trackContractSum);
					}
					if (data.data.trackReContent)
					{
						$('[con_name="trackReContent"]').html(data.data.trackReContent);
					}

					attachmentId = data.data.attachmentId;
					if (attachmentId){
						$.myAjax({
							type: "POST",
							url: window.ajaxUrl + "preSupport/attachment/findByIds",
							data: {"ids": attachmentId},
							success: function (data)
							{
								if (data && data.success === 0)
								{
									var needInfo = $(".task-info");
									setTable(data,needInfo);
								}
							}
						});
					}
				}
				$(".sure").on("click",function ()
				{
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "preSupport/track/complete/" +taskId+ "/" +trackId,
						success: function (data)
						{
							if (data && data.success === 0)
							{
								var index = parent.parent.layer.getFrameIndex(parent.window.name);
								parent.parent.window.location.replace(parent.parent.window.location.href);
								parent.parent.layer.close(index);
							}
						}
					});
				});
			}
		});

		/*
		 * 渲染表格方法传入请求到的数据和在哪个tr后插入
		 * */
		function setTable (data,beforeBox)
		{
			var list = [],
				_files = $('<tr class="files">'+
					'<td class="table-key" colspan="4">附件：</td>'+
					'<td colspan="36" class="file-list"></td>'+
					'</tr>'),
				fileList = null,
				STr = null;

			fileList = _files.find(".file-list");
			list = data.data;
			fileList.html("");

			$.each(list, function (i, v)
			{
				var img = $("<img />"),
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
					else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpe"))
					{
						type = "png";
					}
					else
					{

					}
				});
				img.attr("src","../../images/commen/"+ type +".png");
				p.append(img);
				p.append('<span title="点击下载文件">'+ v.attachName +'</span>');
				fileList.append(p);
				if (beforeBox.parents("table").find(".files").size() === 0)
				{
					beforeBox.after(_files);
				}
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
								"url": window.ajaxUrl + "preSupport/attachment/findFileData",
								"method": "post",
								"data": {"attachId": _this.attr("attachId")}
							});
						}
					}
				});
			});
		}
	});
}(jQuery, window, document));
