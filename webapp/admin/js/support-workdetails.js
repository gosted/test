/**
 * 本文件的工作记录详情页js文件
 *@ author 陈安
 */

(function($, w, d){
	'use strict';

	$(function() {
		var pageSize = 10000,			//以后要动态获取到当前页面的pageSize
			pageNo = 1,
			reqId = parent.window.layerViewData.reqId,
            taskId = parent.window.layerViewData.taskId,
            processInstanceId = parent.window.layerViewData.processInstanceId;//以后要动态获取到当前页面的pageNo
		window.layerViewData = parent.window.layerViewData;		
		$.myAjax(
		{
			type:"POST",
			url:window.ajaxUrl + "preSupport/record/findPage",
			data:{"pageNo":pageNo,"pageSize":pageSize,"reqId":reqId},
			success:function(data)
			{
				if(data.success == 0)
				{
					var list = data.data.result;
					$.each(list, function(i,v) 
					{
						var _startTime = new Date(v.recordStartTime),
							_endTime =  new Date(v.recordEndTime);
						var contain = $("<tr workrecordid='"+v.id+"' data-title='查看详情' ></tr>");
						if(v.recordStartTime == null || v.recordStartTime == "")
						{
							_startTime = "";
						}
						else
						{
							_startTime = window.formatDates(_startTime);
						}
						if(v.recordEndTime == null || v.recordEndTime == "")
						{
							_endTime = "";
						}
						else
						{
							_endTime = window.formatDates(_endTime);
						}
						
						var str = "<td class='text-c'>"+(i*1+1)+"</td><td class='pl-3' title='"+v.recordSupSummary+"'><a title="+v.recordSupSummary+">"+v.recordSupSummary+"</a></td><td class='text-c' title='"+v.recordWorkload+"'>"+v.recordWorkload+"</td><td class='text-c'>"+_startTime+"</td><td  class='text-c'>"+_endTime+"</td>"
						contain.html(str);
						if(i%2 == 0)
						{
							contain.css({"background":"#ffffff"});
						}
						else
						{
							contain.css({"background":"#eee"});
						}
						$(".table").append(contain);
					});
					$("[workrecordid]").on("click",viewState)
				}
			}
		});
		function viewState()
		{
		    var _this = $(this),
		    reqState = _this.data("title");
		    window.layerViewData.workRecordId = _this.attr("workrecordid");
		    if (reqState === "查看详情")
		    {
		      layerShow("工作记录详情页","support-check-work.html");
		    }
		    else if(reqState === "流程详情页")
		    {
		        layerShow("流程详情页","support-processdetails.html");
		    }
		    else if(reqState === "备注详情页")
		    {
		        layerShow("备注详情页","support-remarkdetails.html");
		    }
		    else if(reqState === "工作记录详情页")
		    {
		        layerShow("工作记录详情页","support-workdetails.html");
		    }
		}
	});
}(jQuery, window, document));


