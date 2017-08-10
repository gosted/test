/**
 * 本文件是合作伙伴添加文件
 * @author 彭佳明
 */

(function($, w, d){
    'use strict';

    $(function() {
        var areaId = "",id = "",flag = true,noRepeat = true;
        var tables = $(".table-box>.form-table");
        window.getTd(tables);
        //动态添加表格

        addTable($(".addTable"),$(".firstTr"), $(".addBtn"));
        //获取参数
        var getVal = function(sendData)
        {
            $(".providerAdd").find("input").each(function(i,o)
            {
                if($(this).attr("con_name")){
                    sendData[$(this).attr("con_name")] = $(this).val();
                }
            });
            $(".providerAdd").find("textarea").each(function(i,o)
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
                "phone": /^0\d{2,3}-?\d{7,8}$/,
                "Post": /^[0-9][0-9]{5}$/
            },
            beforeSubmit:function(curform){
                var arr = [],sendArr = {},sendData = {};
                var obj1 = $(".addTable");
                var getAttr1 = obj1.find("th");
                var str="";
                obj1.find(".tableCenter").each(function(i,o)
                {
                    var name = $(this).find("td input").eq(0).val(),
                        code = $(this).find("td input").eq(1).val();
                    var sendArr = {};
                    sendArr[name] = code;
                    str = JSON.stringify(sendArr);
                    arr.push(str);
                });
                sendData = getVal({});
               /* sendData.arrlist = arr.join(",");*/
                //类型
                var  part = $(".has-partnerType .Validform_checktip");
                var val = $('.partnerType option:selected').val();
                if(val == "choose")
                {
                    $(".partnerType").addClass("Validform_error");
                    part.removeClass("Validform_right");
                    part.addClass("Validform_wrong");
                } else
                {
                    $(".partnerType").removeClass("Validform_error");
                    part.removeClass("Validform_wrong");
                    $(".partnerType-tip").attr("title", "输入正确");
                    part.addClass("Validform_right");
                    sendData.partnerType = val;
                    var arrP = $(".table-box").find($(".file-list p")), strId = "";
                    if (arrP.size() > 0) {
                        $.each(arrP, function (i, v) {
                            strId += "," + $(v).attr("attachId");
                        });
                        strId = strId.substr(1);
                    }
                    sendData.attachmentId = strId;
                    var  str = $.trim( $(".woc").text());
                    sendData.equipmentId = str ;
                    if(noRepeat){
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "/general/partner/create",
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
                                            sessionStorage.clear();
                                            parent.window.location.reload();
                                        });
                                    $(document).on("click",".layui-layer-close",function(){
                                        sessionStorage.clear();
                                        parent.window.location.reload();
                                    })

                                }
                            }
                        });
                    }else{
                        $(".has-partnerCode .Validform_checktip").removeClass("Validform_right");
                        $(".partnerCode").addClass("Validform_error");
                        $(".has-partnerCode .Validform_checktip").addClass("Validform_wrong");
                        $(".partnerCode-tip").attr("title", "该用户编号已存在");
                    }

                }
            },
            callback:function(form){
                return false;
            }
        });
        //编号唯一
        $(".partnerCode").on("blur",function(){
            var partnerCode = $(this).val();
            if(partnerCode == ""){
                $(".has-partnerCode .Validform_checktip").removeClass("Validform_right");
                $(".partnerCode").addClass("Validform_error");
                $(".has-partnerCode .Validform_checktip").addClass("Validform_wrong");
                $(".partnerCode-tip").attr("title","请输入用户名");
            }else {
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "general/partner/checkPartnerCode",
                    data: {partnerCode: partnerCode},
                    dataType: "json",
                    success: function (msg) {
                        if (msg && msg.success === 0) {
                            if (msg.data == 0) {
                                $(".partnerCode").removeClass("Validform_error");
                                $(".has-partnerCode .Validform_checktip").removeClass("Validform_wrong");
                                $(".partnerCode-tip").attr("title", "该用户编号可以使用");
                                $(".has-partnerCode .Validform_checktip").addClass("Validform_right");
                                noRepeat = true;
                            } else {
                                noRepeat = false;
                                $(".has-partnerCode .Validform_checktip").removeClass("Validform_right");
                                $(".partnerCode").addClass("Validform_error");
                                $(".has-partnerCode .Validform_checktip").addClass("Validform_wrong");
                                $(".partnerCode-tip").attr("title", "该用户编号已存在");
                                layer.confirm('该用户编号已存在', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    });
                            }
                        }
                    },
                    error: function (err) {
                        layer.confirm('操作失败', {
                            btn: ['确定','取消'],
                            shade: 0.1
                        });
                    }
                });
            }
        });
        //获取类型
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "preSupport/plan/findDictionary",
            data: {dictCode:"HZHB"},
            dataType: "json",
            success: function (msg) {
                if (msg && msg.success === 0) {
                    var str="";
                    for(var i=0;i<msg.data.length;i++){
                        str += '<option value="'+msg.data[i].dictCodeValue+'">'+msg.data[i].dictCodeName+'</option>';
                    }
                    $(".partnerType").append(str);
                }
            },
            error: function (err) {
                layer.confirm('操作失败', {
                    btn: ['确定','取消'],
                    shade: 0.1
                });
            }
        });
        $(".sel").on("click",function()
        {
            window.layerShow("关联设备名称","pro-equipmentName-list.html");
        });

        function getType(val){
            var part = $(".has-partnerType .Validform_checktip");
            if(val == "choose"){
                $(".partnerType").addClass("Validform_error");
                part.removeClass("Validform_right");
                part.addClass("Validform_wrong");
            }else{
                $(".partnerType").removeClass("Validform_error");
                part.removeClass("Validform_wrong");
                $(".partnerType-tip").attr("title", "输入正确");
                part.addClass("Validform_right");
            }
        }
        $(".partnerType").on("blur",function(){
            var val = $(this).val();
            getType(val);
        });
        $(".partnerType").on("change",function(e){
            var val = $(this).val();
            getType(val);
        });


    });
}(jQuery, window, document));
