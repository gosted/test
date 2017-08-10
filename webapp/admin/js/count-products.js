(function($, w, d){
	'use strict';
	$(function(){
		function getPieChartS(obj){
			var loading = "";
			loading = layer.msg('请稍后', {
				time: 0,
				icon: 16,
				shade: 0.1
			});
			$.myAjax({
				url: window.ajaxUrl + "preSupport/statistics/findProducts",
		        data: obj,
		        dataType: "json",
		        method: "GET",
		        success: function (data) {
		        	if(data.success == 0){
						layer.close(loading);
		        		PieChartS(data);
		        	}
		        }
		    });
		}
		function PieChartS(data){
			var myChart5 = echarts.init(document.getElementById('echarts-content')),
			label = {
				normal: {
					show: true,
					position: 'insideRight'
				}
			},
			itemStyle = {
				normal:{color:''}
			},
			colorArr = ["#9bc5ff"],
			option5 = {
				tooltip : {
					trigger: 'axis',
					axisPointer : {            // 坐标轴指示器，坐标轴触发有效
						type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					selected:{},
					data: []
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '20%',
					containLabel: true
				},
				xAxis:  {
					type: 'category',
					axisLabel:{
						interval:0,
						rotate:45,
						margin:2,
						textStyle:{
							color:"#222"
						}
					},
					data: []
				},
				yAxis: [
					{
						type: 'value',
						name: '产品数',
						min: 0,
						max: 15,
						interval: 5
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
				series: [
					{
						name: '',
						type: 'bar',
						data: []
					}
				]
			};
			if(data.success == 0){
				option5.legend.data = data.legend.data;
				option5.xAxis.data = data.xAxis;
				var objsrc = [];
				for(var x=0; x<data.yAxis.length; x++){
					data.yAxis[x].type = 'value',
					data.yAxis[x].name = data.yAxis[x].name,
					data.yAxis[x].min = 0,
					data.yAxis[x].max = data.yAxis[x].max,
					data.yAxis[x].interval = 5
					objsrc.push(data.yAxis[x]);
				}
				option5.yAxis = objsrc;
				var tmp = [];
				for(var i=0; i<data.series.length; i++){
					data.series[i].name = data.series[i].name;
					data.series[i].type = data.series[i].type;
					data.series[i].data = data.series[i].data;
					tmp.push(data.series[i]);
				}
				option5.series = tmp;
				myChart5.setOption(option5);
			}else{
				myChart5.showLoading({
					text : '暂无数据',
					effect : 'bubble',
					textStyle : {
						fontSize : 30
					}
				});
			}

			myChart5.on("legendselectchanged",function(params){
				var arr=[];
				$.each(params.selected,function(k,v){
					arr.push(v);
				})
				if(arr.indexOf(true) == -1){
					option5.legend.selected[params.name] = true;
					myChart5.clear();
					myChart5.setOption(option5);
				}
			});
		}

		var obj = {"ele":$(".areas-search"),"fn":getPieChartS};
        areaShow(obj);
	})
}(jQuery, window, document));