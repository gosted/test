/**
 * 本文件的功能是新闻查询页js文件
 * @ author 李明
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tbody = $(".tbody"),
			pageSize = 20,
			pageNo = 1,
			treeArr = [],
			first = true,
			newsId = "",
			typeId = "",
			id = "",
			reqSupType = "",
			startTime = "",
			endTime = "",
			newsName = "",
			sourceId = "",
			releaseTime = "",
			ses = window.getRequestHeader(),
			loading = "",
			sendData = {},
			copyNewsId = "";

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
				typeId = _this.parents("li").eq(0).attr("typeId");
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
							// console.log(j)
							OLi.attr("treeId", va);
						}
						else
						{
							//OA.attr(j, va);
						}
					});
					OLi.append(OA);
					tree.append(OLi);
				});
				tree.on("click",".tree-sw",function ()
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
						if(id=="DICT-116"){
							$.myAjax({
								type: "POST",
								url: window.ajaxUrl +"general/dictionary/findLMCP",
								data: {},
								dataType: "json",
								success: function(data)
								{
									if (data && data.success === 0)
									{
										console.log(data);
										var str = "";
										for(var i = 0;i<data.data.length;i++){
											str+= "<div style='width:170px;float:left;'><span  class='tree-sw' style='background: url(../../images/commen/tree_0.png) center center no-repeat;float:left;'></span><li style='width:90px;float:left;' class='tree-txt'><a proId="+data.data[i].proId+" href='javascript:;'>"+data.data[i].newsNameStr+"</a></li></div>"
										}
										$("li[treeId='DICT-116']").append($("<ul style='float:left;' class='getCp'></ul>"))
										$(".getCp").append(str);

									}
								}
							});
						}
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
									typeId: $(this).parents("li").attr("typeId")
								},
								success: function (data)
								{
									if (data && data.success === 0)
									{
										layer.close(loading);
										var treeArr = data.data,
											OUl = $('<ul></ul>');

										$.each(treeArr, function (i, v)
										{

											var OLi = $('<li style="float:left;width:170px;"></li>'),
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
												else if (j === obj.typeId)
												{
													OLi.attr("typeId", va);
												}
												else
												{

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
				$(".tree-sw").trigger("click");
				tree.on("click", ".tree-txt", treeOnClick);
				if (obj.treeClick)
				{
					tree.on("click", ".tree-txt", obj.treeClick);
				}
			}

			treeInit({
				ele: ".tree",
				data: [ {
					"newsNameStr" : "类型",
					"id" : "",
					"typeId": ""
				}],
				id: obj.id || "id",
				typeId:obj.typeId,
				value: obj.value,
				url: obj.url,
				type: obj.type || "POST",
				treeClick: obj.treeClick || ""
			});
		};

		//请求树形菜单数据
		setMenuTree({
			url:window.ajaxUrl + "general/dictionary/findLM",
			/*url:window.ajaxUrl + "data/news/newsClassify.json",*/
			type: "POST",
			data: {id: 0},
			id: "id",
			value: "newsNameStr",
			typeId: "typeId",
			treeClick: function ()
			{
				var _this = $(this),
					sendData = {},
					typeId = _this.parents("li").eq(0).attr("typeId");
				var proId = $(this).children("a").attr("proId");
				 $('[con_name="userMajorUnit"]').val("");
				 $('[con_name="newsName"]').val("");
				sendData = {
					pageSize: pageSize,
					pageNo: pageNo,
					typeId: typeId
				};
				if(proId){
					sendData.proId = proId;
				}
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
				var newsId = v.id,
					typeId = v.typeId,
					clr = "",str1 = "";
				STr = $('<tr class="text-c" newsId="'+
					v.id+'"  typeId="'+v.typeId+'" proId="'+v.proId+'" ></tr>');//一行

				STr.append('<td><input type="checkbox" value="" name=""></td>');
				str1 = $('<td class="text-l td-view"></td>').append($('<a class="text-primary" href="javascript:;"></a>').text(v.title));
				STr.append(str1);
				STr.append($('<td></td>').text(v.source));
				var author =v.author;
				if(author==null || author=='null')
					author = '&nbsp;';
				// console.log(author);
				STr.append($('<td></td>').text(v.author));
				STr.append($('<td></td>').text(v.releaseTime));
				clr = "clr-blue";
				str1 = $('<td class="td-status"></td>').append($('<span style="color: #000;font-weight: normal;"></span>').text(v.keyWord));
				STr.append(str1);
				var tmpBtn = '<td class="btns">';
				tmpBtn += '<a style="text-decoration:none" class="mr-5 look" href="javascript:;" title="编辑" _href="support-view-details.html">'+
					'<i class="Hui-iconfont remarks">&#xe70c;</i></a>' +
					/*'<a style="text-decoration:none" class="mr-5 address" href="javascript:;" title="地址" >'+
					 '<i class="Hui-iconfont">&#xe6f1;</i></a>' +*/
					'<a style="text-decoration:none" class="mr-5 del c-warning" href="javascript:;" title="删除">'+
					'<i class="Hui-iconfont">&#xe6e2;</i></a>'+
					'</td>';

				STr.append(tmpBtn);

				tbody.append(STr);
				/*
				 * tr颜色间隔问题
				 * */
				var trs = tbody.find("tr");
				for(var i=0; i<trs.length;i++){
					if(i%2 == 0){
						trs.eq(i).css("background","#fff");
					}else{
						trs.eq(i).css("background","#eee");
					}
				}
			});
		}

		/*渲染表格和分页的方法,传入要向后台传的数据*/
		function renderingPage (sendData)
		{
			/*
			 * 获取表格中数据
			 * */
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/news/findPage",
				/*url: window.ajaxUrl + "data/news/newsList.json",*/
				data: sendData,
				beforeSend:function (xhr) {
					this.url += "?timestamp="+ new Date().getTime();
					loading = layer.msg('请稍后', {
						time: 0,
						icon: 16,
						shade: 0.1
					});
				},

				success: function (data)
				{
					layer.close(loading);
					if (data && data.success === 0)
					{
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
									releaseTime = $('[con_name="userMajorUnit"]').val();
									newsName = $('[con_name="newsName"]').val();
									var sendData = {
										pageSize: pageSize,
										pageNo: obj.curr,
										typeId:typeId,
										releaseTime:releaseTime,
										title:newsName
									};

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "general/news/findPage",
										/*url: window.ajaxUrl + "data/news/newsList.json",*/
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
						//分页结束
						$(".allpage").text(data.data.totalCount);
					}
				}
			});
		}
		releaseTime = $('[con_name="userMajorUnit"]').val();
		newsName = $('[con_name="newsName"]').val();
		sendData = {
			pageSize: pageSize,
			pageNo: pageNo,
			releaseTime:releaseTime,
			title:newsName
		};
		renderingPage (sendData);

		/*查询*/
		function findList()
		{
			var sendData = {};

			sourceId = $('[con_name="reqSupType"]').val();
			releaseTime = $('[con_name="userMajorUnit"]').val();
			newsName = $('[con_name="newsName"]').val();

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				releaseTime:releaseTime,
				title:newsName,
				typeId: typeId
			};
			renderingPage (sendData);
		}
		$(".find-btn").on("click", findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});

		var getNewsId = function(len,radix){
			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			var uuid = [], i;
			radix = radix || chars.length;

			if (len) {
				// Compact form
				for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
			} else {
				// rfc4122, version 4 form
				var r;

				// rfc4122 requires these characters
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				uuid[14] = '4';

				// Fill in random data.  At i==19 set the high bits of clock sequence as
				// per rfc4122, sec. 4.1.5
				for (i = 0; i < 36; i++) {
					if (!uuid[i]) {
						r = 0 | Math.random()*16;
						uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
					}
				}
			}
			return uuid.join('');
		};

		//添加
		$(".btn-add").on("click", function ()
		{
			copyNewsId = getNewsId(8,16);
			var data = {},
				typeId = $(".tree .clr-blue").parents("li").attr("typeId");
			if(typeId){
				data.typeId = typeId;
				data.newsId = copyNewsId;
				window.layerViewData = data;
				window.layerShow("添加","news-list-add.html");
			}else {
				layer.msg('请选择新闻类型', {icon: 2,time:1000});
			}
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

				_ul = $(".pagination").find(".con_much").children("ul");
			pageSize = $(this).html();
			_num.html(pageSize);
			_ul.css({"display": "none"});
			var releaseTime = $('[con_name="userMajorUnit"]').val();
			newsName = $('[con_name="newsName"]').val();
			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				typeId: typeId,
				releaseTime:releaseTime,
				title:newsName
			};
			renderingPage (sendData);
			return false;
		});

		/*
		 * 按钮区按钮点击事件
		 * */
		tbody.on("click", ".td-view", function ()
		{
			var href = "news-list-detail.html",
				title = "信息详情",
				data = {},
				newsId = "";
			newsId = $(this).parents("tr").attr("newsId");
			typeId = $(this).parents("tr").attr("typeId");
			data.newsId = newsId;
			data.typeId = typeId;
			window.layerViewData = data;
			window.layerShow(title,href);
		});
		//地址address
		/*tbody.on("click",".btns .address",function () {
		 var id = "";
		 id = $(this).parents("tr").attr("newsId"),
		 typeId = $(this).parents("tr").attr("typeId");
		 $.myAjax({
		 type: "POST",
		 url: window.ajaxUrl + "data/news/newsList.json",
		 data: {
		 id: id
		 },
		 success: function (data)
		 {
		 if (data && data.success === 0)
		 {
		 layer.confirm('新闻地址为'+data.data.result[0].address, {
		 btn: ['确定'],
		 shade: 0.1
		 },
		 function()
		 {
		 $(".layui-layer-shade").css({display:"none"});
		 $(".layui-layer").css({display:"none"});
		 },
		 function()
		 {

		 });
		 }
		 }
		 });
		 });*/
		//编辑
		tbody.on("click", ".btns .look", function ()
		{
			var href = "news-list-edit.html",
				proId = $(this).parents("tr").attr("proId"),
				typeId = $(this).parents("tr").attr("typeId"),
				newsId = $(this).parents("tr").attr("newsId"),
				title = $(this).attr("title"),
				data = {};
			data.newsId = newsId;
			data.proId = proId;
			data.typeId = typeId;
			window.layerViewData = data;

			window.layerShow(title,href);
		});
		//删除
		tbody.on("click", ".btns .del", function ()
		{
			var newsId = $(this).parents("tr").attr("newsId"),
				typeId = $(this).parents("tr").attr("typeId");
			layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function()
				{
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "general/news/deteteById",
						data: {id: newsId},
						success: function (data)
						{
							if (data && data.success === 0)
							{
								window.location.reload();
							}
						}
					});
				},
				function()
				{
					layer.msg('已取消', {icon:5,time:1000});
				});
		});
	});


}(jQuery, window, document));
