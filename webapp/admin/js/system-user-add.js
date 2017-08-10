/**
 * 本文件的功能是人员管理新增js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var treeId = parent.window.layerViewData.treeId,
            attachmentId = "",
            attachmentName = "",
            userMajorUnit="",
            hasFile = false;

        //添加40个td
        window.getTd($(".form-table"));

        $("#table-box").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            datatype: {
                "date": /^\d{4}\-\d{2}\-\d{2}$/,
                "phone": /^0\d{2,3}-?\d{7,8}$/
            },
            beforeSubmit:function(curform){
               /*
                 * 提交跟踪反馈信息
                 */

                if($("[con_name=userName]").parent().siblings().attr("title") == "该用户名已存在")
                {
                    $("[con_name=userName]").parent().siblings().find("span").addClass("Validform_wrong").removeClass("Validform_right");
                }
                var namelist =  $(".userName-has").find("input").val();
                var majorlist =  $(".major").find("input").val();
                if(namelist == ""){
                    $(".userName-has").find(".userName-msg").html("<span class='Validform_checktip Validform_wrong'></span>");
                    $(".userName-has").find("input").addClass("Validform_error");
                }else{
                    $(".userName-has").find(".userName-msg").html("<span class='Validform_checktip Validform_right'></span>");
                    $(".userName-has").find("input").removeClass("Validform_error");
                }

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
                    var userMajorUnit =  $(".userMajorUnit").attr("userMajorUnit");
                    var sendData = {};
                    var loading = "";
                    sendData = getFormInfo(curform);
                    sendData.userMajorUnit = userMajorUnit;
                    loading = layer.msg('请稍后', {
                        time: 0,
                        icon: 16,
                        shade: 0.1
                    });

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "general/user/create",
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
        //主机构
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
        //判断邮件手机号是否正确
        $(".userEmail").find("input").blur(function(){
            var myemail = $(".userEmail").find("input").val();
            if(myemail != "") {
                if (!myemail.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
                    $(".userEmail").find(".msg-tip").html("<span class='Validform_checktip Validform_wrong'></span>");
                    $(".userEmail").find("input").addClass("Validform_error");
                } else {
                    $(".userEmail").find(".msg-tip").html("<span class='Validform_checktip Validform_right'></span>");
                    $(".userEmail").find("input").removeClass("Validform_error");
                }
            }else{
                $(".userEmail").find(".msg-tip").html("");
                $(".userEmail").find("input").removeClass("Validform_error");

            }
        });

        //判断用户名是否存在
        $(".userName").blur(function(){
            var userName = $(this).val();
            if(userName == ""){
                $(".userName-has .Validform_checktip").removeClass("Validform_right");
                $(".userName").addClass("Validform_error");
                $(".userName-has .Validform_checktip").addClass("Validform_wrong");
                $(".userName-msg").attr("title","请输入用户名");
            }else if(userName.length<1 || userName.length>16){
                $(".userName-has .Validform_checktip").removeClass("Validform_right");
                $(".userName").addClass("Validform_error");
                $(".userName-has .Validform_checktip").addClass("Validform_wrong");
                $(".userName-msg").attr("title","用户名不能超过16位");
            }else {
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "general/user/checkUserName",
                    data: {userName: userName},
                    dataType: "json",
                    success: function (msg) {
                        if (msg && msg.success === 0) {
                            if (msg.data == 0) {
                                $(".userName").removeClass("Validform_error");
                                $(".userName-has .Validform_checktip").removeClass("Validform_wrong");
                                $(".userName-msg").attr("title", "该用户名可以使用");
                                $(".userName-has .Validform_checktip").addClass("Validform_right");
                            } else {
                                $(".userName-has .Validform_checktip").removeClass("Validform_right");
                                $(".userName").addClass("Validform_error");
                                $(".userName-has .Validform_checktip").addClass("Validform_wrong");
                                $(".userName-msg").attr("title", "该用户名已存在");
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

        //树形结构
        window.setTree({
            url: ajaxUrl + "general/unit/findTreeForUser",
            type: "POST",
            data: {id: 0},
            id: "id",
            value: "unitName",
            treeClick: function ()
            {
                var _this = $(this),
                    id = _this.parents("li").eq(0).attr("treeId");
                $(".userMajorUnit").attr("userMajorUnit",id);
            }

        });

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

            /*for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                if (conNames.eq(i).attr("type") === "radio")
                {
                    keyVal = $('input[name="userSex"]:checked ').val();
                }
                else
                {
                    keyVal = conNames.eq(i).val();
                    userState = conNames.eq(i).val();
                }
                sendData[key] = keyVal;
                userStateVal[key] = userState;
            }*/
            sendData.userName = $(".userName").val();                                      //用户名
            sendData.userRealName = $(".userRealName").val();                             //真实姓名
            sendData.userSex = $('.userSex input[name="userSex"]:checked ').val();     //性别
            sendData.userMajorUnit = $(".userMajorUnit").val();                          //主机构
            sendData.userPassword = $(".password").val();                                 //密码
            sendData.userJobNumber = $(".userJobNumber").val();                          //工号
            sendData.userJob = $(".userJob").val();                                        //职位
            sendData.userState = $('.userState input[name="userState"]:checked ').val();//状态
            sendData.userEmail =  $(".userEmail").find("input").val();                                  //邮箱
            sendData.userMobilePhone = $(".userMobilePhone").find("input").val();     //手机
            sendData.userBirthday = $(".userBirthday").val();                            //出生日期
            sendData.userEdu = $(".userEdu").val();                                       //学历
            sendData.userWorkYear = $(".userWorkYear").val();                           //工作年限
            sendData.userAddress = $(".userAddress").val();                             //地址
            sendData.userPoliticsStatus = $(".userPoliticsStatus").val();            //政治面貌
            sendData.userHobby = $(".userHobby").val();                                 //兴趣爱好
            sendData.userSort = $(".userSort").val();                                    //排序
            sendData.userRemark = $(".userRemark").val();                               //备注
            return sendData;
        }

    });
}(jQuery, window, document));

