/**
 * 本文件的功能是登录页js文件
 *@ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var yesOrNo = $(".lgn_remember"),//记住按钮复选框
			lgnBtn = $(".lgn_login"),//登录按钮
			isRemember = $(".lgn_remember").children("div"),//记住按钮复选框
			isRememberPsw = $.cookie("username") && ($.cookie("username") !== "null") && $.cookie("password") && ($.cookie("password") !== "null"),
			lgnUsr = $(".lgn_usr"),
			lgnPsw = $(".lgn_psw");

		//提示信息效果
		// 如果不支持placeholder，用jQuery来完成
		if(!isSupportPlaceholder()) {
			// 遍历所有input对象, 除了密码框
			$('input').not("input[type='password']").each(
				function () {
					var self = $(this);
					var val = self.attr("placeholder");
					input(self, val);
				}
			);
			/**//* 对password框的特殊处理
			 * 1.创建一个text框
			 * 2.获取焦点和失去焦点的时候切换
			 */
			$('input[type="password"]').each(
				function() {
					var pwdField = $(this);
					var pwdVal = pwdField.attr('placeholder');
					var pwdId  = pwdField.attr('id');
					// 重命名该input的id为原id后跟1
					pwdField.after('<input id="' + pwdId +'1" type="text" style="color: #B3B3B3;" value='+pwdVal+' autocomplete="off" />');
					var pwdPlaceholder = $('#' + pwdId + '1');
					pwdPlaceholder.show();
					pwdField.hide();

					pwdPlaceholder.focus(function(){
						pwdPlaceholder.hide();
						pwdField.show();
						pwdField.focus();
					});

					pwdField.blur(function(){
						if(pwdField.val() == '') {
							pwdPlaceholder.show();
							pwdField.hide();
						}
					});
				}
			);
		}

		// 判断浏览器是否支持placeholder属性
		function isSupportPlaceholder() {
			var input = document.createElement('input');
			return 'placeholder' in input;
		}
		// jQuery替换placeholder的处理
		function input(obj, val) {
			var $input = obj;
			$input.attr({value:val});
			$input.css("color", "#B3B3B3");
			$input.focus(function() {
				if ($input.val() == val) {
					$(this).attr({value:""});
					$input.css("color", "inherit");
				}
			}).blur(function() {
				if ($input.val() == "") {
					$(this).attr({value:val});
					$input.css("color", "#B3B3B3");
				}
			});
		}
		//提示信息效果结束
		//清除cookie
		$.cookie("sendusername",null);
		$.cookie("userRealName",null);
		$.cookie("userId",null);
		$.cookie("encodeToken",null);
		$.cookie("time",null);
		if (isRememberPsw)
		{
			$("#username").val($.cookie("username"));
			$("#password").val($.base64.decode($.cookie("password")));
			if (isRemember.attr("isremember") == "no")
			{
				isRemember.attr({"isremember":"yes"});
				isRemember.css({"background":'url("admin/images/commen/yes.png") no-repeat'});
			}
		}
		/*登录*/
		function login ()
		{
			var usrn = $("#username"),
				pswd = $("#password"),
				isRemember = $(".lgn_remember").children("div"),//记住按钮复选框
				regUsr = /^[\w\W]{1,18}$/g,
				regPsw = /^[\w\W]{6,18}$/g,
				usrnFlag = regUsr.test(usrn.val()),
				pswdFlag = regPsw.test(pswd.val()),
				data = {},
				uploading = "";
			if (usrnFlag && pswdFlag)
			{
				uploading = layer.msg('登录中请稍后', {
					time: 0,
					icon: 16,
					shade: 0.1
				});

				data.username = usrn.val();
				data.password = pswd.val();
				$.ajax({
					type: "POST",
					url: window.ajaxUrl + "general/token/login?timestamp="+ new Date().getTime(),//登录的接口
					dataType: "json",
					data: data,
					success: function(msg)
					{
						layer.close(uploading);
						if (msg && msg.success === 0)
						{
							$.cookie("sendusername",msg.data.username,{ expires: 365});
							$.cookie("userRealName",msg.data.userRealName,{ expires: 365});
							$.cookie("userId",msg.data.userId,{ expires: 365});
							$.cookie("encodeToken",msg.data.encodeToken,{ expires: 365});//成功登录后设置encodeToken
							$.cookie("time",msg.data.time,{ expires: 365});
							window.location.href = "admin/index.html?timestamp="+ new Date().getTime();
						}
						else if (msg && msg.success === -1 && msg.error != "")
						{
							layer.confirm(msg.error, {
									btn: ['确定'],
									shade: 0.1
								});
						}
						else
						{

						}
					},
					error: function(err)
					{
						layer.close(uploading);
						layer.confirm("登录失败", {
							btn: ['确定'],
							shade: 0.1
						});
					}
				});

				if (isRemember.attr("isremember") == "yes")//如果有记住密码就先存上
				{
					$.cookie("username",usrn.val(),{ expires: 365});
					$.cookie("password",$.base64.encode(pswd.val()),{ expires: 365});
				}
				else
				{
					$.cookie("username",null);
					$.cookie("password",null);
				}
			}
			else
			{
				if (!usrnFlag)
				{
					usrn.parents(".lgn_usr").css({"border": "1px solid #ff7200"});
					layer.confirm("请输入长度为1-18位的用户名！",
						{
							btn: ['确定'],
							shade: 0.1
						});
					return false;
				}
				else
				{
					usrn.parents(".lgn_usr").css({"border": "2px solid #dcdcdc"});
				}
				if (!pswdFlag)
				{
					pswd.parents(".lgn_psw").css({"border": "1px solid #ff7200"});
					layer.confirm("请输入长度为6-18位的密码！",
						{
							btn: ['确定'],
							shade: 0.1
						});
					return false;
				}
				else
				{
					pswd.parents(".lgn_psw").css({"border": "2px solid #dcdcdc"});
				}
			}
		}


		yesOrNo.on("click",function()
		{
			var isRemember = yesOrNo.children("div");
			if (isRemember.attr("isremember") == "no")
			{
				isRemember.attr({"isremember":"yes"});
				isRemember.css({"background":'url("admin/images/commen/yes.png") no-repeat'});
			}
			else
			{
				isRemember.attr({"isremember":"no"});
				isRemember.css({"background":'url("admin/images/commen/no.png") no-repeat'});
			}
		});


		lgnBtn.on("click", login);

		$("body").each(function() {
			$(this).keydown(function(evn) {
				var e = evn || window.event;
				if (e.keyCode == 13) {
					login();
				}
			});
		});

		/****图片切换****/
		function imgChange ()
		{
			var imgs = $(".img-box img"),
				timer = "",
				num = 2;

			clearInterval(timer);
			timer = setInterval(function (){
				num--;
				if (num === -1)
				{
					num = 2;
				}
				imgs.css({"display": "none"});
				imgs.eq(num).fadeIn(1000);
			},3000);
		}
		imgChange ();

		//忘记密码
		$(".lgn_forget a").on("click",function ()
		{
			window.open("admin/forget-password.html","_blank");
		});
		
	});
}(jQuery, window, document));
