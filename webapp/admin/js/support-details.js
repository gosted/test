/**
 * 本文件的功能是详情页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var reqId = parent.window.layerViewData.reqId,
			attachmentId = "",
			tables = $(".form-table"),
			arrKeyOne = [],
			arrKeyTwo = [],
			arrYesNo = [],
			arrTime = [],
			arr = [];

		window.getTd(tables);

		arrKeyOne = [
			"reqCode",
			"reqName",
			"unitName",
			"customerContacts",
			"customerPhone",
			"customerEmail",
			"customerName",
			"reqSupAddress",
			"reqProExpectRevenue",
			"reqProSiteNum",
			"reqProWorkerNum",
			"reqOutline",
			"reqDetail",
			"reqSupPeopleNum",
			"reqSupPeople",
			"reqProCycle",
			"reqEventName"
		];
		arrKeyTwo = [
			"apprApprover",
			"apprOption",
			"jdApprApprover",
			"jdApprOption"
		];
		arrYesNo = [
			"reqIsConstruct",
			"reqIsImportant",
			"reqIsSpot",
			"reqIsPm"
		];

		arrTime = [
			"reqExpectEndTime",
			"apprTime",
			"jdApprTime",
			"reqSubTime",
			"reqSupBeginTime",
			"reqSupEndTime"
		];

		/*
		* setHtmlData方法设置key为直接可以回填的html类型数据
		* 传入有父元素选择器、包含key的数组和一级数据的对象
		* */
		function setHtmlData (obj)
		{
			var box = $(obj.ele),
				data = obj.data,
				arr = obj.arr,
				tar = null;

			for (var i = 0, len = arr.length; i < len; i++)
			{
				if (data[arr[i]] != null && data[arr[i]] != "")
				{
					tar = box.find('[con_name="'+ arr[i] +'"]');
					if (tar.size() != 0)
					{
						tar.html(data[arr[i]]);
					}
				}
			}
		}
		/*
		 * setHtmlYesNo方法设置key为是否类型数据
		 * 传入有父元素选择器、包含key的数组和一级数据的对象
		 * */
		function setHtmlYesNo(obj)
		{
			var box = $(obj.ele),
				data = obj.data,
				arr = obj.arr,
				tar = null,
				html = "";

			for (var i = 0, len = arr.length; i < len; i++)
			{
				tar = box.find('[con_name="'+ arr[i] +'"]');
				if (tar.size() != 0)
				{
					if (data[arr[i]] == 0)
					{
						tar.html("否");
					}
					else if (data[arr[i]] == 1)
					{
						tar.html("是");
					}
					else
					{}
				}
			}
		}
		/*
		 * setHtmlTime方法设置key为时间类型数据
		 * 传入有父元素选择器、包含key的数组和一级数据的对象
		 * */
		function setHtmlTime (obj)
		{
			var box = $(obj.ele),
				data = obj.data,
				arr = obj.arr,
				tar = null,
				type = "",
				html = "";

			for (var i = 0, len = arr.length; i < len; i++)
			{
				if (data[arr[i]] != null && data[arr[i]] != "")
				{
					tar = box.find('[con_name="'+ arr[i] +'"]');
					type = tar.attr("_type");
					if (type === "time")
					{
						tar.html(window.formatDateTimes(data[arr[i]]));
					}
					else if (type === "timesec")
					{
						tar.html(window.formatDateTimesec(data[arr[i]]));
					}
					else if (type === "date")
					{
						tar.html(window.formatDates(data[arr[i]]));
					}
					else
					{}
				}
			}
		}
		//请求产品信息
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/dictionary/findDictionary",
			data: {"dictCode": "CP"},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					arr = data.data;

					//请求内容
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "preSupport/requirements/findById",
						data: {"id": reqId},
						success: function (data)
						{
							var _data = data.data;
							if (data && data.success === 0)
							{
								var box = $(".base-info"),
									work = "",
									chkArr = [],
									pro = "";
								attachmentId = data.data.attachmentId;
								if (_data.reqSupType === "0")
								{
									$(".need-infmt>div").hide().removeClass("show");
									$("#project").show().addClass("show");
									$("[con_name='reqSupType']").html("项目支撑");
								}
								else if (_data.reqSupType === "1")
								{
									$(".need-infmt>div").hide().removeClass("show");
									$("#exhibition").show().addClass("show");
									$("[con_name='reqSupType']").html("展会支撑");
								}
								else if (_data.reqSupType === "2")
								{
									$(".need-infmt>div").hide().removeClass("show");
									$("#train").show().addClass("show");
									$("[con_name='reqSupType']").html("培训支撑");
								}
								else {
									$(".need-infmt>div").hide().removeClass("show");
									$("#other").show().addClass("show");
									$("[con_name='reqSupType']").html("其它支撑");
								}

								if (_data.reqWorkload)
								{
									work = _data.reqWorkload + " 人天";
								}
								$("[con_name='reqWorkload']").html(work);

								if (_data.reqProProperty === "0")
								{
									$("[con_name='reqProProperty']").html("试点工地项目");
								}
								else if (_data.reqProProperty === "1")
								{
									$("[con_name='reqProProperty']").html("正式推广项目");
								}
								else if (_data.reqProProperty === "2")
								{
									$("[con_name='reqProProperty']").html("其他");
								}
								else
								{

								}

								if (_data.functionId)
								{
									chkArr = _data.functionId.split(",");
								}
								$.each(chkArr, function (i, v)
								{
									$.each(arr, function (j, va)
									{
										if (v == va.dictCodeValue)
										{
											pro += "、" + va.dictCodeName;
										}
									});
								});
								pro = pro.substr(1);
								$("[con_name='functionId']").html(pro);
								pro = "";

								if (attachmentId)
								{
									$.myAjax({
										type: "POST",
										url: window.ajaxUrl + "preSupport/attachment/findByIds",
										data: {"ids": attachmentId},
										success: function (data)
										{
											if (data && data.success === 0)
											{
												var needInfo = $(".show .need-info");
												setTable(data,needInfo);
											}
										}
									});
								}

								setHtmlData({
									ele: ".base-info",
									data: data.data,
									arr: arrKeyOne
								});
								setHtmlYesNo({
									ele: ".table-box",
									data: data.data,
									arr: arrYesNo
								});
								setHtmlTime({
									ele: ".table-box",
									data: data.data,
									arr: arrTime
								});
								//$('[con_name="reqSubTime"]').html(window.formatDates(data.data.reqSubTime));
								//$('[con_name="reqSupTime"]').html(window.formatDates(data.data.reqSupTime));
								if (data.data.reqIsConstruct === 0)
								{
									$('[con_name="reqIsConstruct"]').html("是");
								}
								else if (data.data.reqIsConstruct === 1)
								{
									$('[con_name="reqIsConstruct"]').html("否");
								}
								else 
								{
									$('[con_name="reqIsConstruct"]').html("不确定");
								}
								

								$.myAjax({
									type: "POST",
									url: window.ajaxUrl + "preSupport/requirements/findApproval",
									data: {"reqId": reqId},
									success: function (data)
									{
										if (data && data.success === 0)
										{
											var box = $(".view-check");

											if (data.data.jdApprResult === "-1")
											{
												$("[con_name='jdApprResult']").html("不同意");
											}
											else if (data.data.jdApprResult === "0")
											{
												$("[con_name='jdApprResult']").html("退回");
											}
											else if (data.data.jdApprResult === "1")
											{
												$("[con_name='jdApprResult']").html("同意");
											}
											else
											{}

											if (data.data.apprResult === "01")
											{
												$("[con_name='apprResult']").html("同意");
											}
											else if (data.data.apprResult === "02")
											{
												$("[con_name='apprResult']").html("退回");
											}
											else
											{}

											attachmentId = data.data.attachmentId;
											if (attachmentId){
												$.myAjax({
													type: "POST",
													url: window.ajaxUrl + "preSupport/attachment/findByIds",
													data: {"ids": attachmentId},
													success: function (data)
													{
														if (data && data.success === 0)
														{
															var needInfo = $(".task-info");
															setTable(data,needInfo);
														}
													}
												});
											}

											setHtmlData({
												ele: ".view-check",
												data: data.data,
												arr: arrKeyTwo
											});
											setHtmlTime({
												ele: ".view-check",
												data: data.data,
												arr: arrTime
											});
										}
									}
								});
							}
						}
					});

				}
			}
		});


		/*
		 * 渲染表格方法传入请求到的数据和在哪个tr后插入
		 * */
		function setTable (data,beforeBox)
		{
			var list = [],
				_files = $('<tr class="files">'+
					'<td class="table-key" colspan="4">附件：</td>'+
					'<td colspan="36" class="file-list"></td>'+
					'</tr>'),
				fileList = null,
				STr = null;

			fileList = _files.find(".file-list");
			list = data.data;
			fileList.html("");

			$.each(list, function (i, v)
			{
				var img = $("<img />"),
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
					nameArr = [],
					str = "",
					type = "unknown",
					p = $('<p></p>');

				if (v.attachName)
				{
					nameArr = v.attachName.split(".");
					str = nameArr[nameArr.length -1];
				}
				else
				{
					return false;
				}
				p.attr("attachId",v.attachId);
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
				p.append('<span title="点击下载文件">'+ v.attachName +'</span>');
				fileList.append(p);
				if (beforeBox.parents("table").find(".files").size() === 0)
				{
					beforeBox.after(_files);
				}
			});

			fileList.on("click", "p>span", function ()
			{
				var _this = $(this).parent(),
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
								"url": window.ajaxUrl + "preSupport/attachment/findFileData",
								"method": "post",
								"data": {"attachId": _this.attr("attachId")}
							});
						}
					}
				});
			});
		}

	});
}(jQuery, window, document));
