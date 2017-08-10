/**
 * 本文件的功能是数据字典新建一级字典js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var treeId = parent.window.layerViewData.treeId;

        //添加40个td
        window.getTd($(".form-table"));

        $("#table-box").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            beforeSubmit:function(curform){
                if($(".Validform_wrong").length>0)
                {
                    return;
                }
                else
                {
                    var loading = "",
                        sendData = {};
                    sendData = getFormInfo(curform);
                    loading = layer.msg('请稍后', {
                        time: 0,
                        icon: 16,
                        shade: 0.1
                    });

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "general/dictionary/createDictionary",
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
         * */
        function getFormInfo (box)
        {
            var sendData = {};
            sendData.dictCodeName = $(".dictCodeName").val();                 //字典名称
            sendData.dictSort = $(".userEmail").find("input").val()           //排序
            sendData.dictCode = $(".dictCode").val()           //字典代码
            return sendData;
        }

        //返回
        $(".return").on("click",function(){
            parent.window.location.replace(parent.window.location.href);
        })
    });
}(jQuery, window, document));

