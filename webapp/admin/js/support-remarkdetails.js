/**
* 本文件的备注详情页js文件
*@ author 陈安
*/

(function($, w, d){
	'use strict';

	$(function() 
	{
		var reqId = parent.window.layerViewData.reqId,
            taskId = parent.window.layerViewData.taskId,
            processInstanceId = parent.window.layerViewData.processInstanceId;
			//$(".loglist").on("click","[attachid]>a",downloadData);
		/*合并备注开始*/
		var model = $("#remark_model"),
			createTrFlag = true,
			uploadFile = $(".upload-file"),
			checkfoem = $("#checkForm").find(".form-table");
		window.getTd(checkfoem);
		//点击添加备注展开添加表单
		$(".remarkdetails_btn").on("click",function(){
			$("#remark_model").css( "display","block");
		});
		//上传附件
		uploadFile.on("change",function ()
		{
			var _this = this;
			console.log(123);
			fileUpload({
				ths: _this,
				msg: "正在上传文件",
				form: $("#upload"),
				fileList: $(".file-add-list"),
				sendData: {}
			});
		});

		//提交
		function saveData(event)
		{
			var _this = $(this);
			var needInput = $("[con_name]"),
				len = needInput.length;
			var obj = {};
			for(var i=0;i<len;i++)
			{
				var con_name = $(needInput[i]).attr("con_name");
				switch (con_name){
					case "remarkIsShow":
						if($(needInput[i]).val() == "")
						{
							$(needInput[i]).parent().next().css({"display":"block"});
							return;
						}
						else
						{

						}
						break;
					case "remarkDetail":
						if($(needInput[i]).val() == "")
						{
							$(needInput[i]).next().css({"display":"block"});
							return;
						}
						else
						{

						}
						break;
				}

			}
			var arrP = "";
			arrP = $(".file-add-list p");
			$.each(arrP, function (i, v)
			{
				obj.attachmentId += "," + $(v).attr("attachId");
			});
			if(arrP.length == 0)
			{
				obj.attachmentId = "";
			}
			else
			{
				obj.attachmentId = obj.attachmentId.substr(10);
			}
			obj.remarkDetail = model.find("[con_name='remarkDetail']").val();
			obj.remarkIsShow = model.find('input[name="remarkIsShow"]:checked').val();
			obj.reqId = reqId;
			$.myAjax(
			{
				type:"POST",
				url:window.ajaxUrl + "preSupport/remark/create",
				datatype:"json",
				data:obj,
				success:function(data)
				{
					if(data.success === 0)
					{
						layer.confirm('操作成功', {
							btn: ['关闭'],
							shade: 0.1
						},
						function()
						{
							window.location.replace(location.href);
							//window.location.reload();
						},
						function()
						{
							window.location.replace(location.href);
							//window.location.reload();
						})
					}
				}
			});
		}

		var submitBtn = model.find(".btns-group button").eq(0);

		submitBtn.on("click",$(".remark-btn"),saveData);
		$("#checkForm").Validform({
			btnSubmit: ".btns-group .btn",
			tiptype:2,
			callback:function(form){
				return false;
			}
		});


		/*合并备注结束*/
		$.myAjax(
		{
			type:"POST",
			url:window.ajaxUrl + "preSupport/remark/findPage",
			data:{"reqId":reqId,pageNo:1,pageSize:10000},
			success:function(data)
			{
				if(data.success === 0 && data.data.result)
				{
					var list = data.data.result;
					$.each(list, function(i,v) 
					{
						var contain = $("<table border='' cellspacing='' cellpadding='' class='form-table table table-border table-bordered table-bg'></table>");
						
						window.getTd(contain);
						if(v.remarkIsShow == 0)
						{
							v.remarkIsShow = "公开";
						}
						else
						{
							v.remarkIsShow = "不公开";
						}
						var timeDate = new Date(v.remarkTime);
						if(v.remarkTime == null || v.remarkTime == "")
						{
							timeDate = "";
						}
						else
						{
							timeDate = window.formatDateTimesec(timeDate);
						}
						if(v.attachmentId)
						{
							var str = "<tr><td colspan='5' class='table-key'>备注人：</td><td colspan='8'>"+v.remarkUserId+"</td><td colspan='5' class='table-key'>备注时间：</td><td colspan='8'>"+timeDate+"</td><td colspan='5' class='table-key'>状态：</td><td colspan='9'>"+v.remarkIsShow+"</td></tr><tr><td colspan='5' class='table-key'>备注信息：</td><td colspan='35'>"+v.remarkDetail+"</td></tr><tr><td class='table-key' colspan='5'>附件：</td><td colspan='35' class='formControls file-list'></td></tr>";	
						}
						else
						{
							var str = "<tr><td colspan='5' class='table-key'>备注人：</td><td colspan='8'>"+v.remarkUserId+"</td><td colspan='5' class='table-key'>备注时间：</td><td colspan='8'>"+timeDate+"</td><td colspan='5' class='table-key'>状态：</td><td colspan='9'>"+v.remarkIsShow+"</td></tr><tr><td colspan='5' class='table-key'>备注信息：</td><td colspan='35'>"+v.remarkDetail+"</td></tr>";
						}

						contain.append(str);
						$(".loglist").append(contain);
						if(v.attachmentId)
						{
							fileDate(v.attachmentId,contain);
						}
						if(contain.index()%2 == 1)
						{
							contain.addClass("bluebg");
						}
						$(".bluebg").find(".table-key").css({"background":"#e0efff"});
					});
				}
			}
		});
		
		function fileData(data,contain)
       	{
       		var fileList = contain.find(".file-list");
       		var arr = data.data;
       		for(var i=0;i<arr.length;i++)
       		{
       			var img = $("<img />"),
       				fileName = arr[i].attachName,
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
					"png",
				],
				p = $('<p></p>'),
				type="unknown",
				nameArr = fileName.split("."),
				str = nameArr[nameArr.length -1],
				str = str.substr(0,3);
				p.attr("attachId",arr[i].attachId);
				$.each(arrImg, function (i, v)
				{
					if (str.toLowerCase() === v)
					{
						type = v;
						return false;
					}
					else if ((str.toLowerCase() === "avi") || (str.toLowerCase() === "wmv"))
					{
						type = "mp4";
						return false;
					}
					else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpg"))
					{
						type = "png";
						return false;
					}
					else
					{
						
					}
				});
				img.attr("src","../../images/commen/"+ type +".png");
				p.append(img);
				p.append('<a class="downfile" title="点击下载文件">'+ fileName +'</a>');
				fileList.on("click", ".downfile", function ()
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
				fileList.append(p);
       		}
       	}
		function fileDate(id,contain)
		{
			$.myAjax(
			{
				type:"POST",
				url:window.ajaxUrl + "preSupport/attachment/findByIds",
				data:{"ids":id},
				success:function(data)
				{
					if(data.success === 0)
					{
						if (data && data.success === 0)
						{
							var attachid = "";
							for(var i=0;i<data.data.length;i++)
							{
								attachid += data.data[i].attachId + ",";
							}
							attachid = attachid.substring(0,attachid.length-1);
							$(".attachId").attr("attachid",attachid);
							fileData(data,contain);
						}
					}
				}
			});
		}
		function downloadData()
		{
			var id = $(this).attr("attachid");
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
		
			DownLoadFile({
				"url": window.ajaxUrl + "preSupport/attachment/findFileData",
				"method": "post",
				"data": {"attachId": id}
			})
		}
	});
}(jQuery, window, document));

