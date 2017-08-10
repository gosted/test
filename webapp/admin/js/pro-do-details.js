/**
 * 本文件的功能是待办工单所有详情页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var orderId = parent.window.layerViewData.orderId,
			workRecordId = parent.window.layerViewData.workRecordId,
			taskId = parent.window.layerViewData.taskId,
			tabArr = parent.window.layerViewData.tabArr;

		window.layerViewData = parent.window.layerViewData;
		window.layerViewData.processInstanceId = parent.window.layerViewData.workFlowId;


		function setTabBar (arr)
		{
			var len = arr.length,
				tabCategory = $("#tab-category"),
				tabBar = $(".tabBar"),
				_span = null,
				now = "",
				cntW = "";

			cntW = $(window.parent.window.document).find("body").width();

			$.each(arr, function (i, v)
			{
				_span = $('<span>'+ v.title +'</span>');
				if (v.color === "orange")
				{
					_span.addClass("other");
				}

				if (v.selected === true)
				{
					now = "" + i;
					tabCategory.append('<div ind="'+ i +'" class="tabCon tabCon-iframe">'+
						'<iframe src="'+ v.src +'" scrolling="auto" allowtransparency="true" frameborder="0"></iframe>'+
						'</div>');
				}
				else
				{
					tabCategory.append('<div ind="'+ i +'" class="tabCon tabCon-iframe">'+
						'<iframe src="" scrolling="auto" allowtransparency="true" frameborder="0"></iframe>'+
						'</div>');
				}

				if (i === len-1)
				{
					_span.css({"margin-right": "0"});
				}
				_span.width(Math.floor((cntW-40)/len) - 3 + "px");
				_span.attr({"ind": i, "data-src": v.src});
				tabBar.append(_span);

			});
			//tab切换
			$.Huitab("#tab-category .tabBar span","#tab-category .tabCon","current","click",now);
			tabBar.on("click", "span", function ()
			{
				var _this = $(this),
					ifr = null;
				ifr = $("#tab-category>.tabCon[ind='"+$(this).attr("ind")+"'] iframe");
				ifr.attr({"src": $(this).attr("data-src")});
			});
		}
		setTabBar(tabArr);
	});
}(jQuery, window, document));
