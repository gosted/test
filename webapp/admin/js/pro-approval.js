/**
 * 本文件是收货确认js文件
 * @author 彭佳明
 */
$(function() {
    var sendData = {};
    var tables = $(".table-box>.form-table");
    var workName = parent.window.layerViewData.workName;
    var id = parent.window.layerViewData.projectId,
        workType = parent.window.layerViewData.workType,
        taskId = parent.window.layerViewData.taskId,
        workFlowId = parent.window.layerViewData.workFlowId;
    window.getTd(tables);
    //动态添加表格
    //获取参数
    $(".workName").val(workName);
    var getVal = function(sendData)
    {
        $(".approvalAdd").find("input").each(function(i,o)
        {
            if($(this).attr("con_name")){
                sendData[$(this).attr("con_name")] = $(this).val();
            }
        });
        return sendData;
    };
    $.myAjax({
        type: "GET",
        url: window.ajaxUrl +"project/workOrder/findWorkOrder/"+id, //传入工单id
        data: {},
        dataType: "json",
        success: function(data)
        {
            if (data && data.success === 0)
            {
                var dat = new Date();
                var timer = dat.getTime();
                var date = new Date(timer);
                $(".contractSignTime").val(window.formatDate(date));
                //请求extensionInfos中的json数据
                if(data.data.extensionInfos)
                {

                    list = data.data.extensionInfos;
                    listStr = JSON.parse(list);
                    $.each(listStr,function(i,v){

                        $(".receiptConfContact").val(v.consignee);
                        $(".receiptConfAddr").val(v.consigneeAdd);
                    })

                }
            }
        }
    });
    var getVal = function(sendData)
    {
        $(".contract-box").find("input").each(function(i,o)
        {
            if($(this).attr("con_name")){
                sendData[$(this).attr("con_name")] = $(this).val();
            }
        });
        return sendData;
    };
    //提交数据
    $(".table-box").Validform({
        btnSubmit: ".save",
        tiptype:2,
        datatype: {
            "phone": /^0\d{2,3}-?\d{7,8}$/,
            "Post": /^[0-9][0-9]{5}$/
        },
        beforeSubmit:function(curform){
            sendData = getVal({});
            sendData.taskId = taskId;
            sendData.workType = 1;
            sendData.step = 4;
            sendData.id = id;
            sendData.workFlowId = workFlowId;
           /* if($(".isSendEmail").is(':checked')){
                sendData.isSendEmail = 1;
            }else{
                sendData.isSendEmail = 0;
            }
            if($(".isSendMsg").is(':checked')){
                sendData.isSendMsg = 1;
            }else{
                sendData.isSendMsg = 0;
            }*/
            var arrP = $(".contract-box").find($(".file-list p")),strId = "";
            if (arrP.size() > 0)
            {
                $.each(arrP, function (i, v)
                {
                    strId += "," + $(v).attr("attachId");
                });
                strId = strId.substr(1);
            }
            sendData.attachmentId = strId;
            sendData.receiptConfRemark = $(".textarea").val();
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/workOrder/approval",
                data: sendData,
                dataType: "json",
                success: function(msg)
                {
                    if (msg && msg.success === 0)
                    {
                        layer.confirm('收货成功', {
                                btn: ['确定'],
                                shade: 0.1
                            },
                            function(){
                                parent.parent.window.location.reload();
                            });
                    }
                }
            });
        },
        callback:function(form){
            return false;
        }
    });
    function getAttach(box,form,attach){
        var uploadFile = box.find(form);
        uploadFile.on("change",function ()
        {
            fileUpload({
                ths: this,
                msg: "正在上传请稍后",
                form: box.find(attach),
                fileList: $(".file-list"),
                createUrl: "project/attachment/create",//增加地址
                infoUrl: "project/attachment/createFileInfo",//返回信息地址
                delUrl: "project/attachment/deleteFileById",//删除的地址
                sendData: {}
            });
        });
    }
    getAttach($(".contract-box"),$(".upload-file"),$("#upload"));

});