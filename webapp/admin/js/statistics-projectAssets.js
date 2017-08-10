/**
 * 本文件是项目资产统计js文件
 * @ author 王步华
 */
(function($, w, d){
	'use strict';
	$(function(){
		var sendData = {},
			areaId = "";

		$.myAjax({
			type: "POST",
			url: window.ajaxUrl + "project/project/findProjectAll",
			data: {},
			dataType: "json",
			success: function (msg) {
				if(msg && msg.success === 0) {
					var nameMsg = msg.data,
						msgHtml="";
					for(var i=0; i<nameMsg.length; i++){
						msgHtml += '<option value="'+nameMsg[i].id+'">'+nameMsg[i].projectName+'</option>'
					}
					$(".Project").append(msgHtml);
				}
			}
		});
		$('[con_name="Project"]').on("change", function ()
		{
			var Project = $(this).val();
			$.myAjax({
				type: "POST",
				url: window.ajaxUrl + "project/workSite/findByProjectId",
				data: {projectId:Project},
				dataType: "json",
				success: function (msg) {
					if(msg && msg.success === 0) {
						var nameMsg = msg.data,
							Html="";
						$(".site").html("");
						for(var i=0; i<nameMsg.length; i++){
							Html += '<option value="'+nameMsg[i].id+'">'+nameMsg[i].worksiteName+'</option>'
						}
						$(".site").append(Html);

					}
				}
			});
		});

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
		 * *图表数据请求
		 * */
		function assetStat(sendData){
			var loading = "";
			loading = layer.msg('请稍后', {
				time: 0,
				icon: 16,
				shade: 0.1
			});
			$.myAjax({
				url: window.ajaxUrl + "project/statistics/findProAssetsCount",
				data: sendData,
				dataType: "json",
				method: "GET",
				success: function (data) {
					if(data.success == 0){
						layer.close(loading);
						LineGraph1(data);
					}

				}
			});
		}
		/*
		 * *图表渲染
		 * */
		function LineGraph1(data){
			var myChart2 = echarts.init(document.getElementById('echarts-content'));
			var colors = ['#5793f3', '#d14a61', '#675bba'],
				axisLine1 = {
					lineStyle: {
						color: colors[0]
					}
				},
				axisLabel1 = {
					formatter: '{value} 元'
				},
				axisLine2 = {
					lineStyle: {
						color: colors[1]
					}
				},
				axisLabel2 = {
					formatter: '{value} 个'
				},
			option2 = {
				color: colors,
				title : {
					text: '项目资产统计',
					x: 'center',
					align: 'right'
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross'
					}
				},
				grid: {
					top:'12%'
				},
				legend: {
					y:"5%",
					data:[]
				},
				xAxis: [
					{
						type: 'category',
						axisTick: {
							alignWithLabel: true
						},
						data: [],
					}
				],
				yAxis: [

				],
				series: [

				]
			};
			if(data.series.length>0){
				option2.legend.data = data.legend.data;
				option2.xAxis[0].data = data.xAxis;
				var objsrc = [];
				for(var x=0; x<data.yAxis.length; x++){
					data.yAxis[x].type = 'value',
						data.yAxis[x].name = data.yAxis[x].name,
						data.yAxis[x].min = 0,
						data.yAxis[x].max = data.yAxis[x].max,
						data.yAxis[x].minInterval = true,
						data .yAxis[0].axisLine = axisLine1,
						data .yAxis[0].axisLabel = axisLabel1,
						data .yAxis[1].axisLine = axisLine2,
						data .yAxis[1].axisLabel = axisLabel2,
						objsrc.push(data.yAxis[x]);
				}
				option2.yAxis = objsrc;
				var tmp = [];
				for(var i=0; i<data.series.length; i++){
					data.series[i].name = data.series[i].name;
					data.series[i].type = data.series[i].type;
					data.series[i].data = data.series[i].data;
					data.series[i].yAxisIndex = data.series[i].yAxisIndex;
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
		}

		sendData = {
			projectId:$('.Project option:selected').val(),
			site:$('.site option:selected').val(),
			parentId :$(".parentId").attr("parentId")
		}
		assetStat(sendData);
		/*
		 * 按钮区查询事件
		 */
		//查询
		function findList()
		{
			var projectId = $(".Project").val();
			var site = $(".site").val();
			var parentId = "";
			var paren = $(".parentId").val()
			if(paren ==="全部"){
				parentId = "";
			}else{
				parentId = $(".parentId").attr("parentId");
			}

			assetStat({projectId: projectId,site:site,parentId:parentId})
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