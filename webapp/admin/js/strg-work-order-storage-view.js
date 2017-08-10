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
				"quantity"
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

		//tab切换
		$.Huitab(".tabBar span",".tabCon","current","click",0);

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
				$(".equipment-details .no-data").show();
			}
			else
			{
				$(".equipment-details .no-data").hide();
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
				if (v.price)
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

		renderingPage({
			pageSize: pageSize,
			pageNo: pageNo,
			storelistId: storelistId
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
	});
}(jQuery, window, document));
