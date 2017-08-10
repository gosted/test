/**
 * 本文件是合作伙伴添加文件
 * @author 彭佳明
 */

(function($, w, d){
    'use strict';

    $(function() {
        var areaId = "",sendData = {},selected = false,id="",equId = "",specifications="",subId = "",siteId = "",subName = "",proId = "";
        var tables = $(".table-box>.form-table");
        var workName = parent.window.layerViewData.workName,
            projectName = parent.window.layerViewData.projectName,
            projectId = parent.window.layerViewData.projectId,
            site = parent.window.layerViewData.site;
        window.getTd(tables);
        $(".providerAdd").find(".partnerName").val(projectName);
        $(".providerAdd").find(".workSite").val(site||"联通");
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
                    }
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
                                    $(".subProject").val(data.data.subprojectName)
                                }

                            }
                        })
                    }
                }
            });

        };
        getType();
        $(".list-box input").on("input propertychange",function ()
        {
            var _this = $(this),
                listBox =_this.parents(".list-box");

            function tipSelect(e)
            {
                var evnt = e || window.event,
                    tar = $(evnt.target),
                    ind = "";

                if (!selected && tar.parents(".list-box").size() === 0
                    && tar.parents(".layui-layer-setwin").size() === 0
                    && tar.parents(".layui-layer-btn").size() === 0)
                {
                    ind = layer.confirm('请点击选择编号', {
                            btn: ['确定', '取消'],
                            shade: 0.1
                        },
                        function ()
                        {
                            layer.close(ind);
                        },
                        function ()
                        {
                            layer.msg('已取消', {icon:5,time:1000});
                            $(".list-box").children(".list").hide();
                            selected = true;
                            _this.val("");
                            _this.blur();
                        });
                }
            }

            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/assetRegistration/findByCodeVague",
                data: {assetCode: _this.val(),subProjectId:subId,
                site:siteId},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        listBox.children(".list").html("");
                        _this.removeAttr("user_id");
                        if (data.data && data.data[0])
                        {
                            listBox.children(".list").show();
                            selected = false;
                            for (var i=0, len=data.data.length; i<len; i++)
                            {
                                listBox.children(".list").append('<li style="height:30px;line-height:30px;" user_id="'+ data.data[i].assetCode +'">(<span class="assetCo">'+ data.data[i].assetCode +'</span>) ('+data.data[i].deviceCode+') (名称:'+data.data[i].assetName+')</li>');
                            }
                            listBox.children(".list").on("click", "li", function ()
                            {
                                _this.val($(this).find(".assetCo").html());
                                _this.attr("user_id", $(this).attr("user_id"));
                                listBox.children(".list").hide();
                                _this.blur();
                                selected = true;
                            });

                            //$("body").on("click", tipSelect);
                        }
                    }
                }
            });
        });
        $("body").on("click", function(){
            $(".list").hide();
        });
        $(".searchCode").on("click",function(){
            $(".list").hide();
            var data = {};
            data.assetCode = $(".assetCode").val();
            data.subProjectId = subId;
            data.site = siteId;
            if($(".assetCode").val() == ""){
                layer.confirm('请输入资产编号', {
                        btn: ['确定'],
                        shade: 0.1
                 });
            }else{
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/assetRegistration/findByCode",
                    data: data,
                    dataType: "json",
                    success: function(msg)
                    {
                        if (msg && msg.success === 0)
                        {
                            var msg = msg.data;
                            id = msg[0].id;
                            equId = msg[0].equipmentId;
                            $(".assetName").val(msg[0].assetName);
                            $(".assetCategory").val(msg[0].equipmentName);
                            $(".assetCode1").val(msg[0].assetCode);
                            $(".companyCode").val(msg[0].companyCode);
                            $(".assetStatus").val(msg[0].assetStatusName);
                            specifications = msg[0].specifications;
                        }
                    }
                });
            }

        });
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
                sendData.registationId = id;
                sendData.equipmentId = equId;
                sendData.specifications = specifications;
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
                    url: window.ajaxUrl + "/project/assetRegistration/createTracking",
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
