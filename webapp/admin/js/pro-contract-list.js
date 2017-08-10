/**
 * 本文件是项目合同js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			projectCode = "",
			projectName = "",
			tbody = $(".tbody");
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

				STr = $('<tr class="text-c" contractType = "'+v.contractClassify
					+'" contractId="'+ contractId
					+'" contractCode="'+ v.contractCode
					+'" contractName="'+ v.contractName
					+'"></tr>');//一行
				STr.append('<td><input type="checkbox" value="" name=""></td>');
				STr.append($('<td></td>').text(v.contractName=null?"":v.contractName));
				STr.append($('<td></td>').text(v.contractCode=null?"":v.contractCode));
				var signTime = new Date(v.performTime);
				var contractEstimated = new Date(v.endTime);
				STr.append($('<td></td>').text(window.formatDate(signTime)));
				STr.append($('<td></td>').text(window.formatDate(contractEstimated)));
				STr.append($('<td></td>').text(v.contractIntro=null?"":v.contractIntro));
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
				tmpBtn += '<a style="text-decoration:none" class="ml-5 sure" href="javascript:;" title="选择">'+
					'<i class="fa fa-check-square-o fa-lg" aria-hidden="true"></i></a>' +
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
										projectId:projectId,
										pageNo: obj.curr
									};

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
			projectId
			var contractCode = search.find('[con_name="contractCode"]').val();
			var contractName = search.find('[con_name="contractName"]').val();
			sendData = {
				pageSize: pageSize,
				pageNo: pageNo,
				projectId:projectId
			};
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
		tbody.on("click", ".btns .sure", function ()
		{
			var _this = $(this),
				contractId = $(this).parents("tr").attr("contractId"),
				contractCode = $(this).parents("tr").attr("contractCode"),
				contractName = $(this).parents("tr").attr("contractName"),
				parentBody = parent.window.document.body,
				relevant = null;
			relevant = $(parentBody).find('.relevant');
			relevant.val(contractCode).attr({
				"contractId": contractId,
				"spbasisName": contractName
			});
			layer_close();
		});
	});
}(jQuery, window, document));
