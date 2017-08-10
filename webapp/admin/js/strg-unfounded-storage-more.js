/**
 * 本文件是单个清单无依据入库js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var sourceId = parent.window.layerViewData.sourceId,
			storageId = parent.window.layerViewData.storageId,
			equListOndData = {},
			equipmentId = "",
			shelfId = "",
			storeStyle = "",//入库方式0按条入，1按批入
			attachmentId = "";

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

		//设备分类
		setOneTree({
			ele: $(".equipment-type"),
			url: ajaxUrl + "operation/equipment/findTree",
			type: "POST",
			data: {id: 0},
			id: "id",
			value: "equipmentName",
			//all: "全部",//是否有所有这一级
			treeClick: function ()
			{
				var _this = $(this),
					OAssetCode = $('[name="assetCode"]');
				if (_this.hasClass("all"))
				{
					equipmentId = _this.parents("li").eq(0).attr("allId");
				}
				else
				{
					equipmentId = _this.parents("li").eq(0).attr("treeId");
				}
				storeStyle = _this.parents("li").eq(0).attr("storeStyle");
				attachmentId = _this.parents("li").eq(0).attr("attachmentId");
				if (storeStyle !== "0")
				{
					OAssetCode.eq(1).click();
					OAssetCode.attr({"disabled": "true"});
				}
				else
				{
					OAssetCode.removeAttr("disabled");
					OAssetCode.eq(0).click();

				}
			}
		});

		//货架位置
		setOneTree({
			ele: $(".shelf-position"),
			url: ajaxUrl + "operation/shelf/findTree",
			type: "POST",
			data: {storageId: storageId},
			id: "id",
			value: "shelfName",
			//all: "全部",//是否有所有这一级
			sendD: "storageId",
			treeClick: function ()
			{
				var _this = $(this);
				if (_this.hasClass("all"))
				{
					shelfId = _this.parents("li").eq(0).attr("allId");
				}
				else
				{
					shelfId = _this.parents("li").eq(0).attr("treeId");
				}
			}
		});

		function comdify(n){
			var re=/[-+]?\d{1,3}(?=(\d{3})+$)/g;
			var n1=Number(n).toFixed(2).toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
			return n1;
		}

		/*$('[con_name="price"]').on("blur", function ()
		{
			var oldVal = $(this).val();
			$(this).val(comdify(oldVal));
		}).on("focus", function ()
		{
			var oldVal = $(this).val();
			$(this).val(oldVal.replace(/\,/g, ""));
		});*/

		$(".form-ctn").Validform({
			btnSubmit: ".save",
			tiptype: function(msg,o,cssctl){
				var objtip=$("#tip-msg");
				cssctl(objtip,o.type);
				objtip.text(msg);
			},
			datatype: {
				"area": /\/+/,
				"float": /^\d+(\.?\d+)?$/,
				"money": function (gets,obj,curform,regxp)
				{
					var reg = /^[-+]?\d{1,3}(\,\d{3})*(\.?\d{1,2})?$/;
					function comdify(n){
						var re=/[-+]?\d{1,3}(?=(\d{3})+$)/g;
						var n1=Number(n.replace(/\,/g, "")).toFixed(2).toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
						return n1;
					}
					var newVal = comdify(gets);
					function focusMoney()
					{
						if ($(this).val().search(reg) > -1 && Number($(this).val().replace(/\,/g, "")) <= 9999999999999.99)
						{
							obj.val($(this).val().replace(/\,/g, ""));
						}
					}
					obj.off("focus");
					obj.on("focus",focusMoney);
					if (newVal.search(reg) > -1 && Number(newVal.replace(/\,/g, "")) <= 9999999999999.99)
					{
						obj.val(newVal);
						return true;
					}
					return false;
				}
			},
			beforeSubmit:function(curform){
				var arr = [
					"assetName",
					"storeCount",
					"manufacturer",
					"specifications",
					"deviceCode",
					"price",
					"unit",
					"remark"
				];
				/*if (storeStyle === "0")
				{
					var SCount = $('[con_name="storeCount"]').val();
					if (Number(SCount) > 100)
					{
						layer.confirm('批量入库时，入库数量不能大于100', {
								btn: ['确定'],
								shade: 0.1
							});
						return false;
					}
				}*/
				for (var i = 0, l = arr.length; i < l; i++)
				{
					equListOndData[arr[i]] = $('[con_name="' + arr[i] + '"]').val() || "";
				}
				/**
				 * @see 获得radio的值
				 * @return String
				 */
				function getRadioVal(name){
					var value="";
					var radio=$('[name="'+ name +'"]');
					for(var i=0; i<radio.size(); i++){
						if(radio[i].checked === true){
							value=radio[i].value;
							break;
						}
					}
					return value;
				}
				equListOndData.assetCode = getRadioVal("assetCode");
				equListOndData.equipmentId = equipmentId;
				equListOndData.equipmentType = $('[con_name="equipmentId"]').val() || "";
				equListOndData.shelfPosi = $('[con_name="shelfId"]').val() || "";
				equListOndData.shelfId = shelfId;
				equListOndData.attachmentId = attachmentId;
				equListOndData.storeStyle = storeStyle;

				parent.layerViewData.equListOndData = equListOndData;
				console.log(equListOndData);
				layer_close();
			},
			callback:function(form){
				return false;
			}
		});
		//验证默认数量
		$('[con_name="storeCount"]').focus().blur();
		//取消
		$(".cancle").on("click",function()
		{
			parent.layerViewData.equListOndData = null;
			layer_close();
		});
	});
}(jQuery, window, document));
