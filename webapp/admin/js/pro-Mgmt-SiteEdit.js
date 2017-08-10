/**
 * Created by baozhe  on 2017/3/13.
 * 本文件的是工地编辑页js
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){


        var pageSize = 1000,
            attachmentId = "",
            attachmentName = "",
            hasFile = false,
            areaAlphaCode = "",
            areaId = "",
            uploadFile = $(".upload-file"),
            pageNo = 1,
            worksiteId = parent.window.layerViewData.worksiteId,
            projectId = parent.window.layerViewData.projectId;
        window.getTd($(".form-table"));
        //获取出所有权限数据
        function initTable (obj)
        {
            //请求已有信息
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/workSite/findById",
                data: {"id": worksiteId},
                success: function (data)
                {

                    if (data && data.success === 0)
                    {
                        var box = $("#roleAdd");
                        setFormInfo(box,data);
                        getVale(data.data.areaId)
                    }
                }
            });

        }

        initTable ({pageSize: pageSize, pageNo: pageNo, id: worksiteId});
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
                Names.eq(i).val(keyVal);
                $('[con_name="worksiteRemark"]').keyup();
            }
        }

        function getVale(areaIds){

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
                     * 提交信息
                     */
                    var sendData = {};
                    sendData = getFormInfo(curform);
                    if(areaId == areaIds || areaId == "" )
                    {
                        sendData.areaId = areaIds;
                    }
                    else{
                        sendData.areaAlphaCode = areaAlphaCode;
                        sendData.areaId = areaId;
                    }

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/workSite/update",
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

                },
                callback:function(form){
                    return false;
                }
            });
        }






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
            sendData.id = worksiteId;

            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");


                    keyVal = conNames.eq(i).val();
                    sendData[key] = keyVal;
            }
            return sendData;
        }

       /*
       *
       * 树形结构
       * */

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

                }
                ATemp.shift();
                areaAlphaCode =ATemp.join(",");

            }

        });


    });
}(jQuery, window, document));