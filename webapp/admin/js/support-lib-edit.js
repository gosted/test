/**
 * 本文件的功能是跟踪反馈页js文件
 * @ author 陈安
 */

(function($, w, d){
	'use strict';

	$(function() {

		var libId = parent.window.layerViewData.libId,
			attachmentId = "",
			attachmentName,
			hasFile = false,
			uploadFile = $(".upload-file");
		window.getTd($("#table-box").find("table"));
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
						var label = $('<label  class="col-2 text-l"></label>'),
							ipt = $('<input name="pro" type="checkbox">');
						if (i === 0)
						{
							ipt.attr({"datatype": "*","nullmsg":" ","errormsg":" "});
						}
						ipt.attr({"con_name": "planProducts"});
						ipt.val(v.dictCodeValue);
						label.append(ipt);
						label.append(v.dictCodeName);
						checkbox.append(label);
						//checkbox.append("\r");
					});
					//请求已有信息
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "preSupport/planRepository/findById",
						data: {"id": libId},
						success: function (data)
						{
							if (data && data.success === 0)
							{
								var box = $("#libAdd");

								setFormInfo(box,data);
							}
						}
					});
				}
			}
		});
		//请求分类信息
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
						var div = $("<div class='content pt-10'></div>") //请求分类信息父级 例如产品 行业
						label = '<label class="col-12 parent-lib bz" style="border-bottom: 1px solid #ddd;" ><input id="'+ arr[i].id + '"  name="fl" class="check mr-5 parent-check" type="checkbox" value="'+ arr[i].dictCodeValue +'" con_name="planClassify" >'+ arr[i].dictCodeName+'<img src="../../images/commen/arro_down.png"></label>'
						div.append(label);
						div.append("\r");
						checkbox.append(div);
						//$(".check").off("click");

					};

					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "general/dictionary/findAllDictionary",  //请求到所有分类信息
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

											child = '<label class="col-2 parent-lib pt-5" ><input cpId="'
												+ v.dictParentId + '" name="fl" class="childCheck check mr-5" type="checkbox" ' +
												'value="'+ v.dictCodeValue +'" con_name="planClassify">'+ v.dictCodeName+'</label>'
											$($(".parent-lib").find("input")[i]).parent().parent().append(child);
											break;

										}
									}
								})


							}

							//子类选中父类也跟着选中
							$(".parent-lib").find(".childCheck").on('click',function()
							{
								if(this.checked)
								{
									$(this).parent().parent().find(".parent-check").prop("checked",true);
								}
								else
								{
									if($(this).parent().parent().find(".col-2").find("input[type='checkbox']:checked").length <1){
										$(this).parent().parent().find(".parent-check").prop("checked",false);
									}

								}

							});

							//分类全选
							$(".parent-lib").find(".parent-check").on("click",function()
							{
								if(this.checked)
								{
									$(this).parent().parent().children().find(".childCheck").prop("checked",true);
								}
								else{
									$(this).parent().parent().children().find(".childCheck").prop("checked",false);
								}
							})

							//选中子类,父类选中



							//请求已有信息
							$.myAjax({
								type: "POST",
								url: window.ajaxUrl + "preSupport/planRepository/findById",
								data: {"id": libId},
								success: function (data)
								{
									if (data && data.success === 0)
									{
										var box = $("#libAdd"),
											container = $(".file-list"),
											list = $('<div class="list"></div>'),
											td3 = $("<span><span/>"),
											textareaNum = "",
											img = $("<img>");
										attachmentId = data.data.attachmentId;
										attachmentName = data.data.attachmentName;
										if(attachmentName.indexOf("doc") != -1)
										{
											img.attr("src","../../images/commen/doc.png");
										}
										else if(attachmentName.indexOf("ppt") != -1)
										{
											img.attr("src","../../images/commen/ppt.png");
										}
										else if(attachmentName.indexOf("xls") != -1)
										{
											img.attr("src","../../images/commen/xlsx.png");
										}
										else if(attachmentName.indexOf("zip") != -1)
										{
											img.attr("src","../../images/commen/zip.png");
										}
										else if(attachmentName.indexOf("xlsx") != -1)
										{
											img.attr("src","../../images/commen/xlsx.png");
										}
										else if(attachmentName.indexOf("txt") != -1)
										{
											img.attr("src","../../images/commen/txt.png");
										}
										else if(attachmentName.indexOf("avi") != -1)
										{
											img.attr("src","../../images/commen/video.png");
										}
										else if(attachmentName.indexOf("pdf") != -1)
										{
											img.attr("src","../../images/commen/pdf.png");
										}
										else if(attachmentName.indexOf("png") != -1)
										{
											img.attr("src","../../images/commen/png.png");
										}
										else if(attachmentName.indexOf("mp3") != -1)
										{
											img.attr("src","../../images/commen/mp3.png");
										}
										else if(attachmentName.indexOf("mp4") != -1)
										{
											img.attr("src","../../images/commen/mp4.png");
										}
										else if(attachmentName.indexOf("html") != -1)
										{
											img.attr("src","../../images/commen/htm.png");
										}
										else
										{
											img.attr("src","../../images/commen/unknown.png");
										}
										td3.html(attachmentName);
										list.append(img);
										list.append(td3);
										container.attr("attachid",attachmentId);
										container.attr("attachmentName",attachmentName);
										container.append(list);
										if(data.data.prState && data.data.prState == 1){
											$(".radio_box_jy").attr("checked","checked");//启用禁用
										}
										else{
											$(".radio_box_qy").attr("checked","checked");
										}
										textareaNum = $('textarea[con_name = "prRemark"]').val().length;
										$(".textarea-numberbar").find(".textarea-length").text(textareaNum); //回显文本域文字个数
										setFormInfo(box,data);

									}
								}
							});
						}
					})
				}
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
				if (keyVal)
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
			btnSubmit: ".ProgramSubmitButton",
			tiptype:2,
			datatype: {
				"money": /^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/,
				"date": /^\d{4}\-\d{2}\-\d{2}$/
			},
			beforeSubmit:function(curform)
			{
				var conNames = curform.find('[con_name]'),
					planType = "",
					key = "",
					keyVal = "",
					sendData = {},
					attachmentName = "",
					checkboxs = null;
				attachmentName = $(".file-list").find("span").text();
				planType = attachmentName.split(".");
				planType = planType.pop();
				sendData["attachmentId"] = $(".file-list").attr("attachid");
				sendData["attachmentName"] = attachmentName;
				sendData["planType"] = planType;

				for (var i= 0, len=conNames.size(); i<len; i++)
				{
					key = conNames.eq(i).attr("con_name");
					if (conNames.eq(i).attr("type") === "radio")
					{
						keyVal = $('input[name="prState"]:checked').val();
						sendData[key] = keyVal;
					}
					else if (conNames.eq(i).attr("type") === "checkbox")
					{
						if(conNames.eq(i).attr("con_name") === "planProducts")
						{
							if(conNames.eq(i)[0].checked == true || conNames.eq(i)[0].checked == "checked")
							{
								sendData[key] += conNames.eq(i).val()+",";
							}
						}
						else if(conNames.eq(i).attr("con_name") === "planClassify")
						{
							if(conNames.eq(i)[0].checked == true || conNames.eq(i)[0].checked == "checked")
							{
								var parengId = conNames.eq(i).attr("cpid");
								//dictCodeValueArr[parengId] = $("[id="+parengId+"]").val();
								sendData[key] += conNames.eq(i).val()+",";
							}
						}
					}
					else
					{
						keyVal = conNames.eq(i).val();
						sendData[key] = keyVal;
					}
				}
				//for(var i in dictCodeValueArr)
				//{
				//	sendData["planClassify"] += dictCodeValueArr[i]+",";
				//}
				sendData["planClassify"] = sendData["planClassify"].substring(9,sendData["planClassify"].length-1);
				sendData["planProducts"] = sendData["planProducts"].substring(9,sendData["planProducts"].length-1);
				sendData["id"] = libId;
				updateInfo(sendData);

			},
			callback:function(form){
				return false;
			}
		});

		function updateInfo(sendData)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "preSupport/planRepository/update",
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
				},
				error: function(err)
				{
					console.log("err",err);
				}
			});
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
