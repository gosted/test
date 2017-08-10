/**
 * 本文件是库存数量统计js文件
 * @author 张欢
 */
(function($, w, d){
	'use strict';
	$(function(){
		var AREA_ID = 0;
		var EQU_ID = '';
		//库存echarts构造方法
		function StoreCountEcharts(contEcharts)
		{
			this.echartsData = {};
			this.myChart = echarts.init(contEcharts);
		}
		//设置方法
		StoreCountEcharts.prototype.setEharts = function(data)
		{
			var reuseRate = data.reuseRate || 0;//资产重复使用率
			var unuseRate = data.unuseRate || 0;//未重复使用率
			var _option = {
				title: [
					{
						text: '设备重复使用率',
						x: '48%',
						y: '48%',
						textAlign: 'center',
						textStyle: {
							color: '#006fbb',
							fontSize: '14'
						}
					}
				],
				tooltip: {
					trigger: 'item',
					formatter: "{b}:<br/> {c} ({d}%)"
				},
				color: ['#5DC879','#FFBB67'],
				grid: {
					top: '20',
					left: '20%',
					right: '20%',
					bottom: '20%',
					containLabel: true
				},
				series: [{
					tooltip: {
						trigger: 'item',
						formatter: "{b}: {d}%"
					},
					type: 'pie',
					radius: ['30%', '50%'],
					label: {
						normal: {
							textStyle: {
								color: '#000'
							}
						}
					},
					data: [{
						value: reuseRate,
						name: '重复'
					}, {
						value: unuseRate,
						name: '未重复'
					}],
					itemStyle: {
						normal:{
							label:{
								show: true,
								formatter: '{b}({d}%)'
							},
							labelLine :{show:true}
						}
					}
				}]
			};
			this.myChart.setOption(_option);
			this.echartsData = data;
		};
		var strCntEhrts = new StoreCountEcharts(document.querySelector('#reuse'));

		/*下拉树*/
		var setOneTree = function (obj)
		{
			/*
			 * treeOnClick树形菜单点击回调函数
			 *
			 * */
			var ele = obj.ele || $(".input-tree");
			function treeOnClick()
			{
				var _this = $(this),
					inpt = _this.parents(".input-tree").eq(0).children(".input-text"),
					tree = _this.parents(".tree").eq(0),
					treeTxt = _this.parents("li").children("a").children(".tree-txt"),
					txtArr = [],
					id = _this.parents("li").eq(0).attr("treeId");

				_this.parents(".tree").eq(0).find(".tree-txt").removeClass("clr-blue");
				_this.addClass("clr-blue");
				$.each(treeTxt, function (i, v)
				{
					txtArr.push($(v).text());
				});
				txtArr = txtArr.reverse();
				inpt.val(txtArr.join("/"));
				tree.hide();
				_this.parents(".input-tree").eq(0).attr("open_list", "false");
				inpt.blur();
			}
			/*
			 * treeInit初始化树形菜单方法
			 *
			 * */
			function treeInit(obj)
			{
				var tree = ele.find(".tree"),
					data = obj.data;

				tree.html("");
				if (obj.all)
				{
					var OLi = $('<li></li>'),
						OA = $('<a href="javascript:;"></a>'),
						allId = "";
					OLi.append('<span class="tree-sw"></span>');
					if (obj.showIcon === true)
					{
						OA.append('<span class="tree-icon"></span>');
					}
					OA.append('<span class="tree-txt all"></span>');
					OA.find(".tree-txt").html(obj.all);
					OLi.attr("treeId", obj.initSendData[obj.id]);
					$.each(data, function (i, v){
						$.each(v, function (j,va)
						{
							if (j === obj.id)
							{
								allId += "," + va;
							}
						});
					});
					allId = allId.substr(1);
					OLi.attr("allId", allId);
					OLi.append(OA);
					tree.append(OLi);
				}
				else
				{
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
							else if (j === "storeStyle")
							{
								OLi.attr("storeStyle", va);
							}
							else if (j === "attachmentId")
							{
								OLi.attr("attachmentId", va);
							}
							else
							{
								//OA.attr(j, va);
							}
						});
						OLi.append(OA);
						tree.append(OLi);
					});
				}
				tree.on("click", ".tree-sw", function ()
				{
					var _this = $(this),
						OUl = _this.parent("li").children("ul"),
						id = _this.parent("li").attr("treeId"),
						sendData = {};
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
							sendData.id = $(this).parents("li").attr("treeId");
							if (obj.sendD === "storageId")
							{
								sendData.storageId = storageId;
							}
							$.myAjax({
								url: obj.url,
								type: obj.type || "POST",
								data: sendData,
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
												else if (j === "storeStyle")
												{
													OLi.attr("storeStyle", va);
												}
												else if (j === "attachmentId")
												{
													OLi.attr("attachmentId", va);
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

			ele.on("click", ".input-text", function ()
			{
				var _this = $(this),
					flag = false;
				$(".input-tree .tree").hide();
				$(".input-tree").attr("open_list", "false");
				if (_this.parents(".input-tree").find(".tree li").size() === 0)
				{
					_this.parents(".input-tree").eq(0).find(".tree").hide();
					_this.parents(".input-tree").eq(0).attr("open_list", "false");
				}
				flag = (_this.parents(".input-tree").eq(0).attr("open_list") === "false") ||
					(_this.parents(".input-tree").eq(0).attr("open_list") === undefined);

				if (flag)
				{
					_this.parents(".input-tree").eq(0).find(".tree").show();
					_this.parents(".input-tree").eq(0).attr("open_list", "true");
					if (ele.find(".tree li").size() === 0)
					{
						$.myAjax({
							url: obj.url,
							type: obj.type || "POST",
							data: obj.data || "",
							success: function (data)
							{
								if (data && data.success === 0)
								{
									var treeArr =data.data;
									treeInit({
										ele: ele,
										data: treeArr,
										id: obj.id || "id",
										value: obj.value,
										url: obj.url,
										type: obj.type || "POST",
										all: obj.all || false,
										sendD: obj.sendD || "",
										initSendData: obj.data,
										treeClick: obj.treeClick || ""
									});
								}
							}
						});
					}
				}
				else
				{
					_this.parents(".input-tree").eq(0).find(".tree").hide();
					_this.parents(".input-tree").eq(0).attr("open_list", "false");
				}
			});
			$(document).on("click", function (e){//点击其他地方要关闭树
				var evnt = e || window.event,
					tar = $(evnt.target);
				if (tar.parents(".input-tree").size() === 0)
				{
					$(".input-tree .tree").hide();
					$(".input-tree").attr("open_list", "false");
				}
			});
		};
		/*下拉树结束*/

		//地区
		setOneTree({
			ele: $('.areaId'),
			url: ajaxUrl + "general/area/findByParentIdNoAuth",
			type: "POST",
			data: {id: 0},
			id: "id",
			value: "areaNameStr",
			all: "中国",
			treeClick: function ()
			{
				var _this = $(this);
				if (_this.hasClass("all"))
				{
					if (AREA_ID === 0)
					{
						return false;
					}
					AREA_ID = 0;
				}
				else
				{
					if (AREA_ID === _this.parents("li").eq(0).attr("treeId"))
					{
						return false;
					}
					AREA_ID = _this.parents("li").eq(0).attr("treeId");
				}
				//地区变化时查库房
				var sendData = {areaId: 0};
				$('[con_name="storageId"]').html('');
				if (AREA_ID || AREA_ID === '0')
				{
					sendData.areaId = AREA_ID;
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "operation/storage/findStorageByAreaId",
						data: sendData,
						success: function (data)
						{
							if (data && data.success === 0)
							{
								if (data.data)
								{
									for (var i = 0, l = data.data.length; i < l; i++)
									{
										$('[con_name="storageId"]').append($('<option value="'+ data.data[i].id
											+'"></option>').text(data.data[i].storageName));
									}
								}
							}
						}
					});
				}
			}
		});
		//设备分类
		setOneTree({
			ele: $('.equipmentId'),
			url: ajaxUrl + "operation/equipment/findTree",
			type: "POST",
			data: {id: 0},
			id: "id",
			value: "equipmentName",
			all: "全部",//是否有所有这一级
			treeClick: function ()
			{
				var _this = $(this);
				if (_this.hasClass("all"))
				{
					EQU_ID = _this.parents("li").eq(0).attr("allId");
				}
				else
				{
					EQU_ID = _this.parents("li").eq(0).attr("treeId");
				}
			}
		});
		//页面加载时请求所有库房
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "operation/storage/findStorageByAreaId",
			data: {areaId: 0},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					if (data.data)
					{
						for (var i = 0, l = data.data.length; i < l; i++)
						{
							$('[con_name="storageId"]').append($('<option value="'+ data.data[i].id
								+'"></option>').text(data.data[i].storageName));
						}
					}
				}
			}
		});

		//金额加千分位
		function comdify(n){
			var re=/[-+]?\d{1,3}(?=(\d{3})+$)/g;
			var n1=Number(n.replace(/\,/g, "")).toFixed(2).toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
			return n1;
		}
		//查询方法
		function find()
		{
			var areaId = AREA_ID;
			var storageId = $('[con_name="storageId"]').val();
			var equipmentId = EQU_ID;
			var startTime = $('[con_name="startTime"]').val();
			var endTime = $('[con_name="endTime"]').val();
			var sendData = {
				areaId: areaId,
				storageId: storageId,
				equipmentId: equipmentId,
				startTime: startTime,
				endTime: endTime
			};
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "project/statistics/findStockByCondition",
				data: sendData,
				success: function (data)
				{
					if (data && data.success === 0)
					{
						/*var storeCount = data.storeCount || 0;//入库设备数量
						var outCount = data.outCount || 0;//出库设备数量
						var assetStoreCount = data.assetStoreCount || 0;//资产入库数量
						var notAssetStoreCount = data.notAssetStoreCount || 0;//非资产入库数量
						var assetOutCount = data.assetOutCount || 0;//资产出库数量
						var notAssetOutCount = data.notAssetOutCount || 0;//非资产出库数量
						var storeValue = data.storeValue || 0;//入库总价值
						var outValue = data.outValue || 0;//出库总价值*/
						var conName = $('.cnt-list-count [con_name]');
						$.each(conName, function(i, v)
						{
							var key = $(v).attr('con_name');
							var val = data.data[$(v).attr('con_name')];
							if (typeof (val) == 'number')
							{
								if (key === 'storeValue' || key === 'outValue')
								{
									val = comdify(String(val));
								}
								$(v).text(String(val) || 0);
							}
						});
						strCntEhrts.setEharts(data.data);
					}
				}
			});
		}
		find();
		$('.find-btn').on('click', function()
		{
			find();
		});

	})
}(jQuery, window, document));