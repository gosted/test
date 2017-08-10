/**
 * 本文件的功能是支撑方案库页js文件
 *@ author 张欢
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
			sendData = {},
			zTreeObj = null;
		/*
		 * treeOnClick树形菜单点击回调函数
		 *
		 * */
		function treeOnClick()
		{
			var _this = $(this),
				id = _this.parents("a").eq(0).attr("dictCodeValue");
			_this.parents(".tree").find(".tree-txt").removeClass("clr-blue");
			_this.addClass("clr-blue");
			$("[con_name='prName']").val("");
			$("[con_name='prLabel']").val("");
			initTable ({pageSize: pageSize, pageNo: pageNo, dictCodeValue: id});
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
					else if (j === "dictCodeName")
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
							//url: window.ajaxUrl + "data/preSupport/tree",
							url: window.ajaxUrl + "general/dictionary/findChildList",
							type: "POST",
							data: {dictCode: "ZCFAFL", dictParentId : $(this).parents("li").attr("treeId")},
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
											else if (j === "dictCodeName")
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
		var　sendData　= {};
		//请求树形菜单数据
		$.myAjax({
//			type: "POST",
			url: window.ajaxUrl + "general/dictionary/findDictionary",
			type: "POST",
			data: {dictCode: "ZCFAFL"},
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
				var plantype = v.attachmentName.substr(v.attachmentName.indexOf(".")+1,v.attachmentName.length);
				var planimg;
				//判断文档类型
				function planpic(){
					if (plantype == "doc" || plantype == "docx") {
						planimg = "../../images/commen/doc.png";
					}
					else if (plantype == "ppt" || plantype == "pptx") {
						planimg = "../../images/commen/ppt.png";
					}
					else if (plantype == "xls" || plantype == "xlsx") {
						planimg = "../../images/commen/xlsx.png";
					}
					else if (plantype == "zip" || plantype == "rar") {
						planimg = "../../images/commen/zip.png";
					}
					else if (plantype == "txt") {
						planimg = "../../images/commen/txt.png";
					}
					else if (plantype == "avi" || plantype == "mp4" || plantype == "wma" || plantype == "rmvb" || plantype == "3GP" || plantype == "flash" || plantype == "rm" || plantype == "mid") {
						planimg = "../../images/commen/video.png";
					}
					else if (plantype == "pdf") {
						planimg = "../../images/commen/pdf.png";
					}
					else if (plantype == "mp3") {
						planimg = "../../images/commen/audio.png";
					}
					else if (plantype == "jpg" || plantype == "png") {
						planimg = "../../images/commen/png.png";
					}
					else {
						planimg = "../../images/commen/unknown.png";
					}
					return planimg;
				}

				planpic();

				STr = $('<tr class="text-c" libId="'+ v.id+'"></tr>');//一行
				STr.append('<td><input type="checkbox"></td>');

				STr.append('<td>' + v.planCode + '</td>');
				STr.append('<td class="td-view"><a class="text-primary" href="javascript:;">  <img class="doSptMdlPro-name-img" src="' + planimg + '" />' + v.prName + '</a></td>');
				STr.append('<td>' + v.prLabel + '</td>');
				//STr.append('<td class="td-status">'+ v.planClassify+'</td>');
//				'<a style="text-decoration:none" class="ml-5 op" href="javascript:;" title="查看支撑方案" _href="support-remark.html">'+
//				'<i class="Hui-iconfont">&#xe695;</i></a>'+


				STr.append('<td class="btns">' +
					'<a style="text-decoration:none" class="ml-5 op" href="javascript:;" title="修改支撑方案" _href="support-lib-edit.html">'+
					'<i class="Hui-iconfont">&#xe6df;</i></a>'+

					'<a style="text-decoration:none" class="ml-5 del" href="javascript:;" title="删除支撑方案">'+
					'<i class="Hui-iconfont">&#xe609;</i></a>'+
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
			var loading = "";
			loading = layer.msg('请稍后', {
				time: 0,
				icon: 16,
				shade: 0.1
			});
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "preSupport/planRepository/findPage",
				data: {
					pageSize: obj.pageSize,
					pageNo: obj.pageNo,
					//planClassify: obj.dictCodeValue,
					planClassify: $(".tree .clr-blue").parent("a").attr("dictCodeValue"),
					prLabel : $('input[con_name="prLabel"]').val(),
					prName : $('input[con_name="prName"]').val()
					//id:$(".tree .clr-blue").parents("li").attr("treeId")
				},
				success: function (data)
				{
					if (data && data.success === 0)
					{
						layer.close(loading);
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
										planClassify: $(".tree .clr-blue").parent("a").attr("dictCodeValue"),
										planCode: obj.planCode,
										prLabel : $('input[con_name="prLabel"]').val(),
										prName : $('input[con_name="prName"]').val()
										//id:$(".tree .clr-blue").parents("li").attr("treeId")

									};
									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "preSupport/planRepository/findPage",
										//url:  "http://localhost/data/system/countList.json",
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
			pageNo: pageNo
		};
		initTable (sendData);
		//initTable ({pageSize: pageSize, pageNo: pageNo, id: 0});

		/*每页显示多少条*/
		$(".pagination").on("click", ".con_much>i", function()
		{
			var _this = $(this),
				_ul = _this.parents(".con_much").children("ul"),
				_num = _this.parents(".con_much").find(".con_list_num");

			_ul.css({"display": "block"});
			_ul.find("span").on("click",function()
			{
				pageSize = $(this).html();
				_num.html(pageSize);
				_ul.css({"display": "none"});
				sendData = {
					pageSize: pageSize,
					pageNo: pageNo,
					prLabel : $('input[con_name="prLabel"]').val(),
					prName : $('input[con_name="prName"]').val(),
					planClassify: $(".tree .clr-blue").parent("a").attr("dictCodeValue"),

				};
				initTable (sendData);
			});
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



		/*
		 * 按钮区按钮点击事件
		 * */
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
		tbody.on("click", ".btns .del", function ()
		{
			var libId = "";

			libId = $(this).parents("tr").attr("libId");
			layer.confirm('确定要删除吗？', {
					btn: ['确定','取消'],
					shade: 0.1
				},
				function()
				{
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "preSupport/planRepository/deleteFileById",
						data: {id: libId},
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
		});

		/*
		 * 点需求单名进入查看详情页
		 * */
		tbody.on("click", ".td-view", function ()
		{
			var DownLoadFile = function (options)
			{
				var config = $.extend(true, { method: 'post' }, options);
				var $iframe = $('<iframe id="down-file-iframe" />');
				var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
				$form.attr('action', config.url);
				for (var key in config.data) {
					$form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
				}
				$iframe.append($form);
				$(document.body).append($iframe);
				$form[0].submit();
				$iframe.remove();
			};

			DownLoadFile({
				"url": window.ajaxUrl + "preSupport/planRepository/findFileData",
				"method": "post",
				"data": {"id": $(this).parents("tr").attr("libId")}
			})
		});

		/*
		 * 按钮区按钮点击事件
		 * */
		$(".btn-add").on("click", function ()
		{
			var data = {},
				treeId = $(".tree .clr-blue").parents("li").attr("treeId");

			data.treeId = treeId;
			window.layerViewData = data;
			window.layerShow("添加支撑方案","support-lib-add.html");
		});

		/*
		 * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
		 * */
		function getFormInfo (box)
		{
			var conNames = box.find('[con_name]'),
				key = "",
				keyVal = "",
				sendData = {},
				checkboxs = null;

			for (var i= 0, len=conNames.size(); i<len; i++)
			{
				key = conNames.eq(i).attr("con_name");
				if (conNames.eq(i).attr("type") === "radio")
				{
					keyVal = conNames.eq(i).parents(".radio-box").find(".checked input").val();
				}
				else if (conNames.eq(i).attr("type") === "checkbox")
				{
					checkboxs = conNames.eq(i).parents(".check-box").find(".check");
					keyVal = "";
					$.each(checkboxs, function (i, v)
					{
						if ($(v)[0].checked === true)
						{
							keyVal += "," + $(v).val();
						}
					});
					keyVal = keyVal.substr(1);
				}
				else
				{
					keyVal = conNames.eq(i).val();
				}
				sendData[key] = keyVal;
			}
			return sendData;
		}
		/*
		 * 按钮区查询事件
		 * */
		function findList()
		{
			var libSearch = $(".lib-search");
			var data = getFormInfo(libSearch);
			initTable ({pageSize: pageSize, pageNo: pageNo, prName:data.prName, prLabel:data.prLabel});
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
