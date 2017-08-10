/**
 * 本文件的功能是新闻列表详情js文件
 * @ author 李明
 */
(function($, w, d){
    'use strict';

    $(function() {
        var newsId = parent.window.layerViewData.newsId;

        //请求已有信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/news/findById",
            data: {id: newsId},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    var detail = $(".detail");
                    detail.html(data.data.pichText);
                    var ids = data.data.attachId;
                    if (ids)
                    {
                        //请求附件信息
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "general/attachmentPro/findByIds",
                            data: {"ids": ids},
                            success: function (data)
                            {
                                if (data && data.success === 0)
                                {
                                    var needInfo = $(".detail");
                                    setTable(data,needInfo);
                                }
                            }
                        });
                    }
                }
            }
        });
        function setTable (data,beforeBox)
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
                                "url": window.ajaxUrl + "general/attachmentPro/download",
                                "method": "post",
                                "data": {"attachId": _this.attr("attachId")}
                            });
                        }
                    }
                });
            });
        }
    });
}(jQuery, window, document));

