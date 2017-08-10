/**
 * 本文件的功能是所有详情页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var reqId = parent.window.layerViewData.reqId,
			workRecordId = parent.window.layerViewData.workRecordId,
			taskId = parent.window.layerViewData.taskId,
			tabArr = parent.window.layerViewData.tabArr;

		window.layerViewData = parent.window.layerViewData;

		if (!tabArr)
		{
			tabArr = [
				{
					title: "申请信息",
					src: "support-details.html",
					color: "blue",
					selected: true
				},
				{
					title: "支撑方案",
					src: "support-ScheduleListPage.html",
					color: "blue"
				},
				{
					title: "工作记录",
					src: "support-workdetails.html",
					color: "blue"
				},
				{
					title: "支撑跟踪",
					src: "support-following-detail.html",
					color: "blue"
				},
				{
					title: "备注",
					src: "support-remarkdetails.html",
					color: "blue"
				},
				{
					title: "业务日志",
					src: "support-logdetails.html",
					color: "blue"
				},
				{
					title: "流程日志",
					src: "support-processdetails.html"
				}
			];
		}

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
