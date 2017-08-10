/**
 * 本文件是我的出库工单流程跟踪js文件
 * @ author 孙倩
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 1000,
			pageNo = 1,
			mydiv=$(".mybody"),
			tbody = $(".tbody");
		var id = window.parent.layerViewData.orderId;





		/*
		 * 渲染表格方法传入请求到的数据
		 * */

		function setTable (data)
		{
			var list = [],
                mydiv=$(".mydiv"),
				mytable=null,

				datas={},
			    myspan=$(".myspan"),
				mytheads=null,
				str="",
				mybody=null;
			list = data.data.result;




			//渲染每個表格數據
			$.each(list,function(i,v){

				mytable=$(

					'<tr class="  text-c mybody">' +
					'<td>' +
					'<div con_name="detailName"></div>' +
					'<div class="grey mr-5 detailName"></div>' +
					'</td>' +
					'<td>' +
					'<div con_name="detailModel"></div>' +
					'<div class="grey mr-5 detailModel"></div>' +
					'</td>' +
					' <td>' +
					'<div con_name="detailCompany"></div>' +
					'<div class="grey mr-5 detailCompany"></div>' +
					'</td>' +
					' <td>' +
					'<div con_name="detailCount"></div>' +
					'<div class="grey mr-5 detailCount"></div>' +
					'</td>' +
					'<td>' +
					'<div con_name="detailUnit"></div>' +
					'<div class="grey mr-5 detailUnit"></div>' +
					'</td>' +
					' <td >' +
					'<div con_name="detailRemark"></div>' +
					'</td>' +
					'</tr>');

			var Arr=[
				"detailName",
				"manufacturer",
				"detailCompany",
				"detailUnit",
				"detailCount",
				"ext1",
				"detailModel",
				"detailRemark"
			];

				datas=list[i];

			$.each(Arr,function(i,v){

				var keyVal=datas[v];

				if (!(keyVal === null || keyVal === ""))
				{   mytable.find('[class="'+v+'"]').after($('<span con_name="'+v+'"></span>'));
					mytable.find('[con_name="'+ v +'"]').text(keyVal);
				}

			});

           tbody.append(mytable);

			})

		}

		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "/project/proDeviceList/findByWorkOrderId",
			data:{
				workOrderId:id,
				pageSize: pageSize,
				pageNo: pageNo
			},
			success: function (data) {
				if (data && data.success === 0) {
					setTable(data);

				}
			}
		});
	});
}(jQuery, window, document));
