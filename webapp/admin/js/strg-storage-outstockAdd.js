/**
 * 本文件的功能是出库单添加页js文件
 *@ author 王步华
 */

(function($, w, d){
    'use strict';
    $(function() {
        var uploadFile = $(".upload-file"),
            selected = false,
            cust="";
        //添加40个td
        window.getTd($(".form-table"));

        $(".outOrderContacts").val($.cookie("userRealName"));//出库人

        var myDate = new Date();
        var year=myDate.getFullYear();
        var month=myDate.getMonth()+1;
        var date=myDate.getDate();
        $(".outOrderTime").val(year+"-"+month+"-"+date);

        $("#parentDiv").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            datatype:{

            },
            beforeSubmit:function(curform){
                /*
                 * 提交跟踪反馈信息
                 */
                var judge =  $(".outOrderType").attr("judge"),
                    storageIds = $(".storageId").val(),
                    outOrderTypes= $(".outOrderType").val(),
                    tips = $(".sourceId").val();
                if(judge == "01"){
                    if(tips == ""){
                        $(".sourceId-tip").find(".msg-tip").html('<span class="Validform_checktip Validform_wrong"> </span>');
                        layer.confirm('未选择关联工单', {
                            btn: ['确定'],
                            shade: 0.1
                        });
                    }else {
                        $(".sourceId-tip").find(".msg-tip").html('');
                    }
                }
                if(storageIds == ""){
                    $(".storageId-tip").html("<span class='Validform_checktip Validform_wrong'></span>");
                    $(".storageId").addClass("Validform_error");
                }else{
                    $(".storageId-tip").html("<span class='Validform_checktip Validform_right'></span>");
                    $(".storageId").removeClass("Validform_error");
                }

                if(outOrderTypes == ""){
                    $(".outOrderType-tip").html("<span class='Validform_checktip Validform_wrong'></span>");
                    $(".outOrderType").addClass("Validform_error");
                }else{
                    $(".outOrderType-tip").html("<span class='Validform_checktip Validform_right'></span>");
                    $(".outOrderType").removeClass("Validform_error");
                }


                if($(".Validform_wrong").length>0)
                {
                    return;
                }
                else
                {
                    var sendData = {},
                        strId = "",
                        arrP = $(".file-list p");
                    $.each(arrP, function (i, v)
                    {
                        strId += "," + $(v).attr("attachId");
                    });
                    strId = strId.substr(1);


                    var sourId = "",
                        spurce = $(".sourceId-tip .sourceId");
                    $.each(spurce, function (i, v)
                    {
                        sourId += "," + $(v).attr("bid");
                    });
                    sourId = sourId.substr(1);
                    var sourIds =((sourId == "undefined" || null || "") ? "" : sourId);

                    var storageId = $('.storageId option:selected').val();
                    var loading = "";
                    sendData = getFormInfo(curform);
                    sendData.sourceId = sourIds;                           //关联出库工单
                    sendData.storageId = storageId;                     //库房id
                    loading = layer.msg('请稍后', {
                        time: 0,
                        icon: 16,
                        shade: 0.1
                    });

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "operation/outboundorder/create",
                        data: sendData,
                        dataType: "json",
                        success: function(msg)
                        {
                            if (msg && msg.success === 0)
                            {
                                layer.close(loading);
                                layer.confirm('提交成功', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    },
                                    function()
                                    {
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    },
                                    function()
                                    {
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    });
                            }
                        }
                    });
                }

            },
            callback:function(form){
                return false;
            }
        });
        $(".table-box").find(".outOrderType").blur(function(){
            var thisSize = $(this ).val();
            if(thisSize == "CKLX-GD"){
                $(".table-box").find(".typeXin").html("<span class='c-red '>*</span>出库类型：");
                $(this).attr("judge","01");
            }else if(thisSize == "CKLX-QT"){
                $(".table-box").find(".typeXin").html("<span class='c-red '></span>出库类型：");
                $(this).attr("judge","02");
            }else {

            }
            if(thisSize == ""){
                $(".outOrderType-tip").html("<span class='Validform_checktip Validform_wrong'></span>");
                $(".outOrderType").addClass("Validform_error");
            }else{
                $(".outOrderType-tip").html("<span class='Validform_checktip Validform_right'></span>");
                $(".outOrderType").removeClass("Validform_error");
            }
        });
        $(".table-box").find(".storageId").blur(function(){
            var storageIds = $(this ).val();
            if(storageIds == ""){
                $(".storageId-tip").html("<span class='Validform_checktip Validform_wrong'></span>");
                $(".storageId").addClass("Validform_error");
            }else{
                $(".storageId-tip").html("<span class='Validform_checktip Validform_right'></span>");
                $(".storageId").removeClass("Validform_error");
            }
        });

        /*
         *所属库房
         */
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "operation/storage/findPageWithAuth",
            data: {},
            dataType: "json",
            success: function (msg) {
                if(msg && msg.success === 0) {
                    var nameMsg = msg.data.result,
                        msgHtml="";
                    for(var i=0; i<nameMsg.length; i++){
                        msgHtml += '<option value="'+nameMsg[i].id+'">'+nameMsg[i].storageName+'</option>'
                    }
                    $(".storageId").append(msgHtml);
                }
            }
        });

        /*
         *出库类型
         */
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/dictionary/findDictionary",
            data: {dictCode:"CKLX"},
            dataType: "json",
            success: function (msg) {
                if(msg && msg.success === 0) {
                    var nameMsg = msg.data,
                        msgHtml="";
                    var projectType = $('[con_name="outOrderType"]');
                    $.each(nameMsg, function (i, v)
                    {
                        var option = $('<option value="'+ v.dictCodeValue +'"></option>');
                        option.text(v.dictCodeName || "");
                        projectType.append(option);
                    });
                    var setSource = function ()
                    {
                        var ASource = [{
                            "type":""
                        },{
                            "type": "CKLX-GD",
                            "url": "strg-storage-outstock-WorkOrder.html",
                            "title": "出库工单"
                        },{
                            "type": "CKLX-QT"
                        }];
                        for (var i = 0, l = ASource.length; i < l; i++)
                        {
                            if ($('[con_name="outOrderType"]').val() === ASource[i].type && ASource[i].url)
                            {
                                $('[con_name="sourceId"]').attr({"url": ASource[i].url, "souTitle": ASource[i].title}).removeAttr("disabled").val("").focus().blur();
                                $('[con_name="outOrderType"]').attr("judge","01");
                                break;
                            }
                            else if ($('[con_name="outOrderType"]').val() === ASource[i].type)
                            {
                                $('[con_name="sourceId"]').removeAttr("url").removeAttr("contractId").removeAttr("bid").val("不必填写").focus().blur().attr({"disabled": true});
                                $('[con_name="outOrderType"]').attr("judge","02");
                            }else{
                                $('[con_name="sourceId"]').val("").removeAttr("url").removeAttr("contractId").removeAttr("bid").attr({"disabled": false});
                                $('[con_name="outOrderType"]').removeAttr("judge");
                            }
                        }
                    };
                    setSource();
                    projectType.on("change", setSource);
                }
            }
        });
        //点击选择入库来源
        $('[con_name="sourceId"]').on("click", function()
        {
            var url = $(this).attr("url"),
                title = $(this).attr("souTitle");
            if (url)
            {
                window.layerShow(title,url);
            }
        });

        window.getOutWorkOrder = function(data){
            if(data !=""){
                $(".sourceId-tip .sourceId").val(data["0"].objName);
                $(".sourceId-tip .sourceId").attr("bid", data["0"].objId);
                $(".sourceId-tip .sourceId").attr("projectId", data["0"].projectId);
                $(".sourceId-tip .sourceId").attr("taskId", data["0"].taskId);
                $(".sourceId-tip").find(".msg-tip").html('');
            }
        }

        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
         * */
        function getFormInfo (box)
        {
            var conNames = box.find('[con_name]'),
                key = "",
                keyVal = "",
                sendData = {},
                checkbox = null;

            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                if (conNames.eq(i).attr("type") === "radio")
                {
                    keyVal = $('input[name="userSex"]:checked ').val();
                }
                else
                {
                    keyVal = conNames.eq(i).val();
                }
                sendData[key] = keyVal;
            }
            return sendData;
        }

    });
}(jQuery, window, document));

