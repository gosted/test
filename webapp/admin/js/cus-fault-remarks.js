/**
 *
 * 本文件是故障备注页的js文件
 *@author 王步华
 */

(function($, w, d) {
    'use strict';
    $(function(){
        var pageSize = 1000,
            uploadFile=$(".upload-file"),
            complainantId = parent.window.layerViewData.faultId,
            state = parent.window.layerViewData.state;
        window.getTd($(".form-table"));

        /****************提交备注开始*****************/

        $.myAjax({
            type:"POST",
            url:window.ajaxUrl + "operation/complaintRecord/findUser",
            data:{},
            success:function(data)
            {
                $("input[con_name='treatPeople']").val(data.data.userRealName);
                $("input[con_name='treatPhone']").val(data.data.userMobilePhone);
            }
        })
        var now = new Date()
        var nowTime =  formatDateTimesec(now);

        $("input[con_name='treatTime']").val(nowTime)
        /*
         * 请求备注状态
         * */
        $.myAjax({
            type:"POST",
            url:window.ajaxUrl + "general/dictionary/findDictionary",
            data: {"dictCode":"GZZT"},
            datatype:"json",
            success:function(data)
            {
                var select = $(".state"),
                    list = null,
                    Str = null;

                if(data && data.success === 0)
                {
                    list = data.data;
                    $.each(list,function(i,v){
                        Str += '<option value="'+v.dictCodeValue+'">'+ v.dictCodeName+'</option>'
                    })
                    select.append(Str)
                    if(state != "" || state!= null){
                        $(".state option[value='"+state+"']").attr("selected",true);
                    }
                }
            }
        })

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
                    var sendData = {},
                        strId = "",
                        arrP = $(".file-lists p"),
                        str="";
                    $.each(arrP, function (i, v)
                    {
                        strId += "," + $(v).attr("attachId");
                    });
                    strId = strId.substr(1);

                    sendData = getFormInfo(curform);
                    sendData.reportId = complainantId;
                    sendData.attachmentId = strId;
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "operation/faultTreatment/create",
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
                                    location.reload();
                                    //parent.parent.window.location.replace(parent.parent.window.location.href);
                                },
                                function()
                                {
                                    location.reload();
                                    //parent.parent.window.location.replace(parent.parent.window.location.href);
                                }
                            )
                        }
                    });
                }

            },
            callback:function(form){
                return false;
            }
        });
        /****************提交备注结束*****************/
        /****************回显备注开始*****************/
            //请求数据
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl +"operation/faultTreatment/find",
            data: {reportId:complainantId},
            dataType: "json",
            success: function(data)
            {
                var dataList =  data.data;

                if(dataList !="" || dataList != null){
                    $.each(dataList,function (i,v) {
                        var contain = $("<table border='' cellspacing='' cellpadding='' class='form-table table table-border table-bordered table-bg'></table>");
                        window.getTd(contain);

                        if (v.attachmentId != undefined || v.attachmentId != null || v.attachmentId != "") {
                            var str = "<tr><td colspan='5' class='table-key'>处理人：</td><td colspan='15'>" + dataList[i].treatPeople + "</td><td colspan='5' class='table-key'>联系方式：</td><td colspan='15'>" + dataList[i].treatPhone + "</td></tr>" +
                                "<tr><td colspan='5' class='table-key'>处理时间：</td><td colspan='15'>" + window.formatDateTimesec(dataList[i].treatTime) + "</td><td colspan='5' class='table-key'>状态：</td><td colspan='15'>" + dataList[i].result + "</td></tr>" +
                                "<tr><td colspan='5' class='table-key'>备注：</td><td colspan='35'>" + dataList[i].remark + "</td></tr><tr><td class='table-key' colspan='5'>附件：</td><td colspan='35' class='formControls file-list'></td></tr>";
                        }
                        else {
                            var str = "<tr><td colspan='5' class='table-key'>处理人：</td><td colspan='15'>" + dataList[i].treatPeople + "</td><td colspan='5' class='table-key'>联系方式：</td><td colspan='15'>" + dataList[i].treatPhone + "</td></tr>" +
                                "<tr><td colspan='5' class='table-key'>处理时间：</td><td colspan='15'>" + window.formatDateTimesec(dataList[i].treatTime) + "</td><td colspan='5' class='table-key'>状态：</td><td colspan='15'>" + dataList[i].result + "</td></tr>" +
                                "<tr><td colspan='5' class='table-key'>备注：</td><td colspan='35'>" + dataList[i].remark + "</td></tr>";
                        }

                        contain.append(str);
                        $(".remarkLIst").append(contain);
                        if (v.attachmentId != undefined || v.attachmentId != null || v.attachmentId != "") {
                            fileDate(v.attachmentId, contain);
                        }
                        if (contain.index() % 2 == 1) {
                            contain.addClass("bluebg");
                        }
                        $(".bluebg").find(".table-key").css({"background": "#e0efff"});
                    })

                }
            }
        });

        function fileData(data,contain)
        {
            var fileList = contain.find(".file-list");
            var arr = data.data;
            for(var i=0;i<arr.length;i++)
            {
                var img = $("<img />"),
                    fileName = arr[i].attachName,
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
                        "png",
                    ],
                    p = $('<p></p>'),
                    type="unknown",
                    nameArr = fileName.split("."),
                    str = nameArr[nameArr.length -1],
                    str = str.substr(0,3);
                p.attr("attachId",arr[i].attachId);
                $.each(arrImg, function (i, v)
                {
                    if (str.toLowerCase() === v)
                    {
                        type = v;
                        return false;
                    }
                    else if ((str.toLowerCase() === "avi") || (str.toLowerCase() === "wmv"))
                    {
                        type = "mp4";
                        return false;
                    }
                    else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpg"))
                    {
                        type = "png";
                        return false;
                    }
                    else
                    {

                    }
                });
                img.attr("src","../../images/commen/"+ type +".png");
                p.append(img);
                p.append('<a class="downfile" title="点击下载文件">'+ fileName +'</a>');
                fileList.on("click", ".downfile", function ()
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
                fileList.append(p);
            }
        }

        function fileDate(id,contain)
        {
            $.myAjax(
                {
                    type:"POST",
                    url:window.ajaxUrl + "project/attachment/findByIds",
                    data:{"ids":id},
                    success:function(data)
                    {
                        if(data.success === 0)
                        {
                            if (data && data.success === 0)
                            {
                                var attachid = "";
                                for(var i=0;i<data.data.length;i++)
                                {
                                    attachid += data.data[i].attachId + ",";
                                }
                                attachid = attachid.substring(0,attachid.length-1);
                                $(".attachId").attr("attachid",attachid);
                                fileData(data,contain);
                            }
                        }
                    }
                });
        }



        /****************回显备注结束*****************/

        /****************通用方法*****************/
        /*
         * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
         * */
        function setFormInfo (box,data)
        {
            var conNames = box.find('[con_name]'),
                _data = data.data,
                dttrlist = "",
                key = "",
                keyVal = "",
                _radio = null,
                chkArr = [],
                date = "";
            if(_data.contractCustom != null || _data.contractCustom != ""){
                dttrlist = (_data.contractCustom).replace('\"', '"');
            }

            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                keyVal = _data[key];
                if (keyVal || "0")
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
        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
         * */
        function getFormInfo (box)
        {
            var conNames =$(".table-box").find('[con_name]'),
                key = "",
                keyVal = "",
                sendData = {},
                checkbox = null;

            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                if (conNames.eq(i).attr("type") === "radio")
                {

                }
                else
                {
                    keyVal = conNames.eq(i).val();
                }
                sendData[key] = keyVal;
            }
            return sendData;
        }
        /*
         *上传文件
         */
        uploadFile.on("change",function ()
        {
            var _this = this;
            fileUpload({
                ths: _this,
                msg: "正在上传文件",
                form: $("#upload"),
                fileList: $(".file-lists"),
                createUrl: "project/attachment/create",//增加地址
                infoUrl: "project/attachment/createFileInfo",//返回信息地址
                delUrl: "project/attachment/deleteFileById",//删除的地址
                sendData: {}
            });
        });
        /*文件上传结束*/

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