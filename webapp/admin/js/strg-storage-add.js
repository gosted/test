/**
 * 本文件是入库单添加页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tables = $(".table-box>.form-table");
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

		//入库人
		$('[con_name="storelistRecorder"]').val($.cookie("userRealName"));
		//入库时间
		function getNowDate ()
		{
			var date = new Date();
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;

			return y + '-' + m + '-' + d;
		}
		$('[con_name="storelistRecordTime"]').val(getNowDate());
		//请求所属库房信息
		(function ()
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "operation/storage/findPageWithAuth",
				data: {
					"pageNo" : 1,
					"pageSize" : 1000
				},
				dataType: "json",
				success: function(data)
				{
					if (data && data.success === 0)
					{
						var projectType = $('[con_name="storageId"]');
						$.each(data.data.result, function (i, v)
						{
							var option = $('<option value="'+ v.id +'" storageCode="'+
								v.storageCode +'"></option>');
							option.text(v.storageName || "");
							projectType.append(option);
						});
						//请求入库类型信息
						(function ()
						{
							$.myAjax({
								type: "POST",
								url: window.ajaxUrl + "general/dictionary/findDictionary",
								data: {dictCode: "RKLX"},
								dataType: "json",
								success: function(data)
								{
									if (data && data.success === 0)
									{
										var projectType = $('[con_name="storelistType"]');
										$.each(data.data, function (i, v)
										{
											var option = $('<option value="'+ v.dictCodeValue +'"></option>');
											option.text(v.dictCodeName || "");
											projectType.append(option);
										});
										var setSource = function ()
										{
											var ASource = [{
												"type": "RKLX-HT",
												"url": "strg-contract.html",
												"title": "合同"
											},{
												"type": "RKLX-GD",
												"url": "strg-work-order.html",
												"title": "工单"
											},{
												"type": "RKLX-QT"
											}];
											for (var i = 0, l = ASource.length; i < l; i++)
											{
												if ($('[con_name="storelistType"]').val() === ASource[i].type && ASource[i].url)
												{
													$('[con_name="sourceId"]').attr({"url": ASource[i].url, "souTitle": ASource[i].title}).removeAttr("disabled").val("").focus().blur();
													break;
												}
												else
												{
													$('[con_name="sourceId"]').removeAttr("url").removeAttr("contractId").val("不必填写").focus().blur().attr({"disabled": true});
												}
											}
										};
										setSource();
										projectType.on("change", setSource);
									}
								}
							});
						})();
					}
				}
			});
		})();

		//点击选择入库来源
		$('[con_name="sourceId"]').on("click", function()
		{
			var url = $(this).attr("url"),
				title = $(this).attr("souTitle");
			if (url)
			{
				window.layerShow(title,url);
			}
		});

		$(".table-box").Validform({
			btnSubmit: ".save",
			tiptype:2,
			datatype: {
				"date": /^\d{4}\-\d{2}\-\d{2}$/,
				"phone": /^0\d{2,3}-?\d{7,8}$/
			},
			beforeSubmit:function(curform){
				var arr = [
					"storelistName",
					"storelistRecorder",
					"storelistRecordTime",
					"storageId",
					"storelistType",
					"shipper",
					"shipperPhone",
					"sendAddr",
					"sendTime",
					"receiveTime",
					"checker",
					"checkerPhone",
					"storelistRemark"
					],
					sendData = getValData({
						ele: ".table-box",
						arr:arr
					});
				if ($('[con_name="sourceId"]').attr("url"))
				{
					sendData.sourceId = $('[con_name="sourceId"]').attr("contractId");
				}
				sendData.storelistCode = $('[con_name="storageId"]').children('[value="'+ sendData.storageId +'"]').attr("storageCode");

				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "operation/storelist/create",
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
