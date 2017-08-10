/**
 *
 * 本文件是登记故障页面的js文件
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){

        var pageSize = 1000,
        selected = false;

        window.getTd($(".form-table"));
        /*
         * 请求登记人信息
         *
         * */
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

        $.myAjax({
            type:"POST",
            url:window.ajaxUrl + "operation/complaintRecord/findUser",
            data:{},
            success:function(data)
            {
                $("input[con_name='registrantName']").val(data.data.userRealName);
                $("input[con_name='registrantPhone']").val(data.data.userMobilePhone);
            }
        })
        var now = new Date()
        var nowTime =  formatDateTimesec(now);

        $("input[con_name='registrantTime']").val(nowTime)

        /*
        * 请求字典故障等级
        * */
        $.myAjax({
            type:"POST",
            url:window.ajaxUrl + "general/dictionary/findDictionary",
            data: {"dictCode":"GZDJ"},
            datatype:"json",
            success:function(data)
            {
                var select = $(".faultLevel"),
                    list = null,
                    Str = null;

                if(data && data.success === 0)
                {
                    list = data.data;
                    $.each(list,function(i,v){
                        Str += '<option value="'+v.dictCodeValue+'">'+ v.dictCodeName+'</option>'
                    })
                    select.append(Str)
                }
            }
        })

            /*
            * 查询字典项 请求故障状态
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
                }
            }
        })


        //获取出所有权限数据
        //请求类型
        function getType()
        {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl+"project/project/findProjectAll",  //请求工单类型传入固定字符串
                data: {},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        var project = $(".project"),
                            option = null;
                        project.html("");
                        project.append('<option value="">请选择</option>');
                        for (var i = 0, l = data.data.length; i < l; i++)
                        {
                            option = $('<option value="'+ data.data[i].id+'"></option>');
                            option.text(data.data[i].projectName);
                            project.append(option);
                        }
                        $(".project").on('change',function(){
                            $(this).parent(".input-tree").attr("projectId",$(this).val());

                            $(".equipment-cnt tbody").find(".remove-subp").remove();
                            if(project.parent(".input-tree").attr("projectId")){
                                //获取工地
                                $.myAjax({
                                    type:"POST",
                                    url:window.ajaxUrl +"project/workSite/findByProjectId",
                                    data:{projectId:$(".project").parent(".input-tree").attr("projectId")},
                                    dataType:"json",
                                    success:function(data)
                                    {
                                        if(data && data.success === 0)
                                        {
                                            var worksite = $('.worksite'),
                                                workoption = null;
                                            worksite.html("");
                                            worksite.append('<option value="">请选择</option>');
                                            for (var i = 0, l = data.data.length; i < l; i++)
                                            {
                                                workoption = $('<option value="'+ data.data[i].id+'"></option>');
                                                workoption.text(data.data[i].worksiteName);
                                                worksite.append(workoption);
                                            }
                                            $(".worksite").on('change',function(){
                                                $(this).parent(".input-tree").attr("projectId",$(this).val());
                                            });
                                        }
                                    }
                                })

                                //获取子项目
                                $.myAjax({
                                    type:"POST",
                                    url:window.ajaxUrl +"project/subProject/findByProjectId",
                                    data:{projectId:$(".project").parent(".input-tree").attr("projectId")},
                                    dataType:"json",
                                    success:function(data)
                                    {
                                        if(data && data.success === 0)
                                        {
                                            var subProject = $('.subProject'),
                                                suboption = null;
                                            subProject.html("");
                                            subProject.append('<option value="">请选择</option>');
                                            for (var i = 0, l = data.data.length; i < l; i++)
                                            {
                                                suboption = $('<option value="'+ data.data[i].id+'"></option>');
                                                suboption.text(data.data[i].subprojectName);
                                                subProject.append(suboption);
                                            }

                                        }
                                    }
                                })
                            }

                        });


                    }
                }
            });

        };
        getType();
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
            sendData.faultLevel = $(".faultLevel option:selected").val();
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
                        url: window.ajaxUrl + "operation/faultReporting/create",
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