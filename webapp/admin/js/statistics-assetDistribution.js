/**
 * 本文件是全国资产分布统计js文件
 * @ author 王步华
 */
(function($, w, d){
	'use strict';
	$(function(){
		var sendData = {},
			boxList = "";
		$(".bombBox").hide();
		/*
		 * *图表数据请求
		 * */
		function assChinaDist(sendData){
			var loading = "";
			loading = layer.msg('请稍后', {
				time: 0,
				icon: 16,
				shade: 0.1
			});
			$.ajax({
				url: window.ajaxUrl + "project/statistics/findAssetMap",
				data: sendData,
				dataType: "json",
				method: "GET",
				success: function (data) {
					if(data.success == 0){
						layer.close(loading);
						mapOfChina1(data);
					}
				}
			});
		}
		/*
		 * *图表渲染
		 * */
		function mapOfChina1(data){
			var myChart6 = echarts.init(document.getElementById('echarts-content'));
			myChart6.on('click', function (param) {
				console.log(param.data.id)
				console.log(param)
				bombBox(param.data.id);
			})
			var label = {
				normal: {
					show: true
				},
				emphasis: {
					show: true
				}
			},
			option6 = {
				title: {
					text: '全国资产分布统计',
					left: 'center'
				},
				tooltip: {
					trigger: 'item',
					formatter: function(params) {
						var res = params.name+'<br/>';
						var myseries = option6.series;
						for (var i = 0; i < myseries.length; i++) {
							res+= myseries[i].name;
							for(var j=0;j<myseries[i].data.length;j++){
								if(myseries[i].data[j].name==params.name){
									res+=' : '+myseries[i].data[j].value+'</br>';
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
					color: ['#006edd', '#e0ffff'],
					calculable: true
				},
				series: [

				]
			};
			if(data.series.length>0){
				option6.legend.data = data.legend.data;
				var tmp = [];
				for(var i=0; i<data.series.length; i++){
					data.series[i].type = "map";
					data.series[i].mapType = "china";
					data.series[i].label = label;
					data.series[i].name = data.series[i].name;
					data.series[i].data = data.series[i].data;
					if(data.series[i].name == "室内AP"){
						data.series[i].roam = "false";
					}
					tmp.push(data.series[i]);
				}
				option6.series = tmp;
				myChart6.setOption(option6);
			}else{
				myChart6.showLoading({
					text : '暂无数据',
					effect : 'bubble',
					textStyle : {
						fontSize : 30
					}
				});
			}
		}

		sendData = {
			classification:$(".assetClassification").val(),
			position: $(".assetPosition").val()
		}
		assChinaDist(sendData);

		function bombBox(data) {
			$.ajax({
				url: window.ajaxUrl + "project/statistics/findEquipmentByAreaId",
				data: {areaId:data},
				dataType: "json",
				method: "GET",
				success: function (data) {
					if (data.success == 0) {
						var resultList = data.data;
						$(".bombBox").show();
						boxList="";
						$.each(resultList,function(i,v){
							boxList += '<tr>'+
							 '<th>'+v.name+'</th>'+
							 '<th>'+ v.value+'</th>'+
							 '</tr>'
						})
						$(".tbody").html(boxList);
					}
				}
			});
		}
	})
}(jQuery, window, document));