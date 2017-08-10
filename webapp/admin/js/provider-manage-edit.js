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
			url: window.ajaxUrl + "data/provider/provider-manage-edit.json",
			data: {id: id},
			dataType: "json",
			success: function(data)
			{
				if (data && data.success === 0)
				{
					var _data = data.data;
						console.log(_data);
					var 	arr = [
							"providerCode",
							"providerName",
							"cooperationType",
							"linkman",
							"products",
							"phone",
							"status",
							"linkAddress",
							"registerAddr",
							"email",
							"mailCode",
							"bank",
							"bankNum",
							"country",
							"province",
							"description"
					];
					$.each(arr, function (i, v)
					{
						var keyVal = _data[v];

						if (!(keyVal === null || keyVal === ""))
						{
							$('[con_name="'+ v +'"]').val(keyVal);
						}
					});
					$('[con_name="explain"]').keyup();
				}
			}
		});

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

		window.setTree({
			ele: ".country-tree",
			url: ajaxUrl + "data/storage/findByParentId.json",
			type: "POST",
			data: {id: 0},
			id: "id",
			value: "areaNameStr",
			treeClick: function ()
			{
				var _this = $(this);
				id = _this.parents("li").eq(0).attr("treeId");
				console.log(id);
				if (_this.hasClass("all"))
				{
					areaId = _this.parents("li").eq(0).attr("allId");
				}
				else
				{
					areaId = id;
				}
			}
		});
		$(".province .input-text").on("focus",function(){
			window.setTree({
				ele:".province",
				url: ajaxUrl + "data/provider/findByParentId.json",
				type: "POST",
				data: {id: id},
				id: "id",
				value: "areaNameStr",
				treeClick: function ()
				{
					var _this = $(this),
						id = _this.parents("li").eq(0).attr("treeId");
					console.log(id);
					if (_this.hasClass("all"))
					{
						areaId = _this.parents("li").eq(0).attr("allId");
					}
					else
					{
						areaId = id;
					}
				}
			});
		});
		function addTable(obj1, obj2, obj3)
		{
			var id = 0;
			obj3.on("click", function() {
				var len = obj1.find("th").size(),
					str = "", //添加input
					zStr = "", //添加一行
					flagAdd = false, //添加
					flagSave = false,
					flag = false, //储存属性对应的value值
					val = "";
				var add = true;
				obj2.find(".needChoose").each(function(i,o){
					if($(this).val()==""){
						add = false;
					}else{}
				});
				if(!add){
					flagAdd = false;
					layer.confirm("请填入必填项", {
							shade: 0.1,
							btn: ['确定'] //按钮
						},
						function() {
							$(".layui-layer-shade").hide();
							$(".layui-layer").hide();
						},
						function() {
							$(".layui-layer-shade").hide();
							$(".layui-layer").hide();
						})
				}else{
					for(var i = 0; i < len; i++) {

						if(i == len - 1) {
							str += '<td class="eidt"><a href="javascript:;" class=""><i class="Hui-iconfont changePos" title="编辑">&#xe60c;</i></a>' +
								'<a href="javascript:;" class=""><i class="Hui-iconfont" title="删除">&#xe609;</i></a></td>';
						} else {
							val = obj2.find("input").eq(i).val();

							str += '<td><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text" value="' + val + '" /></td>';
						}
						flagAdd = true;
					};
				}
				zStr = '<tr id="' + id + '" class="tableCenter">' + str + '</tr>';
				if(flagAdd) {
					obj2.after(zStr);
					obj2.find("input").val("");
					flagAdd = false;
				}
				$(".firstTr").find("input").each(function(i,o){
					if($(this).hasClass("needChoose")){
						$(".tableCenter").find("td").eq(i).find("input").addClass("needChoose");
					}
				});
				var trs = obj1.find("tr");
				obj1.find("a").eq(2).on("click", function()
				{ //点击删除
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
							var trs = obj1.find("tr");
						},
						function() {
						})
				});
				obj1.find("a").eq(1).on("click", function() { //点击编辑

					var _this = $(this),
						len = _this.parents("tr").find(".needChoose").size(),
						valAdd = "";
					for(var i = 0; i < len; i++) {
						valAdd = _this.parents("tr").find(".needChoose").eq(i).val();
						if(valAdd) {
							flag = true;
						} else {
							layer.confirm("请填入必填项", {
									shade: 0.1,
									btn: ['确定'] //按钮
								},
								function() {
									flag = false;
									$(".layui-layer-shade").hide();
									$(".layui-layer").hide();
								},
								function() {

								});
							return false;
						}
					}
					if(flag) {
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
					}
				});
			})

		}
		addTable($(".table"),$(".firstTr"), $(".addBtn"));
		$(".table-box").Validform({
			btnSubmit: ".save",
			tiptype:2,
			datatype: {
				"phone": /^((\d{3,4}\-)|)\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/,
				"Post": /^[0-9][0-9]{5}$/,
				"account":/^\d{19}$/g
			},
			beforeSubmit:function(curform){

				var arr = [
						"providerCode",
						"id",
						"providerName",
						"cooperationType",
						"linkman",
						"products",
						"phone",
						"status",
						"linkAddress",
						"registerAddr",
						"email",
						"mailCode",
						"bank",
						"bankNum",
						"country",
						"province",
						"description"
					],
					sendData = getValData({
						ele: ".table-box",
						arr:arr
					});
				var arr1 = [],sendArr = {},arr2 = [],attrArr = [];
				var obj1 = $(".addTable");
				var getAttr1 = obj1.find("th");
				obj1.find(".tableCenter").each(function(i,o)
				{
					arr1.push($(this).find("td input").eq(0).val());
					arr2.push($(this).find("td input").eq(1).val());
				});
				for(var i = 0; i < getAttr1.length - 1; i++)
				{
					attrArr.push(obj1.find("th").eq(i).attr("getAttr"))
				}
				sendArr[attrArr[0]] = arr1;
				sendArr[attrArr[1]] = arr2;
				sendData["reproperty"] = sendArr;
				console.log(sendData);
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "data/provider/provider-manage-edit.json",
					data: sendData,
					dataType: "json",
					success: function(msg)
					{
						if (msg && msg.success === 0)
						{
							window.parent.location.reload();
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
