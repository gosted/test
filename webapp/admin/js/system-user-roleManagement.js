/**
 * 本文件的功能是人员管理之角色管理js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var  usernameid = parent.window.layerViewData.usernameid,
            username = parent.window.layerViewData.username;
          var arr = [];
        //添加40个td
        window.getTd($(".form-table"));
        //请求产品信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/role/findPageForUser",
            data: "",
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    var checkbox = $(".roleManagement"),
                        arr = data.data.result;

                    $.each(arr, function (i, v)
                    {
                        var label = $('<label class="col-2" ></label>'),
                            ipt = $('<input name="pro" class="check ml-5" type="checkbox" ids = "'+v.id+'" roleCodes="' + v.roleCode + '">');
                        if (i === 0)
                        {
                            ipt.attr({"con_name": "planProducts", "datatype": "*"});
                        }
                        ipt.val(v.roleName);
                        label.append(ipt);
                        label.append(v.roleName);
                        checkbox.append(label);
                        checkbox.append("\r");
                    });
                }
            }
        });



        //提交批量添加角色信息
    $(".ProgramSubmitButton").on("click",function(){
        var roleIds = [],
            roleCodes = [],
            roleCode=[],
            userfinpageId = [];
        $(".roleManagement").find("input:checkbox:checked").each(function () {
            var strattr = $(this).attr("ids");
            userfinpageId.push(strattr);
            var rc = $(this).attr("roleCodes");
            roleCode.push(rc);
            
        });

        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/user/createRoleOfBatch",
            data: {
                userIds:usernameid,
                userName:username,
                roleIds:userfinpageId.join(),
                roleCodes:roleCode.join()
            },
            dataType: "json",
            success: function(msg)
            {
                if (msg && msg.success === 0)
                {
                    layer.confirm('提交成功', {
                            btn: ['确定'],
                            shade: 0.1
                        },
                        function()
                        {
                            parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                        });

                }
                
                roleIds=[];
                roleCode=[];
            }
        });
    })

    });
}(jQuery, window, document));

