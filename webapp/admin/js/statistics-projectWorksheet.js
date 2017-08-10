/**
 * 本文件是项目工单统计js文件
 * @ author 王步华
 */
(function($, w, d){
	'use strict';
	$(function(){
		var sendData = {};
		/*
		* *图表数据请求
		* */
		function getLineGraph(sendData){
			var loading = "";
			loading = layer.msg('请稍后', {
				time: 0,
				icon: 16,
				shade: 0.1
			});
			$.myAjax({
				url:window.ajaxUrl + "project/statistics/findStatisticsByWorkOrderType",
				data: sendData,
				dataType: "json",
				method: "GET",
				success: function (data) {
					if(data.success == 0){
						layer.close(loading);
						LineGraph3(data);
					}
				}
			});
		}
		/*
		* *图表渲染
		* */
		function LineGraph3(data){
			var myChart4 = echarts.init(document.getElementById('echarts-content')),
			option4 = {
				title : {
					text: '工单量统计'
				},
				tooltip : {
					trigger: 'axis'
				},
				legend: {
					data:[]
				},
				calculable : true,
				xAxis : [
					{
						type : 'category',
						axisLabel:{
							interval:0,
							rotate:55,
							margin:12,
							textStyle:{
								color:"#222"
							}
						},
						data : []
					}
				],
				yAxis : [
					{
						type : 'value',
						name: '数量',
						position: 'left',
						axisLabel: {
							formatter: '{value} 个'
						}
					}
				],
				grid: { // 控制图的大小，调整下面这些值就可以，
					x: 50,
					x2: 10,
					y2: 130,// y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
				},
				series : [

				]
			};
			if(data.series.length>0){
				option4.legend.data = data.legend.data;
				option4.xAxis[0].data = data.xAxis;
				var tmp = [];
				for(var i=0; i<data.series.length; i++){
					data.series[i].name = data.series[i].name;
					data.series[i].type = data.series[i].type;
					data.series[i].data = data.series[i].data;
					data.series[i].yAxisIndex = data.series[i].yAxisIndex;
					tmp.push(data.series[i]);
				}
				option4.series = tmp;
				myChart4.setOption(option4);
			}else{
				myChart4.showLoading({
					text : '暂无数据',
					effect : 'bubble',
					textStyle : {
						fontSize : 30
					}
				});
			}
		}

		sendData = {
			projectName:$(".projectName").val()
		}
		getLineGraph(sendData);

		/*
		 * 按钮区查询事件
		 */
		//查询
		function findList()
		{
			var projectName = $(".projectName").val();
			getLineGraph({projectName: projectName})
		}
		$(".btn-find").on("click", findList);
		$(document).keyup(function(evn){
			var e = evn || window.event;
			if (e.keyCode == 13)
			{
				findList();
			}
		});

	})
}(jQuery, window, document));