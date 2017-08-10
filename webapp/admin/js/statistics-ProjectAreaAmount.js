/**
 * 本文件是项目地区金额统计js文件
 * @ author 王步华
 */
(function($, w, d){
	'use strict';
	$(function(){
		var sendData = {};
		/*
		 * *图表数据请求
		 * */
		function areaStat(sendData){
			var loading = "";
			loading = layer.msg('请稍后', {
				time: 0,
				icon: 16,
				shade: 0.1
			});
			$.myAjax({
				url: window.ajaxUrl + "project/statistics/findStatisticsProjectMoney",
				data: sendData,
				dataType: "json",
				method: "GET",
				success: function (data) {
					if(data.success == 0){
						layer.close(loading);
						LineGraph2(data);
					}

				}
			});
		}
		/*
		 * *图表渲染
		 * */
		function LineGraph2(data){
			var myChart3 = echarts.init(document.getElementById('echarts-content'));
			var bcBySeriesIndex = ['收入', '收入', '收入', '收入','支出', '支出', '支出', '支出', '折旧支出', '折旧支出', '折旧支出', '折旧支出'],
				label = {
					normal: {
						show: true,
						position: 'top',
						formatter: '',
						textStyle: {
							color: '#333'
						}
					}
				},
			option3 = {
				title : {
					text: '项目地区金额统计',
					x: 'center',
					align: 'right'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					},
					formatter: function(params) {
						var html = [];
						var category = {};
						echarts.util.each(params, function(param) {
							var catName = param.seriesName;
							var bc = bcBySeriesIndex[param.seriesIndex];
							if (!category[catName]) {
								category[catName] = {};
							}
							category[catName][bc] = param.value;
						});
						echarts.util.each(category, function(cate, key) {
							html.push(
								'<tr>',
								'<td>', key, '</td>',
								'<td>', cate.收入, '</td>',
								'<td>', cate.支出, '</td>',
								'<td>', cate.折旧支出, '</td>',
								'</tr>'
							);
						})

						return '<table border=1><tbody>' +
							'<tr><td></td><td>收入</td><td>支出</td><td>折旧支出</td></tr>' +
							html.join('') +
							'</tbody></table>';
					}
				},
				legend: {
					top:"5%",
					data: []
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '10%',
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					data: [],
					axisLabel:{
						interval:0,
						rotate:45,//倾斜度 -90 至 90 默认为0
						margin:2,
						textStyle:{
							color:"#000000"
						}
					},
				}],
				yAxis: [{
					type: 'value',
					name: '金额（万元）'
				}],
				series: []
			};
			if(data.series.length>0){
				option3.legend.data = data.legend.data;
				option3.xAxis[0].data = data.xAxis;
				var tmp = [];
				for(var i=0; i<data.series.length; i++){
					data.series[i].name = data.series[i].name;
					data.series[i].type = data.series[i].type;
					data.series[i].data = data.series[i].data;
					data.series[i].stack = data.series[i].stack;
					if(data.series[i].name == "其他"){
						data.series[i].label = label
					}
					tmp.push(data.series[i]);
				}
				option3.series = tmp;
				myChart3.setOption(option3);
			}else{
				myChart3.showLoading({
					text : '暂无数据',
					effect : 'bubble',
					textStyle : {
						fontSize : 30
					}
				});
			}
		}

		sendData = {
			startDate : $(".startDate").val(),
			endDate : $(".endDate").val()
		}
		areaStat(sendData);

		/*
		 * 按钮区查询事件
		 */
		//查询
		function findList()
		{
			var startDate = $(".startDate").val();
			var endDate = $(".endDate").val();

			areaStat({startDate: startDate,endDate:endDate})
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