/**
 * 本文件是库房定义页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tables = $(".table-box>.form-table"),
			storageCode = "",
			areaId = "";
		window.getTd(tables);

		/*
		 * getValData方法获取要提交的数据
		 * 传入包含con_name的元素和con_name的数组的对象
		 * 返回组装好的数据
		 * */
		function getValData (obj)
		{
			var data = {},
				box = $(obj.ele),
				arr = obj.arr;

			for (var i = 0, len = arr.length; i < len; i++)
			{
				if (arr[i])
				{
					data[arr[i]] = box.find('[con_name="'+ arr[i] +'"]').val();
				}
			}
			return data;
		}

		window.setTree({
			url: ajaxUrl + "general/area/findByParentIdNoAuth",
			type: "POST",
			data: {id: 0},
			id: "id",
			value: "areaNameStr",
			attr: ["areaAlphaCode"],
			treeClick: function ()
			{
				var _this = $(this),
					id = _this.parents("li").eq(0).attr("treeId"),
					OLi = _this.parents("li"),
					ATemp = [];
				if (_this.hasClass("all"))
				{
					areaId = _this.parents("li").eq(0).attr("allId");
				}
				else
				{
					areaId = id;
				}

				for (var i = OLi.size() - 1; i >= 0; i--)
				{
					ATemp.push(OLi.eq(i).attr("areaAlphaCode"));
				}
				storageCode = ATemp[1];
			}
		});

		$(".table-box").Validform({
			btnSubmit: ".save",
			tiptype:2,
			datatype: {
				"phone": /^0\d{2,3}-?\d{7,8}$/,
				"area": /\/+/
			},
			beforeSubmit:function(curform){
				var arr = [
						"storageName",
						"storageAddr",
						"storageRemark",
						"storageContacts",
						"storagePhone"
					],
					sendData = getValData({
						ele: ".table-box",
						arr:arr
					});
				sendData.areaId = areaId;
				sendData.storageCode = storageCode;

				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "operation/storage/create",
					data: sendData,
					dataType: "json",
					success: function(msg)
					{
						if (msg && msg.success === 0)
						{
							window.parent.location.reload();
						}
					}
				});
			},
			callback:function(form){
				return false;
			}
		});
	});
}(jQuery, window, document));
