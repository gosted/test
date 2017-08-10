/**
   * 本文件的功能是发起支撑页js文件
   *@author 陈安
   */
(function($, w, d){
	'use strict';
	$(function()
	{
		/*信息获取方法*/
		var typeFlag = "",
			typeValue = "",
			uploadFile = $(".upload-file"),
			arrP = "",
			timeFlag = true,				//结束事件是否大于开始时间的变量判断
			saveFlag = true,				//保存数据的多次点击判断
			createTrFlag = true;
			window.getTd($(".form-table"));
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
		$.myAjax({
        	type:"POST",
        	url:window.ajaxUrl + "preSupport/requirements/findDefaultInfo",
        	success:function(data)
        	{
        		if(data.success === 0)
        		{
        			$("[con_name='unitId']").val(data.data.unitName);
        			$("[con_name='unitId']").attr({"unitId":data.data.unitId});
        			$("[con_name='customerContacts']").val(data.data.customerContacts);
        			$("[con_name='customerPhone']").val(data.data.customerPhone);
        			$("[con_name='customerEmail']").val(data.data.customerEmail);
        			$("[con_name='areaId']").attr({"areaId":data.data.areaId});
        		}
        	}
        });
        /*功能需求获取方法*/
        $.myAjax({
        	type:"POST",
        	url:window.ajaxUrl + "preSupport/plan/findDictionary",
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
        		}
        	}
        });
        $("[con_name]").on("blur",clearInfo);		//提示信息放到title方法
        for(var i=0,len=$(".steeing").find("span").length;i<len;i++)
        {
        	if($($(".steeing").find("span")[i]).html() == "完成")
        	{
        		
        	}
        	else
        	{
        		$($(".steeing").find("span")[i]).on("click",tabChange);
        	}
        	
        }
        /*定义每个按钮的用途*/
       	var saveBtn = null,
       		submitBtn = null,
       		//closeBtn = null,
       		fileField = null,
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
						var reg = /^\d{4}\-\d{2}-\d{2}$/;
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
						prePage($(".preBtn"),html);
					}
					data.find("input").not(".Wdate").focus();
					data.find("input").not(".Wdate").blur();
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
	         	obj.flag = "0";
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
        	else
        	{
        		return;
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
					$(".file-list").find("a").click();
					defeat();
				},
				function()
				{
					$(".formOne").find("[type=radio]")[typeValue].checked = "checked";
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
		/*上一步页面切换*/
		function prePage(obj,html)
		{
			
			for(var i=0;i<obj.length;i++)
			{
				$(obj[i]).off("click");
				$(obj[i]).on("click",{"html":html},exitThis);
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
			typeFlag = _value;
			if( typeFlag==="" || typeFlag == typeValue)
			{
				
			}
			else
			{
				article_submit($(this),"如果更改支撑类型，您之前填写的内容会丢失。您确定更改吗？")
			}
		}
		
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
			}
		}
		
		/*清除错误信息*/
		function clearInfo()
		{
			if($(this).parent().siblings(".errornsg").children().hasClass("Validform_wrong"))
			{
				if($(this).parent().siblings(".errornsg").children().html() == "")
				{
					var title =  "输入不能为空";
				}
				else
				{
					var title = $(this).parent().siblings(".errornsg").children().html();
				}
				$(this).parent().siblings(".errornsg").children().html("");
				$(this).parent().siblings(".errornsg").children().attr("title",title);
			}
		}
		/*更改错误提示的title*/
       	function title(obj,str)
       	{
       		obj.parent().siblings().attr({"title":str});
       	}
       	
       	/*数据保存成功方法*/
       	function suc(obj)
       	{
       		var parentObj =$("#iframe_box",parent.document);
 			$.each(parentObj.find(".show_iframe"), function(i,v)
 			{
 				if($(v).children("iframe").attr("src").indexOf("support-launch.html")>-1)
 				{
 					var _index = $(v).index();
 					$("#min_title_list",parent.document).find("li").eq(_index).remove();
 					if(navigator.userAgent.indexOf("Safari")>-1)
 					{
 						var aMy = $(top.window.document).find('[data-title="我的支撑"]'),
						aDo = $(top.window.document).find('[data-title="我的草稿"]');
	   					
	
						// First create an event
						var click_ev = document.createEvent("MouseEvents");
						// initialize the event
						click_ev.initEvent("click", true /* bubble */, true /* cancelable */);
						// trigger the event
	         			if (obj.hasClass("lauMng_submitBtn"))
							aMy.get(0).dispatchEvent(click_ev);
						else if (obj.hasClass("lauMng_conSave"))
							aDo.get(0).dispatchEvent(click_ev);
	   					$(v).remove();
 					}
 					else
 					{
 						if (obj.hasClass("lauMng_submitBtn"))
							$(top.window.document).find('[data-title="我的支撑"]').get(0).click();					
						else if (obj.hasClass("lauMng_conSave"))
							$(top.window.document).find('[data-title="我的草稿"]').get(0).click();	
	   					$(v).remove();
 					}
 				}
 			});
       	}
       	
       	/*取消操作执行的方法*/
       	function defeat()
       	{
       		$(".layui-layer").remove();
			$(".layui-layer-shade").remove();
       	}
	})
}(jQuery, window, document));