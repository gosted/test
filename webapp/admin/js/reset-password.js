/**
 * 本文件是忘记密码js文件
 * @author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var URLParams = [],
			aParams = document.location.search.substr(1).split('&');
		for (var i=0; i < aParams.length ; i++){
			var aParam = aParams[i].split('=');
			URLParams[aParam[0]] = aParam[1];
		}
		var xCode = URLParams["xCode"];
		var sData = {};
		if (xCode)
		{
			sData.xCode = xCode;
		}

		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/user/findExpireLinkExist",
			data: sData,
			dataType: "json",
			success: function(data)
			{
				if (data && data.success === 0)
				{
					if (data.data > 0)
					{
						$("#form").Validform({
							btnSubmit: ".save",
							tiptype:2,
							datatype:{
								"psw": /^(?![a-zA-Z0-9]+$)(?![^a-zA-Z/D]+$)(?![^0-9/D]+$).{6,18}$/,
								"username": /^[\w\W]{1,18}$/
							},
							beforeSubmit:function(curform){
								var userName = $("[con_name='userName']").val(),
								userPassword = $("[con_name='userPassword']").val(),
									sendData = {};

								sendData.userName = userName;
								sendData.userPassword = userPassword;
								sendData.xCode = xCode;

								$.myAjax({
									type: "POST",
									url: window.ajaxUrl + "general/user/resetPasswordByEmail",
									data: sendData,
									dataType: "json",
									success: function(data)
									{
										if (data && data.success === 0)
										{
											layer.confirm('密码修改成功,是否重新登录！', {
													btn: ['确定','取消'],
													shade: 0.1
												},
												function ()
												{
													window.open("../index.html");
												},
												function ()
												{
													location.href = "reset-password-success.html";
												});
										}
									}
								});
							},
							callback:function(form){
								return false;
							}
						});
					}
					else
					{
						layer.confirm('您的密码重置链接已失效，请重新申请 密码重置。（链接有效期为24小时）', {
								btn: ['确定'],
								shade: 0.1
							},
							function ()
							{
								window.open("forget-password.html","_self");
							},
							function ()
							{
								window.open("forget-password.html","_self");
							});
					}
				}
			}
		});
	});
}(jQuery, window, document));
