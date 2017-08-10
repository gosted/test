/**
 * 本文件的功能是人员管理之单条角色编辑js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var usernamelist = parent.window.layerViewData.usernamelist,
            usernameid = parent.window.layerViewData.libId,
            userName = parent.window.layerViewData.userName,
            userfinpageId = [];

        //添加40个td
        window.getTd($(".form-table"));

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

        //请求产品信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/user/findRoleByUserId",
            data: {id: usernameid},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    var list = data.data;
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "general/role/findPageForUser",
                        data: "",
                        success: function (data)
                        {
                            if (data && data.success === 0)
                            {
                                var lists = data.data.result;
                                for (var i = 0; i < lists.length; i++) {
                                    var label = $("<label></label>");
                                    label.addClass("col-2 text-l");
                                    if(list.indexOf(lists[i].id) >= 0){
                                        label.html("<input type='checkbox' value='' checked='checked' name='pro' con_name='planProducts' ids='" + lists[i].id + "' roleCodes='" + lists[i].roleCode + "' />" + lists[i].roleName);
                                    }else{
                                        label.html("<input type='checkbox' value='' name='pro' con_name='planProducts' ids='" + lists[i].id + "' roleCodes='" + lists[i].roleCode + "' />" + lists[i].roleName);
                                    }
                                    $(".roleManagement").append(label);
                                }
                            }
                        }
                    });
                }
            }
        });

        //提交批量添加角色信息
    $(".ProgramSubmitButton").on("click",function(){
        var roleCode = [],
            roleIds = [],
            roleCodes="";
        $(".roleManagement").find("input:checkbox:checked").each(function () {
            var strattr = $(this).attr("ids");
            var rc = $(this).attr("roleCodes");
            userfinpageId.push(strattr);
            roleCode.push(rc);
        });

        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/user/updateRole",
            data: {
                userId:usernameid,
                userName:userName,
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

