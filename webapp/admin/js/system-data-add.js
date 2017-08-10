/**
 * 本文件的功能是数据字典新增js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var treeId = parent.window.layerViewData.treeId,
            diccode = parent.window.layerViewData.diccode,
            dicname = parent.window.layerViewData.dicname,
            dicId = parent.window.layerViewData.dicId;
        //添加40个td
        window.getTd($(".form-table"));
        $(".dictItem").val(dicname);//字典项
        $(".dictItem").attr("xsid",treeId);
        $(".dictCode").val(diccode); //字典代码
        $(".dictParentId").val(dicname);//默认选择父级字典
        $(".dictParentId").attr("dictparentid",treeId); //默认选择父级字典id
        $("#table-box").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            beforeSubmit:function(curform){
               /*
                 * 提交跟踪反馈信息
                 */
                var majorlist =  $(".major").find("input").val();
                if(majorlist == ""){
                    $(".major").find(".msg-tip").html("<span class='Validform_checktip Validform_wrong'></span>");
                    $(".major").find("input").addClass("Validform_error");
                }else{
                    $(".major").find(".msg-tip").html("<span class='Validform_checktip Validform_right'></span>");
                    $(".major").find("input").removeClass("Validform_error");
                }
                if($(".Validform_wrong").length>0)
                {
                    return;
                }
                else
                {
                    var sendData = {},
                        loading = "";
                    sendData = getFormInfo(curform);
                    loading = layer.msg('请稍后', {
                        time: 0,
                        icon: 16,
                        shade: 0.1
                    });

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "general/dictionary/create",
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
                                        var xzid = $(".dictItem").attr("xsid");
                                        $.cookie('xzid', xzid);
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    },
                                    function()
                                    {
                                        var xzid = $(".dictItem").attr("xsid");
                                        $.cookie('xzid', xzid);
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
        //父级字典
        $(".major").find("input").blur(function(){
            var majorlist =  $(".major").find("input").val();
            if(majorlist == ""){
                $(".major").find(".msg-tip").html("<span class='Validform_checktip Validform_wrong'></span>");
                $(".major").find("input").addClass("Validform_error");
            }else{
                $(".major").find(".msg-tip").html("<span class='Validform_checktip Validform_right'></span>");
                $(".major").find("input").removeClass("Validform_error");
            }
        });

        //树形结构
        window.setTree({
            url: ajaxUrl + "general/dictionary/findTree",
            type: "POST",
            data: {id: treeId},
            id: "id",
            value: "dictCodeName",
            treeClick: function () {
                var _this = $(this),
                    parentId = _this.parents("li").eq(0).attr("treeId");
                $(".dictParentId").attr("dictParentId", parentId);
            }

        });


        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
         * */
        function getFormInfo (box)
        {
            var sendData = {};
            sendData.dictCodeName = $(".dictCodeName").val();                              //字典名称
            sendData.dictCode = $(".dictCode").val();                                       //字典代码
            sendData.dictCodeValue = $(".dictCodeValue").val();                           //字典值
            sendData.dictParentId = $(".dictParentId").attr("dictParentId");             //父级字典
            sendData.dictSort = $(".dictSort").val();                                       //排序
            sendData.dictRemarks = $(".dictRemarks").val();                                //备注
            sendData.dictState = $('.dictState input[name="dictState"]:checked ').val();//状态
            sendData.id = treeId;
            return sendData;
        }

        //返回
        $(".return").on("click",function(){
            parent.window.location.replace(parent.window.location.href);
        })
    });
}(jQuery, window, document));

