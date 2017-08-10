/**
 * Created by baozhe  on 2017/03/27.
 * 本文件是出库工单回显的js文件
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){
        var pageSize = 1000,
            //selected = false,
            subprojectId = "",
            id = parent.window.layerViewData.projectId,
            taskId = parent.window.layerViewData.taskId,
            workType = parent.window.layerViewData.workType;
        window.getTd($(".form-table"));

        /*
         * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
         * */
        function setFormInfo (box,data)
        {
            var conNames = box.find('[con_name]'),
                _data = data.data,
                key = "",
                keyVal = "",
                _radio = null,
                chkArr = [],
                date = "";
            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                keyVal = _data[key];
                if (keyVal)
                {
                    conNames.eq(i).val(keyVal);
                    $('[con_name="remark"]').keyup();
                }
            }
        }

        //请求类型
        function getType()
        {
            $.myAjax({
                // data: {id:id},//传入工单id
                type: "GET",
                url: window.ajaxUrl +"project/workOrder/findWorkOrder/"+id,
                data: {},//传入工单id
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        var box = $("#roleAdd"),
                            list = null,
                            deviceList = null,
                            STr = null,
                            tbody = $(".tbody1"),
                            deviceListStr = null,
                            listStr = null;
                        setFormInfo(box,data);//基本信息

                        //是否发送邮件
                        if(data.data.isSendEmail && data.data.isSendEmail === 1){
                            $(".isSendEmail").attr("checked","checked");//
                        }
                        else{
                        }
                        //是否发送消息
                        if(data.data.isSendMsg && data.data.isSendMsg === 1){
                            $(".isSendMsg").attr("checked","checked");//禁用
                        }
                        else{

                        }
                        //请求清单信息
                        $.myAjax({
                            type:"POST",
                            url: window.ajaxUrl +"project/proDeviceList/findByWorkOrderId",
                            data:{workOrderId:id},
                            datatype:"json",
                            success:function(data)
                            {
                                if(data.data && data.success === 0)
                                {

                                    deviceList = data.data.result;

                                    $.each(deviceList,function(i,v)
                                    {
                                        STr = $('<tr class="text-c" id="'+ v.id+'"></tr>');//一行
                                        STr.append('<td class="authName" title='+ v.detailName+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange" value="'+v.detailName+'"></td>');
                                        STr.append('<td class="authName" title='+ v.detailModel+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange" value="'+v.detailModel+'"></td>');
                                        STr.append('<td class="authName" title='+ v.detailCompany+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange" value="'+v.detailCompany+'"></td>');
                                        STr.append('<td class="authName" title='+ v.detailUnit+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange" value="'+v.detailUnit+'"></td>');
                                        STr.append('<td class="authName" title='+ v.detailCount+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange" value="'+v.detailCount+'"></td>');

                                        tbody.append(STr);
                                    })
                                }

                            }
                        })



                        //请求项目信息
                        if( data.data.project ){
                            $.myAjax({
                                type:"POST",
                                url: window.ajaxUrl +"project/project/findById",
                                data:{id:data.data.project},
                                datatype:"json",
                                success:function(data)
                                {
                                    if(data.data && data.success === 0)
                                    {
                                        $(".project").val(data.data.projectName)
                                    }

                                }
                            })
                        }
                        //请求工地信息
                        if( data.data.site ){
                            $.myAjax({
                                type:"POST",
                                url:window.ajaxUrl +"project/workSite/findByProjectId",
                                data:{id:data.data.site},
                                datatype:"json",
                                success:function(data)
                                {
                                    if(data.data && data.success === 0)
                                    {
                                        $(".worksite").val(data.data.worksiteName)
                                    }

                                }
                            })
                        }

                        //请求子项目

                        if( data.data.subProjectId ){
                            $.myAjax({
                                type:"POST",
                                url:window.ajaxUrl +"project/subProject/findByProjectId",
                                data:{id:data.data.subProjectId},
                                datatype:"json",
                                success:function(data)
                                {
                                    if(data.data && data.success === 0)
                                    {
                                        $(".subProject").val(data.data.subprojectName)
                                    }

                                }
                            })
                        }

                        //请求extensionInfos中的json数据
                        if(data.data.extensionInfos)
                        {
                            list = data.data.extensionInfos;
                            listStr = JSON.parse(list);
                            $.each(listStr,function(i,v){
                                $(".contract").val(v.contract);
                                $(".contractNumber").val(v.contractNumber);
                                $(".consignee").val(v.consignee);
                                $(".consigneePhone").val(v.consigneePhone);
                                $(".storageName").val(v.storageName);
                            })

                        }
                    }
                }
            });

        };
        getType();

        //提交审批信息
        $(".order").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            beforeSubmit:function(curform){

                /*
                 * 提交新建角色信息
                 */
                if($(".Validform_wrong").length>0)
                {
                    return;
                }
                else
                {
                    var sendData = {};
                    sendData.apprOption = $(".appr-option").val();
                    sendData.apprResult = $("input[type='radio']:checked").val();
                    sendData.taskId = taskId;
                    sendData.step = 2;
                    sendData.id = id;
                    sendData.workType = workType;
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/workOrder/approval",
                        data: sendData,
                        dataType: "json",
                        success: function(data)
                        {
                            if (data && data.success === 0)
                            {
                                layer.confirm('提交成功', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    },
                                    function(){
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗

                                    })
                            }
                            else
                            {
                                layer.msg('操作失败', {icon:5,time:1000});
                            }
                        },
                        error: function(err)
                        {
                            layer.msg('操作失败', {icon:5,time:1000});
                        }
                    });
                }

            },
            callback:function(form){
                return false;
            }
        });

    });
}(jQuery, window, document));