/**
 * 本文件是工地列表页js文件
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
        var projectId = parent.window.layerViewData.projectId;
        tbody.attr("projectId",projectId);

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

                STr = $('<tr class="text-c" worksiteId="'+ v.id+'"></tr>');//一行
                STr.append('<td class="checkbox"><input type="checkbox"></td>');

                STr.append('<td class="role-name"><a href="javascript:;" style="text-align: left">' + v.worksiteName + '</a></td>');
                STr.append('<td>' + v.worksiteCode + '</td>');
                STr.append('<td style="text-align: left">' + v.areaName + '</td>');
                STr.append('<td style="text-align: left">' + v.worksiteAdd + '</td>');
                STr.append('<td>' + v.worksiteContact + '</td>');
                STr.append('<td class="authName">' + v.worksitePhone + '</td>');
                STr.append('<td class="btns">' +
                    '<a style="text-decoration:none" class="mr-5 edit" href="system-role-edit.html" title="编辑" _href="system-role-edit.html">'+
                    '<i class="Hui-iconfont">&#xe70c;</i></a>'+
                    '<a style="text-decoration:none" class="mr-5 del c-warning" href="javascript:;" title="删除">'+
                    '<i class="Hui-iconfont">&#xe6e2;</i></a>'+
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
                url: window.ajaxUrl + "project/workSite/findPage",
                data: {pageSize: obj.pageSize, pageNo: obj.pageNo,projectId:projectId},
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        setTable(data);

                    }
                }
            });

        }
        initTable ({pageSize: pageSize, pageNo: pageNo,projectId:projectId});

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
                url: window.ajaxUrl + "project/workSite/findPage",
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
                                        projectId:projectId,
                                        worksiteName:$('input[con_name="worksiteName"]').val(),
                                        worksiteCode:$('input[con_name="worksiteCode"]').val()
                                    };

                                    $.myAjax({
                                        type: "POST",
                                        url: window.ajaxUrl + "project/workSite/findPage",
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
            projectId:projectId
        };
        renderingPage (sendData);




        /*
         * 编辑
         */
        $(".tbody").on("click",".edit",function(){
            var worksiteId = "",
                data = {};
            worksiteId = $(this).parents("tr").attr("worksiteId");
            data.worksiteId = worksiteId;
            data.projectId = projectId;
            window.layerViewData = data;
            window.layerShow("编辑","pro-Mgmt-SiteEdit.html");
            return false;

        });


        /*
        *添加
        *
        * */
        $(".btn-add").on("click", function ()
        {
            var data = {},
              worksiteId = $(this).parents("tr").attr("worksiteId");

            data.worksiteId = worksiteId;
            data.projectId = projectId;
            window.layerViewData = data;
            window.layerShow("添加","pro-Mgmt-SiteAdd.html");
        });

        $(".tbody").on("click",".role-name",function(){

            var worksiteId = "",
                data = {};
            worksiteId = $(this).parents("tr").attr("worksiteId");
            data.worksiteId = worksiteId;
            data.projectId = projectId;
            window.layerViewData = data;
            window.layerShow("编辑","pro-Mgmt-SiteEdit.html");
            return false;

        });

/*        /!*
        * 删除
        * *!/
        tbody.on("click", ".btns .del", function ()
        {
            var worksiteId = "";
            worksiteId = $(this).parents("tr").attr("worksiteId");
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/workSite/deleteById",
                data: {id: worksiteId},
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        if(data.data == null || data.data == ""){
                            layer.confirm('确定要删除吗？', {
                                    btn: ['确定','取消'],
                                    shade: 0.1
                                },
                                function()
                                {
                                    $.myAjax({
                                        type: "POST",
                                        url: window.ajaxUrl + "project/workSite/deleteById",
                                        data: {ids: userId},
                                        success: function (data)
                                        {
                                            if (data && data.success === 0)
                                            {
                                                window.location.reload();
                                            }
                                        }
                                    });
                                },
                                function()
                                {
                                    layer.msg('已取消', {icon:5,time:1000});
                                });
                        }else{
                            layer.confirm('该用户已有角色，不能删除', {
                                btn: ['确定','取消'],
                                shade: 0.1
                            });
                        }
                    }
                }
            });


        });*/



      /*  /!*删除按钮单击事件*!/*/
        tbody.on("click", ".btns .del", function ()
        {
            var worksiteId = "";
            worksiteId = $(this).parents("tr").attr("worksiteId");
            layer.confirm('确定要删除吗？', {
                    btn: ['确定','取消'],
                    shade: 0.1
                },
                function()
                {
                    //var removeDiv = $(event.target).parents(".btns");
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/workSite/deleteById",
                        data: {id: worksiteId},
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
            if($('input[con_name="worksiteName"]').val().length > 0)
            {
                var worksiteName = $('input[con_name="worksiteName"]').val();
            }
            else{}
            if($('input[con_name="worksiteCode"]').val().length > 0)
            {
                var worksiteCode = $('input[con_name="worksiteCode"]').val();
            }
            else{}

            sendData = {
                pageSize: pageSize,
                pageNo: pageNo,
                worksiteName:worksiteName,
                worksiteCode:worksiteCode,
                projectId:projectId
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
                sendData = {
                    pageSize: pageSize,
                    pageNo: pageNo,
                    projectId:projectId,
                    worksiteName:$('input[con_name="worksiteName"]').val(),
                    worksiteCode:$('input[con_name="worksiteCode"]').val()

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



    });
}(jQuery, window, document));