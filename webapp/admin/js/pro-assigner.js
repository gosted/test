/**
 * 本文件的指定人员列表页js文件
 *@author 鲍哲
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tbody = $(".tbody"),
			pageSize = 20,
			pageNo = 1,
			first = true,
			treeArr = [],
			setting = {},
			zTreeObj = null;
		/*
		 * treeOnClick树形菜单点击回调函数
		 *
		 * */
		function treeOnClick()
		{
			var _this = $(this),
				id = _this.parents("a").eq(0).attr("dictCodeValue");
			var treeId = $(".tree .clr-blue").parents("li").attr("treeId");
			_this.parents(".tree").find(".tree-txt").removeClass("clr-blue");
			_this.addClass("clr-blue");
			initTable ({pageSize: pageSize, pageNo: pageNo, dictCodeValue: id });
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
					if (j === "children")
					{

					}
					else if (j === "unitName")
					{
						OA.find(".tree-txt").html(va);
					}
					else if (j === "id")
					{
						OLi.attr("treeId", va);
					}
					else
					{
						OA.attr(j, va);
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
				$(".prName").val("");
				$(".prLabel").val("");
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
							url: window.ajaxUrl + "general/unit/findTreeForUser",
							type: "POST",
							data: {id : $(this).parents("li").attr("treeId")},
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
											if (j === "children")
											{

											}
											else if (j === "unitName")
											{
												OA.find(".tree-txt").html(va);
											}
											else if (j === "id")
											{
												OLi.attr("treeId", va);
											}
											else
											{
												OA.attr(j, va);
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
		}
		var sendData ={};
		//请求树形菜单数据
		$.myAjax({
//			type: "POST",
			url: window.ajaxUrl + "general/unit/findTreeForUser",
			type: "POST",
			data: {id : "0"},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					treeArr =data.data;
					treeInit({
						ele: "#tree",
						data: treeArr
					});
				}
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
			$.each(list, function (i, v)
			{
				var userlastime = window.formatDateTimesec(v.userLastLoginTime),
					userSex = "",
					userState="";
					var sexnu = v.userSex;
					var statejz = v.userState;
				if(sexnu == 1){
					userSex = "女";
				}else if(sexnu == 0){
					userSex = "男";
				}else{
					userSex = "--";
				}
				if(statejz == "1"){
					userState = "禁用";
				}else{
					userState = "启用";
				}

				STr = $('<tr class="text-c" libId="'+ v.id+'" userRealName = '+v.userRealName +' username = '+v.userName +'></tr>');//一行
				STr.append('<td><input type="checkbox" name="chebox" username = '+v.userName +' roleName ='+v.roleName+'></td>');

				STr.append('<td class="user-name">' + v.userName + '</td>');
				STr.append('<td>' + v.userRealName + '</td>');

				STr.append('<td>' + userSex + '</td>');

				STr.append('<td class="text-l pl-3">' + v.unitName + '</td>');

				STr.append('<td class="state">' + userState + '</td>');

				STr.append('<td>' + userlastime + '</td>');

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



		/*
		 * 获取表格中数据
		 * */
		function initTable (obj)
		{
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/user/findPageUser",
				data: {
					pageSize: obj.pageSize,
					pageNo: obj.pageNo,
					userName: $(".prName").val(),
					userRealName:  $(".prLabel").val(),
					id:$(".tree .clr-blue").parents("li").attr("treeId")
				},
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
							first: false,
							last: false,
							skip: true, //是否开启跳页
							jump: function(obj, first){ //触发分页后的回调
								if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
									var sendData = {
										pageSize: pageSize,
										pageNo: obj.curr,
										userName: $(".prName").val(),
										userRealName:  $(".prLabel").val(),
										id:$(".tree .clr-blue").parents("li").attr("treeId")
									};

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "general/user/findPageUser",
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
							$('.pagination').append("<div class='con_altogether'><span>总共<span class='allpage'>"+data.data.pageCount+"</span>页</span></div>");	
						}
						$(".allpage").html(data.data.pageCount);
						//分页结束
					}
				}
			});
		}
		sendData = {
			pageSize: pageSize,
			pageNo: pageNo,
		};
		initTable (sendData);

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
				userName: $(".prName").val(),
				userRealName:  $(".prLabel").val(),
				id:$(".tree .clr-blue").parents("li").attr("treeId")
			};
			initTable (sendData);
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
		//选择每页显示多少条事件


		//initTable ({pageSize: pageSize, pageNo: pageNo, id: 0});

		/*
		 * 右侧按钮区按钮点击事件
		 * */


		/*
		*点击用户名查看用户信息
		*/
	/*	$(".tbody").on("click",".user-name",function(){
			var libId = "",
				data = {};
				libId = $(this).parents("tr").attr("libId");
			data.libId = libId;
			window.layerViewData = data;
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/user/findUserById",
				data: {id: $(this).parents("tr").attr("libId")},
				success: function (data)
				{
					if (data && data.success === 0)
					{
						window.layerShow("查看","system-user-see.html");
					}
				}
			});
		});*/


		/*
		 * 按钮区查询事件
		*/
		//查询
		function findList()
		{
			var treeId = $(".tree .clr-blue").parents("li").attr("treeId");
			var userNames = $(".prName").val();
			var userRealNames = $(".prLabel").val();
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/user/findPageUser",
				data: {
					pageSize: pageSize,
					pageNo: pageNo,
					userName:userNames,
					userRealName:userRealNames,
					id:treeId
				},
				success: function (data)
				{
					if (data && data.success === 0)
					{
						//setTable(data);
						initTable({pageSize: pageSize,pageNo: pageNo,userName: $(".prName").val(),userRealName:  $(".prLabel").val(),id:$(".tree .clr-blue").parents("li").attr("treeId")})
					}
				}
			});
		}
		$(".btn-find").on("click", findList);
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
				username = $(this).parents("tr").attr("username"),
				userRealName = $(this).parents("tr").attr("userRealName"),
				parentBody = parent.window.document.body,
				assigner = null,
				state = _this.parents("tr").find(".state").text();
			if(state == "启用")
			{
				assigner = $(parentBody).find('.assigner');
				assigner.val(userRealName);
				assigner.attr("username",username)
				if(assigner.val().length > 0)
				{
					assigner.removeClass("Validform_error");
					assigner.parents("td").find(".msg-tip").find("span").removeClass("Validform_wrong").addClass("Validform_right")
				}
				layer_close();
			}
			else
			{
				layer.msg("该角色已被禁用，请重新选择")
			}


		});

	});
}(jQuery, window, document));
