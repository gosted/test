/**
   * 本文件首页是页js文件
   *@author 鲍哲
   */
(function($, w, d){
	'use strict';
	$(function()
	{
		var flag = false;
		/*
		*我的待办
		* */

		$.myAjax({
			type:"POST",
			url:window.ajaxUrl + "general/user/findRoleByUserName1",
			data:{},
			success:function(data)
			{
				if(data.data && data.success === 0)
				{
					$.each(data.data,function(k,v)
					{
						if(v.roleCode == "HZHB")
						{
							flag = true;

						}

					})

					if(flag)
					{
						$("body").find(".none").addClass("none");
						$.myAjax(
							{
								type:"POST",
								url:window.ajaxUrl + "dashboard/findStatisticTodoCount",
								success:function(data)
								{
									if(data.success === 0 && data.data)
									{
										var list = data.data,
											reqtext = "",
											worktext = "",
											obj = $(".myOder");
										$.each(list, function(i,v) {
											var div = $("<div></div>");
											var title_span = $("<span></span>");
											var content_span = $("<span></span>");
											if(i == "reqCount")
											{
												reqtext = "待办支撑";
												//div.attr("data-info",v.codeCode);
												title_span.addClass("title_span");
												title_span.html(reqtext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0);
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
											}
											else if(i == "workCount")
											{
												worktext = "待办工单";
												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												title_span.addClass("title_span");
												title_span.html(worktext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0);
													content_span.css('color',"#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													div.css({"background":"url(../images/index/shouye_gray.png)"});
													content_span.css('color',"#999999");
												}
											}

											if(i%6 == 5)
											{
												div.addClass("clearright");
											}
											else if(i%6 == 0)
											{
												div.addClass("addleft");
											}
											div.append(title_span);
											div.append(content_span);
											obj.append(div);
										});
									}
								},
							});
					}
					else{
						$("body").find(".none").removeClass("none");
						$.myAjax(
							{
								type:"POST",
								url:window.ajaxUrl + "dashboard/findStatisticTodoCount",
								success:function(data)
								{
									if(data.success === 0 && data.data)
									{
										var list = data.data,
											reqtext = "",
											worktext = "",
											obj = $(".myOder");
										$.each(list, function(i,v) {
											var div = $("<div></div>");
											var title_span = $("<span></span>");
											var content_span = $("<span></span>");
											if(i == "reqCount")
											{
												reqtext = "待办支撑";
												//div.attr("data-info",v.codeCode);
												title_span.addClass("title_span");
												title_span.html(reqtext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0);
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
											}
											else if(i == "workCount")
											{
												worktext = "待办工单";
												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												title_span.addClass("title_span");
												title_span.html(worktext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0);
													content_span.css('color',"#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													div.css({"background":"url(../images/index/shouye_gray.png)"});
													content_span.css('color',"#999999");
												}
											}

											if(i%6 == 5)
											{
												div.addClass("clearright");
											}
											else if(i%6 == 0)
											{
												div.addClass("addleft");
											}
											div.append(title_span);
											div.append(content_span);
											obj.append(div);
										});
									}
								},
							});
						/*
						 * 请求项目信息
						 *
						 *
						 * */

						$.myAjax(
							{
								type:"POST",
								url:window.ajaxUrl + "dashboard/findStatisticsProjectCountQuery",
								success:function(data)
								{
									if(data.success === 0 && data.data)
									{
										$(".project-btn").css("background","#5EB95E");
										var list = data.data,
											reqtext = "",
											worktext = "",
											obj = $(".container-project");
										$.each(list, function(i,v) {
											var div = $("<div class='remove'></div>");
											var title_span = $("<span></span>");
											var content_span = $("<span></span>");
											if(i == "projectCount")
											{
												reqtext = "项目数";
												//div.attr("data-info",v.codeCode);
												title_span.addClass("title_span");
												title_span.html(reqtext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0).css("color","#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
											}
											else if(i == "subProjectCount")
											{
												worktext = "子项目数";
												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");

												title_span.addClass("title_span");
												title_span.html(worktext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0).css("color","#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
											}
											else if(i == "subProjectCount")
											{
												worktext = "子项目数";
												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												title_span.addClass("title_span");
												title_span.html(worktext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0).css("color","#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
											}
											else if(i == "contractCount")
											{
												worktext = "收入合同数";
												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												title_span.addClass("title_span");
												title_span.html(worktext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0);
													content_span.css('color',"#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
											}
											else if(i == "siteCount")
											{
												worktext = "工地数";
												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												title_span.addClass("title_span");
												title_span.html(worktext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.css('color',"#999999");
													content_span.html(0);
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
											}
											if(i%6 == 5)
											{
												div.addClass("clearright");
											}
											else if(i%6 == 0)
											{
												div.addClass("addleft");
											}
											div.append(title_span);
											div.append(content_span);
											obj.append(div);
										});
									}
								},
							});

						$(".project-btn").on('click',function()
						{
							$(this).css("background","#5EB95E");
							$(this).siblings("span").css("background","#D9EBD9");
							$.myAjax(
								{
									type:"POST",
									url:window.ajaxUrl + "dashboard/findStatisticsProjectCountQuery",
									success:function(data)
									{
										if(data.success === 0 && data.data)
										{
											var list = data.data,
												reqtext = "",
												worktext = "",
												obj = $(".container-project");
											$(".container-project").html("")
											$.each(list, function(i,v) {
												var div = $("<div class='remove'></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												if(i == "projectCount")
												{
													reqtext = "项目数";
													//div.attr("data-info",v.codeCode);
													title_span.addClass("title_span");
													title_span.html(reqtext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												else if(i == "subProjectCount")
												{
													worktext = "子项目数";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");

													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												else if(i == "subProjectCount")
												{
													worktext = "子项目数";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");
													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{

														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												else if(i == "contractCount")
												{
													worktext = "收入合同数";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");
													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0);
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												else if(i == "siteCount")
												{
													worktext = "工地数";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");
													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0);
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												if(i%6 == 5)
												{
													div.addClass("clearright");
												}
												else if(i%6 == 0)
												{
													div.addClass("addleft");
												}
												div.append(title_span);
												div.append(content_span);
												obj.append(div);
											});
										}
									},
								});
						})

						/*
						 * 请求工地信息
						 * */
						$(".wokr-btn").on('click',function()
						{
							$(this).css("background","#5EB95E");
							$(this).siblings("span").css("background","#D9EBD9");
							$.myAjax(
								{
									type:"POST",
									url:window.ajaxUrl + "dashboard/findStatisticsWorkOrderQuery",
									success:function(data)
									{
										if(data.success === 0 && data.data)
										{

											var list = data.data,
												reqtext = "",
												worktext = "",
												obj = $(".container-project");
											$(".container-project").html("");
											$.each(list, function(i, v) {

												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												if(v.key == "1")
												{
													reqtext = "出库工单数";
													//div.attr("data-info",v.codeCode);
													title_span.addClass("title_span");
													title_span.html(reqtext);
													content_span.addClass("content_span");

													if(v.value == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v.value);
													}
													if(v.value == "0" || v.value == "null")
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												else if(v.key == "2")
												{
													worktext = "施工工单数";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");
													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v.value == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v.value);
													}
													if(v.value == "0" || v.value == "null")
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												else if(v.key == "3")
												{
													worktext = "其他工单数";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");
													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v.value == "null")
													{
														content_span.html(0);
														content_span.css('color',"#999999");
													}
													else
													{
														content_span.html(v.value);
													}
													if(v.value == "0" || v.value == "null")
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												else{
													worktext = "其他";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");
													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v.value == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v.value);
													}
													if(v.value == "0" || v.value == "null")
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												if(i%6 == 5)
												{
													div.addClass("clearright");
												}
												else if(i%6 == 0)
												{
													div.addClass("addleft");
												}
												div.append(title_span);
												div.append(content_span);
												obj.append(div);
											});
										}
									},
								});
						})


						/*
						 *库房
						 * */
						$.myAjax(
							{

								type:"POST",
								url:window.ajaxUrl + "dashboard/findStatisticsStorageCountQuery",
								success:function(data)
								{
									if(data.success === 0 && data.data)
									{
										$(".storage-btn").css("background","#FFB09A");
										var list = data.data,
											reqtext = "",
											worktext = "",
											obj = $(".storage");
										$.each(list, function(i,v) {
											var div = $("<div class='remove'></div>");
											var title_span = $("<span></span>");
											var content_span = $("<span></span>");
											if(i == "storageCount")
											{
												reqtext = "库房数量";
												//div.attr("data-info",v.codeCode);
												title_span.addClass("title_span");
												title_span.html(reqtext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0).css("color","#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
											}
											else if(i == "inCount")
											{
												worktext = "入库单数量";
												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");

												title_span.addClass("title_span");
												title_span.html(worktext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0).css("color","#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
											}
											else if(i == "outCount")
											{
												worktext = "出库单数量";
												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												title_span.addClass("title_span");
												title_span.html(worktext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0).css("color","#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
											}
											if(i%6 == 5)
											{
												div.addClass("clearright");
											}
											else if(i%6 == 0)
											{
												div.addClass("addleft");
											}
											div.append(title_span);
											div.append(content_span);
											obj.append(div);
										});
									}
								},
							});

						$(".equ-btn").on('click',function()
						{
							$(this).css("background","#FFB09A");
							$(this).siblings("span").css("background","#F9EAE5")
							$.myAjax(
								{
									type:"POST",
									url:window.ajaxUrl + "dashboard/findStatisticsStoreDetailCountListQuery",
									success:function(data)
									{
										if(data.success === 0 && data.data)
										{
											var list = data.data,
												reqtext = "",
												worktext = "",
												obj = $(".storage");
											$(".storage").html("");
											$.each(list, function(i,v) {
												var div = $("<div class='remove'></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												if(i == "inCount")
												{
													reqtext = "入库设备数量";
													//div.attr("data-info",v.codeCode);
													title_span.addClass("title_span");
													title_span.html(reqtext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												else if(i == "outCount")
												{
													worktext = "出库设备数量";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");

													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												else if(i == "count")
												{
													worktext = "库存设备数量";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");
													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												if(i%6 == 5)
												{
													div.addClass("clearright");
												}
												else if(i%6 == 0)
												{
													div.addClass("addleft");
												}
												div.append(title_span);
												div.append(content_span);
												obj.append(div);
											});
										}
									},
								});
						})

						/*
						 *
						 * 请求设备信息*/
						$(".storage-btn").on('click',function()
						{
							$(this).css("background","#FFB09A");
							$(this).siblings("span").css("background","#F9EAE5")
							$.myAjax(
								{
									type:"POST",
									url:window.ajaxUrl + "dashboard/findStatisticsStorageCountQuery",
									success:function(data)
									{
										if(data.success === 0 && data.data)
										{
											var list = data.data,
												reqtext = "",
												worktext = "",
												obj = $(".storage");
											$(".storage").html("");
											$.each(list, function(i,v) {
												var div = $("<div class='remove'></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												if(i == "storageCount")
												{
													reqtext = "库房数量";
													//div.attr("data-info",v.codeCode);
													title_span.addClass("title_span");
													title_span.html(reqtext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0);
														content_span.css('color',"#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												else if(i == "inCount")
												{
													worktext = "入库单数量";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");

													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0);
														content_span.css('color',"#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												else if(i == "outCount")
												{
													worktext = "出库单数量";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");
													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.css('color',"#999999");
														content_span.html(0);
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
												}
												if(i%6 == 5)
												{
													div.addClass("clearright");
												}
												else if(i%6 == 0)
												{
													div.addClass("addleft");
												}
												div.append(title_span);
												div.append(content_span);
												obj.append(div);
											});
										}
									},
								});
						})

						/*
						 * 请求资产
						 *
						 * */
						$.myAjax(
							{
								type:"POST",
								url:window.ajaxUrl + "dashboard/findStatisticsAssertQuery",
								success:function(data)
								{
									if(data.success === 0 && data.data)
									{
										$(".station-btn").css("background","#F0A855");
										var list = data.data,
											reqtext = "",
											worktext = "",
											obj = $(".asse");
										$(".asse").html("");
										$.each(list, function(i,v) {
											var div = $("<div class='remove'></div>");
											var title_span = $("<span></span>");
											var content_span = $("<span></span>");
											if(i == "countAll")
											{
												reqtext = "资产总数";
												//div.attr("data-info",v.codeCode);
												title_span.addClass("title_span");
												title_span.html(reqtext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0).css("color","#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
												div.append(title_span);
												div.append(content_span);
												obj.append(div);
											}
											else if(i == "countIn")
											{
												worktext = "库存资产总数";
												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");

												title_span.addClass("title_span");
												title_span.html(worktext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.css('color',"#999999");
													content_span.html(0).css("color","#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
												div.append(title_span);
												div.append(content_span);
												obj.append(div);
											}
											else if(i == "countInstall")
											{
												worktext = "现场资产总数";
												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												title_span.addClass("title_span");
												title_span.html(worktext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.css('color',"#999999");
													content_span.html(0);
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
												div.append(title_span);
												div.append(content_span);
												obj.append(div);
											}
											else if(i == "countOther")
											{
												worktext = "其他资产总数";
												var div = $("<div></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												title_span.addClass("title_span");
												title_span.html(worktext);
												content_span.addClass("content_span");
												if(v == "null")
												{
													content_span.html(0).css("color","#999999");
												}
												else
												{
													content_span.html(v);
												}

												if( v == "0" || v == null)
												{
													content_span.css('color',"#999999");
													div.css({"background":"url(../images/index/shouye_gray.png)"});
												}
												div.append(title_span);
												div.append(content_span);
												obj.append(div);
											}
											if(i%6 == 5)
											{
												div.addClass("clearright");
											}
											else if(i%6 == 0)
											{
												div.addClass("addleft");
											}

										});
									}
								},
							});


						$(".station-btn").on('click',function(){
							$(this).css("background","#F0A855");
							$(this).siblings("span").css("background","#F6E8D7");
							$.myAjax(
								{
									type:"POST",
									url:window.ajaxUrl + "dashboard/findStatisticsAssertQuery",
									success:function(data)
									{
										if(data.success === 0 && data.data)
										{
											var list = data.data,
												reqtext = "",
												worktext = "",
												obj = $(".asse");
											$(".asse").html("");
											$.each(list, function(i,v) {
												var div = $("<div class='remove'></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												if(i == "countAll")
												{
													reqtext = "资产总数";
													//div.attr("data-info",v.codeCode);
													title_span.addClass("title_span");
													title_span.html(reqtext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}
													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
													div.append(title_span);
													div.append(content_span);
													obj.append(div);
												}
												else if(i == "countIn")
												{
													worktext = "库存资产总数";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");

													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
													div.append(title_span);
													div.append(content_span);
													obj.append(div);
												}
												else if(i == "countInstall")
												{
													worktext = "现场资产总数";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");
													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
													div.append(title_span);
													div.append(content_span);
													obj.append(div);
												}
												else if(i == "countOther")
												{
													worktext = "其他资产总数";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");
													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
													div.append(title_span);
													div.append(content_span);
													obj.append(div);
												}
												if(i%6 == 5)
												{
													div.addClass("clearright");
												}
												else if(i%6 == 0)
												{
													div.addClass("addleft");
												}

											});
										}
									},
								});

						})

						/*
						 * 请求资产价值*/
						$(".price-btn").on('click',function()
						{
							$(this).css("background","#F0A855");
							$(this).siblings("span").css("background","#F6E8D7");
							$.myAjax(
								{
									type:"POST",
									url:window.ajaxUrl + "dashboard/findStatisticsAssertValueQuery",
									success:function(data)
									{
										if(data.success === 0 && data.data)
										{
											var list = data.data,
												reqtext = "",
												worktext = "",
												obj = $(".asse");
											$(".asse").html("");
											$.each(list, function(i,v) {
												var div = $("<div class='remove'></div>");
												var title_span = $("<span></span>");
												var content_span = $("<span></span>");
												if(i == "countAll")
												{
													reqtext = "资产总数";
													//div.attr("data-info",v.codeCode);
													title_span.addClass("title_span");
													title_span.html(reqtext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
													div.append(title_span);
													div.append(content_span);
													obj.append(div);
												}
												else if(i == "value")
												{
													worktext = "资产原始价值";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");

													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
													div.append(title_span);
													div.append(content_span);
													obj.append(div);
												}
												else if(i == "value")
												{
													worktext = "资产当前价值";
													var div = $("<div></div>");
													var title_span = $("<span></span>");
													var content_span = $("<span></span>");
													title_span.addClass("title_span");
													title_span.html(worktext);
													content_span.addClass("content_span");
													if(v == "null")
													{
														content_span.html(0).css("color","#999999");
													}
													else
													{
														content_span.html(v);
													}

													if( v == "0" || v == null)
													{
														content_span.css('color',"#999999");
														div.css({"background":"url(../images/index/shouye_gray.png)"});
													}
													div.append(title_span);
													div.append(content_span);
													obj.append(div);
												}

												if(i%6 == 5)
												{
													div.addClass("clearright");
												}
												else if(i%6 == 0)
												{
													div.addClass("addleft");
												}

											});
										}
									},
								});
						})



						/*
						 *
						 * 前期支撑*/

						/*
						 * 请求资产
						 *
						 * */
						$.myAjax(
							{
								type:"POST",
								url:window.ajaxUrl + "preSupport/workFlow/findLatestTwMouCountByIds",
								success:function(data)
								{
									if(data.success === 0 && data.data)
									{
										$(".month-btn").css("background","#95CBF0");
										var list = data.data;
										var obj = $(".support");
										renderPage(list,obj);
									}
								},
							});

						$(".month-btn").on('click',function()
						{
							$(this).css("background","#95CBF0");
							$(this).siblings("span").css("background","#CCEDF9")
							$.myAjax(
								{
									type:"POST",
									url:window.ajaxUrl + "preSupport/workFlow/findLatestTwMouCountByIds",
									success:function(data)
									{
										if(data.success === 0 && data.data)
										{
											var list = data.data;
											var obj = $(".support");
											renderPage(list,obj);
										}
									},
								});
						})

						$(".type-btn").on('click',function()
						{
							$(this).css("background","#95CBF0");
							$(this).siblings("span").css("background","#CCEDF9")
							$.myAjax(
								{
									type:"POST",
									url:window.ajaxUrl + "preSupport/workFlow/sortList",
									success:function(data)
									{
										if(data.success === 0 && data.data)
										{
											var list = data.data;
											var obj = $(".support");
											renderPage(list,obj);
										}
									},
								});
						})

						$(".cp-btn").on('click',function()
						{

							$(this).css("background","#95CBF0");
							$(this).siblings("span").css("background","#CCEDF9")
							$.myAjax(
								{
									type:"POST",
									url:window.ajaxUrl + "preSupport/workFlow/productList",
									success:function(data)
									{
										if(data.success === 0 && data.data)
										{
											var list = data.data;
											var obj = $(".support");
											renderPage(list,obj);
										}
									},
								});
						})

					}




				}

			}
		})


		function renderPage(list,obj)
		{
			obj.html("");
			$.each(list, function(i,v) {
				var div = $("<div></div>");
				var title_span = $("<span></span>");
				var content_span = $("<span></span>");
				div.attr("data-info",v.codeCode);
				title_span.addClass("title_span");
				title_span.html(v.codeName);
				content_span.addClass("content_span");
				content_span.html(v.codeNum);
				if(v.codeNum == 0)
				{
					content_span.css("color","#999999")
					div.css({"background":"url(../images/index/shouye_gray.png)"});
				}
				if(i%6 == 5)
				{
					div.addClass("clearright");
				}
				else if(i%6 == 0)
				{
					div.addClass("addleft");
				}
				div.append(title_span);
				div.append(content_span);
				obj.append(div);
			});
		}



	})
}(jQuery, window, document));