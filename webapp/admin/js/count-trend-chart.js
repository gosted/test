(function($, w, d){
    'use strict';
    $(function(){
        /*
         * 折线图请求
         */
        function getLineGraph(obj){
            var loading = "";
            loading = layer.msg('请稍后', {
                time: 0,
                icon: 16,
                shade: 0.1
            });
            $.myAjax({
                url: window.ajaxUrl + "preSupport/statistics/findSupportTrend",
                data: obj,
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
         * 折线图图表
         */
        function LineGraph(data){
            var myChart4 = echarts.init(document.getElementById('echarts-content')),
            chartAttr = {
                itemStyle:{
                    normal:{
                        color: "",//图标颜色
                        label : {
                            show: true,
                            position: 'right'
                        } //节点数据展示
                    }
                },
                lineStyle:{
                    normal:{
                        color: ""  //连线颜色
                    }
                }
            },
            colorArr = ["#9bc5ff"],
            option4 = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    selected:{},
                    data:[]
                },
                grid:{
                    x:80,
                    y:50,
                    x2:80,
                    y2:80
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
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
                yAxis: {
                    type: 'value',

                },
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
                        type:'line',
                        data:[],
                    }
                ]
            };
            if(data.success == 0){
                option4.legend = data.legend;
                option4.xAxis.data = data.xAxis.data;
                var tmp = [];
                for(var i=0;i<data.series.length;i++){
                    data.series[i]["name"] = data.series[i].name;
                    data.series[i]["type"] = "line";
                    data.series[i]["data"] = data.series[i].data;
                    chartAttr.itemStyle.normal.color = colorArr[i];
                    chartAttr.lineStyle.normal.color = colorArr[i];
                    data.series[i]["itemStyle"] = chartAttr.itemStyle;
                    data.series[i]["lineStyle"] = chartAttr.lineStyle;
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

            myChart4.on("legendselectchanged",function(params){
                var arr=[];
                $.each(params.selected,function(k,v){
                    arr.push(v);
                })
                if(arr.indexOf(true) == -1){
                    option4.legend.selected[params.name] = true;
                    myChart4.clear();
                    myChart4.setOption(option4);
                }
            });
        }

        var areaObj = {"ele":$(".areas-search"),"fn":getLineGraph};
        var proObj = {"ele":$(".products-areas"),"fn":getLineGraph};
        areaShow(areaObj);
        proShow(proObj);
    })
}(jQuery, window, document));
