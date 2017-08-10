/*
 * 工作记录页面-编辑页面js文件
 *@author 王步华
 */
(function($, w, d){
    'use strict';
    $(function() {
        var reqId = parent.window.layerViewData.reqId;
        var attachmentId = parent.window.layerViewData.attachmentId;
        var reqSupType = parent.window.layerViewData.reqSupType;
        window.layerViewData = parent.window.layerViewData;
        var fileField = $("#fileField");
        var id="",
            state="",
            uploadFile = $(".upload-file");
        window.getTd($("#form-article-add"));

        //兼容IE8下indexOf方式
        if (!Array.prototype.indexOf)
        {
            Array.prototype.indexOf = function(elt /*, from*/)
            {
                var len = this.length >>> 0;
                var from = Number(arguments[1]) || 0;
                from = (from < 0)
                    ? Math.ceil(from)
                    : Math.floor(from);
                if (from < 0)
                    from += len;
                for (; from < len; from++)
                {
                    if (from in this &&
                        this[from] === elt)
                        return from;
                }
                return -1;
            };
        }

        //获取工作记录信息
        function workEdit(){
            var List="";
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "preSupport/record/findById",
                data: {"id":attachmentId} ,
                success: function (msg) {
                    if(msg.success=="0") {
                        var html = "";
                        var htmlsrc ="";
                        var list = msg.data;
                        id = msg.data.id;
                        if(list.recordIsSupport == "0"){
                            $(".accessory").find("#sex-1").attr("checked","checked");
                        }else if(list.recordIsSupport == "1"){
                            $(".accessory").find("#sex-2").attr("checked","checked");
                        }

                        $(".recordStartTime").find("input").val(window.formatDates(list.recordStartTime));     //开始时间
                        $(".recordEndTime").find("input").val(window.formatDates(list.recordEndTime));         //结束时间
                        $(".recordWorkload").find("input").val(list.recordWorkload);       //工作量
                        $(".recordCost").find("input").val(list.recordCost);               //费用报销
                        $(".recordSupUserId").find("input").val(list.recordSupUserId);   //支撑人
                        $(".recordSupAddress").find("input").val(list.recordSupAddress);  //支撑地点
                        $(".recordSupSummary").find("input").val(list.recordSupSummary);//支撑概述
                        $(".recordSupDetail").find("textarea").val(list.recordSupDetail);  //支撑详细说明
                        $(".recordContractTime").find("input").val(window.formatDates(list.recordContractTime)); //合同签订时间
                        $(".recordContractSum").find("input").val(list.recordContractSum); //合同签订金额
                        $(".recordRemark").find("textarea").val(list.recordRemark);          //备注
                        $(".file_container").text(list.attachName);
                        if(list.recordSupDetail != "" || list.recordSupDetail != null){
                        	$(".recordSupDetail").find(".textarea-length").html(list.recordSupDetail.length);
                        }
                        if(list.recordRemark != "" && list.recordRemark != null){
                        	$(".recordRemark").find(".textarea-length").html(list.recordRemark.length);
                        }
                        
                        //获取签约字典数据

                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "preSupport/plan/findDictionary",
                            data: {"dictCode": "HT"},
                            success: function (msg) {
                                if(msg.success=="0"){
                                    var lists = msg.data;
                                    for (var i = 0; i < lists.length; i++) {
                                        htmlsrc=""
                                        if(list.recordContractState == null || list.recordContractState == "") {
                                            $(".contract-all").remove();
                                        }else{
                                            if (list.recordContractState.indexOf(lists[i].dictCodeValue) >= 0) {
                                                htmlsrc += "<div class='formControls col-4 skin-minimal'>" +
                                                    "<div class='radio_box'>" +
                                                    "<input type='radio' id='box-" + i + "' checked='checked' name='constructs' con_name='' value='" + lists[i].dictCodeValue + "'>" +
                                                    "<label for='box-" + i + "'>" + lists[i].dictCodeName + "</label>" +
                                                    "</div>" +
                                                    "</div>"
                                            } else {
                                                htmlsrc += "<div class='formControls col-4 skin-minimal'>" +
                                                    "<div class='radio_box'>" +
                                                    "<input type='radio' id='box-" + i + "' name='constructs' con_name='' value='" + lists[i].dictCodeValue + "'>" +
                                                    "<label for='box-" + i + "'>" + lists[i].dictCodeName + "</label>" +
                                                    "</div>" +
                                                    "</div>"
                                            }
                                            $(".workrecadd").append(htmlsrc);
                                        }

                                    }
                                    if (reqSupType === "0")
                                    {
                                        var contractht = $(".workrecadd").find('input[value="HT-00"]');
                                        var contracting = $(".workrecadd").find('input[value="HT-01"]');
                                        var contracted = $(".workrecadd").find('input[value="HT-09"]');
                                        if(list.recordContractState == "HT-09"){

                                            $(".contract-date").html("合同日期：");
                                            $(".contract-money").html("合同金额（元）：");
                                        }else {
                                            $(".contract-date").html("预计签订日期：");
                                            $(".contract-money").html("预计金额（元）：");
                                        }
                                        contractht.click(function(){
                                            $(".workrecadd").find('input[value="HT-00"]').attr('checked','true');
                                            $(".workrecadd").find('input[value="HT-01"]').removeAttr("checked");
                                            $(".workrecadd").find('input[value="HT-09"]').removeAttr("checked");
                                            $(".contract-date").html("预计签订日期：");
                                            $(".contract-money").html("预计金额（元）：");
                                        });
                                        contracting.click(function(){
                                            $(".workrecadd").find('input[value="HT-00"]').removeAttr("checked");
                                            $(".workrecadd").find('input[value="HT-01"]').attr('checked','true');
                                            $(".workrecadd").find('input[value="HT-09"]').removeAttr("checked");
                                            $(".contract-date").html("预计签订日期：");
                                            $(".contract-money").html("预计金额（元）：");
                                        });
                                        contracted.click(function(){
                                            $(".workrecadd").find('input[value="HT-00"]').removeAttr("checked");
                                            $(".workrecadd").find('input[value="HT-01"]').removeAttr("checked");
                                            $(".workrecadd").find('input[value="HT-09"]').attr('checked','true');
                                            $(".contract-date").html("合同日期：");
                                            $(".contract-money").html("合同金额（元）：");
                                        });

                                    }
                                    else
                                    {
                                        $(".contract-all").remove();
                                    }
                                }
                            }
                        });

                        var attschmen = msg.data.attachments;
                        if(attschmen != null || attschmen != " " ) {
                            //}else{
                            $.myAjax({
                                type: "POST",
                                url: window.ajaxUrl + "preSupport/record/findById",
                                data: {"id":attachmentId} ,
                                success: function (msg) {
                                    if(msg.success=="0") {
                                        var attachm = msg.data.attachments;
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
                                                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="btn btn-success radius ml-10"><i class="Hui-iconfont"></i>删除</a>'+
                                                '</p>'
                                        });
                                        $(".accessory").find(".file-list").append(List);
                                    }
                                }
                            });
                        }

                    }

                }
            });

        }
        workEdit();
        $(".workAdd_main_btn").Validform({
            btnSubmit: ".ProgramSubmitbot .btn",
            tiptype:2,
            datatype:{
                "floatnum":function(gets,obj,curform,regxp)
                {
                    var reg = /^\d{1,13}((\.\d{1,2})?)$/;
                    if(reg.test(obj.val()))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            },
            beforeSubmit:function(curform) {
                //提交修改后的工作记录
                var obj={},
                    List="",
                    strId="",
                    arrP = $(".file-list p");
                $.each(arrP, function (i, v)
                {
                    strId += "," + $(v).attr("attachId");
                });
                strId = strId.substr(1);

                obj.recordStartTime = $(".recordStartTime").find("input").val();     //开始时间
                obj.recordEndTime = $(".recordEndTime").find("input").val();         //结束时间
                obj.recordWorkload =$(".recordWorkload").find("input").val();       //工作量
                obj.recordIsSupport = $('.skin-minimal input[name="construction"]:checked ').val();//现场支撑
                obj.recordCost = $(".recordCost").find("input").val();               //费用报销
                obj.recordSupUserId = $(".recordSupUserId").find("input").val();   //支撑人
                obj.recordSupAddress = $(".recordSupAddress").find("input").val();  //支撑地点
                obj.recordSupSummary = $(".recordSupSummary").find("input").val();//支撑概述
                obj.recordSupDetail = $(".recordSupDetail").find("textarea").val();  //支撑详细说明
                obj.recordContractState = $('input[name="constructs"]:checked').val();//活动签订情况
                obj.recordContractTime = $(".recordContractTime").find("input").val(); //合同签订时间
                obj.recordContractSum = $(".recordContractSum").find("input").val(); //合同签订金额
                obj.recordRemark = $(".recordRemark").find("textarea").val();          //备注
                obj.attachmentId = strId;   //附件
                obj.reqId = reqId;
                obj.id = id;
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "preSupport/record/update",
                    data:  obj ,
                    success: function (msg) {
                        if(msg.success=="0"){
                            layer.confirm('提交成功', {
                                    btn: ['确定'],
                                    shade: 0.1
                                },
                                function()
                                {
                                    parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                });
                        }
                    }
                });
            },
            callback:function(form){
                return false;
            }
        });

        //文件上传
        uploadFile.on("change",function ()
        {
            var _this = this;

            fileUpload({
                ths: _this,
                msg: "正在上传文件",
                form: $("#upload"),
                fileList: $(".file-list"),
                sendData: {}
            });
        });

        $(".file-list").on("click",".btn",function ()
        {
            var _this = $(this),
                id = $(this).parent().attr("attachId");
            $.myAjax({
                type:"POST",
                url:ajaxUrl + "preSupport/attachment/deleteFileById",
                data:{"id":id},

                success:function(data)
                {
                    if(data.success === 0)
                    {
                        _this.parent().remove();
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
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "preSupport/attachment/checkIsLogin",
                data: {},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        DownLoadFile({
                            "url": window.ajaxUrl + "preSupport/attachment/findFileData",
                            "method": "post",
                            "data": {"attachId": _this.attr("attachId")}
                        });
                    }
                }
            });
        });

    });
}(jQuery, window, document));

