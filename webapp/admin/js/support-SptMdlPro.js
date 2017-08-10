/*
* 制作方案页面js文件
*@author 王步华
*/
(function($, w, d){
    'use strict';
    $(function() {
        var reqId = parent.window.layerViewData.reqId;
        window.layerViewData = parent.window.layerViewData;
        //获取方案列表
        function scrlist() {
            var html = "",
                obj = "";
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "preSupport/plan/findPage",
                data: {"pageSize": 200, "reqId": reqId},
                success: function (data) {
                    if(data.success=="0") {
                        $.each(data, function (i, o) {
                            if (o instanceof Object) {
                                getDatas(o);
                            }
                        })
                    }
                }
            });
            function getDatas(data) {
                var obj = {};
                html = "";
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "preSupport/plan/findDictionary",
                        data: {"dictCode": "CP"},
                        success: function (msg) {

                        }
                    });

                $.each(data, function (i, data) {
                    var createTimeStr = data.createTimeStr;
                    var createTimeStrlength = createTimeStr.split(' ');   //上传时间
                    var plantype = data.attachmentName,  //文件名称
                        index = plantype .lastIndexOf(".");
                    plantype  = plantype .substring(index + 1, plantype .length);
                    var planimg;
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

                    html += "<tr class='text-c odd' role='row'  ids ='" + data.attachmentId + "' pid='"+data.id+"' reqId='"+reqId+"'>" +
                        "<td><input type='checkbox' value='1' class='chebox' name=''></td>" +
                        "<td class='text-l doSptMdlPro-name pl-3'  title='" + data.planName + "'><a href='javascript:;'><img class='doSptMdlPro-name-img' src='" + planimg + "' />" + data.planName + "</a>"+"</td>" +
                        "<td class='text-l pl-3'  title='" + data.planSite + "'>" + data.planSite + "</td>" +
                        "<td class='rowstyle'  title='" + data.createTimeStr + "'>" + data.createTimeStr+ "</td>" +
                        "<td class='rowstyle'  title='" + data.createUserRealName + "'>" + data.createUserRealName + "</td>" +
                        "<td class='btns'>"+
                            "<a style='text-decoration:none' class='mr-5 supEdit'' href='javascript:;' title='编辑' _href='support-sptModelEdit.html'>"+
                            "<i class='Hui-iconfont'>&#xe70c;</i></a>"+

                            "<a style='text-decoration:none' class='mr-5 download' href='javascript:;' title='下载'>"+
                            "<i class='Hui-iconfont'>&#xe641;</i></a>"+

                            "<a style='text-decoration:none' class='mr-5 deletebook' href='javascript:;' title='删除'>"+
                            "<i class='Hui-iconfont'>&#xe6e2;</i></a>"+

                        "</td>"+
                        "</tr>"
                });
                $(".dosptMdlPro_main_content_list").append(html);
                
                /*
                 * tr颜色间隔问题
                 * */
                var trs=$(".con-tbody-tr").find("tr");
                for(var i=0; i<trs.length;i++){
                    if(i%2 == 0){
                        trs.eq(i).css("background","#fff");
                    }else{
                        trs.eq(i).css("background","#eee");
                    }
                }

                //点击方案列表下载
                $(".dosptMdlPro_main_content_list").find(".doSptMdlPro-name").on("click", function () {
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
                                    "data": {"attachmentId": _this.parents("tr").attr("ids")}
                                });
                            }
                        }
                    });
                });

                /*
                 * 按钮区按钮点击事件
                 * */
                //编辑
                $(".dosptMdlPro_main_content_list").on("click", ".supEdit", function ()
                {
                    var href = $(this).attr("_href"),
                        title = $(this).attr("title"),
                        data = {},
                        reqId = "",
                        attachmentId = "";

                    reqId = $(this).parents("tr").attr("reqId");
                    attachmentId = $(this).parents("tr").attr("ids");
                    data.reqId = reqId;
                    data.attachmentId = attachmentId;
                    window.parent.window.layerViewData = data;
                    window.parent.layerShow(title,href);
                });

                //删除方案
                    $(".deletebook").on("click",function(){
                        var id = $(this).parents("tr").attr("ids"),
                            inde = "";
                        inde = layer.confirm('确定要删除吗？', {
                                btn: ['确定','取消'],
                                shade: 0.1
                            },
                            function() {
                                layer.close(inde);
                                $.myAjax({
                                    type: "POST",
                                    url: window.ajaxUrl + "preSupport/plan/delete",
                                    data: {"attachmentId": id},
                                    success: function (msg) {
                                        if (msg.success == "0") {
                                            $(".dosptMdlPro_main_content_list").html("");
                                            scrlist();
                                        } 
                                    }
                                });
                            },
                            function()
                            {
                                layer.msg('已取消', {icon:5,time:1000});
                            });
                    });

            //下载方案
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
                                    "data": {"attachmentId":_this.parents("tr").attr("ids")}
                                });
                            }
                        }
                    });
                });

            }
        };
        scrlist();


        /*
         * 列表上侧按钮区按钮点击事件
         * */
        //支撑方案库
        $(".btn-add").on("click", function ()
        {
            var data = {},
                treeId = $(".tree .clr-blue").parents("li").attr("treeId");

            data.treeId = treeId;
            window.layerViewData = data;
            window.layerShow("添加","system-user-add.html");
        });


        /*
         * 按钮区按钮点击事件
         * */
        var btns = $(".btn-area .btn");
        btns.on("click", function ()
        {
            var href = $(this).attr("_href"),
                title = $(this).attr("data-title");
            if(href != "" && href != "undefined" && href != "null"){
            	
            }else{
                window.layerShow(title,href);
            }

        });

    });
}(jQuery, window, document));
