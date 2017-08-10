/**
 * 本文件是项目定义编辑页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var id = window.parent.layerViewData.projectId,
			tables = $(".table-box>.form-table");
		window.getTd(tables);
		/**
		 * @see 获得radio的值
		 * @return String
		 */
		function getRadioVal(name){
			var value="";
			var radio=$('[name="'+ name +'"]');
			for(var i=0; i<radio.size(); i++){
				if(radio[i].checked === true){
					value=radio[i].value;
					break;
				}
			}
			return value;
		}
		//请求项目类型
		(function ()
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/dictionary/findDictionary",
				data: {dictCode: "XMFL"},
				dataType: "json",
				success: function(data)
				{
					if (data && data.success === 0)
					{
						var projectType = $('[con_name="projectType"]');
						$.each(data.data, function (i, v)
						{
							var option = $('<option value="'+ v.dictCodeValue +'"></option>');
							option.text(v.dictCodeName || "");
							projectType.append(option);
						});

						//请求所属省份
						$.myAjax({
							type: "POST",
							url: window.ajaxUrl + "project/project/findProvince",
							data: {},
							dataType: "json",
							success: function(msg)
							{
								if (msg && msg.success === 0)
								{
									var projectInout = $('[name="projectInout"]'),
										areaId = $('[con_name="areaId"]');

									for (var i = 0, l = msg.data.length; i < l; i++)
									{
										var option = $('<option value="'+ msg.data[i].id +'"></option>');
										option.text(msg.data[i].areaNameStr || "");
										areaId.append(option);
									}
									//请求项目信息
									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "project/project/findById",
										data: {id: id},
										dataType: "json",
										success: function(data)
										{
											if (data && data.success === 0)
											{
												var _data = data.data,
													arr = [
														"projectName",
														"projectType",
														"projectCode",
														"areaId",
														"projectSource",
														"saleManager",
														"saleDepartment",
														"projectAmont",
														"customName",
														"customContact",
														"customEmail",
														"customPhone",
														"projectRemark"
													];
												$.each(arr, function (i, v)
												{
													var keyVal = _data[v];
													if (!(keyVal === null || keyVal === ""))
													{
														$('[con_name="'+ v +'"]').val(keyVal);
													}
												});
												$('[con_name="projectRemark"]').keyup();
												$('[con_name="projectAmont"]').focus().blur();
												$('[con_name="projectStartDate"]').val(window.formatDates(data.data.projectStartDate) || "");
												$('[con_name="projectEndDate"]').val(window.formatDates(data.data.projectEndDate) || "");
												$('[con_name="projectEarlyDate"]').val(window.formatDates(data.data.projectEarlyDate) || "");
												$('[con_name="projectFinalDate"]').val(window.formatDates(data.data.projectFinalDate) || "");
												$('[name="projectInout"]').eq(data.data.projectInout).attr("checked", "true");
												$('[name="isDependencyPro"]').eq(data.data.isDependencyPro).attr("checked", "true");
												$('[con_name="areaId"]').children('[value="'+ data.data.areaId +'"]').attr("selected", "true");
											}
										}
									});
								}
							}
						});
					}
				}
			});
		})();


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
				"date": /^\d{4}\-\d{2}\-\d{2}$/,
				"phone": /^0\d{2,3}-?\d{7,8}$/,
				"money": function (gets,obj,curform,regxp)
				{
					var reg = /^[-+]?\d{1,3}(\,\d{3})*(\.?\d{1,2})?$/;
					function comdify(n){
						var re=/[-+]?\d{1,3}(?=(\d{3})+$)/g;
						var n1=Number(n.replace(/\,/g, "")).toFixed(2).toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
						return n1;
					}
					var newVal = comdify(gets);
					function focusMoney()
					{
						if ($(this).val().search(reg) > -1 && Number($(this).val().replace(/\,/g, "")) <= 9999999999999.99)
						{
							obj.val($(this).val().replace(/\,/g, ""));
						}
					}
					obj.off("focus");
					obj.on("focus",focusMoney);
					if (newVal.search(reg) > -1 && Number(newVal.replace(/\,/g, "")) <= 9999999999999.99)
					{
						obj.val(newVal);
						return true;
					}
					return false;
				}
			},
			beforeSubmit:function(curform){

				var arr = [
						"projectName",
						"projectType",
						"projectCode",
						"areaId",
						"projectStartDate",
						"projectEndDate",
						"projectEarlyDate",
						"projectFinalDate",
						"projectSource",
						"saleManager",
						"saleDepartment",
						"customName",
						"customContact",
						"customEmail",
						"customPhone",
						"projectRemark"
					],
					sendData = getValData({
						ele: ".table-box",
						arr:arr
					});
				sendData.projectInout = getRadioVal("projectInout");
				sendData.isDependencyPro = getRadioVal("isDependencyPro");
				sendData.projectAmont = $('[con_name="projectAmont"]').val().replace(/\,/g, "");
				sendData.id = id;

				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "project/project/update",
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
