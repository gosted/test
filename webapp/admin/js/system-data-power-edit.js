/**
 * 本文件的功能是数据权限编辑页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var relativeId = parent.window.layerViewData.relativeId,
			userRealName = parent.window.layerViewData.userRealName,
			userName = parent.window.layerViewData.userName,
			arType = parent.window.layerViewData.arType,
			tables = $(".add-table"),
			userId = "",
			areaId = "";

		window.layerViewData = parent.window.layerViewData;
		window.getTd(tables);

		$('[con_name="userRealName"]').html(userRealName + "(" + userName + ")").attr("relativeId",relativeId);
		$('[con_name="arType"]').html(arType);

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
					_this.parents(".input-tree").children(".input-text").attr("area_id",_this.parents("li").eq(0).attr("allId"));
				}
				else
				{
					_this.parents(".input-tree").children(".input-text").attr("area_id",id);
				}
			}
		});

		/*设置数据权限列表*/
		function setPowerTable (obj)
		{
			var table = $(obj.table),
				data = obj.data,
				OTr = null;

			for (var i= 0, len=data.length; i<len; i++)
			{
				OTr = $('<tr power_id="'+ data[i].id +
					'" ar_type="'+ data[i].arType+
					'" relative_id="'+ data[i].relativeId+
					'" area_id="'+ data[i].areaId+
					'" area_name="'+ data[i].areaName+
					'" ar_is_compatibility="'+ data[i].arIsCompatibility+
					'"></tr>');
				OTr.append('<td>'+ data[i].arType +'</td>');
				OTr.append('<td>'+ data[i].areaName +'</td>');
				OTr.append('<td class="yes-no">'+ (data[i].arIsCompatibility === 1 ? "是" : "否") +'</td>');
				OTr.append('<td  class="text-c">'+
					'<a style="text-decoration:none" class="ml-5 btn-delete" href="javascript:;" title="删除">'+
					'<i class="Hui-iconfont">&#xe6e2;</i></a>'+
					'</td>');
				table.append(OTr);
			}
		}

		/*获取数据权限列表*/
		function getPowerList ()
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "preSupport/areaRelative/find",
				data: {relativeId: relativeId, arType: arType},
				dataType: "json",
				success: function(data)
				{
					if (data && data.success === 0)
					{
						if (data.data[0] && data.data[0] !== {})
						{
							$(".power-box .power tbody").html('<tr>'+
								'<td class="th cont-type">关联类型</td>'+
								'<td class="th">地区</td>'+
								'<td class="th yes-or-no">是否向下兼容</td>'+
								'<td class="th deal">操作</td>'+
								'</tr>');

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
		}
		getPowerList ();


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

				sendData.relativeId = relativeId;
				sendData.areaId = $('[con_name="areaId"]').attr("area_id");
				sendData.arIsCompatibility = getRadioVal("arIsCompatibility");
				sendData.arType = arType;

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

