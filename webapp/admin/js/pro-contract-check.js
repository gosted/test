/**
 * 本文件是合同查看页js文件
 * @author 彭佳明
 */

(function($, w, d){
	'use strict';

	$(function() {
		var id = window.parent.layerViewData.contractId,
			tables = $(".table-box>.form-table"),
			areaId = "";
		window.getTd(tables);

		//请求合同原有信息
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "project/contract/findById",
			data: {id: id},
			dataType: "json",
			success: function(data)
			{
				if (data && data.success === 0)
				{
					var _data = data.data;
					var arr = [
							"contractName",
							"contractCode",
							"contractA",
							"contractB",
							"contractAmont",
							"contractClassify",
							"contractInitiateUnits",
							"contractInitiator",
							"projectId",
							"contractState",
							"contractIntro"

					];
					$.each(arr, function (i, v)
					{
						var keyVal = _data[v];

						if (!(keyVal === null || keyVal === ""))
						{
							$('[con_name="'+ v +'"]').val(keyVal);
						}
					});
                    var signTime = new Date(_data.contractSigntime);
                    var contractEstimated = new Date(_data.contractEstimated);
                    $('[con_name="contractSigntime"]').val(window.formatDate(signTime));
                    $('[con_name="contractEstimated"]').val(window.formatDate(contractEstimated));

					/*var str = null,
						flagSave = false;
					var list = data.data.contractCustom;
                    if(list!=null){
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
                            $(".addSelf").find(".selfTr").before(str)
                        }
                    }*/
					$('[con_name="explain"]').keyup();
				}
			}
		});
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "project/contract/findDetail",
            data: {contractId:id},
            dataType: "json",
            success: function(msg)
            {
                if (msg && msg.success === 0)
                {
                    var detailList = msg.data,STr = null,flagSave = true;
                    if(detailList!=null){
                        $.each(detailList, function (i, v)
                        {
							for(var key in v){
								if(v[key] == null){
									v[key] = "";
								}
							}
                            var Id = v.id,
                                view=$('<a  style="text-decoration:none" class="ml-5"  href="pro-manage-edit.html"></a>');
                            STr = $('<tr class="text-c tableCenter" listId="'+ Id+'"></tr>');//一行)
                            STr.append($('<td></td>').append($("<div class='needChoose change widthChange' style='background:#ddd;'></div>").text(v.detailType)));
							STr.append($('<td></td>').append($("<div class='needChoose change widthChange' style='background:#ddd;'></div>").text(v.detailName)));
							STr.append($('<td></td>').append($("<div class='needChoose change widthChange' style='background:#ddd;'></div>").text(v.equipmentId)));
							STr.append($('<td></td>').append($("<div class='needChoose change widthChange' style='background:#ddd;'></div>").text(v.detailModel)));
							STr.append($('<td></td>').append($("<div class='needChoose change widthChange' style='background:#ddd;'></div>").text(v.detailCompany)));
							STr.append($('<td></td>').append($("<div class='needChoose change widthChange' style='background:#ddd;'></div>").text(v.detailUnit)));
							STr.append($('<td></td>').append($("<div class='needChoose change widthChange' style='background:#ddd;'></div>").text(v.detailPrice)));
							STr.append($('<td></td>').append($("<div class='needChoose change widthChange' style='background:#ddd;'></div>").text(v.detailCount)));
							STr.append($('<td></td>').append($("<div class='needChoose change widthChange' style='background:#ddd;'></div>").text(v.detailTotal)));
							STr.append($('<td></td>').append($("<div class='needChoose change widthChange' style='background:#ddd;'></div>").text(v.detailRemark)));

                            var tmpBtn = '<td class="btns">';
                            tmpBtn += '<a href="javascript:;" class="edit"><i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i></a>' +
								'<a href="javascript:;" class="del"><i class="Hui-iconfont" title="删除">&#xe609;</i></a>' +
                                '</td>';

                            $(".tableList").find(".listTr").before(STr);

                            $(".del").on("click",function(){
                                var _this = $(this);
                                var id = $(this).parent().parent().attr("id");
                                layer.confirm("确定要删除吗？", {
                                        shade: 0.1,
                                        btn: ['确定', '取消'] //按钮
                                    },
                                    function() {
                                        _this.parents("tr").remove("");
										$.myAjax({
											type: "POST",
											url: window.ajaxUrl + "project/contract/update",
											data: {id:id},
											dataType: "json",
											success: function(msg)
											{
												if (msg && msg.success === 0)
												{
													layer.msg('已删除', {time:1200});
												}
											}
										});
                                        $(".layui-layer-shade").hide();
                                        $(".layui-layer").hide();
                                    },
                                    function() {
                                    })
                            });
							$(".edit").off("click").on("click", function() { //点击编辑

								var _this = $(this);
									if(flagSave) {
										$(this).html('<i class="Hui-iconfont" title="保存">&#xe632;</i>');

										_this.parents("tr").find(".change").css({
											"border": "1px solid #006BFF",
											"background":"#fff",
											"z-index":1000000
										});
										_this.parents("tr").find(".change").attr("contenteditable", "true");

										flagSave = false;
									} else {
										_this.html('<i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i>');

										_this.parents("tr").find(".change").css({
											"border": "1px solid rgb(238,238,238)",
											"background":"#ddd",
											"z-index":10000
										});
										_this.parents("tr").find(".change").removeAttr("contenteditable", "true");
										flagSave = true;
									}

							});

                        });
                    }
                }
            }
        });
		window.change = function(){
			$(".tbody").find($(".widthChange")).each(function(i,o){
				var width = $(this).width();
				$(this).parent("td").css({position:"relative",width:width+"px"});
				$(this).addClass("text-change").css({"margin-left":-width/2+"px",height:"22px"});
			});
			$(".tbody").on("focus",".change",function(){
				var width = $(this).width();
				$(this).removeClass("text-over");
				$(this).css({height:"auto"});
				$(this).parent("td").css({position:"relative",width:width+"px"});
				$(this).addClass("text-change").css({"margin-left":-width/2+"px"});
				if($(this).attr("title")){
					$(this).text($(this).attr("title"));
				}else{}
			});
			$(".tbody").on("blur",".change",function(){
				$(this).css({height:"22px"});
				$(this).attr("title",$(this).text());
				$(this).addClass("text-over");
			});
		};
		change();
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
		addTable($(".addSelf"),$(".selfTr"), $(".selfBtn"));
		addTable($(".tableList"),$(".listTr"), $(".btnList"));
		$(".table-box").Validform({
			btnSubmit: ".save",
			tiptype:2,
			datatype: {
				"date": /^\d{4}\-\d{2}\-\d{2}$/,
				"phone": /^((\d{3,4}\-)|)\d{7,8}(|([-\u8f6c]{1}\d{1,5}))$/,
				"Post": /^[0-9][0-9]{5}$/,
				"account":/^\d{19}$/g
			},
			beforeSubmit:function(curform){

				var arr = [
						"contractName",
						"contractCode",
						"contractA",
						"contractB",
						"contractAmont",
						"contractClassify",
						"contractInitiateUnits",
						"contractInitiator",
						"projectId",
						"contractSigntime",
						"contractEstimated"
					],
					sendData = getValData({
						ele: ".contractEdit",
						arr:arr
					});
				var arr1 = [],arr2 = [];
				var obj1 = $(".addSelf");
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
				$(".tableList").find(".listTr").find("input").each(function(i,o){
					arr2.push($(this).attr("con_name"));
				});
				var objArr = [];
				$(".tbody").find(".tableCenter").each(function(i,o){
					var hasObj = {};
					$(this).find("input").each(function(i,o){
						hasObj[arr2[i]] = $(this).val();
					});
					objArr.push(hasObj);
				});
				//sendData.contractCustom = arr1.join(",");

                sendData.id = id;
				$.myAjax({
					type: "POST",
					url: window.ajaxUrl + "project/contract/update",
					data: sendData,
					dataType: "json",
					success: function(msg)
					{
						if (msg && msg.success === 0)
						{
							layer.msg('保存成功', {time:1200});
							setTimeout(function(){
								window.parent.location.reload();
							},1200);
						}
					}
				});

                var detailList = {};
                detailList.detailList = JSON.stringify(objArr);
                detailList.id = id;
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/contract/updateDetail",
                    data: detailList,
                    dataType: "json",
                    success: function(msg)
                    {
                        if (msg && msg.success === 0)
                        {
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
