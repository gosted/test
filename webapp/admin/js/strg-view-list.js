/**
 * 本文件是库存列表页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			strgRoomId = "",
			stockdetailName = "",
			stockdetailCode = "",
			stockdetailFactory = "",
			treeId = "",
			tbody = $(".tbody");

		strgRoomId = window.parent.layerViewData.strgRoomId;

		var setMenuTree = function (obj)
		{
			var open = false;

			/*
			 * treeOnClick树形菜单点击回调函数
			 *
			 * */
			function treeOnClick()
			{
				var _this = $(this),
					id = _this.parents("a").eq(0).attr("dictCodeValue");
				_this.parents(".tree").find(".tree-txt").removeClass("clr-blue");
				_this.addClass("clr-blue");
			}

			/*
			 * treeInit初始化树形菜单方法
			 *
			 * */
			function treeInit(obj)
			{
				var tree = $(obj.ele),
					data = obj.data;

				tree.html("");
				$.each(data, function (i, v)
				{
					var OLi = $('<li></li>'),
						OA = $('<a href="javascript:;"></a>');

					OLi.append('<span class="tree-sw"></span>');

					if (obj.showIcon === true)
					{
						OA.append('<span class="tree-icon"></span>');
					}
					OA.append('<span class="tree-txt"></span>');

					$.each(v, function (j,va)
					{
						if (j === obj.value)
						{
							OA.find(".tree-txt").html(va);
						}
						else if (j === obj.id)
						{
							OLi.attr("treeId", va);
						}
						else if (j === 'countAll')
						{
							OA.append('<span class="tree-count" style="color: orange;">【'+ (va ? va.toString() : 0) +'】</span>');
						}
						else
						{
							//OA.attr(j, va);
						}
					});
					OLi.append(OA);
					tree.append(OLi);
				});
				tree.on("click", ".tree-sw", function ()
				{
					var _this = $(this),
						OUl = _this.parent("li").children("ul"),
						id = _this.parent("li").attr("treeId");
					if (_this.hasClass("sw-open"))
					{
						_this.css({"background": 'url("../../images/commen/tree_0.png") no-repeat center'});
						_this.removeClass("sw-open");
						OUl.css({"display": "none"});
					}
					else
					{
						_this.css({"background": 'url("../../images/commen/tree_1.png") no-repeat center'});
						_this.addClass("sw-open");

						if (OUl.size() === 1)
						{
							OUl.css({"display": "block"});
						}
						else
						{
							$.myAjax({
								url: obj.url,
								type: obj.type || "POST",
								data: {
									id: id,
									storageId: strgRoomId
								},
								success: function (data)
								{
									if (data && data.success === 0)
									{
										var treeArr = data.data,
											OUl = $('<ul></ul>');

										$.each(treeArr, function (i, v)
										{
											var OLi = $('<li></li>'),
												OA = $('<a href="javascript:;"></a>');

											OLi.append('<span class="tree-sw"></span>');

											if (obj.showIcon === true)
											{
												OA.append('<span class="tree-icon"></span>');
											}
											OA.append('<span class="tree-txt"></span>');

											$.each(v, function (j,va)
											{
												if (j === obj.value)
												{
													OA.find(".tree-txt").html(va);
												}
												else if (j === obj.id)
												{
													OLi.attr("treeId", va);
												}
												else if (j === 'countAll')
												{
													OA.append('<span class="tree-count" style="color: orange;">【'+ (va ? va.toString() : 0) +'】</span>');
												}
												else
												{
													//OA.attr(j, va);
												}
											});
											OLi.append(OA);
											OUl.append(OLi);
										});
										_this.parent("li").append(OUl);
									}
								}
							});
						}
					}
					return false;
				});

				tree.on("click", ".tree-txt", treeOnClick);
				if (obj.treeClick)
				{
					tree.on("click", ".tree-txt", obj.treeClick);
				}
			}

			$.myAjax({
				 url: obj.url,
				 type: obj.type || "POST",
				 data: {
					 shelfId: treeId,
					 storageId: strgRoomId
				 },
				 success: function (data)
				 {
					 if (data && data.success === 0)
					 {
						var treeArr = data.data;

						 treeInit({
							 ele: ".tree",
							 data: treeArr,
							 id: obj.id || "id",
							 value: obj.value,
							 url: obj.url,
							 type: obj.type || "POST",
							 treeClick: obj.treeClick || ""
						 });
					 }
				 }
			 });
		};

		//请求树形菜单数据
		setMenuTree({
			url: ajaxUrl + "operation/shelf/findTreeAllCount",
			type: "POST",
			data: {id: 0, storageId: strgRoomId},
			id: "id",
			value: "shelfName",
			treeClick: function ()
			{
				var _this = $(this),
					sendData = {};

				$('[con_name="stockdetailName"]').val("");
				$('[con_name="stockdetailCode"]').val("");
				$('[con_name="stockdetailFactory"]').val("");

				stockdetailName = "";
				stockdetailCode = "";
				stockdetailFactory = "";
				treeId = _this.parents("li").eq(0).attr("treeId");

				sendData = {
					pageSize: pageSize,
					pageNo: pageNo,
					shelfId: treeId,
					storageId: strgRoomId
				};
				renderingPage (sendData);
			}
		});

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
				var equipmentId = v.id,
					code = $('<div></div>'),
					codeTd = $('<td class="text-l"></td>'),
					nameTd = $('<td><img src="../../images/temporary/equ_logo.png" class="l mr-5"><span class="l lh-30"></span></td>'),
					shelfName = "",
					href = "strg-equipment-details.html";

				if (v.baseAssetCode && v.baseAssetCode.replace(/\s/g, ""))
				{
					href = "../assetManage/asset-check-lifeCycle.html";
				}
				STr = $('<tr class="text-c" equipmentId="'+ equipmentId
					+'" baseAssetCode="'+ v.baseAssetCode
					+'"></tr>');//一行
				STr.append('<td><input type="checkbox" value="" name=""></td>');
				if (v.attachmentId)
				{
					nameTd.find('img').attr('src',window.ajaxUrl +'project/attachment/downloadImage?id=' + v.attachmentId);
				}
				nameTd.find('span').text(v.stockdetailName || "");
				STr.append(nameTd);

				codeTd.append(code.text('设备：' + (v.stockdetailCode || "--")));
				code = $('<div></div>');
				codeTd.append(code.text('公司：' + (v.companyAssetCode || "--")));
				code = $('<div></div>');
				codeTd.append(code.text('基地：' + (v.baseAssetCode || "--")));
				STr.append(codeTd);
				if (v.shelfName)
				{
					shelfName = v.shelfName.substr(v.shelfName.indexOf('/')+1) || v.shelfName;
				}
				STr.append($('<td class="text-l"></td>').text(shelfName));
				STr.append($('<td></td>').text(v.stockdetailFactory || ""));
				STr.append($('<td></td>').text(v.stockdetailModel || ""));
				STr.append($('<td></td>').text(v.stockdetailNum || ""));
				STr.append($('<td></td>').text(v.stockdetailUnit || ""));
				var tmpBtn = '<td class="btns">';

				tmpBtn += '<a style="text-decoration:none" class="ml-5" href="javascript:;" _href="'+ href +'" title="查看详情">'+
					'<i class="fa fa-eye fa-lg" aria-hidden="true"></i></a>' +
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
				url: window.ajaxUrl + "operation/stockdetail/findPage",
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
										storageId: strgRoomId,
										pageSize: pageSize,
										shelfId: treeId,
										pageNo: obj.curr
									};
									stockdetailName ? sendData.stockdetailName = stockdetailName : false;
									stockdetailCode ? sendData.stockdetailCode = stockdetailCode : false;
									stockdetailFactory ? sendData.stockdetailFactory = stockdetailFactory : false;

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "operation/stockdetail/findPage",
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
								'<li class="con_num_5"><span>10</span></li>'+
								'<li class="con_num_10"><span>20</span></li>'+
								'<li class="con_num_15"><span>50</span></li>'+
								'<li class="con_num_20"><span>100</span></li>'+
								'<li class="con_num_25"><span>200</span></li>'+
								'<li class="con_num_30"><span>1000</span></li>'+
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
			storageId: strgRoomId,
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
				storageId: strgRoomId,
				shelfId: treeId,
				pageSize: pageSize,
				pageNo: pageNo
			};
			stockdetailName ? sendData.stockdetailName = stockdetailName : false;
			stockdetailCode ? sendData.stockdetailCode = stockdetailCode : false;
			stockdetailFactory ? sendData.stockdetailFactory = stockdetailFactory : false;
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
			var search = $(".search-area"),
				sendData = {};

			stockdetailName = search.find('[con_name="stockdetailName"]').val();
			stockdetailCode = search.find('[con_name="stockdetailCode"]').val();
			stockdetailFactory = search.find('[con_name="stockdetailFactory"]').val();

			sendData = {
				storageId: strgRoomId,
				shelfId: treeId,
				pageSize: pageSize,
				pageNo: pageNo
			};

			stockdetailName ? sendData.stockdetailName = stockdetailName : false;
			stockdetailCode ? sendData.stockdetailCode = stockdetailCode : false;
			stockdetailFactory ? sendData.stockdetailFactory = stockdetailFactory : false;
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
				equipmentId = "",
				assetCo = "";

			if (!href)
			{
				return false;
			}
			equipmentId = $(this).parents("tr").attr("equipmentId");
			assetCo = $(this).parents("tr").attr("baseAssetCode");
			data.equipmentId = equipmentId;
			data.assetCo = assetCo;
			window.layerViewData = data;
			window.layerShow(title,href);
		});

	});
}(jQuery, window, document));
