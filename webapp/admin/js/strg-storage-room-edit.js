/**
 * 本文件是库房定义编辑页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var id = window.parent.layerViewData.strgRoomId,
			tables = $(".table-box>.form-table"),
			areaId = "";
		window.getTd(tables);

		//请求库房信息
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "operation/storage/findById",
			data: {id: id},
			dataType: "json",
			success: function(data)
			{
				if (data && data.success === 0)
				{
					var _data = data.data,
						arr = [
							"storageCode",
							"storageName",
							"storageAddr",
							"storageRemark",
							"storageContacts",
							"storagePhone",
							"areaName"
						];
					$.each(arr, function (i, v)
					{
						var keyVal = _data[v];
						if (!(keyVal === null || keyVal === ""))
						{
							$('[con_name="'+ v +'"]').val(keyVal);
						}
					});
					$('[con_name="storageRemark"]').keyup();
					areaId = _data.areaId;
				}
			}
		});

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

		$(".table-box").Validform({
			btnSubmit: ".save",
			tiptype:2,
			datatype: {
				"phone": /^0\d{2,3}-?\d{7,8}$/,
				"area": /\/+/
			},
			beforeSubmit:function(curform){

				var arr = [
						"storageCode",
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
				sendData.id = id;
				sendData.areaId = areaId;

				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "operation/storage/update",
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
