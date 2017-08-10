/**
 * 本文件是合同js文件
 * @author 彭佳明
 */

(function($, w, d){
	'use strict';

	$(function() {
		function AssetCheck(options){
			this.setData = {
				pageNo:1,
				pageSize:20
			};
			this.list = [];
			this.STr = null;

		}
		AssetCheck.prototype = {
			constructor:AssetCheck,
			init:function()
			{
				this.getData(this.setData);
				this.search();
				this.pagenation();
				this.editStatus();
			},
			getData:function(data)
			{
				var that = this;
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "project/assetRegistration/findPageAssetRegistration",
					data: data,
					success: function (data) {
						if (data && data.success === 0) {
							that.setdata(data);
							//分页
							laypage({
								cont: $('#pagination'),
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
											pageSize:that.setData.pageSize ,
											pageNo: obj.curr
										};
										var search = $(".search-area");
										var assetCode = search.find('[con_name="assetCode"]').val();
										var assetName = search.find('[con_name="assetName"]').val();
										assetCode ? sendData.assetCode = assetCode : false;
										assetName ? sendData.assetName = assetName : false;
										$.myAjax({
											type: "POST",
											url: window.ajaxUrl + "/project/assetRegistration/findPageAssetRegistration",
											data: sendData,
											success: function (data)
											{
												if (data && data.success === 0)
												{
													that.setdata(data);
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

						}
					}
				});
			},
			setdata:function(data)
			{
				var tbody = $(".tbody");
				this.list = data.data.result;
				tbody.html("");
				if (this.list.length === 0)
				{
					$(".no-data").show();
				}
				else
				{
					$(".no-data").hide();
				}

				$.each(this.list, function (i, v)
				{
					var contractId = v.id,
						view = $('<a href="javascript:;"></a>');

					this.STr = $('<tr class="text-c" Id="'+v.id+'" attachId = "'+v.relatedAttachId+'" equId = "'+v.equipmentId+'"></tr>');
					this.STr.append('<td><input type="checkbox" value="" name=""></td>');
					this.STr.append($('<td class="assetName"></td>').text(v.assetName==null?"":v.assetName));
					this.STr.append($('<td class="specifications"></td>').text(v.specifications==null?"":v.specifications));
					this.STr.append($('<td class="assetCo"></td>').text(v.assetCode==null?"":v.assetCode));
					this.STr.append($('<td class="companyCode"></td>').text(v.companyCode==null?"":v.companyCode));
					this.STr.append($('<td class="equipmentName"></td>').text(v.equipmentName==null?"":v.equipmentName));
					this.STr.append($('<td class="assetStatus"></td>').text(v.assetStatus==null?"":v.assetStatus));
					this.STr.append($('<td></td>').text(v.unit==null?"":v.unit));
					var tmpBtn = '<td class="btns">';
					tmpBtn += '<a style="text-decoration:none" class="ml-5 editStatus" href="javascript:;" title="资产属性变更" _href="asset-register-attrStatusChange.html">'+
						'<i class="Hui-iconfont">&#xe70c;</i></a>';
					tmpBtn += '<a style="text-decoration:none" class="ml-5 editStatus" href="javascript:;" title="资产状态变更" _href="asset-register-editStatus.html">'+
						'<i class="Hui-iconfont">&#xe60c;</i></a>';
					tmpBtn += '<a style="text-decoration:none" class="ml-5 editStatus" href="javascript:;" title="资产生命周期查看" _href="asset-check-lifeCycle.html">'+
						'<i class="fa fa-eye" aria-hidden="true"></i></a>';
					tmpBtn+="</td>";
					this.STr.append(tmpBtn);
					tbody.append(this.STr);
					/*
					 * tr颜色间隔问题
					 * */
					if(i%2 == 0){
						this.STr.css("background","#fff");
					}else{
						this.STr.css("background","#eee");
					}
				});
				this.BtnAdd();

			},
			del:function()
			{

			},
			search:function()
			{
				var that = this;
				function findList()
				{
					var search = $(".search-area"),
						sendData = {};
					var assetCode = search.find('[con_name="assetCode"]').val();
					var assetName = search.find('[con_name="assetName"]').val();
					sendData = {
						pageSize: that.setData.pageSize,
						pageNo: that.setData.pageNo,
					};
					assetCode ? sendData.assetCode = assetCode : false;
					assetName ? sendData.assetName = assetName : false;
					that.getData(sendData);
				}
				$(".find-btn").off().on("click", findList);
				$(document).keyup(function(evn){
					var e = evn || window.event;
					if (e.keyCode == 13)
					{
						findList();
					}
				});
			},
			BtnAdd:function()
			{
				$(".btn-add").on("click",function ()
				{
					window.layerShow("新建资产","asset-register.html");
				});
			},
			editStatus:function()
			{
				$(".tbody").on("click",".editStatus",function ()
				{
					var This_href = $(this).attr("_href"),
					This_title = $(this).attr("title"),
					Id = $(this).parent().parent().attr("Id"),
					attachId = $(this).parent().parent().attr("attachId"),
					equId = $(this).parent().parent().attr("equId"),
					contractId = $(this).parent().parent().attr("contractId"),
					equipmentName =$(this).parent().parent().find(".equipmentName").text(),
					assetStatus =$(this).parent().parent().find(".assetStatus").text(),
					assetCo =$(this).parent().parent().find(".assetCo").text();
					var data = {};
					data.Id = Id;
					data.attachId = attachId;
					data.equId = equId;
					data.equipmentName = equipmentName;
					data.assetStatus = assetStatus;
					data.assetCo = assetCo;
					window.layerViewData = data;
					window.layerShow(This_title,This_href);
				});
			},
			pagenation:function()
			{
				var that = this;
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
					_num.html($(this).html());
					_ul.css({"display": "none"});
					that.setData.pageSize = $(this).html();
					sendData = {
						pageSize: $(this).html(),
						pageNo: that.setData.pageNo,
					};
					var search = $(".search-area");
					var assetCode = search.find('[con_name="assetCode"]').val();
					var assetName = search.find('[con_name="assetName"]').val();
					assetCode ? sendData.assetCode = assetCode : false;
					assetName ? sendData.assetName = assetName : false;
					that.getData(sendData);
				});
				$(document).on("click", function(e)
				{
					var evn = e || window.event;
					if ($(evn.target).parents(".con_much").size() === 0)
					{
						$(".con_much ul").hide();
					}
				});
			}
		};
		var assetCheeck = new AssetCheck();
		assetCheeck.init();
	});
}(jQuery, window, document));
