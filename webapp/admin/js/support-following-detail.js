/**
 * 本文件的跟踪详情页js文件
 *@ author 鲍哲
 */

(function($, w, d){
    'use strict';

    $(function() {
        var pageSize = 10000,
            pageNo = 1,
            reqId = parent.window.layerViewData.reqId,
            reqSupType = parent.window.layerViewData.reqSupType, //判断支撑类型所需字段
            taskId = parent.window.layerViewData.taskId;

        function setTable (data,beforeBox)
        {
            var list = [],
                _files = $('<tr class="files">'+
                    '<td class="table-key" colspan="5">附件：</td>'+
                    '<td colspan="35" class="file-list"></td>'+
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

        $.myAjax(
            {
                type:"POST",
                url:window.ajaxUrl + "preSupport/track/findPage",
                data:{"pageNo":pageNo,"pageSize":pageSize,"requirementId":reqId},
                success:function(data)
                {
                    if(data.success == 0)
                    {
                        var list = data.data.result;
                        $.each(list, function(i,v)
                        {
                            var contain = $('<table  class="form-table table table-border table-bordered table-bg" id="form-table"></table>');
                            var tr = $("<tr></tr>");
                            var tr1 =  $("<tr></tr>");
                            var tr2 =  $("<tr></tr>");
                            var tr3 =  $("<tr></tr>");
                            var tr4 =  $("<tr></tr>");
                            var tr5 =  $("<tr></tr>");
                            var tr7 =  $("<tr></tr>");

                            //发起人
                            var content1 = '<td class="table-key"  colspan="5">发起人：</td>'+
                                '<td colspan="10">'+ v.trackSpRealName+'</td>';

                            //发起时间
                            if( v.trackSpTime == "" || v.trackSpTime == "null" )
                            {
                                v.trackSpTime = "";
                                var content2 = '<td class="table-key" colspan="5">发起时间：</td>' +
                                    '<td  colspan="8"  >'+ v.trackSpTime+'</td>';
                            }
                            else
                            {
                                var newDate = v.trackSpTime;
                                //var  _date = new Date(newDate);
                                var  trackSpTime = formatDateTimesec(newDate);
                                var content2 = '<td class="table-key" colspan="5"> 发起时间：</td>' +
                                    '<td colspan="8"    >'+ trackSpTime +'</td>';
                            }
                            var content3 = '<td class="table-key" colspan="5">跟踪内容：</td>' +
                                '<td colspan="35"   >'+ v.trackSpContent+'</td>';
                            //回复时间
                            if(v.trackReTime == "" || v.trackReTime == null)
                            {
                                v.trackReTime = "";
                                var content5 = '<td class="table-key" colspan="5">回复时间：</td>' +
                                    '<td colspan="20"   >'+ v.trackReTime+'</td>';
                            }
                            else
                            {
                                var newDate = v.trackReTime;
                                //var  _date = new Date(newDate);
                                var  trackReTime = formatDateTimesec(newDate);
                                var content5 = '<td class="table-key"  colspan="5"> 回复时间：</td>' +
                                    '<td     colspan="20">'+ trackReTime+'</td>';
                            }
                            //回复人
                            if(v.trackReRealName == "" || v.trackReRealName == null)
                            {
                                v.trackReRealName = "";
                                var content4 = '<td class="table-key" colspan="5">回复人：</td>' +
                                    '<td  colspan="10">'+ v.trackReRealName +'</td>';
                            }
                            else
                            {
                                var content4 = '<td class="table-key" colspan="5">回复人：</td>' +
                                    '<td  colspan="10">'+ v.trackReRealName +'</td>';
                            }

                            if(v.attachmentId == null || v.attachmentId == "")
                            {

                            }
                            else{
                                //存放附件列表的容器
                                var contentFile ='<td class="table-key" colspan="5">附件：</td>' +
                                    '<td  colspan="35" class="file-list" id="file">'+v.attachmentId+'</td>';
                                tr7.append(contentFile);

                                var ids = v.attachmentId;


                                //请求附件信息
                                $.myAjax({
                                    type: "POST",
                                    url: window.ajaxUrl + "preSupport/attachment/findByIds",
                                    data: {"ids":ids},
                                    success: function (data)
                                    {
                                        if (data && data.success === 0)
                                        {
                                            setTable(data,tr5);
                                        }
                                    }
                                });
                            }






                            if( v.trackState == 1) //回复状态为已回复时
                            {
                                var content10 = '<td class="table-key" colspan="5">回复状态：</td>' +
                                    '<td  colspan="7">已回复</td>';

                                if(reqSupType == "0")
                                {
                                    if(v.trackContractState == "HT-00")   //未签订
                                    {
                                        var content6 = '<td class="table-key" colspan="5">合同状态：</td>'+
                                            '<td colspan="10">未签订</td>';

                                        if(v.trackContractTime == "" || v.trackContractTime == null) //判断合同签订时间
                                        {
                                            v.trackContractTime = "";
                                            var content7 = '<td class="table-key" colspan="5"> 预计签订时间：</td>' +
                                                '<td colspan="8"   >'+ v.trackContractTime+'</td>';
                                        }
                                        else{
                                            var newDate = v.trackContractTime;
                                            var  _date = new Date(newDate);
                                            var  trackContractTime = formatDate(_date);
                                            var content7 = '<td class="table-key" colspan="5"> 预计签订时间：</td>' +
                                                '<td colspan="8">'+ trackContractTime+'</td>';
                                        }

                                        var content8 = '<td class="table-key" colspan="5">预计金额：</td>' +
                                            '<td  colspan="7"   >'+ v.trackContractSum+'元</td>';


                                    }
                                    else if(v.trackContractState == "HT-01") //签订中
                                    {
                                        var content6 = '<td class="table-key" colspan="5">合同状态：</td>'+
                                            '<td colspan="10">签订中</td>';
                                        if(v.trackContractTime == "" || v.trackContractTime == null) //判断合同签订时间
                                        {
                                            v.trackContractTime = "";
                                            var content7 = '<td class="table-key" colspan="5"> 预计签订时间：</td>' +
                                                '<td colspan="8"   >'+ v.trackContractTime+'</td>';
                                        }
                                        else{
                                            var newDate = v.trackContractTime;
                                            var  _date = new Date(newDate);
                                            var  trackContractTime = formatDate(_date);
                                            var content7 = '<td class="table-key" colspan="5"> 预计签订时间：</td>' +
                                                '<td colspan="8">'+ trackContractTime+'</td>';
                                        }

                                        var content8 = '<td class="table-key" colspan="5">预计金额：</td>' +
                                            '<td  colspan="7"   >'+ v.trackContractSum+'元</td>';

                                    }
                                    else if(v.trackContractState == "HT-09") //已签订
                                    {
                                        var content6 = '<td class="table-key" colspan="5">合同状态：</td>'+
                                            '<td colspan="10">已签订</td>';
                                        if(v.trackContractTime == "" || v.trackContractTime == null) //判断合同签订时间
                                        {
                                            v.trackContractTime = "";
                                            var content7 = '<td class="table-key" colspan="5"> 合同时间：</td>' +
                                                '<td colspan="8"   >'+ v.trackContractTime+'</td>';
                                        }
                                        else{
                                            var newDate = v.trackContractTime;
                                            var  _date = new Date(newDate);
                                            var  trackContractTime = formatDate(_date);
                                            var content7 = '<td class="table-key" colspan="5"> 合同时间：</td>' +
                                                '<td colspan="8">'+ trackContractTime+'</td>';
                                        }

                                        var content8 = '<td class="table-key" colspan="5">合同金额：</td>' +
                                            '<td  colspan="7"   >'+ v.trackContractSum+'元</td>';
                                    }
                                }
                                // 回复内容包含附件信息
                                var content9 = '<td class="table-key" colspan="5">回复内容：</td>' +
                                    '<td  colspan="35" class="trackReContent"><p>'+ v.trackReContent +'</p></td>';







                                tr2.append(content4);
                                tr2.append(content5);
                                tr5.append(content9);
                                tr3.append(content6);
                                tr3.append(content7);
                                tr3.append(content8);

                            }

                            else if( v.trackState == 0 )
                            {
                                var content10 = '<td class="table-key" colspan="5">回复状态：</td>' +
                                    '<td  colspan="7"  >未回复</td>';
                            }



                            tr.append(content1);  //content1为发起人
                            tr.append(content2);   //content1为发起时间
                            tr.append(content10);   //content为回复状态 tr为第一行显示的内容
                            tr1.append(content3);
                            contain.append(tr);
                            contain.append(tr1);
                            contain.append(tr2);
                            contain.append(tr3);
                            contain.append(tr4);
                            contain.append(tr5);
                            //contain.append(tr7);
                            window.getTd(contain)
                            $(".followinglist").append(contain);

                        });


                    }
                },
            })
    });
}(jQuery, window, document));
