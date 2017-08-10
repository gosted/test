/**
* 本文件首页是页js文件
*@author 陈安
*/


(function($, w, d){
	'use strict';
	$(function()
	{	
		var starYear = [];
		var st = "";
		var et = "";
		var year = new Date().getFullYear();
		var mou = new Date().getMonth()+1;
		if(mou<10)
		{
			mou = "0"+mou;
		}
		$('#start-time').val(year+"-01");
		$('#end-time').val(year+"-"+mou);
		for(var i=year;i>=2016;i--)
		{
			starYear[year-i] = i;
		}
		$('#start-time').monthpicker({
	        years: starYear,
	        topOffset: 60,
	        onMonthSelect: function(m, y) {
	        	m = m+1;
		        if(m<10)
		        {
		        	m = "0"+m;
		        }
		        
	          	st = y +"-" + m + "-01";
	          	$('#start-time').val(y +"-" + m);
		        var sed = valChange();
		        if(sed == false)
		        {
		          	layer.msg("时间差错误",{
		          		time: 1000,
		          		shade:0.1
		          	})
		          	return;
		        }
		        ecFn(sed);
	        }
	    });
		$('#end-time').monthpicker({
			years: starYear,
	        topOffset: 60,
	        onMonthSelect: function(m, y) {
	        	m = m+1;
	        	if(m<10)
		        {
		        	m = "0"+m;
		        }
		        
	          	et = y +"-" + m + "-01";
	            $('#end-time').val(y +"-" + m);
	            var sed = valChange();
	            if(sed == false)
	            {
		          	layer.msg("时间差错误",{
		          		time: 1000,
		          		shade:0.1
		          	})
		          	return;
	            }
	            ecFn(sed);
	        }
		})
		$('#start-time').on("focus",function()
		{
			$(".monthpicker").eq(0).css("margin-left","90px");
			$(".monthpicker").eq(1).css("display","none");
			$('#end-time').blur();
		})
		$('#end-time').on("focus",function()
		{
			$(".monthpicker").eq(1).css("margin-left","310px");
			$(".monthpicker").eq(0).css("display","none");
			$('#start-time').blur();
		})
		window.valChange = function (dp,_this)					//获取时间,产品Id,和地区Id的方法		
		{
			var sendObj = {};
			sendObj.areaId = $(".default-span").data("id")||"";
			if($(".products_checkbox").length>0)
			{
				var cpId = "CA";
				$.each($(".products_checkbox"), function(i,v) {
					if(v.checked)
					{
						cpId += $(v).parent("label").data("dictCodeValue") + ",";
					}
				});
				if(cpId)
				{
					cpId = cpId.substring(2,cpId.length-1);
				}
				else
				{
					cpId = "";
				}
				sendObj.cpId = cpId;
			}
			sendObj.startTime = st || year + "-01-01";
			sendObj.endTime = et || year + "-"+mou+ "-01";
			if(sendObj.startTime > sendObj.endTime)
			{
				return false;
			}
			return sendObj;
		}
		window.areaShow = function(areaObj)					//地区初始化方法
		{
			var echartsSendData = valChange(),					//请求后台数据时要传的参数
			ele = areaObj.ele || "",					//初始化地区的存放DOM元素
			fn = areaObj.fn || "",						//传参的回调方法
			
			url = areaObj.url || "preSupport/areaRelative/findAreaByUserId",	//判断地区接口
			objLevel = areaObj.areaLevel || "",
			arIsCompatibility = 1,						//是否向下兼容的形式
			id = $(".default-span").data("id") || "";
			window.ecFn = fn;
			if(!ele || !ele.length)
			{
				return;
			}
			fn(echartsSendData);
			$.myAjax(
			{
				type:"POST",
				url:window.ajaxUrl + url,
				data:{"areaId":id,"arIsCompatibility":1},
				success:function(data)
				{
					if(data.success == 0 && data.data)
					{
						if($(".max").length==0)
						{
							var maxDiv = $("<div class='max areaChild areas'><label class='form-label l label-key f-l mt-5'>区域：</label><div class='con_content areas-content'><span class='default-span mr-10 mt-5'>全国</span></div></div>");
							ele.append(maxDiv);
						}
						else
						{
							if(data.data.length>0)
							{
								var maxDiv = "";
								if(objLevel == 0)
								{
									var oDiv = $("<div class='areaChild areas'><label class='form-label l label-key f-l mt-5'>省：</label><div class='con_content areas-content'></div></div>");	
								}
								else if(objLevel == 1)
								{
									var oDiv = $("<div class='areaChild areas'><label class='form-label l label-key f-l mt-5'>市：</label><div class='con_content areas-content'></div></div>");	
								}
								ele.append(oDiv);
							}
							else
							{
								return;
							}
						}
						var div = maxDiv || oDiv;
						var list = data.data;
						$.each(list,function(i,v)
						{
							var span = $("<span class='areaChildCtn mr-10 mt-5'></span>");
							span.html(v.areaNameStr);
							span.data(v);
							div.find(".con_content").append(span);
						});
						ele.append(div);
						var sendObj = {"ele":ele,"fn":fn,"url":url};
							ele.off();
							ele.on("click","span",sendObj,reloadArea);
					}
				},
			})
		}
//		
		function reloadArea(event)								//地区请求局部刷新
		{
			var obj = event.data;
			obj.areaLevel = $(this).data("areaLevel");
			$(this).parents(".areaChild").nextAll(".areaChild").remove();
			if(!$(this).data("id"))
			{
				$(".max").remove();
			}
			if($(this).parent()[0] === $(".default-span").parent()[0])
			{
				$(".default-span").removeClass("default-span");
			}
			else
			{
				if($(this).parent().find(".sky-span").length>0)
				{
					$(this).parent().find(".sky-span").removeClass("sky-span");
				}
				else
				{
					$(".default-span").removeClass("default-span").addClass("sky-span");
				}
			}
			$(this).addClass("default-span");
			areaShow(obj);
		}
//		
		window.proShow = function(proObj)							//产品初始化方法
		{
			var echartsSendData = valChange(),					//请求后台数据时要传的参数
			ele = proObj.ele || "",					//初始化产品的存放DOM元素
			fn = proObj.fn || "",						//传参的回调方法
			url = proObj.url || "preSupport/plan/findDictionary";	//判断产品接口
			if(!ele || !ele.length)
			{
				return;
			}
			fn(echartsSendData);
			$.myAjax(
			{
				type:"POST",
				url:window.ajaxUrl + url,
				data:{"dictCode":"CP"},
				success:function(data)
				{
					if(data.success === 0)
	        		{
	        			var list = data.data;
	        			var labelName = $("<label class='form-label l label-key f-l mt-5'>产品：</label>");
	        			var div = $("<div class='prodiv products-content'><label class='form-label-l l f-l mt-5 ml-20'><input type='checkbox' class='all_pro'/>全部</label></div>");
        				for(var i=0;i<list.length;i++)
	        			{
	        				var label = $("<label class='form-label-l l f-l mt-5 ml-20'></label>");
	        					label.html("<input type='checkbox' class='products_checkbox' name='user-Character-0-0-0' id='user-Character-0-0-0' value='"+list[i].dictCodeValue+"' checkboxid='"+list[i].id+"'>"+list[i].dictCodeName);
	        				label.data(list[i]);
	        				ele.append(labelName);
	        				div.append(label);
	        				ele.append(div);
	        				label.on("click","input",function()
	        				{
	        					var sed =  valChange();
	        					fn(sed);
	        				});
	        			}
	        			$(".all_pro").on("click",function()
	        			{
	        				if($(this).prop("checked"))
	        				{
	        					$(this).parent().nextAll().find("input").prop("checked",true);
	        					var sed = valChange();
	        					sed.cpId = "";
	        				}
	        				else
	        				{
	        					$(this).parent().nextAll().find("input").prop("checked",false);
	        					var sed = valChange();
	        					sed.cpId = "CA";
	        				}
	        				
	        				fn(sed);
	        			});
	        			$(".all_pro").click();
	        		}
				},
			})
		}
	})
}(jQuery,window, document));