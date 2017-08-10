/**
 * 本文件是系统消息页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 10,
			pageNo = 1,
			sendData = {pageSize: pageSize,pageNo: pageNo},
			selectAll = $(".select-all"),
			newsList = $(".news-list"),
			markAll = $(".mark-all"),
			markPart = $(".mark");

		/*全选*/
		selectAll.on("click", function (e)
		{
			var _this = $(this),
				evnt = e || window.event,
				selAllCheckbox = _this.children("input"),
				ACheckbox = $(".news-list input[type='checkbox']"),
				i= 0,
				len = 0;

			if (evnt.target.nodeName == "INPUT")
			{
				if (evnt.target.checked === true)
				{
					selAllCheckbox.get(0).checked = false;
					for (i= 0, len = ACheckbox.size(); i < len; i++)
					{
						ACheckbox.get(i).checked = false;
					}
				}
				else
				{
					selAllCheckbox.get(0).checked = true;
					for (i= 0, len = ACheckbox.size(); i < len; i++)
					{
						ACheckbox.get(i).checked = true;
					}
				}
			}
			if (selAllCheckbox.get(0).checked === true)
			{
				selAllCheckbox.get(0).checked = false;
				for (i= 0, len = ACheckbox.size(); i < len; i++)
				{
					ACheckbox.get(i).checked = false;
				}
			}
			else
			{
				selAllCheckbox.get(0).checked = true;
				for (i= 0, len = ACheckbox.size(); i < len; i++)
				{
					ACheckbox.get(i).checked = true;
				}
			}

		});
		newsList.on("click", "input[type='checkbox']", function ()
		{
			var ACheckbox = $(".news-list input[type='checkbox']"),
				num = 0;
			for (var i= 0, len = ACheckbox.size(); i < len; i++)
			{
				if (ACheckbox.get(i).checked === true)
				{
					num++;
				}
			}

			if (num === len)
			{
				selectAll.find("input").get(0).checked = true;
			}
			else
			{
				selectAll.find("input").get(0).checked = false;
			}
		});
		/*全选结束*/

		/*getIds获取ids的方法，返回ids*/
		function getIds()
		{
			var ACheckbox = $(".news-list input[type='checkbox']"),
				ids = "";
			for (var i= 0, len = ACheckbox.size(); i < len; i++)
			{
				if (ACheckbox.get(i).checked === true)
				{
					ids += "," + ACheckbox.eq(i).parent("li").attr("list_id");
				}
			}
			return ids.substr(1);
		}
		/*全部标记为已读*/
		markAll.on("click", function ()
		{
			layer.confirm('确定标记为已读吗？', {
				btn: ['确定','取消'],
				shade: 0.1
			},
			function ()
			{
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "general/sysmessage/update",
					data: {},
					success: function(data)
					{
						if (data && data.success === 0)
						{
							location.reload();
							top.setNews();
						}
					}
				});
			},
			function()
			{
				layer.msg('已取消', {icon:5,time:1000});
			});
		});

		/*部分标记为已读*/
		markPart.on("click", function ()
		{
			var ids = getIds();
			if (!ids)
			{
				layer.confirm('请至少选择一条消息', {
						btn: ['确定'],
						shade: 0.1
				});
				return false;
			}
			layer.confirm('确定标记为已读吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function ()
				{
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "general/sysmessage/update",
						data: {ids: ids},
						success: function(data)
						{
							if (data && data.success === 0)
							{
								location.reload();
								top.setNews();
							}
						}
					});
				},
				function()
				{
					layer.msg('已取消', {icon:5,time:1000});
				});
		});

		/*点击消息名进行跳转*/
		newsList.on("click", "li>a", function()
		{
			var AMenu = $(top.document).find(".menu_dropdown dd li>a"),
				sysmessageLinkAddress = $(this).parent("li").attr("sysmessageLinkAddress"),
				ids = $(this).parent("li").attr("list_id");

			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/sysmessage/update",
				data: {ids: ids},
				success: function(data)
				{
					if (data && data.success === 0)
					{
						location.reload();
						top.setNews();
						for (var i = 0, len = AMenu.size(); i < len; i++)
						{
							if (AMenu.eq(i).attr("_href") === sysmessageLinkAddress)
							{
								if (document.createEvent)
								{
									var ev = document.createEvent("MouseEvents");
									ev.initEvent("click",true,false);
									AMenu.get(i).dispatchEvent(ev);

									var evn = document.createEvent("MouseEvents");
									evn.initEvent("click",true,false);
									AMenu.eq(i).parents("dl").find("dt").get(0).dispatchEvent(evn);
								}
								else
								{
									AMenu.eq(i).click();
									AMenu.eq(i).parents("dl").find("dt").click();
								}
							}
						}
					}
				}
			});
		});

		function setNewsList(data)
		{
			if (data && data.length > 0)
			{
				newsList.html("");
				for(var i = 0, len = data.length; i < len; i++)
				{
					var listData = data[i],
						OLi = $('<li class="pt-5 pl-10 pr-20 pb-5'+ ((i%2 == 0) ? " bg-gray" : "") +'" list_id="'+listData.id
							+'" sysmessageLinkAddress="'+ listData.sysmessageLinkAddress
							+'" reqId="'+ listData.reqId
							+'"><input type="checkbox"></li>'),
						OA = $('<a class="ml-5" href="javascript:;">'+ listData.sysmessageContent +'</a>'),
						OI = $('<i class="ml-10'+ (listData.sysmessageFlag === '0' ? ' no-read' : '') +'">['
							+ (listData.sysmessageFlag === '0' ? '未读' : '已读') +']</i>'),
						OSpan = $('<span class="f-r">'+ window.formatDateTimesec(listData.createTime) +'</span>');

					OLi.append(OI);
					OLi.append(OA);
					OLi.append(OSpan);
					newsList.append(OLi);
				}
			}
		}
		/*渲染页面的方法*/
		function renderingPage(sendData)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/sysmessage/findPage",
				data: sendData,
				success: function (data)
				{
					if (data && data.success === 0)
					{
						setNewsList(data.data.result);
						//分页
						laypage({
							cont: $('#pagination'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
							pages: data.data.pageCount, //通过后台拿到的总页数
							curr: data.data.pageNo || 1, //当前页
							first: '首页',
							last: '尾页',
							prev: false,
							next: false,
							skip: true, //是否开启跳页
							jump: function(obj, first){ //触发分页后的回调
								if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
									var sendData = {
										pageSize: pageSize,
										pageNo: obj.curr
									};
									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "general/sysmessage/findPage",
										data: sendData,
										success: function (data)
										{
											if (data && data.success === 0)
											{
												setNewsList(data.data.result);
											}
										}
									});
								}
							}
						});
						if ($('.pagination .con_much').size() === 0)
						{
							$('.pagination').append('<div class="con_much l">'+
								'<span>'+
								'每页<i class="con_list_num">10</i>条'+
								'</span>'+
								'<i></i>'+
								'<ul class="clear">'+
								'<li class="con_num_5"><span>5</span></li>'+
								'<li class="con_num_10"><span>10</span></li>'+
								'<li class="con_num_15"><span>15</span></li>'+
								'<li class="con_num_20"><span>20</span></li>'+
								'<li class="con_num_25"><span>25</span></li>'+
								'<li class="con_num_30"><span>30</span></li>'+
								'</ul>'+
								'</div>');
							$('.pagination').append("<div class='con_altogether'><span>共<span class='allpage'>"+data.data.totalCount+"</span>条</span></div>");
						}
						$(".allpage").text(data.data.totalCount);
					}
				}
			});
		}
		renderingPage(sendData);

		/*每页显示多少条*/
		$(".pagination").on("click", ".con_much>i", function()
		{
			var _this = $(this),
				_ul = _this.parents(".con_much").children("ul");

			_ul.css({"display": "block"});
			return false;
		});
		$(".pagination").on("click", "ul span", function ()
		{
			var _num = $(".pagination").find(".con_much .con_list_num"),
				_ul = $(".pagination").find(".con_much").children("ul");
			pageSize = $(this).html();
			_num.html(pageSize);
			_ul.css({"display": "none"});
			sendData = {
				pageSize: pageSize,
				pageNo: pageNo
			};
			renderingPage(sendData);
			return false;
		});
		$(document).on("click", function(e)
		{
			var evn = e || window.event;
			if ($(evn.target).parents(".con_much").size() === 0)
			{
				$(".con_much ul").hide();
			}
		});
		/*每页显示多少条结束*/
	});
}(jQuery, window, document));
