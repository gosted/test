/**
 * 本文件的功能是支撑需求单页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var reqId = parent.window.layerViewData.reqId,
			taskId = parent.window.layerViewData.taskId,
			tables = $(".form-table"),
			ids = "";

		window.getTd(tables);



		//请求基本信息
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "preSupport/requirements/findById",
			data: {"id": reqId},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					var reqWorkload = $('.reqWorkload'),
						keyVal = "",
						reqIsSpot = "",
						reqIsPm = "",
						reqIsImportant = "",
						_data = data.data;

					if (!(_data.reqWorkload === null || _data.reqWorkload === ""))
					{
						reqWorkload.html(_data.reqWorkload + "人天");
					}

					reqIsSpot = _data.reqIsSpot;
					reqIsPm = _data.reqIsPm;
					reqIsImportant = _data.reqIsImportant;

					if (reqIsSpot === 1)
					{
						keyVal += "现场支撑";
					}
					if (reqIsPm === 1)
					{
						keyVal ? (keyVal += "、远程支撑") : (keyVal = "远程支撑");
					}
					if (reqIsImportant === 1)
					{
						keyVal ? (keyVal += "、重大项目") : (keyVal = "重大项目");
					}
					$(".supr-type").html(keyVal);
				}
			}
		});

		/*
		 * 渲染表格方法传入请求到的数据和在哪个tr后插入
		 * */
		function setTable (data,beforeBox)
		{
			var list = [],
				_files = $('<tr class="files">'+
					'<td class="table-key" colspan="5">附件：</td>'+
					'<td colspan="35" class="file-list"></td>'+
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


		//请求业务经理意见信息
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "preSupport/approval/findByIdJdfzr",
			data: {"reqId": reqId},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					var conName = $('[con_name]'),
						needInfo = $(".task-info"),
						_data = data.data,
						i = 0,
						len = conName.size(),
						key = "",
						keyVal = "",
						time = "",
						arr = [
							"apprApprover",
							"apprTime",
							"apprOption"
						];

					ids = data.data.attachmentId;
					if (ids)
					{
						//请求附件信息
						$.myAjax({
							type: "POST",
							url: window.ajaxUrl + "preSupport/attachment/findByIds",
							data: {"ids": ids},
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
					$.each(arr, function (i, v)
					{
						keyVal = _data[v];
						if (!(keyVal === null || keyVal === ""))
						{
							if ($('[con_name="'+ v +'"]').attr("_type") === "timesec")
							{
								keyVal = window.formatDateTimesec(keyVal);
							}
							$('[con_name="'+ v +'"]').html(keyVal);
						}
					});
				}
			}
		});

		//提交审批意见
		$(".btns-group .btn").on("click",function()
		{
			var sendData = {},
				apprOption = "",
				_flagRes = false,
				radios = null,
				_s = "-101",
				_aS = "",
				noDeer = "";

			sendData.reqId = reqId;
			radios = $(".radio_box input");

			for(var i=0;i < radios.length;i++)
			{
				if(radios.get(i).checked === true)
				{
					sendData.apprResult = radios.eq(i).val();
					noDeer = radios.eq(i).val();
					break;
				}
			}

			if ($(this).hasClass("return"))
			{
				sendData.apprResult = $(this).attr("value");
			}

			apprOption = $('.appr-option').val();
			sendData.apprOption = apprOption;
			sendData.taskId = taskId;
			_aS = apprOption.replace(/\s/g,"");
			(noDeer === "1" || noDeer === "-1") ? (_flagRes = true) : (_flagRes = false);

			if (_flagRes && _aS)
			{
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "preSupport/workFlow/createApproval",
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
			}

		});

		$(".table-box").Validform({
			btnSubmit: ".btns-group .btn",
			tiptype:2,
			beforeSubmit:function(curform){

			},
			callback:function(form){
				return false;
			}
		});

	});
}(jQuery, window, document));
