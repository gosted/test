/**
 * 本文件是施工方案添加页js文件
 * @author 彭佳明
 */
(function($, w, d){
    'use strict';
    $(function() {
        var areaId = "",id = "",flag = true;
        var tables = $(".table-box>.form-table"),sendData = {};
        window.getTd(tables);
        //动态添加表格
        var workName = parent.window.layerViewData.workName,
            projectName = parent.window.layerViewData.projectName,
            projectId = parent.window.layerViewData.projectId,
            type = sessionStorage.getItem("constrcuctionType"),
            site = parent.window.layerViewData.site;
        $(".contract-box").find(".contractName").val(projectName);
        $(".contract-box").find(".contractCode").val(site||"联通");
        $(".contract-box").find(".work").val(workName);

        //获取参数
        var getVal = function(sendData)
        {
            $(".providerAdd").find("input").each(function(i,o)
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
                "phone": /^((\d{3,4}\-)|)\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/,
                "Post": /^[0-9][0-9]{5}$/
            },
            beforeSubmit:function(curform){
                sendData = getVal({});
                sendData.remark =  $(".textarea").val();
                sendData.type =  type;
                sendData.workOrderId = projectId;
                var arrP = $(".contract-box").find($(".file-list p")),strId = "";
                if (arrP.size() > 0)
                {
                    $.each(arrP, function (i, v)
                    {
                        strId += "," + $(v).attr("attachId");
                    });
                    strId = strId.substr(1);
                }
                if(strId){
                    sendData.attachmentId = strId;
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "/project/construction/create",
                        data: sendData,
                        dataType: "json",
                        success: function(msg)
                        {
                            if (msg && msg.success === 0)
                            {
                                layer.confirm('提交成功', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    },
                                    function(){
                                        window.parent.location.reload();
                                    });
                                $(document).on("click",".layui-layer-close",function(){
                                    window.parent.location.reload();
                                })
                            }
                        }
                    });
                }else{
                    layer.confirm('请上传附件',{
                        btn: ['确定'],
                        shade: 0.1
                    });
                }
            },
            callback:function(form){
                return false;
            }
        });

        function getAttach(box,form,attach){
            var uploadFile = box.find(form);
            uploadFile.on("change",function ()
            {
                var _this = this;
                if($(".file-list").find("p").length == 1){
                    layer.confirm('只可上传一个方案',{
                        btn: ['确定'],
                        shade: 0.1
                    });
                }else{
                    fileUpload({
                        ths: _this,
                        msg: "正在上传请稍后",
                        form: box.find(attach),
                        fileList: $(".file-list"),
                        createUrl: "project/attachment/create",//增加地址
                        infoUrl: "project/attachment/createFileInfo",//返回信息地址
                        delUrl: "project/attachment/deleteFileById",//删除的地址
                        sendData: {}
                    });
                }
            });
        }
        getAttach($(".contract-box"),$(".upload-file"),$("#upload"));



    });
}(jQuery, window, document));
