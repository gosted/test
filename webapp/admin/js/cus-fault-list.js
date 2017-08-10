/**
 * 本文件是故障列表js文件
 *@author 鲍哲
 */
(function($, w, d) {
    'use strict';
    $(function(){

        var tbody = $(".tbody"),
            first = true,
            sendData = {},
            pageSize = 20,
            pageNo = 1;


        /*
         * 渲染表格方法传入请求到的数据
         * */
        function setTable (data)
        {
            var list = [],
                tbody = $(".tbody"),
                STr = null;

            list = data.data.result;
            tbody.html("");
            if (list.length === 0)
            {
                $(".no-data").show();
            }
            else
            {
                $(".no-data").hide();
            }
            $.each(list, function (i, v)
            {

                STr = $('<tr class="text-c" state="'+ v.state+'" faultId="'+ v.id+'"></tr>');//一行
                STr.append('<td class="checkbox"><input type="checkbox"></td>');

                STr.append('<td class="faultName"><a href="javascript:;">' + v.faultName + '</a></td>');
                STr.append('<td>' + formatDates(v.faultTime) + '</td>');
                //STr.append('<td>' + v.roleState + '</td>');


                /*if(v.roleState == 0)
                {
                    STr.append('<td><span>启用</span></td>');
                }
                else
                {
                    STr.append('<td><span>禁用</span></td>');
                }*/

                STr.append('<td class="authName" title='+ v.faultSite+'>' + v.faultSite + '</td>');
                STr.append('<td class="authName" title='+ v.faultLevel+'>' + v.faultLevel + '</td>');

                STr.append('<td class="authName" title='+ v.reportPeople+'>' + v.reportPeople + '</td>');
                if(v.workSiteId == null)
                {
                    STr.append('<td class="authName"></td>');

                }
                else
                {
                    STr.append('<td class="authName" title='+ v.workSiteId+'>' + v.workSiteId + '</td>');

                }
                //STr.append('<td class="authName" title='+ v.workSiteId+'>' + v.workSiteId + '</td>');
                STr.append('<td class="authName" title='+ v.state+'>' + v.state + '</td>');
                STr.append('<td class="btns">' +
                    '<a style="text-decoration:none" class="mr-5 look" title="故障备注" _href="cus-fault-remarks.html">'+
                    '<i class="Hui-iconfont">&#xe6b3;</i></a>'+
                    '</td>');

                tbody.append(STr);
                /*
                 * tr颜色间隔问题
                 * */
                var trs = tbody.find("tr");
                for(var i=0; i<trs.length;i++){
                    if(i%2 == 0){
                        trs.eq(i).css("background","#fff");
                    }else{
                        trs.eq(i).css("background","#eee");
                    }
                }
            });




        }

        /*
         * 获取表格中数据
         * */
        function initTable (obj)
        {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl+"operation/faultReporting/findPageAll",
                data: {pageSize: obj.pageSize, pageNo: obj.pageNo, prRemark: obj.prRemark},
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        setTable(data);

                    }
                }
            });

        }
        initTable ({pageSize: pageSize, pageNo: pageNo});

        /*渲染表格和分页的方法,传入要向后台传的数据*/
        function renderingPage (sendData)
        {
            var loading = "";
            loading = layer.msg('请稍后', {
                time: 0,
                icon: 16,
                shade: 0.1
            });
            /*
             * 获取表格中数据
             * */
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl+"operation/faultReporting/findPageAll",
                data: sendData,
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        layer.close(loading);
                        setTable(data);
                        //分页
                        laypage({
                            cont: $('#pagination'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
                            pages: data.data.pageCount, //通过后台拿到的总页数
                            curr: data.data.pageNo || 1, //当前页
                            first: '首页',
                            last: '尾页',
                            prev: false,
                            next: false,
                            skip: true, //是否开启跳页
                            jump: function(obj, first){ //触发分页后的回调
                                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                                    var sendData = {
                                        pageSize: pageSize,
                                        pageNo: obj.curr,
                                        faultName : $('input[con_name="faultName"]').val(),
                                        faultTime : $('input[con_name="faultTime"]').val()
                                    };

                                    $.myAjax({
                                        type: "POST",
                                        url: window.ajaxUrl+"operation/faultReporting/findPageAll",
                                        //url:  "http://localhost/data/system/countList.json",
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
                                '<li class="con_num_5"><span>10</span></li>'+
                                '<li class="con_num_10"><span>20</span></li>'+
                                '<li class="con_num_15"><span>50</span></li>'+
                                '<li class="con_num_20"><span>100</span></li>'+
                                '<li class="con_num_25"><span>200</span></li>'+
                                '<li class="con_num_30"><span>1000</span></li>'+
                                '</ul>'+
                                '</div>');
                            $('.pagination').append("<div class='con_altogether'><span>共<span class='allpage'>"+data.data.totalCount+"</span>条</span></div>");
                        }
                        $(".allpage").html(data.data.totalCount);
                        //分页结束
                    }
                }
            });
        }
        sendData = {
            pageSize: pageSize,
            pageNo: pageNo,
            faultName : $('input[con_name="faultName"]').val(),
            faultTime : $('input[con_name="faultTime"]').val()
        };
        renderingPage (sendData);




        //点击编辑用户
        $(".tbody").on("click",".edit",function(){
            var faultId = "",
                data = {};
            faultId = $(this).parents("tr").attr("faultId");
            data.faultId = faultId;
            window.layerViewData = data;
            window.layerShow("编辑","cus-fault-edit.html");
            return false;

        });

        /*
         *点击用户名查看用户信息
         */
        $(".tbody").on("click",".faultName",function(){
            var href = $(this).parent("tr").find(".look").attr("_href"),
                title = $(this).parent("tr").find(".look").attr("title"),
                faultId = "",
                state = "",
                data = {};
            if (!href)
            {
                return false;
            }
            faultId = $(this).parents("tr").attr("faultId");
            state = $(this).parents("tr").attr("state");
            data.faultId = faultId;
            data.state = state;
            data.tabArr = [
                {
                    title: "基本信息",
                    src: "cus-fault-basic.html",
                    color: "blue",
                    selected: true
                },
                {
                    title: "故障备注",
                    src: "cus-fault-remarks.html",
                    color: "blue"
                }
            ];
            window.layerViewData = data;
            window.layerShow('信息详情','cus-tab.html');

        });
        $(".tbody").on("click",".look",function(){
            var href = $(this).attr("_href"),
                title = $(this).attr("title"),
                faultId = "",
                state = "",
                data = {};
            if (!href)
            {
                return false;
            }
            faultId = $(this).parents("tr").attr("faultId");
            state = $(this).parents("tr").attr("state");
            data.faultId = faultId;
            data.state = state;
            data.tabArr = [
                {
                    title: "基本信息",
                    src: "cus-fault-basic.html",
                    color: "blue",
                    selected: true
                },
                {
                    title: "故障备注",
                    src: "cus-fault-remarks.html",
                    color: "blue"
                }
            ];
            window.layerViewData = data;
            window.layerShow('信息详情','cus-tab.html');

        });






        /*删除按钮单击事件*/
        tbody.on("click", ".btns .del", function ()
        {
            var faultId = "";
            faultId = $(this).parents("tr").attr("faultId");
            layer.confirm('确定要删除吗？', {
                    btn: ['确定','取消'],
                    shade: 0.1
                },
                function()
                {
                    //var removeDiv = $(event.target).parents(".btns");
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "operation/faultReporting/delete",
                        data: {id: faultId},
                        success: function (data)
                        {
                            if (data.success == 1 && data.error == "失败")
                            {
                                layer.msg(data.data, {icon:5,time:1000});
                            }
                            if (data.success === 0)
                            {
                                window.location.reload();
                            }



                        },
                        error:function(msg)
                        {

                        }
                    });
                },
                function()
                {
                    layer.msg("已取消",{icon:5},function()
                    {

                    });
                });
            $('.layui-anim').removeClass("layui-anim");
        });

        /*
         * 按钮区查询事件
         */
        function findList()
        {
            var sendData = {};

            var faultName = $('input[con_name="faultName"]').val(),
                faultTime = $('input[con_name="faultTime"]').val();
            sendData = {
                pageSize: pageSize,
                pageNo: pageNo,
                faultTime:faultTime,
                faultName:faultName
            };
            renderingPage (sendData);
        }

        $(".btn-find").on("click", findList);
        $(document).keyup(function(evn){
            var e = evn || window.event;
            if (e.keyCode == 13)
            {
                findList();
            }
        });
        /*每页显示多少条*/
        $(".pagination").on("click", ".con_much>i", function()
        {
            var _this = $(this),
                _ul = _this.parents(".con_much").children("ul"),
                _num = _this.parents(".con_much").find(".con_list_num");
            var roleId = "";
            roleId = $(this).parents("tr").attr("roleId");

            _ul.css({"display": "block"});
            _ul.find("span").on("click",function()
            {
                pageSize = $(this).html();
                _num.html(pageSize);
                _ul.css({"display": "none"});
                var faultName = $('input[con_name="faultName"]').val(),
                    faultTime = $('input[con_name="faultTime"]').val();
                sendData = {
                    pageSize: pageSize,
                    pageNo: pageNo,
                    faultName:faultName,
                    faultTime:faultTime

                };
                renderingPage (sendData);
            });
            return false;
        });
        $(document).on("click", function(e)
        {
            var evn = e || window.event;
            if ($(evn.target).parents(".con_much").size() === 0)
            {
                $(".con_much ul").hide();
            }
        });//选择每页显示多少条事件



        /**
         * 添加
         * */
        $(".btn-add").on("click", function ()
        {
            window.layerShow("登记","cus-fault-add.html");
        });


    });
}(jQuery, window, document));