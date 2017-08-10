/**
 * 本文件是合作伙伴编辑页js文件
 * @author 孙倩
 */

(function($, w, d){
	'use strict';

	$(function() {
		var id = window.parent.layerViewData.providerId,
			tables = $(".table-box>.form-table"),
			areaId = "";
		window.getTd(tables);
		//请求合作伙伴原有信息
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "/general/partner/findById",
			data: {id: id},
			dataType: "json",
			success: function(data)
			{
				if (data && data.success === 0)
				{
					var _data = data.data,ids = "";
					var arr = [
							"partnerName",
							"partnerCode",
							"partnerContact",
							"partnerPhone",
							"partnerAdd",
							"partnerRegadd",
							"partnerEmail",
							"partnerZipcode",
							"partnerBank",
							"partnerAccount",
							"partnerCountry",
							"partnerProvince",
							"partnerRemark"
					];
					//请求附件信息
					ids = data.data.attachmentId;
					if (ids)
					{
						$.myAjax({
							type: "POST",
							url: window.ajaxUrl + "general/attachmentPro/findByIds",
							data: {"ids": ids},
							success: function (data)
							{
								if (data && data.success === 0)
								{
									var needInfo = $(".providerAdd");
									setData(data,needInfo);
								}
							}
						});
					}
					$(".woc").text(data.data.equipmentId||"");
					$.each(arr, function (i, v)
					{
						var keyVal = _data[v];

						if (!(keyVal === null || keyVal === ""))
						{
							$('[con_name="'+ v +'"]').val(keyVal);
						}
					});
					//分类
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "preSupport/plan/findDictionary",
						data: {dictCode:"HZHB"},
						dataType: "json",
						success: function (msg) {
							if (msg && msg.success === 0) {
								var str="";
								for(var i=0;i<msg.data.length;i++){
									str += '<option value="'+msg.data[i].dictCodeValue+'">'+msg.data[i].dictCodeName+'</option>';
								}
								$(".partnerType").append(str);
								$(".partnerType").val(data.data.partnerType);
							}
						},
						error: function (err) {
							layer.confirm('操作失败', {
								btn: ['确定','取消'],
								shade: 0.1
							});
						}
					});
					//自定义添加
					var str = null,
						flagSave = false;
					var list = data.data.reproperty;
						for(var key in list){
							str = $("<tr class='tableCenter'></tr>");
							for(var newKey in list[key]){
								str.append($("<td></td>").append($("<input type='text' readonly='readonly' disabled='disabled' class='needChoose input-text widthChange'>").val(newKey)));
								str.append($("<td></td>").append($("<input type='text' readonly='readonly' disabled='disabled' class='needChoose input-text widthChange'>").val(list[key][newKey])));
							}
							var tempBtn = '<td class="">';
							tempBtn += '<a style="text-decoration:none" class="edit" href="javascript:;" title="编辑">'+
								'<i class="Hui-iconfont changePos">&#xe70c;</i></a>';
							tempBtn += '<a style="text-decoration:none" class="del" href="javascript:;" title="删除">'+
								'<i class="Hui-iconfont"></i></a>';
							tempBtn+="</td>";
							str.append(tempBtn);
							$(".addTable").find(".tbody").append(str)
						}
					$('[con_name="explain"]').keyup();
					$(".del").on("click",function(){
						var _this = $(this);
						var id = $(this).parent().parent().attr("id");
						layer.confirm("确定要删除吗？", {
								shade: 0.1,
								btn: ['确定', '取消'] //按钮
							},
							function() {
								_this.parents("tr").remove("");
								$(".layui-layer-shade").hide();
								$(".layui-layer").hide();
							},
							function() {
							})
					});
					$(".edit").on("click", function() { //点击编辑

						var _this = $(this);
						if(!flagSave) {
							$(this).html('<i class="Hui-iconfont" title="保存">&#xe632;</i>');
							_this.parents("tr").find("input").css({
								"border": "1px solid #006BFF"
							});
							_this.parents("tr").find("input").removeAttr("disabled", "disabled");
							_this.parents("tr").find("input").removeAttr("readonly", "readonly");
							flagSave = true;
						} else {
							_this.html('<i class="Hui-iconfont changePos" title="编辑">&#xe60c;</i>');
							_this.parents("tr").find("input").css({
								"border": "1px solid rgb(238,238,238)"
							});
							_this.parents("tr").find("input").attr("disabled", "disabled");
							_this.parents("tr").find("input").attr("readonly", "readonly");
							flagSave = false;
						}

					});
				}
			}
		});
		//回显附件
		function setData (data,beforeBox)
		{
			var list = [],
				fileList = null,
				STr = null;

			fileList = $(".file-list");
			list = data.data;
			fileList.html("");

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
				p.append('<span title="点击下载文件" style="cursor: pointer">'+ v.attachName +'</span>');
				button.on("click", function ()
				{
					var _this = $(this),
						id = $(this).parent().attr("attachId");
					$.myAjax({
						type:"POST",
						url:ajaxUrl + "general/attachmentPro/deleteFileById",
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
					url: window.ajaxUrl + "general/attachmentPro/checkIsLogin",
					data: {},
					dataType: "json",
					success: function(data)
					{
						if (data && data.success === 0)
						{
							DownLoadFile({
								"url": window.ajaxUrl + "general/attachmentPro/download",
								"method": "post",
								"data": {"attachId": _this.attr("attachId")}
							});
						}
					}
				});
			});
		}
		//获取参数值
		function getValData (obj)
		{
			var data = {},
				box = $(obj.ele),
				arr = obj.arr;

			for (var i = 0, len = arr.length; i < len; i++)
			{
				if (arr[i])
				{
					data[arr[i]] = box.find('[con_name="'+ arr[i] +'"]').val();
				}
			}
			return data;
		}
		//动态添加表格
		addTable($(".addTable"),$(".firstTr"), $(".addBtn"));
		//提交数据
		$(".table-box").Validform({
			btnSubmit: ".save",
			tiptype:2,
			datatype: {
				"phone": /^0\d{2,3}-?\d{7,8}$/,
				"Post": /^[0-9][0-9]{5}$/,
				"account":/^\d{19}$/g
			},
			beforeSubmit:function(curform){

				var arr = [
						"partnerName",
						"partnerCode",
						"partnerContact",
						"partnerPhone",
						"partnerAdd",
						"partnerRegadd",
						"partnerEmail",
						"partnerZipcode",
						"partnerBank",
						"partnerAccount",
						"partnerCountry",
						"partnerProvince",
						"partnerRemark"
					],
					sendData = getValData({
						ele: ".table-box",
						arr:arr
					});
				sendData.id = id;
				//自定义添加
				var arr1 = [];
				var obj1 = $(".addTable");
				var getAttr1 = obj1.find("th");
				var str="";
				obj1.find(".tableCenter").each(function(i,o)
				{
					var name = $(this).find("td input").eq(0).val(),
						code = $(this).find("td input").eq(1).val();
					var sendArr = {};
					sendArr[name] = code;
					str = JSON.stringify(sendArr);
					arr1.push(str);
				});
				/*sendData.arrlist = arr1.join(",");*/

				//类型
				var  part = $(".has-partnerType .Validform_checktip");
				var val = $('.partnerType option:selected').val();
				if(val == "choose")
				{
					$(".partnerType").addClass("Validform_error");
					part.removeClass("Validform_right");
					part.addClass("Validform_wrong");
				} else
				{
					$(".partnerType").removeClass("Validform_error");
					part.removeClass("Validform_wrong");
					$(".partnerType-tip").attr("title", "输入正确");
					part.addClass("Validform_right");
					sendData.partnerType = val;
					var arrP = $(".table-box").find($(".file-list p")), strId = "";
					if (arrP.size() > 0) {
						$.each(arrP, function (i, v) {
							strId += "," + $(v).attr("attachId");
						});
						strId = strId.substr(1);
					}
					sendData.attachmentId = strId;
					var  str = $.trim( $(".woc").text());
					sendData.equipmentId = str ;
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "/general/partner/update",
						data: sendData,
						dataType: "json",
						success: function(msg)
						{
							if (msg && msg.success === 0)
							{
								layer.confirm('保存成功', {
										btn: ['确定'],
										shade: 0.1
									},
									function(){
										sessionStorage.clear();
										parent.window.location.reload();
									});
								$(document).on("click",".layui-layer-close",function(){
									sessionStorage.clear();
									parent.window.location.reload();
								})

							}
						}
					});
				}

			},
			callback:function(form){
				return false;
			}
		});
		$(".partnerCode").blur(function(){
			var partnerCode = $(this).val();
			if(partnerCode == ""){
				$(".has-partnerCode .Validform_checktip").removeClass("Validform_right");
				$(".partnerCode").addClass("Validform_error");
				$(".has-partnerCode .Validform_checktip").addClass("Validform_wrong");
				$(".has-partnerCode").attr("title","请输入用户名");
			}else {
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "/general/partner/checkPartnerCode",
					data: {partnerCode: userName},
					dataType: "json",
					success: function (msg) {
						if (msg && msg.success === 0) {
							if (msg.data == 0) {
								$(".partnerCode").removeClass("Validform_error");
								$(".has-partnerCode .Validform_checktip").removeClass("Validform_wrong");
								$(".partnerCode-tip").attr("title", "该用户编号可以使用");
								$(".has-partnerCode .Validform_checktip").addClass("Validform_right");
							} else {
								$(".has-partnerCode .Validform_checktip").removeClass("Validform_right");
								$(".partnerCode").addClass("Validform_error");
								$(".has-partnerCode .Validform_checktip").addClass("Validform_wrong");
								$(".partnerCode-tip").attr("title", "该用户编号已存在");
							}
						}
					},
					error: function (err) {
						layer.confirm('操作失败', {
							btn: ['确定','取消'],
							shade: 0.1
						});
					}
				});
			}
		});
		//获取类型

		function getType(val){
			var part = $(".has-partnerType .Validform_checktip");
			if(val == "choose"){
				$(".partnerType").addClass("Validform_error");
				part.removeClass("Validform_right");
				part.addClass("Validform_wrong");
			}else{
				$(".partnerType").removeClass("Validform_error");
				part.removeClass("Validform_wrong");
				$(".partnerType-tip").attr("title", "输入正确");
				part.addClass("Validform_right");
			}
		}
		$(".partnerType").on("blur",function(){
			var val = $(this).val();
			getType(val);
		});
		$(".partnerType").on("change",function(e){
			var val = $(this).val();
			getType(val);
		});
		$(".sel").on("click",function()
		{
			window.layerShow("关联设备名称","pro-equipmentName-list.html");
		});

	});
}(jQuery, window, document));
