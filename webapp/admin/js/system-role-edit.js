/**
 * Created by baozhe  on 2016/12/22.
 * 本文件的功能
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){


        var pageSize = 1000,
            pageNo = 1;
        var roleId = parent.window.layerViewData.roleId;
        window.getTd($(".form-table"));

        /*
         * 渲染角色权限传入请求到的数据
         * */
        function setTable (data)
        {
            var list = [],
                rolePermis = $(".rolePermis"),
                STr = null,
                checkbox = null;
            list = data.data;
            rolePermis.html("");
            $.each(list, function (i, v)
            {


                    STr =$('<div class="col-12 role-check parent_check">' +
                        '<label class="col-12"><input class="radio_box_open" type="checkbox" id="authGroup-1">'+i+'<img src="../../images/commen/arro_down.png"></label></div>');

                    $.each(v,function(j,k)
                    {
                        $.each(k,function(m,n){
                            if(m == "authName")
                            {
                                checkbox = $('<label style="display: inline-block" class="col-2"><input class="check " type="checkbox" id="rolePermis-1" con_name="roleAuths" name="authName"  value="'+ k.id +'" >'+ n +'</label>');

                            }

                        })
                        STr.append(checkbox);

                    })


                rolePermis.append(STr);




            });
            //点击上一级元素，下一级全部选中
            $(".parent_check").find(".radio_box_open").on('click',function()
            {

                if(this.checked)
                {
                    $(this).parent().parent().find("input").prop("checked",true);
                }
                else
                {
                    $(this).parent().parent().find("input").removeAttr("checked",false);
                }


            });

        }

        //获取出所有权限数据
        function initTable (obj)
        {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl+"general/role/findAllAuth",
                data: {pageSize: obj.pageSize, pageNo: obj.pageNo, planClassify: obj.dictCodeValue, planCode: obj.planCode, prName: obj.prName, prLabel: obj.prLabel, prRemark: obj.prRemark},
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        setTable(data);

                        //请求已有信息
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "general/role/findById",
                            data: {"id": roleId},
                            success: function (data)
                            {

                                if (data && data.success === 0)
                                {
                                    var box = $("#roleAdd");
                                    if(data.data.roleState && data.data.roleState == 1){
                                        $(".radio_box_jy").attr("checked","checked");//禁用
                                    }
                                    else{
                                        $(".radio_box_qy").attr("checked","checked"); //启用
                                    }
                                    if( data.data.roleSort == 0) {
                                        $("[con_name='roleSort']").val("0");
                                    }

                                    var role_name = $("#roleAdd").attr("role_name",data.data.roleName);

                                    setFormInfo(box,data);

                                }
                            }
                        });



                    }
                }
            });





        }
        initTable ({pageSize: pageSize, pageNo: pageNo, id: roleId});

        /*
         * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
         * */
        function setFormInfo (box,data)
        {
            var box = $("#roleAdd"),
                conNames = box.find('[con_name]'),
                Names = box.find('[name]'),
                _data = data.data,
                key = "",
                keyVal = "",
                _radio = null,
                chkArr = [],
                date = "";
            for (var i= 0, len=Names.size(); i<len; i++)
            {
                key = Names.eq(i).attr("name");
                keyVal = _data[key];
                if (keyVal)
                {
                    if (Names.eq(i).attr("type") === "checkbox")
                    {
                        chkArr = keyVal.split(",");
                        for (var j= 0,len2=keyVal.length; j<len2; j++)
                        {
                            Names.eq(i).parents(".rolePermis").find('input[value="'+chkArr[j]+'"]').attr("checked","checked");
                        }
                    }
                    else if(Names.eq(i).attr("type") === "radio")
                    {

                    }
                    else
                    {

                        Names.eq(i).val(keyVal);


                    }

                }

            }


        }


        /*
         * 判断名称唯一性和编码唯一性
         * */



        $("[con_name='roleName']").on("blur",function()
        {

            if( $("[con_name='roleName']").val() == $('#roleAdd').attr("role_name"))
            {

            }
            else{
                var _this = $(this);
                if($(this).val() == "")
                {
                    _this.parent().siblings().find("span").removeClass("Validform_right").addClass("Validform_wrong");
                    _this.parent().siblings().attr("title","输入不能为空");
                }
                else
                {
                    $.myAjax({
                        type:"POST",
                        url:window.ajaxUrl + "general/role/find",
                        data:{"roleName":$(this).val()},
                        success:function(msg)
                        {
                            console.log(msg)
                            if(msg.success === 0)
                            {
                                if(msg.data.length)
                                {
                                    console.log(_this)
                                    _this.parent().siblings().find("span").removeClass("Validform_right").addClass("Validform_wrong");
                                    _this.parent().siblings().attr("title","角色已经使用");

                                }
                                else
                                {
                                    _this.parent().siblings().attr("title","角色可用");
                                }

                            }
                            else
                            {

                            }
                        }

                    })
                }


            }

        })




        $("#table-box").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            beforeSubmit:function(curform){

                /*
                 * 提交信息
                 */
                if($("[con_name=roleName]").parent().siblings().attr("title") == "角色已经使用")
                {
                    $("[con_name=roleName]").parent().siblings().find("span").addClass("Validform_wrong").removeClass("Validform_right");
                }
                if($(".Validform_wrong").length>0)
                {
                    return;
                }
                else
                {
                    var sendData = {};
                    sendData = getFormInfo(curform);
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "general/role/updateToRoleAuth",
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
                                    function()
                                    {
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    },
                                    function()
                                    {
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗

                                    });

                            }
                            else
                            {
                                layer.msg('操作失败', {icon:5,time:1000});
                            }
                        },
                        error: function(err)
                        {
                            layer.msg('操作失败', {icon:5,time:1000});
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
        $(".ProgramSubmitButton").on("click",getFormInfo);

        function getFormInfo (box)
        {
            var box = $("#roleAdd"),
                conNames = box.find('[con_name]'),
                key = "",
                keyVal = "",
                sendData = {},
                checkboxs = null;
            sendData.id = roleId;

            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                if (conNames.eq(i).attr("type") === "radio")
                {
                    keyVal = $('input[name="roleState"]:checked ').val();
                }
                else if (conNames.eq(i).attr("type") === "checkbox")
                {
                    checkboxs = conNames.eq(i).parents(".rolePermis").find(".check");
                    keyVal = "";
                    $.each(checkboxs, function (i, v)
                    {
                        if ($(v)[0].checked === true)
                        {
                            keyVal += "," + $(v).val();
                        }
                    });
                    keyVal = keyVal.substr(1);
                }
                else
                {
                    keyVal = conNames.eq(i).val();
                }
                sendData[key] = keyVal;
            }
            return sendData;
        }



    });
}(jQuery, window, document));