/**
 * 本文件的查看工作详情页js文件
 *@ author 鲍哲
 */

(function($, w, d){
    'use strict';

    $(function() {
        var pageSize = 10,
            pageNo = 1;
        $.Huitab("#tab-category .tabBar span","#tab-category .tabCon","current","click","0");


        var workRecordId = parent.window.layerViewData.workRecordId,

        reqSupType = parent.window.layerViewData.reqSupType; //判断支撑类型所需字段
        window.getTd($(".form-table"))
        //请求基本信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "preSupport/record/findById",
            data: {id:workRecordId},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    var conName = $('[con_name]'),
                        _data = data.data,
                        i = 0,
                        len = conName.size(),
                        key = "";
                    var attachmentId = _data.attachmentId;
                    var id = $("#work_model").attr("ids",attachmentId);
                    var ids = $("#work_model").attr("ids");
                    for (i; i<len; i++)
                    {
                        key = conName.eq(i).attr("con_name");
                        conName.eq(i).html(_data[key]);
                        if(key == "recordStartTime")
                        {
                            if(_data[key] == "" || _data[key] == null)
                            {
                                $('.recordStartTime').html(" ");
                            }
                            else
                            {

                                var  date = new Date(_data[key]);
                                var  recordStartTime = formatDate(date);
                                $('.recordStartTime').html(recordStartTime);
                            }

                        }
                        else if(key == "customerId")
                        {
                            if(_data[key] == "" || _data[key] == "null")
                            {
                                $('.customerId').html("");
                            }
                            else
                            {

                                $('.customerId').html(_data[key]);
                            }

                        }
                        else if(key == "recordWorkload")
                        {
                            $('.customerId').text(_data[key]);

                        }
                        else if(key == "recordEndTime")
                        {
                            if(_data[key] == "" ||_data[key] == null)
                            {
                                $('.recordEndTime').html("");
                            }
                            else
                            {

                                var  date = new Date(_data[key]);
                                var  recordEndTime = formatDate(date);
                                $('.recordEndTime').html(recordEndTime);
                            }

                        }
                        else if(key == "recordContractTime")
                        {
                            if(_data[key] == "" ||_data[key] == null)
                            {
                                $('.recordContractTime').html("");
                            }
                            else
                            {

                                var  date = new Date(_data[key]);
                                var  recordContractTime = formatDate(date);
                                $('.recordContractTime').html(recordContractTime);
                            }

                        }
                        else if(key == "recordIsSupport")
                        {
                            if(_data[key] == "0" )
                            {

                                $('.recordIsSupport').html("是");


                            }
                            else if(_data[key] =="1")
                            {
                                $('.recordIsSupport').html("否");

                            }
                            else
                            {
                                $('.recordIsSupport').html("")
                            }

                        }

                        if(reqSupType == "0")
                        {
                            if(key == "recordContractState")
                            {
                                if(_data[key] == "HT-09" )
                                {
                                    $('.recordContractState').html("已签订");
                                    $(".contract-date").html("合同日期：");
                                    $(".contract-money").html("合同金额（元）：");
                                }
                                else if(_data[key] =="HT-00")
                                {
                                    $('.recordContractState').html("未签订");
                                    $(".contract-date").html("预计签订日期：");
                                    $(".contract-money").html("预计金额（元）：");
                                }
                                else
                                {
                                    $('.recordContractState').html("签订中")
                                    $(".contract-date").html("预计签订日期：");
                                    $(".contract-money").html("预计金额（元）：");
                                }

                            }
                        }
                        else{
                            $(".contract").remove();
                        }

                    }


                if(data.data.attachmentId == "" || data.data.attachmentId == "null")
                {
                    $('.file-tr').css({"display": "none"});
                }
                else{
                    //请求附件信息
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "preSupport/attachment/findByIds",
                        data: {"ids":ids},
                        success: function (data)
                        {
                            if (data && data.success === 0)
                            {
                                var file = $('.file-tr')
                                setTable(data,file);
                            }
                        }
                    });
                    }


                    //请求附件信息


                    $(".btns-group").find("button").on('click',function()
                    {
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.window.location.replace(parent.window.location.href);
                        parent.layer.close(index);
                    })



                }
            }
        });

        /*
         * 渲染表格方法传入请求到的数据和在哪个tr后插入
         * */
        function setTable (data,beforeBox)
        {
            var list = [],
                _files = $('<tr class="files">'+
                    '<td class="table-key" colspan="4">附件：</td>'+
                    '<td colspan="36" class="file-list"></td>'+
                    '</tr>'),
                fileList = null,
                STr = null;

            fileList = _files.find(".file-list");
            list = data.data;
            fileList.html("");

            $.each(list, function (i, v)
            {
                var img = $("<img />"),
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
                    else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpe"))
                    {
                        type = "png";
                    }
                    else
                    {

                    }
                });
                img.attr("src","../../images/commen/"+ type +".png");
                p.append(img);
                p.append('<span title="点击下载文件">'+ v.attachName +'</span>');
                fileList.append(p);
                if (beforeBox.parents("table").find(".files").size() === 0)
                {
                    beforeBox.after(_files);
                }
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
                    url: window.ajaxUrl + "preSupport/attachment/checkIsLogin",
                    data: {},
                    dataType: "json",
                    success: function(data)
                    {
                        if (data && data.success === 0)
                        {
                            DownLoadFile({
                                "url": window.ajaxUrl + "preSupport/attachment/findFileData",
                                "method": "post",
                                "data": {"attachId": _this.attr("attachId")}
                            });
                        }
                    },
                    error: function (err)
                    {
                        layer.confirm('下载失败', {
                            btn: ['确定'],
                            shade: 0.1
                        });
                        $('.layui-anim').removeClass("layui-anim");
                    }
                });
            });
        }


    });
}(jQuery, window, document));
