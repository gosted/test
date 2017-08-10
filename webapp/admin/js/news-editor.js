/**
 * 本文件的功能是图片库编辑js文件
 * @ author 彭佳明
 */
(function($, w, d){
    'use strict';
    $(function () {
        var figure = parent.window.layerViewData.figure,
            title = parent.window.layerViewData.title,
            keyWord = parent.window.layerViewData.keyWord,
            reqId = parent.window.layerViewData.reqId,
            $image = $('.img-container > img'),
            $dataHeight = 0,
            $dataWidth = 0,
            fileName = "",
            original = false,
            localImag = $("#localImag"),
            options = {
                aspectRatio:NaN,
                preview: '.img-preview',
                crop: function (data) {
                    $dataHeight=Math.round(data.height);
                    $dataWidth=Math.round(data.width);
                    $("#dataWidth").val($dataWidth);
                    $("#dataHeight").val($dataHeight);
                }
            };

        var getImg = function(){
            $(".des").find(".text").val(title);
            $(".des").find(".keywords").val(keyWord);
            window.URL = window.URL || window.webkitURL;
            if (typeof history.pushState == "function") {
                var xhr = new XMLHttpRequest();
                xhr.open("post", figure, true);
                xhr.responseType = "blob";
                xhr.onload = function() {
                    if (this.status == 200) {
                        var blob = this.response;
                        var img = document.createElement("img");
                        img.onload = function(e) {
                            window.URL.revokeObjectURL(img.src); // 清除释放
                        };
                        var blobURL = window.URL.createObjectURL(blob);
                        $image.one('built.cropper', function () {
                            URL.revokeObjectURL(blobURL); // Revoke when load complete
                        }).cropper('reset', true).cropper('replace', blobURL);
                    }
                };
                xhr.send();
            } else {};
            /*$image.attr("src",figure);*/
        };
        getImg();

        $(".btn-group button").on("click", function()
        {
            original = false;
            localImag.removeClass("original");
            $("#uploadImgfile").val("");
        });
        $(".btn-group .icon-upload").on("click", function()
        {
            original = false;
            localImag.removeClass("original");
            $("#uploadImgfile").val("");
        });

        //下面用于图片上传预览功能
        function setImagePreview(avalue) {
            var docObj=document.getElementById("uploadImgfile");

            var imgObjPreview=document.getElementById("preview");
            if(docObj.files &&docObj.files[0])
            {
                //火狐下，直接设img属性
                //imgObjPreview.style.display = 'block';
                //imgObjPreview.style.width = '150px';
                //imgObjPreview.style.height = '180px';
                //imgObjPreview.src = docObj.files[0].getAsDataURL();

                //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
                imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
            }
            else
            {
                //IE下，使用滤镜
                docObj.select();
                var imgSrc = document.selection.createRange().text;
                var localImagId = document.getElementById("localImag");
                //必须设置初始大小
                //localImagId.style.width = "150px";
                //localImagId.style.height = "180px";
                //图片异常的捕捉，防止用户修改后缀来伪造图片
                try{
                    localImagId.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                    localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
                }
                catch(e)
                {
                    layer.confirm('您上传的图片格式不正确，请重新选择!', {
                        btn: ['确定'],
                        shade: 0.1
                    });
                    return false;
                }
                imgObjPreview.style.display = 'none';
                document.selection.empty();
            }
            return true;
        }

        $("#uploadImgfile").on("change", function(){
            original = true;
            localImag.addClass("original");
            setImagePreview();
        });
        function renderingPage (sendData)
        {
            /*
             * 获取表格中数据
             * */
            $.myAjax({
                type: "POST",  //保存编辑图片接口
                url: window.ajaxUrl + "general/image/update",
                data: sendData,
                success: function (data)
                {
                    if (data && data.success === 0)
                    {

                        layer.confirm('提交成功', {
                            btn: ['确定','继续添加'], //按钮
                            shade: 0.1//不显示遮罩
                        }, function(){
                            parent.window.location.replace(parent.window.location);
                        }, function(){
                            window.location.replace("news-pic-add.html");
                        });
                    }
                }
            });
        }

        function renderingPageTwo ()
        {
            /*文件上传*/
            function imgUpload(obj) {
                /*obj = {
                 ths: $(this),//input 类型的file
                 msg: "正在上传请稍后,请不要提交",//上传时的提示信息，没有可不传
                 form: $("#upload"),//上传文件的form
                 createUrl: "",//增加地址
                 sendData: {}//要给后台传的参数
                 }*/
                var _this = obj.ths,
                    form = obj.form,
                    options = {},
                    time = 1500000,
                    fileName = "",
                    lastModified =  "",
                    fileSize = "",
                    uploading = "",
                    ind = "";

                if (!_this.val())
                {
                    return false;
                }
                var ses = window.getRequestHeader();
                options={
                    url: obj.createUrl, //form提交数据的地址
                    type: "POST", //form提交的方式(method:post/get)
                    data: obj.sendDate,
                    //target:target, //服务器返回的响应数据显示在元素(Id)号确定
                    beforeSend: function(xhr)
                    {
                        xhr.setRequestHeader("authorization",ses);
                        xhr.setRequestHeader("If-Modified-Since","0");
                        xhr.setRequestHeader("Cache-Control","no-cache");
                        this.url += "?timestamp="+ new Date().getTime();
                    },
                    beforeSubmit: function(arr){
                        var uploadFlag = false;

                        fileName = arr[0].value.name;
                        lastModified =  arr[0].value.lastModified;
                        fileSize = arr[0].value.size;
                        uploadFlag = (fileSize > 50*1024*1024) ? true : false;
                        if (uploadFlag)
                        {
                            ind = layer.confirm('文件大小不能超过50M', {
                                    btn: ['确定','取消'],
                                    shade: 0.1
                                },
                                function ()
                                {
                                    layer.close(ind);
                                    _this.val("");
                                });
                            return false;
                        }

                        if (obj.msg)
                        {
                            uploading = layer.msg(obj.msg, {
                                time: 0,
                                icon: 16
                                ,shade: 0.1
                            });
                        }
                    }, //提交前执行的回调函数
                    success:function(data){
                        if (data && data.success === 0)
                        {

                            layer.confirm('提交成功', {
                                btn: ['确定'], //按钮
                                shade: 0.1//不显示遮罩
                            }, function(){
                                parent.window.location.replace(parent.window.location);
                            }, function(){
                                window.location.replace(parent.window.location);
                            });
                        }

                    }, //提交成功后执行的回调函数
                    error:function(XmlHttpRequest,textStatus,errorThrown){
                        if (XmlHttpRequest.status === 504)
                        {
                            ind = layer.confirm('文件上传超时', {
                                    btn: ['确定'],
                                    shade: 0.1
                                },
                                function ()
                                {
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
            /*文件上传结束*/

            var title = $(".des").find(".text").val();
            var keyWord = $(".des").find(".keywords").val();
            var sendDate = {};

            sendDate.title = title;
            sendDate.keyWord = keyWord;
            sendDate.pictureId = reqId;
            imgUpload({
                ths: $("#uploadImgfile"),
                form: $("#uploadImg"),
                createUrl: window.ajaxUrl + "general/image/updateOrig",
                sendDate: sendDate,
                msg: "请稍后"
            });
        }
        //**图片保存上传**//
        var setImg = function(){
            $(document.body).on('click', '[data-method]', function () {
                var data = $(this).data(),
                    $target,
                    result,
                    sendData={};
                var Class=$(this).attr("data-name");
                if (data.method) {
                    data = $.extend({}, data); // Clone a new one
                    if (typeof data.target !== 'undefined') {
                        $target = $(data.target);
                        if (typeof data.option === 'undefined') {
                            try {
                                data.option = JSON.parse($target.val());
                            } catch (e) {

                            }
                        }
                    }
                    result = $image.cropper(data.method, data.option);
                    if (data.method === 'getCroppedCanvas') {
                        if(Class=="btnSave"){
                            if($(".des").find(".text").val()!=""){
                                if($("#dataWidth").val()!=""){
                                    $dataWidth = $("#dataWidth").val();
                                }
                                if($("#dataHeight").val()!=""){
                                    $dataHeight = $("#dataHeight").val();
                                }
                                $('#getCroppedCanvasModal').modal().find('.modal-body').html($image.cropper("getCroppedCanvas",{
                                    width:$dataWidth,
                                    height:$dataHeight
                                }));
                                $(".modal-content").css({visibility:"hidden"});
                                $(".modal-dialog").css({display:"none"});
                                $(".modal").css({zIndex:"-9999",position:"relative"});
                                $(".modal-backdrop").css({display:"none"});
                                if (original && localImag.hasClass("original"))
                                {
                                    renderingPageTwo();
                                }
                                else
                                {
                                    var canvas = document.getElementsByTagName("canvas")[0];
                                    var figure = canvas.toDataURL("image/png",1.0);
                                    var title = $(".des").find(".text").val();
                                    var keyWord = $(".des").find(".keywords").val();
                                    sendData={
                                        figure:figure,
                                        title:title,
                                        keyWord:keyWord,
                                        pictureId:reqId
                                    };
                                    renderingPage(sendData);
                                }

                            }else{
                                $(".error").fadeIn();
                            }
                        }else{
                        }
                    }
                }
            }).on('keydown', function (e) {
            });
            //错误提示
            $(".des .text").on("focus",function(){
                $(".error").fadeOut();
            });
            $(".des .text").on("blur",function(){
                if($(".des").find(".text").val()==""){
                    $(".error").fadeIn();
                }else{
                    $(".error").fadeOut();
                }

            })
        };
        // 裁剪框拖拽事件的回调
        $image.on({
            'build.cropper': function (e) {
            },
            'built.cropper': function (e) {
            },
            'dragstart.cropper': function (e) {
            },
            'dragmove.cropper': function (e) {
                //setImg();
            },
            'dragend.cropper': function (e) {
            },
            'zoomin.cropper': function (e) {
            },
            'zoomout.cropper': function (e) {
            }
        }).cropper(options);
        /*$image.cropper("setAspectRatio", "1.55555566666666");*/
        setImg();
        //***实现拖拽预览图片功能**//
        $(document).on({
            dragleave:function(e){      //拖离
                e.preventDefault();
            },
            drop:function(e){           //拖后放
                e.preventDefault();
            },
            dragenter:function(e){      //拖进
                e.preventDefault();
            },
            dragover:function(e){       //拖来拖去
                e.preventDefault();
            }
        });
        var dropbox = $('#dropbox'),
            message = $('.message', dropbox);

        dropbox.filedrop({
            paramname:'pic',
            maxfiles: 5,
            maxfilesize: 2,
            url: '',

            uploadFinished:function(i,file,response){
                $.data(file).addClass('done');
            },

            error: function(err, file) {
                switch(err) {
                    case 'BrowserNotSupported':
                        break;
                    case 'TooManyFiles':
                        break;
                    case 'FileTooLarge':
                        break;
                    default:
                        break;
                }
            },
            beforeEach: function(file){
                if(!file.type.match(/^image\//)){
                    return false;
                }
            },
            uploadStarted:function(i, file, len){
                createImage(file);
            },
            progressUpdated: function(i, file, progress) {
                $.data(file).find('.progress').width(progress);
            }
        });
        var template = '';
        function createImage(file){
            var preview = $(template),
                image = $('img', preview);
            fileName = file.name;
            var reader = new FileReader();

            image.width = 100;
            image.height = 100;

            reader.onload = function(e){
                image.attr('src',e.target.result);
                $(".img-container img").attr("src",e.target.result);
                $(".img-preview img").attr("src",e.target.result);
            };
            reader.readAsDataURL(file);
            message.hide();
            preview.appendTo(dropbox);
            $.data(file,preview);
        }

        function showMessage(msg){
            message.html(msg);
        }
        // 图片上传事件
        var $inputImage = $('#inputImage'),
            URL = window.URL || window.webkitURL,
            blobURL;

        if (URL) {
            $inputImage.change(function () {

                var files = this.files,
                    file;

                if (files && files.length) {
                    file = files[0];
                    fileName = file.name;
                    if (/^image\/\w+$/.test(file.type)) {
                        blobURL = URL.createObjectURL(file);
                        $image.one('built.cropper', function () {
                            URL.revokeObjectURL(blobURL); // Revoke when load complete
                        }).cropper('reset', true).cropper('replace', blobURL);

                        $inputImage.val('');
                    } else {
                        layer.confirm('请选择图片类型的文件', {
                                btn: ['确定'],
                                shade: 0.1
                            },
                            function () {
                                $(".layui-layer-shade").css({display:"none"});
                                $(".layui-layer").css({display:"none"});
                            });
                    }
                }
            });
        } else {
            $inputImage.parent().remove();
        }
    });

}(jQuery, window, document));

