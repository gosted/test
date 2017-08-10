/*
* 方案表列表页js文件
*@author 王步华
*/
(function($, w, d){
    'use strict';
    $(function() {
    var reqId = parent.window.layerViewData.reqId;
     window.layerViewData = parent.window.layerViewData;
        var pro = [],
            html = "";
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "preSupport/plan/findDictionary",
            data: {"dictCode": "CP"},
            success: function (msg) {
                if (msg && msg.success === 0)
                {
                    pro = msg.data;
                    //获取方案列表
                    var obj = "";
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "preSupport/plan/findPage",
                        data: {"pageSize": 20, "reqId": reqId},
                        success: function (data) {
                            if (data && data.success === 0)
                            {
                                if(data.data == ""){
                                    var titleli = '<div style="font-size: 36px; color: #999; text-align: center">&nbsp;</div>';
                                    $(".ScheduleListPage-list").append(titleli);
                                }else {
                                    getDatas(data.data);
                                }
                            }
                        },
                        error: function (msg) {
                        }
                    });

                }
            }

        });

        function getDatas(data) {
            var obj = {};
            html = "";
            $.each(data, function (i, data) {
                var plantype = data.attachmentName,  //文件名称
                    index = plantype .lastIndexOf(".");
                plantype  = plantype .substring(index + 1, plantype .length);
                var planimg;
                var proValue = "";

                if (data.planProducts)
                {
                    var arr = data.planProducts.split(",");
                    $.each(arr, function(j, v)
                    {
                        $.each(pro, function (k,va)
                        {
                            if (va.dictCodeValue == v)
                            {
                                proValue += va.dictCodeName + "、";
                            }
                        });
                    });
                    proValue = proValue.substring(0,proValue.length - 1);
                }
                //判断文档类型
                function planpic() {
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
                planpic();

                html  +="<table class='table table-border table-bordered table-bg form-table'>"+
                    "<tr>"+
                    "<td colspan='5' class='table-key'>" +"方案名称：" +"</td>"+
                    "<td colspan='22' class=' download' value='' placeholder='' ids='"+data.attachmentId+"' name='' readonly='readonly'><a href='javascript:;'>"+"<img class='doSptMdlPro-name-img' src='" + planimg + "' />"+data.planName+"</a></td>"+
                    "<td  colspan='5' class='table-key'>上传人：</td>"+
                    "<td  colspan='8' class='' value='' placeholder='' id='' name='' readonly='readonly'>"+data.createUserRealName+"</td>"+
                    "</tr>"+
                    "<tr >"+
                    "<td  colspan='5' class='table-key'>对应客户：</td>"+
                    "<td  colspan='22' class='' value='' placeholder='' id='' name='' readonly='readonly'>"+data.customerName+"</td>"+
                    "<td  colspan='5' class='table-key'>上传时间：</td>"+
                    "<td  colspan='8' class='' value='' placeholder='' id='' name='' readonly='readonly'>"+(data.createTimeStr=="null"?"":(data.createTimeStr))+"</td>"+
                    "</tr>"+
                    "<tr >"+
                    "<td  colspan='5' class='table-key'>对应工地：</td>"+
                    "<td colspan='35' class='' value='' placeholder='' id='' name='' readonly='readonly'>"+data.planSite+"</td>"+
                    "</tr>"+

                    "<tr >"+
                    "<td  colspan='5' class='table-key'>对应产品：</td>"+
                    "<td  colspan='35' class='' value='' placeholder='' id='' name='' readonly='readonly'>"+proValue+"</td>"+

                    "</tr>"+
                    "</table>"
            });
            $(".ScheduleListPage-list").append(html);
            var chedule = $(".ScheduleListPage-list").find("table");
            window.getTd(chedule);

            for(var i=0; i<chedule.length;i++){
                if(i%2 == 1){
                    chedule.eq(i).addClass("bluebg");
                    $(".bluebg").find(".table-key").css({"background":"#e0efff"});
                }
            }

            //点击方案列表下载
            $(".download").on("click",function()
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
                                "url": window.ajaxUrl + "preSupport/plan/findFileData",
                                "method": "post",
                                "data": {"attachmentId":_this.attr("ids")}
                            });
                        }

                    }
                });
            });
        };
    });
}(jQuery, window, document));

