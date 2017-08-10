/**
 * Created by baozhe  on 2016/12/22.
 * 本文件是系统配置编辑js文件
 *@author 鲍哲
 */

(function($, w, d) {
	'use strict';
	$(function(){
		var configId = parent.window.layerViewData.configId;
		window.getTd($(".form-table"));


		//请求已有信息
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/sysconfig/findById",
			//url:"http://localhost:63342/code/data/general/sysconfig/findById.json",

			data: {"id": configId},
			success: function (data)
			{

				if (data && data.success === 0)
				{
					var box = $("#roleAdd");
					setFormInfo(box,data);

				}
			}
		});


		/*
		 * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
		 * */
		function setFormInfo (box,data)
		{
			var box = $("#roleAdd"),
				conNames = box.find('[con_name]'),
				Names = box.find('[name]'),
				_data = data.data,
				key = "",
				keyVal = "",
				_radio = null,
				chkArr = [],
				date = "",
				desLen = data.data.sysconfigDesc.length,
				valLen = data.data.sysconfigValue.length;
				$(".sysval").siblings().find("em").text(valLen);
				$(".sysdec").siblings().find("em").text(desLen);

			for (var i= 0, len=Names.size(); i<len; i++)
			{
				key = Names.eq(i).attr("name");
				keyVal = _data[key];
				if (keyVal)
				{
						Names.eq(i).val(keyVal);
				}

			}

		}

		$("#table-box").Validform({
			btnSubmit: ".upload-lib",
			tiptype:2,
			beforeSubmit:function(curform){

				/*
				 * 提交信息
				 */

					var sendData = {};
					sendData = getFormInfo(curform);
					$.myAjax({
						type: "POST",
						url: window.ajaxUrl + "general/sysconfig/update",
						//url:"http://localhost:63342/code/data/general/sysconfig/update.json",
						data: sendData,
						dataType: "json",
						success: function(msg)
						{
							if (msg && msg.success === 0)
							{
								layer.confirm('提交成功', {
										btn: ['确定'],
										shade: 0.1
									},
									function()
									{
										parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
									},
									function()
									{
										parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗

									});

							}
							else
							{
								layer.msg('操作失败', {icon:5,time:1000});
							}
						},
						error: function(err)
						{
							layer.msg('操作失败', {icon:5,time:1000});
						}
					});


			},
			callback:function(form){
				return false;
			}
		});

		/*
		 * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
		 * */
		$(".ProgramSubmitButton").on("click",getFormInfo);

		function getFormInfo (box)
		{
			var box = $("#roleAdd"),
				conNames = box.find('[con_name]'),
				key = "",
				keyVal = "",
				sendData = {},
				checkboxs = null;
				sendData.id = configId;

			for (var i= 0, len=conNames.size(); i<len; i++)
			{
				key = conNames.eq(i).attr("con_name");
					keyVal = conNames.eq(i).val();
					sendData[key] = keyVal;
			}
			return sendData;
		}

	});
}(jQuery, window, document));