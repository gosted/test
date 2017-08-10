/**
 * 本文件是通用工单流程流转js文件
 * @ author 王步华
 */

(function($, w, d){
    'use strict';

    $(function() {
        var pageSize = 20,
            pageNo = 1,
            detailName = "",
            subprojectId = "",
            selected = false,
            tbody = $(".tbody"),
            tbodys = $(".tbodys"),
            uploadFile = $(".upload-file"),
            data = {};
        var workName = parent.window.layerViewData.workName,
            workOrderId = parent.window.layerViewData.projectId,
            taskId = parent.window.layerViewData.taskId,
            workType = parent.window.layerViewData.workType,
            workOrderNum = parent.window.layerViewData.workOrderNum;
        window.layerViewData =  parent.window.layerViewData;
        window.getTd($(".form-table"));

        //请求数据
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl +"project/workOrder/findApprovals", //传入工单id
            data: {workOrderId:workOrderId},
            dataType: "json",
            success: function(data)
            {
                var dataList =  data.data;

                if(dataList !="" || dataList != null){
                    $.each(dataList,function (i,v) {
                        var contain = $("<table border='' cellspacing='' cellpadding='' class='form-table table table-border table-bordered table-bg'></table>");
                        window.getTd(contain);

                        if (v.attachmentId != undefined || v.attachmentId != null || v.attachmentId != "") {
                            var str = "<tr><td colspan='5' class='table-key'>流转人：</td><td colspan='15'>" + (dataList[i].apprApprover || "") +"</td><td colspan='5' class='table-key'>处理时间：</td><td colspan='15'>" + (window.formatDates(dataList[i].apprTime) || "") + "</td></tr><tr><td colspan='5' class='table-key'>备注：</td><td colspan='35'>" + (dataList[i].apprOption || "") + "</td></tr><tr><td class='table-key' colspan='5'>附件：</td><td colspan='35' class='formControls file-list'></td></tr>";
                        }
                        else {
                            var str = "<tr><td colspan='5' class='table-key'>流转人：</td><td colspan='15'>" + (dataList[i].apprApprover || "") + "</td><td colspan='5' class='table-key'>处理时间：</td><td colspan='15'>" + (window.formatDates(dataList[i].apprTime) || "") + "</td></tr><tr><td colspan='5' class='table-key'>备注：</td><td colspan='35'>" + (dataList[i].apprOption || "") + "</td></tr>";
                        }

                        contain.append(str);
                        $(".dataList").append(contain);
                        if (v.attachmentId != undefined || v.attachmentId != null || v.attachmentId != "") {
                            fileDate(v.attachmentId, contain);
                        }
                        if (contain.index() % 2 == 1) {
                            contain.addClass("bluebg");
                        }
                        $(".bluebg").find(".table-key").css({"background": "#e0efff"});
                    })

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
                fileList.append(p);
            }
        }

        function fileDate(id,contain)
        {
            $.myAjax(
                {
                    type:"POST",
                    url:window.ajaxUrl + "project/attachment/findByIds",
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

    });
}(jQuery, window, document));

