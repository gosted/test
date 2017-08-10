/**
 * 本文件的功能是合作伙伴用户js文件
 *@ author 王步华
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
			listhtml="",
			zTreeObj = null,
			ut0 = "UT-0",
			sendData ={};

		/*
		 * 获取左侧list数据
		 * */
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/partner/find",
			data: {},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					treeArr =data.data;
					treeInit(treeArr);
				}
			}
		});

		function treeInit (data){
			listhtml = ""
			$.each(data, function (i, data) {
				listhtml+="<li class='text-c dictionaries' treeId='"+data.id+"' unitcode='"+data.partnerCode+"' unitname='"+data.partnerName+"'><a><span class='tree-txt'>"+data.partnerName+"</span></a></li>"
			});
			$("#tree").append(listhtml);
			//$("#tree").find(".tree-txt").eq(0).addClass("clr-blue");

			//initTable ({pageSize: pageSize,pageNo: pageNo});
			$("#tree").on("click", ".dictionaries", treeOnClick);
		}
		function treeOnClick(){
			var _this = $(this);
			_this.parents(".tree").find(".tree-txt").removeClass("clr-blue");
			_this.find(".tree-txt").addClass("clr-blue");
			$(".prName").val("");
			$(".prLabel").val("");
			initTable({pageSize: pageSize,pageNo: pageNo});
		}

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

				STr = $('<tr class="text-c" libId="'+ v.id+'"  username = '+v.userName +'></tr>');//一行
				STr.append('<td><input type="checkbox" name="chebox" username = '+v.userName +' roleName ='+v.roleName+'></td>');

				STr.append('<td class="user-name">' + v.userName + '</td>');
				STr.append('<td>' + v.userRealName + '</td>');

				STr.append('<td>' + userSex + '</td>');

				STr.append('<td class="text-l pl-3">' + v.unitName + '</td>');

				STr.append('<td>' + userState + '</td>');

				STr.append('<td>' + userlastime + '</td>');

				STr.append('<td class="btns text-r">' +
					'<a style="text-decoration:none" class="mr-5 op" href="javascript:;" title="编辑" _href="pro-partnerUser-edit.html">'+
					'<i class="Hui-iconfont">&#xe70c;</i></a>'+

					'<a style="text-decoration:none" class="mr-5 del" href="javascript:;" title="删除">'+
					'<i class="Hui-iconfont">&#xe6e2;</i></a>'+

					'<a style="text-decoration:none" class="mr-5 Administration" href="javascript:;" title="管理角色" _href="pro-partnerUser-ASingleEditor.html">'+
					'<i class="Hui-iconfont">&#xe61d;</i></a>'+

					'<a style="text-decoration:none" class="mr-5 ModifyPassword" href="javascript:;" title="重置密码" _href="pro-partnerUser-ModifyPassword.html">'+
					'<i class="Hui-iconfont">&#xe63f;</i></a>'+
					'</td>');

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



		/*
		 * 获取表格中数据
		 * */
		function initTable (obj)
		{
			var userNames = $(".prName").val(),
				userRealNames = $(".prLabel").val(),
				tree =	$(".tree .clr-blue").parents("li").attr("treeId");
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/user/findPageHzhbUser",
				data: {
					pageSize: obj.pageSize,
					pageNo: obj.pageNo,
					userName: userNames,
					userRealName: userRealNames,
					id:tree,
					userType: ut0
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
										userName:$(".prName").val(),
										userRealName:$(".prLabel").val(),
										userType:ut0,
										id:$(".tree .clr-blue").parents("li").attr("treeId")
									};

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "general/user/findPageHzhbUser",
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
		//编辑
		tbody.on("click", ".btns .op", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				libId = "";

			libId = $(this).parents("tr").attr("libId");
			data.libId = libId;
			window.layerViewData = data;
			window.layerShow(title,href);
		});
		//删除
		tbody.on("click", ".btns .del", function ()
		{
			var userId = "";
			userId = $(this).parents("tr").attr("libId");
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/user/findRoleByUserId",
				data: {id: userId},
				success: function (data)
				{
					if (data && data.success === 0)
					{
						if(data.data == null || data.data == ""){
							layer.confirm('确定要删除吗？', {
									btn: ['确定','取消'],
									shade: 0.1
								},
								function()
								{
									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "general/user/deleteByIds",
										data: {ids: userId},
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
						}else{
							layer.confirm('该用户已有角色，不能删除', {
								btn: ['确定','取消'],
								shade: 0.1
							});
						}
					}
				}
			});


		});
		//单条管理角色
		tbody.on("click", ".btns .Administration", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				userName = "",
				libId = "";
			userName = $(this).parents("tr").attr("userName");
			libId = $(this).parents("tr").attr("libId");
			data.libId = libId;
			data.userName=userName;
			window.layerViewData = data;
			window.layerShow(title,href);
		});


		//重置密码
		tbody.on("click", ".btns .ModifyPassword", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				userName = {},
				libId = "";
			userName =
				libId = $(this).parents("tr").attr("libId");
			data.libId = libId;
			window.layerViewData = data;
			window.layerShow(title,href);
			//layer_show("重置密码","system-user-ModifyPassword.html",900,250);

		});

		/*
		*点击用户名查看用户信息
		*/
		$(".tbody").on("click",".user-name",function(){
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
						window.layerShow("查看","pro-partnerUser-see.html");
					}
				}
			});
		});

		/*
		 * 列表上侧按钮区按钮点击事件
		 * */
		//添加
		$(".btn-add").on("click", function ()
		{
			var data = {},
				treeId = $(".tree .clr-blue").parents("li").attr("treeId");

			data.treeId = treeId;
			window.layerViewData = data;
			window.layerShow("添加","pro-partnerUser-add.html");
		});

		/*
		 * 按钮区查询事件
		*/
		//查询
		function findList()
		{
			var treeId = $(".tree .clr-blue").parents("li").attr("treeId"),
				userNames = $(".prName").val(),
				userRealNames = $(".prLabel").val();
			initTable({pageSize: pageSize,pageNo: pageNo,userName: userNames,userRealName:  userRealNames,id:treeId})

		}
		$(".btn-find").on("click", findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});

	});
}(jQuery, window, document));
