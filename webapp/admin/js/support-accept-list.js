/**
 * 支撑受理页面js脚本文件
 *@author 鲍哲
 */
(function($, w, d){
    'use strict';

    $(function() {
       var reqId = parent.window.layerViewData.reqId,
            taskId = parent.window.layerViewData.taskId;

        //tab切换
        $.Huitab("#tab-category .tabBar span","#tab-category .tabCon","current","click","0");
        var model = $("#accept_model"),
            uploadFile = $(".upload-file");
        window.getTd($(".form-table"));
        //驳回意见显示
        $.myAjax({
            type:"POST",
            url:ajaxUrl + "preSupport/approval/findById",
            data:{"reqId":reqId},

            success:function(data)
            {
                if(data.success == 0)
                {
                    var container = $(".form-table");
                    var tr = "<tr><td class='table-key' colspan='6'>审批结果：</td><td colspan='7'>退回</td>" +
                        "<td class='table-key' colspan='6'>审批时间：</td><td colspan='8'>"+ formatDateTimesec(data.data.apprTime) +"</td>" +
                        "<td class='table-key' colspan='6'>审批人：</td><td colspan='7'>"+ data.data.apprApprover +"</td></tr>";
                    var tr1 = "<tr><td class='table-key' colspan='6'>审批意见：</td><td colspan='34'>"+ data.data.apprOption +"</td></tr>";

                    if(data.data != "")
                    {
                        container.prepend(tr1);
                        container.prepend(tr);
                    }
                    else{

                    }
                }


            },
            error:function(msg)
            {

            }
        });






        window.getRequestHeader = function  ()
        {
            var sIdFlag = $.cookie("encodeToken") && $.cookie("encodeToken") != "null",
                usrIdFlag = $.cookie("userId") && $.cookie("userId") != "null",
                ses = "";

            if (sIdFlag)
            {
                ses += $.cookie("encodeToken");
                if (usrIdFlag)
                {
                    ses += "_" + $.cookie("userId");
                }
            }
            return ses;
        }

       function savaData(event)
        {
                event = event || window.event
            var needInput = model.find("[con_name]"),
                len = needInput.length,
                arrP = null,
                strId = "",
                obj = {};


            var btnState = $(this).val();
            if( btnState == "02" )
            {
                $("#accept_ipt").attr("ignore","ignore");
                for(var i=0;i<len;i++)
                {
                    var con_name = $(needInput[i]).attr("con_name");
                    switch (con_name){
                        case "apprOption":
                            if($(needInput[i]).val() == "")
                            {
                                $(needInput[i]).addClass("Validform_error");
                                $(needInput[i]).parent().parent().find(".msg-tip").find("span").addClass("Validform_wrong");
                                return;
                            }
                            else
                            {
                                $(needInput[i]).removeClass("Validform_error");
                                $(needInput[i]).parent().parent().find(".msg-tip").find("span").removeClass("Validform_wrong");
                            }
                            break;
                    }

                }


            }
            obj.apprResult = event.data.apprResult;
            obj.reqWorkload = model.find("[con_name='reqWorkload']").val();
            obj.reqIsSpot =model.find("[con_name='reqIsSpot']").val();
            obj.reqIsPm = model.find("[con_name='reqIsPm']").val();
            obj.reqIsImportant = model.find("[con_name='reqIsImportant']").val();
            obj.apprOption = model.find("[con_name='apprOption']").val();
            obj.attachmentId =model.find(".file-list").attr("attachId");
            obj.taskId = taskId;
            obj.reqId = reqId;
            arrP = $(".file-list p");
            $.each(arrP, function (i, v)
            {
                strId += "," + $(v).attr("attachId");
            });
            strId = strId.substr(1);
            obj.attachmentId = strId;
            var checkList = model.find("#checkbox .check");

            checkList.eq(1).prop("checked") == true?obj.reqIsSpot = 1:obj.reqIsSpot = 0;
            checkList.eq(2).prop("checked") == true?obj.reqIsPm = 1:obj.reqIsPm = 0;
            checkList.eq(0).prop("checked") == true?obj.reqIsImportant = 1:obj.reqIsImportant = 0;


            $.myAjax({
                type:"POST",
                url:ajaxUrl + "preSupport/workFlow/createApproval",
                data:obj,

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
                error:function(msg)
                {


                }

            });
        }
        var submitBtn = model.find(".btns-group button").eq(0);
        var rejectBtn =  model.find(".btns-group button").eq(1);
        /*submitBtn.on("click",{"apprResult":"01"},savaData);*/
        rejectBtn.on("click",{"apprResult":"02"},savaData);




       //验证提交按钮
        $("#checkForm").Validform({
            btnSubmit: ".lauMng_submitBtn",
            tiptype:2,

            callback:function(form){
                return false;
            },
            beforeCheck:function(obj)
            {
                var btnValue = $(this.btnSubmit).val();
                if(btnValue == "01")
                {
                    var needInput = model.find("[con_name]"),
                        len = needInput.length;
                    $("#accept_ipt").removeAttr("ignore");

                }
            },
            beforeSubmit:function(curform){
                var arrP = null,
                    strId = "",
                    sentData = {},
                    btnValue = $(this.btnSubmit).val();

                sentData.apprResult = btnValue;
                sentData.reqWorkload = model.find("[con_name='reqWorkload']").val();
                sentData.reqIsSpot =model.find("[con_name='reqIsSpot']").val();
                sentData.reqIsPm = model.find("[con_name='reqIsPm']").val();
                sentData.reqIsImportant = model.find("[con_name='reqIsImportant']").val();
                sentData.apprOption = model.find("[con_name='apprOption']").val();
                sentData.attachmentId =model.find(".file-list").attr("attachId");
                sentData.taskId = taskId;
                sentData.reqId = reqId;
                arrP = $(".file-list p");
                $.each(arrP, function (i, v)
                {
                    strId += "," + $(v).attr("attachId");
                });
                strId = strId.substr(1);
                sentData.attachmentId = strId;
                var checkList = model.find("#checkbox .check");

                checkList.eq(1).prop("checked") == true?sentData.reqIsSpot = 1:sentData.reqIsSpot = 0;
                checkList.eq(2).prop("checked") == true?sentData.reqIsPm = 1:sentData.reqIsPm = 0;
                checkList.eq(0).prop("checked") == true?sentData.reqIsImportant = 1:sentData.reqIsImportant = 0;


                $.myAjax({
                    type:"POST",
                    url:ajaxUrl + "preSupport/workFlow/createApproval",
                    data:sentData,

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

                    }
                });
            },
        });

        uploadFile.on("change",function ()
        {
            var _this = this;

            fileUpload({
                ths: _this,
                msg: "正在上传附件",
                form: $("#upload"),
                fileList: $(".file-list"),
                obj: { "attachClassify":"qqzcywjlsl","processType":"qqzcywjlsl"}
            });
        });


    });
}(jQuery, window, document));
