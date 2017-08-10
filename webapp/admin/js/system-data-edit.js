/**
 * 本文件的功能是数据字典编辑js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var libId = parent.window.layerViewData.libId,
            diccode = parent.window.layerViewData.diccode,
            dicname = parent.window.layerViewData.diccode,
            dict = parent.window.layerViewData.dict,
            dictid = parent.window.layerViewData.dictid,
            strData = parent.window.layerViewData.strData;
        //添加40个td
        window.getTd($(".form-table"));
        $(".dictItem").val(dictid);//字典项
        //请求已有信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/dictionary/findByIds",
            data: {"id": libId},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    var box = $("#libAdd");
                    $(".dictParentId").attr("dictParentId",data.data.dictParentId);

                    if(data.data.dictRemarks != null &&  data.data.dictRemarks != ""){
                    	$(".textarea-length").html(data.data.dictRemarks.length);
                    }
                    setFormInfo(box,data);

                    if(data.data.dictState && data.data.dictState == 1){
                        $(".radio_box_jy").attr("checked","checked");//启用禁用
                    }
                    else{
                        $(".radio_box_qy").attr("checked","checked");
                    }
                    if(data.data.dictAllName.indexOf("/")>-1)
                    {
                        var str="";
                        var arr = data.data.dictAllName.split("/");
                        for(var j=0;j<arr.length-1;j++)
                        {
                            str += arr[j] + "/";
                        }
                        str = str.substring(0,str.length-1);
                        $(".dictParentId").val(str);
                    }
                    else
                    {
                        $(".dictParentId").val(str);
                    }

                }
            }
        });

        //树形结构
            window.setTree({
                url: ajaxUrl + "general/dictionary/findTree",
                type: "POST",
                data: {id: dict},
                id: "id",
                value: "dictCodeName",
                treeClick: function ()
                {
                    var _this = $(this),
                        id = _this.parents("li").eq(0).attr("treeId");
                    $(".dictParentId").attr("dictParentId",id);
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "general/dictionary/findByParentId",
                        data: ({
                            dictParentId:id,
                            id:libId
                        }),
                        dataType: "json",
                        success: function (msg) {
                            if (msg && msg.success === 0) {
                                if(msg.data == null || msg.data == ""){

                                }else{
                                    var layers = layer.confirm('树级列表不可选择', {
                                            btn: ['确定'],
                                            shade: 0.1
                                        },
                                        function()
                                        {
                                            var str="";
                                            var arr = strData.split("/");
                                            for(var j=0;j<arr.length-1;j++)
                                            {
                                                str += arr[j] + "/";
                                            }
                                            str = str.substring(0,str.length-1);
                                            $(".dictParentId").val(str);
                                            $(".dictParentId").attr("dictparentid",dict);
                                            layer.close(layers);
                                        });
                                }
                            }
                        }
                    });
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
                if (keyVal || keyVal == 0)
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
            beforeSubmit:function(curform){
               /*
                 * 提交跟踪反馈信息
                 */
                var dictState = $('input[name="dictState"]:checked ').val();
                var dictParentId =  $(".dictParentId").attr("dictParentId");
                var sendData = {};
                sendData.dictCodeName = $(".dictCodeName").val();                              //字典名称
                sendData.dictCode = $(".dictCode").val();                                       //字典代码
                sendData.dictCodeValue = $(".dictCodeValue").val();                           //字典值
                sendData.dictParentId = $(".dictParentId").attr("dictParentId");             //父级字典
                sendData.dictSort = $(".dictSort").val();                                       //排序
                sendData.dictRemarks = $(".dictRemarks").val();                                //备注
                sendData.dictState = $('.dictState input[name="dictState"]:checked ').val();//状态
                sendData.id = libId;

                var majorlist =  $(".major").find("input").val();

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
                        url: window.ajaxUrl + "general/dictionary/update",
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

        //返回
        $(".return").on("click",function(){
            parent.window.location.replace(parent.window.location.href);
        })
    });
}(jQuery, window, document));

