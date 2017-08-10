/**
 * 本文件的功能是我的支撑页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tbody = $(".tbody"),
			pageSize = 20,
			pageNo = 1,
			treeArr = [],
			first = true,
			areaIdNow = "",
			arIsCompatibilityNow = "",
			reqSupType = "",
			startTime = "",
			endTime = "",
			sendData = {};

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
						else if (j === "arIsCompatibility")
						{
							OLi.attr("arIsCompatibility", va);
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
									areaId: id,
									arIsCompatibility: $(this).parents("li").attr("arIsCompatibility")
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
												else if (j === "arIsCompatibility")
												{
													OLi.attr("arIsCompatibility", va);
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

			treeInit({
				ele: ".tree",
				data: [ {
					"areaNameStr" : "全部",
					"id" : ""
				}],
				id: obj.id || "id",
				value: obj.value,
				url: obj.url,
				type: obj.type || "POST",
				treeClick: obj.treeClick || ""
			});

			/*$.myAjax({
				url: obj.url,
				type: obj.type || "POST",
				data: {id: $(this).parents("li").attr("treeId")},
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
			});*/
		};

		//请求树形菜单数据
		setMenuTree({
			url: ajaxUrl + "preSupport/areaRelative/findAreaByUserId",
			type: "POST",
			data: {id: 0},
			id: "id",
			value: "areaNameStr",
			treeClick: function ()
			{
				var _this = $(this),
					sendData = {};

				$('[con_name="reqSupType"]').val("");
				$('[con_name="startTime"]').val("");
				$('[con_name="endTime"]').val("");
				reqSupType = "";
				startTime = "";
				endTime = "";
				areaIdNow = _this.parents("li").eq(0).attr("treeId");
				arIsCompatibilityNow = _this.parents("li").eq(0).attr("arIsCompatibility");

				sendData = {
					pageSize: pageSize,
					pageNo: pageNo,
					areaId: areaIdNow,
					arIsCompatibility: arIsCompatibilityNow
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
				var reqIsImportant = v.reqIsImportant,
					reqSupType = v.reqSupType,
					reqName = "",
					clr = "";

				STr = $('<tr class="text-c" reqId="'+ v.id+'" taskId="'+
					v.taskId+'" processInstanceId="'+ v.jobFlowInstanceId+'" customerId="'+
					v.customerId+'" reqCode="'+ v.reqCode+'" reqSupType = "'+v.reqSupType+'"></tr>');//一行

				STr.append('<td><input type="checkbox" value="" name=""></td>');
				switch(reqSupType)
				{
					case "0":reqName = "[项目支撑]";break;
					case "1":reqName = "[展会支撑]";break;
					case "2":reqName = "[培训支撑]";break;
					default:reqName = "[其它支撑]";break;
				}

				if(reqIsImportant == 1)
				{
					if (v.reqIsSpot == 1)
					{
						STr.append('<td class="text-l td-view">'+
							'<a class="text-primary" href="javascript:;">'+
							reqName + "[重大]" + "[现场] " + v.reqName +
							'</a></td>');
					}
					else
					{
						STr.append('<td class="text-l td-view">'+
							'<a class="text-primary" href="javascript:;">'+
							reqName + "[重大] " + v.reqName +
							'</a></td>');
					}
				}
				else
				{
					if (v.reqIsSpot == 1)
					{
						STr.append('<td class="text-l td-view">'+
							'<a class="text-primary" href="javascript:;">'+
							reqName + "[现场] " + v.reqName +
							'</a></td>');
					}
					else
					{
						STr.append('<td class="text-l td-view">'+
							'<a class="text-primary" href="javascript:;">'+
							reqName + " " + v.reqName+
							'</a></td>');
					}
				}
				STr.append('<td>' + v.reqCode + '</td>');
				var tmpCustomerName =v.customerName;
				if(tmpCustomerName==null || tmpCustomerName=='null')
					tmpCustomerName = '&nbsp;';

				STr.append('<td>' + tmpCustomerName + '</td>');
				STr.append('<td>' + window.formatDates(v.reqSubTime) + '</td>');
				if (v.reqProcessState === "填写需求单")
				{
					clr = "clr-blue";
				}
				else if (v.reqProcessState === "跟踪反馈")
				{
					clr = "shen-yellow";
				}
				else if (v.reqProcessState === "负责人审批")
				{
					clr = "qian-yellow";
				}
				else if (v.reqProcessState === "制定支撑方案")
				{
					clr = "qian-blue";
				}
				else if (v.reqProcessState === "业务经理受理")
				{
					clr = "green";
				}
				else if (v.reqProcessState === "结束")
				{
					clr = "black";
				}
				else
				{
					clr = "zi-blue";
				}
				STr.append('<td class="td-status">'+
					'<span class="label radius reqState '+clr+'">'+ v.reqProcessState+'</span></td>');
				var tmpBtn = '<td class="btns">';
				tmpBtn += '<a style="text-decoration:none" class="ml-5" href="javascript:;" title="查看" _href="support-view-details.html">'+
					'<i class="Hui-iconfont remarks">&#xe695;</i></a>' +
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
				url: window.ajaxUrl + "preSupport/requirements/findPageWithArea",
				data: sendData,
				success: function (data)
				{
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
									var sendData = {
										pageSize: pageSize,
										pageNo: obj.curr,
										areaId: areaIdNow,
										arIsCompatibility: arIsCompatibilityNow,
										startTime: startTime,
										endTime: endTime,
										reqSupType: reqSupType
									};

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "preSupport/requirements/findPageWithArea",
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
					}
				}
			});
		}

		sendData = {
			pageSize: pageSize,
			pageNo: pageNo
		};
		renderingPage (sendData);

		/*查询*/
		function findList()
		{
			var sendData = {};

			reqSupType = $('[con_name="reqSupType"]').val();
			startTime = $('[con_name="startTime"]').val();
			endTime = $('[con_name="endTime"]').val();
			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				areaId: areaIdNow,
				arIsCompatibility: arIsCompatibilityNow,
				startTime: startTime,
				endTime: endTime,
				reqSupType: reqSupType
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
				pageNo: pageNo,
				areaId: areaIdNow,
				arIsCompatibility: arIsCompatibilityNow,
				startTime: startTime,
				endTime: endTime,
				reqSupType: reqSupType
			};
			renderingPage (sendData);
			return false;
		});
		/*
		 * 按钮区按钮点击事件
		 * */
		tbody.on("click", ".td-view,.btns a", function ()
		{
			var href = "support-view-details.html",
				title = "信息详情",
				data = {},
				reqId = "",
				taskId = "",
				processInstanceId = "",
				customerId = "",
				reqSupType = "",
				recordCode = "";

			reqId = $(this).parents("tr").attr("reqId");
			taskId = $(this).parents("tr").attr("taskId");
			processInstanceId = $(this).parents("tr").attr("processInstanceId");
			customerId = $(this).parents("tr").attr("customerId");
			recordCode = $(this).parents("tr").attr("reqCode");
			reqSupType = $(this).parents("tr").attr("reqSupType");
			data.reqId = reqId;
			data.taskId = taskId;
			data.processInstanceId = processInstanceId;
			data.customerId = customerId;
			data.recordCode = recordCode;
			data.reqSupType = reqSupType;

			window.layerViewData = data;
			window.layerShow(title,href);
		});

	});
}(jQuery, window, document));
