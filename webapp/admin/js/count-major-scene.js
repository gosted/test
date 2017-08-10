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
		        url: window.ajaxUrl + "preSupport/statistics/findImportant",
		        data: obj,
		        dataType: "json",
		        method: "GET",
		        success: function (data) {
		        	if(data.success == 0){
						layer.close(loading);
		        		PieChartSL(data);
						PieChartSR(data);
		        	}
		        }
		    });
		}
		function PieChartSL(data){
			var myChart5 = echarts.init(document.getElementById('echarts-content-left')),
			option5 = {
				title : {
					text: '重大项目',
					x:'center'
				},
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					left: 'left',
					top:'10%',
					data: []
				},
				series : [
					{
						name: '',
						type: 'pie',
						radius : '50%',
						center: ['50%', '60%'],
						data:[
							{value:'', name:''}
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						},
						lableLine:{
							normal:{
								show:true,
								length:'3',
								length2:'2'
							}
						}
					}
				]
			};
			if(data.success == 0){
				option5.legend.data = data.important.legend.data;
				option5.series[0].data = data.important.series;
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
		};

		function PieChartSR(data){
			var myChart5 = echarts.init(document.getElementById('echarts-content-right')),
				option5 = {
					title : {
						text: '现场支撑',
						x:'center'
					},
					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						top:'10%',
						data: []
					},
					series : [
						{
							name: '',
							type: 'pie',
							radius : '50%',
							center: ['50%', '60%'],
							data:[
								{value:'', name:''}
							],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},
							lableLine:{
								normal:{
									show:true,
										length:'3',
										length2:'2'
								}
							}
						}
					]
				};
			if(data.success == 0){
				option5.legend.data = data.support.legend.data;
				option5.series[0].data = data.support.series;
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
		}


		var obj = {"ele":$(".areas-search"),"fn":getPieChartS};
		areaShow(obj);
	})
}(jQuery, window, document));