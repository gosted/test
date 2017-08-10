/*
* 工作记录页面js文件
*@author 王步华
*/
(function($, w, d){
    'use strict';
    $(function() {
        var reqId = parent.window.layerViewData.reqId;
        var customerId = parent.window.layerViewData.customerId;
        var reqSupType = parent.window.layerViewData.reqSupType;
        window.layerViewData = parent.window.layerViewData;
            //获取方案列表
        function scrlist() {
            var html = "",
                obj = "";
            $.myAjax({
                type: "POST",
                url:window.ajaxUrl+"preSupport/record/findPage",
                data: {"reqId": reqId,"customerId":customerId,"pageSize":10000},
                success: function (data) {
                    $.each(data, function (i, o) {
                        if (o instanceof Object) {
                            getDatas(o);
                        }
                    })
                }
            });
            function getDatas(data) {
                var obj = {};
                html = "";
                $.each(data.result, function (i, data) {
                    var startime = window.formatDates(data.recordStartTime);
                    var endtime = window.formatDates(data.recordEndTime);
                    html += "<tr class='text-c odd' role='row' ids ='" + data.id + "' customerId='"+customerId+"' reqSupType='"+reqSupType+"'>" +
                        "<td><input type='checkbox' value='1' class='chebox' name=''></td>" +
                        "<td class='text-l doSptMdlPro-name pl-3'  title='" + data.recordSupSummary + "' ><a href='javascript:;'>" + data.recordSupSummary + "</a></td>" +
                        "<td class='text-l pl-3'  title='" + data.recordWorkload + "'>" + data.recordWorkload + "</td>" +
                        "<td class='rowstyle'  title='" + startime + "'>" +startime + "</td>" +
                        "<td class='rowstyle'  title='" + endtime + "'>" + endtime + "</td>" +
                        "<td class='rowstyle'  title='" + data.recordEndTimeStr + "'>" +
                            "<a style='text-decoration:none' class='mr-5 supEdit'' href='javascript:;'title='编辑' _href='support-WorkRecord-Edit.html'>"+
                            "<i class='Hui-iconfont'>&#xe70c;</i></a>"+

                            "<a style='text-decoration:none' class='mr-5 deletebook' href='javascript:;' title='删除'>"+
                            "<i class='Hui-iconfont'>&#xe6e2;</i></a>"+
                        "</td>" +
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



                /*
                 * 按钮区按钮点击事件
                 * */
                $(".dosptMdlPro_main_content_list").on("click", ".supEdit", function ()
                {
                    var href = $(this).attr("_href"),
                        title = $(this).attr("title"),
                        data = {},
                        reqId = "",
                        id = "",
                        reqsuptype = "",
                        customerId = "",
                        attachmentId = "";
                    reqId = parent.window.layerViewData.reqId;
                    attachmentId = $(this).parents("tr").attr("ids");
                    reqsuptype = $(this).parents("tr").attr("reqSupType");
                    customerId =  $(this).parents("tr").attr("customerId");
                    data.reqId = reqId;
                    data.attachmentId = attachmentId;
                    data.reqSupType = reqsuptype;
                    data.customerId = customerId;
                    window.parent.window.layerViewData = data;
                    window.parent.layerShow(title,href);
                });

                //删除方案
                function deleteook(){
                    $(".deletebook").on("click",function(){
                        var ids =$(this).parents("tr").attr("ids"),
                            inde = "";
                        inde = layer.confirm('确定要删除吗？', {
                                btn: ['确定','取消'],
                                shade: 0.1
                            },
                            function() {
                                layer.close(inde);
                                $.myAjax({
                                    type: "POST",
                                    url: window.ajaxUrl + "preSupport/record/deleteByIds",
                                    data: {
                                        "ids": ids,
                                        "reqId":reqId
                                    },
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
                                layer.msg('已取消', {icon:6,time:1000});
                            });
                    });
                };
                deleteook();


                /*
                 * 点需求单名进入查看详情页
                 * */
                $(".dosptMdlPro_main_content_list").on("click", ".doSptMdlPro-name", function ()
                {
                    var href = "support-check-work.html",
                        title = "信息详情",
                        data = {},
                        id = "";
                    id = $(this).parents("tr").attr("ids");
                    data.id = id;
                    window.layerViewData = parent.window.layerViewData;
                    window.layerViewData.workRecordId = id;
                    window.parent.layerShow(title,href);

                });
            }
        };
        scrlist();

    });
}(jQuery, window, document));
