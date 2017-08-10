/*
* 上传方案页面-编辑页面js文件
*@author 王步华
*/
(function($, w, d){
    'use strict';
    $(function() {
        var reqId = parent.window.layerViewData.reqId;
        var attachmentId = parent.window.layerViewData.attachmentId;
        window.layerViewData = parent.window.layerViewData;
        var id = "";
        window.getTd($("#form-article-add"));
        var uploadFile = $(".upload-file");

        //兼容IE8下indexOf方式
        if (!Array.prototype.indexOf)
        {
            Array.prototype.indexOf = function(elt /*, from*/)
            {
                var len = this.length >>> 0;
                var from = Number(arguments[1]) || 0;
                from = (from < 0)
                    ? Math.ceil(from)
                    : Math.floor(from);
                if (from < 0)
                    from += len;
                for (; from < len; from++)
                {
                    if (from in this &&
                        this[from] === elt)
                        return from;
                }
                return -1;
            };
        }

        //获取数据
        function deleteook(){
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "preSupport/plan/find",
                    data: {"attachmentId": attachmentId},
                    success: function (msg) {
                    	if (msg && msg.success === 0)
                		{
	                        var list = msg.data;
                            $(".upload-show").html(list.attachmentName);       //附件名称
	                        $(".SchemeName").val(list.planName);                //方案名称
	                        $(".CorrespondingSite").val(list.planSite);        //对应工地
	                        $(".CorrespondentClient").val(list.customerName); //对应客户
	                        $(".Remarks").val(list.planRemark);                 //备注
	                        $(".file-list").attr("chmenid",list.attachmentId); //附件id
                            $(".upload-show").attr("chmenid",list.attachmentId);
                            if(list.planRemark != "" && list.planRemark != null){
                            	$(".planRemark").find(".textarea-length").html(list.planRemark.length);
                            }
                            
	                        id = list.id;
	                        var strli = "";
	                        $.myAjax({
	                            type: "POST",
	                            url: window.ajaxUrl + "preSupport/plan/findDictionary",
	                            data: {"dictCode": "CP"},
	                            success: function (s) {
	                            	if (s && s.success === 0){
		                                $(".supModelUp-list").html("");
		                                var lists = s.data;
		                                for (var i = 0; i < lists.length; i++) {
		                                	var label = $("<label></label>");
		                                    label.addClass("col-2 text-l");
		                                    if(list.planProducts.indexOf(lists[i].dictCodeValue) >= 0){
		                                    	label.html("<input type='checkbox' value='' checked='checked' name='user-Character' con_name='functionId' pid='" + lists[i].dictCodeValue + "' />" + lists[i].dictCodeName);
		                                    }else{
		                                    	label.html("<input type='checkbox' value='' name='user-Character' con_name='functionId' pid='" + lists[i].dictCodeValue + "' />" + lists[i].dictCodeName);
		                                    }
		                                    $(".supModelUp-list").append(label);
		                                }
	                            	}
	                            }

	                        });
                		}
                    }
                });
        };
        deleteook();

        /*文件上传*/
        uploadFile.on("change",function () {
            var _this = this,
                sendData={},
                msg = "正在上传文件";
            //function (obj) {
            /*obj = {
             ths: this,//input 类型的file
             msg: "正在上传请稍后,请不要提交",//上传时的提示信息，没有可不传
             form: $("#upload"),//上传文件的form
             fileList: $(".file-list"),//展示上传完成文件的元素
             sendData: {}//要给后台传的参数
             }*/
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
                url: ajaxUrl + "preSupport/plan/create",
                type: "POST", //form提交的方式(method:post/get)
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
                        plancode = plantype.split('.');
                    plantype = plancode[0];

                    p.attr("chmenid",data.content.attachId);
                    $(".upload-show").html(data.content.attachName);
                    $(".upload-show").attr("chmenid",data.content.attachId);
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
            btnSubmit: ".btns-group .btn",
            tiptype:2,
            beforeSubmit:function(curform) {
                //方案提交
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
                obj.id=id;

                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "preSupport/plan/update",
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
            },
            callback:function(form){
                return false;
            }
        });

        //附件下载
        $(".upload-show").on("click",function ()
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
                            "url": window.ajaxUrl + "preSupport/plan/findFileData",
                            "method": "post",
                            "data": {"attachmentId": _this.attr("chmenid")}
                        });
                    }
                    
                }
            });
        });
    });
}(jQuery, window, document));

