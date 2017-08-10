/**
 * 本文件的功能是机构管理编辑js文件
 *@ author 陈安
 */

(function($, w, d){
	'use strict';
	
	$(function() {
		var id = decodeURI(location.href).split("?")[1].split("&")[0].split("=")[1];
		var unitParentId = decodeURI(location.href).split("?")[1].split("&")[1].split("=")[1];
		var table = $(".table");
		var flag = true;      //是否第一次加载页面判断树的数据加载
		var unitName = "";
		window.getTd(table);
		var saveBtn = ".organ_save";
		verifyForm($(".table-box"),saveBtn);
		$("[con_name=unitParentId]").attr("unitParentId",id);
		(function(id)
		{
			$.myAjax({
				type:"POST",
				url:window.ajaxUrl + "general/unit/findById",
				data:{id:id},
				success:function(msg)
				{
					if(msg.success === 0 && msg.data)
					{
						var obj = msg.data;
						$.each(obj, function(i,v) {
							if($("[con_name="+i+"]").attr("type") == "text")
							{
								if(i == "unitParentId")
								{
									console.log(obj.unitNameStr)
									$("[con_name="+i+"]").attr("unitParentId",obj.unitParentId);
									if(obj.unitNameStr.indexOf("/")>-1)
									{
										var str="";
										var arr = obj.unitNameStr.split("/");
										for(var j=0;j<arr.length-1;j++)
										{
											str += arr[j] + "/";
										}
										str = str.substring(0,str.length-1);
										console.log(str)
										console.log($("[con_name="+i+"]"))
										$("[con_name="+i+"]").val(str);
									}
									else
									{
										$("[con_name="+i+"]").val(obj.unitNameStr);
									}
									
								}
								else if(i == "unitAreaId")
								{
									$("[con_name="+i+"]").attr("unitAreaId",obj.unitAreaId);
									$("[con_name="+i+"]").val(obj.unitAreaName);
								}
								else
								{
									$("[con_name="+i+"]").val(v);
								}
								
							}
							else if($("[con_name="+i+"]").attr("type") == "radio")
							{
								if(v == 0)
								{
									$("[value='0']").attr({"checked":"checked"});
								}
								else if( v == 1)
								{
									$("[value='1']").attr({"checked":"checked"});
								}
							}
						});
						unitName = $("[con_name=unitName]").val();
					}
				}
			})
		}(id))
		
		window.setTree({
			ele: ".organ-tree",
            url: ajaxUrl + "general/unit/findTree",
            type: "POST",
            data: {id: 0},
            id: "id",
            value: "unitName",
            treeClick: function (data)
            {
            	$("[con_name=unitParentId]").attr("unitParentId",$(this).parent().parent().attr("treeid"));
            }
        });
        window.setTree({
			ele: ".area",
            url: ajaxUrl + "general/area/findByParentId",
            type: "POST",
            data: {id: 0},
            id: "id",
            value: "areaNameStr",
			//all: "全部",//是否有所有这一级
            treeClick: function (data)
            {
            	$("[con_name=unitAreaId]").attr("unitAreaId",$(this).parent().parent().attr("treeid"));
            }
        });
		/*表单验证提交方法*/
		function verifyForm(formName,verifyClass)
       	{
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
					"postcode":function(gets,obj,curform,regxp)
					{
						if($(obj).val().length == 6)
						{
							title($(obj),"联系邮编为六位");
							return true;
						}
						
					}
				},
				callback:function(form){
					return false;
				},
				beforeCheck:function(data)
				{
					
				},
				beforeSubmit:function(data)
				{
					var obj = {};
					
					for(var i=0,len=$("[con_name]").length;i<len;i++)
					{
						var proName = $($("[con_name]")[i]).attr("con_name");
						if($($("[con_name]")[i]).attr("type") == "text")
						{
							if(proName == "unitParentId")
							{
								obj[proName] = $($("[con_name]")[i]).attr("unitParentId");
							}
							else if(proName == "unitAreaId")
							{
								obj[proName] = $($("[con_name]")[i]).attr("unitAreaId");
							}
							else
							{
								obj[proName] = $($("[con_name]")[i]).val();
							}
						}
						else if($($("[con_name]")[i]).attr("type") == "radio")
						{
							if($("[con_name]")[i].checked == "checked" || $("[con_name]")[i].checked == "true" || $("[con_name]")[i].checked)
							{
								obj[proName] = $($("[con_name]")[i]).val()
							}
						}
					}
					if($(".Validform_wrong").length>0)
					{
						return;
					}
					obj.id = id;
					if(flag)
					{
						flag = false;
						if(unitName == obj.unitName && unitParentId == obj.unitParentId)
						{
							var load = layer.msg("请稍后",{
									time:0,
									icon:16,
									shade:0.1
								})
							$.myAjax({
								type:"POST",
								url:window.ajaxUrl + "general/unit/update",
								data:obj,
								success:function(msg)
								{
									layer.close(load);
									if(msg.success === 0)
									{
										article_submit($(".organ_save"),"编辑成功");
									}
								},
							});
						}
						else
						{
							$.myAjax({
								type:"POST",
								url:window.ajaxUrl + "general/unit/find",
								data:{"unitName":obj.unitName,"unitParentId":obj.unitParentId},
								success:function(data)
								{
									flag = true;
									if(data.success == 0 && !data.data.length)
									{
										var load = layer.msg("请稍后",{
											time:0,
											icon:16,
											shade:0.1
										})
										$.myAjax({
											type:"POST",
											url:window.ajaxUrl + "general/unit/update",
											data:obj,
											success:function(msg)
											{
												layer.close(load);
												if(msg.success === 0)
												{
													article_submit($(".organ_save"),"编辑成功");
												}
											}
										});
									}
									else
									{
										$("[con_name=unitName]").parent().siblings().find("span").removeClass("Validform_right").addClass("Validform_wrong");
										$("[con_name=unitName]").parent().siblings().find("span").attr("title","机构名称重复");
									}
								},
								error:function()
								{
									flag = true;
								}
							});
						}
					}
				}
			});
       	}
       	
       	/*弹出框方法*/
       	function article_submit(obj,str)
       	{
			if(str.indexOf("编辑成功")>-1)
			{
				layer.confirm("编辑成功",
				{
					shade:0.1
				},
				function()
				{
					suc();
				},
				function()
				{
					suc();
				})
			}
			else if(str.indexOf("编辑失败")>-1)
			{
				layer.confirm(str,
				{
					shade:0.1
				},
				function()
				{
					defeat();
				},
				function()
				{
					defeat();
				})
			}
			else if(str.indexOf("相同名称机构")>-1)
			{
				layer.confirm(str,
				{
					shade:0.1
				},
				function()
				{
					defeat();
				},
				function()
				{
					defeat();
				})
			}
			$(".layui-anim").removeClass("layui-anim");
		}
       	
       	/*操作成功关闭弹出框刷新页面*/
       	function suc()
       	{
       		$(".layui-layer").remove();
			$(".layui-layer-shade").remove();
			parent.window.location.reload();
			$(".layui-layer-shade",parent.document).remove();
			$(".layui-layer",parent.document).remove();
       	}
       	
       	/*操作失败方法只关闭弹出框*/
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
	});
}(jQuery, window, document));
