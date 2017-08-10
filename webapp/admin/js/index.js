/**
 * 本文件的功能是首页页js文件
 * @author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var menu = [],
			menuChildren = {},
			logoutBtn = $("#logout"),
			user = $("#user"),
			selfInfo = $("#selfInfo"),
			editPsw = $("#editPsw"),
			menuNews = $("#menuNews dt"),
			timer0 = "";

		user.html($.cookie("userRealName"));//显示用户
		/*设置系统消息*/
		window.setNews = function ()
		{
			var newsNum = $(".news-num"),
				ses = window.getRequestHeader();

			if (newsNum.size() > 0)
			{
				$.ajax({
					type: "POST",
					url: window.ajaxUrl + "general/sysmessage/findById",
					data: {},
					beforeSend: function(xhr)
					{
						xhr.setRequestHeader("authorization",ses);
						xhr.setRequestHeader("If-Modified-Since","0");
						xhr.setRequestHeader("Cache-Control","no-cache");
						this.url += "?timestamp="+ new Date().getTime();
					},
					success: function(data)
					{
						if (data && data.success === 0)
						{
							var num = data.data;
							if (num > 99)
							{
								newsNum.html("99+");
								newsNum.show();
							}
							else if (num <= 0)
							{
								newsNum.hide();
							}
							else
							{
								newsNum.html(num);
								newsNum.show();
							}
						}
					}
				});
			}
		};

		setNews();
		clearInterval(timer0);
		timer0 = setInterval(function ()
		{
			setNews();
		},60000);
		/*点击查看系统消息*/
		menuNews.on("click", function()
		{
			var news = $(this).parents("#menuNews").find("a");
			$(this).addClass("selected");
			if (document.createEvent)
			{
				var ev = document.createEvent("MouseEvents");
				ev.initEvent("click",true,false);
				news.get(0).dispatchEvent(ev);
			}
			else
			{
				news.click();
			}
		});
		/*权限菜单*/
		menu = [
			{"menuPreSupt": "前期支撑"},
			{"menuSupportCount": "支撑统计"},
			{"menuNewsManage": "业务门户维护"},
			{"menuProjectManage": "项目管理"},
			{"menuStorageManage": "库存管理"},
			{"menuAssetManage": "资产管理"},
			{"menuProviderManage": "合作伙伴"},
			{"menuSystem": "系统管理"},
			{"menuDataStatistics":"数据统计"},
			{"menuService": "售后服务"}
		];
		menuChildren = {
			"QQZC-FQ": "html/preSupport/support-launch.html",
			"QQZC-DB": "html/preSupport/support-do.html",
			"QQZC-WD": "html/preSupport/support-my.html",
			"QQZC-FAK": "html/preSupport/support-lib.html",
			"QQZC-TJ": "html/preSupport/support-count.html",
			"QQZC-DRAFT": "html/preSupport/my-draft.html",
			"ZCTJ-ZCL": "html/supportCount/count-support-num.html",
			"ZCTJ-CP": "html/supportCount/count-products.html",
			"ZCTJ_QS": "html/supportCount/count-trend-chart.html",
			"ZCTJ-JE": "html/supportCount/count-money-forecast.html",
			"ZCTJ-ZDXC": "html/supportCount/count-major-scene.html",
			"YWMH-XW": "html/news/news-count.html",
			"YWMH-TP": "html/news/news-picture.html",
			"XMGL-XMDY": "html/project/pro-project.html",
			"XMGL-WDXM": "html/project/pro-project-my.html",
			"XMGL-FQGD": "html/project/pro-launch.html",
			"XMGL-DBGD": "html/project/pro-preDeal.html",
			"XMGL-WDGD": "html/project/pro-myOrder.html",
			"XMGL-GDCX": "html/project/pro-orderCount.html",
			"KCGL-KFDY": "html/storage/strg-storage-room.html",
			"KCGL-WDKF": "html/storage/strg-room-my.html",
			"KCGL-SBDY": "html/storage/strg-storage-equipment.html",
			"KCGL-RK": "html/storage/strg-storage.html",
			"KCGL-CK": "html/storage/strg-storage-outstock.html",
			"KCGL-GDZCHT": "html/storage/strg-storage-contFA.html",
			"ZCGL-ZCGL": "html/assetManage/asseManagelList.html",
			"ZCGL-ZCCK": "html/assetManage/asset-check.html",
			"ZCGL-ZCDJ": "html/assetManage/asset-register.html",
			"HZHB-HZHBGL":"html/provider/pro-manage.html",
			"HZHB-HZHBYH":"html/provider/pro-partnerUser.html",
			"XXGL-RY": "html/system/system-user.html",
			"XXGL-JG": "html/system/system-organ.html",
			"XXGL-JS": "html/system/system-role.html",
			"XXGL-SJQX": "html/system/system-data-power.html",
			"XXGL-ZD": "html/system/system-data.html",
			"XXGL-PZ": "html/system/system-config.html",
			"XXGL-RZ": "html/system/system-log-manage.html",
			"XXGL-DQ": "html/system/system-region.html",
			"SHFW-GZGL": "html/cusService/cus-fault-list.html",
			"SHFW-WTGL": "html/cusService/cus-problem-list.html",
			"SHFW-TSGL": "html/cusService/cus-complaint-list.html",
			"SHFW-WDGZ": "html/cusService/cus-faultMy-list.html",
			"SHFW-WDWT": "html/cusService/cus-problemMy-list.html",
			"SHFW-WDTS": "html/cusService/cus-complaintMy-list.html",
			"SJTJ-XMGD":"html/statistics/statistics-projectWorksheet.html",
			"SJTJ-GDZC":"html/statistics/statistics-fixedAssets.html",
			"SJTJ-XMFB":"html/statistics/statistics-projectDistribution.html",
			"SJTJ-ZCFB":"html/statistics/statistics-assetDistribution.html",
			"SJTJ-DQJE":"html/statistics/statistics-ProjectAreaAmount.html",
			"SJTJ-XMZC":"html/statistics/statistics-projectAssets.html",
			"SJTJ-KCSL": "html/statistics/statistics-store-count.html",
			"SJTJ-KCJZ": "html/statistics/statistics-store-value.html"
		};

		/*
		 * 获取菜单
		 * */
		$.myAjax({
			type: "GET",
			url: window.ajaxUrl + "data/general/user/findAuthByUserId",
			success: function (data)
			{
				if (data && data.success === 0)
				{
					var myMenu = data.data,
						OUl = null;

					$.each(menu, function (i, v)
					{
						$.each(v, function(j, va)
						{
							if (myMenu && myMenu[va] && (myMenu[va].length > 0))//如果请求到的菜单在已有菜单里有
							{
								$('#'+j).show();
								OUl = $('#'+j).find("dd ul");
								for (var k = 0, len = myMenu[va].length; k < len; k++)
								{
									if (menuChildren[myMenu[va][k].authCode])
									{
										OUl.append('<li authCode="'+ myMenu[va][k].authCode +
											'" menuId="'+ myMenu[va][k].id +
											'" authSort="'+ myMenu[va][k].authSort +
											'"><a _href="'+ menuChildren[myMenu[va][k].authCode] +
											'" data-title="'+ myMenu[va][k].authName +
											'" href="javascript:void(0);">'+ myMenu[va][k].authName +
											'</a></li>');
									}
								}
							}
						});
					});
				}
				else if (data && data.success === 1)
				{
					layer.confirm(data.error, {
						btn: ['确定'],
						shade: 0.1
					});
				}
				else
				{

				}
			}
		});
		/*权限菜单结束*/
		/*
		 * logoutTip退出登录提示及处理方法
		 * */
		function logoutTip ()
		{
			layer.confirm('确定要退出登录吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function()
				{
					logout();
				},
				function()
				{
					layer.msg('已取消', {icon:5,time:1000});
				});
		}
		/*退出登录*/
		function logout ()
		{
			var data = {};
			window.location.href = "../index.html"+ window.times;
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/token/logout",//退出登录的接口
				data: data,
				success: function(msg)
				{
					//window.location.href = "../index.html"+ window.times;
				}
			});
		}

		logoutBtn.on("click",function ()
		{
			logoutTip();
		});

		/*修改个人信息*/
		selfInfo.on("click", function ()
		{
			layer_show("个人信息","html/self-info.html",900);
		});
		/*修改个人信息结束*/
		/*修改密码*/
		editPsw.on("click", function ()
		{
			layer_show("修改密码","html/edit-psw.html",900,250);
		});
		/*修改密码结束*/
	});
}(jQuery, window, document));
