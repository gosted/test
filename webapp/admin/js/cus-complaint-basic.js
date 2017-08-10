/**
 *
 * 本文件是投诉登记页面的js文件
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){

        var pageSize = 1000,
            complaintId = window.parent.layerViewData.complaintId;
        window.getTd($(".form-table"));
        /*
         *
         * 请求出回显数据传入工单id
         *
         * */
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl +"operation/complaintRecord/findById",//传入工单id
            data: {id:complaintId},
            dataType: "json",
            success:function(data)
            {
                var box = $("#roleAdd"),
                    attachmentIds = null;
                setFormInfo(box,data);
                $(".complaintTime").text(formatDates(data.data.complaintTime));
                $(".registrantTime").text(formatDateTimesec(data.data.registrantTime));
                attachmentIds = data.data.attachmentId;
                getFile(attachmentIds);
                getLevel(data.data.complaintLevel,$(".complaintLevel"));
                getState(data.data.state,$(".state"));

            }

        })

        /*
         * 查询字典项 获取投诉登记
         *
         * */

        function getLevel(level,content)
        {
            $.myAjax({
                type:"POST",
                url:window.ajaxUrl + "general/dictionary/findDictionary",
                data: {"dictCode":"TSDJ"},
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
                data: {"dictCode":"TSZT"},
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
                                    '<span>'+data.attachName+'</span>'+
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

                        conNames.eq(i).text(keyVal);


                    }

                }

            }


        }



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