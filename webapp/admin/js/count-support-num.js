(function($, w, d){
	'use strict';
	$(function(){
		/**
		 * 柱状图请求
		 */
		function getHistogram(obj){
			var loading = "";
			loading = layer.msg('请稍后', {
				time: 0,
				icon: 16,
				shade: 0.1
			});
			$.myAjax({
				url: window.ajaxUrl + "preSupport/statistics/findSupport",
				data: obj,
				dataType: "json",
				method: "GET",
				success: function (data) {
					if(data.success == 0){
						layer.close(loading);
						Histogram(data);
					}
				}
			});
		}
		/*
		 * 构建柱状图
		 */
		function Histogram(data){
			var myChart2 = echarts.init(document.getElementById('echarts-content')),
			option2 = {
				tooltip : {
					trigger: 'axis',
					axisPointer : {            // 坐标轴指示器，坐标轴触发有效
						type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					selected:{},
					data:[]
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '22%',
					containLabel: true
				},
				xAxis : [
					{
						type : 'category',
						axisLabel:{
							interval:0,
							rotate:45,
							margin:2,
							textStyle:{
								color:"#222"
							}
						},
						data : []
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				/*dataZoom: [
					{
						type: 'slider',
						show: true,
						xAxisIndex: [0],
						start: 1,
						end: 50,
					},
					{
						show: false,
						yAxisIndex: 0,
						filterMode: 'filter',
						width: 30,
						height: '80%',
						showDataShadow: false,
						left: '93%'
					}
				],*/
				series : [
					{
						name:'',
						type:'',
						data:[]
					},
				]
			};
			if(data.series.length>0){
				option2.legend.data = data.legend.data;
				option2.xAxis[0].data = data.xAxis;
				var tmp = [];
				for(var i=0; i<data.series.length; i++){
					data.series[i].type="bar";
					data.series[i].name = data.series[i].name;
					data.series[i].data = data.series[i].data;
					tmp.push(data.series[i]);
				}
				option2.series = tmp;
				myChart2.setOption(option2);
			}else{
				myChart2.showLoading({
					text : '暂无数据',
					effect : 'bubble',
					textStyle : {
						fontSize : 30
					}
				});
			}

			myChart2.on("legendselectchanged",function(params){
				var arr=[];
				$.each(params.selected,function(k,v){
					arr.push(v);
				})
				if(arr.indexOf(true) == -1){
					option2.legend.selected[params.name] = true;
					myChart2.clear();
					myChart2.setOption(option2);
				}
			});
		}

		var obj = {"ele":$(".areas-search"),"fn":getHistogram};
		areaShow(obj);
	})
}(jQuery, window, document));