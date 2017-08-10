/**
 * 本文件的功能是新闻列表编辑js文件
 * @ author 李明
 */

(function($, w, d){
    'use strict';

    $(function() {
        var newsId = parent.window.layerViewData.newsId,
            proId = parent.window.layerViewData.proId,
            figureImg = sessionStorage.getItem("data"),
            ue = "",
            typeId = parent.window.layerViewData.typeId,
            uploadFile = $(".upload-file"),
            newsContent = "";

        //添加40个td
        window.getTd($(".form-table"));

        var flagInser = false,
            flag = false;
        window.changeMainPic = function () { //关闭页面时方法调用
            var pictureId = sessionStorage.getItem("pictureId");
            if(flag){
                $(".listAddImg img").attr("src",sessionStorage.getItem("figureImg"));
                $(".listAddImg img").attr("pictureId",pictureId);
                flag = false;
            }
            if(flagInser){
                UE.getEditor('myEditor').focus();
                UE.getEditor('myEditor').execCommand('inserthtml','<img src='+ sessionStorage.getItem("figureImg") +' />');
                flagInser = false;
            }
        };


        if(typeId == 1){
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "general/dictionary/findCP",
                data: {},
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        var str="";
                        for(var i=0;i<data.data.length;i++){
                            str += '<option value="'+data.data[i].proId+'">'+data.data[i].dictCodeName+'</option>';
                        }
                        $("#newsSelect").append(str);
                        $("#newsSelect option:last").hide();
                    }
                }
            });
        }else if(typeId == 2){
            $(".mainImg").remove();
            $(".newsClass").remove();
            $(".newsIntro").remove();
            $(".addValue").remove();

        }else{
            $(".newsClass").remove();
            $(".addValue").remove();
        }

        //请求已有信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/news/findById",
            data: {"id": newsId},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    var box = $(".table"),
                        ids = "";
                    
                    setFormInfo(box,data);

                    ids = data.data.attachId;
                    if (ids)
                    {
                        //请求附件信息
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "general/attachmentPro/findByIds",
                            data: {"ids": ids},
                            success: function (data)
                            {
                                if (data && data.success === 0)
                                {
                                    var needInfo = $(".my-editor");
                                    setTable(data,needInfo);
                                }
                            }
                        });
                    }
                }
            }
        });

        /*
         * 渲染表格方法传入请求到的数据和在哪个tr后插入
         * */
        function setTable (data,beforeBox)
        {
            var list = [],
                fileList = null,
                STr = null;

            fileList = $(".file-list");
            list = data.data;
            fileList.html("");

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
                        url:ajaxUrl + "general/attachmentPro/deleteFileById",
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
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "general/attachmentPro/checkIsLogin",
                    data: {},
                    dataType: "json",
                    success: function(data)
                    {
                        if (data && data.success === 0)
                        {
                            DownLoadFile({
                                "url": window.ajaxUrl + "general/attachmentPro/download",
                                "method": "post",
                                "data": {"attachId": _this.attr("attachId")}
                            });
                        }
                    }
                });
            });
        }

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
                date = "",
                ue = UE.getEditor('myEditor',{initialFrameHeight:500});

            if(figureImg){
                $(".listAddImg img").attr("src",figureImg);
            }else {
                $(".listAddImg img").attr("src",_data.figureImg);
                $(".listAddImg img").attr("pictureId",_data.pictureId);
            }
            if(typeId == 1){
                $("#newsSelect option[value='"+proId+"']").attr("selected",true);
                $(".addValue .input-text").val(_data.proValue[0]);
                $(".introduction").val(_data.introduction);
                for(var i=0;i<_data.proValue.length-1;i++){
                    var str= '<tr class="newsDelete1">'+
                        '<td class="table-key" colspan="5"><span class="c-red"></span></td>'+
                        '<td colspan="30" class="has-tip major">'+
                        '<div class="formControls input-tree proValue">'+
                        '<input type="text" class="input-text" userMajorUnit="" con_name="userMajorUnit" value="'+_data.proValue[i+1]+'">'+
                        '</div>'+
                        '<div class="msg-tip" title="请输入正确信息"> </div>'+
                        '</td>'+
                        '<td class="table-key" colspan="5" style="text-align: center;font-size: 20px;cursor:pointer;"><i class="Hui-iconfont">&#xe6a1;</i></td>'+
                        '</tr>';
                    $(".newsIntro").before(str);
                }
            }
            $.each(conNames,function(i,v)
            {
                $(v).val(_data[$(v).attr("con_name")]);
            });

            $(".newsDelete1 .Hui-iconfont").on("click",function () {
                $(this).parent().parent().remove();
            });
            ue.ready(function() {
                //异步回调
                var pichText = _data.pichText.replace(/\\"/g,'"');
                ue.setContent(pichText);
            });
        }

        $(".table-box").Validform({
            btnSubmit: ".save",
            tiptype:2,
            datatype: {
                "date": /^\d{4}\-\d{2}\-\d{2}$/
            },
            beforeSubmit:function(curform){

                var sendData = {};
                sendData = getFormInfo(curform);
                if (sendData.figureImg === "../../images/news/add.jpg")
                {
                    layer.confirm('请选择主图', {
                        btn: ['确定'],
                        shade: 0.1
                    });
                    return false;
                }
                if (!sendData.pichText)
                {
                    layer.confirm('请填写新闻内容', {
                        btn: ['确定'],
                        shade: 0.1
                    });
                    return false;
                }
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "general/news/update",
                    data: sendData,
                    dataType: "json",
                    success: function (msg) {
                        if (msg && msg.success === 0) {
                            layer.confirm('提交成功', {
                                    btn: ['确定'],
                                    shade: 0.1
                                },
                                function () {
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

        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
         * */
        function getFormInfo (box)
        {
            var sendData = {},
                newsSource = "",
                newsAuthor = "",
                newsContent = null,
                arr1 = [],
                proValueSize = "",
                arrP = null,
                strId = "";

            proValueSize = $(".proValue input").size();
            for(var i=0;i<proValueSize;i++){
                if($(".proValue input").eq(i).val() != ""){
                    arr1.push($(".proValue input").eq(i).val());
                }
            }
            newsContent = UE.getEditor('myEditor').getContent();

            arrP = $(".file-list p");
            if (arrP.size() > 0)
            {
                $.each(arrP, function (i, v)
                {
                    strId += "," + $(v).attr("attachId");
                });
                strId = strId.substr(1);
            }

            sendData.id = newsId;
            sendData.title = $(".newsName").val();                              //新闻名称
            sendData.keyWord = $(".newsKeyName").val();                           //新闻关键词
            sendData.releaseTime = $(".releaseTime").val();                      //新闻发布日期
            sendData.source = $(".newsSourceVal").val();                      //新闻编辑来源
            sendData.author = $(".newsAuthorVal").val();                      //新闻编辑作者
            sendData.pichText = newsContent;  //编辑的新闻内容
            sendData.figureImg  = $(".listAddImg img").attr("src");                 //图片路
            sendData.typeId = typeId;                                  //新闻类型
            sendData.attachId = strId;                               //附件id
            if(typeId == 1){
                sendData.proId = $("#newsSelect  option:selected").val();
                sendData.dictCodeName = $("#newsSelect  option:selected").html();
                sendData.proValue = arr1.join();                                            //新闻价值
                sendData.introduction = $(".introduction").val();                     //简介

            }else if(typeId == 2){
                sendData.figureImg  = "";                 //图片路
            }else{
                sendData.introduction = $(".introduction").val();                     //简介
            }
            return sendData;
        }
        /*
        *
        * 点击图片*/
        var tbody = $(".table");
        tbody.on("click", ".listAddImg", function ()
        {
            flag = true;
            var href = "news-edit-picture.html",
                title = "图片编辑",
                data = {};
            data.typeId = typeId;
            data.addId = "";
            data.newsId = newsId;
            window.layerViewData = data;
            window.layerShow(title,href);
        });
        $(".addValue .Hui-iconfont").on("click",function () {

            var str = '<tr class="newsDelete1">'+
                    '<td class="table-key" colspan="5"><span class="c-red"></span></td>'+
                '<td colspan="30" class="has-tip major">'+
                '<div class="formControls input-tree proValue">'+
                '<input type="text" class="input-text" userMajorUnit="" con_name="userMajorUnit">'+
                '</div>'+
                '<div class="msg-tip" title="请输入正确信息"> </div>'+
                '</td>'+
                '<td class="table-key" colspan="5" style="text-align: center;font-size: 20px;cursor:pointer;"><i class="Hui-iconfont">&#xe6a1;</i></td>'+
                '</tr>';

            $(".newsIntro").before(str);
            $(".newsDelete1 .Hui-iconfont").on("click",function () {
                $(this).parent().parent().remove();
            });
        });
        //插入图片
        var imgAppend = $('<div id="edui148_body" class="imgAppend" style="width: 24px;height: 20px;cursor:pointer;position: absolute;left: 5px;top: 66px;z-index: 9999;"><img style="width:100%;height:100%;" title="图片上传" src="../../images/news/pic.png" alt=""></div>');
        var ue = UE.getEditor('myEditor', {
            initialFrameHeight:500
        });
        ue.ready( function(editor) {
            $("#edui153").css({display:"none"});
            $("#edui153_body").css({display:"none"});
            $("#edui160").css({display:"none"});
            $("#edui160_body").css({display:"none"});
            $("#edui165").css({display:"none"});
            $("#edui165_body").css({display:"none"});
            $("#edui170").css({display:"none"});
            $("#edui170_body").css({display:"none"});
            $("#edui175").css({display:"none"});
            $("#edui175_body").css({display:"none"});
            $("#edui247_body").css({display:"none"});
            $("#edui191").css({display:"none"});
            $("#edui191_state").css({display:"none"});
            $("#edui254_state").css({display:"none"});
            $("#edui255_state").css({display:"none"});
            $("#edui256_state").css({display:"none"});
            $("#edui257_state").css({display:"none"});
            $("#myEditor").find(".edui-toolbar").css({position:"relative"}).append(imgAppend);
            $(".imgAppend").on("click",function () {
                flagInser = true;
                var href = "news-add-picture.html",
                    title = "添加图片",
                    data = {};
                data.typeId = typeId;
                data.addId = "123";
                data.newsId = newsId;
                window.layerViewData = data;
                window.layerShow(title,href);
            });
        });

        /*
        * 附件上传
        * */
        uploadFile.on("change",function ()
        {
            var _this = this;

            fileUpload({
                ths: _this,
                msg: "正在上传请稍后",
                form: $("#upload"),
                fileList: $(".file-list"),
                createUrl: "general/attachmentPro/createFile",//增加地址
                infoUrl: "general/attachmentPro/createFileInfo",//返回信息地址
                delUrl: "general/attachmentPro/deleteFileById",//删除的地址
                sendData: {}
            });
        });
    });
}(jQuery, window, document));

