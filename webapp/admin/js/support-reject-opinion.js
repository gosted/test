/**
 * 本文件退回详情js文件
 *@ author 陈安
 */

//有陈安写的上传
(function($, w, d){
	'use strict';

	$(function() {
		var reqId = parent.window.layerViewData.reqId,
        taskId = parent.window.layerViewData.taskId,
        conStr = parent.window.layerViewData.conStr,
        backtime = parent.window.layerViewData.backtime,
        backperson = parent.window.layerViewData.backperson,
        processInstanceId = parent.window.layerViewData.processInstanceId,
        attachId = parent.window.layerViewData.attachmentId;
        window.getTd($(".table"));
        //$(".table").on("click","[attachid]>a",downloadData);
        $(".backperson").html(backperson);
        $(".backtime").html(backtime);
        $(".opinion").html(conStr);
        $(".rejectclose").on("click",closeProcess);
        $(".rejectedit").on("click",changeEdit);
        if(attachId)
        {
        	$.myAjax(
			{
				type:"POST",
				url:window.ajaxUrl + "preSupport/attachment/findByIds",
				data:{"ids":attachId},
				success:function(data)
				{
					if(data.success === 0)
					{
						fileData(data);				
					}
				}
			});
        }
        
        function fileData(data)
       	{
       		var arr = data.data;
       		var fileList = $(".file-list");
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
					"png"
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
					}
					else if ((str.toLowerCase() === "avi") || (str.toLowerCase() === "wmv"))
					{
						type = "mp4";
					}
					else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpg"))
					{
						type = "png";
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
				$(".file-list").append(p);
				$(".file-list").siblings().html("附件：");
	       	}
       	}
 
        /*关闭流程方法*/
        function closeProcess()
        {
        	article_submit("您确定要终止该流程吗?");
        }
        
        function article_submit(str)
        {
			if(str.indexOf("您确定要终止该流程吗")>-1)
			{
				layer.confirm(str, {
				btn: ['确定',"取消"], 
				shade: 0.1
				},
				function(){
					$.myAjax(
					{
						type:"POST",
						url:window.ajaxUrl + "preSupport/workFlow/complete/"+taskId+"/"+reqId,
						data:{"valueCode":"1"},
						success:function(data)
						{
							if(data.success === 0 && data.data)
							{
								var list = data.data;
								$(".opinion").append(list);
								parent.parent.window.location.reload();
								$(parent.parent.window.document).find(".layui-layer-shade").remove();
				       			$(parent.parent.window.document).find(".layui-layer").remove();
							}
						}
					});	
				},
				function()
				{
					
				})
			}
			else if(str.indexOf("操作失败")>-1)
			{
				layer.confirm(str, {
					btn: ['确定','取消'], 
					shade: 0.1
				},
				function()
				{
					
				},
				function()
				{
					
				});
			}
			
		}
        /*跳转编辑页面方法*/
       function changeEdit()
       {
         	parent.parent.window.layerShow("支撑需求单","support-my-launch.html");
       }
	});
}(jQuery, window, document));


