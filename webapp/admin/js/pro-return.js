/**
 * 本文件是出库工单退回的js文件
 *@author 王步华
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
                    conNames.eq(i).text(keyVal);
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
                            data:{
                                workOrderId:id,
                                pageSize:pageSize
                            },
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
                                        $(".project").text(data.data.projectName);
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
                                        $(".worksite").text(data.data.worksiteName);
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
                                        $(".subProject").text(data.data.subprojectName);
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
                                $(".contract").text(v.contract);
                                $(".contractNumber").text(v.contractNumber);
                                $(".consignee").text(v.consignee);
                                $(".consigneePhone").text(v.consigneePhone);
                                $(".storageName").text(v.storageName);
                                $(".consigneeEmail").text(v.consigneeEmail);
                                $(".consigneeAdd").text(v.consigneeAdd);
                                getFile(v.attachmentId);
                            })

                        }
                    }
                }
            });

        };
        getType();

        /*
         * 请求附件信息
         * */
        function getFile(ids) {
            if(ids == null || ids == undefined || ids == "")
            {

            }
            else
            {
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/attachment/findByIds",
                    data: {ids: ids},
                    success: function (msg) {
                        if (msg && msg.success === 0) {
                            var attachm = msg.data,
                                List="";
                            $.each(attachm, function (i, data) {
                                var plantype = data.attachName,  //文件名称
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

                                List += '<p lastmodified="" attachid="'+data.attachId+'" style="cursor:pointer;">'+
                                    '<img src="'+planimg+'">'+
                                    '<span style="cursor: pointer;">'+data.attachName+'</span>'+
                                    '</p>'
                            });
                            $(".table-box").find(".file-list").append(List);
                        }
                    }
                })
            }

        }

        //退回
        $(".order").find(".return").on("click",function(){
            var sendData = {},
                loading = "",
                strId = "",
                arrP = $(".file-list p"),
                checkList = $(".checkbox").find(".check");
                $.each(arrP, function (i, v)
                {
                    strId += "," + $(v).attr("attachId");
                });
                strId = strId.substr(1);

            checkList.eq(0).prop("checked") == true?sendData.isSendEmail = 1:sendData.isSendEmail = 0;
            checkList.eq(1).prop("checked") == true?sendData.isSendMsg = 1:sendData.isSendMsg = 0;
            sendData.apprOption = $(".appr-option").val();
            sendData.attachmentId = strId;                       //附件
            sendData.taskId = taskId;
            sendData.step = 3;
            sendData.id = id;
            sendData.isApproval = 1;
            sendData.workType = workType;
            loading = layer.msg('请稍后', {
                time: 0,
                icon: 16,
                shade: 0.1
            });
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "operation/outorderdetall/find",
                data: {
                    sourceId:id
                },
                dataType: "json",
                success: function(msg)
                {
                    if (msg && msg.success === 0)
                    {
                        if(msg.data != ""){
                            layer.confirm('该工单已有设备出库，是否确定退回', {
                                btn: ['确定','取消'],
                                shade: 0.1
                            },function(){
                                $.myAjax({
                                    type:"POST",
                                    url:window.ajaxUrl +"project/workOrder/approval",
                                    data:sendData,
                                    datatype:"json",
                                    success:function(data)
                                    {
                                        if(data && data.success === 0)
                                        {
                                            $(".subProject").val(data.data.subprojectName);
                                            layer.close(loading);
                                            layer.confirm('提交成功', {
                                                    btn: ['确定'],
                                                    shade: 0.1
                                                },
                                                function()
                                                {
                                                    parent.parent.window.location.replace(parent.parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                                },
                                                function()
                                                {
                                                    parent.parent.window.location.replace(parent.parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                                });
                                        }

                                    }
                                })
                            },function(){

                            });
                        }else{
                            $.myAjax({
                                type:"POST",
                                url:window.ajaxUrl +"project/workOrder/approval",
                                data:sendData,
                                datatype:"json",
                                success:function(data)
                                {
                                    if(data && data.success === 0)
                                    {
                                        $(".subProject").val(data.data.subprojectName);
                                        layer.close(loading);
                                        layer.confirm('提交成功', {
                                                btn: ['确定'],
                                                shade: 0.1
                                            },
                                            function()
                                            {
                                                parent.parent.window.location.replace(parent.parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                            },
                                            function()
                                            {
                                                parent.parent.window.location.replace(parent.parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                            });
                                    }

                                }
                            })
                        }
                    }
                }
            });

        });

        //附件下载
        $(".file-list").on("click","span",function ()
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

    });
}(jQuery, window, document));