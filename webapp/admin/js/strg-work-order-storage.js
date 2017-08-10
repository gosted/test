/**
 * 本文件是工单入库js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var sourceId = parent.window.layerViewData.sourceId,
			storelistId = parent.window.layerViewData.storelistId,
			storageId= parent.window.layerViewData.storageId,
			tables = $(".table-box>.form-table"),
			equipmentId = "",
			shelfId = "",
			listId = "",//合同清单id
			storedetailName = "",
			storedetailCode = "",
			workOrderType = "",//工单类型
			pageSize = 20,
			pageNo = 1,
			reqArr = [
				"equipmentId",
				"deviceCode",
				"shelfId",
				"quantity",
				"price"
			],
			reqReg = /[\w\W]+/,
			childLayerInd = "";
		window.getTd(tables);
		//请求工单信息
		function setContractInfo (sendData)
		{
			$.myAjax({
				type: "GET",
				url: window.ajaxUrl + "project/workOrder/findWorkOrder/" + sourceId,
				data: sendData,
				dataType: "json",
				success: function(msg)
				{
					if (msg && msg.success === 0)
					{
						if (msg.data.extensionInfos)
						{
							var extensionInfos = JSON.parse(msg.data.extensionInfos);
							workOrderType = extensionInfos[0].workOderType;
						}

						$.myAjax({
							type: "GET",
							url: window.ajaxUrl + "project/workOrder/findByWorkOrderCode",
							data: {workOrderCode: msg.data.workOrderNum},
							dataType: "json",
							success: function(data)
							{
								if (data && data.success === 0)
								{
									var arr = [
											"workOrderName",
											"workOrderNum",
											"project",
											"site",
											"contract",
											"contractNumber",
											"assigner",
											"remark"
										];
									for (var i = 0, l =arr.length; i < l; i++)
									{
										$('[con_name="'+ arr[i] +'"]').text(data.data[arr[i]] || "");
									}
									setContractDetailList({workOrderId: sourceId, detailType: "QDLX-SB"});//渲染工单清单基本信息
								}
							}
						});
					}
				}
			});
		}

		/*
		 * 渲染表格方法传入请求到的数据
		 * */
		function setTable (data)
		{
			var list = [],
				tbody = $(".contract-details .tbody"),
				STr = null;

			list = data.data;
			tbody.html("");
			if (list.length === 0)
			{
				$(".contract-details .no-data").show();
			}
			else
			{
				$(".contract-details .no-data").hide();
			}

			$.each(list, function (i, v)
			{
				var listId = v.id,
					tdView = $('<td class="text-l td-view"></td>'),
					equLoge = $('<span class="equ-logo l mr-5"></span>'),
					view = $('<a class="l" href="javascript:;"></a>'),
					noInSpan  = $('<span class="no-in"></span>'),
					allInSpan = $('<span class="all-in"></span>');

				STr = $('<tr class="text-c" listId="'+ listId
					+'" ifStore="'+v.ifStore+'"></tr>');//一行
				if (v.ifStore === 0 && v.outNum > 0)
				{
					noInSpan.addClass("c-red");
				}
				else
				{
					noInSpan.addClass("c-gray").attr("noStore", "true");
					allInSpan.addClass("c-gray");
				}


				if (v.attachmentId)
				{
					equLoge.css("background",'url('+ window.ajaxUrl +'project/attachment/downloadImage?id='+ v.attachmentId +') no-repeat').attr({"attachmentId": v.attachmentId});
				}
				tdView.append(equLoge);
				view.text(v.detailName || "");
				tdView.append(view);
				STr.append(tdView);

				STr.append($('<td></td>').text(v.detailModel || ""));
				STr.append($('<td></td>').text(v.detailCompany || ""));
				STr.append($('<td></td>').text(v.ext1 || ""));
				STr.append($('<td></td>').text(v.detailUnit || ""));
				if (v.ifStore === 1)
				{
					noInSpan.text("无需入库");
				}
				else
				{
					noInSpan.text(v.outNum || "0");
				}
				allInSpan.text(v.detailCount || "0");
				STr.append($('<td></td>').append(noInSpan).append('/').append(allInSpan));
				var tmpBtn = '<td class="btns">';

				tmpBtn += '<a style="text-decoration:none" class="ml-5 deal" href="javascript:;" title="标记" _href="">'+
					'<i class="fa fa-bookmark-o" aria-hidden="true"></i></a>';

				tmpBtn += '<a style="text-decoration:none" class="ml-5 storage" href="javascript:;" title="入库" _href="strg-work-order-storage-more.html">'+
					'<i class="fa fa-sign-in fa-lg" aria-hidden="true"></i></a></td>';

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

		//请求工单清单信息
		function setContractDetailList(sendData)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "project/proDeviceList/findByWorkOrderIdWithNum",
				data: sendData,
				dataType: "json",
				success: function(data)
				{
					if (data && data.success === 0)
					{
						setTable(data);
					}
				}
			});
		}

		//主顺序
		setContractInfo ();//渲染工单基本信息

		/*
		 * 列表内按钮区按钮点击事件
		 * */
		var tbody = $(".contract-details .tbody");
		tbody.on("click", ".btns .deal", function ()
		{
			var _this = $(this),
				ifStore = "",
				tip = "",
				data = {};
			ifStore = _this.parents("tr").attr("ifStore");
			if (ifStore === "0")
			{
				tip = '确定标记为不需要入库吗？';
				data.ifStore = "1";
			}
			else
			{
				tip = '确定标记为需要入库吗？';
				data.ifStore = "0";
			}
			var ind = layer.confirm(tip, {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function ()
				{
					layer.close(ind);
					var listId = _this.parents("tr").attr("listId");
					data.id = listId;
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "project/proDeviceList/update",
						data: data,
						dataType: "json",
						success: function(data)
						{
							if (data && data.success === 0)
							{
								setContractDetailList({workOrderId: sourceId, detailType: "QDLX-SB"});//渲染合同清单基本信息
							}
						}
					});
				});
		});

		tbody.on("click", ".btns a", function ()
		{
			var _this = $(this),
				href = _this.attr("_href"),
				title = _this.attr("title"),
				data = {},
				ind = "";

			if (!href)
			{
				return false;
			}

			//入库
			if ($(this).hasClass("storage") && $(this).parents("tr").find(".no-in").attr("noStore") === "true")
			{
				ind = layer.confirm('没有可入库的清单！', {
					btn: ['确定'],
					shade: 0.1
				});
				return false;
			}
			if ($(this).hasClass("storage"))
			{
				if ($(".list-now").children().size() > 0)
				{
					ind = layer.confirm('该操作会覆盖现有入库确认单，是否继续？', {
							btn: ['确定','取消'],
							shade: 0.1
						},
						function ()
						{
							layer.close(ind);
							listId = _this.parents("tr").attr("listId");
							parent.layerViewData.listId = listId;
							parent.layerViewData.sourceId = sourceId;
							parent.layerViewData.storageId = storageId;
							childLayerInd = parent.layer.open({
								type: 2,
								area: [500+'px', 440 +'px'],
								fix: false, //不固定
								maxmin: true,
								shade:0.4,
								title: title,
								content: href,
								end: function ()
								{
									if (parent.layerViewData.equListOndData)
									{
										window.setEquDetailList(parent.layerViewData.equListOndData);
									}
								}
							});
						});
				}
				else
				{
					listId = _this.parents("tr").attr("listId");
					parent.layerViewData.listId = listId;
					parent.layerViewData.sourceId = sourceId;
					parent.layerViewData.storageId = storageId;
					childLayerInd = parent.layer.open({
						type: 2,
						area: [500+'px', 440 +'px'],
						fix: false, //不固定
						maxmin: true,
						shade:0.4,
						title: title,
						content: href,
						end: function ()
						{
							if (parent.layerViewData.equListOndData)
							{
								window.setEquDetailList(parent.layerViewData.equListOndData);
							}
						}
					});
				}
			}
			else
			{
				listId = _this.parents("tr").attr("listId");
				data.listId = listId;
				data.sourceId = sourceId;
				data.storageId = storageId;
				window.layerViewData = data;
				window.layerShow(title,href);
			}
		});

		//tab切换
		$.Huitab(".tabBar span",".tabCon","current","click",0);

		//显示没有数据
		$(".equipment-details .no-data").eq(0).show();
		//生成设备清单的方法，给子页面调用
		window.setEquDetailList = function (data)
		{
			var storeCount = data.storeCount,//入库条数
				assetCode = data.assetCode,//0生成资产编号，1不生成
				storeStyle = data.storeStyle,//0按条入库，1按批入库
				equDelList = $(".list-now");
			equDelList.html("");
			//按条入库
			function setEquDelList (obj)
			{
				var arr = obj.arr,
					equList = obj.equListOneData,
					oneList = null,
					oneListCnt = null,
					temp = [
						"assetName",
						"specifications",
						"manufacturer",
						"price",
						"unit",
						"remark"
					];

				for (var i = 0, l = storeCount; i < l; i++)
				{
					oneList = $('<li></li>');
					oneListCnt = $("#hide-box .edit-disable").clone();
					oneList.append(oneListCnt);
					for (var j = 0, len = temp.length; j < len; j++)
					{
						oneList.find('[con_name="'+ temp[j] +'"]').text(equList[temp[j]] || "").attr({"title": equList[temp[j]] || ""});
					}
					oneList.find('[con_name="quantity"]').text("1").attr({"title": "1"});
					oneList.find('[con_name="equipmentId"]').text(equList.equipmentType || "").attr({"title": equList.equipmentType || "", "thisId": equList.equipmentId});
					oneList.find('[con_name="shelfId"]').text(equList.shelfPosi || "").attr({"title": equList.shelfPosi || "", "thisId": equList.shelfId});
					if (arr && arr.length > 0)
					{
						oneList.find('[con_name="assetCode"]').text(arr[i] || "").attr({"title": arr[i] || ""});
					}
					oneList.find(".order").text(i + 1);
					if (equList.attachmentId)
					{
						oneList.find(".equ-logo").css("background",'url('+ window.ajaxUrl +'project/attachment/downloadImage?id='+ equList.attachmentId +') no-repeat').attr({"attachmentId": equList.attachmentId});
					}
					equDelList.append(oneList);
				}
				if (equDelList.children().size() === 0)
				{
					$(".equipment-details .no-data").eq(0).show();
				}
				else
				{
					$(".equipment-details .no-data").eq(0).hide();
				}
				//默认可以编辑状态
				$(".list-now").find(".deal").click();
				$(".list-now").find('[con_name="quantity"]').attr({"disabled": "disabled"});
			}

			//按批入库
			function setEquDelListOne (obj)
			{
				var equList = obj,
					oneList = null,
					oneListCnt = null,
					temp = [
						"assetName",
						"specifications",
						"manufacturer",
						"price",
						"unit",
						"remark"
					];

				oneList = $('<li></li>');
				oneListCnt = $("#hide-box .edit-disable").clone();
				oneList.append(oneListCnt);

				for (var j = 0, len = temp.length; j < len; j++) {
					oneList.find('[con_name="' + temp[j] + '"]').text(equList[temp[j]] || "").attr({"title": equList[temp[j]] || ""});
				}
				oneList.find('[con_name="quantity"]').text(storeCount).attr({"title": storeCount});
				oneList.find('[con_name="equipmentId"]').text(equList.equipmentType || "").attr({
					"title": equList.equipmentType || "",
					"thisId": equList.equipmentId
				});
				oneList.find('[con_name="shelfId"]').text(equList.shelfPosi || "").attr({
					"title": equList.shelfPosi || "",
					"thisId": equList.shelfId
				});

				oneList.find(".order").text(1);
				if (equList.attachmentId)
				{
					oneList.find(".equ-logo").css("background", 'url('+ window.ajaxUrl +'project/attachment/downloadImage?id=' + equList.attachmentId + ') no-repeat').attr({"attachmentId": equList.attachmentId});
				}
				equDelList.append(oneList);

				if (equDelList.children().size() === 0)
				{
					$(".equipment-details .no-data").eq(0).show();
				}
				else
				{
					$(".equipment-details .no-data").eq(0).hide();
				}
				//默认可以编辑状态
				$(".list-now").find(".deal").click();
				$(".list-now").find('[con_name="assetCode"]').attr({"disabled": "disabled"});
			}

			if (assetCode === "0" && storeStyle === "0")//生成编号并按条入
			{
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "operation/storedetail/findAssetCodes",
					data: {storeCount: storeCount},
					dataType: "json",
					success: function(msg)
					{
						if (msg && msg.success === 0)
						{
							var obj = {};
							obj.arr = msg.data;
							obj.equListOneData = data;
							setEquDelList (obj);
						}
					}
				});
			}
			else
			{
				if (storeStyle === "0")
				{
					var obj = {};
					obj.equListOneData = data;
					setEquDelList (obj);
				}
				else
				{
					setEquDelListOne(data);
				}
			}
			var asCode = equDelList.find('.edit-able [con_name="assetCode"]').eq(0);
			//默认跳到入库确认
			$(".equipment-details .tabBar .now").click();
			if (!asCode.val())
			{
				asCode.focus();
			}
		};

		//重排序方法
		function reorder ($ele)
		{
			var equDelList = $ele,
				order = $ele.find(".order");
			$.each(order, function (i, v)
			{
				$(v).text(parseInt(i/2)+1);
			});
			if (equDelList.children().size() === 0)
			{
				$(".equipment-details .no-data").eq(0).show();
			}
			else
			{
				$(".equipment-details .no-data").eq(0).hide();
			}
		}
		//当前入库删除方法
		$('.list-now').on("click", ".delete", function()
		{
			var _this = $(this),
				ind = "";
			ind = layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function ()
				{
					_this.parents("li").eq(0).remove();
					layer.close(ind);
					reorder($('.list-now'));
				});
		});
		//入库历史删除方法
		$('.list-history').on("click", ".delete", function()
		{
			var _this = $(this),
				sendData = {},
				ind = "";
			sendData.id = _this.parents("li").eq(0).attr("equListId");
			ind = layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function ()
				{
					layer.close(ind);
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "operation/storedetail/deleteByIdsSD",
						data: sendData,
						dataType: "json",
						success: function(msg)
						{
							findList();
							setContractDetailList({workOrderId: sourceId, detailType: "QDLX-SB"});//渲染合同清单基本信息
						}
					});
				});
		});

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

		//单条编辑方法
		$('.equ-det-list').on("click", ".edit-disable .deal", function()
		{
			var _this = $(this),
				editAble = $('#hide-box .edit-able').clone(),
				OLi = _this.parents('li').eq(0),
				conName = OLi.find('[con_name]'),
				oldLogo = null,
				logo = null;
			OLi.find(".edit-disable").hide();
			oldLogo = OLi.find(".edit-disable .equ-logo");
			logo = editAble.find(".equ-logo");
			logo.attr({"style": oldLogo.attr("style"), "attachmentId": oldLogo.attr("attachmentId")});
			if (OLi.find(".edit-able").size() === 0)
			{
				$.each(conName,function (i, v)
				{
					var con_name = $(v).attr("con_name"),
						text = $(v).text();
					if (con_name === "assetName")
					{
						editAble.find('[con_name="'+ con_name +'"]').text(text);
					}
					else
					{
						editAble.find('[con_name="'+ con_name +'"]').val(text);
					}
					if ($(v).attr("thisId"))
					{
						editAble.find('[con_name="'+ con_name +'"]').attr("thisId",$(v).attr("thisId"));
					}
				});

				editAble.find('.order').text(OLi.find('.order').text());
				OLi.append(editAble);
				if (editAble.parents(".equ-det-list").hasClass("list-history"))
				{
					editAble.find('[con_name="quantity"]').attr("disabled", "disabled");
					editAble.find('[con_name="assetCode"]').attr("disabled", "disabled");
				}

				//基地资产编号校验
				editAble.find('[con_name="assetCode"]').on("blur", function ()
				{
					var _this = $(this),
						equListId = OLi.attr("equListId");
					if (!equListId)
					{
						if (_this.val())
						{
							$.myAjax({
								type: "POST",
								url: window.ajaxUrl + "operation/stockdetail/findExistByAssetCode",
								data: {baseAssetCode: _this.val(),stockdetailState: "RK"},
								dataType: "json",
								success: function(msg)
								{
									var ind = "",
										thisData = [];
									if (msg && msg.success === 0)
									{
										if (msg.data.length > 0)
										{
											/*layer.msg('资产编号已存在', {icon:5,time:1000});
											_this.focus();*/
											ind = layer.confirm('该资产已存在，是否提取信息替换当前填写信息？', {
												btn: ['确定','取消'],
												shade: 0.1
											},
											function ()
											{
												layer.close(ind);
												thisData = msg.data[0];
												var curEdtAble = _this.parents('.edit-able').eq(0),
													arr = [
														"specifications",
														"manufacturer",
														"deviceCode",
														"quantity",
														"price",
														"unit",
														"remark"
													];
												for (var i = 0, l = arr.length; i < l; i++)
												{
													curEdtAble.find('[con_name="' + arr[i] + '"]').val(thisData[arr[i]] || "").attr({"title": thisData[arr[i]] || ""});
												}
												if (thisData.assetName)
												{
													curEdtAble.find('[con_name="assetName"]').text(thisData.assetName).attr({"title": thisData.assetName});
												}
												curEdtAble.find('[con_name="quantity"]').val(thisData.quantity).attr({"title": thisData.quantity});
												curEdtAble.find('[con_name="equipmentId"]').val(thisData.equipmentName || "").attr({
													"title": thisData.equipmentName || "",
													"thisId": thisData.equipmentId
												});
												/*curEdtAble.find('[con_name="shelfId"]').val(thisData.shelfName || "").attr({
													"title": thisData.shelfName || "",
													"thisId": thisData.shelfId
												});*/
											});
										}
									}
								}
							});
						}
					}
				});
				//单价校验
				editAble.find('[con_name="price"]').on("blur", function ()
				{
					if (!$(this).val())
					{
						return false;
					}
					var reg = /^[-+]?\d{1,3}(\,\d{3})*(\.?\d{1,2})?$/,
						_this = $(this),
						oldPrice = OLi.find('.edit-disable [con_name="price"]').text();
					function comdify(n){
						var re=/[-+]?\d{1,3}(?=(\d{3})+$)/g;
						var n1=Number(n).toFixed(2).toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
						return n1;
					}
					var newVal = comdify(_this.val());
					function focusMoney()
					{
						if ($(this).val().search(reg) > -1 && Number($(this).val().replace(/\,/g, "")) <= 9999999999999.99)
						{
							$(this).val($(this).val().replace(/\,/g, ""));
						}
					}
					_this.off("focus");
					_this.on("focus",focusMoney);
					if (newVal && (newVal.search(reg) < 0 || Number(newVal.replace(/\,/g, "")) > 9999999999999.99))
					{
						var ind = layer.confirm('请输入正确金额,0~9,999,999,999,999.99元之间', {
							btn: ['确定','取消'],
							shade: 0.1
						},function()
						{
							layer.close(ind);
							_this.val(oldPrice);
						},function()
						{
							_this.val(oldPrice);
						});
					}
					else
					{
						_this.val(newVal);
					}
				});

				//数量校验
				editAble.find('[con_name="quantity"]').on("blur", function ()
				{
					var reg = /^\d+(\.?\d+)?$/,
						_this = $(this),
						oldVal = OLi.find('.edit-disable [con_name="quantity"]').text(),
						ONoIn = $('[listId="'+ listId +'"]').find(".no-in"),
						onInNum = Number(ONoIn.text()),
						ONowOnIn = editAble.parents(".equ-det-list").find('[con_name="quantity"]'),
						ONowOnInNum = 0,
						ind = "";

					$.each(ONowOnIn, function (i, v)
					{
						ONowOnInNum += Number($(v).text());
					});
					ONowOnInNum -= Number(editAble.parent("li").find('[con_name="quantity"]').eq(0).text());

					if (_this.val() && _this.val().search(reg) < 0)
					{
						ind = layer.confirm('请正确填写数量', {
							btn: ['确定','取消'],
							shade: 0.1
						},function()
						{
							layer.close(ind);
							_this.val(oldVal);
						},function()
						{
							_this.val(oldVal);
						});
						return false;
					}
					ONowOnInNum += Number(_this.val());
					if (ONowOnInNum > onInNum)
					{
						ind = layer.confirm('总数量不能大于未入库数量', {
							btn: ['确定'],
							shade: 0.1
						},function()
						{
							layer.close(ind);
							_this.val(oldVal);
						},function()
						{
							_this.val(oldVal);
						});
						console.error("未入库数量",onInNum, "总数量",ONowOnInNum);
						return false;
					}
				});
				//编辑后确认
				editAble.find('.sure').on("click", function ()
				{
					var tempConName = editAble.find('[con_name]'),
						equListId = "",
						sendData = {},
						sndDt = "";
					//校验必填项
					for (var i = 0, l = reqArr.length; i < l; i++)
					{
						var temp = editAble.find('[con_name="'+ reqArr[i] +'"]').val();
						if (!reqReg.test(temp))
						{
							layer.confirm('请正确填写必填项', {
								btn: ['确定'],
								shade: 0.1
							});
							return false;
						}
					}

					oldLogo.attr({"style": logo.attr("style"), "attachmentId": logo.attr("attachmentId")});
					$.each(tempConName,function (i, v)
					{
						var temp_con_name = $(v).attr("con_name"),
							val = $(v).val();

						if (temp_con_name !== "assetName")
						{
							OLi.find(".edit-disable").find('[con_name="'+ temp_con_name +'"]').text(val).attr("title",val);
						}
						if ($(v).attr("thisId"))
						{
							OLi.find(".edit-disable").find('[con_name="'+ temp_con_name +'"]').attr("thisId",$(v).attr("thisId"));
						}
					});

					sendData = getOnestorelistData(OLi);
					equListId = OLi.attr("equListId");
					if (equListId)
					{
						sendData.storeD.id = equListId;
						sndDt = JSON.stringify(sendData);
						$.myAjax({
							type: "POST",
							url: window.ajaxUrl + "operation/storedetail/updateSD",
							data: {records: sndDt},
							dataType: "json",
							success: function(msg)
							{
								if (msg && msg.success === 0)
								{
									editAble.remove();
									OLi.find(".edit-disable").show();
								}
							}
						});
					}
					else
					{
						var nowAssetCode = editAble.find('[con_name="assetCode"]').val();
						if (nowAssetCode)
						{
							$.myAjax({
								type: "POST",
								url: window.ajaxUrl + "operation/stockdetail/findExistByAssetCode",
								data: {baseAssetCode: nowAssetCode,stockdetailState: "RK"},
								dataType: "json",
								success: function(msg)
								{
									if (msg && msg.success === 0)
									{
										sndDt = JSON.stringify(sendData);
										$.myAjax({
											type: "POST",
											url: window.ajaxUrl + "operation/storedetail/createSDByWorkOrder",
											data: {records: "[" + sndDt + "]"},
											dataType: "json",
											success: function(msg)
											{
												if (msg && msg.success === 0)
												{
													OLi.remove();
													layer.msg('该清单已存在入库历史中！', {icon:6,time:1000});
													reorder($('.list-now'));
													setContractDetailList({workOrderId: sourceId, detailType: "QDLX-SB"});//渲染合同清单基本信息
												}
											}
										});
									}
								}
							});
						}
						else
						{
							sndDt = JSON.stringify(sendData);
							$.myAjax({
								type: "POST",
								url: window.ajaxUrl + "operation/storedetail/createSDByWorkOrder",
								data: {records: "[" + sndDt + "]"},
								dataType: "json",
								success: function(msg)
								{
									if (msg && msg.success === 0)
									{
										OLi.remove();
										layer.msg('该清单已存在入库历史中！', {icon:6,time:1000});
										reorder($('.list-now'));
										setContractDetailList({workOrderId: sourceId, detailType: "QDLX-SB"});//渲染合同清单基本信息
									}
								}
							});
						}
					}

				});

				//设备分类
				setOneTree({
					ele: editAble.find('.equ-type'),
					url: ajaxUrl + "operation/equipment/findTree",
					type: "POST",
					data: {id: 0},
					id: "id",
					value: "equipmentName",
					//all: "全部",//是否有所有这一级
					treeClick: function ()
					{
						var _this = $(this),
							equId = "",
							attachmentId = "";
						if (_this.hasClass("all"))
						{
							equId = _this.parents("li").eq(0).attr("allId");
						}
						else
						{
							equId = _this.parents("li").eq(0).attr("treeId");
						}
						editAble.find('[con_name="equipmentId"]').attr({"thisId": equId});
						attachmentId = _this.parents("li").eq(0).attr("attachmentId");
						if (attachmentId)
						{
							OLi.find(".equ-logo").css("background",'url('+ window.ajaxUrl +'project/attachment/downloadImage?id='+ attachmentId +') no-repeat').attr({"attachmentId": attachmentId});
						}
						else
						{
							OLi.find(".equ-logo").attr({"attachmentId": ""}).removeAttr("style");
						}
					}
				});

				//货架位置
				setOneTree({
					ele: editAble.find('.shelf-position'),
					url: ajaxUrl + "operation/shelf/findTree",
					type: "POST",
					data: {storageId: storageId},
					id: "id",
					value: "shelfName",
					//all: "全部",//是否有所有这一级
					sendD: "storageId",
					treeClick: function ()
					{
						var _this = $(this),
							shlfId = "";
						if (_this.hasClass("all"))
						{
							shlfId = _this.parents("li").eq(0).attr("allId");
						}
						else
						{
							shlfId = _this.parents("li").eq(0).attr("treeId");
						}
						editAble.find('[con_name="shelfId"]').attr({"thisId": shlfId});
					}
				});
			}
		});
		/*********************历史入库**************************/
		function setHistoryTable (data)
		{
			var list = [],
				listHistory = $(".list-history"),
				STr = null;

			function comdify(n){
				var re=/[-+]?\d{1,3}(?=(\d{3})+$)/g;
				var n1=Number(n).toFixed(2).toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
				return n1;
			}
			
			list = data.data.result;
			listHistory.html("");
			if (list.length === 0)
			{
				$(".equipment-details .no-data").eq(1).show();
			}
			else
			{
				$(".equipment-details .no-data").eq(1).hide();
			}

			$.each(list, function (i, v)
			{
				var oneList = null,
					oneListCnt = null,
					temp = [
						"assetName",
						"specifications",
						"manufacturer",
						"deviceCode",
						"unit",
						"remark",
						"quantity",
						"assetCode"
					];
				oneList = $('<li equListId="'+ v.id +'"></li>');
				oneListCnt = $("#hide-box .edit-disable").clone();
				oneList.append(oneListCnt);

				for (var j = 0, len = temp.length; j < len; j++)
				{
					oneList.find('[con_name="'+ temp[j] +'"]').text(v[temp[j]] || "").attr({"title": v[temp[j]] || ""});
				}

				oneList.find('[con_name="equipmentId"]').text(v.equipmentName || "").attr({"title": v.equipmentName || "", "thisId": v.equipmentId});
				oneList.find('[con_name="shelfId"]').text(v.shelfName || "").attr({"title": v.shelfName || "", "thisId": v.shelfId});
				if (typeof (v.price) == 'number')
				{
					oneList.find('[con_name="price"]').text(comdify(v.price.toString())).attr({"title": comdify(v.price.toString())});
				}
				oneList.find(".order").text(i + 1);
				if (v.attachmentId)
				{
					oneList.find(".equ-logo").css("background",'url('+ window.ajaxUrl +'project/attachment/downloadImage?id='+ v.attachmentId +') no-repeat').attr({"attachmentId": v.attachmentId});
				}
				listHistory.append(oneList);
			});
		}

		/*渲染表格和分页的方法,传入要向后台传的数据*/
		function renderingPage (sendData)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "operation/storedetail/findPage",
				data: sendData,
				success: function (data) {
					if (data && data.success === 0) {
						setHistoryTable(data);
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
										storelistId: storelistId
									};
									storedetailCode ? sendData.storedetailCode = storedetailCode : false;
									storedetailName ? sendData.storedetailName = storedetailName : false;

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "operation/storedetail/findPage",
										data: sendData,
										success: function (data)
										{
											if (data && data.success === 0)
											{
												setHistoryTable(data);
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
				pageNo: pageNo,
				storelistId: storelistId
			};
			storedetailCode ? sendData.storedetailCode = storedetailCode : false;
			storedetailName ? sendData.storedetailName = storedetailName : false;
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

		$(".history").on("click", function()
		{
			renderingPage({
				pageSize: pageSize,
				pageNo: pageNo,
				storelistId: storelistId
			});
		});

		/*
		 * 查询方法
		 * */
		function findList()
		{
			var search = $(".search-area"),
				sendData = {};

			storedetailCode = search.find('[con_name="storedetailCode"]').val();
			storedetailName = search.find('[con_name="storedetailName"]').val();

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				storelistId: storelistId
			};

			storedetailCode ? sendData.storedetailCode = storedetailCode : false;
			storedetailName ? sendData.storedetailName = storedetailName : false;
			renderingPage(sendData);
		}
		$(".find-btn").on("click", findList);
		$(".search-area").keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});
		/*********************历史入库结束**************************/
		//获取要保存的所有列表的数据
		/*function getAllstorelistData()
		{
			var equDetList = $('.list-now li'),
				data = [];
			/!*
			 * getTextData方法获取要提交的数据
			 * 传入包含con_name的元素和con_name的数组的对象
			 * 返回组装好的数据
			 * *!/
			function getTextData (obj)
			{
				var data = {},
					box = $(obj.ele),
					arr = obj.arr;

				//校验必填项
				for (var i = 0, l = reqArr.length; i < l; i++)
				{
					var temp = box.find('[con_name="'+ reqArr[i] +'"]').val();
					if (!reqReg.test(temp))
					{
						layer.confirm('请正确填写必填项', {
							btn: ['确定'],
							shade: 0.1
						});
						box.find(".deal").click();
						return false;
					}
				}

				for (var j = 0, len = arr.length; j < len; j++)
				{
					if (arr[j])
					{
						data[arr[j]] = box.find('[con_name="'+ arr[j] +'"]').text();
					}
				}
				return data;
			}

			var res = true;
			$.each(equDetList, function (i, v)
			{
				var temp = {},
					arr = [
						"assetName",
						"specifications",
						"manufacturer",
						"assetCode",
						"deviceCode",
						"price",
						"quantity",
						"unit",
						"remark"
					];
				temp = getTextData({ele: v, arr: arr});
				if (temp === false)
				{
					res = false;
					return false;
				}
				temp.equipmentId = $(v).find('[con_name="equipmentId"]').attr("thisId");
				temp.shelfId = $(v).find('[con_name="shelfId"]').attr("thisId");
				temp.storelistId = storelistId;
				temp.storageId = storageId;
				temp.sourceId = listId;
				temp.relatedAttachId = $(v).find('.equ-logo').attr("attachmentId");
				//temp.storedetailParam = "";
				//temp.assetStatus = "";

				temp.stockD = {
					//stockdetailState: temp.assetStatus,
					//stockdetailParam: temp.storedetailParam,
					storageId: temp.storageId,
					sourceId: temp.sourceId,
					attachmentId: temp.relatedAttachId,
					stockdetailFactory: temp.manufacturer,
					equipmentId: temp.equipmentId,
					stockdetailName: temp.assetName,
					stockdetailModel: temp.specifications,
					stockdetailCode: temp.deviceCode,
					baseAssetCode: temp.assetCode,
					shelfId: temp.shelfId,
					stockdetailUnit: temp.unit,
					stockdetailRemark: temp.remark,
					stockdetailNum: temp.quantity
				};
				temp.storeD = {
					//storedetailParam: temp.storedetailParam,
					storelistId: temp.storelistId,
					attachmentId: temp.relatedAttachId,
					detailCompany: temp.manufacturer,
					detailPrice: temp.price,
					storageId: temp.storageId,
					sourceId: temp.sourceId,
					equipmentId: temp.equipmentId,
					storedetailName: temp.assetName,
					storedetailModel: temp.specifications,
					storedetailCode: temp.deviceCode,
					baseAssetCode: temp.assetCode,
					shelfId: temp.shelfId,
					storedetailUnit: temp.unit,
					storedetailRemark: temp.remark,
					storedetailNum: temp.quantity
				};

				data.push(temp);
			});
			if (res === false)
			{
				return false;
			}
			return JSON.stringify(data);
		}*/

		//获取要保存的单条列表的数据
		function getOnestorelistData($ele)
		{
			var equDetList = $ele.find(".edit-disable"),
				temp = {};//单条li
			/*
			 * getTextData方法获取要提交的数据
			 * 传入包含con_name的元素和con_name的数组的对象
			 * 返回组装好的数据
			 * */
			function getTextData (obj)
			{
				var data = {},
					box = $(obj.ele),
					arr = obj.arr;

				for (var i = 0, len = arr.length; i < len; i++)
				{
					if (arr[i])
					{
						data[arr[i]] = box.find('[con_name="'+ arr[i] +'"]').text();
					}
				}
				return data;
			}

			$.each(equDetList, function (i, v)
			{
				var arr = [
						"assetName",
						"specifications",
						"manufacturer",
						"assetCode",
						"deviceCode",
						"price",
						"quantity",
						"unit",
						"remark"
					];
				temp = getTextData({ele: v, arr: arr});
				temp.workOrderType = workOrderType;
				temp.equipmentId = $(v).find('[con_name="equipmentId"]').attr("thisId");
				temp.shelfId = $(v).find('[con_name="shelfId"]').attr("thisId");
				if (temp.shelfId === "0")
				{
					temp.shelfId = storageId;
				}
				temp.storelistId = storelistId;
				temp.storageId = storageId;
				temp.price = temp.price.replace(/\,/g, "");
				temp.relatedAttachId = $(v).find('.equ-logo').attr("attachmentId");
				//temp.storedetailParam = "888";
				//temp.assetStatus = "888";

				temp.stockD = {
					//stockdetailState: temp.assetStatus,
					//stockdetailParam: temp.storedetailParam,
					storageId: temp.storageId,

					attachmentId: temp.relatedAttachId,
					stockdetailFactory: temp.manufacturer,
					equipmentId: temp.equipmentId,
					stockdetailName: temp.assetName,
					stockdetailModel: temp.specifications,
					stockdetailCode: temp.deviceCode,
					baseAssetCode: temp.assetCode,
					shelfId: temp.shelfId,
					stockdetailUnit: temp.unit,
					stockdetailRemark: temp.remark,
					stockdetailNum: temp.quantity
				};
				temp.storeD = {
					//storedetailParam: temp.storedetailParam,
					storelistId: temp.storelistId,
					detailCompany: temp.manufacturer,
					detailPrice: temp.price,
					storageId: temp.storageId,
					attachmentId: temp.relatedAttachId,
					equipmentId: temp.equipmentId,
					storedetailName: temp.assetName,
					storedetailModel: temp.specifications,
					storedetailCode: temp.deviceCode,
					baseAssetCode: temp.assetCode,
					shelfId: temp.shelfId,
					storedetailUnit: temp.unit,
					storedetailRemark: temp.remark,
					storedetailNum: temp.quantity
				};
				if (listId)
				{
					temp.sourceId = listId;
					temp.storeD.sourceId = listId;
					temp.stockD.sourceId = listId;
				}
			});
			return temp;
		}

		/*批量打印标签*/
		$('.print-all').on("click", function ()
		{
			var ALi = $('.list-history [equListId]'),
				arr = [],
				ind = '';

			$.each(ALi, function (i, v)
			{
				var editDisable = $(v).find('.edit-disable'),
					equipmentId = '',
					assetName = '',
					assetCode = '',
					oneData = {};
				equipmentId = editDisable.find('[con_name="equipmentId"]').text();
				assetName = editDisable.find('[con_name="assetName"]').text();
				assetCode = editDisable.find('[con_name="assetCode"]').text();
				oneData = {
					equipmentId: equipmentId,
					assetName: assetName,
					assetCode: assetCode
				};
				if (assetCode.replace(/\s/g,""))
				{
					arr.push(oneData);
				}
			});
			if (arr.length === 0)
			{
				ind = layer.confirm('没有可打印资产标签！', {
					btn: ['确定'],
					shade: 0.1
				});
				return false;
			}
			ind = layer.confirm('共<span class="c-red">'+ ALi.size() + '</span>条数据，可以打印资产标签的有<span class="c-red">'+ arr.length + '</span>条，确定打印吗？', {
				btn: ['确定','取消'],
				shade: 0.1
			},function()
			{
				layer.close(ind);
				printBarCode(arr);
			});
		});
		/*批量打印标签结束*/
		/*单条打印标签*/
		$('.list-history').on("click", ".print", function ()
		{
			var editDisable = $(this).parents('.edit-disable').eq(0),
				arr = [],
				ind = '',
				equipmentId = '',
				assetName = '',
				assetCode = '',
				oneData = {};
			equipmentId = editDisable.find('[con_name="equipmentId"]').text();
			assetName = editDisable.find('[con_name="assetName"]').text();
			assetCode = editDisable.find('[con_name="assetCode"]').text();
			oneData = {
				equipmentId: equipmentId,
				assetName: assetName,
				assetCode: assetCode
			};
			arr.push(oneData);
			if (!assetCode.replace(/\s/g,""))
			{
				ind = layer.confirm('没有资产编号，无需打印资产标签！', {
					btn: ['确定'],
					shade: 0.1
				});
				return false;
			}
			ind = layer.confirm('确定打印这条资产标签吗？', {
				btn: ['确定','取消'],
				shade: 0.1
			},function()
			{
				layer.close(ind);
				printBarCode(arr);
			});
		});
		/*单条打印标签结束*/

		/*$(".form-content").Validform({
			btnSubmit: ".save",
			tiptype:2,
			datatype: {
				"date": /^\d{4}\-\d{2}\-\d{2}$/
			},
			beforeSubmit:function(curform){
				if (getAllstorelistData() === false)
				{
					return false;
				}
				var sendData = {records: getAllstorelistData()};
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "operation/storedetail/createSDByWorkOrder",
					data: sendData,
					dataType: "json",
					success: function(msg)
					{
						if (msg && msg.success === 0)
						{
							window.parent.location.reload();
						}
					}
				});
			},
			callback:function(form){
				return false;
			}
		});*/
	});
}(jQuery, window, document));
