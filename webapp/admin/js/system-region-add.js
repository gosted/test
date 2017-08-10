/**
 * 本文件的功能是地区管理添加js文件
 *@ author 李明
 */

(function($, w, d){
    'use strict';

    $(function() {
        var src = decodeURI(location.href).split("?")[1].split("&")[1].split("=")[1];
        var id = decodeURI(location.href).split("?")[1].split("&")[0].split("=")[1];
        $(".organ-name").find("div").html(src);
        var table = $(".table");
        var flag = true;      //是否第一次加载页面判断树的数据加载
        window.getTd(table);
        var saveBtn = ".organ_save";
        //verifyForm($(".table-box"),saveBtn);
        $("[con_name=unitParentId]").attr("unitParentId",id);
        $("[con_name=unitParentId]").val(src);
        /*唯一标示判断*/

      /*  $("[con_name='areaCode']").on("blur",function()
        {
            var _this = $(this);

                $.myAjax({
                    type:"POST",
                    url: window.ajaxUrl + "general/area/find",
                    data:{"areaCode":$(this).val()},
                    success:function(msg)
                    {
                        if(msg.success === 0)
                        {
                            if(msg.data == null || msg.data == ""){

                            }else{
                                layer.confirm('该编码不可用，请修改', {
                                    btn: ['确定'],
                                    shade: 0.1
                                });
                                $(this).val(" ");
                            }
                        }
                    }
                })
        })*/

        /*唯一标示判断*/
        $("[con_name='areaCode']").on("blur",function()
        {

            var _this = $(this);
            if($(this).val() == ""){
                _this.parent().siblings().find("span").removeClass("Validform_right").addClass("Validform_wrong");
                _this.parent().siblings().attr("title","输入不能为空");
            }
            else
            {
                $.myAjax({
                    type:"POST",
                    url:window.ajaxUrl + "general/area/find",
                    data:{"areaCode":$(this).val()},
                    success:function(msg)
                    {
                        if(msg.success === 0)
                        {
                            if(msg.data == null || msg.data == "")
                            {
                                if($(".areaCode ").hasClass("Validform_error")){
                                    _this.parent().siblings().attr("title","请正确输入1至20位数字的数据");
                                }else{
                                    _this.parent().siblings().attr("title","编码可用");
                                }
                            }
                            else
                            {
                                _this.parent().siblings().find("span").removeClass("Validform_right").addClass("Validform_wrong");
                                _this.parent().siblings().attr("title","编码已经存在");
                            }
                        }
                    }
                })
            }
        })
        //验证表单
        $("#table-box").Validform({
            btnSubmit: ".organ_save",
            tiptype:2,
            beforeSubmit:function(curform){

                /*
                 * 提交信息
                 */
                if($("[con_name=areaCode]").parent().siblings().attr("title") == "编码已经存在")
                {
                    $("[con_name=areaCode]").parent().siblings().find("span").addClass("Validform_wrong").removeClass("Validform_right");
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
                        url: window.ajaxUrl + "general/area/create",
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
                                        var arId = $("[con_name = 'areaParentId']").attr("areaParentId");
                                        //$.cookie('arId', arId);
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    },
                                    function()
                                    {
                                        var arId = $("[con_name = 'areaParentId']").attr("areaParentId");
                                        //$.cookie('arId', arId);
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
        $(".organ_save").on("click",getFormInfo);
        function getFormInfo (box)
        {
            var box = $("#table-box"),
                conNames = box.find('[con_name]'),
                key = "",
                keyVal = "",
                sendData = {},
                checkboxs = null;
            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                if(key == "areaParentId")
                {
                    keyVal = conNames.eq(i).attr("areaParentId");
                    sendData[key] = keyVal;

                }
                else{
                    keyVal = conNames.eq(i).val();
                    sendData[key] = keyVal;
                }


            }
            return sendData;
        }


        /*表单验证提交方法*/
/*        function verifyForm(formName,verifyClass)
        {
            formName.Validform({
                btnSubmit: verifyClass,
                tiptype:2,
                callback:function(form){
                    return false;
                },
                beforeCheck:function(data)
                {

                },
                beforeSubmit:function(data)
                {
                    if($("[con_name=areaCode]").parent().siblings().attr("title") == "编码已经存在")
                    {
                        $("[con_name=areaCode]").parent().siblings().find("span").addClass("Validform_wrong").removeClass("Validform_right");
                    }
                    var obj = {};
                    for(var i=0,len=$("[con_name]").length;i<len;i++)
                    {
                        var proName = $($("[con_name]")[i]).attr("con_name");
                        if($($("[con_name]")[i]).attr("type") == "text")
                        {
                            if(proName == "areaName")
                            {
                                obj[proName] = $($("[con_name]")[i]).val();
                            }
                            else if(proName == "areaParentId")
                            {
                                obj[proName] = $($("[con_name]")[i]).attr("areaParentId");
                            }
                            else if(proName == "areaLevel")
                            {
                                obj[proName] = $($("[con_name]")[i]).val();
                            }
                            else if(proName == "areaCode")
                            {
                                obj[proName] = $($("[con_name]")[i]).val();
                            }
                            else if(proName == "areaInitial")
                            {
                                obj[proName] = $($("[con_name]")[i]).val();
                            }
                        }
                        else if($($("[con_name]")[i]).attr("type") == "radio")
                        {
                            if($("[con_name]")[i].checked == "checked" || $("[con_name]")[i].checked == "true" || $("[con_name]")[i].checked)
                            {
                                obj[proName] = $($("[con_name]")[i]).val()
                            }
                        }
                    }
                    if($(".Validform_wrong").length>0)
                    {
                        return;
                    }
                    if(flag)
                    {
                        flag = false;
                        $.myAjax({
                            type:"POST",
                            url: window.ajaxUrl + "general/area/find",
                            data:{"areaCode":obj.areaCode},
                            success:function(data)
                            {
                                flag = true;
                                // if(data.success == 0 &&　!data.data.length)
                                if(data.success == 0)
                                {
                                    var load = layer.msg("请稍后",{
                                        time:0,
                                        icon:16,
                                        shade:0.1
                                    })
                                    $.myAjax({
                                        type:"POST",
                                        url: window.ajaxUrl + "general/area/create",
                                        data:obj,
                                        success:function(msg)
                                        {
                                            layer.close(load);
                                            if(msg.success === 0)
                                            {
                                                article_submit($(".organ_save"),"添加成功");
                                            }
                                        }
                                    });
                                }
                                else
                                {
                                    $("[con_name=unitName]").parent().siblings().find("span").removeClass("Validform_right").addClass("Validform_wrong");
                                    $("[con_name=unitName]").parent().siblings().find("span").attr("title","数据编码重复");
                                }
                            },
                            error:function()
                            {
                                flag = true;
                            }
                        });
                    }
                }
            });
        }*/

        /*更改错误提示的title*/
        function title(obj,str)
        {
            obj.parent().siblings().attr({"title":str});
        }
        /*弹出框方法*/
        function article_submit(obj,str)
        {
            if(str.indexOf("添加成功")>-1)
            {
                layer.confirm("添加成功",{
                        btn: ['确定'],
                        shade:0.1
                    },
                    function()
                    {
                        suc();
                    },
                    function()
                    {
                        // suc();
                    })
            }
            else if(str.indexOf("操作失败")>-1)
            {
                layer.confirm("操作失败",
                    {
                        shade:0.1
                    },
                    function()
                    {
                        defeat();
                    },
                    function()
                    {
                        defeat();
                        layer.msg("已取消",{icon:5});
                    })
            }
            else if(str.indexOf("相同名称机构")>-1)
            {
                layer.confirm(str,
                    {
                        shade:0.1
                    },
                    function()
                    {
                        defeat();
                    },
                    function()
                    {
                        defeat();
                    })
            }
            $(".layui-anim").removeClass("layui-anim");
        }

        /*操作成功关闭弹出框刷新页面*/
        function suc()
        {
            $(".layui-layer").remove();
            $(".layui-layer-shade").remove();
            parent.window.location.reload();
            $(".layui-layer-shade",parent.document).remove();
            $(".layui-layer",parent.document).remove();
        }

        /*操作失败方法只关闭弹出框*/
        function defeat()
        {
            $(".layui-layer").remove();
            $(".layui-layer-shade").remove();
        }

       /*
       *下拉地区树
       */
        window.setTree({
            ele: ".area",
            url: ajaxUrl + "general/area/findByParentId",
            type: "POST",
            data: {id: 0},
            id: "id",
            value: "areaNameStr",
            //all: "全部",//是否有所有这一级
            treeClick: function (data)
            {
                $("[con_name=areaParentId]").attr("areaParentId",$(this).parent().parent().attr("treeid"));
            }
        });

    });
}(jQuery, window, document));
