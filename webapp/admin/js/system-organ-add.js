/**
 * 本文件的功能是机构管理添加js文件
 *@ author 陈安
 */

(function($, w, d){
	'use strict';
	
	$(function() {
		var src = decodeURI(location.href).split("?")[1].split("&")[1].split("=")[1];
		var id = decodeURI(location.href).split("?")[1].split("&")[0].split("=")[1];
		$(".organ-name").find("div").html(src);
		var table = $(".table");
		var flag = true;      //是否第一次加载页面判断树的数据加载
		window.getTd(table);
		var saveBtn = ".organ_save";
		verifyForm($(".table-box"),saveBtn);
		$("[con_name=unitParentId]").attr("unitParentId",id);
		$("[con_name=unitParentId]").val(src);
		/*唯一标示判断*/
		$("[con_name='unitCode']").on("blur",function()
		{
			
			var _this = $(this);
			if($(this).val() == ""){
				_this.parent().siblings().find("span").removeClass("Validform_right").addClass("Validform_wrong");
				_this.parent().siblings().attr("title","输入不能为空");
			}
			else
			{
				$.myAjax({
					type:"POST",
					url:window.ajaxUrl + "general/unit/find",
					data:{"unitCode":$(this).val()},
					success:function(msg)
					{
						if(msg.success === 0)
						{
							if(msg.data.length)
							{
								_this.parent().siblings().find("span").removeClass("Validform_right").addClass("Validform_wrong");
								_this.parent().siblings().attr("title","数据编码已经使用");
							}
							else
							{
								_this.parent().siblings().attr("title","数据编码可以使用");
							}
						}
					}
				})
			}
		})
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
					if($("[con_name=unitCode]").parent().siblings().attr("title") == "数据编码已经使用")
					{
						$("[con_name=unitCode]").parent().siblings().find("span").addClass("Validform_wrong").removeClass("Validform_right");
					}
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
					if(flag)
					{
						flag = false;
						$.myAjax({
							type:"POST",
							url:window.ajaxUrl + "general/unit/find",
							data:{"unitName":obj.unitName,"unitParentId":obj.unitParentId},
							success:function(data)
							{
								flag = true;
								if(data.success == 0 &&　!data.data.length)
								{
									var load = layer.msg("请稍后",{
										time:0,
										icon:16,
										shade:0.1
									})
									$.myAjax({
										type:"POST",
										url:window.ajaxUrl + "general/unit/create",
										data:obj,
										success:function(msg)
										{
											layer.close(load);
											if(msg.success === 0)
											{
												article_submit($(".organ_save"),"添加成功");
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
			});
       	}
       	
       	/*更改错误提示的title*/
       	function title(obj,str)
       	{
       		obj.parent().siblings().attr({"title":str});
       	}
       	/*弹出框方法*/
       	function article_submit(obj,str)
       	{
			if(str.indexOf("添加成功")>-1)
			{
				layer.confirm("添加成功",{
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
			else if(str.indexOf("操作失败")>-1)
			{
				layer.confirm("操作失败",
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
					layer.msg("已取消",{icon:5});
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
	});
}(jQuery, window, document));
