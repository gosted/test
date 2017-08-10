/**
   * 本文件的功能是发起支撑页js文件
   *@author 陈安
   */
(function($, w, d){
	'use strict';
	$(function()
	{
		var dataObj = "",
			reqId,
			typeFlag = "",
			typeValue = "",
			arrP,
			taskId,
			timeFlag = true,				//结束事件是否大于开始时间的变量判断
			saveFlag = true,				//保存数据的多次点击判断
			createTrFlag = true,
			uploadFile = $(".upload-file"),
			processInstanceId;
		window.getTd($(".form-table"));
		//验证时间区间代码,失去焦点后改变变量timeFlag
		$("[con_name='reqSupEndTime']").on("blur",function()
		{
			if($(this).val()>=$(this).parents("table").find("[con_name='reqSupBeginTime']").val())
			{
				timeFlag = true;
			}
			else
			{
				timeFlag = false;
			}
		})
		$("[con_name='reqSupBeginTime']").on("blur",function()
		{
			if($(this).val()<=$(this).parents("table").find("[con_name='reqSupEndTime']").val())
			{
				timeFlag = true;
			}
			else
			{
				timeFlag = false;
			}
		})
		uploadFile.on("change",function ()
		{
			var _this = this;

			fileUpload({
				ths: _this,
				msg: "正在上传文件",
				form: $("#upload"),
				fileList: $(".file-list"),
				sendData: {}
			});
		});
        $.myAjax({
        	type:"POST",
        	url:window.ajaxUrl + "preSupport/requirements/findDefaultInfo",
        	success:function(data)
        	{
        		if(data.success === 0)
        		{
        			$("[con_name='unitId']").val(data.data.unitName);
        			$("[con_name='unitId']").attr({"unitId":data.data.unitId});
        		}
        	}
        });
        
        /*功能需求获取方法*/
        $.myAjax({
        	type:"POST",
        	url:window.ajaxUrl + "preSupport/plan/findDictionary",
        	async:true,
        	data:{
        		"dictCode":"CP"
        	},
        	success:function(data)
        	{
        		if(data.success === 0)
        		{
        			var list = data.data;
        			for(var j=0;j<$(".require").length;j++)
        			{
        				for(var i=0;i<list.length;i++)
	        			{
	        				var label = $("<label></label>");
	        				label.addClass("col-2");
	        				$($(".require")[j]).append(label);
	        				if(i==0)
	        				{
	        					label.html("<input type='checkbox' name='user-Character-0-0-0' id='user-Character-0-0-0' con_name='functionId' value='"+list[i].dictCodeValue+"' checkboxid='"+list[i].id+"'>"+list[i].dictCodeName);
	        				}
	        				else
	        				{
	        					label.html("<input type='checkbox' name='user-Character-0-0-0' id='user-Character-0-0-0' con_name='functionId' value='"+list[i].dictCodeValue+"' checkboxid='"+list[i].id+"'>"+list[i].dictCodeName);
	        				}
	        			}
        			}
        			renderPage();
        		}
        	}
        });
        $($(".formOne").find("[type=radio]")[i]).on("click",docuChange);
        if(parent.window.layerViewData == undefined)
		{
			reqId ="";
			taskId ="";
			processInstanceId = "";
		}
		else
		{
			reqId = parent.window.layerViewData.reqId;
            taskId = parent.window.layerViewData.taskId,
            processInstanceId = parent.window.layerViewData.processInstanceId;
            $.myAjax(
			{
				type:"POST",
				url:window.ajaxUrl + "preSupport/requirements/findById",
				data:{"id":reqId},
				success:function(data)
				{
					if(data.success === 0)
					{
						var list = data.data;
						if(list)
						{
							$("[con_name='customerContacts']").val(list.customerContacts);
		        			$("[con_name='customerPhone']").val(list.customerPhone);
		        			$("[con_name='customerEmail']").val(list.customerEmail);
		        			$("[con_name='areaId']").attr({"areaId":list.areaId});
		        			$("[con_name='reqCode']").val(list.reqCode);
							var attachmentId = data.data.attachmentId;
							if (attachmentId)
							{
								$.myAjax({
									type: "POST",
									url: window.ajaxUrl + "preSupport/attachment/findByIds",
									data: {"ids": attachmentId},
									success: function (data)
									{
										if (data && data.success === 0)
										{
											var attachid = "";
											for(var i=0;i<data.data.length;i++)
											{
												attachid += data.data[i].attachId + ",";
											}
											attachid = attachid.substring(0,attachid.length-1);
											$(".attachId").attr("attachid",attachid);
											fileData(data);
										}
									}
								});
							}
							dataObj = list;
							for(var i=0;i<$("[con_name=reqSupType]").length;i++)
							{
								if(list.reqSupType == 0)
								{
									$("[con_name=reqSupType]")[0].checked = 'checked';
									typeFlag = typeValue = 0;
								}
								else if(list.reqSupType == 1)
								{
									$("[con_name=reqSupType]")[1].checked = "checked";
									typeFlag = typeValue = 1;
								}
								else if(list.reqSupType == 2)
								{
									$("[con_name=reqSupType]")[2].checked = "checked";
									typeFlag = typeValue = 2;
								}
								else if(list.reqSupType == 3)
								{
									$("[con_name=reqSupType]")[3].checked = "checked";
									typeFlag = typeValue = 3;
								}
								
								break;
							}
							renderPage();
						}
					}
				}
				
			});
		}
        for(var i=0,len=$(".steeing").find("span").length;i<len;i++)		//向导栏的单击切换页面
        {
        	if($($(".steeing").find("span")[i]).html() == "完成")
        	{
        		
        	}
        	else
        	{
        		$($(".steeing").find("span")[i]).on("click",tabChange);
        	}
        }
		
		/*根据获取到的参数进行页面渲染*/
		function renderPage()
		{
			$("[con_name='reqName']").val(dataObj.reqName);
			$("[con_name='reqOutline']").val(dataObj.reqOutline);
			$("[con_name='reqOutline']").siblings("p").find("em").text($("[con_name='reqOutline']").val().length);
			$("[con_name='reqDetail']").val(dataObj.reqDetail);
			$("[con_name='reqDetail']").siblings("p").find("em").text($("[con_name='reqDetail']").val().length);
			$("[con_name='customerPhone']").val(dataObj.customerPhone);
			$("[con_name='customerEmail']").val(dataObj.customerEmail);
			$("[con_name='customerContacts']").val(dataObj.customerContacts);
			if(dataObj.reqSupType == 0)
			{
				var _time = new Date(dataObj.reqExpectEndTime);
					_time = window.formatDate(_time);
				$("#projectPage").find("[con_name='reqExpectEndTime']").val(_time);
				$("#projectPage").find("[con_name='customerName']").val(dataObj.customerName);
				$("#projectPage").find("[con_name='reqProExpectRevenue']").val(dataObj.reqProExpectRevenue);
				$("#projectPage").find("[con_name='reqProCycle']").val(dataObj.reqProCycle);
				$("#projectPage").find("[con_name='reqProSiteNum']").val(dataObj.reqProSiteNum);
				$("#projectPage").find("[con_name='reqProWorkerNum']").val(dataObj.reqProWorkerNum);
				$("#projectPage").find("[con_name='reqSupAddress']").val(dataObj.reqSupAddress);
				for(var i=0;i<$("[con_name='reqIsConstruct']").length;i++)
	         	{
	         		if(dataObj.reqIsConstruct == 0)
	         		{
	         			$("#projectPage").find("[con_name='reqIsConstruct']")[0].checked = "checked";
	         		}
	         		else if(dataObj.reqIsConstruct == 1)
	         		{
	         			$("#projectPage").find("[con_name='reqIsConstruct']")[1].checked = "checked";
	         		}
	         		else if(dataObj.reqIsConstruct == 2)
	         		{
	         			$("#projectPage").find("[con_name='reqIsConstruct']")[2].checked = "checked";
	         		}
	         	}
	         	for(var i=0;i<$("[con_name='reqProProperty']").length;i++)
	         	{
	         		if(dataObj.reqProProperty == 0)
	         		{
	         			$("#projectPage").find("[con_name='reqProProperty']")[0].checked = "checked";
	         		}
	         		else if(dataObj.reqProProperty == 1)
	         		{
	         			$("#projectPage").find("[con_name='reqProProperty']")[1].checked = "checked";
	         		}
	         		else if(dataObj.reqProProperty == 2)
	         		{
	         			$("#projectPage").find("[con_name='reqProProperty']")[2].checked = "checked";
	         		}
	         	}
	         	rennderFunctionId($("#projectPage"));
			}
			else if(dataObj.reqSupType == 1)
			{
				var _timeBegin = window.formatDates(dataObj.reqSupBeginTime);
				var _timeEnd = window.formatDates(dataObj.reqSupEndTime);
				$("#showPage").find("[con_name='reqSupBeginTime']").val(_timeBegin);
				$("#showPage").find("[con_name='reqSupEndTime']").val(_timeEnd);
				$("#showPage").find("[con_name='reqSupPeople']").val(dataObj.reqSupPeople);
				$("#showPage").find("[con_name='reqSupPeopleNum']").val(dataObj.reqSupPeopleNum);
				$("#showPage").find("[con_name='reqSupAddress']").val(dataObj.reqSupAddress);
				$("#showPage").find("[con_name='reqEventName']").val(dataObj.reqEventName);
				rennderFunctionId($("#showPage"));
			}
			else if(dataObj.reqSupType == 2)
			{
				var _timeBegin = window.formatDates(dataObj.reqSupBeginTime);
				var _timeEnd = window.formatDates(dataObj.reqSupEndTime);
				$("#trainPage").find("[con_name='reqSupBeginTime']").val(_timeBegin);
				$("#trainPage").find("[con_name='reqSupEndTime']").val(_timeEnd);
				$("#trainPage").find("[con_name='reqSupPeople']").val(dataObj.reqSupPeople);
				$("#trainPage").find("[con_name='reqSupPeopleNum']").val(dataObj.reqSupPeopleNum);
				$("#trainPage").find("[con_name='reqSupAddress']").val(dataObj.reqSupAddress);
				$("#trainPage").find("[con_name='reqEventName']").val(dataObj.reqEventName);
                rennderFunctionId($("#trainPage"));			
			}
			else if(dataObj.reqSupType == 3)
			{
				var _time = new Date(dataObj.reqExpectEndTime);
					_time = window.formatDate(_time);
				$("#restsPage").find("[con_name='reqExpectEndTime']").val(_time);
				$("#restsPage").find("[con_name='reqSupAddress']").val(dataObj.reqSupAddress);
				rennderFunctionId($("#restsPage"));
			}
			$(".formOne").find("[type=radio]").off("click");
			$(".formOne").find("[type=radio]").on("click",docuChange);
		}
		
		function rennderFunctionId(obj)
		{
			var functionCode = $.unique(dataObj.functionId.split(","));
			for(var i=0,len=functionCode.length;i<len;i++)
			{
				obj.find("[value="+functionCode[i]+"]").attr("checked","checked");
			} 
		}
	
		var saveBtn = null,
       	submitBtn = null,
       	nextBtn = null,
        saveBtn = $(".lauMng_conSave");
        submitBtn = $(".lauMng_submitBtn");
        saveBtn.on("click",{"state":"1"},saveData);
        submitBtn.on("click",{"state":"0"},saveData);
        nextBtn = $(".nextBtn");
		verifyForm($(".formOne"),".nextBtnOne");
		verifyForm($("#projectPage"),"#projectPageBtn");
		verifyForm($("#showPage"),"#showPageBtn");
		verifyForm($("#trainPage"),"#trainPageBtn");
		verifyForm($("#restsPage"),"#restsPageBtn");
		verifyForm($(".formThree"),".nextBtnThree");
        /*验证方法*/
       	function verifyForm(formName,verifyClass)
       	{
       		var html = $("body").html();
       		formName.Validform({
				btnSubmit: verifyClass,
				tiptype:2,
				datatype:{
					"phonenum":function(gets,obj,curform,regxp)
					{
						var reg = /^1(3|4|5|7|8)\d{9}$|^0\d{2,3}\-\d{7,8}$|^0\d{2,3}\d{7,8}$/;
						if(reg.test(obj.val()))
						{
							title($(obj),"电话号码格式正确");
							return true;
						}
						else
						{
							title($(obj),"电话号码格式错误");
							return false;
						}
					},
					"floatnum":function(gets,obj,curform,regxp)
					{
						var reg = /^\d{1,13}((\.\d{1,2})?)$/;
						if(reg.test(obj.val()))
						{
							return true;
						}
						else
						{
							return false;
						}
					},
					"times":function(gets,obj,curform,regxp)
					{
						var reg = /^\d{4}\-\d{2}\-\d{2}$/;
						if(reg.test(obj.val()))
						{
							return true;
						}
						else
						{
							return false;
						}
					}
				},
				callback:function(form){
					return false;
				},
				beforeCheck:function(data)
				{
					if(data.hasClass("formOne"))
					{
						for(var i=0;i<$(".formOne").find("[type=radio]").length;i++)
						{
							if($(".formOne").find("[type=radio]")[i].checked == true || data.find("input")[i].checked == "true" || data.find("input")[i].checked == "checked")
							{
								var _value = $(".formOne").find("[type=radio]")[i].value;
								typeValue = _value;
							}
							$($(".formOne").find("[type=radio]")[i]).off("click");
							$($(".formOne").find("[type=radio]")[i]).on("click",docuChange);//改变内容的方法
						}
						nextPage(_value);
						prePage($(".preBtn"));
						data.find("input").not(".Wdate").focus();
						data.find("input").not(".Wdate").blur();
					}
					else
					{
						
					}
				},
				beforeSubmit:function(data)
				{
					if(this.btnSubmit == "#showPageBtn" || this.btnSubmit == "#trainPageBtn")
					{
						if(!timeFlag)
						{
							if(this.btnSubmit == "#showPageBtn")
							{
								$("#showPage").find(".Wdate").parent().siblings().find("span").addClass("Validform_wrong").removeClass("Validform_right");
								$("#showPage").find(".Wdate").parent().siblings().find("span").attr("title","开始时间大于结束时间");
							}
							else if(this.btnSubmit == "#trainPageBtn")
							{
								$("#trainPage").find(".Wdate").parent().siblings().find("span").addClass("Validform_wrong").removeClass("Validform_right");
								$("#trainPage").find(".Wdate").parent().siblings().find("span").attr("title","开始时间大于结束时间");
							}
							return;
						}
					}
					var _index = $(".steeing").children("span[class='hasbg flag_cl']").index();
					$(".steeing").children("span[class='hasbg flag_cl']").removeClass("flag_cl");
		        	$(".steeing").find("span").eq(_index+1).addClass("hasbg flag_cl");
		        	$(".tabCon").css({"display":"none"});
		        	$(".tabCon").eq(_index+1).css({"display":"block"});
		        	
		        	if( typeFlag=="" || typeFlag == typeValue)
					{
						typeFlag = typeValue;
					}
					else
					{
						$(".steeing").children("span[class='hasbg']").removeClass("hasbg");
						$(".steeing").find("span").eq(0).addClass("hasbg");
					}
					typeFlag = typeValue;
				}
			});
       	}
       
        /*数据保存方法包括判断*/
        function saveData(event)
         {
         	if(saveFlag)
         	{
         		saveFlag = false;
	         	var loading="";
	         	var _this = $(this);
	         	var needInput = $("[con_name]"),
	         	len = needInput.length;
	         	var obj = {};
	         	obj.state = event.data.state;			//确定是按的那个按钮提交还是保存
	         	if(obj.state == 1)
	         	{
	         		loading = layer.msg('正在保存,请稍后', {
							time: 0,
							icon: 16,
							shade: 0.1
						});
	         	}
	         	else
	         	{
	         		loading = layer.msg('正在提交,请稍后', {
							time: 0,
							icon: 16,
							shade: 0.1
						});
	         	}
	         	for(var i=0;i<$(".formOne").find("[type=radio]").length;i++)
	         	{
	         		if($(".formOne").find("[type=radio]")[i].checked)
	         		{
	         			if($(".formOne").find("[type=radio]")[i].value == "0")
			         	{
			         		obj.reqSupType = 0;
			         		obj.reqExpectEndTime = $("[con_name='reqExpectEndTime']")[0].value;
				         	obj.customerName = $("[con_name='customerName']").val();
				         	obj.reqProExpectRevenue = $("[con_name='reqProExpectRevenue']").val();
				         	obj.reqProCycle = $("[con_name='reqProCycle']").val();
				         	obj.reqProSiteNum = $("[con_name='reqProSiteNum']").val();
				         	obj.reqProWorkerNum = $("[con_name='reqProWorkerNum']").val();
		        			obj.reqSupAddress = $($("[con_name='reqSupAddress']")[0]).val();
				         	for(var i=0;i<$("[con_name='reqIsConstruct']").length;i++)
				         	{
				         		if($("[con_name='reqIsConstruct']")[i].checked)
				         		{
				         			obj.reqIsConstruct = $("[con_name='reqIsConstruct']")[i].value;
				         			break;
				         		}
				         	}
				         	for(var i=0;i<$("[con_name='reqProProperty']").length;i++)
				         	{
				         		if($("[con_name='reqProProperty']")[i].checked)
				         		{
				         			obj.reqProProperty = $("[con_name='reqProProperty']")[i].value;
				         			break;
				         		}
				         	}
			         	}
			         	else if($(".formOne").find("[type=radio]")[i].value == "1")
			         	{
			         		obj.reqSupType = 1;
			         		obj.reqSupBeginTime = $("[con_name='reqSupBeginTime']")[0].value;
			         		obj.reqSupEndTime = $("[con_name='reqSupEndTime']")[0].value;
			         		obj.reqSupPeople = $($("[con_name='reqSupPeople']")[0]).val();
			         		obj.reqSupPeopleNum = $($("[con_name='reqSupPeopleNum']")[0]).val();
		        			obj.reqSupAddress = $($("[con_name='reqSupAddress']")[1]).val();
		        			obj.reqEventName = $($("[con_name='reqEventName']")[0]).val();
			         		
			         	}
			         	else if($(".formOne").find("[type=radio]")[i].value == "2")
			         	{
			         		obj.reqSupType = 2;
			         		obj.reqSupBeginTime = $("[con_name='reqSupBeginTime']")[1].value;
			         		obj.reqSupEndTime = $("[con_name='reqSupEndTime']")[1].value;
			         		obj.reqSupPeople = $($("[con_name='reqSupPeople']")[1]).val();
			         		obj.reqSupPeopleNum = $($("[con_name='reqSupPeopleNum']")[1]).val();
		        			obj.reqSupAddress = $($("[con_name='reqSupAddress']")[2]).val();
		        			obj.reqEventName = $($("[con_name='reqEventName']")[1]).val();
			         	}
			         	else if($(".formOne").find("[type=radio]")[i].value == "3")
			         	{
			         		obj.reqExpectEndTime = $("[con_name='reqExpectEndTime']")[1].value;
			         		obj.reqSupAddress = $($("[con_name='reqSupAddress']")[3]).val();
			         		obj.reqSupType = 3;
			         	}
	         		}
	         	
	         	}
	         	obj.reqName = $("[con_name='reqName']").val();
	         	obj.reqCode = $("[con_name='reqCode']").val();
	         	obj.unitId = $("[con_name='unitId']").attr("unitId");
	           	obj.areaId = $("[con_name='areaId']").attr("areaid");
	         	obj.customerContacts = $("[con_name='customerContacts']").val();
	         	obj.customerPhone = $("[con_name='customerPhone']").val();
	         	obj.customerEmail = $("[con_name='customerEmail']").val();
	         	obj.reqOutline = $("[con_name='reqOutline']").val();
		        obj.reqDetail = $("[con_name='reqDetail']").val();
		        obj.functionId ="";
		        for(var i=0;i<$("[con_name='functionId']").length;i++)
		        {
		        	if($("[con_name='functionId']")[i].checked == true || $("[con_name='functionId']")[i].checked == "checked" )
		        	{
		        		if($($("[con_name='functionId']")[i]).parents(".supportType").css("display") == "block")
		        		{
		        			obj.functionId += $("[con_name='functionId']")[i].value+","
		        		}
		        	}
		        }
		        obj.functionId = obj.functionId.substring(0,obj.functionId.length-1);
	         	obj.flag = "1";
	         	obj.id = reqId;
	         	obj.jobFlowInstanceId = dataObj.jobFlowInstanceId;
	         	arrP = $(".file-list p");
				$.each(arrP, function (i, v)
				{
					obj.attachmentId += "," + $(v).attr("attachId");
				});
				if(arrP.length == 0)
				{
					obj.attachmentId = "";
				}
				else
				{
					obj.attachmentId = obj.attachmentId.substr(10);
				}
	         	for(var i=0; i<$(".lauMng_dele").length;i++)
	         	{
	         		if($($(".lauMng_dele")[i]).html() == "正在上传")
		         	{
		         		article_submit($($(".lauMng_dele")[i]),"文件正在上传,不能进行保存或者提交");
		         		return;
		         	}
	         	}
	         	//保存到草稿
				if(obj.state == 1)
				{
					$.myAjax({
		         		type:"POST",
		         		url:window.ajaxUrl + "preSupport/workFlow/createDraft",
		         		data:obj,
		         		success:function(data)
		         		{
		         			if(data.success === 0)
		         			{
		         				saveFlag = true;
		         				var _index = $(".steeing").children("span[class='hasbg flag_cl']").index();
								$(".steeing").children("span[class='hasbg flag_cl']").removeClass("flag_cl");
				        		$(".steeing").find("span").eq(_index+1).addClass("hasbg flag_cl");
		         				article_submit(_this,"操作成功！");//保存或者提交成功完成后弹出框
		         			}
		         			else
		         			{
		         				saveFlag = true;
		         			}
		         			
		         		},
		         		error:function(data)
		         		{
		         			saveFlag = true;
		         		}
		         	});
				}
				else
				{
		         	$.myAjax({
		         		type:"POST",
		         		url:window.ajaxUrl + "preSupport/workFlow/startWorkflow",
		         		data:obj,
		         		success:function(data)
		         		{
		         			if(data.success === 0)
		         			{
		         				saveFlag = true;
		         				var _index = $(".steeing").children("span[class='hasbg flag_cl']").index();
								$(".steeing").children("span[class='hasbg flag_cl']").removeClass("flag_cl");
				        		$(".steeing").find("span").eq(_index+1).addClass("hasbg flag_cl");
		         				article_submit(_this,"操作成功！");//保存或者提交成功完成后弹出框
		         			}
		         			else
		         			{
		         				saveFlag = true;
		         			}
		         			
		         		},
		         		error:function(data)
		         		{
		         			saveFlag = true;
		         		}
		         	});
				}
	        }
         	}
        
        /*创建文件方法*/
       	function fileData(data)
       	{
				
       		var fileList = $(".file-list");
       		var arr = data.data;
       		for(var i=0;i<arr.length;i++)
       		{
       			var img = $("<img />"),
       				fileName = arr[i].attachName,
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
				p = $('<p></p>'),
				type="unknown",
				nameArr = fileName.split("."),
				str = nameArr[nameArr.length -1],
				str = str.substr(0,3);
				p.attr("attachId",arr[i].attachId);
				$.each(arrImg, function (i, v)
				{
					if (str.toLowerCase() === v)
					{
						type = v;
						return false;
					}
					else if ((str.toLowerCase() === "avi") || (str.toLowerCase() === "wmv"))
					{
						type = "mp4";
						return false;
					}
					else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpg"))
					{
						type = "png";
						return false;
					}
					else
					{
	
					}
				});
				img.attr("src","../../images/commen/"+ type +".png");
				p.append(img);
				p.append('<a class="downfile" title="点击下载文件">'+ fileName +'</a>');
				p.append(button);
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
						}
					});
				});
				
				fileList.on("click", ".downfile", function ()
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
	                    url: window.ajaxUrl + "preSupport/attachment/checkIsLogin",
	                    data: {},
	                    dataType: "json",
	                    success: function(data)
	                    {
	                        if (data && data.success === 0)
	                        {
	                            DownLoadFile({
	                                "url": window.ajaxUrl + "preSupport/attachment/findFileData",
	                                "method": "post",
	                                "data": {"attachId": _this.attr("attachId")}
	                            });
	                        }
	                    }
	                });
	            });
				fileList.append(p);
       		}
       	}
		
		/*项目支撑-提交提示方法*/
		function article_submit(obj,str){
			if(str.indexOf("操作成功")>-1)
			{
				layer.confirm(str, {
				btn: ['确定'], 
				shade: 0.1
				},
				function(){
					suc(obj);
				},
				function()
				{
					suc(obj);
				})
			}
			else if(str.indexOf("如果更改支撑类型")>-1)
			{
				layer.confirm(str, {
					btn: ['确定','取消'], 
					shade: 0.1
				},
				function()
				{
					typeFlag = typeValue;
					$(".layui-layer-border").remove();
					$(".steeing").children("span[class='hasbg']").removeClass("hasbg");
					$(".steeing").find("span").eq(0).addClass("hasbg");
					for(var i=0;i<$(".formOne").find("[type=radio]").length;i++)
					{
						if($(".formOne").find("[type=radio]")[i].checked == true || $(".formOne").find("[type=radio]")[i].checked == "true" || $(".formOne").find("[type=radio]")[i].checked == "checked")
						{
							var _value = $(".formOne").find("[type=radio]")[i].value;
							typeValue = _value;				
							break;
						}
						$($(".formOne").find("[type=radio]")[i]).off("click");
						$($(".formOne").find("[type=radio]")[i]).on("click",docuChange);//改变内容的方法
					}
					$("[con_name=reqOutline]").val("");
					$("[con_name=reqDetail]").val("");
					$(".file-list").find(".ml-10").click();
					defeat();
				},
				function()
				{
					$(".formOne").find("[type=radio]")[typeFlag].checked = "checked";
					defeat();
				});
			}
			else if(str.indexOf("正在上传")>-1)
			{
				layer.confirm(str, {
					btn: ['确定','取消'], 
					shade: 0.1
				},
				function()
				{
					defeat();
				},
				function()
				{
					defeat();
				});
			}
			else
			{
				layer.confirm(str, {
					btn: ['确定'], 
					shade: 0.1
				})
			}
			$(".layui-anim").removeClass("layui-anim");
		}
		
		/*选择切换页面*/
		function nextPage(_value)
		{
			var obj = {};
			var _value = _value;
			if(_value == "0")
			{
				var str = ".projectPage";
			}
			else if(_value == "1")
			{
				var str = ".showPage";
			}
			else if(_value == "2")
			{
				var str = ".trainPage";
			}
			else if(_value == "3")
			{
				var str= ".restsPage";
			}
			var id = "#"+str.substring(1,str.length);
			$(id).css({"display":"block"});
			$(id).siblings(".supportType").css({"display":"none"});
			
		} 
		function prePage(obj)
		{
			for(var i=0;i<obj.length;i++)
			{
				$(obj[i]).off("click");
				$(obj[i]).on("click",exitThis);
			}
		}
		function exitThis(event)
		{
			var _index = $(".steeing").children("span[class='hasbg flag_cl']").index();
			$(".steeing").children("span[class='hasbg flag_cl']").removeClass("flag_cl");
			$(".steeing").find("span").eq(_index-1).addClass("flag_cl");
			$(this).parents(".tabCon").css({"display":"none"});
			$(this).parents(".tabCon").prev().css({"display":"block"});
		}
		
		/*根据第二次选择不同展示内容不同提示*/
		function docuChange()
		{
			var _value = $(this).val();
			typeValue = _value;
			if( typeFlag==="" || typeFlag == typeValue)
			{
				
			}
			else
			{
				article_submit($(this),"如果更改支撑类型，您之前填写的内容会丢失。您确定更改吗？");
			}
		}
		
		/*导向切换页面*/
		function tabChange()
		{
			if($(this).hasClass("hasbg"))
			{
				var _index = $(this).index();
				$(".tabCon").css({"display":"none"});
				$(".tabCon").eq(_index).css({"display":"block"});
				if($("[con_name=reqSupType]")[0].checked == true || $("[con_name=reqSupType]")[0].checked == "checked")
				{
					$("#projectPage").css({"display":"block"});
					$("#projectPage").siblings().css({"display":"none"});
				}
				else if($("[con_name=reqSupType]")[1].checked == true || $("[con_name=reqSupType]")[1].checked == "checked")
				{
					$("#showPage").css({"display":"block"});
					$("#showPage").siblings().css({"display":"none"});
				}
				else if($("[con_name=reqSupType]")[2].checked == true || $("[con_name=reqSupType]")[2].checked == "checked")
				{
					$("#trainPage").css({"display":"block"});
					$("#trainPage").siblings().css({"display":"none"});
				}
				else if($("[con_name=reqSupType]")[3].checked == true || $("[con_name=reqSupType]")[3].checked == "checked")
				{
					$("#restsPage").css({"display":"block"});
					$("#restsPage").siblings().css({"display":"none"});
				}
				$(this).siblings().removeClass("flag_cl");
				$(this).addClass("flag_cl");
				prePage($(".preBtn"));
			}
		}
		
		/*数据保存成功方法*/
       	function suc(obj)
       	{
       		var parentObj =$(".layui-layer",parent.document);
       		if (obj.hasClass("lauMng_submitBtn")){
       			parent.window.location.reload();
       			if(navigator.userAgent.indexOf("Safari")>-1)
				{
					var aMy = $(top.window.document).find('[data-title="我的支撑"]');
					// First create an event
					var click_ev = document.createEvent("MouseEvents");
					// initialize the event
					click_ev.initEvent("click", true /* bubble */, true /* cancelable */);
					// trigger the event
						aMy.get(0).dispatchEvent(click_ev);
				}
				else
				{
					$(top.window.document).find('[data-title="我的支撑"]').get(0).click();
				}

       		}	
			else if (obj.hasClass("lauMng_conSave"))
				parent.window.location.reload();
       		parentObj.remove();
       	}
       	
       	/*取消操作执行的方法*/
       	function defeat()
       	{
       		$(".layui-layer").remove();
			$(".layui-layer-shade").remove();
       	}

		/*更改错误提示的title*/
       	function title(obj,str)
       	{
       		obj.parent().siblings().attr({"title":str});
       	}
	})
}(jQuery, window, document));