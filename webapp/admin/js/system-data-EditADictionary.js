/**
 * 本文件的功能是数据字典编辑一级字典js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var treeId = parent.window.layerViewData.treeId;
        //添加40个td
        window.getTd($(".form-table"));

        //请求已有信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/dictionary/findById",
            data: {id: treeId},
            dataType:"json",
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    var box = $("#libAdd");
                    setFormInfo(box,data);
                }
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
                if (keyVal ||　keyVal　==　0)
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
                            conNames.eq(i).val(keyVal+"");
                        }
                    }
                }
            }
        }

        $("#table-box").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            beforeSubmit:function(curform){
               /*
                 * 提交跟踪反馈信息
                 */
                if($(".Validform_wrong").length>0)
                {
                    return;
                }
                else
                {
                    var userMajorUnit =  $(".userMajorUnit").attr("userMajorUnit"),
                        sendData = {},
                        loading = "";
                    sendData = getFormInfo(curform);
                    sendData.userMajorUnit = userMajorUnit;
                    loading = layer.msg('请稍后', {
                        time: 0,
                        icon: 16,
                        shade: 0.1
                    });

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "general/dictionary/updateDictionary",
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

        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
        */
        function getFormInfo (box)
        {
            var sendData = {};
            sendData.dictCodeName = $(".dictCodeName").val();                 //字典名称
            sendData.dictCode = $(".dictCode").val();                           //字典代码
            sendData.dictSort = $(".userEmail").find("input").val()           //排序
            sendData.id = treeId;
            return sendData;
        }

        //返回
        $(".return").on("click",function(){
            parent.window.location.replace(parent.window.location.href);
        })
    });
}(jQuery, window, document));

