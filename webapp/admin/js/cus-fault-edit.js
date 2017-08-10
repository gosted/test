/**
 *
 * 本文件是编辑故障页面的js文件
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){

        var pageSize = 1000,
            selected = false,
            faultId = window.parent.layerViewData.faultId;

        window.getTd($(".form-table"));
        /*输入资产编号边输入边查找*/
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
                    ind = layer.confirm('请点击选择设备', {
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
                url: window.ajaxUrl + "operation/stockdetail/findVaguelybyStockDetailCode",
                data: {code: _this.val()},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0 )
                    {
                        listBox.children(".list").html("");
                        _this.removeAttr("baseAssetCode");
                        if (data.data && data.data[0])
                        {
                            listBox.children(".list").show();
                            selected = false;
                            for (var i=0, len=data.data.length; i<len; i++)
                            {
                                listBox.children(".list").append('<li id="'+ data.data[i].id +'" baseAssetCode="'+ data.data[i].baseAssetCode +'">'+
                                    data.data[i].stockdetailName
                                    + '(设备分类:' + data.data[i].equipmentName + ')'+'(资产编号:' + data.data[i].baseAssetCode + ')' +'</li>');
                            }
                            listBox.children(".list").on("click", "li", function ()
                            {
                                _this.val($(this).html());
                                _this.attr("baseAssetCode", $(this).attr("baseAssetCode"));
                                listBox.children(".list").hide();
                                _this.blur();
                                selected = true;
                            });

                            $("body").on("click", tipSelect);
                        }
                    }
                }
            });
        });


        /*
         *
         * 请求出回显数据传入工单id
         *
         * */
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl +"operation/faultReporting/findById",//传入工单id
            data: {id:faultId},
            dataType: "json",
            success:function(data)
            {
                var box = $("#roleAdd"),
                    attachmentIds = null;
                setFormInfo(box,data);
                $(".faultTime").val(formatDates(data.data.faultTime));
                $(".reportTime").val(formatDates(data.data.reportTime));
                $(".registrantTime").val(formatDateTimesec(data.data.registrantTime));
                attachmentIds = data.data.attachmentId;
                getFile(attachmentIds);
                getLevel(data.data.faultLevel,$(".faultLevel"));
                getState(data.data.state,$(".state"));

                getProject(data.data.projectId,$(".project"));
                if(data.data.projectId)
                {
                    getSite(data.data.site,data.data.projectId,$(".worksite"));
                    subProject(data.data.subProjectId,data.data.projectId,$(".subProject"));
                }

                $("[con_name='faultPhenomenon']").keyup();
                $("[con_name='incidence']").keyup();
                $('[con_name="remark"]').keyup();
                $("[con_name='faultEquipment']").attr("baseAssetCode",data.data.assetCode)
            }

        })

       /*
       * 查询字典项 获取故障登记
       *
       * */

        function getLevel(level,content)
        {
            $.myAjax({
                type:"POST",
                url:window.ajaxUrl + "general/dictionary/findDictionary",
                data: {"dictCode":"GZDJ"},
                datatype:"json",
                success: function (msg) {
                    if (msg && msg.success === 0) {
                        $.each(msg.data, function (i, v) {
                            var option = $('<option value="' + v.dictCodeValue + '"></option>');
                            option.text(v.dictCodeName || "");
                            content.append(option);
                        });
                        content.children('[value="' +level+ '"]').attr("selected", "true");
                    }
                }
            });
        }

        /*
         * 查询字典项 获取故障状态
         *
         * */

        function getState(state,content)
        {
            $.myAjax({
                type:"POST",
                url:window.ajaxUrl + "general/dictionary/findDictionary",
                data: {"dictCode":"GZZT"},
                datatype:"json",
                success: function (msg) {
                    if (msg && msg.success === 0) {
                        $.each(msg.data, function (i, v) {
                            var option = $('<option value="' + v.dictCodeValue + '"></option>');
                            option.text(v.dictCodeName || "");
                            content.append(option);
                        });
                        content.children('[value="' +state+ '"]').attr("selected", "true");
                    }
                }
            });
        }

        /*
         * 请求附件信息
         * */
        function getFile(ids) {
            if(ids == null || ids == undefined || ids == "")
            {

            }
            else
            {
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/attachment/findByIds",
                    data: {ids: ids},
                    success: function (msg) {
                        if (msg && msg.success === 0) {
                            var attachm = msg.data,
                                List="";
                            $.each(attachm, function (i, data) {
                                var plantype = data.attachName,  //文件名称
                                    index = plantype .lastIndexOf(".");
                                plantype  = plantype .substring(index + 1, plantype .length);

                                var planimg;
                                //判断文档类型
                                function planpic() {
                                    if (plantype == "doc" || plantype == "docx") {
                                        planimg = "../../images/commen/doc.png";
                                    }
                                    else if (plantype == "ppt" || plantype == "pptx") {
                                        planimg = "../../images/commen/ppt.png";
                                    }
                                    else if (plantype == "xls" || plantype == "xlsx") {
                                        planimg = "../../images/commen/xlsx.png";
                                    }
                                    else if (plantype == "zip" || plantype == "rar") {
                                        planimg = "../../images/commen/zip.png";
                                    }
                                    else if (plantype == "txt") {
                                        planimg = "../../images/commen/txt.png";
                                    }
                                    else if (plantype == "avi" || plantype == "mp4" || plantype == "wma" || plantype == "rmvb" || plantype == "3GP" || plantype == "flash" || plantype == "rm" || plantype == "mid") {
                                        planimg = "../../images/commen/video.png";
                                    }
                                    else if (plantype == "pdf") {
                                        planimg = "../../images/commen/pdf.png";
                                    }
                                    else if (plantype == "mp3") {
                                        planimg = "../../images/commen/audio.png";
                                    }
                                    else if (plantype == "jpg" || plantype == "png") {
                                        planimg = "../../images/commen/png.png";
                                    }
                                    else {
                                        planimg = "../../images/commen/unknown.png";
                                    }
                                    return planimg;
                                }

                                planpic();

                                List += '<p lastmodified="" attachid="'+data.attachId+'">'+
                                    '<img src="'+planimg+'">'+
                                    '<span style="cursor: pointer">'+data.attachName+'</span>'+
                                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="btn btn-success radius ml-10 del"><i class="Hui-iconfont"></i>删除</a>'+
                                    '</p>'
                            });
                            $(".table-box").find(".file-list").append(List);
                        }
                    }
                })
            }

        }

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
            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                keyVal = _data[key];
                if (keyVal)
                {
                    if (conNames.eq(i).attr("type") === "checkbox")
                    {
                        chkArr = keyVal.split(",");
                        for (var j= 0,len2=keyVal.length; j<len2; j++)
                        {
                            conNames.eq(i).parents(".rolePermis").find('input[value="'+chkArr[j]+'"]').attr("checked","checked");
                        }
                    }
                    else if(conNames.eq(i).attr("type") === "radio")
                    {

                    }
                    else
                    {

                        conNames.eq(i).val(keyVal);


                    }

                }

            }


        }
        /*
         * 请求项目信息 传入项目id:project 以及jq对象元素content
         * */
        function getProject(project,content)
        {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl+"project/project/findProjectAll",
                data: {},
                dataType: "json",
                success: function (msg) {
                    var projectId = null;
                    if (msg && msg.success === 0) {
                        content.append("<option>请选择</option>")
                        $.each(msg.data, function (i, v) {
                            var option = $('<option value="' + v.id + '"></option>');
                            option.text(v.projectName || "");
                            content.append(option);
                        });
                        content.children('[value="' +project+ '"]').attr("selected", "true");
                        /*content.parent("div").attr("projectId",content.val());
                        content.on('change',function(){
                            content.parent("div").attr("projectId",$(this).val());

                        })*/
                    }
                }

            });
        }

        $(".project").on('change',function()
        {
            //$('.project option:selected')
            /*
             * 获取子项目*/
            $.myAjax({
                type: "POST",
                url:window.ajaxUrl +"project/subProject/findByProjectId",
                data: {projectId:$('.project option:selected').val()},
                dataType: "json",
                success: function (msg) {
                    var subProject = $(".subProject");
                    subProject.html("");
                    subProject.append('<option value="">请选择</option>');
                    if (msg && msg.success === 0) {
                        $.each(msg.data, function (i, v) {
                            var option = $('<option value="' + v.id + '"></option>');
                            option.text(v.subprojectName || "");
                            subProject.append(option);
                        });
                    }
                }
            });

            /*
             * 获取工地*/
            $.myAjax({
                type: "POST",
                url:window.ajaxUrl +"project/workSite/findByProjectId",
                data: {projectId:$('.project option:selected').val()},
                dataType: "json",
                success: function (msg) {
                    var worksite = $(".worksite");
                    worksite.html("");
                    worksite.append('<option value="">请选择</option>');
                    if (msg && msg.success === 0) {
                        $.each(msg.data, function (i, v) {
                            var option = $('<option value="' + v.id + '"></option>');
                            option.text(v.worksiteName || "");
                            worksite.append(option);
                        });
                    }
                }
            });
        })

        /*
         * 请求子项目信息传入项目id
         *
         *
         * */
        function subProject(subProjectId,project,content)
        {
            $.myAjax({
                type: "POST",
                url:window.ajaxUrl +"project/subProject/findByProjectId",
                data: {projectId:project},
                dataType: "json",
                success: function (msg) {
                    if (msg && msg.success === 0) {
                        $.each(msg.data, function (i, v) {
                            var option = $('<option value="' + v.id + '"></option>');
                            option.text(v.subprojectName || "");
                            content.append(option);
                        });
                        content.children('[value="' +subProjectId+ '"]').attr("selected", "true");
                    }
                }
            });
        }

        /*
         * 请求工地信息传入项目id
         * */
        function getSite(site,project,content)
        {
            $.myAjax({
                type: "POST",
                url:window.ajaxUrl +"project/workSite/findByProjectId",
                data: {projectId:project},
                dataType: "json",
                success: function (msg) {
                    if (msg && msg.success === 0) {
                        $.each(msg.data, function (i, v) {
                            var option = $('<option value="' + v.id + '"></option>');
                            option.text(v.worksiteName || "");
                            content.append(option);
                        });
                        content.children('[value="' +site+ '"]').attr("selected", "true");
                    }
                }
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
                baseassetcode =null,
                checkboxs = null,
                strId = "",
                arrP = $(".file-list p");
            $.each(arrP, function (i, v)
            {
                strId += "," + $(v).attr("attachId");
            });
            strId = strId.substr(1);
            sendData.attachmentId = strId;

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
            baseassetcode = $("input[con_name='faultEquipment']").attr("baseassetcode")
            sendData.workSiteId = $(".worksite option:selected").val();
            sendData.state = $(".state option:selected").val();
            sendData.subprojectId = $(".subProject option:selected").val();
            sendData.projectId = $(".project option:selected").val();
            sendData.id = faultId;
            sendData.faultEquipment = $("input[con_name='faultEquipment']").val();
            if(baseassetcode == null || baseassetcode == undefined || baseassetcode == "")
            {
                sendData.assetCode = "";
            }
            else
            {
                sendData.assetCode = baseassetcode;
            }
            return sendData;
        }


        $("#table-box").Validform({
            btnSubmit: ".save",
            tiptype:2,
            datatype: {
                "date": /^\d{4}\-\d{2}\-\d{2}$/,
                "phone": /^0\d{2,3}-?\d{7,8}$/
            },
            beforeSubmit:function(curform){
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
                        url: window.ajaxUrl +"operation/faultReporting/update",
                        data: sendData,
                        dataType: "json",
                        success:function(data)
                        {
                            layer.confirm('操作成功', {
                                    btn: ['关闭'],
                                    shade: 0.1

                                },
                                function()
                                {
                                    parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                },
                                function(){
                                    parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗

                                }
                            )
                            $('.layui-anim').removeClass("layui-anim");

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
         *上传文件
         */
        var uploadFile = $(".upload-files");
        uploadFile.on("change",function ()
        {
            var _this = this;
            fileUpload({
                ths: _this,
                msg: "正在上传文件",
                form: $("#upload"),
                fileList: $(".file-list"),
                createUrl: "project/attachment/create",//增加地址
                infoUrl: "project/attachment/createFileInfo",//返回信息地址
                delUrl: "project/attachment/deleteFileById",//删除的地址
                sendData: {}
            });
        });
        /*文件上传结束*/


        /*回显附件删除*/
        $(".file-list").on("click",".del",function ()
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
                }
            });
        });

        //附件下载
        $(".file-list").on("click","span",function ()
        {
            var _this = $(this),
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
                "data": {"attachId": _this.parents("p").attr("attachid")}
            });
        });



    });
}(jQuery, window, document));