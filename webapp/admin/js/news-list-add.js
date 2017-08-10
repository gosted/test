/**
 * 本文件的功能是新闻列表添加js文件
 * @ author 李明
 */
(function($, w, d){
    'use strict';

    $(function() {
        var typeId = parent.window.layerViewData.typeId,
            newsId = parent.window.layerViewData.newsId,
            flagInser = false,
            flag = false,
            uploadFile = $(".upload-file"),
            newsContent = "";
        //添加40个td
        window.getTd($(".form-table"));

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
                    url: window.ajaxUrl + "general/news/create",
                   /* url: window.ajaxUrl + "data/news/proValue.json",*/
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


            sendData.title = $(".newsName").val();                              //新闻名称
            sendData.keyWord = $(".newsKeyName").val();                           //新闻关键词
            sendData.releaseTime = $(".releaseTime").val();                      //新闻发布日期
            sendData.source = $(".newsSourceVal").val();                      //新闻编辑来源
            sendData.author = $(".newsAuthorVal").val();                      //新闻编辑作者
            sendData.pichText = newsContent;  //编辑的新闻内容
            sendData.figureImg  = $(".listAddImg img").attr("src");                 //图片路
            sendData.typeId = typeId;                                  //新闻类型
            sendData.attachId = strId;                               //附件id
            sendData.id = newsId;
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

        var tbody = $(".table");

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

        //点击图片
        tbody.on("click", ".listAddImg", function ()
        {
            flag = true;
            var href = "news-add-picture.html",
                // title = $(this).attr("title"),
                title = "添加图片",
                data = {};
            data.typeId = typeId;
            data.newsId = newsId;
            data.addId = "";
            window.layerViewData = data;
            window.layerShow(title,href);
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

