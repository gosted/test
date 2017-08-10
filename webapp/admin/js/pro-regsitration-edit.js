/**
 * 本文件是合作伙伴添加文件
 * @author 彭佳明
 */

(function($, w, d){
    'use strict';

    $(function() {
        var areaId = "",sendData = {},selected = false,id="",equId = "",specifications="";
        var tables = $(".table-box>.form-table");
        var workName = parent.window.layerViewData.workName,
            projectName = parent.window.layerViewData.projectName,
            projectId = parent.window.layerViewData.projectId,
            site = parent.window.layerViewData.site;
        var regsiterId = parent.window.layerViewData.regsiterId;
        var equipmentId = parent.window.layerViewData.equipmentId;
        window.getTd(tables);
        $(".providerAdd").find(".partnerName").val(projectName);
        $(".providerAdd").find(".site").val(site||"联通");
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "/project/assetRegistration/findTrackingById",
            data: {id: regsiterId},
            dataType: "json",
            success: function(data)
            {
                if (data && data.success === 0) {
                    var _data = data.data, ids = "";
                    var arr = [
                        "assetName",
                        "assetCode",
                        "companyCode",
                        "assetStatusName",
                        "remark"
                    ];
                    $(".assetCategory").val(_data.equipmentName||"AP");
                    var attrackData = JSON.parse(_data.assetTrackInfos);
                    $(".assetCategory").val(_data.equipmentName);
                    $(".assetCode1").val(_data.assetCode);
                    $(".companyCode").val(_data.companyCode);
                    $(".assetStatus").val(_data.assetStatusName);
                    $(".remark").val(_data.remark);
                    specifications = _data.specifications;
                    id = _data.id;
                    if(attrackData){
                        $(".assetPosition").val(attrackData.assetPosition);
                        $(".installPeople").val(attrackData.installPeople);
                        $(".installTime").val(attrackData.installTime||"");
                    }else{}

                    //请求附件信息
                    ids = _data.relatedAttachId;
                    if (ids) {
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/attachment/findByIds",
                            data: {"ids": ids},
                            success: function (data) {
                                if (data && data.success === 0) {
                                    var needInfo = $(".providerAdd");
                                    setData(data, needInfo);
                                }
                            }
                        });
                    }
                    $.each(arr, function (i, v) {
                        var keyVal = _data[v];

                        if (!(keyVal === null || keyVal === "")) {
                            $('[con_name="' + v + '"]').val(keyVal);
                        }
                    });
                }
            }
        });
        //回显附件
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
                p.append(button);
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
                DownLoadFile({
                    "url": window.ajaxUrl + "project/attachment/download",
                    "method": "post",
                    "data": {"attachId": _this.attr("attachId")}
                });
            });
        }
        //获取参数值
        function getValData (obj)
        {
            var data = {},
                box = $(obj.ele),
                arr = obj.arr;

            for (var i = 0, len = arr.length; i < len; i++)
            {
                if (arr[i])
                {
                    data[arr[i]] = box.find('[con_name="'+ arr[i] +'"]').val();
                }
            }
            return data;
        }
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
        var subId = "",siteId = "",proId="",subName="";
        function getType()
        {
            $.myAjax({
                type: "GET",
                url: window.ajaxUrl +"project/workOrder/findWorkOrder/"+projectId, //传入工单id
                data: {},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        subId = data.data.subProject;
                        siteId = data.data.site;
                        proId = data.data.project;
                        if( data.data.subProject ){
                            $.myAjax({
                                type:"POST",
                                url:window.ajaxUrl +"project/subProject/findByProjectId",
                                data:{id:data.data.subProject},
                                datatype:"json",
                                success:function(data)
                                {
                                    if(data.data && data.success === 0)
                                    {
                                        subName = data.data.subprojectName;
                                    }

                                }
                            })
                        }
                    }
                }
            });

        };
        getType();

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
                sendData.relativeId = projectId;
                sendData.subProject = subId;
                sendData.siteId = siteId;
                sendData.registationId = id;
                sendData.equipmentId = equipmentId;
                sendData.specifications = specifications;
                sendData.id = id;
                var data = {assetPosition:$(".assetPosition").val(),installPeople:$(".installPeople").val(),installTime:$(".installTime").val(),projectName:projectName,projectId:proId,subProjectName:subName,subProjectId:subId,workSiteName:site,siteId:siteId};
                sendData.assetTrackInfos = JSON.stringify(data);
                sendData.remark = $(".remark").val();
                var arrP = $(".providerAdd").find($(".file-list p")),strId = "";
                if (arrP.size() > 0)
                {
                    $.each(arrP, function (i, v)
                    {
                        strId += "," + $(v).attr("attachId");
                    });
                    strId = strId.substr(1);
                }
                if(strId){
                    sendData.relatedAttachId = strId;
                }
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "/project/assetRegistration/updateTracking",
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
                            $(document).on("click",".layui-layer-close",function(){
                                window.parent.location.reload();
                            })

                        }
                    }
                });
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

            });
        }
        getAttach($(".providerAdd"),$(".upload-file"),$("#upload"));
    });
}(jQuery, window, document));
