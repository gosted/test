/**
 * Created by baozhe  on 2017/3/15.
 * 本文件的是工地添加页js
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){

        var worksiteId = parent.window.layerViewData.worksiteId,
            projectId = parent.window.layerViewData.projectId,
            pageSize = 1000,
            pageNo = 1,
            attachmentId = "",
            areaId = "",
            areaAlphaCode = "",
            attachmentName = "";
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

                STr =$('<div class="col-12 role-check">' +
                    '<label class="col-12 parent_check"><input class="radio_box_open" type="checkbox" >'+i+'<img src="../../images/commen/arro_down.png"></label></div>');

                $.each(v,function(j,k)
                {
                    $.each(k,function(m,n){
                        if(m == "authName")
                        {
                            checkbox = $('<label for="check" style="display: inline-block" class="col-2 child-check"><input class="check " type="checkbox" id="rolePermis-1" con_name="roleAuths" name="rolePermis"  value="'+ k.id +'" >'+ n +'</label>');

                        }
                    })
                    STr.append(checkbox);

                })


                rolePermis.append(STr);



            });

        }
        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
         * */
        function getFormInfo (box)
        {

            var conNames = box.find('[con_name]'),
                key = "",
                keyVal = "",
                sendData = {},
                checkboxs = null;
            sendData.projectId = projectId;
            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");

                    keyVal = conNames.eq(i).val();
                    sendData[key] = keyVal;

            }
            return sendData;
        }


        $("#table-box").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            datatype: {
                "area": /\/+/,
                "date": /^\d{4}\-\d{2}\-\d{2}$/,
                "phone": /^0\d{2,3}-?\d{7,8}$/
            },
            beforeSubmit:function(curform){

                /*
                 * 提交新建角色信息
                 */

                    var sendData = {};
                    sendData = getFormInfo(curform);
                    sendData.areaId = areaId;
                    sendData.areaAlphaCode = areaAlphaCode;
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/workSite/create",
                        data: sendData,
                        dataType: "json",
                        success: function(data)
                        {
                            if (data && data.success === 0)
                            {
                                layer.confirm('提交成功', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    },
                                    function()
                                    {
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    },
                                    function(){
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗

                                    })


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
            },
            callback:function(form){
                return false;
            }
        });


        //树形结构
        window.setTree({
            url: window.ajaxUrl + "general/area/findByParentId",
            type: "POST",
            data: {id: 0},
            id: "id",
            value: "areaNameStr",
            attr:["areaAlphaCode"],
            treeClick: function ()
            {
                var _this = $(this),
                    id = _this.parents("li").eq(0).attr("treeId"),
                    OLi = _this.parents("li"),
                    ATemp = [];
                if (_this.hasClass("all"))
                {
                    areaId = _this.parents("li").eq(0).attr("allId");
                }
                else
                {
                    areaId = id;
                }
                for (var i = OLi.size() - 1; i >= 0; i--)
                {
                    ATemp.push(OLi.eq(i).attr("areaAlphaCode"));
                    console.log("333",ATemp);

                }
                ATemp.shift();
                areaAlphaCode =ATemp.join(",");

            }

        });





    });
}(jQuery, window, document));