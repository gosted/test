/**
 * 本文件是项目分布统计js文件
 * @ author 王步华
 */
(function($, w, d){
	'use strict';
	$(function(){
		var sendData = {};
		/*
		 * *图表数据请求
		 * */
		function proChinaDist(sendData){
			var loading = "";
			loading = layer.msg('请稍后', {
				time: 0,
				icon: 16,
				shade: 0.1
			});
			$.myAjax({
				url: window.ajaxUrl + "project/statistics/findStatisticsProject",
				data: sendData,
				dataType: "json",
				method: "GET",
				success: function (data) {
					if(data.success == 0){
						layer.close(loading);
						mapOfChina(data);
					}

				}
			});
		}
		/*
		 * *图表渲染
		 * */
		function mapOfChina(data){
			var myChart5 = echarts.init(document.getElementById('echarts-content'));
			var label = {
				normal: {
					show: true
				},
				emphasis: {
					show: true
				}
			},
			option5 = {
				title: {
					text: '全国项目统计',
					left: 'center'
				},
				tooltip: {
					trigger: "item",
					formatter: function(params) {
						var res = params.name+"<br/>";
						var myseries = option5.series;
						for (var i = 0; i < myseries.length; i++) {
							res+= myseries[i].name;
							for(var j=0;j<myseries[i].data.length;j++){
								if(myseries[i].data[j].name==params.name){
									res+=" : "+myseries[i].data[j].value+"</br>";
								}
							}
						}
						return res;
					}
				},
				legend: {
					orient: 'vertical',
					left: 'left',
					data:[]
				},
				visualMap: {
					min: 0,
					max: 2500,
					left: 'left',
					top: 'bottom',
					text: ['高','低'],           // 文本，默认为数值文本
					calculable: true
				},
				series: [

				]
			};
			if(data.series.length>0){
				option5.legend.data = data.legend.data;
				var tmp = [];
				for(var i=0; i<data.series.length; i++){
					data.series[i].type = "map";
					data.series[i].mapType = "china";
					data.series[i].label = label;
					data.series[i].name = data.series[i].name;
					data.series[i].data = data.series[i].data;
					if(data.series[i].name == "租赁类项目"){
						data.series[i].roam = "false";
					}
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
		}

		sendData = {
			startDate:$(".startDate").val(),
			endDate: $(".endDate").val()
		}
		proChinaDist(sendData);

		/*
		 * 按钮区查询事件
		 */
		//查询
		function findList()
		{
			var startDate = $(".startDate").val();
			var endDate = $(".endDate").val();

			proChinaDist({startDate: startDate,endDate:endDate})
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