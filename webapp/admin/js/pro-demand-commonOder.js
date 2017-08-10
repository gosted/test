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

        //显示清单条数
        function showTipNum ()
        {
            var _this = $(this),
                indClass = _this.attr('ind');
            setTimeout(function ()
            {
                var editAbleNum = _this.find('.tbody tr.editable').size(),
                    allNum = _this.find('.tbody tr').size(),
                    editDisNum = allNum - editAbleNum;
                if (editDisNum > 0)
                {
                    $('.' + indClass).find('.tip-num').text(editDisNum).show();
                }
                else
                {
                    $('.' + indClass).find('.tip-num').hide();
                }
            },300);

        }
        $('.equipment-cnt').on('DOMNodeInserted',showTipNum).on('DOMNodeRemoved',showTipNum);
        $('.server-cnt').on('DOMNodeInserted',showTipNum).on('DOMNodeRemoved',showTipNum);
        $('.other-cnt').on('DOMNodeInserted',showTipNum).on('DOMNodeRemoved',showTipNum);


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
                    if(key == "createTime")
                    {
                        keyVal = formatDateTimesec(keyVal)
                        conNames.eq(i).text(keyVal);
                    }
                    else
                    {
                        conNames.eq(i).text(keyVal);
                    }
                    /* $('[con_name="remark"]').keyup();*/
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
                            data:{workOrderId:id,pageSize:pageSize},
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

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailPrice"></div>');
                                            tempDiv.text(v.ext1 || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<div class="input-text div-text" inp_name="detailRemark"></div>');
                                            tempDiv.text(v.detailRemark || "");
                                            STr.append($('<td></td>').append(tempDiv));

                                            tempDiv = $('<input type="text" class="input-text inp-text" value="'+
                                                v.equipmentName +'" readonly inp_name="equipmentId">'+
                                                '<ul class="tree"></ul>');
                                            STr.append($('<td class="input-tree"></td>').append(tempDiv));
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
                                        $(".subProject").text(data.data.subprojectName)
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
                                $(".workOderType").text(v.workOderTypeName);
                                $(".assigner").text(v.userRealName);//assigner
                                var attachmentIds= v.attachmentId;
                                getFile(attachmentIds)

                            })

                        }
                    }
                }
            });

        };
        getType();
        $.Huitab("#tab-category .tabBar span","#tab-category .tabCon","current","click",0);

        function getFile(ids) {
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

                            List += '<p lastmodified="" attachid="'+data.attachId+'">'+
                                '<img src="'+planimg+'">'+
                                '<span>'+data.attachName+'</span>'+
                                '</p>'
                        });
                        $(".table-box").find(".file-list").append(List);
                    }
                }
            })
        }
        //提交审批信息
        $(".order").Validform({
            btnSubmit: ".save",
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
                    sendData.apprResult  = 1;
                    sendData.workType = workType;
                    var checkList = $(".checkbox").find(".check");
                    checkList.eq(0).prop("checked") == true?sendData.isSendEmail = 1:sendData.isSendEmail = 0;
                    checkList.eq(1).prop("checked") == true?sendData.isSendMsg = 1:sendData.isSendMsg = 0;
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/workOrder/approval",
                        data: sendData,
                        dataType: "json",
                        success:function(data)
                        {
                            layer.confirm('操作成功', {
                                    btn: ['关闭'],
                                    shade: 0.1

                                },
                                function()
                                {
                                    var index = parent.parent.layer.getFrameIndex(parent.window.name);
                                    parent.parent.window.location.replace(parent.parent.window.location.href);
                                    parent.parent.layer.close(index);

                                },
                                function()
                                {
                                    var index = parent.parent.layer.getFrameIndex(parent.window.name);
                                    parent.parent.window.location.replace(parent.parent.window.location.href);
                                    parent.parent.layer.close(index);
                                }
                            )
                            $('.layui-anim').removeClass("layui-anim");

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
        $(".return").on('click',function(){
            if($(".appr-option").val().length == 2 && $(".appr-option").val() == "同意"){
                layer.msg("退回时意见不可为‘同意’");
                return false;
            }
            var returnDate = {};
            returnDate.apprOption = $(".appr-option").val();
            returnDate.apprResult = $("input[type='radio']:checked").val();
            returnDate.taskId = taskId;
            returnDate.step = 2;
            returnDate.id = id;
            returnDate.workType = workType;
            returnDate.isApproval = 1;
            returnDate.apprResult  = 2;
            var checkList = $(".checkbox").find(".check");
            checkList.eq(0).prop("checked") == true?returnDate.isSendEmail = 1:returnDate.isSendEmail = 0;
            checkList.eq(1).prop("checked") == true?returnDate.isSendMsg = 1:returnDate.isSendMsg = 0;

            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/workOrder/approval",
                data: returnDate,
                dataType: "json",
                success:function(data)
                {
                    layer.confirm('操作成功', {
                            btn: ['关闭'],
                            shade: 0.1

                        },
                        function()
                        {
                            var index = parent.parent.layer.getFrameIndex(parent.window.name);
                            parent.parent.window.location.replace(parent.parent.window.location.href);
                            parent.parent.layer.close(index);

                        },
                        function()
                        {
                            var index = parent.parent.layer.getFrameIndex(parent.window.name);
                            parent.parent.window.location.replace(parent.parent.window.location.href);
                            parent.parent.layer.close(index);
                        }
                    )
                    $('.layui-anim').removeClass("layui-anim");

                },
                error: function(err)
                {
                    layer.msg('操作失败', {icon:5,time:1000});
                }
            });
        })

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