/**
 * 本文件是修改密码页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {

		$("#liTable").Validform({
			btnSubmit: ".btns-group .save",
			tiptype:2,
			datatype:{
				"psw": /^(?![a-zA-Z0-9]+$)(?![^a-zA-Z/D]+$)(?![^0-9/D]+$).{6,18}$/
			},
			beforeSubmit:function(curform){
				var oldUserPassword = $("[con_name='oldUserPassword']").val(),
					newUserPassword = $("[con_name='newUserPassword']").val(),
					sendData = {};

				sendData.oldUserPassword = oldUserPassword;
				sendData.newUserPassword = newUserPassword;


				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "general/user/updatePassword",
					data: sendData,
					dataType: "json",
					success: function(msg)
					{
						if (msg && msg.success === 0)
						{
							if (msg.data === 0)
							{
								layer.confirm('原密码不正确', {
									btn: ['确定'],
									shade: 0.1
								});
							}
							else
							{
								layer.confirm('密码修改成功,请重新登录！', {
										btn: ['确定'],
										shade: 0.1
									},
									function ()
									{
										top.location.href = "../../index.html";
									},
									function ()
									{
										top.location.href = "../../index.html";
									});
							}
						}
					}
				});
			},
			callback:function(form){
				return false;
			}
		});

	});
}(jQuery, window, document));
