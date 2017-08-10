/**
 * 本文件是资产状态变更页面
 * @author 彭佳明
 */

(function($, w, d){
    'use strict';

    $(function() {
        function AssetRegister(options){
            this.sendData = {};
        }
        AssetRegister.prototype = {
            constructor:AssetRegister,
            init:function()
            {
                var tables = $(".table-box>.form-table");
                window.getTd(tables);
                this.addRemark();
                this.getType();
                this.remarkTap();
                this.addAttachment($(".file-list1"),$("#upload-form1"),".upload-file1"); //附件
                this.addAttachment($(".file-list"),$("#upload"),".upload-file0"); //附件
                this.Validform($(".table-box"));
            },
            getVal:function(dom)
            {
                var that = this;

                //that.sendData["positionStatus"] = dom;
                that.sendData["assetStatus"] = $('.assetStatus option:selected').val();

                return that.sendData;
            },
            Validform:function(box)
            {
                var that = this;
                box.Validform({
                    btnSubmit: ".save",
                    tiptype:2,
                    datatype: {
                        "date": /^\d{4}\-\d{2}\-\d{2}$/,
                        "phone": /^0\d{2,3}-?\d{7,8}$/,
                        "Post": /^[0-9][0-9]{5}$/,
                        "Number":/^\d{1,13}((\.\d{1,2})?)$/,
                        "pre":/^\d{1,2}(\.\d{1,4})?$/,
                        "pre1":/^\d{1,4}(\.\d{1,4})?$/
                    },
                    beforeSubmit:function(curform){
                        //获取input 用Data包装全部数据
                        var Data = that.getVal($(".table-box"));
                        Data.id = parent.window.layerViewData.Id;
                        //获取assetTrackInfos
                        var arr = [];
                        function getJson(){
                            var data = {assetPosition:$(".assetPosition").val()||"",installPeople:$(".installPeople").val()||"",installTime:$(".installTime").val()||"",workSiteId:$('.workSite option:selected').val()||"",subProjectId:$('.subProject option:selected').val()||"",projectId:$('.projectId option:selected').val()||"",workSiteName:$(".workSite").find("option:selected").text()||"",subProjectName:$(".subProject").find("option:selected").text()||"",projectName:$(".projectId").find("option:selected").text()||""};
                            $(".asset").find(".remarkTitle").each(function(i,o){
                                var that = $(this);
                                if($(this).html()!=""){
                                    var data1 = {};
                                    $(this).find("input").each(function(i,o){
                                        data1[$(this).attr("con_na")] = $(this).val();
                                    });
                                    data1.content = $(this).next("tr").find(".content").val();
                                    var str = "",str1 = "";
                                    var arrP =that.next().next().next(".remarkAttachContent").find("td").eq(1).find("p");
                                    if(arrP){
                                        $.each(arrP, function (i, v)
                                        {
                                            str += "," + $(v).attr("attachId");
                                            str1 += "," + $(v).attr("attachName");
                                        });
                                        str = str.substr(1);
                                        str1 = str1.substr(1);
                                    }
                                    data1.relatedAttachId = str;
                                    data1.relatedAttachName= str1;
                                    arr.push(data1);
                                }

                            });
                            var strArr = JSON.stringify(arr);
                            data.remark = strArr;
                            Data.assetTrackInfos = JSON.stringify(data);
                            getData();
                        }
                        getJson();
                        function getData(){
                            $.myAjax({
                                type: "POST",
                                url: window.ajaxUrl + "project/assetRegistration/updateRegisterType",
                                data: Data,
                                dataType: "json",
                                success: function(data)
                                {
                                    if (data && data.success === 0)
                                    {
                                        layer.confirm('提交成功', {
                                                btn: ['确定'],
                                                shade: 0.1
                                            },
                                            function(){
                                                window.parent.location.reload();
                                        });
                                        $(document).on("click",".layui-layer-close",function(){
                                            window.parent.location.reload();
                                        })
                                    }
                                }
                            });
                        }
                    },
                    callback:function(form){
                        return false;
                    }
                });
            },
            getType:function()
            {
                var that = this;
                //树形菜单
                window.setTree({
                    ele: ".asset-tree",
                    url: ajaxUrl + "project/assetRegistration/findTree",
                    type: "POST",
                    data: {id: 0},
                    id: "id",
                    value: "equipmentName",
                    treeClick: function (data)
                    {
                        that.sendData.equipmentId= $(this).parent("a").parent("li").attr("treeId");
                    }
                });

                // 项目信息
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/project/findProject",
                    data: {},
                    dataType: "json",
                    success: function(data)
                    {
                        if (data && data.success === 0)
                        {
                            var str="";
                            for(var i=0;i<data.data.length;i++){
                                str += '<option value="'+data.data[i].id+'">'+data.data[i].projectName+'</option>';
                            }
                            $(".projectId").append(str);
                        }
                    }
                });
                $(".projectId").on("change",function(){
                    var val = $(this).val();
                    if(val!="choose"){
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/subProject/findByProjectId",
                            data: {projectId:val},
                            dataType: "json",
                            success: function(data)
                            {
                                if (data && data.success === 0)
                                {
                                    var str="";
                                    for(var i=0;i<data.data.length;i++){
                                        str += '<option class="sub" value="'+data.data[i].id+'">'+data.data[i].subprojectName+'</option>';
                                    }
                                    $(".subProject").append(str);
                                }
                            }
                        });

                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/workSite/findByProjectId",
                            data: {projectId:val},
                            dataType: "json",
                            success: function(data)
                            {
                                if (data && data.success === 0)
                                {
                                    var str="";
                                    for(var i=0;i<data.data.length;i++){
                                        str += '<option class="wor" value="'+data.data[i].id+'">'+data.data[i].worksiteName+'</option>';
                                    }
                                    $(".workSite").append(str);
                                }
                            }
                        });
                    }else{
                        $(".subProject").val("请选择").find(".sub").hide();
                        $(".workSite").val("请选择").find(".wor").hide();
                    }

                });

                //设备状态
                /*$.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/assetRegistration/findDictionary",
                    data: {dictCode:"ZCWZ"},
                    dataType: "json",
                    success: function(data)
                    {
                        if (data && data.success === 0)
                        {
                            var str="";
                            for(var i=0;i<data.data.length;i++){
                                str += '<option value="'+data.data[i].dictCodeValue+'">'+data.data[i].dictCodeName+'</option>';
                            }
                            $(".positionStatus").append(str);
                        }
                    }
                });
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/assetRegistration/findDictionary",
                    data: {dictCode:"ZCZT"},
                    dataType: "json",
                    success: function(data)
                    {
                        if (data && data.success === 0)
                        {
                            var str="";
                            for(var i=0;i<data.data.length;i++){
                                str += '<option value="'+data.data[i].dictCodeValue+'">'+data.data[i].dictCodeName+'</option>';
                            }
                            $(".assetStatus").append(str);
                        }
                    }
                });*/
            },
            addRemarkEvent:function()
            {
                var newRemarkTitle = $(".remarkTitle").eq(0).clone(true);
                var newRemarkContent = $(".remarkContent").eq(0).clone(true);
                var remarkAttach = $(".remarkAttach").eq(0).clone(true);
                var remarkAttachContent =
                    $("<tr class='remarkAttachContent'>"+
                        "<td class='table-key' colspan='5'></td>"+
                        "<td colspan='35' class='formControls news-list'></td>"+
                        "</tr>");
                newRemarkTitle.find(".btn-tap").show();
                newRemarkTitle.find(".btn-del").show();
                newRemarkTitle.find(".name").val("");
                newRemarkTitle.find(".phone").val("");
                newRemarkTitle.find(".time").val("");
                newRemarkContent.find(".content").val("");
                $(".assetRegister").append(newRemarkTitle);
                $(".assetRegister").append(newRemarkContent);
                $(".assetRegister").append(remarkAttach);
                $(".assetRegister").append(remarkAttachContent);
            },
            addRemark:function()
            {
                var cb = $.Callbacks(),that = this;
                $(".btn-add").off().on("click",function(){
                    that.addRemarkEvent();
                    cb.fire(that);
                });
                cb.add(this.AttachList);
            },
            remarkTap:function()
            {
                $(".btn-tap").off().on("click",function()
                {
                    var that = $(this);
                    $(this).parents("tr").next("tr").slideToggle(100,function(){
                        that.toggleClass("fa-minus-circle");
                        that.toggleClass("fa-plus-circle");
                    });
                    $(this).parents("tr").next("tr").next("tr").slideToggle(100,function(){});
                    $(this).parents("tr").next("tr").next("tr").next("tr").slideToggle(100,function(){});
                    if($(this).hasClass("fa-minus-circle")){
                        $(this).attr("title","展开")
                    }else{
                        $(this).attr("title","收缩")
                    }
                });
                $(".btn-del").off().on("click",function()
                {
                    var that = $(this);
                    $(this).parents("tr").next("tr").next("tr").next("tr").html("");
                    $(this).parents("tr").next("tr").next("tr").html("");
                    $(this).parents("tr").next("tr").html("");
                    $(this).parents("tr").html("");

                })
            },
            AttachList:function(This)
            {
                (This.num)++;
                $(".remarkAttach").eq(-1).find(".upload-form").addClass("newUpLoad"+(This.num));
                $(".remarkAttach").eq(-1).find("input").removeClass("upload-file1").addClass("NewUpload-file"+(This.num));
                $(".remarkAttachContent").eq(-1).find(".formControls").addClass("new-list");
                $(".remarkAttachContent").eq(-1).find(".formControls").addClass("File-list"+(This.num));
                This.addAttachment($(".File-list"+This.num),$(".newUpLoad"+This.num),$(".NewUpload-file"+This.num))
            },
            addAttachment:function(loadBox,loadId,loadDom)
            {
                var thisSelf = this;
                var uploadFile = $(".assetRegister").find(loadDom);
                uploadFile.on("change",function ()
                {
                    var _this = this;
                    thisSelf.myFileUpload({
                        ths: _this,
                        msg: "正在上传请稍后",
                        form: loadId,
                        fileList:loadBox,
                        createUrl: "project/attachment/create",//增加地址
                        infoUrl: "project/attachment/createFileInfo",//返回信息地址
                        delUrl: "project/attachment/deleteFileById",//删除的地址
                        sendData: {}
                    });
                });
            },
            myFileUpload:function(obj) {

                var _this = $(obj.ths),
                    form = obj.form,
                    options = {},
                    time = 1500000,
                    fileName = "",
                    lastModified = "",
                    fileSize = "",
                    uploading = "",
                    successFlag = false,
                    fileList = obj.fileList,
                    pArr = fileList.find("p"),
                    p = $('<p></p>'),
                    ind = "";

                if (!_this.val()) {
                    return false;
                }
                var ses = window.getRequestHeader();
                options = {
                    url: ajaxUrl + (obj.createUrl || "preSupport/attachment/create"), //form提交数据的地址
                    type: "POST", //form提交的方式(method:post/get)
                    //target:target, //服务器返回的响应数据显示在元素(Id)号确定
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("authorization", ses);
                        xhr.setRequestHeader("If-Modified-Since", "0");
                        xhr.setRequestHeader("Cache-Control", "no-cache");
                        this.url += "?timestamp=" + new Date().getTime();
                    },
                    beforeSubmit: function (arr) {
                        var uploadFlag = false;

                        fileName = arr[0].value.name;
                        lastModified = arr[0].value.lastModified;
                        fileSize = arr[0].value.size;
                        uploadFlag = (fileSize > 50 * 1024 * 1024) ? true : false;
                        if (uploadFlag) {
                            ind = layer.confirm('文件大小不能超过50M', {
                                    btn: ['确定', '取消'],
                                    shade: 0.1
                                },
                                function () {
                                    layer.close(ind);
                                    _this.val("");
                                });
                            return false;
                        }

                        /*time = Math.ceil((fileSize/10/1024)*1000);//10kb/s 时的超时时间
                         (time > 10000) ? (time = time) : (time = 10000);
                         this.url += "?timestamp="+ new Date().getTime();*/

                        if (obj.msg) {
                            uploading = layer.msg(obj.msg, {
                                time: 0,
                                icon: 16
                                , shade: 0.1
                            });
                        }
                    }, //提交前执行的回调函数
                    success: function (data) {
                        if (data) {
                            data = JSON.parse(data);
                        }

                        fileName = data.content.attachName;
                        if (data && data.success === 0) {
                            var sendData = $.extend(true, data.content, obj.sendData);
                            $.myAjax({
                                type: "POST",
                                url: ajaxUrl + (obj.infoUrl || "preSupport/attachment/createFileInfo"),
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
                                            p.attr("attachName", fileName);
                                        }

                                        str = str.substr(0, 3);
                                        $.each(arrImg, function (i, v) {
                                            if (str.toLowerCase() === v) {
                                                type = v;
                                            }
                                            else if ((str.toLowerCase() === "avi") || (str.toLowerCase() === "wmv")) {
                                                type = "mp4";
                                            }
                                            else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpe") || (str.toLowerCase() === "jpg")) {
                                                type = "png";
                                            }
                                            else {

                                            }
                                        });
                                        img.attr("src", "../../images/commen/" + type + ".png");
                                        p.append(img);
                                        p.append('<span>' + fileName + '</span>');

                                        button.on("click", function () {
                                            var _this = $(this),
                                                id = $(this).parent().attr("attachId");
                                            $.myAjax({
                                                type: "POST",
                                                url: ajaxUrl + (obj.delUrl || "preSupport/attachment/deleteFileById"),
                                                data: {"id": id},

                                                success: function (data) {
                                                    if (data.success === 0) {
                                                        _this.parent().remove();
                                                    }
                                                },
                                                error: function (msg) {
                                                    layer.confirm('删除失败', {
                                                        btn: ['确定', '取消'],
                                                        shade: 0.1
                                                    });
                                                }
                                            });
                                        });
                                        p.append(button);
                                        fileList.append(p);
                                    }
                                },
                                error: function (msg) {
                                    _this.val("");
                                }
                            });
                        }

                    }, //提交成功后执行的回调函数
                    error: function (XmlHttpRequest, textStatus, errorThrown) {
                        if (XmlHttpRequest.status === 504) {
                            ind = layer.confirm('文件上传超时', {
                                    btn: ['确定'],
                                    shade: 0.1
                                },
                                function () {
                                    layer.close(ind);
                                    _this.val("");
                                });
                        }
                    },
                    //dataType: "json" //服务器返回数据类型
                    //clearForm:true, //提交成功后是否清空表单中的字段值
                    //restForm:true, //提交成功后是否重置表单中的字段值，即恢复到页面加载时的状态
                    timeout: time //设置请求时间，超过该时间后，自动退出请求，单位(毫秒)。
                };
                form.ajaxSubmit(options);
            }
        };
        var assetRegister = new AssetRegister();
        assetRegister.init();

        function GetAssetInfo()
        {

        }
        GetAssetInfo.prototype = {
            constructor:GetAssetInfo,
            init:function()
            {
                this.getChange();
                this.getData(".assetRegister");
            },
            getData:function(dom)
            {
                var that = this;
                var id = parent.window.layerViewData.Id,
                    equipmentName = parent.window.layerViewData.equipmentName;
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/assetRegistration/findByIdUpdate",
                    data: {id:id},
                    dataType: "json",
                    success: function(data)
                    {
                        if (data && data.success === 0)
                        {
                            var list = data.data;
                            that.getEquStatus(list.assetCode);
                            $.each(list,function(i,o){
                                $("[con_name="+i+"]").text(list[i]||"");
                            });
                            $(".equipmentName").text(equipmentName);
                            if(list.positionStatus == "ZCWZ-KF")
                            {
                                $(".positionStatus").text("库房");
                                $(".hideEle").hide();
                            }else if(list.positionStatus == "ZCWZ-QT")
                            {
                                $(".positionStatus").text("其它");
                                $(".hideEle").hide();
                            }else
                            {
                                that.getDictCode("ZCWZ").then(function(Data)
                                {
                                    $.each(Data.data,function(i,o){
                                        if(list.positionStatus == o.dictCodeValue){
                                            $(".positionStatus").text(o.dictCodeName);
                                            $(".positionStatus").attr("con_name",list.positionStatus );
                                        }
                                    })
                                });
                            }
                            that.getDictCode("ZCZT").then(function(Data)
                            {
                                $.each(Data.data,function(i,o){
                                    if(list.assetStatus == o.dictCodeValue){
                                        $(".assetStatus").val(data.data.assetStatus);
                                    }
                                })
                            });
                            that.getJsonData(data.data.assetTrackInfos);
                            if(list.relatedAttachId){
                                if(list.relatedAttachId){
                                    that.setAttachment(list.relatedAttachId,$(".file-list"));
                                }
                            }
                        }
                    }
                });
            },
            getChange:function()
            {
                $(".assetStatus").off().on("change",function()
                {
                    if($(this).val() == "ZCZT-SY"){
                        $(".hideEle").show();
                    }else{
                        $(".hideEle").hide();
                    }
                    console.log();
                })
            },
            getEquStatus:function(code)
            {
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "systemInterface/getEquipmentStatus",
                    data: {assetCode:code},
                    dataType: "json",
                    success: function(data)
                    {
                        if (data && data.success === "0")
                        {
                            var list = data.data;
                            $(".equStatus").text(list[0].info||"");
                        }
                    }
                });
            },
            getDictCode:function(code)
            {
                //获取字典项
                var that = this;
                var p = new Promise(function(resolve,reject)
                {
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "general/dictionary/findDictionary",
                        data: {dictCode:code},
                        dataType: "json",
                        success: function(data)
                        {
                            if (data && data.success === 0)
                            {
                                resolve(data);
                            }
                        },
                        error: function (err) {
                            layer.confirm('操作失败', {
                                btn: ['确定','取消'],
                                shade: 0.1
                            });
                        }
                    });
                });
                return p;
            },
            getJsonData:function(data)
            {
                var data = JSON.parse(data),that = this;
                $(".projectId").find("option:selected").text(data.projectName);
                $(".subProject").find("option:selected").text(data.subProjectName);
                $(".workSite").find("option:selected").text(data.workSiteName);
                $(".projectId").find("option:selected").val(data.projectId);
                $(".subProject").find("option:selected").val(data.subProjectId);
                $(".workSite").find("option:selected").val(data.workSiteId);
                $(".assetPosition").val(data.assetPosition);
                $(".installTime").val(data.installTime);
                $(".installPeople").val(data.installPeople);
                if(data.relatedAttachId){
                    that.setAttachment(data.relatedAttachId,$(".file-list1"));
                }
                var newRemark = JSON.parse(data.remark);
                $.each(newRemark,function(i,o){
                    assetRegister.addRemarkEvent();
                    $(".remarkTitle").find(".name").eq(i).val(o.name);
                    $(".remarkTitle").find(".phone").eq(i).val(o.phone);
                    $(".remarkTitle").find(".time").eq(i).val(o.time);
                    $(".remarkContent").find(".content").eq(i).val(o.content);
                    if(o.relatedAttachId){
                        that.setAttachment(o.relatedAttachId,$(".remarkAttachContent").eq(i).find("td").eq(1));
                    }
                });
                $(".remarkTitle").eq(-1).html("");
                $(".remarkContent").eq(-1).html("");
                $(".remarkAttach").eq(-1).html("");
                $(".remarkAttachContent").eq(-1).html("");
            },
            setAttachment:function(attachId,box)
            {
                var that = this;
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/attachment/findByIds",
                    data: {"ids": attachId},
                    success: function (data)
                    {
                        if (data && data.success === 0)
                        {
                            that.setAttachmentData(data,box);
                        }
                    }
                });

            },
            setAttachmentData:function(data,beforeBox)
            {
                var list = [],
                    fileList = null,
                    STr = null;
                fileList = beforeBox;
                list = data.data;
                fileList.html("");
                if(list){
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
                        p.attr("attachName",v.attachName);
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
                        button.on("click", function ()
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
                                },
                                error:function(msg)
                                {
                                    layer.confirm('删除失败', {
                                        btn: ['确定','取消'],
                                        shade: 0.1
                                    });
                                }
                            });
                        });
                        p.append(button);
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
                        DownLoadFile({
                            "url": window.ajaxUrl + "project/attachment/download",
                            "method": "post",
                            "data": {"attachId": _this.attr("attachId")}
                        });
                    });
                }

            }
        };
        var getAssetInfo = new GetAssetInfo();
        getAssetInfo.init();

    });
}(jQuery, window, document));
