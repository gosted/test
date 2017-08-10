/**
 * 本文件是待办工单js文件
 * @ author 彭佳明
 */

(function($, w, d){
    'use strict';

    $(function() {
        var　sendData　= {};
        var tables = $(".table-box>.form-table");
        window.getTd(tables);
        var workName = parent.window.layerViewData.workName,
            projectName = parent.window.layerViewData.projectName,
            projectId = parent.window.layerViewData.projectId,
            site = parent.window.layerViewData.site,
            taskId = parent.window.layerViewData.taskId,
            workFlowId = parent.window.layerViewData.workFlowId;
        window.layerViewData = parent.window.layerViewData;

        $(".contract-box").Validform({
            btnSubmit: ".btn-save",
            tiptype:2,
            datatype: {
                "date": /^\d{4}\-\d{2}\-\d{2}$/,
                "phone": /^((\d{3,4}\-)|)\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/,
                "Post": /^[0-9][0-9]{5}$/,
                "Number":/^\d{1,13}((\.\d{1,2})?)$/
            },
            beforeSubmit:function(curform){
                var Data = {};
                Data.id =  projectId;
                Data.taskId = taskId;
                Data.step = 4;
                Data.isApproval = 1;
                Data.apprOption =  $(".appr-option").val()||"";
                Data.apprTime = $(".over-date").val()||"";
                Data.workType = 2;
                Data.workFlowId = workFlowId;
                Data.apprResult = 2;
                if($(".isSendEmail").is(':checked')){
                    Data.isSendEmail = 1;
                }else{
                    Data.isSendEmail = 0;
                }
                if($(".isSendMsg").is(':checked')){
                    Data.isSendMsg = 1;
                }else{
                    Data.isSendMsg = 0;
                }
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/workOrder/approval",
                    data: Data,
                    success: function (data)
                    {
                        if (data && data.success === 0)
                        {
                            layer.confirm('提交成功', {
                                    btn: ['确定'],
                                    shade: 0.1
                                },
                                function(){
                                    parent.parent.window.location.replace(parent.parent.parent.window.location.href);  //刷新父级页面，同时关闭弹窗

                                });
                            $(document).on("click",".layui-layer-close",function(){
                                parent.parent.window.location.replace(parent.parent.parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                            })
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
