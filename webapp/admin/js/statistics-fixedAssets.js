/**
 * 本文件是固定资产价值、数量统计js文件
 * @ author 王步华
 */
(function($, w, d){
	'use strict';
	$(function(){
		var sendData = {};
		/*资产分类*/
		window.setTree({
			url: ajaxUrl + "project/subProject/findTree",
			type: "POST",
			data: {id: 0},
			id: "id",
			value: "equipmentNameStr",
			all: "全部",//是否有所有这一级
			treeClick: function ()
			{
				var _this = $(this),
					id = _this.parents("li").eq(0).attr("treeId"),
					equipmentId = "";
				if (_this.hasClass("all"))
				{
					equipmentId = _this.parents("li").eq(0).attr("allId");
				}
				else
				{
					equipmentId = id;
				}
				$(".parentId").attr({"parentId": equipmentId});
			}
		});

		/*
		 *增值税率
		 */
		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "general/dictionary/findDictionary",
			data: {
				dictCode:"ZCWZ"
			},
			dataType: "json",
			success: function (msg) {
				if(msg && msg.success === 0) {
					var nameMsg = msg.data,
						msgHtml="";
					for(var i=0; i<nameMsg.length; i++){
						msgHtml += '<option value="'+nameMsg[i].dictCodeValue+'">'+nameMsg[i].dictCodeName+'</option>'
					}
					$(".assetPosition").append(msgHtml);

				}
			}
		});

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
				url: window.ajaxUrl + "project/statistics/findAssetsCount",
				data: sendData,
				dataType: "json",
				method: "GET",
				success: function (data) {
					if(data.success == 0){
						layer.close(loading);
						LineGraph(data);
					}
				}
			});
		}
		/*
		 * *图表渲染
		 * */
		function LineGraph(data){
			var myChart1 = echarts.init(document.getElementById('echarts-content'));
			var axisLabel1 = {
					formatter: '{value} 元'
				},
				axisLabel2 = {
					formatter: '{value} 个'
				},
			option1 = {
				title : {
					text: '固定资产价值、数量统计',
					x: 'center',
					align: 'right'
				},
				grid: {
					top:'13%',
					left: '3%',
					right: '4%',
					bottom: '20%',
					containLabel: true
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						crossStyle: {
							color: '#999'
						}
					}
				},
				legend: {
					x:'center',
					y:'5%',
					data:[]
				},
				xAxis: [
					{
						type: 'category',
						data: [],
						axisPointer: {
							type: 'shadow'
						}
					}
				],
				yAxis: [
					{
						type: 'value',
						name: '',
						min: '',
						max: '',
						minInterval:''
					}
				],
				series: [

				]
			};
			if(data.series.length>0){
				option1.legend.data = data.legend.data;
				option1.xAxis[0].data = data.xAxis;
				var objsrc = [];
				for(var x=0; x<data.yAxis.length; x++){
					data.yAxis[x].type = 'value',
						data.yAxis[x].name = data.yAxis[x].name,
						data.yAxis[x].min = 0,
						data.yAxis[x].max = data.yAxis[x].max,
						data.yAxis[x].minInterval = data.yAxis[x].minInterval,
						data.yAxis[0].axisLabel = axisLabel1,
						data.yAxis[1].axisLabel = axisLabel2
					objsrc.push(data.yAxis[x]);
				}
				option1.yAxis = objsrc;
				var tmp = [];
				for(var i=0; i<data.series.length; i++){
					data.series[i].name = data.series[i].name;
					data.series[i].type = data.series[i].type;
					data.series[i].data = data.series[i].data;
					data.series[i].yAxisIndex = data.series[i].yAxisIndex;
					tmp.push(data.series[i]);
				}
				option1.series = tmp;
				myChart1.setOption(option1);
			}else{
				myChart1.showLoading({
					text : '暂无数据',
					effect : 'bubble',
					textStyle : {
						fontSize : 30
					}
				});
			}
		}
		sendData = {
			parentId:$(".parentId").attr("parentId"),
			dictCodeValue: $('.assetPosition option:selected').val()
		}
		getLineGraph(sendData);
		/*
		 * 按钮区查询事件
		 */
		//查询
		function findList()
		{
			var dictCodeValue = $('.assetPosition option:selected').val();
			var parentId = "";
			var paren = $(".parentId").val()
			if(paren ==="全部"){
				parentId = "";
			}else{
				parentId = $(".parentId").attr("parentId");
			}


			getLineGraph({parentId: parentId,dictCodeValue:dictCodeValue})
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