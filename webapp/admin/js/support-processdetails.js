/**
 * 本文件的流程详情页js文件
 *@ author 陈安
 */

(function($, w, d){
	'use strict';

	$(function() 
	{
		var reqId = parent.window.layerViewData.reqId,
        taskId = parent.window.layerViewData.taskId,
        processInstanceId = parent.window.layerViewData.processInstanceId;
        var img = $("#img").find("img");
        img.attr("src",window.ajaxUrl + "preSupport/workFlow/graphHistoryProcessInstance?processInstanceId="+processInstanceId+"");
        
		$.myAjax(
		{
			type:"POST",
			url:window.ajaxUrl + "preSupport/workFlow/viewHistory",
			data:{"processInstanceId":processInstanceId},
			success:function(data)
			{
				if(data.success == 0)
				{
					var list = data.data.historicTasks;
					$.each(list, function(i,v) 
					{
						if(v.owner === null)
						{
							var str = "<td title='"+v.name+"'>"+v.name+"</td><td title='"+(v.startTime==null?"":window.formatDateTimesec(new Date(v.startTime)))+"'>"+(v.startTime==null?"":window.formatDateTimesec(new Date(v.startTime)))+"</td><td title='"+(v.endTime==null?"":window.formatDateTimesec(new Date(v.endTime)))+"'>"+(v.endTime==null?"":window.formatDateTimesec(new Date(v.endTime)))+"</td><td title='"+(v.assignee==null?"":v.assignee)+"'>"+(v.assignee==null?"":v.assignee)+"</td><td title='"+(v.deleteReason==null?"":v.deleteReason)+"'>"+(v.deleteReason==null?"":v.deleteReason)+"</td>"
						}
						else
						{
							var str = "<td title='"+v.name+"'>"+v.name+"</td><td title='"+(v.startTime==null?"":window.formatDateTimesec(new Date(v.startTime)))+"'>"+(v.startTime==null?"":window.formatDateTimesec(new Date(v.startTime)))+"</td><td title='"+(v.endTime==null?"":window.formatDateTimesec(new Date(v.endTime)))+"'>"+(v.endTime==null?"":window.formatDateTimesec(new Date(v.endTime)))+"</td><td title='"+(v.assignee==null?"":v.assignee+"(原受理人:"+v.owner+")")+"'>"+(v.assignee==null?"":v.assignee+"(原受理人:"+v.owner+")")+"</td><td title='"+(v.deleteReason==null?"":v.deleteReason)+"'>"+(v.deleteReason==null?"":v.deleteReason)+"</td>"
						}
						if(i%2 == 0)
						{
							str = "<tr class='text-c' style='background:#fff'>"+str+"</tr>"
						}
						else
						{
							str = "<tr class='text-c' style='background:#eee'>"+str+"</tr>"
						}
						$(".dosptMdlPro_main_content_list").append(str);
						
					});
				}
			}
		});
	});
}(jQuery, window, document));
