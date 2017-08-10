/**
 * 本文件的功能是跟踪反馈页js文件
 * @ author 张欢
 */
(function($, w, d){
	'use strict';

	$(function() {
		var treeId = parent.window.layerViewData.treeId,
			attachmentId = "",
			attachmentName = "",
			hasFile = false,
			uploadFile = $(".upload-file");


		//请求产品信息
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/dictionary/findDictionary",
			data: {"dictCode": "CP"},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					var checkbox = $(".cp"),
						arr = data.data;
					$.each(arr, function (i, v)
					{

						var label = $('<label class="col-2" ></label>'),
							ipt = $('<input name="pro" class="check ml-5" type="checkbox">');
						if (i === 0)
						{
							ipt.attr({"con_name": "planProducts", "datatype": "*",nullmsg:" ", errormsg:" "});
						}
						ipt.val(v.dictCodeValue);
						label.append(ipt);
						label.append(v.dictCodeName);
						checkbox.append(label);
						checkbox.append("\r");
					});

				}
			}
		});

		//添加40个td
		window.getTd($(".form-table"));

		//请求产品信息
		//var dictCodeValueArr = {};
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/dictionary/findDictionary",
			data: {"dictCode": "ZCFAFL"},
			success: function (data)
			{
				if (data && data.success === 0)
				{

					var checkbox = $(".fl"),
						label="",
						child="",
						arr = data.data;

					for( var i = 0; i < arr.length; i++ )
					{
							var div = $("<div class='content pt-10'></div>")
							label = '<label class="col-12 parent-lib" style="border-bottom: 1px solid #ddd;" ><input id="'+ arr[i].id + '"  name="fl" class="check ml-5 parent-check" type="checkbox" value="'+ arr[i].dictCodeValue +'" con_name="planClassify" datatype="*" nullmsg=" " errormsg=" ">'+ arr[i].dictCodeName+'<img src="../../images/commen/arro_down.png"></label>'
							div.append(label);
							div.append("\r");
							checkbox.append(div);
							//$(".check").off("click");

					};


					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "general/dictionary/findAllDictionary",
						data: {"dictCode": "ZCFAFL"},
						success: function (data)
						{
							if( data && data.success == 0)
							{
								$.each(data.data,function(i,v)
								{
									for(var i=0;i<$(".parent-lib").find("input").length;i++)
									{
										if(v.dictParentId == $($(".parent-lib").find("input")[i]).attr("id"))
										{

											child = '<label class="col-2 parent-lib pt-5" ><input cpId="'+ v.dictParentId
												+ '" name="fl" class="childCheck check ml-5" type="checkbox" value="'+ v.dictCodeValue
												+'" con_name="planClassify" >'+ v.dictCodeName+'</label>'
											$($(".parent-lib").find("input")[i]).parent().parent().append(child);
											break;

										}
									}
								})


								//子类选中父类也跟着选中
								$(".parent-lib").find(".childCheck").on('click',function()
								{
									if(this.checked)
									{
										$(this).parent().parent().find(".parent-check").prop("checked",true).blur();
									}
									else
									{
										if($(this).parent().parent().find(".col-2").find("input[type='checkbox']:checked").length <1){
											$(this).parent().parent().find(".parent-check").prop("checked",false).blur();
										}

									}

								});

							}
							
						}

					})

					$("#table-box").Validform({
						btnSubmit: ".upload-lib",
						tiptype:2,
						datatype: {
							"money": /^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/,
							"date": /^\d{4}\-\d{2}\-\d{2}$/
						},
						beforeSubmit:function(curform){
							/*
							 * 提交跟踪反馈信息
							 * */

							if (hasFile)
							{
								var sendData = {},
									planType = "";
								sendData = getFormInfo(curform);
								attachmentId = $(".file-list").find("p").attr("attachId"),
								attachmentName = $(".file-list").find("p").find("span").html();
								planType = attachmentName.split(".");
								planType = planType.pop();
								sendData.attachmentId = attachmentId;
								sendData.attachmentName = attachmentName;
								sendData.planType = planType;
								$.myAjax({
									type: "POST",
									url: window.ajaxUrl + "preSupport/planRepository/createPlanRepository",
									data: sendData,
									dataType: "json",
									success: function(msg)
									{
										if (msg && msg.success === 0)
										{
											var index = parent.layer.getFrameIndex(window.name);
											parent.window.location.replace(parent.window.location.href);
											parent.layer.close(index);
										}
										else
										{
											layer.msg('操作失败', {icon:5,time:1000});
										}
									},
									error: function(err)
									{
										layer.msg('操作失败', {icon:5,time:1000});
									}
								});
							}
							else
							{
								layer.msg('请上传附件', {icon:5,time:1000});
								return false;
							}
						},
						callback:function(form){
							return false;
						}
					});

				}
				//全选
				$(".parent-lib").find(".parent-check").on("click",function()
				{
					if(this.checked)
					{
						$(this).parent().parent().children().find(".childCheck").prop("checked",true);
					}
					else{
						$(this).parent().parent().children().find(".childCheck").prop("checked",false);
					}
				});



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
				checkboxs = null;

			for (var i= 0, len=conNames.size(); i<len; i++)
			{
				key = conNames.eq(i).attr("con_name");
				if (conNames.eq(i).attr("type") === "radio")
				{
					keyVal = $('input[con_name="prState"]:checked ').val();
				}
				else if (conNames.eq(i).attr("type") === "checkbox")
				{
					if(conNames.eq(i).attr("con_name") === "planProducts")
					{
						if(conNames.eq(i)[0].checked == true || conNames.eq(i)[0].checked == "checked")
						{
							sendData[key] +=conNames.eq(i).val()+",";
						}
					}
					else if(conNames.eq(i).attr("con_name") === "planClassify")
					{
						if(conNames.eq(i)[0].checked == true || conNames.eq(i)[0].checked == "checked")
						{
							var parengId = conNames.eq(i).attr("cpid");
							//dictCodeValueArr[parengId] = $("[id="+parengId+"]").val();
							sendData[key] += ","+conNames.eq(i).val();
						}
					}
					checkboxs = conNames.eq(i).parents(".check-box").find(".check");
					keyVal = "";
					$.each(checkboxs, function (i, v)
					{
						if ($(v)[0].checked === true)
						{
							keyVal += "," + $(v).val();
						}
					});
					keyVal = keyVal.substr(1);


				}
				else
				{
					keyVal = conNames.eq(i).val();
				}
				sendData[key] = keyVal;
			}
			/*for(var i in dictCodeValueArr)
			{
				sendData["planClassify"] += ","+dictCodeValueArr[i];
			}*/
			return sendData;
		}


		/*文件上传*/
		window.fileUpload = function (obj) {
			/*obj = {
			 ths: this,//input 类型的file
			 msg: "正在上传请稍后,请不要提交",//上传时的提示信息，没有可不传
			 form: $("#upload"),//上传文件的form
			 fileList: $(".file-list"),//展示上传完成文件的元素
			 sendData: {}//要给后台传的参数
			 }*/
			var _this = $(obj.ths),
				form = obj.form,
				options = {},
				time = 512000,
				fileName = "",
				lastModified =  "",
				fileSize = "",
				uploading = "",
				successFlag = false,
				fileList = obj.fileList,
				pArr = fileList.find("p"),
				p = $('<p></p>'),
				ind = "";
				if (!_this.val())
				{
					return false;
				}


			options={
				url:ajaxUrl +"preSupport/planRepository/create",//form提交数据的地址
				type: "POST", //form提交的方式(method:post/get)
				//target:target, //服务器返回的响应数据显示在元素(Id)号确定
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
						$('.layui-anim').removeClass("layui-anim");
						return false;
					}

					/*time = Math.ceil((fileSize/10/1024)*1000);//10kb/s 时的超时时间
					 (time > 10000) ? (time = time) : (time = 10000);*/
					this.url += "?timestamp="+ new Date().getTime();

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
					if (data)
					{
						data = JSON.parse(data);
					}

					fileName = data.content.attachName;
					if (data && data.success === 0)
					{
						hasFile = true;
						var sendData = $.extend(true, data.content, obj.sendData);
						fileList.html("");
						$.myAjax({
							type:"POST",
							url:ajaxUrl + "preSupport/attachment/createFileInfo",
							data: sendData,
							success:function(msg)
							{
								if(msg && msg.success === 0)
								{
									$(".del-button").click();
									var img = $("<img />"),
										button = $("<a class='btn btn-success radius ml-10 del-button'><i class='Hui-iconfont'>&#xe6e2</i>删除</a>"),
										prname = "",
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
										str = nameArr[nameArr.length -1],
										type = "unknown";


									successFlag = true;
									layer.close(uploading);
									form.find('input[type="file"]').val("");

									p.attr("lastModified", lastModified);
									//将attachId赋值到页面的元素，方便获取
									if (data.content.attachId)
									{
										p.attr("attachId",data.content.attachId);
									}

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
										else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpe"))
										{
											type = "png";
										}
										else
										{

										}
									});
									img.attr("src","../../images/commen/"+ type +".png");
									p.append(img);
									p.append('<span title="'+fileName+'">'+ fileName +'</span>');

									prname = fileName.split(".");
									prname.pop();
									prname = prname.join(".");
									if( fileName != $("input[con_name='prName']").html())
									{
										$("input[con_name='prName']").val(prname)
										fileList.append(p);
									}
									else
									{
										fileList.append(p);
									}

									button.on("click", function ()
									{
										var _this = $(this),
											id = $(this).parent().attr("attachId");
										$.myAjax({
											type:"POST",
											url:ajaxUrl + "preSupport/attachment/deleteFileById",
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
												$('.layui-anim').removeClass("layui-anim");
											}
										});
									});
									button.css({"display":"none"})
									p.append(button);
									fileList.append(p);
								}
							},
							error:function(msg)
							{
								ind = layer.confirm('上传失败', {
										btn: ['确定','取消'],
										shade: 0.1
									},
									function ()
									{
										layer.close(ind);
										_this.val("");
									});
								$('.layui-anim').removeClass("layui-anim");
							}

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
						$('.layui-anim').removeClass("layui-anim");
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
		uploadFile.on("change",function ()
		{
			var _this = this;

			fileUpload({
				ths: _this,
				msg: "正在上传附件",
				form: $("#upload"),
				fileList: $(".file-list"),
				sendData: {}
			});
		});


		
	});
}(jQuery, window, document));
