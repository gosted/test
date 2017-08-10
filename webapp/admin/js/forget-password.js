/**
 * 本文件是忘记密码js文件
 * @author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		$("#form").Validform({
			btnSubmit: ".save",
			tiptype:2,
			datatype:{
				"username": /^[\w\W]{1,18}$/
			},
			beforeSubmit:function(curform){
				var userName = $("[con_name='userName']").val(),
					userEmail = $("[con_name='userEmail']").val(),
					sendData = {};

				sendData.userName = userName;
				sendData.userEmail = userEmail;

				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "general/user/forgetPassword",
					data: sendData,
					dataType: "json",
					success: function(data)
					{
						if (data && data.success === 0)
						{
							var ind = layer.confirm('邮件发送成功,请登录邮箱进行验证修改密码！', {
								btn: ['确定','取消'],
								shade: 0.1
							},
							function ()
							{
								layer.close(ind);
								location.reload();
							},
							function ()
							{
								location.reload();
							});
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
