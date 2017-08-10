/**
 * Created by baozhe  on 2017/03/27.
 * 本文件是施工工单回显的js文件
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){
        var pageSize = 1000,
            subprojectId = "",
            id = parent.window.layerViewData.projectId,
            workType = parent.window.layerViewData.workType;
        var workName = parent.window.layerViewData.workName,
            projectName = parent.window.layerViewData.projectName,
            projectId = parent.window.layerViewData.projectId,
            site = parent.window.layerViewData.site,
            taskId = parent.window.layerViewData.taskId,
            workFlowId = parent.window.layerViewData.workFlowId;
        window.layerViewData = parent.window.layerViewData;
        window.getTd($(".form-table"));

        //获取审批信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "/project/workOrder/findApproval",
            data: {workOrderId:id},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    $(".textarea").val(data.data.apprOption);
                    $(".approver").text(data.data.apprApprover);
                    var date = new Date(data.data.createTime);
                    $(".approval-time").text(window.formatDateTimesec(date));
                    $(".approval-opinion").text(data.data.apprOption);
                    if(data.data.apprResult== 2){
                        $(".approval-result").text("不同意");
                    }else{
                        $(".approval-result").text("同意");
                    }
                }
            }
        });

        $(".btn-back").on("click",function(){
            window.layerShow("退回","pro-construction-overBack.html");

        });

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
        }
        function setData (data,beforeBox)
        {
            var list = [],
                fileList = null,
                STr = null;

            fileList = $(".file-list");
            list = data.data;
            fileList.html("");

            $.each(list, function (i, v)
            {
                var img = $("<img />"),
                    button = $("<a class='btn btn-success radius ml-10'><i class='Hui-iconfont'>&#xe6e2</i>删除</a>"),
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
                        "png"
                    ],
                    nameArr = [],
                    str = "",
                    type = "unknown",
                    p = $('<p></p>');

                if (v.attachName)
                {
                    nameArr = v.attachName.split(".");
                    str = nameArr[nameArr.length -1];
                }
                else
                {
                    return false;
                }
                p.attr("attachId",v.attachId);
                str = str.substr(0,3);
                $.each(arrImg, function (i, v)
                {
                    if (str.toLowerCase() === v)
                    {
                        type = v;
                    }
                    else if ((str.toLowerCase() === "avi") || (str.toLowerCase() === "wmv"))
                    {
                        type = "mp4";
                    }
                    else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpg"))
                    {
                        type = "png";
                    }
                    else
                    {

                    }
                });
                img.attr("src","../../images/commen/"+ type +".png");
                p.append(img);
                p.append('<span title="点击下载文件" style="cursor: pointer">'+ v.attachName +'</span>');
                //p.append(button);
                button.on("click", function ()
                {
                    var _this = $(this),
                        id = $(this).parent().attr("attachId");
                    $.myAjax({
                        type:"POST",
                        url:ajaxUrl + "project/attachment/deleteFileById",
                        data:{"id":id},

                        success:function(data)
                        {
                            if(data.success === 0)
                            {
                                _this.parent().remove();
                            }
                        },
                        error:function(msg)
                        {
                            layer.confirm('删除失败', {
                                btn: ['确定','取消'],
                                shade: 0.1
                            });
                        }
                    });
                });
                fileList.append(p);
            });

            fileList.on("click", "p>span", function ()
            {
                var _this = $(this).parent(),
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
                    "data": {"attachId": _this.attr("attachId")}
                });
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "general/attachmentPro/checkIsLogin",
                    data: {},
                    dataType: "json",
                    success: function(data)
                    {
                        if (data && data.success === 0)
                        {

                        }
                    }
                });
            });
        }
        //请求数据
        function getType()
        {
            $.myAjax({
                type: "GET",
                url: window.ajaxUrl +"project/workOrder/findWorkOrder/"+id, //传入工单id
                data: {},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        var box = $("#roleAdd"),
                            list = null,
                            deviceList = null,
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
                        $(".workOrderName").text(data.data.workOrderName);
                        $(".workOrderNum").text(data.data.workOrderNum);
                        $(".remark").text(data.data.remark);
                        //请求清单信息
                        $.myAjax({
                            type:"POST",
                            url: window.ajaxUrl +"project/proDeviceList/findByWorkOrderId",
                            data:{workOrderId:id,pageSize:1000},
                            datatype:"json",
                            success:function(data)
                            {
                                if(data.data && data.success === 0)
                                {
                                    var equTbody = $(".equipment-cnt tbody"),
                                        serbody = $(".server-cnt tbody"),
                                        othTbody = $(".other-cnt tbody"),
                                        STr = null;
                                    deviceList = data.data.result;

                                    $.each(deviceList,function(i,v)
                                    {
                                        var id = v.id,
                                            tempDiv = null,
                                            tmpBtn = "";
                                        subprojectId = v.subprojectId || "";
                                        if (v.detailType === "QDLX-SB")
                                        {
                                            STr = $('<tr class="text-c" delid="'+ id +'" detailType="'+ v.detailType +'"></tr>');//一行

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailName"></div>');
                                            tempDiv.text(v.detailName || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailModel"></div>');
                                            tempDiv.text(v.detailModel || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailCompany"></div>');
                                            tempDiv.text(v.detailCompany || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailCount"></div>');
                                            tempDiv.text(v.detailCount || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailUnit"></div>');
                                            tempDiv.text(v.detailUnit || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<input type="text" class="input-text inp-text" value="'+
                                                v.equipmentName +'" readonly inp_name="equipmentId">'+
                                                '<ul class="tree"></ul>');
                                            STr.append($('<td class="input-tree"></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailRemark"></div>');
                                            tempDiv.text(v.detailRemark || "");
                                            STr.append($('<td></td>').append(tempDiv));


                                            equTbody.append(STr);
                                        }
                                        else if (v.detailType === "QDLX-FW")
                                        {
                                            STr = $('<tr class="text-c" delid="'+ id +'" detailType="'+ v.detailType +'"></tr>');//一行

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailName"></div>');
                                            tempDiv.text(v.detailName || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailStartDate"></div>');
                                            tempDiv.text(window.formatDates(v.detailStartDate) || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailEndDate"></div>');
                                            tempDiv.text(window.formatDates(v.detailEndDate) || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailCount"></div>');
                                            tempDiv.text(v.detailCount || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailUnit"></div>');
                                            tempDiv.text(v.detailUnit || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailRemark"></div>');
                                            tempDiv.text(v.detailRemark || "");
                                            STr.append($('<td></td>').append(tempDiv));
                                            serbody.append(STr);
                                        }
                                        else
                                        {
                                            STr = $('<tr class="text-c" delid="'+ id +'" detailType="'+ v.detailType +'"></tr>');//一行

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailName"></div>');
                                            tempDiv.text(v.detailName || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailRemark"></div>');
                                            tempDiv.text(v.detailRemark || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailCount"></div>');
                                            tempDiv.text(v.detailCount || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailUnit"></div>');
                                            tempDiv.text(v.detailUnit || "");
                                            STr.append($('<td></td>').append(tempDiv));
                                            othTbody.append(STr);
                                        }
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
                                        $(".project").text(data.data.projectName)
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
                                        $(".worksite").text(data.data.worksiteName)
                                    }

                                }
                            })
                        }

                        //请求子项目

                        if( data.data.subProject ){
                            $.myAjax({
                                type:"POST",
                                url:window.ajaxUrl +"project/subProject/findByProjectId",
                                data:{id:data.data.subProject},
                                datatype:"json",
                                success:function(data)
                                {
                                    if(data.data && data.success === 0)
                                    {
                                        $(".subProject").text(data.data.subprojectName)
                                    }

                                }
                            })
                        }

                        //请求extensionInfos中的json数据
                        if(data.data.extensionInfos)
                        {
                            var ids = "";
                            list = data.data.extensionInfos;
                            listStr = JSON.parse(list);
                            $.each(listStr,function(i,v){
                                /* console.log( $(".contract"));
                                 console.log(v.contract);*/
                                $(".contract").text(v.contract);
                                $(".contractNumber").text(v.contractNumber);
                                $(".consignee").text(v.consignee);
                                $(".consigneePhone").text(v.consigneePhone);
                                $(".constructor").text(v.partnerId);
                                ids = v.attachmentId||"";
                            });
                            if (ids)
                            {
                                $.myAjax({
                                    type: "POST",
                                    url: window.ajaxUrl + "project/attachment/findByIds",
                                    data: {"ids": ids},
                                    success: function (data)
                                    {
                                        if (data && data.success === 0)
                                        {
                                            var needInfo = $(".contract-box");

                                            setData(data,needInfo);
                                        }
                                    }
                                });
                            }

                        }
                    }
                }
            });

        };
        getType();
        //tab切换
        $.Huitab("#tab-category .tabBar span","#tab-category .tabCon","current","click",0);

    });
}(jQuery, window, document));