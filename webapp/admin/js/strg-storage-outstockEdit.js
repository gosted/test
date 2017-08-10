/**
 * 本文件的功能是出库单编辑页js文件
 *@ author 王步华
 */

(function($, w, d){
    'use strict';
    $(function() {
        var libId = parent.window.layerViewData.libId,
            outOrderState = parent.window.layerViewData.outOrderState,
            uploadFile = $(".upload-file"),
            selected = false,
            cust="";
        //添加40个td
        window.getTd($(".form-table"));

        $(".outOrderContacts").val($.cookie("userRealName"));//出库人

        /*if(outOrderState == "0" || outOrderState =="1"){
            $(".ProgramSubmitButton").css("display","initial");
        }else{
            $(".ProgramSubmitButton").css("display","none");
        }*/
        /*
        *回显数据
        * */
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "operation/outboundorder/findById",
            data: {
                id:libId
            },
            dataType: "json",
            success: function(msg)
            {
                if (msg && msg.success === 0)
                {
                    var box = $("#parentDiv");
                    var storageId = msg.data.storageId;
                    var outOrderType = msg.data.outOrderType;
                    setFormInfo(box,msg);
                    $(".table-bg").attr("dataId",msg.data.id);
                    $(".sourceId-tip-s").attr("pid",msg.data.sourceId);
                    $(".sourceId-tip-s").attr("pidName",(msg.data.sourceName || ""));
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
                                $(".storageId option[value='"+storageId+"']").attr("selected",true);
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
                                    msgHtmls="";
                                for(var i=0; i<nameMsg.length; i++){
                                    msgHtmls += '<option value="'+nameMsg[i].dictCodeValue+'" vana="'+nameMsg[i].dictCodeName +'">'+nameMsg[i].dictCodeName+'</option>'
                                    if(nameMsg[i].dictCodeValue == "CKLX-GD"){
                                        $(".table-box").find(".outOrderType").attr("judge","01");
                                    }else if(nameMsg[i].dictCodeValue == "CKLX-QT"){
                                        $(".table-box").find(".outOrderType").attr("judge","02");
                                    }
                                }
                                $(".outOrderType").append(msgHtmls);
                                $(".outOrderType option[value='"+outOrderType+"']").attr("selected",true);
                                var projectType = $('[con_name="outOrderType"]');
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
                                            break;
                                        }
                                        else if ($('[con_name="outOrderType"]').val() === ASource[i].type)
                                        {
                                            $('[con_name="sourceId"]').removeAttr("url").removeAttr("contractId").removeAttr("bid").val("不必填写").focus().blur().attr({"disabled": true});
                                        }else{
                                            $('[con_name="sourceId"]').val("").removeAttr("url").removeAttr("contractId").removeAttr("bid").attr({"disabled": false});
                                        }
                                    }
                                };
                                setSource();
                                projectType.on("change", setSource);

                                /*
                                 *回显关联工单
                                 * */
                                var  cust="",
                                      sourceId =$(".sourceId-tip-s").attr("pid"),
                                      sourceName =$(".sourceId-tip-s").attr("pidName");
                                if(sourceId){
                                    cust += '<input type="text" class="input-text input-type sourceId" readonly  bid=" '+ sourceId +'" value="'+ sourceName +'" con_name="sourceId">';

                                }else {
                                    cust += '<input type="text" class="input-text input-type sourceId" readonly disabled bid="' + sourceId + '" value="不必填写" con_name="sourceId">';
                                }
                                $(".sourceId-tip .formControls").html(cust);
                            }
                        }
                    });


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
                    if(outOrderState == "0" || outOrderState =="1") {
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
                        sendData.id= $(".table-bg").attr("dataId");
                        loading = layer.msg('请稍后', {
                            time: 0,
                            icon: 16,
                            shade: 0.1
                        });

                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "operation/outboundorder/update",
                            data: sendData,
                            dataType: "json",
                            success: function (msg) {
                                if (msg && msg.success === 0) {
                                    layer.close(loading);
                                    layer.confirm('提交成功', {
                                            btn: ['确定'],
                                            shade: 0.1
                                        },
                                        function () {
                                            parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                        },
                                        function () {
                                            parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                        });
                                }
                            }
                        });
                    }else{

                    }
                }

            },
            callback:function(form){
                return false;
            }
        });


        window.getOutWorkOrder = function(data){
            if(data !=""){
                $(".sourceId-tip .formControls").html("");
                 for(var i=0; i< data.length; i++){
                 cust ="";
                 cust += '<input type="text" class="input-text input-type sourceId" readonly taskId="'+ data[i].taskId +'" projectId="'+ data[i].projectId +'" bid="'+ data[i].objId +'" value="'+ data[i].objName +'" con_name="sourceId">';

                 $(".sourceId-tip .formControls").append(cust);
                 }
                $(".sourceId-tip").find(".msg-tip").html('');
            }
        }

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
                    if (conNames.eq(i).attr("type") === "radio")
                    {
                        _radio = conNames.eq(i).parents(".radio-box").find('input[value="'+keyVal+'"]');
                        _radio.parents(".iradio-blue").addClass("checked");
                    }
                    else if (conNames.eq(i).attr("type") === "checkbox")
                    {
                        chkArr = keyVal.split(",");
                        for (var j= 0,len2=keyVal.length; j<len2; j++)
                        {
                            conNames.eq(i).parents(".formControls").find('input[value="'+chkArr[j]+'"]').attr("checked","checked");
                        }
                    }
                    else
                    {
                        if (conNames.eq(i).attr("_type") === "date")
                        {
                            date = window.formatDates(keyVal);
                            conNames.eq(i).val(date);
                        }
                        else if (conNames.eq(i).attr("_type") === "time")
                        {
                            date = window.formatDateTimes(keyVal);
                            conNames.eq(i).val(date);
                        }
                        else
                        {
                            conNames.eq(i).val(keyVal);
                        }
                    }
                }
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

