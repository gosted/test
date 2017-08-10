
/**
 * 本文件的功能是图片库裁剪js文件
 * @ author 彭佳明
 */
(function($, w, d){
    'use strict';
    $(function () {
        var $image = $('.img-container > img');
        var figureImg = sessionStorage.getItem("figureImg");
        var pictureId = sessionStorage.getItem("pictureId");
        var newsId = sessionStorage.getItem("newsId");
       /* $(".img-container img").attr("src",figureImg);
        $(".img-preview img").attr("src",figureImg);*/
        window.URL = window.URL || window.webkitURL;
        if (typeof history.pushState == "function") {
            var xhr = new XMLHttpRequest();
            xhr.open("post", figureImg, true);
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
        var typeId = sessionStorage.getItem("typeId"),
            number = 0;
        var getType = function(width,height){
            $("#dataWidth").val(width);
            $("#dataHeight").val(height);
        };
        if(typeId=="1"||typeId == "3"){
            num = "1.56666666666666666";
        }else if(typeId == "4"||typeId == "5"){
            num = 16/9;
        }
        var $dataHeight = 0,
            $dataWidth = 0,
            options = {
                aspectRatio: num,
                preview: '.img-preview',
                crop: function (data) {
                    switch (typeId){
                        case "1":
                            getType("500","320");
                            break;
                        case "3":
                            getType("318","200");
                            break;
                        case "4":
                            getType("320","180");
                            break;
                        case "5":
                            getType("320","180");
                            break;
                        default:
                            $dataHeight=Math.round(data.height);
                            $dataWidth=Math.round(data.width);
                            $("#dataWidth").val($dataWidth);
                            $("#dataHeight").val($dataHeight);
                            break;
                    }
                }
            };


        function renderingPage (sendData)
        {
            /*
             * 获取表格中数据
             * */
            $.myAjax({
                type: "POST",  //保存新增图片接口
                 url: window.ajaxUrl + "general/image/imageCopy",
                data: sendData,
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        if(typeId=="1"||"3"||"4"||"5"){
                            layer.msg('添加成功', {icon: 1,time:1500});
                            var id = data.data.pictureId;
                            sessionStorage.setItem("pictureId",id);
                            sessionStorage.setItem("figureImg",data.data.figureImg);
                            parent.changeMainPic();
                            setTimeout(function(){
                                var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                                parent.layer.close(index);
                            },1000)
                        }
                    }
                }
            });
        }
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
                    /*图片保存上传*/
                    if (data.method === 'getCroppedCanvas') {
                        if(Class=="btnSave"){
                            if(typeId == "1"){
                                $('#getCroppedCanvasModal').modal().find('.modal-body').html($image.cropper("getCroppedCanvas",{
                                    width:500,
                                    height:320
                                }));
                            }else if(typeId=="3"){
                                $('#getCroppedCanvasModal').modal().find('.modal-body').html($image.cropper("getCroppedCanvas",{
                                    width:318,
                                    height:200
                                }));
                            }else if(typeId == "4" || typeId == "5"){
                                $('#getCroppedCanvasModal').modal().find('.modal-body').html($image.cropper("getCroppedCanvas",{
                                    width:320,
                                    height:180
                                }));
                            }

                            $(".modal-content").css({visibility:"hidden"});
                            $(".modal-dialog").css({display:"none"});
                            $(".modal").css({zIndex:"-9999",position:"relative"});
                            $(".modal-backdrop").css({display:"none"});
                            var canvas = document.getElementsByTagName("canvas")[0];
                            var figureImg = canvas.toDataURL("image/png",1.0);
                            sendData={
                                figure:figureImg,
                                pictureId:pictureId,
                                newsId:newsId
                            };
                            renderingPage(sendData);
                        }else{
                        }
                    }
                }
            }).on('keydown', function (e) {
            });
        };
        $(".btn-cancel").on("click",function(){
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        });

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

        //================上传的实现
        var box = $(".img-container"); //拖拽区域
        box.on("drop",function(e){
            e.preventDefault(); //取消默认浏览器拖拽效果
            var fileList = e.dataTransfer.files; //获取文件对象
            //检测是否是拖拽文件到页面的操作
            //alert("dd")
            if(fileList.length == 0){
                return false;
            }
            //检测文件是不是图片
            if(fileList[0].type.indexOf('image') === -1){
                //alert("您拖的不是图片！");
                return false;
            }

            //拖拉图片到浏览器，可以实现预览功能
            var img = window.webkitURL.createObjectURL(fileList[0]);
            var filename = fileList[0].name; //图片名称
            var filesize = Math.floor((fileList[0].size)/1024);
            if(filesize>500){
                //alert("上传大小不能超过500K.");
                return false;
            }
            //alert(img);
            $image.one('built.cropper', function () {
                URL.revokeObjectURL(blobURL); // Revoke when load complete
            }).cropper('reset', true).cropper('replace', img);
        },false);

        // Import image
        var $inputImage = $('#inputImage'),
            URL = window.URL || window.webkitURL,
            blobURL;

        if (URL) {
            $inputImage.change(function () {

                var files = this.files,
                    file;

                if (files && files.length) {
                    file = files[0];
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

