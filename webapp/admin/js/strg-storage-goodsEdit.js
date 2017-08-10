/**
 * 本文件的功能是货架定义编辑js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var libId = parent.window.layerViewData.libId,
            storageId = parent.window.layerViewData.strgRoomId,
            strData = parent.window.layerViewData.shelfname,
            strgRoomName = parent.window.layerViewData.strgRoomName,
            uploadFile = $(".upload-file"),
            List ="",
            strId = "";

        //添加40个td
        window.getTd($(".form-table"));
        $(".storageId").val(strgRoomName);  //所属库房
        //请求已有信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "operation/shelf/findById",
            data: {"id": libId},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    var box = $("#libAdd"),
                        parVal = "",
                        strName = data.data.shelfParentId;
                    strId = data.data.shelfParentName;
                    $(".upload-form").attr("attachmentId",data.data.attachmentId);
                    $(".shelfParentId").attr("shelfParentId",data.data.shelfParentName);
                    $(".shelfName").attr("shelfNameStr",data.data.shelfName);
                    if(data.data.shelfRemark != null &&  data.data.shelfRemark != ""){
                        $(".descr").find(".textarea-length").html(data.data.shelfRemark.length);
                    }
                    /***********************************************************/
                    var attschmen = data.data.attachmentId;
                    if(attschmen != "" || attschmen != null ) {
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/attachment/findByIds",
                            data: {"ids":attschmen} ,
                            success: function (msg) {
                                if(msg.success=="0") {
                                    var attachm = msg.data;
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
                                            '<span><a href="javascript:;">'+data.attachName+'</a></span>'+
                                            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="btn btn-success radius ml-10 del"><i class="Hui-iconfont"></i>删除</a>'+
                                            '</p>'
                                    });
                                    $("#libAdd").find(".file-list").append(List);
                                }
                            }
                        });
                    }
                    /***********************************************************/
                    setFormInfo(box,data);

                    if(strData.indexOf("/")>-1)
                    {
                        var str="";
                        var arr = strData.split("/");
                        for(var j=0;j<arr.length-1;j++)
                        {
                            str += arr[j] + "/";
                        }
                        str = str.substring(0,str.length-1);
                        $(".shelfParentId").val(str);
                        $.cookie("lzg_strId",str,{
                            expires:1,//有效日期
                            secure:false //true,cookie的传输会要求一个安全协议,否则反之
                        });
                    }
                    else
                    {
                        $(".shelfParentId").val(str);
                        $.cookie("lzg_strId",str,{
                            expires:1,//有效日期
                            secure:false //true,cookie的传输会要求一个安全协议,否则反之
                        });
                    }
                }
            }
        });

        /*地区树和机构树*/
        function setTrees(obj)
        {
            /*
             * treeOnClick树形菜单点击回调函数
             *
             * */
            var ele = obj.ele || ".input-tree";
            function treeOnClick()
            {
                var _this = $(this),
                    inpt = _this.parents(".input-tree").eq(0).children(".input-text"),
                    tree = _this.parents(".tree").eq(0),
                    treeTxt = _this.parents("li").children("a").children(".tree-txt"),
                    txtArr = [],
                    id = _this.parents("li").eq(0).attr("treeId");
                _this.parents(".tree").eq(0).find(".tree-txt").removeClass("clr-blue");
                _this.addClass("clr-blue");
                $.each(treeTxt, function (i, v)
                {
                    txtArr.push($(v).text());
                });
                txtArr = txtArr.reverse();
                inpt.val(txtArr.join("/"));
                tree.hide();
                _this.parents(".input-tree").eq(0).attr("open_list", "false");
                inpt.blur();
            }
            /*
             * treeInit初始化树形菜单方法
             *
             * */
            function treeInit(obj)
            {
                var tree = $(obj.ele).find(".tree"),
                    data = obj.data;

                tree.html("");
                if (obj.all)
                {
                    var OLi = $('<li></li>'),
                        OA = $('<a href="javascript:;"></a>'),
                        allId = "";
                    OLi.append('<span class="tree-sw"></span>');
                    if (obj.showIcon === true)
                    {
                        OA.append('<span class="tree-icon"></span>');
                    }
                    OA.append('<span class="tree-txt all"></span>');
                    OA.find(".tree-txt").html(obj.all);
                    OLi.attr("treeId", obj.initSendData[obj.id]);
                    $.each(data, function (i, v){
                        $.each(v, function (j,va)
                        {
                            if (j === obj.id)
                            {
                                allId += "," + va;
                            }
                        });
                    });
                    allId = allId.substr(1);
                    OLi.attr("allId", allId);
                    OLi.append(OA);
                    tree.append(OLi);
                }
                else
                {
                    $.each(data, function (i, v)
                    {
                        var OLi = $('<li></li>'),
                            OA = $('<a href="javascript:;"></a>');

                        OLi.append('<span class="tree-sw"></span>');

                        if (obj.showIcon === true)
                        {
                            OA.append('<span class="tree-icon"></span>');
                        }
                        OA.append('<span class="tree-txt"></span>');

                        $.each(v, function (j,va)
                        {
                            if (j === obj.value)
                            {
                                OA.find(".tree-txt").html(va);
                            }
                            else if (j === obj.id)
                            {
                                OLi.attr("treeId", va);
                            }
                            else
                            {
                                //OA.attr(j, va);
                            }
                        });
                        OLi.append(OA);
                        tree.append(OLi);
                    });
                }
                tree.on("click", ".tree-sw", function ()
                {
                    var _this = $(this),
                        OUl = _this.parent("li").children("ul"),
                        id = _this.parent("li").attr("treeId");
                    if (_this.hasClass("sw-open"))
                    {
                        _this.css({"background": 'url("../../images/commen/tree_0.png") no-repeat center'});
                        _this.removeClass("sw-open");
                        OUl.css({"display": "none"});
                    }
                    else
                    {
                        _this.css({"background": 'url("../../images/commen/tree_1.png") no-repeat center'});
                        _this.addClass("sw-open");

                        if (OUl.size() === 1)
                        {
                            OUl.css({"display": "block"});
                        }
                        else
                        {
                            $.myAjax({
                                url: obj.url,
                                type: obj.type || "POST",
                                data: {id: $(this).parents("li").attr("treeId"),storageId:storageId},
                                success: function (data)
                                {
                                    if (data && data.success === 0)
                                    {
                                        var treeArr = data.data,
                                            OUl = $('<ul></ul>');

                                        $.each(treeArr, function (i, v)
                                        {
                                            var OLi = $('<li></li>'),
                                                OA = $('<a href="javascript:;"></a>');

                                            OLi.append('<span class="tree-sw"></span>');

                                            if (obj.showIcon === true)
                                            {
                                                OA.append('<span class="tree-icon"></span>');
                                            }
                                            OA.append('<span class="tree-txt"></span>');

                                            $.each(v, function (j,va)
                                            {
                                                if (j === obj.value)
                                                {
                                                    OA.find(".tree-txt").html(va);
                                                }
                                                else if (j === obj.id)
                                                {
                                                    OLi.attr("treeId", va);
                                                }
                                                else
                                                {
                                                    //OA.attr(j, va);
                                                }
                                            });
                                            OLi.append(OA);
                                            OUl.append(OLi);
                                        });
                                        _this.parent("li").append(OUl);
                                    }
                                }
                            });
                        }
                    }
                    return false;
                });

                tree.on("click", ".tree-txt", treeOnClick);
                if (obj.treeClick)
                {
                    tree.on("click", ".tree-txt", obj.treeClick);
                }
            }

            $(ele).on("click", ".input-text", function ()
            {
                var _this = $(this),
                    flag = false;
                $(".input-tree .tree").hide();
                $(".input-tree").attr("open_list", "false");
                if (_this.parents(".input-tree").find(".tree li").size() === 0)
                {
                    _this.parents(".input-tree").eq(0).find(".tree").hide();
                    _this.parents(".input-tree").eq(0).attr("open_list", "false");
                }
                flag = (_this.parents(".input-tree").eq(0).attr("open_list") === "false") ||
                    (_this.parents(".input-tree").eq(0).attr("open_list") === undefined);

                if (flag)
                {
                    _this.parents(".input-tree").eq(0).find(".tree").show();
                    _this.parents(".input-tree").eq(0).attr("open_list", "true");
                    if ($(ele).find(".tree li").size() === 0)
                    {
                        $.myAjax({
                            url: obj.url,
                            type: obj.type || "POST",
                            data: obj.data || "",
                            success: function (data)
                            {
                                if (data && data.success === 0)
                                {
                                    var treeArr =data.data;
                                    treeInit({
                                        ele: ele,
                                        data: treeArr,
                                        id: obj.id || "id",
                                        value: obj.value,
                                        url: obj.url,
                                        type: obj.type || "POST",
                                        all: obj.all || false,
                                        initSendData: obj.data,
                                        treeClick: obj.treeClick || ""
                                    });
                                }
                            }
                        });
                    }
                }
                else
                {
                    _this.parents(".input-tree").eq(0).find(".tree").hide();
                    _this.parents(".input-tree").eq(0).attr("open_list", "false");
                }
            });
            $(document).on("click", function (e){//点击其他地方要关闭树
                var evnt = e || window.event,
                    tar = $(evnt.target);
                if (tar.parents(".input-tree").size() === 0)
                {
                    $(".input-tree .tree").hide();
                    $(".input-tree").attr("open_list", "false");
                }
            });
        };
        /*地区树和机构树结束*/

        //树形结构
        setTrees({
            url: ajaxUrl + "operation/shelf/findTree",
            type: "POST",
            data: {storageId:storageId},
            id: "id",
            value: "shelfName",
            treeClick: function ()
            {
                var _this = $(this),
                    id = _this.parents("li").eq(0).attr("treeId");
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "operation/shelf/findByParentId",
                    data: {
                        id:libId,
                        shelfParentId:id
                    },
                    dataType: "json",
                    success: function(msg) {
                        if (msg && msg.success === 0) {
                            if(msg.data ==null || msg.data ==""){
                                $(".shelfParentId").attr("shelfParentId",id);
                            }else{
                                $(".shelfParentId").val($.cookie("lzg_strId"));
                                layer.confirm('树级列表不可选择', {
                                    btn: ['确定'],
                                    shade: 0.1
                                })
                            }
                        }
                    }
                });

            }
        });

        /*
         * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
         * */
        function setFormInfo (box,data)
        {
            var conNames = box.find('[con_name]'),
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
                if (keyVal || keyVal == 0)
                {
                    if (conNames.eq(i).attr("type") === "radio")
                    {
                        _radio = conNames.eq(i).parents(".radio-box").find('input[value="'+keyVal+'"]');
                        _radio.parents(".iradio-blue").addClass("checked");
                    }
                    else if (conNames.eq(i).attr("type") === "checkbox")
                    {
                        chkArr = keyVal.split(",");
                        for (var j= 0,len2=keyVal.length; j<len2; j++)
                        {
                            conNames.eq(i).parents(".formControls").find('input[value="'+chkArr[j]+'"]').attr("checked","checked");
                        }
                    }
                    else
                    {
                        if (conNames.eq(i).attr("_type") === "date")
                        {
                            date = window.formatDates(keyVal);
                            conNames.eq(i).val(date);
                        }
                        else if (conNames.eq(i).attr("_type") === "time")
                        {
                            date = window.formatDateTimes(keyVal);
                            conNames.eq(i).val(date);
                        }
                        else
                        {
                            conNames.eq(i).val(keyVal);
                        }
                    }
                }
            }
        }

        $("#table-box").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            beforeSubmit:function(curform){
               /*
                 * 提交跟踪反馈信息
                 */
                var majorlist =  $(".major").find("input").val();
                if(majorlist == ""){
                    $(".major").find(".msg-tip").html("<span class='Validform_checktip Validform_wrong'></span>");
                    $(".major").find("input").addClass("Validform_error");
                }else{
                    $(".major").find(".msg-tip").html("<span class='Validform_checktip Validform_right'></span>");
                    $(".major").find("input").removeClass("Validform_error");
                }
                if($(".Validform_wrong").length>0)
                {
                    return;
                }
                else {
                    var shelfParentId =  $(".shelfParentId").attr("shelfParentId");
                    var sendData = {};
                    var loading = "",
                        strId = "",   //附件id
                        arrP = $(".file-list p");
                    $.each(arrP, function (i, v)
                    {
                        strId += "," + $(v).attr("attachId");
                    });
                    strId = strId.substr(1);
                    sendData = getFormInfo(curform);
                    sendData.storageId = storageId;
                    sendData.shelfParentId = shelfParentId;
                    sendData.attachmentId = strId;
                    sendData.shelfName = $(".shelfName").val();

                    sendData.id = libId;
                    loading = layer.msg('请稍后', {
                        time: 0,
                        icon: 16,
                        shade: 0.1
                    });

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "operation/shelf/update",
                        data: sendData,
                        dataType: "json",
                        success: function (msg) {
                            if (msg && msg.success === 0) {
                                $.cookie("lzg_strId",null);
                                layer.confirm('提交成功', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    },
                                    function () {
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    },
                                    function () {
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
        //上级货架
        $(".major").find("input").blur(function(){
            var majorlist =  $(".major").find("input").val();
            if(majorlist == ""){
                $(".major").find(".msg-tip").html("<span class='Validform_checktip Validform_wrong'></span>");
                $(".major").find("input").addClass("Validform_error");
            }else{
                $(".major").find(".msg-tip").html("<span class='Validform_checktip Validform_right'></span>");
                $(".major").find("input").removeClass("Validform_error");
            }
        });

        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
         * */
        function getFormInfo (box)
        {


            var conNames = box.find('[con_name]'),
                key = "",
                keyVal = "",
                sendData = {},
                checkbox = null;

            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                if (conNames.eq(i).attr("type") === "radio")
                {

                }
                else
                {
                    keyVal = conNames.eq(i).val();
                }
                sendData[key] = keyVal;
            }
            return sendData;
        }

        /*
         *上传文件
         */
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

