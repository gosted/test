/**
 * 本文件是库存数量统计js文件
 * @author 张欢
 */
(function($, w, d){
	'use strict';
	$(function(){


		//库存echarts构造方法
		function StoreValueEcharts(contEcharts)
		{
			this.echartsData = {};
			this.myChart = echarts.init(contEcharts);
		}
		//设置方法
		StoreValueEcharts.prototype.setEharts = function(data)
		{
			var _option = {
				title: {
					text: '库存价值'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					}
				},
				legend: {
					data: ['资产原值', '非资产原值','资产当前值','非资产当前值','库存原值','库存当前值','资产数量','非资产数量','库存数量'],
					align: 'right',
					right: 10
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '20%',
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					data: data.storageName,
					axisTick: {
						interval: 0
					},
					axisLabel: {
						interval: 0,
						rotate: -30
					}
				}],
				yAxis: [{
					type: 'value',
					name: '价值(元)',
					axisLabel: {
						formatter: '{value}'
					}
				},{
					type: 'value',
					name: '数量',
					axisLabel: {
						formatter: '{value} '
					}
				}],
				series: [{
					name: '资产原值',
					type: 'bar',
					data: data.assetPrice
				}, {
					name: '非资产原值',
					type: 'bar',
					data: data.notAssetPrice
				}, {
					name: '资产当前值',
					type: 'bar',
					data: data.nowAssertPrice
				},{
					name: '非资产当前值',
					type: 'bar',
					data: data.nowNotAssetPrice
				}, {
					name: '库存原值',
					type: 'bar',
					data: data.oldStockPrice
				}, {
					name: '库存当前值',
					type: 'bar',
					data: data.nowStockPrice
				},{
					name: '资产数量',
					type: 'bar',
					yAxisIndex: 1,
					data: data.assetNum
				}, {
					name: '非资产数量',
					type: 'bar',
					yAxisIndex: 1,
					data: data.notAssetNum
				}, {
					name: '库存数量',
					type: 'bar',
					yAxisIndex: 1,
					data: data.stockNum
				}]
			};
			this.myChart.setOption(_option);
			this.echartsData = data;
		};
		var strCntEhrts = new StoreValueEcharts(document.querySelector('#echarts-content'));
		//查询方法
		function find(first)
		{
			var sendData = {};
			var checkboxs = $('.search-area input[type="checkbox"]');
			var ids = '';
			var ATmp = [];
			$.each(checkboxs, function(i, v)
			{
				if(v.checked === true){
					ATmp.push(v.value);
				}
			});
			sendData.ids = ATmp.join();
			if (first)
			{
				sendData.ids = '';
			}
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "project/statistics/findStock",
				data: sendData,
				success: function (data)
				{
					if (data && data.success === 0)
					{
						strCntEhrts.setEharts(data.data);
					}
				}
			});
		}

		//请求库房
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "operation/storage/findNoRole",
			data: {},
			success: function (data)
			{
				if (data && data.success === 0)
				{
					find(true);
					var storeRoom = $('.store-room');
					data.data.forEach(function(val,ind,arr)
					{
						var SLabel = '<label class="l mr-20">'+
							'<input type="checkbox" checked value="'+ val.id +'">'+
							val.storageName + '</label>';
						storeRoom.append(SLabel);
					});
				}
			}
		});
		$('.search-area').on('click', 'input[type="checkbox"]', function()
		{
			find();
		});
	})
}(jQuery, window, document));