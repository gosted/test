/**
 * 本文件是合同js文件
 * @ author 彭佳明
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			projectCode = "",
			projectName = "",
			tbody = $(".tbody");
		var search = $(".search-area");
		var projectId = window.parent.layerViewData.projectId;
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
				var contractId = v.id,
					view = $('<a href="javascript:;"></a>');

				STr = $('<tr class="text-c" contractType = "'+v.contractClassify+'" contractId="'+ contractId +'"></tr>');//一行
				STr.append($('<td style="cursor:pointer;" class="check"></td>').text(v.contractName||""));
				STr.append($('<td></td>').text(v.contractCode||""));
				var signTime = new Date(v.performTime);
				var contractEstimated = new Date(v.endTime);
				STr.append($('<td></td>').text(window.formatDate(signTime)||""));
				STr.append($('<td></td>').text(window.formatDate(contractEstimated)||""));
				STr.append($('<td></td>').text(v.contractIntro||""));
				if(v.contractClassify == "HTFL-HT"){
					v.contractClassify = "合同";
				}else if(v.contractClassify == "HTFL-XY"){
					v.contractClassify = "协议";
				}else if(v.contractClassify == "HTFL-GD"){
					v.contractClassify = "工单";
				}else{
					v.contractClassify = "合同";
				}
				STr.append($('<td></td>').text(v.contractClassify));
				var tmpBtn = '<td class="btns">';
				tmpBtn += '<a style="text-decoration:none;position:relative;top:1px;" class="ml-5 deal" type="'+v.contractClassify+'" href="javascript:;" title="编辑" _href="pro-project-edit.html">'+
					'<i class="Hui-iconfont">&#xe70c;</i></a>';
				tmpBtn += '<a style="text-decoration:none" class="ml-5 del c-warning" href="javascript:;" title="删除" _href="pro-project-check.html">'+
					'<i class="Hui-iconfont"></i></a>';
				tmpBtn+="</td>";
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
				url: window.ajaxUrl + "project/contract/findPPage",
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
										pageNo: obj.curr,
                                        projectId:projectId
									};
									var contractCode = search.find('[con_name="contractCode"]').val();
									var contractName = search.find('[con_name="contractName"]').val();
									contractCode ? sendData.contractCode = contractCode : false;
									contractName ? sendData.contractName = contractName : false;
									$.myAjax({
										type: "POST",
										url: window.ajaxUrl +  "project/contract/findPPage",
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
			pageNo: pageNo,
			projectId:projectId
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
				pageNo: pageNo,
				projectId:projectId
			};
			var contractCode = search.find('[con_name="contractCode"]').val();
			var contractName = search.find('[con_name="contractName"]').val();
			contractCode ? sendData.contractCode = contractCode : false;
			contractName ? sendData.contractName = contractName : false;
			renderingPage(sendData);
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

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				projectId:projectId
			};
			var contractCode = search.find('[con_name="contractCode"]').val();
			var contractName = search.find('[con_name="contractName"]').val();
			contractCode ? sendData.contractCode = contractCode : false;
			contractName ? sendData.contractName = contractName : false;
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

		//点名称进编辑页
		tbody.on("click", ".deal", function ()
		{
			var data = {}, id = $(this).parent().parent().attr("contractId");
			var type = $(this).parent().parent().attr("contractType");
			data.contractId = id;
			data.contractType = type;
			data.projectId = projectId;
			window.layerViewData = data;
			if(type == "HTFL-HT"){
				window.layerShow("合同编辑","pro-contract-edit.html");
			}else if(type == "HTFL-XY"){
				window.layerShow("协议编辑","pro-contract-editAgree.html");
			}else if(type == "HTFL-GD"){
				window.layerShow("工单编辑","pro-contract-editWork.html");
			}

		});
		tbody.on("click", ".check", function ()
		{
			var data = {}, id = $(this).parent().attr("contractId");
			var type = $(this).parent().attr("contractType");
			data.contractId = id;
			data.contractType = type;
			data.projectId = projectId;
			window.layerViewData = data;
			if(type == "HTFL-HT"){
				window.layerShow("合同查看","pro-contract-editCheck.html");
			}else if(type == "HTFL-XY"){
				window.layerShow("协议查看","pro-contract-editAgreeCheck.html");
			}else if(type == "HTFL-GD"){
				window.layerShow("工单查看","pro-contract-editWorkCheck.html");
			}
		});
		tbody.on("click",".del",function()
		{

			var _this = $(this);
			layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function ()
				{
					var contractId = _this.parent().parent("tr").attr("contractId");
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "project/contract/deleteByIds",
						data: {ids: contractId},
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
			var data = {};
			data.projectId = projectId;
			window.layerViewData = data;
			window.layerShow("添加","pro-contract-add.html");
		});

	});
}(jQuery, window, document));
