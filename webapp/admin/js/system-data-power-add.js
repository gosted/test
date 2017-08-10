/**
 * 本文件的功能是数据权限添加页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tables = $(".add-table"),
			userId = "",
			areaId = "",
			selected = false;

		window.getTd(tables);

		/*输入用户名边输入边查找*/
		$(".list-box input").on("input propertychange",function ()
		{
			var _this = $(this),
				listBox =_this.parents(".list-box");

			function tipSelect(e)
			{
				var evnt = e || window.event,
					tar = $(evnt.target),
					ind = "";

				if (!selected && tar.parents(".list-box").size() === 0
					&& tar.parents(".layui-layer-setwin").size() === 0
					&& tar.parents(".layui-layer-btn").size() === 0)
				{
					ind = layer.confirm('请点击选择姓名', {
							btn: ['确定', '取消'],
							shade: 0.1
						},
						function ()
						{
							layer.close(ind);
						},
						function ()
						{
							layer.msg('已取消', {icon:5,time:1000});
							$(".list-box").children(".list").hide();
							selected = true;
							_this.val("");
							_this.blur();
						});
				}
			}

			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/user/findVaguely",
				data: {userRealName: _this.val()},
				dataType: "json",
				success: function(data)
				{
					if (data && data.success === 0)
					{
						listBox.children(".list").html("");
						_this.removeAttr("user_id");
						if (data.data && data.data[0])
						{
							listBox.children(".list").show();
							selected = false;
							for (var i=0, len=data.data.length; i<len; i++)
							{
								listBox.children(".list").append('<li user_id="'+ data.data[i].id +'">'+
									data.data[i].userRealName
									+ '(' + data.data[i].userName + ')' +'</li>');
							}
							listBox.children(".list").on("click", "li", function ()
							{
								_this.val($(this).html());
								_this.attr("user_id", $(this).attr("user_id"));
								listBox.children(".list").hide();
								_this.blur();
								selected = true;
							});

							$("body").on("click", tipSelect);
						}
					}
				}
			});
		});


		/*
		 * setType渲染关联类型的方法，传入数组数据
		 * */
		function setType (data)
		{
			var arType = $('[con_name="arType"]');
			arType.html("");
			arType.append('<option value="">请选择</option>');
			for (var i= 0, len=data.length; i<len; i++)
			{
				arType.append('<option value="'+
					data[i].dictCodeValue +'">'+
					data[i].dictCodeName +
					'</option>');
			}
		}
		/*请求关联类型数据*/
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/dictionary/findDictionary",
			data: {dictCode: "SJQX"},
			success: function (data) {
				if (data && data.success === 0)
				{
					setType(data.data);
				}
			}
		});

		window.setTree({
			url: ajaxUrl + "general/area/findByParentId",
			type: "POST",
			data: {id: 0},
			id: "id",
			value: "areaNameStr",
			all: "全部",//是否有所有这一级
			treeClick: function ()
			{
				var _this = $(this),
					id = _this.parents("li").eq(0).attr("treeId");
				if (_this.hasClass("all"))
				{
					areaId = _this.parents("li").eq(0).attr("allId");
				}
				else
				{
					areaId = id;
				}
			}
		});

		$(".table-box").Validform({
			btnSubmit: ".btn-add",
			tiptype:2,
			beforeSubmit:function(curform){

				var sendData = {};
				/**
				 * @see 获得性别
				 * @return String
				 */
				function getRadioVal(name){
					var value="";
					var radio=$('.table-box [name="'+ name +'"]');
					for(var i=0; i<radio.size(); i++){
						if(radio[i].checked === true){
							value=radio[i].value;
							break;
						}
					}
					return value;
				}
				/*设置数据权限列表*/
				function setPowerTable (obj)
				{
					var table = $(obj.table),
						data = obj.data,
						OTr = null;

					for (var i= 0, len=data.length; i<len; i++)
					{
						OTr = $('<tr power_id="'+ data[i].id +'"></tr>');
						OTr.append('<td>'+ data[i].arType +'</td>');
						OTr.append('<td>'+ data[i].areaName +'</td>');
						OTr.append('<td class="yes-no">'+ (data[i].arIsCompatibility === 1 ? "是" : "否") +'</td>');
						OTr.append('<td class="text-c">'+
							'<a style="text-decoration:none" class="ml-5 btn-delete" href="javascript:;" title="删除">'+
							'<i class="Hui-iconfont">&#xe6e2;</i></a>'+
							'</td>');
						table.append(OTr);
					}
				}
				sendData.relativeId = $('[con_name="userName"]').attr("user_id");
				sendData.areaId = areaId;
				sendData.arIsCompatibility = getRadioVal("arIsCompatibility");
				sendData.arType = $('[con_name="arType"]').val();

				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "preSupport/areaRelative/create",
					data: sendData,
					dataType: "json",
					success: function(data)
					{
						if (data && data.success === 0)
						{
							if (data.data[0] && data.data[0] !== {})
							{
								setPowerTable({
									table: ".power",
									data: data.data
								});
								$(".power-box").show();
							}
							else
							{
								$(".power-box").hide();
							}
						}
					}
				});
			},
			callback:function(form){
				return false;
			}
		});

		$(".power-box").on("click", ".btn-delete", function ()
		{
			var _this = $(this),
				ind = "";
			ind = layer.confirm('确定要删除吗？', {
					btn: ['确定', '取消'],
					shade: 0.1
				},
				function ()
				{
					layer.close(ind);
					var thisTr = _this.parents("tr").eq(0),
						id = _this.parents("tr").eq(0).attr("power_id");

					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "preSupport/areaRelative/delete",
						data: {id: id},
						dataType: "json",
						success: function(data)
						{
							if (data && data.success === 0)
							{
								var powerSize = 0;
								thisTr.remove();
								powerSize = $(".power-box").find("tr").size();
								if (powerSize === 1)
								{
									$(".power-box").hide();
								}
							}
						}
					});
				},
				function ()
				{
					layer.msg('已取消', {icon:5,time:1000});
				});
		});
	});
}(jQuery, window, document));
