/**
 * 本文件是个人信息页js文件
 * @ author 张欢
 */

(function($, w, d){
	'use strict';

	$(function() {
		var tables = $(".table-box>.form-table"),
			arrKeyOne = [],
			arrTime = [];

		window.getTd(tables);
		arrKeyOne = [
			"userEmail",
			"userMobilePhone",
			"userJobNumber",
			"userWorkYear",
			"userJob",
			"userEdu",
			"userPoliticsStatus",
			"userAddress",
			"userHobby"
		];

		arrTime = [
			"userBirthday"
		];


		/*
		 * setValData方法设置key为直接可以回填的html类型数据
		 * 传入有父元素选择器、包含key的数组和一级数据的对象
		 * */
		function setValData (obj)
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
						tar.val(data[arr[i]]);
					}
				}
			}
		}
		/*
		 * setValTime方法设置key为时间类型数据
		 * 传入有父元素选择器、包含key的数组和一级数据的对象
		 * */
		function setValTime (obj)
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
						tar.val(window.formatDateTimes(data[arr[i]]));
					}
					else if (type === "timesec")
					{
						tar.val(window.formatDateTimesec(data[arr[i]]));
					}
					else if (type === "date")
					{
						tar.val(window.formatDates(data[arr[i]]));
					}
					else
					{}
				}
			}
		}
		/*
		 * getValData方法获取要提交的数据
		 * 传入包含con_name的元素和con_name的数组的对象
		 * 返回组装好的数据
		 * */
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

		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/user/findPerInfo",
			success: function (data) {
				if (data && data.success === 0) {

					setValData({
						ele: ".table-box",
						data: data.data,
						arr: arrKeyOne
					});
					setValTime({
						ele: ".table-box",
						data: data.data,
						arr: arrTime
					});

					$('.table-box [con_name="userName"]').html(data.data.userName);
					$('.table-box [con_name="roleName"]').html(data.data.roleName);
					$('.table-box [con_name="userRealName"]').html(data.data.userRealName);
					$('.table-box [con_name="unitName"]').html(data.data.unitName);
					$('.table-box [con_name="userLastLoginTime"]').html(window.formatDateTimesec(data.data.userLastLoginTime));
					if (data.data.userSex === 0 || data.data.userSex === 1)
					{
						$('.table-box [name="userSex"]')[data.data.userSex].checked = true;
					}
				}
			}
		});

		function setPowerTable (obj)
		{
			var table = $(obj.table),
				data = obj.data,
				OTr = null;

			for (var i= 0, len=data.length; i<len; i++)
			{
				OTr = $('<tr></tr>');
				OTr.append('<td>'+ data[i].arType +'</td>');
				OTr.append('<td>'+ data[i].areaName +'</td>');
				OTr.append('<td class="yes-no">'+ (data[i].arIsCompatibility === 1 ? "是" : "否") +'</td>');
				table.append(OTr);
			}
		}
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "preSupport/areaRelative/findByUserId",
			success: function (data) {
				if (data && data.success === 0)
				{
					if (data.data[0] && data.data[0] !== {})
					{
						setPowerTable({
							table: ".power",
							data: data.data
						});
					}
					else
					{
						$(".power-box").hide();
					}
				}
			}
		});

		$(".table-box").Validform({
			btnSubmit: ".btns-group .save",
			tiptype:2,
			datatype: {
				"date": /^\d{4}\-\d{2}\-\d{2}$/
			},
			beforeSubmit:function(curform){

				var arr = [
						"userEmail",
						"userMobilePhone",
						"userJobNumber",
						"userWorkYear",
						"userJob",
						"userEdu",
						"userPoliticsStatus",
						"userAddress",
						"userHobby",
						"userBirthday"
					],
					userSex = "",
					sendData = getValData({
						ele: ".table-box",
						arr:arr
					});
				/**
				 * @see 获得性别
				 * @return String
				 */
				function getRadioVal(name){
					var value="";
					var radio=$('.table-box [name="'+ name +'"]');
					for(var i=0; i<radio.size(); i++){
						if(radio[i].checked === true){
							value=radio[i].value;
							break;
						}
					}
					return value;
				}
				sendData.userSex = getRadioVal("userSex");
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "general/user/updatePreInfo",
					data: sendData,
					dataType: "json",
					success: function(msg)
					{
						if (msg && msg.success === 0)
						{
							window.location.reload();
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
