$(function () {

	'use strict';

	var console = window.console || { log: function () {} },
		$alert = $('.docs-alert'),
		$message = $alert.find('.message'),
		showMessage = function (message, type) {
			$message.text(message);

			if (type) {
				$message.addClass(type);
			}

			$alert.fadeIn();

			setTimeout(function () {
				$alert.fadeOut();
			}, 3000);
		};

	// Demo
	// -------------------------------------------------------------------------

	(function () {
		var $image = $('.img-container > img'),
			$dataX = $('#dataX'),
			$dataY = $('#dataY'),
			$dataHeight = $('#dataHeight'),
			$dataWidth = $('#dataWidth'),
			$dataRotate = $('#dataRotate'),
			options = {
				// strict: false,
				// responsive: false,
				// checkImageOrigin: false

				// modal: false,
				// guides: false,
				// highlight: false,
				// background: false,

				// autoCrop: false,
				// autoCropArea: 0.5,
				// dragCrop: false,
				// movable: false,
				// resizable: false,
				// rotatable: false,
				// zoomable: false,
				// touchDragZoom: false,
				// mouseWheelZoom: false,

				// minCanvasWidth: 320,
				// minCanvasHeight: 180,
				//minCropBoxWidth: 600,
				// minCropBoxHeight: 90,
				// minContainerWidth: 320,
				// minContainerHeight: 180,

				// build: null,
				// built: null,
				// dragstart: null,
				// dragmove: null,
				// dragend: null,
				// zoomin: null,
				// zoomout: null,

				aspectRatio: 4 / 3,
				preview: '.img-preview',
				crop: function (data) {
					$dataX.val(Math.round(data.x));
					$dataY.val(Math.round(data.y));
					$dataHeight.val(Math.round(data.height));
					$dataWidth.val(Math.round(data.width));
					$dataRotate.val(Math.round(data.rotate));
				}
			};

		$image.on({
			'build.cropper': function (e) {
			},
			'built.cropper': function (e) {

			},
			'dragstart.cropper': function (e) {

			},
			'dragmove.cropper': function (e) {

			},
			'dragend.cropper': function (e) {

			},
			'zoomin.cropper': function (e) {

			},
			'zoomout.cropper': function (e) {

			}
		}).cropper(options);
		// Methods
		$image.cropper("setAspectRatio", "1.55555566666666");
		/*$(document.body).on('click', '[data-method]', function () {
			var data = $(this).data(),
				$target,
				result;
			var Class=$(this).attr("data-name");
			if (data.method) {
				data = $.extend({}, data); // Clone a new one
				if (typeof data.target !== 'undefined') {
					$target = $(data.target);
					if (typeof data.option === 'undefined') {
						try {
							data.option = JSON.parse($target.val());
						} catch (e) {
							console.log(e.message);
						}
					}
				}

				result = $image.cropper(data.method, data.option);
				if (data.method === 'getCroppedCanvas') {
					if(Class=="btnSave"){
						if($(".des").find(".text").val()!=""){
							$('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
							/!*$(".modal-content").css({visibility:"hidden"});
							 $(".modal-dialog").css({display:"none"});
							 $(".modal-backdrop").css({display:"none"});
							 $("#getCroppedCanvasModal").css({zIndex:"-9999",display:"none"});*!/
							$(".modal-body canvas").css({height:320,width:500});
							var canvas = document.getElementsByTagName("canvas")[0];
							var base64 = canvas.toDataURL("image/png",1.0);
						}else{
							/!*alert("成功")*!/
						}

					}else{

					}

				}
				if ($.isPlainObject(result) && $target) {
					try {
						$target.val(JSON.stringify(result));
					} catch (e) {
						console.log(e.message);
					}
				}

			}
		}).on('keydown', function (e) {

			switch (e.which) {
				case 37:
					e.preventDefault();
					$image.cropper('move', -1, 0);
					break;

				case 38:
					e.preventDefault();
					$image.cropper('move', 0, -1);
					break;

				case 39:
					e.preventDefault();
					$image.cropper('move', 1, 0);
					break;

				case 40:
					e.preventDefault();
					$image.cropper('move', 0, 1);
					break;
			}

		});*/
		$(document).on({
			dragleave:function(e){		//拖离
				e.preventDefault();
			},
			drop:function(e){			//拖后放
				e.preventDefault();
			},
			dragenter:function(e){		//拖进
				e.preventDefault();
			},
			dragover:function(e){		//拖来拖去
				e.preventDefault();
			}
		});

		//================上传的实现
		var box = $(".img-container"); //拖拽区域
		box.on("drop",function(e){
			e.preventDefault(); //取消默认浏览器拖拽效果
			var fileList = e.dataTransfer.files; //获取文件对象
			//检测是否是拖拽文件到页面的操作
			alert("dd")
			if(fileList.length == 0){
				return false;
			}
			//检测文件是不是图片
			if(fileList[0].type.indexOf('image') === -1){
				alert("您拖的不是图片！");
				return false;
			}

			//拖拉图片到浏览器，可以实现预览功能
			var img = window.webkitURL.createObjectURL(fileList[0]);
			var filename = fileList[0].name; //图片名称
			var filesize = Math.floor((fileList[0].size)/1024);
			if(filesize>500){
				alert("上传大小不能超过500K.");
				return false;
			}
			alert(img);
			$(".img-container img").attr("src",img);
			/*var str = "<img src='"+img+"'><p>图片名称："+filename+"</p><p>大小："+filesize+"KB</p>";*/
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
						layer.confirm('请选择图片类型文件', {
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

		// Options
		$('.docs-options :checkbox').on('change', function () {
			var $this = $(this);
			options[$this.val()] = $this.prop('checked');
			$image.cropper('destroy').cropper(options);
		});

		// Tooltips
		$('[data-toggle="tooltip"]').tooltip();

	}());

});
