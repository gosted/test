(function($, w, d){
    'use strict';
    $(function() {
        var reqId = parent.window.layerViewData.reqId;
        var customerId = parent.window.layerViewData.customerId;
        var recordCode = parent.window.layerViewData.recordCode;
        var reqSupType = parent.window.layerViewData.reqSupType;
        window.layerViewData = parent.window.layerViewData;
        var fileField = $("#fileField"),
        htmlsrc ="",
        uploadFile = $(".upload-file"),
        createTrFlag = true;
        window.getTd($("#form-article-add"));

        //获取签约字典数据
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "preSupport/plan/findDictionary",
            data: {"dictCode": "HT"},
            success: function (msg) {
                var htmlsrc ="";
                if(msg.success=="0"){
                    var list = msg.data;
                    for (var i = 0; i < list.length; i++) {
                        htmlsrc += "<div class='formControls col-4 skin-minimal'>" +
                            "<div class='radio_box contradd'>" +
                            "<input type='radio' id='rad-"+i+"' name='construct' con_name='' value='"+list[i].dictCodeValue+"'>" +
                            "<label for='rad-"+i+"'>"+list[i].dictCodeName+"</label>" +
                            "</div>" +
                            "</div>"
                    }
                    $(".workrecadd").append(htmlsrc);
                    $(".workrecadd").find('input[value="HT-00"]').attr('checked','true');

                    if (reqSupType === "0")
                    {
                        var contractht = $(".workrecadd").find('input[value="HT-00"]');
                        var contracting = $(".workrecadd").find('input[value="HT-01"]');
                        var contracted = $(".workrecadd").find('input[value="HT-09"]');
                        contracting.click(function(){
                            $(".contract-date").html("预计签订日期：");
                            $(".contract-money").html("预计金额（元）：");
                        });
                        contracted.click(function(){
                            $(".contract-date").html("合同日期：");
                            $(".contract-money").html("合同金额（元）：");
                        });
                        contractht.click(function(){
                            $(".contract-date").html("预计签订日期：");
                            $(".contract-money").html("预计金额（元）：");
                        });
                    }
                    else
                    {
                        $(".contract-all").remove();
                    }

                }
            }
        });

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
                    var obj={},
                        strId = "",
                        arrP = $(".file-list p");
                    $.each(arrP, function (i, v)
                    {
                        strId += "," + $(v).attr("attachId");
                    });
                    strId = strId.substr(1);

                    obj.recordStartTime = $(".recordStartTime").find("input").val();     //开始时间
                    obj.recordEndTime = $(".recordEndTime").find("input").val();         //结束时间
                    obj.recordWorkload =$(".recordWorkload").find("input").val();       //工作量
                    obj.recordIsSupport = $('.skin-minimal input[name="construction"]:checked ').val();            //现场支撑11
                    obj.recordCost = $(".recordCost").find("input").val();               //费用报销
                    obj.recordSupUserId = $(".recordSupUserId").find("input").val();   //支撑人
                    obj.recordSupAddress = $(".recordSupAddress").find("input").val();  //支撑地点
                    obj.recordSupSummary = $(".recordSupSummary").find("input").val();//支撑概述
                    obj.recordSupDetail = $(".recordSupDetail").find("textarea").val();  //支撑详细说明
                    obj.recordContractState = $('input[name="construct"]:checked').val();//活动签订情况
                    obj.recordContractTime = $(".recordContractTime").find("input").val(); //合同签订时间
                    obj.recordContractSum = $(".recordContractSum").find("input").val(); //合同签订金额
                    obj.recordRemark = $(".recordRemark").find("textarea").val();          //备注
                    obj.attachmentId = strId;   //附件
                    obj.customerId = customerId;
                    obj.reqId = reqId;
                    obj.recordCode = recordCode;

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl+"preSupport/record/create",
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


       /*
       *上传文件
       */
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

    });
}(jQuery, window, document));

