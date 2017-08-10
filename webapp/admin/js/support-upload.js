/*
* 上传方案页面js文件
*@author 王步华
*/
(function($, w, d){
    'use strict';
    $(function() {
        var reqId = parent.window.layerViewData.reqId;
        var uploadFile = $(".upload-file");
        //获取产品列表
        window.getTd($("#form-article-add"));

        function planProductslist() {
            var strli = "";
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "preSupport/plan/findDictionary",
                data: {"dictCode": "CP"},
                success: function (msg) {
                	if (msg && msg.success === 0)
            		{
	                    $(".supModelUp-list").html("");
	                    var list = msg.data;
	                    for (var i = 0; i < list.length; i++) {
	                        var label = $("<label></label>");
	                        label.addClass("col-2 text-l");
	                        label.html("<input type='checkbox' value='' name='user-Character' con_name='functionId' pid='" + list[i].dictCodeValue + "' />" + list[i].dictCodeName);
	                        $(".supModelUp-list").append(label);
	                    }
            		}
                }

            });
        };
        planProductslist();

        /*文件上传*/
        uploadFile.on("change",function () {
            var _this = this,
                sendData={},
                msg = "正在上传文件";
                var _this = $(_this),
                    form = $("#upload"),
                    options = {},
                    time = 512000,
                    fileName = "",
                    lastModified = "",
                    fileSize = "",
                    uploading = "",
                    successFlag = false,
                    fileList = $(".file-list"),
                    pArr = fileList.val(),
                    p = $(".file-list");

                options = {
                    url: ajaxUrl + "preSupport/plan/create",//form提交数据的地址
                    type: "POST", //form提交的方式(method:post/get)
                    //target:target, //服务器返回的响应数据显示在元素(Id)号确定
                    beforeSubmit: function (arr) {
                        var uploadFlag = false;

                        fileName = arr[0].value.name;
                        lastModified = arr[0].value.lastModified;
                        fileSize = arr[0].value.size;
                        uploadFlag = (fileSize > 50 * 1024 * 1024) ? true : false;
                        if (uploadFlag) {
                            layer.confirm('文件大小不能超过50M', {
                                btn: ['确定', '取消'],
                                shade: 0.1
                            });
                            return false;
                        }

                        /*time = Math.ceil((fileSize/10/1024)*1000);//10kb/s 时的超时时间
                         (time > 10000) ? (time = time) : (time = 10000);*/
                        this.url += "?timestamp=" + new Date().getTime();

                        if (msg) {
                            uploading = layer.msg(msg, {
                                time: 0,
                                icon: 16
                                , shade: 0.1
                            });
                        }
                        setTimeout(function () {
                            if (successFlag === false) {
                                layer.close(uploading);
                                layer.confirm('文件上传超时', {
                                        btn: ['确定', '取消'],
                                        shade: 0.1
                                    },
                                    function () {
                                        //location.replace(location.href);
                                    });

                            }
                        }, time + 1000);
                    }, //提交前执行的回调函数
                    success: function (data) {
                        if (data) {
                            layer.close(uploading);
                            data = JSON.parse(data);
                        }
                        var plantype = data.content.attachName,
                            index = plantype .lastIndexOf(".");
                        plantype  = plantype .substring(0,index);

                        p.attr("chmenid",data.content.attachId);
                        $(".upload-show").html(data.content.attachName);
                        p.val(plantype);
                        fileName = data.content.attachName;
                        if (data && data.success === 0) {
                            var sendData = $.extend(true, data.content,sendData);
                            $.myAjax({
                                type: "POST",
                                url: ajaxUrl + "preSupport/attachment/createFileInfo",
                                data: sendData,
                                success: function (msg) {
                                    if (msg && msg.success === 0) {
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
                                            nameArr = fileName.split("."),
                                            str = nameArr[nameArr.length - 1],
                                            type = "unknown";


                                        successFlag = true;
                                        layer.close(uploading);
                                        form.find('input[type="file"]').val("");

                                        p.attr("lastModified", lastModified);
                                        //将attachId赋值到页面的元素，方便获取
                                        if (data.content.attachId) {
                                            p.attr("attachId", data.content.attachId);
                                        }

                                        str = str.substr(0, 3);
                                        $.each(arrImg, function (i, v) {
                                            if (str.toLowerCase() === v) {
                                                type = v;
                                            }
                                            else if ((str.toLowerCase() === "avi") || (str.toLowerCase() === "wmv")) {
                                                type = "mp4";
                                            }
                                            else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpe")) {
                                                type = "png";
                                            }
                                            else {

                                            }
                                        });
                                        img.attr("src", "../../images/commen/" + type + ".png");
                                        /*p.append(img);
                                        p.append('<span>' + fileName + '</span>');*/

                                        button.on("click", function () {
                                            var _this = $(this),
                                                id = $(this).parent().attr("attachId");
                                            $.myAjax({
                                                type: "POST",
                                                url: ajaxUrl + "preSupport/attachment/deleteFileById",
                                                data: {"id": id},

                                                success: function (data) {
                                                    if (data.success === 0) {
                                                        _this.parent().remove();
                                                    }
                                                }
                                            });
                                        });
                                        /*p.append(button);
                                        fileList.append(p);*/
                                    }
                                }
                            });
                        }

                    }, //提交成功后执行的回调函数
                    //dataType: "json" //服务器返回数据类型
                    //clearForm:true, //提交成功后是否清空表单中的字段值
                    //restForm:true, //提交成功后是否重置表单中的字段值，即恢复到页面加载时的状态
                    timeout: time //设置请求时间，超过该时间后，自动退出请求，单位(毫秒)。
                };
                form.ajaxSubmit(options);
            //}
        });
        /*文件上传结束*/


        $(".supModelUploadScheme_main_btn").Validform({
            btnSubmit: ".supModelUpload .btn",
            tiptype:2,
            beforeSubmit:function(curform) {
                //方案提交
                if($(".file-list").attr("chmenid") == "" || $("#UploadScheme").attr("chmenid") == "unll") {
                	layer.confirm('请上传附件', {
                        btn: ['确定', '取消'],
                        shade: 0.1
                    });
                }else {
                    var planpro = [];
                    $(".supModelUp-list").find("input:checkbox:checked").each(function (index, element) {
                        var strattr = $(this).attr("pid");
                        planpro.push(strattr);
                        return planpro;
                    });

                    var plantype;
                    var plancode = ($(".upload-show").html()).split('.');
                    var plantype = plancode[1];
                    var obj = {};
                    obj.planProducts = planpro.join();                                     //对应产品
                    obj.planName = $(".SchemeName").find("input").val();                   //方案名称
                    obj.planSite = $(".planSite").find("input").val();                     //对应工地
                    obj.customerName = $(".customerName").find("input").val();             //对应客户
                    obj.planRemark = $(".planRemark").find("textarea").val();              //备注
                    obj.attachmentId = $(".file-list").attr("chmenid");                 //附件id
                    obj.reqId = reqId;                                                   //需求ID
                    obj.planType = plantype;                                               //文件类型
                    obj.attachmentName = $(".upload-show").text();                       //附件名称

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "preSupport/plan/createPlan",
                        data: obj,
                        success: function (data) {
                            if (data && data.success === 0) {
                                layer.confirm('提交成功', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    },
                                    function()
                                    {
                                        $(".dosptMdlPro_main_content_list").html("");
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    });
                            }
                        }

                    });
                }
            },
            callback:function(form){
                return false;
            }
        });
    });
}(jQuery, window, document));
