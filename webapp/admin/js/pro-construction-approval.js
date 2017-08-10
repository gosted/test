/**
 * 本文件的功能是所有详情页js文件
 * @ author 彭佳明
 */

(function($, w, d){
	'use strict';

	$(function() {
		var reqId = parent.window.layerViewData.reqId,
			workName = parent.window.layerViewData.workName,
			projectName = parent.window.layerViewData.projectName,
			projectId = parent.window.layerViewData.projectId,
			taskId = parent.window.layerViewData.taskId,
			workFlowId = parent.window.layerViewData.workFlowId;
		window.layerViewData = parent.window.layerViewData;

		var	tabArr = [
				{
					title: "工单信息",
					src: "pro-leader-approvalConstructionOver.html",
					color: "blue",
					selected: true
				},
				{
					title: "施工方案",
					src: "pro-construction-approvalCase.html",
					color: "blue"
				},
				{
					title: "资产登记",
					src: "pro-asset-approvalRegistration.html",
					color: "blue"
				},
				{
					title: "完工资料",
					src: "pro-construction-approvalOver.html",
					color: "blue"
				},
				{
					title: "业务日志",
					src: "pro-construction-storageOrderLogDetails.html",
					color: "blue"
				},
				{
					title: "流程跟踪",
					src: "pro-construction-storageOrderProcess.html",
					color: "blue"
				}
			];


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
