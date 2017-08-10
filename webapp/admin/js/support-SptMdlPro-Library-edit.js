/*
* 制作方案页面-支撑方案库页面-方案编辑文件
*@author 王步华
*/
(function($, w, d){
    'use strict';
    $(function() {
    	var fileName = parent.window.layerViewData.fileName,
    		id = parent.window.layerViewData.id,
    		reqId = parent.window.layerViewData.reqId,
    		pid = parent.window.layerViewData.pid,
    		prName = parent.window.layerViewData.prName,
    		planProducts = parent.window.layerViewData.planProducts;
        window.layerViewData = parent.window.layerViewData;

        var plantype = fileName,  //文件名称
            index = plantype .lastIndexOf(".");
        plantype  = plantype .substring(index + 1, plantype .length);
        var planimg="";
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


        window.getTd($("#table-box").find("table"));
        $(".ann-diad-div").html("<a href='javascript:;'>"+"<img src='"+planimg+"'><span>"+fileName+"</span></a>");
        $(".ann-diad-div").attr("ids",id);
        $(".SchemeName").find("input").val(prName);

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


        //获取产品列表
        function planProductslist() {
            var strli = "";
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "preSupport/plan/findDictionary",
                data: {"dictCode": "CP"},
                success: function (msg) {
                    $(".supModelUp-list").html("");
                    var list = msg.data;
                    for (var i = 0; i < list.length; i++) {
                        var label = $("<label></label>");
                        label.addClass("col-2 text-l");
                        if(planProducts.indexOf(list[i].dictCodeValue) >= 0){
                        	label.html("<input type='checkbox' value='' checked='checked' name='user-Character' con_name='functionId' pid='" + list[i].dictCodeValue + "' />" + list[i].dictCodeName);
                        }
                        else{
                        	label.html("<input type='checkbox' value='' name='user-Character' con_name='functionId' pid='" + list[i].dictCodeValue + "' />" + list[i].dictCodeName);
                        }
                        $(".supModelUp-list").append(label);
                    }
                }

            });
        };
        planProductslist();

        $(".libr_main_btn").Validform({
            btnSubmit: ".ProgramSubmitbot .btn",
            tiptype:2,
            beforeSubmit:function(curform) {
                //方案提交
                    var planpro = [];
                    $(".supModelUp-list").find("input:checkbox:checked").each(function (index, element) {
                        var strattr = $(this).attr("pid");
                        planpro.push(strattr);
                        return planpro;

                    });

                    var plantype=[];
                    var plancode = ($(".ann-diad-div").find("span").html()).split('.');
                    var plantype = plancode[1];
                    var obj = {};
                    obj.planProducts = planpro.join();                                     //对应产品
                    obj.planName = $(".SchemeName").find("input").val();                   //方案名称
                    obj.planSite = $(".planSite").find("input").val();                     //对应工地
                    obj.customerName = $(".customerName").find("input").val();             //对应客户
                    obj.planRemark = $(".planRemark").find("textarea").val();              //备注
                    obj.attachmentId = $(".ann-diad-div").attr("ids");                 //附件id
                    obj.reqId = reqId;                                                   //需求ID
                    obj.planType = plantype;                                               //文件类型
                    obj.attachmentName = $(".ann-diad-div").text();                       //附件名称

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "preSupport/plan/createPlan",
                        data: obj,
                        success: function (data) {
                            if (data && data.success === 0)
                            {
                                layer.confirm('提交成功', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    },
                                    function()
                                    {
                                        $(".dosptMdlPro_main_content_list").html("");
                                        parent.window.parent.window.location.reload();
                                    });
                            }
                        }
                    });
            },
                callback:function(form){
                return false;
            }
        });

    	
    	/*
    	* 下载附件
    	* */

        $(".ann-diad-div").on("click",function()
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
                            "url": window.ajaxUrl + "preSupport/planRepository/findFileData",
                            "method": "post",
                            "data": {"id":pid}
                        });
                    }
                }
            });
        });

    });
}(jQuery, window, document));

