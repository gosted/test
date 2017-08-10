/**
 * 本文件的功能是数据字典js文件
 *@ author 王步华
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tbody = $(".tbody"),
			treeArr = [],
			diccode="",
			dicname="",
			dicId="",
			listhtml = "",
			xzid = $.cookie('xzid', xzid);

		/*
		 * 获取左侧list数据
		 * */
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/dictionary/findTree",
			data: {id : "0"},
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
				listhtml+="<li class='text-c dictionaries' id='"+data.id+"' pid='"+data.dictCode+"' diccode='"+data.dictCode+"' dicname='"+data.dictCodeName+"'><a><span class='tree-txt'>"+data.dictCodeName+"</span></a></li>"
			});
			$("#tree").append(listhtml);
			$("#tree").find(".tree-txt").eq(0).addClass("clr-blue");
			if(xzid != "null" && "undefined"){
				$("#"+xzid).find(".tree-txt").addClass("clr-blue");
			}else{
				$("#tree").find(".tree-txt").eq(0).addClass("clr-blue");
			}

			initTable ();
			$("#tree").on("click", ".dictionaries", treeOnClick);
			$.cookie('xzid', null);
		}
		function treeOnClick(){
			var _this = $(this);
			_this.parents(".tree").find(".tree-txt").removeClass("clr-blue");
			_this.find(".tree-txt").addClass("clr-blue");
			$(".dictCodeValue").val("");
			$(".dictCodeName").val("");
			initTable();
		}
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
			$.each(list, function (i, v)
			{
				var dictState="",
					statejz = v.dictState;
				if(statejz == "1"){
					dictState = "禁用";
				}else{
					dictState = "启用";
				}
				STr = $('<tr class="text-c" libId="'+ v.id+'" sysName="'+v.dictAllName+'" diccode="'+v.dictCode+'"  diccode="'+v.dictCode+'" dicname="'+v.dictCodeName+'"></tr>');//一行
				 /*STr.append('<td><input type="checkbox" name="chebox" dicname = '+v.dictCodeName +' roleName ='+v.roleName+'></td>');*/

				STr.append('<td>' + v.dictCode + '</td>');

				STr.append('<td class="sys-name text-l">' + v.dictAllName + '</td>');

				STr.append('<td>' + v.dictCodeValue + '</td>');

				STr.append('<td class="text-c pl-3">' + dictState + '</td>');

				STr.append('<td class="btns text-r">' +
					'<a style="text-decoration:none" class="mr-5 op" href="javascript:;" title="编辑" _href="system-data-edit.html">'+
					'<i class="Hui-iconfont">&#xe70c;</i></a>'+

					'<a style="text-decoration:none" class="mr-5 edit" href="javascript:;" title="查看" _href="system-data-see.html">'+
					'<i class="Hui-iconfont">&#xe695;</i></a>'+

					'<a style="text-decoration:none" class="mr-5 del" href="javascript:;" title="删除">'+
					'<i class="Hui-iconfont">&#xe6e2;</i></a>'+

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
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/dictionary/findDictionarys",
				data: {
					id:$(".tree .clr-blue").parents("li").attr("id")
				},
				success: function (data)
				{
					if (data && data.success === 0)
					{
						setTable(data);
					}
				}
			});
		}



		/*
		 * 右侧按钮区按钮点击事件
		 * */
		//编辑

		tbody.on("click", ".btns .op", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				dict = "",
				dictid = "",
				strData ="",
				libId = "";
			strData = $(this).parents("tr").attr("sysName");
			libId = $(this).parents("tr").attr("libId");
			diccode = $(this).parents("tr").attr("diccode");
			dicname = $(this).parents("tr").attr("dicname");
			dict = $(".tree .clr-blue").parents("li").attr("id");
			dictid = $(".tree .clr-blue").parents("li").attr("dicname");
			data.strData = strData;
			data.libId = libId;
			data.diccode = diccode;
			data.dicname = dicname;
			data.dict=dict;
			data.dictid = dictid;
			window.layerViewData = data;
			window.layerShow(title,href);
		});
		//查看
		tbody.on("click", ".btns .edit", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				dictid="",
				libId = "";

			libId = $(this).parents("tr").attr("libId");
			diccode = $(this).parents("tr").attr("diccode");
			dicname = $(this).parents("tr").attr("dicname");
			dicId = $(this).parents("tr").attr("id");
			dictid = $(".tree .clr-blue").parents("li").attr("dicname");
			data.libId = libId;
			data.diccode = diccode;
			data.dicname = dicname;
			data.dicId = dicId;
			data.dictid = dictid;
			window.layerViewData = data;
			window.layerShow(title,href);
		});
		//删除
		tbody.on("click", ".btns .del", function ()
		{
			var userId = "";
			userId = $(this).parents("tr").attr("libid");
			layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function()
				{
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "general/dictionary/deleteById",
						data: {id: userId},
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
					layer.msg('已取消', {icon:6,time:1000});
				});


		});


		/*
		 * 列表上侧按钮区按钮点击事件
		 * */
		//添加
		$(".btn-add").on("click", function ()
		{
			var data = {},
				treeId = $(".tree .clr-blue").parents("li").attr("id");
				diccode = $(".tree .clr-blue").parents("li").attr("diccode");
				dicname = $(".tree .clr-blue").parents("li").attr("dicname");
				dicId = $(".tree .clr-blue").parents("li").attr("id");
			data.treeId = treeId;
			data.diccode = diccode;
			data.dicname = dicname;
			data.dicId=dicId;
			window.layerViewData = data;
			window.layerShow("添加","system-data-add.html");
		});
		//添加一级菜单
		$(".btn-batchAdd").on("click", function ()
		{
			var data = {},
				treeId = $(".tree .clr-blue").parents("li").attr("treeId");

			data.treeId = treeId;
			window.layerViewData = data;
			window.layerShow("添加一级菜单","system-data-aNewPage.html");
		});
		//编辑一级菜单
		$(".btn-batchEdit").on("click", function ()
		{
			if($(".tree .tree-txt").hasClass("clr-blue")){
				var data = {},
					treeId = $(".tree .clr-blue").parents("li").attr("id");
				data.treeId = treeId;
				window.layerViewData = data;
				window.layerShow("编辑一级菜单","system-data-EditADictionary.html");
			}else{
				layer.confirm('请选择数据', {
					btn: ['确定'],
					shade: 0.1
				});
			}

		});

		//删除一级字典
		$(".btn-batchDel").on("click",function ()
		{
			if($(".tree .tree-txt").hasClass("clr-blue")){
				layer.confirm('确定要删除吗？', {
						btn: ['确定','取消'],
						shade: 0.1
					},
					function()
					{
						var userId = "";
						userId = $(".tree .clr-blue").parents("li").attr("id");
						$.myAjax({
							type: "POST",
							url: window.ajaxUrl + "general/dictionary/deleteDictionary",
							data: {id: userId},
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
						layer.msg('已取消', {icon:6,time:1000});
					});
			}else{
				layer.confirm('请选择数据', {
					btn: ['确定'],
					shade: 0.1
				});
			}
		});

		/*
		 * 按钮区查询事件
		*/
		//查询
		function findList()
		{
			var treeId = $(".tree .clr-blue").parents("li").attr("id");
			var dataNames = $(".dictCodeValue").val();
			var dataRealNames = $(".dictCodeName").val();
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "general/dictionary/findPageByQuery",
				data: {
					dictCodeValue:dataNames,
					dictCodeName:dataRealNames,
					id:treeId
				},
				success: function (data)
				{
					if (data && data.success === 0)
					{
						setTable(data);
						//initTable({dictCodeValue: $(".dictCodeValue").val(),dictCodeName:  $(".dictCodeName").val(),id:$(".tree .clr-blue").parents("li").attr("pid")})
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

	});
}(jQuery, window, document));
