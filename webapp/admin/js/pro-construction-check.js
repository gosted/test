/**
 * 本文件是施工方案添加页js文件
 * @author 彭佳明
 */
(function($, w, d){
    'use strict';
    $(function() {
        var areaId = "",id = "",flag = true;
        var tables = $(".table-box>.form-table"),sendData = {};
        window.getTd(tables);
        //动态添加表格
        var workName = parent.window.layerViewData.workName,
            projectName = parent.window.layerViewData.projectName,
            projectId = parent.window.layerViewData.projectId,
            site = parent.window.layerViewData.site,
            type = parent.window.layerViewData.type;
        var constructionId =  parent.window.layerViewData.constructionId;
        $(".contract-box").find(".contractName").val(projectName);
        $(".contract-box").find(".site").val(site||"联通");
        $(".contract-box").find(".contractCode").val(workName);
        sendData.id = constructionId;
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "/project/construction/findById",
            data: sendData,
            dataType: "json",
            success: function(msg)
            {
                if (msg && msg.success === 0)
                {
                    var _data = msg.data;
                    var arr = [
                        "planName",
                        "remark"
                    ];
                    $.each(arr, function (i, v)
                    {
                        var keyVal = _data[v];
                        $(".contract-box").find($('[con_name="' + v + '"]')).val(keyVal);
                    });
                    var ids = msg.data.attachmentId;
                    if (ids)
                    {
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/attachment/findByIds",
                            data: {"ids": ids},
                            success: function (data)
                            {
                                if (data && data.success === 0)
                                {
                                    var needInfo = $(".contract-box");

                                    setData(data,needInfo);
                                }
                            }
                        });
                    }

                }
            }
        });
        function setData (data,beforeBox)
        {
            var list = [],
                fileList = null,
                STr = null;

            fileList = $(".file-list");
            list = data.data;
            fileList.html("");

            $.each(list, function (i, v)
            {
                var img = $("<img />"),
                    button = $("<a class='btn btn-success radius ml-10'><i class='Hui-iconfont'>&#xe6e2</i>删除</a>"),
                    arrImg = [
                        "doc",
                        "ppt",
                        "xls",
                        "zip",
                        "txt",
                        "pdf",
                        "htm",
                        "mp3",
                        "mp4",
                        "png"
                    ],
                    nameArr = [],
                    str = "",
                    type = "unknown",
                    p = $('<p></p>');

                if (v.attachName)
                {
                    nameArr = v.attachName.split(".");
                    str = nameArr[nameArr.length -1];
                }
                else
                {
                    return false;
                }
                p.attr("attachId",v.attachId);
                str = str.substr(0,3);
                $.each(arrImg, function (i, v)
                {
                    if (str.toLowerCase() === v)
                    {
                        type = v;
                    }
                    else if ((str.toLowerCase() === "avi") || (str.toLowerCase() === "wmv"))
                    {
                        type = "mp4";
                    }
                    else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpg"))
                    {
                        type = "png";
                    }
                    else
                    {

                    }
                });
                img.attr("src","../../images/commen/"+ type +".png");
                p.append(img);
                p.append('<span title="点击下载文件" style="cursor: pointer">'+ v.attachName +'</span>');
                p.append(button);
                button.on("click", function ()
                {
                    var _this = $(this),
                        id = $(this).parent().attr("attachId");
                    $.myAjax({
                        type:"POST",
                        url:ajaxUrl + "project/attachment/deleteFileById",
                        data:{"id":id},

                        success:function(data)
                        {
                            if(data.success === 0)
                            {
                                _this.parent().remove();
                            }
                        },
                        error:function(msg)
                        {
                            layer.confirm('删除失败', {
                                btn: ['确定','取消'],
                                shade: 0.1
                            });
                        }
                    });
                });
                fileList.append(p);
            });

            fileList.on("click", "p>span", function ()
            {
                var _this = $(this).parent(),
                    DownLoadFile = function (options)
                    {
                        var config = $.extend(true, { method: 'post' }, options);
                        var $iframe = $('<iframe id="down-file-iframe" />');
                        var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
                        $form.attr('action', config.url);
                        for (var key in config.data) {
                            $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
                        }
                        $iframe.append($form);
                        $(document.body).append($iframe);
                        $form[0].submit();
                        $iframe.remove();
                    };
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "general/attachmentPro/checkIsLogin",
                    data: {},
                    dataType: "json",
                    success: function(data)
                    {
                        if (data && data.success === 0)
                        {
                            DownLoadFile({
                                "url": window.ajaxUrl + "project/attachment/download",
                                "method": "post",
                                "data": {"attachId": _this.attr("attachId")}
                            });
                        }
                    }
                });
            });
        }
        //获取参数
        var getVal = function(sendData)
        {
            $(".providerAdd").find("input").each(function(i,o)
            {
                if($(this).attr("con_name")){
                    sendData[$(this).attr("con_name")] = $(this).val();
                }
            });
            return sendData;
        };
        //提交数据
        $(".table-box").Validform({
            btnSubmit: ".save",
            tiptype:2,
            datatype: {
                "phone": /^((\d{3,4}\-)|)\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/,
                "Post": /^[0-9][0-9]{5}$/
            },
            beforeSubmit:function(curform){
                sendData = getVal({});
                sendData.remark =  $(".textarea").val();
                sendData.type =  type;
                sendData.workOrderId = projectId;
                sendData.id = constructionId;
                var arrP = $(".contract-box").find($(".file-list p")),strId = "";
                if (arrP.size() > 0)
                {
                    $.each(arrP, function (i, v)
                    {
                        strId += "," + $(v).attr("attachId");
                    });
                    strId = strId.substr(1);
                }
                if(strId){
                    sendData.attachmentId = strId;
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "/project/construction/update",
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
                                    function(){
                                        window.parent.location.reload();
                                    });

                            }
                        }
                    });
                }else{
                    layer.confirm('请上传附件',{
                        btn: ['确定'],
                        shade: 0.1
                    });
                }

            },
            callback:function(form){
                return false;
            }
        });
        function getAttach(box,form,attach){
            var uploadFile = box.find(form);
            uploadFile.on("change",function ()
            {
                var _this = this;
                if($(".file-list").find("p").length == 1){
                    layer.confirm('只可上传一个方案',{
                        btn: ['确定'],
                        shade: 0.1
                    });
                }else{
                    fileUpload({
                        ths: _this,
                        msg: "正在上传请稍后",
                        form: box.find(attach),
                        fileList: $(".file-list"),
                        createUrl: "project/attachment/create",//增加地址
                        infoUrl: "project/attachment/createFileInfo",//返回信息地址
                        delUrl: "project/attachment/deleteFileById",//删除的地址
                        sendData: {}
                    });
                }
            });
        }
        getAttach($(".contract-box"),$(".upload-file"),$("#upload"));

    });
}(jQuery, window, document));
