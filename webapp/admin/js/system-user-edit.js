/**
 * 本文件的功能是人员管理编辑js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var libId = parent.window.layerViewData.libId;

        //添加40个td
        window.getTd($(".form-table"));

        //请求已有信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/user/findUserById",
            data: {"id": libId},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    var box = $("#libAdd");
                    $(".userMajorUnit").attr("userMajorUnit",data.data.userMajorUnit);
                    if(data.data.userState && data.data.userState == 1){
                        $(".radio_box_jy").attr("checked","checked");//启用禁用
                    }
                    else{
                        $(".radio_box_qy").attr("checked","checked");
                    }
                    if(data.data.userSex && data.data.userSex == 1){
                        $(".radio_box_nv").attr("checked","checked");//性别
                    }
                    else{
                        $(".radio_box_na").attr("checked","checked");
                    }
                    if(data.data.userRemark != null &&  data.data.userRemark != ""){
                    	$(".beizu").find(".textarea-length").html(data.data.userRemark.length);
                    }
                    
                    setFormInfo(box,data);
                }
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
                if (keyVal || 0)
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
                            conNames.eq(i).val(keyVal);
                        }
                    }
                }
            }
        }

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
                var userSex = $('input[name="userSex"]:checked ').val();
                var userState = $('input[name="userState"]:checked ').val();
                var userMajorUnit =  $(".userMajorUnit").attr("userMajorUnit");
                var sendData = {};
                sendData = getFormInfo(curform);
                sendData.id = libId;
                sendData.userMajorUnit = userMajorUnit;
                sendData.userSex = userSex;
                sendData.userState = userState;
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
                else {
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "general/user/update",
                        data: sendData,
                        dataType: "json",
                        success: function (msg) {
                            if (msg && msg.success === 0) {
                                layer.confirm('提交成功', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    },
                                    function () {
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

                }
                else
                {
                    keyVal = conNames.eq(i).val();
                }
                sendData[key] = keyVal;
            }*/
            sendData.userName = $(".userName").val();                                      //用户名
            sendData.userRealName = $(".userRealName").val();                             //真实姓名
            sendData.userSex = $('.userSex input[name="userSex"]:checked ').val();     //性别
            sendData.userMajorUnit = $(".userMajorUnit").val();                          //主机构
            sendData.userPassword = $(".password").val();                                 //密码
            sendData.userJobNumber = $(".userJobNumber").val();                          //工号
            sendData.userJob = $(".userJob").val();                                        //职位
            sendData.userState = $('.userState input[name="userState"]:checked ').val();//状态
            sendData.userEmail =  $(".userEmail").find("input").val();                                   //邮箱
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

