/**
 * 本文件是我的工单列表js文件
 * @ author 孙倩
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 20,
			pageNo = 1,
			tbody = $(".tbody"),
			id = window.parent.layerViewData.orderId,
			workTypes= window.parent.layerViewData.workTypes;



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
            var planimg,
                plantype;
			$.each(list, function (i, v)
			{
				var orderId = v.id,
					workType= v.workType,
                    ids= v.attachmentId,

					view = $('<a href="javascript:;"></a>');


                $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/attachment/findByIds",
                            data: {"ids": ids},
                            success: function (data)
                            {
                                if (data && data.success === 0)
                                {
                            //获取附件名字

                            var planName= data.data[0].attachName,
                            index=planName.lastIndexOf("."),
                                plantype=planName.substring(index+1,planName.length);
                            planpic(plantype);


                            STr = $('<tr class="text-c" orderId="'+ orderId +'"></tr>');//一行
                            STr.append($('<td ids="'+ v.attachmentId
								+'" class="download text-l" value="" placeholder="" readonly="readonly">'
								+'<a href="javascript:;">'
								+'<img class="doSptMdlPro-name-img l mr-5" src="'+planimg
								+'"/>'+ v.planName+'</a>'+'</td>'));
                            STr.append($('<td></td>').text(v.createUserName));
                            STr.append($('<td></td>').text(v.createTimeStr));
                            STr.append($('<td></td>').text(v.remark));


                            tbody.append(STr);
                            if(i%2 == 0){
                                STr.css("background","#fff");
                            }else{
                                STr.css("background","#eee");
                            }

                            //下载
                            $(".download").on("click",function()
                            {

                                var _this = $(this);
                                var ids=_this.attr("ids");
                                //获取附件名称
                                if(ids){

                                    $.myAjax({
                                        type: "POST",
                                        url: window.ajaxUrl + "project/attachment/findByIds",
                                        data: {"ids": ids},
                                        success: function (data)
                                        {
                                            if (data && data.success === 0)
                                            {
                                                //获取名字

                                                var planName= data.data[0].attachName,
                                                    index=planName.lastIndexOf(".");
                                                var plantype=planName.substring(index+1,planName.length);

                                                planpic(plantype);

                                                //下载过程
                                                var		DownLoadFile = function (options)
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
                                                                "url": window.ajaxUrl + "/project/attachment/findFileData",
                                                                "method": "post",
                                                                "data": {"attachId":_this.attr("ids")}
                                                            });
                                                        }

                                                    }
                                                });



                                            }
                                        }
                                    });
                                }

                                //var		DownLoadFile = function (options)
                                //		{
                                //			var config = $.extend(true, { method: 'post' }, options);
                                //			var $iframe = $('<iframe id="down-file-iframe" />');
                                //			var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
                                //			$form.attr('action', config.url);
                                //			for (var key in config.data) {
                                //				$form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
                                //			}
                                //			$iframe.append($form);
                                //			$(document.body).append($iframe);
                                //			$form[0].submit();
                                //			$iframe.remove();
                                //		};
                                //	$.myAjax({
                                //		type: "POST",
                                //		url: window.ajaxUrl + "preSupport/attachment/checkIsLogin",
                                //		data: {},
                                //		dataType: "json",
                                //		success: function(data)
                                //		{
                                //			if (data && data.success === 0)
                                //			{
                                //				DownLoadFile({
                                //					"url": window.ajaxUrl + "/project/attachment/findFileData",
                                //					"method": "post",
                                //					"data": {"attachId":_this.attr("ids")}
                                //				});
                                //			}
                                //
                                //		}
                                //	});
                            })

                        }}})

				//文件名称



				//判断文档类型
				function planpic(plantype) {
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




				/*
				 * tr颜色间隔问题
				 * */

			});
		}


		/*渲染表格和分页的方法,传入要向后台传的数据*/
		function renderingPage (sendData)
		{
			var s=2;
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "project/construction/findPage",
				data: {workOrderId:id,
					type:s},
				success: function (data) {
					if (data && data.success === 0) {
						setTable(data);

					}
				}
			});
		}

		renderingPage({
			pageSize: pageSize,
			pageNo: pageNo
		});


        //下载：


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
				_ul = $(".pagination").find(".con_much").children("ul"),
				sendData = {};
			pageSize = $(this).html();
			_num.html(pageSize);
			_ul.css({"display": "none"});

			sendData = {
				pageSize: pageSize,
				pageNo: pageNo
			};
			workOrderCode ? sendData.workOrderCode = workOrderCode : false;
			workOrderName ? sendData.workOrderName = workOrderName: false;
			workType ? sendData.workType = workType: false;
			startTime ? sendData.startTime = startTime: false;
			endTime ? sendData. endTime = endTime: false;
			renderingPage(sendData);
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
		/*每页显示多少条结束*/

		/*
		 * 查询方法
		 * */
		function findList()
		{
			var search = $(".search-area"),
				sendData = {};

			workOrderCode= search.find('[con_name="workOrderCode"]').val();
			workOrderName= search.find('[con_name="workOrderName"]').val();
			workType=search.find('[con_name="workType"]').val();
			startTime=search.find('[con_name="startTime"]').val();
			endTime=search.find('[con_name="endTime"]').val();
			sendData = {
				pageSize: pageSize,
				pageNo: pageNo
			};

			workOrderCode ? sendData.workOrderCode = workOrderCode : false;
			workOrderName ? sendData.workOrderName = workOrderName: false;
			workType ? sendData.workType = workType: false;
			startTime ? sendData.startTime = startTime: false;
			endTime ? sendData. endTime = endTime: false;
			renderingPage(sendData);
		}
		$(".find-btn").on("click", findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});

		/*
		 * 列表内按钮区按钮点击事件
		 * */
		tbody.on("click", ".btns a", function ()
		{
			var href = $(this).attr("_href"),
				title = $(this).attr("title"),
				data = {},
				orderId = "";
			workType=$(this).parents("tr").find(".workType").text();
			if (!href)
			{
				return false;
			}
			orderId=$(this).parents("tr").attr("orderId");
			data.orderId = orderId;
			window.layerViewData = data;
			window.layerShow(title,href);
		});

		//点名称进编辑页
		tbody.on("click", ".td-view a", function ()
		{
			$(this).parents("tr").find(".deal").click();
		});

		/*添加*/
		$(".btn-add").on("click",function ()
		{
			window.layerShow("添加","pro-project-add.html");
		});

	});
}(jQuery, window, document));
