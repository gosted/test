/**
 * 本文件是生命周期js文件
 * @ author 彭佳明
 */

(function($, w, d){
	'use strict';
	$(function() {
		function AssetCheck(options){
			var assetCo = parent.window.layerViewData.assetCo;
			this.setData = {
				pageSize:20,
				pageNo:1
			};
			this.assetCo = assetCo;
		}
		AssetCheck.prototype = {
			constructor:AssetCheck,
			init:function()
			{
				this.getData();
				this.getListData(this.setData);
				this.pagenation();
			},
			setCurrentPosition:function(Data)
			{
				var TData = JSON.parse(Data);
				var that = this;
				var cb = $.Callbacks();
				that.getDictCode("ZCWZ").then(function(data){
					$.each(data.data,function(i,o){
						if(TData.flag == o.dictCodeValue){
							$(".fir").text(o.dictCodeName);
							cb.fire(o.dictCodeValue);
						}
					})
				});
				$.each(TData,function(i,o){
					$("[con_cur="+i+"]").text(TData[i]||"");
				});
				cb.add(setPos);
				function setPos(code)
				{
				    if(code == "ZCWZ-KF")
				    {
                        var arr = ["所在库房","所在货架","入库人","入库时间"],i;
                        if($(".fir").text()=="库房")
                        {
                            for(i=0;i<arr.length;i++)
                            {
                                $(".pro").eq(i).text(arr[i]);
                            }
                        }
                        $.each(TData,function(i,o){
                            $("[con_cur="+i+"]").text(TData[i]||"");
                        });
                    }
				}

			},
			getData:function(data)
			{
				var that = this;
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "project/assetRegistration/findTrackingInfo",
					data: {assetCode:that.assetCo},
					dataType: "json",
					success: function(data)
					{
						if (data && data.success === 0)
						{
							var list = data.data;
							$.each(list,function(i,o){
								$("[con_name="+i+"]").text(list[i]||"");
							});
							if(list.equipmentImage){
								$(".Img").append($("<img style='float:left' src="+window.ajaxUrl+"project/attachment/downloadImage?id="+list.equipmentImage+">"))
							}else{
								$(".Img").append($("<img style='float:left' src='../../images/temporary/equ_logo.png'>"))
							}
							$(".equipmentName").text(list.equipmentName||"");

							that.getDictCode("ZCZT").then(function(Data){
								$.each(Data.data,function(i,o){
									if(list.assetStatus == o.dictCodeValue){
										$(".assetStatus").text(o.dictCodeName);
									}
								})
							});
							if(list.currentPosition){
								that.setCurrentPosition(list.currentPosition);
							}else{
								$(".table").hide();
								$(".posNow").hide();
							}
							if(list.relatedAttachId){
								that.setAttachment(list.relatedAttachId);
								$(".atNo").hide();
							}else{
								$(".atNo").show();
							}
						}
					}
				});

			},
			getListData:function(data)
			{
				var that = this;
				var Data = data;
				Data.assetCode = this.assetCo;
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "project/assetRegistration/findTrackingList",
					data: Data,
					dataType: "json",
					success: function(data)
					{
						if (data && data.success === 0)
						{
							that.setdata(data);
							laypage({
								cont: $('#pagination'),
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
											pageSize:that.setData.pageSize ,
											pageNo: obj.curr,
											assetCode:that.assetCo
										};
										$.myAjax({
											type: "POST",
											url: window.ajaxUrl + "/project/assetRegistration/findTrackingList",
											data: sendData,
											success: function (data)
											{
												if (data && data.success === 0)
												{
													that.setdata(data);
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
									'<li class="con_num_10"><span>10</span></li>'+
									'<li class="con_num_20"><span>20</span></li>'+
									'<li class="con_num_50"><span>50</span></li>'+
									'<li class="con_num_100"><span>100</span></li>'+
									'<li class="con_num_200"><span>200</span></li>'+
									'<li class="con_num_1000"><span>1000</span></li>'+
									'</ul>'+
									'</div>');
								$('.pagination').append("<div class='con_altogether'><span>共<span class='allpage'>"+data.data.totalCount+"</span>条</span></div>");
							}
							$(".allpage").text(data.data.totalCount);
						}
					}
				});
			},
			setdata:function(data)
			{
				var str = "",that = this,arr = [],thsData = {};
				var cb = $.Callbacks();
				var list = data.data.result;
				$.each(list,function(i,o)
				{
					var date = new Date(o.createTime);
					if($.type(date) === "date")
					{
						date = that.formTime(date);
					}else{
						date = ""
					}

					str +=
						"<div class='eqL'>"+
						"<div class='tp'>"+
						"<div class='time'>"+date+"</div><div class='squ'></div>"+
						"<div class='oper' oper="+o.operation+"></div>"+
						"</div>"+
						"<div class='bt'>"+
						"<div class='bto'>"+
						"<div class='sc'>操作人：</div>"+
						"<div class='person'>"+o.createUserName+"</div>"+
						"</div>"+
						"<div class='btr'>"+
						"<div class='sc'>备注：</div>"+
						"<div class='remark'>"+o.operationDetail+"</div>"+
						"</div>"+
						"</div>"+
						"</div>";
				});
				$(".ew").html(str);
				that.getDictCode("ZCCZ").then(function(Data){
					thsData = Data;
					cb.fire(thsData);
				});
				function TData(data)
				{
					$(".ew").find(".oper").each(function(n,ob){
						var tha = $(this);
						$.each(data.data,function(iF,oF){
							if(tha.attr("oper") == oF.dictCodeValue){
								tha.text(oF.dictCodeName);
							}
						});
					});
				}
				cb.add(TData);

			},
			getDictCode:function(code)
			{
				//获取字典项
				var that = this;
				var p = new Promise(function(resolve,reject)
				{
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "general/dictionary/findDictionary",
						data: {dictCode:code},
						dataType: "json",
						success: function(data)
						{
							if (data && data.success === 0)
							{
								resolve(data);
							}
						},
						error: function (err) {
							layer.confirm('操作失败', {
						      btn: ['确定','取消'],
						      shade: 0.1
					        });
						}
					});
				});
				return p;
			},
			setAttachment:function(attachId)
			{
				var that = this;
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "project/attachment/findByIds",
					data: {"ids": attachId},
					success: function (data)
					{
						if (data && data.success === 0)
						{
							that.setAttachmentData(data,$(".last"));
						}
					}
				});

			},
			setAttachmentData:function(data,beforeBox)
			{
				var list = [],
					fileList = null,
					STr = null;

				fileList = $(".file-list");
				list = data.data;
				fileList.html("");
				if(list){
					$.each(list, function (i, v)
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
							else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpg"))
							{
								type = "png";
							}
							else
							{

							}
						});
						img.attr("src","../../images/commen/"+ type +".png");
						p.append(img);
						p.append('<span title="点击下载文件" style="cursor: pointer">'+v.attachName+'</span>');
						button.on("click", function ()
						{
							var _this = $(this),
								id = $(this).parent().attr("attachId");
							$.myAjax({
								type:"POST",
								url:ajaxUrl + "project/attachment/deleteFileById",
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
						//p.append(button);
						fileList.append(p);
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
						DownLoadFile({
							"url": window.ajaxUrl + "project/attachment/download",
							"method": "post",
							"data": {"attachId": _this.attr("attachId")}
						});
					});
				}
			},
			pagenation:function()
			{
				var that = this;
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
						_ul = $(".pagination").find(".con_much").children("ul"),
						sendData = {};
					_num.html($(this).html());
					_ul.css({"display": "none"});
					that.setData.pageSize = $(this).html();
					that.setData.assetCode = this.assetCo;
					that.getListData(that.setData);
				});
				$(document).on("click", function(e)
				{
					var evn = e || window.event;
					if ($(evn.target).parents(".con_much").size() === 0)
					{
						$(".con_much ul").hide();
					}
				});
			},
			formTime:function(dates)
			{
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
					return y + '-' + m + '-' + d+' <span class="ti">'+h+':'+minute+":"+ss+"</span>";
				}
				else
				{
					return "";
				}
			}
		};
		var assetCheeck = new AssetCheck();
		assetCheeck.init();
	});
}(jQuery, window, document));
