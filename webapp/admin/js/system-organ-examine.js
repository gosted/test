/**
 * 本文件的功能是机构详情页面js文件
 *@ author 陈安
 */

(function($, w, d){
	'use strict';
	
	$(function() {
		var id = decodeURI(location.href).split("?")[1].split("&")[0].split("=")[1];
		var table = $(".table");
		window.getTd(table);
		(function(id)
		{
			$.myAjax({
				type:"POST",
				url:window.ajaxUrl + "general/unit/findById",
				data:{id:id},
				success:function(msg)
				{
					if(msg.success === 0 && msg.data)
					{
						var obj = msg.data;
						$.each(obj, function(i,v) {
							$("[con_name="+i+"]").html(v);
							if(i == "unitState")
							{
								if(v == 0)
								{
									$("[con_name="+i+"]").html("启用");
								}
								else if( v == 1)
								{
									$("[con_name="+i+"]").html("禁用");
								}
							}
							else if(i == "unitParentId")
							{
								var arr = obj.unitNameStr.split("/");
								arr.pop();
								$("[con_name="+i+"]").html(arr.join("/"));
							}
							else if(i == "unitAreaId")
							{
								$("[con_name="+i+"]").html(obj.unitAreaName);
							}
						});
					}
				}
			})
		}(id));
	});
}(jQuery, window, document));
