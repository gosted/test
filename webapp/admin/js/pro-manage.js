/**
 * 本文件是库房定义页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			providerCode = "",
			providerName = "",
			tbody = $(".tbody");
		var search = $(".search-area");
		/*
		 * 渲染表格方法传入请求到的数据
		 * */
		function setTable (data)
		{
			var list = [],
				tbody = $(".tbody"),
				STr = null;

			list = data.data.result;
			tbody.html("");
			if (list.length === 0)
			{
				$(".no-data").show();
			}
			else
			{
				$(".no-data").hide();
			}

			$.each(list, function (i, v)
			{
				var providerId = v.id,
                    view=$('<a  style="text-decoration:none" class="ml-5"  href="pro-manage-edit.html"></a>');
				STr = $('<tr class="text-c" providerId="'+ providerId+'"></tr>');//一行
				STr.append('<td><input type="checkbox" value="" name=""></td>');
				STr.append($('<td></td>').text(v.partnerCode));
				STr.append($('<td class="td-view text-c"></td>').text(v.partnerName));
				STr.append($('<td></td>').text(v.typeName));
				STr.append($('<td></td>').text(v.equipmentId||""));
				STr.append($('<td></td>').text(v.partnerContact));
				STr.append($('<td></td>').text(v.partnerPhone));
				var tmpBtn = '<td class="btns">';
				tmpBtn += '<a style="text-decoration:none" class="mr-5 deal" href="javascript:;" title="编辑" _href="pro-manage-edit.html">'+
					'<i class="Hui-iconfont">&#xe70c;</i></a>';
				tmpBtn += '<a style="text-decoration:none" class="mr-5 c-warning delete" href="javascript:;" title="删除">'+
					'<i class="Hui-iconfont">&#xe6e2;</i></a>' +
					'</td>';

				STr.append(tmpBtn);

				tbody.append(STr);
				/*
				 * tr颜色间隔问题
				 * */
				if(i%2 == 0){
					STr.css("background","#fff");
				}else{
					STr.css("background","#eee");
				}
			});
		}


		/*渲染表格和分页的方法,传入要向后台传的数据*/
		function renderingPage (sendData)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/partner/findPage",
				data: sendData,
				success: function (data) {
					if (data && data.success === 0) {
						setTable(data);
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
									providerCode = search.find('[con_name="providerCode"]').val();
									providerName = search.find('[con_name="providerName"]').val();
									providerCode ? sendData.partnerCode = providerCode : false;
									providerName ? sendData.partnerName = providerName : false;

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "general/partner/findPage",
										data: sendData,
										success: function (data)
										{
											if (data && data.success === 0)
											{
												setTable(data);
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
								'每页<i class="con_list_num">20</i>条'+
								'</span>'+
								'<i></i>'+
								'<ul class="clear">'+
								'<li class="con_num_10"><span>10</span></li>'+
								'<li class="con_num_20"><span>20</span></li>'+
								'<li class="con_num_50"><span>50</span></li>'+
								'<li class="con_num_100"><span>100</span></li>'+
								'<li class="con_num_200"><span>200</span></li>'+
								'<li class="con_num_1000"><span>1000</span></li>'+
								'</ul>'+
								'</div>');
							$('.pagination').append("<div class='con_altogether'><span>共<span class='allpage'>"+data.data.totalCount+"</span>条</span></div>");
						}
						$(".allpage").text(data.data.totalCount);
						//分页结束
					}
				}
			});
		}

		renderingPage({
			pageSize: pageSize,
			pageNo: pageNo
		});

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
				_ul = $(".pagination").find(".con_much").children("ul"),
				sendData = {};
			pageSize = $(this).html();
			_num.html(pageSize);
			_ul.css({"display": "none"});

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo

			};
			providerCode = search.find('[con_name="providerCode"]').val();
			providerName = search.find('[con_name="providerName"]').val();
			providerCode ? sendData.partnerCode = providerCode : false;
			providerName ? sendData.partnerName = providerName : false;
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

		/*
		 * 查询方法
		 * */

		function findList()
		{

			var sendData = {};

			providerCode = search.find('[con_name="providerCode"]').val();
			providerName = search.find('[con_name="providerName"]').val();

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo

			};

			providerCode ? sendData.partnerCode = providerCode: false;
			providerName ? sendData.partnerName=providerName : false;
			renderingPage(sendData);
		}
		$(".find-btn").on("click", findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});

		/*
		 * 列表内按钮区按钮点击事件
		 * */
		tbody.on("click", ".btns a", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				providerId = "";

			if (!href)
			{
				return false;
			}
			providerId = $(this).parents("tr").attr("providerId");
			data.providerId = providerId;
			window.layerViewData = data;
			window.layerShow(title,href);
		});

		tbody.on("click", ".btns .delete", function ()
		{
			var _this = $(this);
			layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function ()
				{
					var providerId = "";

					providerId = _this.parents("tr").attr("providerId");


					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "general/partner/deleteById",
						data: {id: providerId},
						dataType: "json",
						success: function(msg)
						{
							if (msg && msg.success === 0)
							{
								window.location.reload();
							}
						}
					});
				});

		});

		/*添加*/
		$(".btn-add").on("click",function ()
		{
			window.layerShow("添加","pro-manage-add.html");
		});
		$(document).on("click",".layui-layer-close1",function()
		{
			sessionStorage.clear();
		});
		sessionStorage.clear();

	});
}(jQuery, window, document));
