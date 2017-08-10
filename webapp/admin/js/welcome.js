/**
   * 本文件首页是页js文件
   *@author 陈安
   */
(function($, w, d){
	'use strict';
	$(function()
	{
		$.myAjax(
		{
			type:"POST",
			url:window.ajaxUrl + "preSupport/workFlow/findLatestTwMouCountByIds",
			success:function(data)
			{
				if(data.success === 0 && data.data)
				{
					var list = data.data;
					var obj = $(".orange-box");
					renderPage(list,obj);
				}
			},
		});
		$.myAjax(
		{
			type:"POST",
			url:window.ajaxUrl + "preSupport/workFlow/sortList",
			success:function(data)
			{
				if(data.success === 0 && data.data)
				{
					var list = data.data;
					var obj = $(".blue-box");
					renderPage(list,obj);
				}
			},
		});
		$.myAjax(
		{
			type:"POST",
			url:window.ajaxUrl + "preSupport/workFlow/productList",
			success:function(data)
			{
				if(data.success === 0 && data.data)
				{
					var list = data.data;
					var obj = $(".green-box");
					renderPage(list,obj);
				}
			},
		})
		function renderPage(list,obj)
		{
			$.each(list, function(i,v) {
				var div = $("<div></div>");
				var title_span = $("<span></span>");
				var content_span = $("<span></span>");
				div.attr("data-info",v.codeCode);
				title_span.addClass("title_span");
				title_span.html(v.codeName);
				content_span.addClass("content_span");
				content_span.html(v.codeNum);
				if(v.codeNum == 0)
				{
					div.css({"background":"url(../images/index/shouye_gray.png)"});
				}
				if(i%6 == 5)
				{
					div.addClass("clearright");
				}
				else if(i%6 == 0)
				{
					div.addClass("addleft");
				}
				div.append(title_span);
				div.append(content_span);
				obj.append(div);
			});
		}
	})
}(jQuery, window, document));