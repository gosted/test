/**
 * 本文件是公用js文件
 * @author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		window.ajaxUrl = "/test/";
		window.times = "?timestamp="+ new Date().getTime();


		/*获取向请求头设置的数据*/
		window.getRequestHeader = function  ()
		{
			var sIdFlag = $.cookie("encodeToken") && $.cookie("encodeToken") != "null",
				usrIdFlag = $.cookie("userId") && $.cookie("userId") != "null",
				ses = "";

			if (sIdFlag)
			{
				ses += $.cookie("encodeToken");
				if (usrIdFlag)
				{
					ses += "_" + $.cookie("userId");
				}
			}
			return ses;
		};

		/*
		 * 获取页面数据的方法
		 * 传入地址和向后台传送的数据
		 * 返回接收到的数据
		 * */
		$.extend({
			"myAjax": function (obj)
			{
				var ses = window.getRequestHeader(),
					loading = "";
				$.ajax({
					type: obj.type || "POST",
					url: obj.url,
					dataType: obj.dataType || "json",
					data: obj.data || {},
					beforeSend: function(xhr)
					{
						xhr.setRequestHeader("authorization",ses);
						xhr.setRequestHeader("If-Modified-Since","0");
						xhr.setRequestHeader("Cache-Control","no-cache");
						if (this.url.indexOf('?') > -1)
						{
							this.url += "&timestamp="+ new Date().getTime();
						}
						else
						{
							this.url += "?timestamp="+ new Date().getTime();
						}

						loading = layer.msg('请稍后', {
							time: 0,
							icon: 16,
							shade: 0.1
						});
					},
					success: function(msg)
					{
						layer.close(loading);
						if (obj.success)
						{
							obj.success(msg);
						}
					},
					error: function(err)
					{
						layer.close(loading);
						if (obj.error)
						{
							obj.error(err);
						}
					}
				});
			}
		});



		/*
		* loginTimeOut登录超时退出提示及处理方法
		* */
		function loginTimeOut ()
		{
			top.window.layer.confirm('登录超时，请重新登录', {
					btn: ['确定'],
					shade: 0.1
				},
				function()
				{
					top.location.replace(ajaxUrl + "index.html");
				},
				function()
				{
					top.location.replace(ajaxUrl + "index.html");
				});
			$('.layui-anim').removeClass("layui-anim");
		}
		/*
		* 过期重登方法
		* */
		$(document).ajaxComplete(function(event, xhr, settings)
		{
			var url = settings.url,
				str = "general/sysmessage/findById";

			if (url.indexOf(str) > 0)
			{
				return false;
			}
			if (xhr.status === 404)
			{
				layer.confirm('您访问的地址不存在！<"'+ settings.url +'">', {
					btn: ['确定'],
					shade: 0.1
				});
				return false;
			}

			var responseText = xhr.responseText,
				resData = $.parseJSON(responseText);

		if (resData && resData.success === -4)//登录过期了
			{
				loginTimeOut();
			}
			else if (resData && resData.success === -2)
			{
				loginTimeOut();
			}
			else if (resData && resData.success === 0)
			{
			}
			else
			{
				layer.confirm(resData.error, {
					btn: ['确定'],
					shade: 0.1
				});
			}
		});


		/*弹出层*/
		/*
		 参数解释：
		 title	标题
		 url		请求的url
		 id		需要操作的数据id
		 w		弹出层宽度（缺省调默认值）
		 h		弹出层高度（缺省调默认值）
		 返回当前弹出层的索引
		 */
		window.layerShow = function (title,url,w,h,r){
			var ind = "";
			if (title == null || title == '')
			{
				title=false;
			}
			if (url == null || url == '')
			{
				url=ajaxUrl + "admin/not-find.html";
			}
			if (w == null || w == '')
			{
				w=800;
			}
			if (h == null || h == '')
			{
				h=($(window).height() - 50);
			}
			if (r === true)
			{
				ind = layer.open({
					type: 2,
					area: [w+'px', h +'px'],
					fix: false, //不固定
					maxmin: true,
					shade:0.4,
					title: title,
					content: url,
					end: function ()
					{
						location.reload();
					}
				});
			}
			else
			{
				ind = layer.open({
					type: 2,
					area: [w+'px', h +'px'],
					fix: false, //不固定
					maxmin: true,
					shade:0.4,
					title: title,
					content: url
				});
			}

			layer.full(ind);
			return ind;
		};

		/*
		 * 格式化日期方法，传入日期对象
		 * */
		window.formatDate = function (date)
		{
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;

			return y + '-' + m + '-' + d;
		};
		/*
		 * 格式化日期时间方法，传入日期对象
		 * */
		window.formatDateTime = function (date) {
			var y = date.getFullYear();
			var m = date.getMonth() + 1;
			m = m < 10 ? ('0' + m) : m;
			var d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			var h = date.getHours();
			var minute = date.getMinutes();
			minute = minute < 10 ? ('0' + minute) : minute;
			return y + '-' + m + '-' + d+' '+h+':'+minute;
		};
		/*
		 * 格式化日期方法，传入时间
		 * */
		window.formatDates = function (dates)
		{
			if (dates)
			{
				var date = new Date(dates);
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				var d = date.getDate();
				d = d < 10 ? ('0' + d) : d;

				return y + '-' + m + '-' + d;
			}
			else
			{
				return "";
			}
		};
		/*
		 * 格式化日期时间方法，传入时间
		 * */
		window.formatDateTimes = function (dates) {
			if (dates)
			{
				var date = new Date(dates);
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				var d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				var h = date.getHours();
				var minute = date.getMinutes();
				minute = minute < 10 ? ('0' + minute) : minute;
				return y + '-' + m + '-' + d+' '+h+':'+minute;
			}
			else
			{
				return "";
			}
		};
		window.formatDateTimesec = function (dates) {
			if (dates)
			{
				var date = new Date(dates);
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? ('0' + m) : m;
				var d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				var h = date.getHours();
				h = h < 10 ? ("0" + h) : h;
				var minute = date.getMinutes();
				minute = minute < 10 ? ('0' + minute) : minute;
				var ss = date.getTime()%60000;
				ss = (ss - (ss % 1000)) / 1000;
				ss = ss < 10 ? ("0" + ss) : ss;
				return y + '-' + m + '-' + d+' '+h+':'+minute+":"+ss;
			}
			else
			{
				return "";
			}
		};

		//生成40个td contain位table元素
		window.getTd = function(contain)
		{
			var content="";
			for(var i=0;i<40;i++)
			{
				content +="<td style='width:2.5%'></td>"
			}
			var tr6 = $("<tr class='tr6'></tr>");
			tr6.append(content);

			contain.append(tr6);
		};

		/*地区树和机构树*/
		window.setTree = function (obj)
		{
			/*
			 * treeOnClick树形菜单点击回调函数
			 *
			 * */
			var ele = obj.ele || ".input-tree";
			function treeOnClick()
			{
				var _this = $(this),
					inpt = _this.parents(".input-tree").eq(0).children(".input-text"),
					tree = _this.parents(".tree").eq(0),
					treeTxt = _this.parents("li").children("a").children(".tree-txt"),
					txtArr = [],
					id = _this.parents("li").eq(0).attr("treeId");

				_this.parents(".tree").eq(0).find(".tree-txt").removeClass("clr-blue");
				_this.addClass("clr-blue");
				$.each(treeTxt, function (i, v)
				{
					txtArr.push($(v).text());
				});
				txtArr = txtArr.reverse();
				inpt.val(txtArr.join("/"));
				tree.hide();
				_this.parents(".input-tree").eq(0).attr("open_list", "false");
				inpt.blur();
			}
			/*
			 * treeInit初始化树形菜单方法
			 *
			 * */
			function treeInit(obj)
			{
				var tree = $(obj.ele).find(".tree"),
					data = obj.data;
				console.log(data);
				tree.html("");
				if (obj.all)
				{
					var OLi = $('<li></li>'),
						OA = $('<a href="javascript:;"></a>'),
						allId = "";
					OLi.append('<span class="tree-sw"></span>');
					if (obj.showIcon === true)
					{
						OA.append('<span class="tree-icon"></span>');
					}
					OA.append('<span class="tree-txt all"></span>');
					OA.find(".tree-txt").html(obj.all);
					OLi.attr("treeId", obj.initSendData[obj.id]);
					$.each(data, function (i, v){
						$.each(v, function (j,va)
						{
							if (j === obj.id)
							{
								allId += "," + va;
							}
						});
					});
					allId = allId.substr(1);
					OLi.attr("allId", allId);
					OLi.append(OA);
					tree.append(OLi);
				}
				else
				{
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
							if (j === obj.value)
							{
								OA.find(".tree-txt").html(va);
							}
							else if (j === obj.id)
							{
								OLi.attr("treeId", va);
							}
							else if ($.inArray(j, obj.attr) > -1)
							{
								OLi.attr(j, va);
							}
							else
							{
								//OA.attr(j, va);
							}
						});
						OLi.append(OA);
						tree.append(OLi);
					});
				}
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
								url: obj.url,
								type: obj.type || "POST",
								data: {id: $(this).parents("li").attr("treeId")},
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
												if (j === obj.value)
												{
													OA.find(".tree-txt").html(va);
												}
												else if (j === obj.id)
												{
													OLi.attr("treeId", va);
												}
												else if ($.inArray(j, obj.attr) > -1)
												{
													OLi.attr(j, va);
												}
												else
												{
													//OA.attr(j, va);
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
				if (obj.treeClick)
				{
					tree.on("click", ".tree-txt", obj.treeClick);
				}
			}

			$(ele).on("click", ".input-text", function ()
			{
				var _this = $(this),
					flag = false;
					$(".input-tree .tree").hide();
					$(".input-tree").attr("open_list", "false");
				if (_this.parents(".input-tree").find(".tree li").size() === 0)
				{
					_this.parents(".input-tree").eq(0).find(".tree").hide();
					_this.parents(".input-tree").eq(0).attr("open_list", "false");
				}
				flag = (_this.parents(".input-tree").eq(0).attr("open_list") === "false") ||
					(_this.parents(".input-tree").eq(0).attr("open_list") === undefined);

				if (flag)
				{
					_this.parents(".input-tree").eq(0).find(".tree").show();
					_this.parents(".input-tree").eq(0).attr("open_list", "true");
					if ($(ele).find(".tree li").size() === 0)
					{
						$.myAjax({
							url: obj.url,
							type: obj.type || "POST",
							data: obj.data || "",
							success: function (data)
							{
								if (data && data.success === 0)
								{
									var treeArr =data.data;
									treeInit({
										ele: ele,
										data: treeArr,
										id: obj.id || "id",
										value: obj.value,
										url: obj.url,
										type: obj.type || "POST",
										all: obj.all || false,
										attr: obj.attr || [],
										initSendData: obj.data,
										treeClick: obj.treeClick || ""
									});
								}
							}
						});
					}
				}
				else
				{
					_this.parents(".input-tree").eq(0).find(".tree").hide();
					_this.parents(".input-tree").eq(0).attr("open_list", "false");
				}
			});
			$(document).on("click", function (e){//点击其他地方要关闭树
				var evnt = e || window.event,
					tar = $(evnt.target);
				if (tar.parents(".input-tree").size() === 0)
				{
					$(".input-tree .tree").hide();
					$(".input-tree").attr("open_list", "false");
				}
			});
		};
		/*地区树和机构树结束*/
		/*文件上传*/
		window.fileUpload = function (obj) {
			/*obj = {
				ths: this,//input 类型的file
				msg: "正在上传请稍后,请不要提交",//上传时的提示信息，没有可不传
				form: $("#upload"),//上传文件的form
				fileList: $(".file-list"),//展示上传完成文件的元素
			 	createUrl: "",//增加地址
			 	infoUrl: "",//返回信息地址
			 	delUrl: "",//删除的地址
				sendData: {}//要给后台传的参数
			}*/
			var _this = $(obj.ths),
				form = obj.form,
				options = {},
				time = 1500000,
				fileName = "",
				lastModified =  "",
				fileSize = "",
				uploading = "",
				successFlag = false,
				fileList = obj.fileList,
				pArr = fileList.find("p"),
				p = $('<p></p>'),
				ind = "";

			if (!_this.val())
			{
				return false;
			}
			var ses = window.getRequestHeader();
			options={
				url: ajaxUrl + (obj.createUrl || "preSupport/attachment/create"), //form提交数据的地址
				type: "POST", //form提交的方式(method:post/get)
				//target:target, //服务器返回的响应数据显示在元素(Id)号确定
				beforeSend: function(xhr)
				{
					xhr.setRequestHeader("authorization",ses);
					xhr.setRequestHeader("If-Modified-Since","0");
					xhr.setRequestHeader("Cache-Control","no-cache");
					this.url += "?timestamp="+ new Date().getTime();
				},
				beforeSubmit: function(arr){
					var uploadFlag = false;

					fileName = arr[0].value.name;
					lastModified =  arr[0].value.lastModified;
					fileSize = arr[0].value.size;
					uploadFlag = (fileSize > 50*1024*1024) ? true : false;
					if (uploadFlag)
					{
						ind = layer.confirm('文件大小不能超过50M', {
							btn: ['确定','取消'],
							shade: 0.1
						},
						function ()
						{
							layer.close(ind);
							_this.val("");
						});
						return false;
					}

					/*time = Math.ceil((fileSize/10/1024)*1000);//10kb/s 时的超时时间
					 (time > 10000) ? (time = time) : (time = 10000);
					this.url += "?timestamp="+ new Date().getTime();*/

					if (obj.msg)
					{
						uploading = layer.msg(obj.msg, {
							time: 0,
							icon: 16
							,shade: 0.1
						});
					}
				}, //提交前执行的回调函数
				success:function(data){
					if (data)
					{
						data = JSON.parse(data);
					}

					fileName = data.content.attachName;
					if (data && data.success === 0)
					{
						var sendData = $.extend(true, data.content, obj.sendData);
						$.myAjax({
							type:"POST",
							url:ajaxUrl + (obj.infoUrl || "preSupport/attachment/createFileInfo"),
							data: sendData,
							success:function(msg)
							{
								if(msg && msg.success === 0)
								{
									var img = $("<img />"),
										button = $("<a class='btn btn-success radius ml-10'><i class='Hui-iconfont'>&#xe6e2</i>删除</a>"),
										arrImg = [
											"doc",
											"ppt",
											"xls",
											"zip",
											"txt",
											"pdf",
											"htm",
											"mp3",
											"mp4",
											"png"
										],
										nameArr = fileName.split("."),
										str = nameArr[nameArr.length -1],
										type = "unknown";


									successFlag = true;
									layer.close(uploading);
									form.find('input[type="file"]').val("");

									p.attr("lastModified", lastModified);
									//将attachId赋值到页面的元素，方便获取
									if (data.content.attachId)
									{
										p.attr("attachId",data.content.attachId);
									}

									str = str.substr(0,3);
									$.each(arrImg, function (i, v)
									{
										if (str.toLowerCase() === v)
										{
											type = v;
										}
										else if ((str.toLowerCase() === "avi") || (str.toLowerCase() === "wmv"))
										{
											type = "mp4";
										}
										else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpe") || (str.toLowerCase() === "jpg"))
										{
											type = "png";
										}
										else
										{

										}
									});
									img.attr("src","../../images/commen/"+ type +".png");
									p.append(img);
									p.append('<span>'+ fileName +'</span>');

									button.on("click", function ()
									{
										var _this = $(this),
											id = $(this).parent().attr("attachId");
										$.myAjax({
											type:"POST",
											url:ajaxUrl + (obj.delUrl || "preSupport/attachment/deleteFileById"),
											data:{"id":id},

											success:function(data)
											{
												if(data.success === 0)
												{
													_this.parent().remove();
												}
											},
											error:function(msg)
											{
												layer.confirm('删除失败', {
													btn: ['确定','取消'],
													shade: 0.1
												});
											}
										});
									});
									p.append(button);
									fileList.append(p);
								}
							},
							error:function(msg)
							{
								_this.val("");
							}
						});
					}

				}, //提交成功后执行的回调函数
				error:function(XmlHttpRequest,textStatus,errorThrown){
					if (XmlHttpRequest.status === 504)
					{
						ind = layer.confirm('文件上传超时', {
								btn: ['确定'],
								shade: 0.1
							},
							function ()
							{
								layer.close(ind);
								_this.val("");
							});
					}
				},
				//dataType: "json" //服务器返回数据类型
				//clearForm:true, //提交成功后是否清空表单中的字段值
				//restForm:true, //提交成功后是否重置表单中的字段值，即恢复到页面加载时的状态
				timeout: time //设置请求时间，超过该时间后，自动退出请求，单位(毫秒)。
			};
			form.ajaxSubmit(options);
		};
		/*文件上传结束*/

		/*excel导入*/
		window.excelUpload = function (obj) {
			/*obj = {
			 msg: "正在上传请稍后,请不要提交",//上传时的提示信息，没有可不传
			 form: $("#upload"),//上传文件的form
			 createUrl: "",//增加地址
			 sendData: {}//要给后台传的参数
			 }*/
			var form = obj.form,
				options = {},
				time = 1500000,
				fileName = "",
				lastModified =  "",
				fileSize = "",
				uploading = "",
				successFlag = false,
				ind = "";

			var ses = window.getRequestHeader();
			options={
				url: ajaxUrl + obj.createUrl, //form提交数据的地址
				type: "POST", //form提交的方式(method:post/get)
				data: obj.sendData || {},
				beforeSend: function(xhr)
				{
					xhr.setRequestHeader("authorization",ses);
					xhr.setRequestHeader("If-Modified-Since","0");
					xhr.setRequestHeader("Cache-Control","no-cache");
					this.url += "?timestamp="+ new Date().getTime();
				},
				beforeSubmit: function(formData, jqForm, options){
					var uploadFlag = false,
						fileType = "",
						inputFile = jqForm.find('input[type="file"]');

					fileName = formData[0].value.name;
					if (!fileName)//取文件名，兼容ie9
					{
						fileName = formData[0].value;
					}
					lastModified =  formData[0].value.lastModified;
					fileSize = formData[0].value.size;
					fileType = fileName.split(".").pop();
					if (fileType.search("xls") < 0)
					{
						ind = layer.confirm('请上传excel类型的文件', {
								btn: ['确定','取消'],
								shade: 0.1
							},
							function ()
							{
								layer.close(ind);
								inputFile.val("");
							},
							function ()
							{
								inputFile.val("");
							});
						return false;
					}
					uploadFlag = (fileSize > 50*1024*1024) ? true : false;
					if (uploadFlag)
					{
						ind = layer.confirm('文件大小不能超过50M', {
								btn: ['确定','取消'],
								shade: 0.1
							},
							function ()
							{
								layer.close(ind);
								inputFile.val("");
							});
						return false;
					}

					uploading = layer.msg(obj.msg || "正在导入请稍后", {
						time: 0,
						icon: 16,
						shade: 0.1
					});
				}, //提交前执行的回调函数
				success:function(data){
					layer.close(uploading);
					if (typeof (data) == "object")
					{
						layer.confirm(data.error, {
							btn: ['确定'],
							shade: 0.1
						});
						return false;
					}
					if (typeof (data) == "string")
					{
						var temp = JSON.parse(data);
						if (temp.success === 1)
						{
							var SInd = layer.confirm(temp.error, {
								btn: ['确定'],
								shade: 0.1
							});
							return false;
						}
						obj.success ? obj.success(temp) : false;
					}
				}, //提交成功后执行的回调函数
				error:function(XmlHttpRequest,textStatus,errorThrown){
					if (XmlHttpRequest.status === 504)
					{
						ind = layer.confirm('文件上传超时', {
								btn: ['确定'],
								shade: 0.1
							},
							function ()
							{
								layer.close(ind);
								form.find('input[type="file"]').val("");
							});
					}
				},
				//dataType: "json" //服务器返回数据类型
				clearForm:true, //提交成功后是否清空表单中的字段值
				//restForm:true, //提交成功后是否重置表单中的字段值，即恢复到页面加载时的状态
				timeout: time //设置请求时间，超过该时间后，自动退出请求，单位(毫秒)。
			};
			form.ajaxSubmit(options);
		};
		/*excel导入结束*/

		/*
		条码打印方法
		 【入参说明】
		 参数名称: data
		 值：
		 [
			 {
				 "equipmentId": "设备分类",
				 "assetName": "设备名称",
				 "assetCode": "基地资产编号"
			 },
			 {
				 "equipmentId": "AP/室外AP",
				 "assetName": "AP",
				 "assetCode": "170427000146"
			 }
		 ]
		 数据类型：jsonArr
		 */
		window.printBarCode = function (data)
		{
			$.ajax({
				type: "GET",
				url: "http://127.0.0.1:38080/print?state",
				dataType: 'text',
				data: {},
				xhrFields:  {'Access-Control-Allow-Origin': '*' }
			}).done(function(msg){
				if (typeof (msg) == 'string')
				{
					msg = JSON.parse(msg);
				}
				if (msg && msg.success === 0)
				{
					$.ajax({
						type: "POST",
						url: "http://127.0.0.1:38080/print?print",
						dataType: 'text',
						data: {"data": JSON.stringify(data)},
						xhrFields: {"Access-Control-Allow-Origin": "*"}
					}).done(function(msg){
						if (typeof (msg) == 'string')
						{
							msg = JSON.parse(msg);
						}
						if (msg && msg.success === 1)
						{
							layer.confirm(msg.error, {
									btn: ['确定'],
									shade: 0.1
								});
						}
						return false;
					}).fail(function(jqXHR, textStatus){
						layer.confirm('打印服务异常，请确认打印服务是否正常！', {
							btn: ['确定'],
							shade: 0.1
						});
						return false;
					});
				}
				else
				{
					layer.confirm(msg.error, {
						btn: ['确定'],
						shade: 0.1
					});
				}

				return false;
			}).fail(function(jqXHR, textStatus){
				layer.confirm('打印服务异常，请确认打印服务是否正常！', {
					btn: ['确定'],
					shade: 0.1
				});
				return false;
			})
		};

		/*条码打印方法结束*/
	});
}(jQuery, window, document));
