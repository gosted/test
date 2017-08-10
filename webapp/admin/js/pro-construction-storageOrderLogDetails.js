/**
 * 本文件的功能是出库工单详情页业务流程js文件
 * @ author 孙倩
 */


(function($, w, d){
    'use strict';

    $(function() {
        var pageSize = 10000,
            pageNo = 1,
            orderId = parent.window.layerViewData.projectId,
		    taskId = parent.window.layerViewData.taskId,
	        processInstanceId = parent.window.layerViewData.workFlowId;
        $.myAjax(
            {
                type:"POST",
                url:window.ajaxUrl + "project/businesslog/find",
                data:{"pageNo":pageNo,"pageSize":pageSize,"workOrderId":orderId},
                success:function(data)
                {
                    if(data.success == 0)
                    {
                        var list = data.data;
                        $.each(list, function(i,v)
                        {
                            var contain = $("<div></div>");
                            contain.css({"width":"800px","overflow":"hidden"});
                            var timeDate = new Date(v.businesslogOprTime);
                            if(v.businesslogOprTime == null || v.businesslogOprTime == "")
                            {
                                timeDate = "";
                            }
                            else
                            {
                                timeDate = window.formatDateTimesec(timeDate);
                            }
                            var tmpRemark = "";
                            if(tmpRemark==null || tmpRemark=='null')
                            {
                                tmpRemark = "";
                            }
                            var createIp = v.createIp;
                            if(createIp==null)
                            {
                                createIp = "";
                            }
                            if(i%2 == 0)
                            {
                                var str = "<div class='leftchild'><span class='span_noposi'>"+timeDate+"</span><span class='span_posi' style='background: url(../../images/commen/time_blue.png);'></span></div><div class='rightchild' style='border-left: 2px solid #54c2f0;'><div><span class='name_span'>"+v.businesslogOprRole+"</span><span>"+createIp+"</span><span class='content_span'>"+v.businesslogOprContent+"</span></div><div class='pd-15'>"+tmpRemark+"</div></div>"
                            }
                            else
                            {
                                var str = "<div class='leftchild'><span class='span_noposi'>"+timeDate+"</span><span class='span_posi' style='background: url(../../images/commen/time_red.png);'></span></div><div class='rightchild' style=' border-left: 2px solid #ea858c;'><div><span class='name_span'>"+v.businesslogOprRole+"</span><span>"+createIp+"</span><span class='content_span'>"+v.businesslogOprContent+"</span></div><div class='pd-15'></div></div>"
                            }
                            contain.append(str);
                            $(".loglist").append(contain);
                        });
                    }
                }
            })
    });
}(jQuery, window, document));
