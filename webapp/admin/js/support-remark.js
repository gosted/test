/**
 * 本文件是新建备注功能
 *@author 鲍哲
 */
(function($, w, d)
{

    $(function()
    {
         var reqId = parent.window.layerViewData.reqId,
         taskId = parent.window.layerViewData.taskId;
        var model = $("#remark_model");
        console.log(model)
        $.Huitab("#tab-category .tabBar span","#tab-category .tabCon","current","click","0");



        window.getTd($(".form-table"))
    //上传附件
    function fileData()
    {

        var str = $(this).val();

        var arr = str.split("\\");

        var name = arr[arr.length-1];

        var needName = name.split(".")[0];

        if(needName == "")
        {
            return;
        }
        var container = model.find(".file_c .file_container");
        var tr = $("<ul></ul>");
        var td1 = $("<li></li>");
        var img = $("<img />");
        var td3 = $("<span><span/>");
        var button = $("<button></button>");
        button.html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在上传");
        button.css({"background":"transparent","border":"0px solid transparent"})
        td3.html(name);
        td1.append(img).append(td3).append(button);
        tr.append(td1);
        container.prepend(tr);
        var oMyForm = new FormData();
        oMyForm.append("file", $('#fileField')[0].files[0]);
        console.log($('#fileField')[0].files[0]);
        oMyForm.append("attachClassify", "qqzcywjlsl");////前期支撑业务经理受理
        oMyForm.append("processType", "qqzcywjlsl");//前期支撑业务经理受理
        oMyForm.append("attachName", name);
        oMyForm.append("reqId", reqId);
        if(name.lastIndexOf("doc") != -1)
        {
            img.attr("src","../../images/commen/doc.png");
        }
        else if(name.lastIndexOf("ppt") != -1)
        {
            img.attr("src","../../images/commen/ppt.png");
        }
        else if(name.lastIndexOf("xlsx") != -1)
        {

            img.attr("src","../../images/commen/xlsx.png");
        }
        else if(name.lastIndexOf("zip") != -1)
        {
            img.attr("src","../../images/commen/zip.png");
        }
        else if(name.lastIndexOf("xlsx") != -1)
        {
            img.attr("src","../../images/commen/xlsx.png");
        }
        else if(name.lastIndexOf("txt") != -1)
        {
            img.attr("src","../../images/commen/txt.png");
        }
        else if(name.lastIndexOf("avi") != -1)
        {
            img.attr("src","../../images/commen/video.png");
        }
        else if(name.lastIndexOf("pdf") != -1)
        {
            img.attr("src","../../images/commen/pdf.png");
        }
        else
        {
            img.attr("src","../../images/commen/unknown.png");
        }
        console.log(oMyForm);
        $.ajax({
            type: "POST",
            url:ajaxUrl +"preSupport/attachment/create"+window.times,
            data:oMyForm,
            processData: false,
            contentType:false,
            beforeSend: function (xhr) {
                var ses = window.getRequestHeader();
                xhr.setRequestHeader("authorization", ses);
            },
            success: function (data) {
                if(data.success === 0)
                {
                    console.log("666",data)
                    //将attachId赋值到页面的元素，方便获取
                    var strId = model.find("#file_table .file_container").attr("attachId");
                    if(strId != undefined)
                    {
                        strId = strId+","+data.data.attachId;
                        model.find("#file_table .file_container").attr("attachId",strId);
                    }
                    else
                    {
                        model.find("#file_table .file_container").attr({"attachId":data.data.attachId});

                    }

                    button.html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class='btn con-ProgramLibrary btn-default btn-uploadstar radius ml-10 lauMng_dele'><i class='Hui-iconfont'>&#xe6e2</i>删除</a>");
                    button.on("click",{"attachId":data.data.attachId,"obj":button},removeFile);
                }
            },
            error:function(msg){
                button.html("上传失败");
                button.css({"color":"red","border":"1px solid transparent"})
            }
        });

    }

        //删除附件
        function removeFile(event)
        {

            var strId = model.find("#file_table .file_container").attr("attachId");
            var arr = strId.split(",");
            var str="";
            console.log("arr",arr);
            for(var i = 0; i < arr.length; i++)
            {
                if(arr[i] == event.data.attachId)
                {
                    arr.splice(i,1);
                    str = arr.join(",");
                    console.log("str",str);
                }
            }
            var strId = model.find("#file_table .file_container").attr("attachId",arr);


            var id = event.data.attachId;
            var obj = event.data.obj;

            $.myAjax({
                type:"POST",
                url:ajaxUrl + "preSupport/attachment/deleteFileById",
                data:{"id":id},

                success:function(data)
                {
                    console.log(data)
                    if(data.success === 0)
                    {
                        console.log("id",id);
                        $("#fileField").val("");
                        console.log($("#fileField").val(""));
                        console.log("333",obj.parent());
                        obj.parent().remove();
                    }
                },
                error:function(msg)
                {

                }
            });
        }

        var fileField = model.find("#fileField");
        console.log("555",fileField)
        fileField.on("change",fileData);

        //提交
        function saveData(event)
        {
            var _this = $(this);
            var needInput = $("[con_name]"),
                len = needInput.length;
            var obj = {};
            for(var i=0;i<len;i++)
            {
                var con_name = $(needInput[i]).attr("con_name");
                switch (con_name){
                    case "remarkIsShow":
                        if($(needInput[i]).val() == "")
                        {
                            $(needInput[i]).parent().next().css({"display":"block"});
                            /* console.log( $(needInput[i]).parent().next())*/
                            return;
                        }
                        else
                        {
                            $(needInput[i]).next().css({"display":"none"});
                        }
                        break;
                    case "remarkDetail":
                        if($(needInput[i]).val() == "")
                        {
                            $(needInput[i]).next().css({"display":"block"});
                            console.log(108);
                            return;
                        }
                        else
                        {
                            $(needInput[i]).next().css({"display":"none"});
                        }
                        break;
                }

            }
            console.log(model.find("[con_name='remarkIsShow']").val())
            obj.remarkDetail = model.find("[con_name='remarkDetail']").val();
            obj.attachmentId =model.find(".file_container").attr("attachId");
            obj.remarkIsShow = model.find("[con_name='remarkIsShow']").val();
            obj.reqId = reqId
            console.log(obj)
            $.myAjax({
                type:"POST",
                url:window.ajaxUrl + "preSupport/remark/create",
                datatype:"json",
                data:obj,
                success:function(data)
                {

                    console.log(data);
                    layer.confirm('操作成功', {
                        btn: ['关闭'],
                        shade: false

                    },
                        function()
                        {
                            var index = parent.parent.layer.getFrameIndex(parent.window.name);
                            parent.parent.window.location.replace(parent.parent.window.location.href);
                            parent.parent.layer.close(index);
                        }
                    )

                },
                error:function(data)
                {
                    console.log(data);d
                    layer.confirm("保存未成功！",{
                        btn: ['确定'],
                        shade: false
                    });
                }
            });
        }

        var submitBtn = model.find(".btns-group button").eq(0);

        submitBtn.on("click",$(".remark-btn"),saveData);
        $("#checkForm").Validform({
            btnSubmit: ".btns-group .btn",
            tiptype:2,
            callback:function(form){
                return false;
            }
        });


    });


}(jQuery, window, document))