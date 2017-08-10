/**
 * 本文件的功能是日志管理js文件
 * @ author 彭佳明
 */

(function($, w, d){
    'use strict';

    $(function() {
        var tbody = $(".tbody"),
            pageSize = 20,
            pageNo = 1,
            remarks="",
            sendData = {};

        /** ------------- 渲染表格方法传入请求到的数据 --------------* */
        function setTable (data)
        {
            var list = data.data.result,
                pages = data.data.pageSize, //通过后台得到每页条数
                pageCount = data.data.pageCount, //通过后台得到总页数
                pageNo = data.data.pageNo, //通过后台得到当前页
                getData = function(curr){
                    var  str = "";
                    for(var i = 0; i <list.length; i++){
                        var kogrem = list[i].logRemarks;
                        if(kogrem == null || ""){
                            remarks = "";
                        }else{
                            remarks = kogrem;
                        }
                        var logOprModuleCn = ((list[i].logOprModuleCn == null || "" || undefined) ? "" : list[i].logOprModuleCn);
                        var logOperationCn = ((list[i].logOperationCn == undefined || null || "") ? "" : list[i].logOperationCn);
                        str += "<tr class='text-c btns' reg-id="+list[i].id+">"+
                                //"<td width='25'><input type='checkbox' name='' value=''></td>"+
                            "<td>" +
                            ""+list[i].logUserName+""+
                            "</td>"+
                            "<td>" +
                            ""+window.formatDateTimes(list[i].logStartTime)+""+
                            "</td>"+
                            "<td>" +
                            ""+window.formatDateTimes (list[i].logEndTime)+""+
                            "</td>"+
                            "<td>" +
                            ""+list[i].logTimeConsuming+""+
                            "</td>"+
                            "<td class='text-l' title='"+logOprModuleCn+"'>" +
                            ""+logOprModuleCn+""+
                            "</td>"+
                            "<td>" +
                            ""+list[i].logIp+""+
                            "</td>"+
                            "<td>" +
                            ""+logOperationCn+""+
                            "</td>"+
                            "<td>" +
                            ""+list[i].logResult+""+
                            "</td>"+
                            "<td class='remar text-l' title='"+remarks+"'>"+
                            ""+remarks+""+
                            "</td>";
                    }
                    return str;
                };
            tbody.html(getData(pageNo));
            var trs = tbody.find("tr");
            for(var i=0; i<trs.length;i++){
                if(i%2 == 0){
                    trs.eq(i).css("background","#fff");
                }else{
                    trs.eq(i).css("background","#eee");
                }
            }
        }

        /*-----------------------渲染表格和分页的方法,传入要向后台传的数据--------------------*/

        function renderingPage (sendData)
        {
            /*
             * 获取表格中数据
             * */
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "general/log/findPage",
                data: sendData,
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        var pages = data.data.pageSize; //通过后台得到每页条数
                        var pageCount = data.data.pageCount; //通过后台得到总页数
                        setTable(data);
                        laypage({
                            cont: $('#pagination'),
                            pages: pageCount, //通过后台拿到的总页数
                            curr: data.data.pageNo || 1, //当前页
                            first: false,
                            last: false,
                            skip: true, //是否开启跳页
                            jump: function(obj, first){ //触发分页后的回调
                                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                                    sendData = {
                                        pageSize: pages,
                                        pageNo: obj.curr,
                                        logUserName : $(".logName").val(),
                                        logIp : $(".logIp").val(),
                                        logRemarks : $(".logRemarks").val(),
                                        logOperation : $(".logType").val(),
                                        logResult : $(".logResult").val(),
                                        logOprModule : $(".logOprModule").val(),
                                        logStartTime : $("#datemin").val(),
                                        logEndTime : $("#datemax").val()
                                    };

                                    $.myAjax({
                                        type: "POST", //此处为获取图片列表接口
                                        url: window.ajaxUrl + "general/log/findPage",
                                        data: sendData,
                                        success: function (data)
                                        {
                                            if (data && data.success === 0)
                                            {
                                                setTable(data);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        if ($('.pagination .con_much').size() === 0)
                        {
                            $('.pagination').append('<div class="con_much l">'+
                                '<span>'+
                                '每页<i class="con_list_num">20</i>条'+
                                '</span>'+
                                '<i></i>'+
                                '<ul class="clear">'+
                                '<li class="con_num_10"><span>10</span></li>'+
                                '<li class="con_num_20"><span>20</span></li>'+
                                '<li class="con_num_50"><span>50</span></li>'+
                                '<li class="con_num_100"><span100>100</span100></li>'+
                                '<li class="con_num_200"><span>200</span></li>'+
                                '<li class="con_num_1000"><span>1000</span></li>'+
                                '</ul>'+
                                '</div>');
                            $('.pagination').append("<div class='con_altogether'><span>总共<span class='allpage'>"+pageCount+"</span>页</span></div>");      //总共多少页
                        }
                        //分页结束
                        $(".allpage").html(pageCount);
                    }
                }
            });
        }

        /*每页显示多少条*/
        $(".pagination").on("click", ".con_much>i", function()
        {
            var _this = $(this),
                _ul = _this.parents(".con_much").children("ul");

            _ul.css({"display": "block"});
            return false;
        });
        $(".pagination").on("click", "ul span", function ()
        {
            var _num = Number($(this).text());
            $(".con_list_num").html(_num);
            sendData = {
                pageSize : _num,
                pageNo : pageNo,
                logUserName : $(".logName").val(),
                logIp : $(".logIp").val(),
                logRemarks : $(".logRemarks").val(),
                logOperation : $(".logType").val(),
                logResult : $(".logResult").val(),
                logOprModule : $(".logOprModule").val(),
                logStartTime : $("#datemin").val(),
                logEndTime : $("#datemax").val()
            };
            renderingPage(sendData);
           $(this).parent().parent().css({display:"none"});
            return false;
        });

        sendData = {
            pageSize:pageSize,
            pageNo:pageNo
        };
        renderingPage (sendData);
        /*----------------------------------  查询  --------------------------------*/
        function findList()
        {
            	sendData.logUserName = $(".logName").val(),
                sendData.logIp = $(".logIp").val(),
                sendData.logRemarks = $(".logRemarks").val(),
                sendData.logOperation = $(".logType").val(),
                sendData.logResult = $(".logResult").val(),
                sendData.logOprModule = $(".logModule").val(),
                sendData.logStartTime = $("#datemin").val(),
                sendData.logEndTime = $("#datemax").val();
            renderingPage (sendData);
        }
        $(".find-btn").on("click", findList);
        $(document).keyup(function(evn){
            var e = evn || window.event;
            if (e.keyCode == 13)
            {
                findList();
            }
        });
        /*----------------------------------  查询结束  --------------------------------*/

        /*
         *导出
         * */
        $(".btn-export").on("click",function(){
            var logUserName = $(".logName").val(),
                logIp = $(".logIp").val(),
                logRemarks = $(".logRemarks").val(),
                logOperation = $(".logType").val(),
                logResult = $(".logResult").val(),
                logOprModule = $(".logOprModule").val(),
                logStartTime = $("#datemin").val(),
                logEndTime = $("#datemax").val();

            if((logStartTime  !=  "" || undefined) && (logEndTime  != "" || undefined)){
                window.location.href = window.ajaxUrl + "general/log/downloadExcel?logUserName=" + logUserName+ "&logIp=" +  logIp + "&logRemarks=" +  logRemarks + "&logOperation=" +  logOperation + "&logResult=" +  logResult + "&logOprModule=" +  ((logOprModule == undefined || " ") ? "" : logOprModule) + "&logStartTime=" +  logStartTime + "&logEndTime=" +  logEndTime;
            }else if((logStartTime  == "" || undefined) && (logEndTime  != "" || undefined)){
                	window.location.href = window.ajaxUrl + "general/log/downloadExcel?logUserName=" + logUserName + "&logIp=" +  logIp + "&logRemarks=" +  logRemarks + "&logOperation=" +  logOperation + "&logResult=" +  logResult + "&logOprModule=" +  ((logOprModule == undefined || " ") ? "" : logOprModule) + "&logEndTime=" + logEndTime;
            }else if((logEndTime  == "" || undefined) && (logStartTime  != "" || undefined)){
                window.location.href = window.ajaxUrl + "general/log/downloadExcel?logUserName=" +  logUserName + "&logIp=" +  logIp + "&logRemarks=" +  logRemarks + "&logOperation=" +  logOperation + "&logResult=" +  logResult + "&logOprModule=" +  ((logOprModule == undefined || " ") ? "" : logOprModule) + "&logStartTime=" + logStartTime;
            }else if((logStartTime  == "" || undefined) && (logEndTime  == "" || undefined)){
                window.location.href = window.ajaxUrl + "general/log/downloadExcel?logUserName=" +  logUserName + "&logIp=" +  logIp + "&logRemarks=" +  logRemarks + "&logOperation=" +  logOperation + "&logResult=" +  logResult + "&logOprModule=" + ((logOprModule == undefined || " ") ? "" : logOprModule);
            }
            return false;
        });


    });

}(jQuery, window, document));


