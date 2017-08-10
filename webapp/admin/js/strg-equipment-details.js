/**
 * 本文件是库房定义编辑页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var id = window.parent.layerViewData.equipmentId,
			tables = $(".table-box>.form-table"),
			areaId = "";
		window.getTd(tables);

		//请求库房信息
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "operation/stockdetail/findById",
			data: {id: id},
			dataType: "json",
			success: function(data)
			{
				if (data && data.success === 0)
				{
					var _data = data.data,
						arr = [
							"storageId",
							"stockdetailName",
							"baseAssetCode",
							"companyAssertCode",
							"stockdetailCode",
							"stockdetailFactory",
							"stockdetailModel",
							"stockdetailParam",
							"stockdetailNum",
							"stockdetailUnit",
							"storelistRecorderName",
							"storelistCode",
							"stockdetailRemark",
							"storelistName"
						],
						shelfName = "";
					$.each(arr, function (i, v)
					{
						var keyVal = _data[v];
						if (!(keyVal === null || keyVal === ""))
						{
							$('[con_name="'+ v +'"]').text(keyVal);
						}
					});
					if (data.data.attachmentId)
					{
						$(".equ-logo img").attr("src", window.ajaxUrl +'project/attachment/downloadImage?id=' + data.data.attachmentId);
					}
					$(".equ-logo div").text(data.data.equipmentName || "");
					if (data.data.shelfName)
					{
						shelfName = data.data.shelfName.substr(data.data.shelfName.indexOf('/')+1);
					}
					$('[con_name="shelfId"]').text(shelfName);
					$('[con_name="storageId"]').text(data.data.storageName || "");
					$('[con_name="storelistTime"]').text(window.formatDates(data.data.storelistTime) || "");
					data.data.stockdetailState === "RK" ? $('[con_name="stockdetailState"]').text("正常") : false;
				}
			}
		});
		//关闭
		$(".close-btn").on("click", function()
		{
			layer_close();
		});
	});
}(jQuery, window, document));
