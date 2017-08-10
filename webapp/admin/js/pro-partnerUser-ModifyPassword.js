/**
 * 本文件的功能是人员管理之修改密码js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var libId = parent.window.layerViewData.libId;

        //添加40个td
        window.getTd($(".form-table"));


        $("#table-box").Validform({
            btnSubmit: ".ProgramSubmitButton",
            tiptype:2,
            beforeSubmit:function(curform){
                //修改密码
                layer.confirm('确定要修改密码吗？', {
                        btn: ['确定','取消'],
                        shade: 0.1
                    },function(){
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "general/user/resetPassword",
                            data: {
                                id:libId,
                                userPassword:$(".Password").val()
                            },
                            dataType: "json",
                            success: function(msg)
                            {
                                if (msg && msg.success === 0)
                                {
                                    parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                }

                            }
                        });
                    }, function(){

                    });


            },
            callback:function(form){
                return false;
            }
        });
    });
}(jQuery, window, document));

