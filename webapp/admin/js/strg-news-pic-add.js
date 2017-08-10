
/**
 * 本文件是设备图标添加js文件
 *  *@author 鲍哲
 */

(function($, w, d){
    'use strict';
    $(function () {
        var $image = $('.img-container > img'),
            $dataHeight = 30,
            flag = true,
            $dataWidth = 30,
            fileName = "",
            original = false,
            localImag = $("#localImag"),
            options = {
                aspectRatio: 1,
                preview: '.img-preview',
                crop: function (data) {
                    /*$dataHeight=Math.round(data.height);
                    $dataWidth=Math.round(data.width);*/
                    $("#dataWidth").val($dataWidth);
                    $("#dataHeight").val($dataHeight);
                }
            };
        function renderingPage (sendData)
        {
            /*
             * 获取表格中数据
             * */
            $.myAjax({
                type: "POST",  //保存新增图片接口
                url: window.ajaxUrl + "project/attachment/createImage",
                data: sendData,
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        var id = data.data.pictureId;
                        sessionStorage.setItem("pictureId",id);
                        sessionStorage.setItem("figureImg",data.data.figureImg);
                        sessionStorage.setItem("figureSrc",data.data.figureSrc);
                        parent.equipmentPic();
                        layer.confirm('提交成功', {
                            btn: ['确定'], //按钮
                            shade: 0.1//不显示遮罩
                        }, function(){
                            var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                            parent.layer.close(index);
                        },function(){
                            var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                            parent.layer.close(index);
                        });
                    }
                }
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
                            if(flag){
                                layer.msg("请上传图片", {icon: 2,time:1000})
                            }else{
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
                                            keyWord:keyWord
                                        };
                                        renderingPage(sendData);
                                    }
                                }else{
                                    $(".error").fadeIn();
                                }
                            }

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
                        flag = false;
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

