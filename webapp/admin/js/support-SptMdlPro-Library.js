/*
* 制作方案页面-支撑方案库页面js文件
*@author 王步华
*/
(function($, w, d) {
    'use strict';
    $(function () {
        var reqId = parent.window.layerViewData.reqId;
    	window.layerViewData = parent.window.layerViewData;
    	var sendData = {};
		//兼容IE8下indexOf方式
		if (!Array.prototype.indexOf)
		{
			Array.prototype.indexOf = function(elt /*, from*/)
			{
				var len = this.length >>> 0;
				var from = Number(arguments[1]) || 0;
				from = (from < 0)
					? Math.ceil(from)
					: Math.floor(from);
				if (from < 0)
					from += len;
				for (; from < len; from++)
				{
					if (from in this &&
						this[from] === elt)
						return from;
				}
				return -1;
			};
		}

		var tbody = $(".dosptMdlPro_main_content_list"),
			pageSize = 10,
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
			$(".prName").val("");
			$(".prLabel").val("");
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
				tbody = $(".dosptMdlPro_main_content_list"),
				STr = null;

			list = data.data.result;
			tbody.html("");

			$.each(list, function (i, v)
			{
				var plantype = v.attachmentName,  //文件名称
					index = plantype .lastIndexOf(".");
				plantype  = plantype .substring(index + 1, plantype .length);
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



				STr = $('<tr class="text-c " libId="'+ v.id+'" ids ="' + v.attachmentId + '" attachmentName="'+v.attachmentName+'" pid="'+v.id +'" prName="' +v.prName+ '"  planProducts="' +v.planProducts+ '"></tr>');//一行
				STr.append('<td>'+i+++'</td>');

				STr.append('<td  class="doSptMdlPro-code text-c selectEvent" style="cursor: pointer;" title="' + v.planCode + '"><a class="text-primary" href="javascript:;">' + v.planCode + '</a></td>');
				STr.append('<td class="td-view doSptMdlPro-name text-l selectEvent" style="cursor: pointer;" title="' + v.prName + '"><a class="text-primary" href="javascript:;"> <img class="doSptMdlPro-name-img" src="' + planimg + '" />' + v.prName + '</a></td>');
				STr.append('<td  class="doSptMdlPro-word" planProducts="'+v.planProducts+'"  title="' + v.prLabel + '">' + v.prLabel + '</td>');
				STr.append('<td class="btns">' +
					"<a style='text-decoration:none' class='ml-5 selectEvent'' href='javascript:;' title='选取方案'>"+
					"<i class='Hui-iconfont'>&#xe6df;</i></a>"+

					"<a style='text-decoration:none' class='ml-5 download' href='javascript:;' title='下载'>"+
					"<i class='Hui-iconfont'>&#xe641;</i></a>"+
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
				url: window.ajaxUrl + "preSupport/planRepository/findPageForPlan",
				data: {pageSize: obj.pageSize,
					pageNo: obj.pageNo,
					prName: $(".prName").val(),
					prLabel: $(".prLabel").val(),
					prState:0,
					planClassify:$(".tree .clr-blue").parents("a").eq(0).attr("dictCodeValue")
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
										prName: $(".prName").val(),
										prLabel: $(".prLabel").val(),
										planClassify:$(".tree .clr-blue").parents("a").eq(0).attr("dictCodeValue"),
										id:$(".tree .clr-blue").parents("li").attr("treeId"),
										prState:0
									};

									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "preSupport/planRepository/findPageForPlan",
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
								'每页<i class="con_list_num">10</i>条'+
								'</span>'+
								'<i></i>'+
								'<ul class="clear">'+
								'<li class="con_num_5"><span>5</span></li>'+
								'<li class="con_num_10"><span>10</span></li>'+
								'<li class="con_num_15"><span>15</span></li>'+
								'<li class="con_num_20"><span>20</span></li>'+
								'<li class="con_num_25"><span>25</span></li>'+
								'<li class="con_num_30"><span>30</span></li>'+
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
		initTable ({pageSize: pageSize, pageNo: pageNo, id: 0});

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
					prName: $(".prName").val(),
					prLabel: $(".prLabel").val(),
					id:$(".tree .clr-blue").parents("li").attr("treeId")

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
		* * 按钮区查询事件
		* */
		function findList(){
			var libSearch = $(".Liquery");
			var data = getFormInfo(libSearch);
			initTable ({pageSize: pageSize, pageNo: pageNo, prName:data.prName, prLabel:data.prLabel,dictcodevalue:$(".tree .clr-blue").parents("a").eq(0).attr("dictCodeValue")});
		};
		$(".btn-success").on("click", findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
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

		tbody.on("click",".selectEvent",function(){
			$(this).addClass("Identification");
			var attachmentId = $(this).parents("tr").attr("ids");
			var attachmentName = $(this).parents("tr").attr("attachmentname");
			var prName = $(this).parents("tr").attr("prname");
			var planProducts = $(this).parents("tr").attr("planProducts");
			var pid = $(this).parents("tr").attr("pid");
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "preSupport/plan/selectRepository",
				data: {
					"attachmentId":attachmentId,
					"attachmentName":attachmentName
				},
				success: function (data) {

					if (data && data.success === 0)
					{
						window.layerViewData = {};
						window.layerViewData.fileName = data.data.fileName;
						window.layerViewData.id = data.data.id;
						window.layerViewData.pid = pid;
						window.layerViewData.prName = prName;
						window.layerViewData.planProducts = planProducts;
						window.layerViewData.reqId = reqId;
						window.layerShow( '选取方案','support-SptMdlPro-Library-edit.html');
					}
				}
			});
		});

		//附件下载
		tbody.on("click",".download",function()
		{
			var _this = $(this),
				DownLoadFile = function (options)
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
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "preSupport/attachment/checkIsLogin",
				data: {},
				dataType: "json",
				success: function(data)
				{
					if (data && data.success === 0)
					{
						DownLoadFile({
							"url": window.ajaxUrl + "preSupport/planRepository/findFileData",
							"method": "POST",
							"data": {"id": _this.parents("tr").attr("pid")}
						});
					}
				}
			});
		});
    });
}(jQuery, window, document));
