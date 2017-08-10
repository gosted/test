/**
 *
 * 本文件是问题登记页面的js文件
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){

        var pageSize = 1000;

        $.myAjax({
            type:"POST",
            url:window.ajaxUrl + "operation/complaintRecord/findUser",
            data:{},
            success:function(data)
            {
                $("input[con_name='registrantPeople']").val(data.data.userRealName);
                $("input[con_name='registrantPhone']").val(data.data.userMobilePhone);

            }
        })
        var now = new Date()
        var nowTime =  formatDateTimesec(now);

        $("input[con_name='registrantTime']").val(nowTime)
        window.getTd($(".form-table"));

        /*
        * 请求登记人
        *
        * */


        /*
         * 请求字典问题等级
         * */
        $.myAjax({
            type:"POST",
            url:window.ajaxUrl + "general/dictionary/findDictionary",
            data: {"dictCode":"WTDJ"},
            datatype:"json",
            success:function(data)
            {
                var select = $(".problemLevel"),
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
         * 查询字典项 请求问题状态
         * */

        $.myAjax({
            type:"POST",
            url:window.ajaxUrl + "general/dictionary/findDictionary",
            data: {"dictCode":"WTZT"},
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

        }
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
            sendData.workSiteId = $(".worksite option:selected").val();
            sendData.state = $(".state option:selected").val();
            sendData.subprojectId = $(".subProject option:selected").val();
            sendData.projectId = $(".project option:selected").val();
            sendData.problemLevel =$(".problemLevel option:selected").val();
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
                        url: window.ajaxUrl + "operation/problemRecord/create",
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