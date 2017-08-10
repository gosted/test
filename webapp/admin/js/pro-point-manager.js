/**
 * 本文件是指定项目经理页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var projectId = window.parent.layerViewData.projectId,
			selected = false,
			tbody = $(".tbody");

		/*
		 * 渲染表格方法传入请求到的数据
		 * */
		function setTable (data)
		{
			var list = [],
				tbody = $(".tbody"),
				STr = null;

			list = data.data;
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
				var userId = v.id;

				STr = $('<tr class="text-c" userId="'+ userId +'"></tr>');//一行
				STr.append('<td><input type="checkbox" value="" name=""></td>');

				STr.append($('<td></td>').text(v.userRealName || ""));
				STr.append($('<td></td>').text(v.userName  || ""));
				STr.append($('<td class="text-l"></td>').text(v.unitName || ""));
				var tmpBtn = '<td class="btns">';

				tmpBtn += '<a style="text-decoration:none" class="ml-5 delete" href="javascript:;" title="删除">'+
					'<i class="Hui-iconfont">&#xe6e2;</i></a>' +
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
				url: window.ajaxUrl + "project/project/findPM",
				data: sendData,
				success: function (data) {
					if (data && data.success === 0) {
						setTable(data);
					}
				}
			});
		}
		renderingPage({
			projectId: projectId
		});

		/*输入用户名边输入边查找*/
		$(".list-box input").on("input propertychange",function ()
		{
			var _this = $(this),
				listBox =_this.parents(".list-box");

			function tipSelect(e)
			{
				var evnt = e || window.event,
					tar = $(evnt.target),
					ind = "";

				if (!selected && tar.parents(".list-box").size() === 0
					&& tar.parents(".layui-layer-setwin").size() === 0
					&& tar.parents(".layui-layer-btn").size() === 0)
				{
					ind = layer.confirm('请点击选择姓名', {
							btn: ['确定', '取消'],
							shade: 0.1
						},
						function ()
						{
							layer.close(ind);
						},
						function ()
						{
							layer.msg('已取消', {icon:5,time:1000});
							$(".list-box").children(".list").hide();
							selected = true;
							_this.val("");
							_this.blur();
						});
				}
			}

			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/user/findVaguely",
				data: {userRealName: _this.val()},
				dataType: "json",
				success: function(data)
				{
					if (data && data.success === 0)
					{
						listBox.children(".list").html("");
						_this.removeAttr("user_id");
						if (data.data && data.data[0])
						{
							listBox.children(".list").show();
							selected = false;
							for (var i=0, len=data.data.length; i<len; i++)
							{
								listBox.children(".list").append('<li user_id="'+ data.data[i].id +'">'+
									data.data[i].userRealName
									+ '(' + data.data[i].userName + ')' +'</li>');
							}
							listBox.children(".list").on("click", "li", function ()
							{
								_this.val($(this).html());
								_this.attr("user_id", $(this).attr("user_id"));
								listBox.children(".list").hide();
								_this.blur();
								selected = true;
							});

							$("body").on("click", tipSelect);
						}
					}
				}
			});
		});

		//点击添加按钮
		$(".add-btn").on("click", function()
		{
			var userId = $(".list-box input").attr("user_id"),
				sendData = {};
			sendData.projectId = projectId;
			sendData.userId = userId;
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "project/project/createPM",
				data: sendData,
				success: function (data) {
					if (data && data.success === 0) {
						window.location.reload();
					}
				}
			});
		});
		/*
		 * 列表内按钮区按钮点击事件
		 * */

		tbody.on("click", ".btns .delete", function ()
		{
			var _this = $(this);
			layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function ()
				{
					var userId = "";

					userId = _this.parents("tr").attr("userId");

					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "project/project/deletePM",
						data: {
							ids: userId,
							projectId: projectId
						},
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

	});
}(jQuery, window, document));
