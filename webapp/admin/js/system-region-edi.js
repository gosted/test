/**
 * 本文件的功能是地区管理编辑js文件
 *@ author 李明
 */

(function($, w, d){
    'use strict';

    $(function() {
        var id = parent.window.layerViewData.libId,
            areaParentId = parent.window.layerViewData.areaParentId;
        var table = $(".table");
        var flag = true;      //是否第一次加载页面判断树的数据加载
        var unitName = "";
        window.getTd(table);
        var saveBtn = ".organ_save";
        //verifyForm($(".table-box"),saveBtn);
        //$("[con_name=areaParentId]").attr("areaParentId",id);


        //请求已有信息
        $.myAjax({
            type: "POST",
            url: ajaxUrl + "general/area/findById",
            data: {id:id},
            success: function (data)
            {

                if (data && data.success === 0)
                {
                    var box = $(".table-box");
                    var areaCode = $(".table-box").attr("areaCode",data.data.areaCode);
                    setFormInfo(box,data);

                }
            }
        });

        /*
         * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
         * */
        function setFormInfo (box,data)
        {
            var box = $(".table-box"),
                conNames = box.find('[con_name]'),
                Names = box.find('[name]'),
                _data = data.data,
                key = "",
                keyVal = "",
                areaVal = "",
                areaStr = "",
                parVal = "",
                _radio = null,
                chkArr = [],
                date = "";
            for (var i = 0, len=Names.size(); i<len; i++)
            {
                key = Names.eq(i).attr("name");
                keyVal = _data[key];
                Names.eq(i).val(keyVal);
              if( key == "areaName")
              {
                  areaVal = _data[key];
                  areaStr = areaVal.split("/");
                  areaStr = areaStr[areaStr.length-1]
                  console.log("areaStr",areaStr);
                  Names.eq(i).val(areaStr);
              }
                if(key == "areaParentId")
                {
                    parVal = areaVal.split("/");
                    parVal.pop();
                    Names.eq(i).val(parVal.join("/"));
                    Names.eq(i).attr("areaParentId",_data[key])
                }



            }

        }

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


        /*
         * 判断名称唯一性和编码唯一性
         * */



        $("[con_name='areaCode']").on("blur",function()
        {

            if( $("[con_name='areaCode']").val() == $('.table-box').attr("areaCode"))
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
                        url:window.ajaxUrl + "general/area/find",
                        data:{"areaCode":$(this).val()},
                        success:function(msg)
                        {
                            console.log(msg)
                            if(msg.success === 0)
                            {
                                if(msg.data == null || msg.data == "")
                                {
                                    if($(".areaCode ").hasClass("Validform_error")){
                                        _this.parent().siblings().attr("title","请正确输入1至20位数字的数据");
                                        _this.parent().siblings().html("<span class='Validform_checktip Validform_wrong'></span>");

                                    }else{
                                        _this.parent().siblings().attr("title","编码可用");
                                        _this.parent().siblings().html("<span class='Validform_checktip Validform_right'></span>");
                                    }
                                }
                                else
                                {

                                    _this.parent().siblings().html("<span class='Validform_checktip Validform_wrong'></span>");
                                    _this.parent().siblings().attr("title","编码已经存在");
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
                        url: window.ajaxUrl + "general/area/update",
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
                sendData.id = id;

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


      /*
        /!*表单验证提交方法*!/
        function verifyForm(formName,verifyClass)
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
                    var obj = {};
                        obj.id = id;
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

                    }
                    if($(".Validform_wrong").length>0)
                    {
                        return;
                    }
                    // obj.areaParentId = id;
                    if(flag)
                    {
                        flag = false;
                        if(unitName == obj.unitName && areaParentId == obj.areaParentId)
                        {
                            var load = layer.msg("请稍后",{
                                time:0,
                                icon:16,
                                shade:0.1
                            })
                            $.myAjax({
                                type:"POST",
                                url:window.ajaxUrl + "general/area/update",
                                data:obj,
                                success:function(msg)
                                {
                                    layer.close(load);
                                    if(msg.success === 0)
                                    {
                                        article_submit($(".organ_save"),"编辑成功");
                                    }
                                },
                            });
                        }
                        else
                        {

                            $.myAjax({
                                type:"POST",
                                 url:window.ajaxUrl + "general/area/find",
                                data:{"areaName":obj.areaName,"areaParentId":obj.areaParentId},
                                success:function(data)
                                {
                                    flag = true;
                                    if(data.success == 0)
                                    {
                                        var load = layer.msg("请稍后",{
                                            time:0,
                                            icon:16,
                                            shade:0.1
                                        })
                                        $.myAjax({
                                            type:"POST",
                                            url:window.ajaxUrl + "general/unit/update",
                                            data:obj,
                                            success:function(msg)
                                            {
                                                layer.close(load);
                                                if(msg.success === 0)
                                                {
                                                    article_submit($(".organ_save"),"编辑成功");
                                                }
                                            }
                                        });
                                    }
                                    else
                                    {
                                        $("[con_name=unitName]").parent().siblings().find("span").removeClass("Validform_right").addClass("Validform_wrong");
                                        $("[con_name=unitName]").parent().siblings().find("span").attr("title","机构名称重复");
                                    }
                                },
                                error:function()
                                {
                                    flag = true;
                                }
                            });
                        }
                    }
                }
            });
        }*/

        /*弹出框方法*/
        function article_submit(obj,str)
        {
            if(str.indexOf("编辑成功")>-1)
            {
                layer.confirm("编辑成功",
                    {
                        shade:0.1
                    },
                    function()
                    {
                        suc();
                    },
                    function()
                    {
                        suc();
                    })
            }
            else if(str.indexOf("编辑失败")>-1)
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

        /*更改错误提示的title*/
        function title(obj,str)
        {
            obj.parent().siblings().attr({"title":str});
        }
    });
}(jQuery, window, document));
