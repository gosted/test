/**
 * 本文件的功能是设备定义js文件
 *@ author 鲍哲
 */

(function($, w, d){
    'use strict';

    $(function() {
        var tbody = $(".tbody"),
            pageSize = 20,
            pageNo = 1,
            first = true,
            areaIdNow = "",
            treeArr = [],
            setting = {},
            zTreeObj = null;

        var setMenuTree = function (obj)
        {
            var open = false;

            /*
             * treeOnClick树形菜单点击回调函数
             *
             * */
            function treeOnClick()
            {
                var _this = $(this),
                    id = _this.parents("a").eq(0).attr("dictCodeValue");
                _this.parents(".tree").find(".tree-txt").removeClass("clr-blue");
                _this.addClass("clr-blue");
            }

            /*
             * treeInit初始化树形菜单方法
             *
             * */
            function treeInit(obj)
            {
                var tree = $(obj.ele),
                    data = obj.data;

                tree.html("");
                $.each(data, function (i, v)
                {
                    var OLi = $('<li></li>'),
                        OA = $('<a href="javascript:;"></a>');

                    OLi.append('<span class="tree-sw"></span>');

                    if (obj.showIcon === true)
                    {
                        OA.append('<span class="tree-icon"></span>');
                    }
                    OA.append('<span class="tree-txt"></span>');

                    $.each(v, function (j,va)
                    {
                        if (j === obj.value)
                        {
                            OA.find(".tree-txt").html(va);
                        }
                        else if (j === obj.id)
                        {
                            OLi.attr("treeId", va);
                        }
                        else
                        {
                            //OA.attr(j, va);
                        }
                    });
                    OLi.append(OA);
                    tree.append(OLi);
                });
                tree.on("click", ".tree-sw", function ()
                {
                    var _this = $(this),
                        OUl = _this.parent("li").children("ul"),
                        id = _this.parent("li").attr("treeId");
                    if (_this.hasClass("sw-open"))
                    {
                        _this.css({"background": 'url("../../images/commen/tree_0.png") no-repeat center'});
                        _this.removeClass("sw-open");
                        OUl.css({"display": "none"});
                    }
                    else
                    {
                        _this.css({"background": 'url("../../images/commen/tree_1.png") no-repeat center'});
                        _this.addClass("sw-open");

                        if (OUl.size() === 1)
                        {
                            OUl.css({"display": "block"});
                        }
                        else
                        {
                            $.myAjax({
                                url: obj.url,
                                type: obj.type || "POST",
                                data: {
                                    id: id
                                },
                                success: function (data)
                                {
                                    if (data && data.success === 0)
                                    {
                                        var treeArr = data.data,
                                            OUl = $('<ul></ul>');

                                        $.each(treeArr, function (i, v)
                                        {
                                            var OLi = $('<li></li>'),
                                                OA = $('<a href="javascript:;"></a>');

                                            OLi.append('<span class="tree-sw"></span>');

                                            if (obj.showIcon === true)
                                            {
                                                OA.append('<span class="tree-icon"></span>');
                                            }
                                            OA.append('<span class="tree-txt"></span>');

                                            $.each(v, function (j,va)
                                            {
                                                if (j === obj.value)
                                                {
                                                    OA.find(".tree-txt").html(va);
                                                }
                                                else if (j === obj.id)
                                                {
                                                    OLi.attr("treeId", va);
                                                }
                                                else
                                                {
                                                    //OA.attr(j, va);
                                                }
                                            });
                                            OLi.append(OA);
                                            OUl.append(OLi);
                                        });
                                        _this.parent("li").append(OUl);
                                    }
                                }
                            });
                        }
                    }
                    return false;
                });

                tree.on("click", ".tree-txt", treeOnClick);
                if (obj.treeClick)
                {
                    tree.on("click", ".tree-txt", obj.treeClick);
                }
            }

            treeInit({
                ele: ".tree",
                data: [ {
                    "equipmentName" : "全部设备",
                    "id" : "0"
                }],
                id: obj.id || "id",
                value: obj.value,
                url: obj.url,
                type: obj.type || "POST",
                treeClick: obj.treeClick || ""
            });

            /*$.myAjax({
             url: obj.url,
             type: obj.type || "POST",
             data: {id: $(this).parents("li").attr("treeId")},
             success: function (data)
             {
             if (data && data.success === 0)
             {
             var treeArr = data.data;

             treeInit({
             ele: ".tree",
             data: treeArr,
             id: obj.id || "id",
             value: obj.value,
             url: obj.url,
             type: obj.type || "POST",
             treeClick: obj.treeClick || ""
             });
             }
             }
             });*/
        };

        //请求树形菜单数据
        setMenuTree({
            url:  window.ajaxUrl+"operation/equipment/findTree",
            type: "POST",
            data: {id: 0},
            id: "id",
            value: "equipmentName",
            treeClick: function ()
            {
                var _this = $(this),
                    sendData = {};

                $("[con_name='equipmentName']").val("");
                $("[con_name='equipmentCode']").val("");
                areaIdNow = _this.parents("li").eq(0).attr("treeId");

                sendData = {
                    pageSize: pageSize,
                    pageNo: pageNo,
                    id: areaIdNow
                };
                initTable (sendData);
            }
        });


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
            $.each(list, function (i, v)
            {
                STr = $('<tr class="text-c" libId="'+ v.id+'" productLine="'+ v.productLine+'"></tr>');//一行
                STr.append('<td><input type="checkbox" name="chebox"></td>');
                if(v.attachmentId === null || v.attachmentId == "")
                {
                    STr.append('<td class="user-name" style="text-align: left">' +
                        '<img class="doSptMdlPro-name-img pr-5" src="../../images/temporary/equ_logo.png"/>'
                        + v.equipmentName + '</td>');

                }
                else
                {
                    STr.append('<td class="user-name" style="text-align: left">' +
                        '<img class="doSptMdlPro-name-img pr-5" ' +
                        'src="'+window.ajaxUrl+'project/attachment/downloadImage?id='+v.attachmentId+'"/>' +
                        '' + v.equipmentName + '</td>');
                }

                STr.append('<td>' + v.equipmentCode + '</td>');
                STr.append('<td>' + v.equipmentParam + '</td>');
                STr.append('<td>' + v.equipmentUnit + '</td>');

                if(v.storeStyle == 0)
                {
                    STr.append('<td>单次入库</td>');
                }
                else if(v.storeStyle == 1){
                    STr.append('<td>批量入库</td>');
                }
                else{
                    STr.append('<td></td>');
                }
                STr.append('<td class="text-l pl-3">' + v.equipmentRemark + '</td>');

                STr.append('<td class="btns">' +
                    '<a style="text-decoration:none" class="ml-5 op" href="javascript:;" title="编辑" _href="strg-storage-equipment-edit.html">'+
                    '<i class="Hui-iconfont">&#xe70c;</i></a>'+

                    '<a style="text-decoration:none" class="mr-5 del c-warning" href="javascript:;" title="删除">'+
                    '<i class="Hui-iconfont">&#xe6e2;</i></a>'+
/*
                    '<a style="text-decoration:none" class="ml-5 Administration" href="javascript:;" title="管理角色" _href="system-user-ASingleEditor.html">'+
                    '<i class="Hui-iconfont">&#xe61d;</i></a>'+

                    '<a style="text-decoration:none" class="ml-5 ModifyPassword" href="javascript:;" title="重置密码" _href="system-user-ModifyPassword.html">'+
                    '<i class="Hui-iconfont">&#xe63f;</i></a>'+*/
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

        function setProLine ()
        {
            /*
             * 根据v.productLine查询字典获取dicodeName
             * */
            $.myAjax({
                type: "POST",
                url:window.ajaxUrl + "general/dictionary/findDictionary",
                data: {"dictCode":"CPX"},
                success:function(data){
                    if(data && data.success === 0)
                    {
                        var OTr  = $(".tbody").find('tr');
                        $.each(OTr, function (i, v)
                        {
                            var thisTr = $(v);  //转换为jq对象
                            if(thisTr.attr("productLine") == "undefined" ||
                                thisTr.attr("productLine") == "null" ||
                                thisTr.attr("productLine") == "")
                            {
                                thisTr.children().eq(4).after('<td></td>');

                            }
                            else{
                                $.each(data.data,function(j,k)
                                {
                                    if (thisTr.attr("productLine") === k.dictCodeValue)
                                    {
                                        thisTr.children().eq(4).after('<td>' + k.dictCodeName + '</td>');
                                    }

                                })
                            }

                        });
                    }
                }

            })
        }

        var sendData ={};

        /*
         * 获取表格中数据
         * */
        function initTable (obj)
        {
            $.myAjax({
                type: "POST",
                url:  window.ajaxUrl+"operation/equipment/findPageWithTree",
                data: {
                    pageSize: obj.pageSize,
                    pageNo: obj.pageNo,
                    equipmentName : $("[con_name='equipmentName']").val(),
                    equipmentCode : $("[con_name='equipmentCode']").val(),
                    id:areaIdNow
                },
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        setTable(data);
                        setProLine ();
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
                                        equipmentName : $("[con_name='equipmentName']").val(),
                                        equipmentCode : $("[con_name='equipmentCode']").val(),
                                        id:areaIdNow
                                    };

                                    $.myAjax({
                                        type: "POST",
                                        url:  window.ajaxUrl+"operation/equipment/findPageWithTree",
                                        data: sendData,
                                        success: function (data)
                                        {
                                            if (data && data.success === 0)
                                            {
                                                setTable(data);
                                                setProLine ();
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
            pageNo: pageNo
        };
        initTable (sendData);

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
            var _num = $(".pagination").find(".con_much .con_list_num"),
                _ul = $(".pagination").find(".con_much").children("ul");
            pageSize = $(this).html();
            _num.html(pageSize);
            _ul.css({"display": "none"});
            sendData = {
                pageSize: pageSize,
                pageNo: pageNo,
                equipmentName : $("[con_name='equipmentName']").val(),
                equipmentCode : $("[con_name='equipmentCode']").val(),
                id:areaIdNow
            };
            initTable (sendData);
            return false;
        });
        $(document).on("click", function(e)
        {
            var evn = e || window.event;
            if ($(evn.target).parents(".con_much").size() === 0)
            {
                $(".con_much ul").hide();
            }
        });
        //选择每页显示多少条事件


        //initTable ({pageSize: pageSize, pageNo: pageNo, id: 0});

        /*
         * 右侧按钮区按钮点击事件
         * */
        //编辑
        tbody.on("click", ".btns .op", function ()
        {
            var href = $(this).attr("_href"),
                title = $(this).attr("title"),
                data = {},
                libId = "";

            libId = $(this).parents("tr").attr("libId");
            data.libId = libId;
            window.layerViewData = data;
            window.layerShow(title,href);
        });
        /*  /!*删除按钮单击事件*!/*/
        tbody.on("click", ".btns .del", function ()
        {
            var libid = "";
            libid = $(this).parents("tr").attr("libid");
            layer.confirm('确定要删除吗？', {
                    btn: ['确定','取消'],
                    shade: 0.1
                },
                function()
                {
                    //var removeDiv = $(event.target).parents(".btns");
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "operation/equipment/deleteByIds",
                        data: {ids: libid},
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
         * 列表上侧按钮区按钮点击事件
         * */
        //添加
        $(".btn-add").on("click", function ()
        {
            var data = {},
                treeId = $(".tree .clr-blue").parents("li").attr("treeId"),
                equName =  $(".tree .clr-blue").text(),
                parentTree = $(".tree .clr-blue").parents("li").parents("li").eq(0).attr("treeId");


            data.treeId = treeId;
            data.parentTree = parentTree;
            data.equName = equName;
            window.layerViewData = data;
            window.layerShow("新增设备","strg-storage-equipment-add.html");
        });


        /*
         * 按钮区查询事件
         */
        //查询
        function findList()
        {
            var treeId = $(".tree .clr-blue").parents("li").attr("treeId");
            if($('input[con_name="equipmentName"]').val().length > 0)
            {
                var equipmentName = $('input[con_name="equipmentName"]').val();
            }
            else {}
            if($('input[con_name="equipmentCode"]').val().length > 0)
            {
                var equipmentCode = $('input[con_name="equipmentCode"]').val();
            }
            else {}

            $.myAjax({
                type: "POST",
                url:  window.ajaxUrl+"operation/equipment/findPageWithTree",
                data: {
                    pageSize: pageSize,
                    pageNo: pageNo,
                    equipmentName:equipmentName,
                    equipmentCode:equipmentCode,
                    id:areaIdNow
                },
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        //setTable(data);
                        initTable({pageSize: pageSize,pageNo: pageNo,userName: $(".prName").val(),userRealName:  $(".prLabel").val(),id:$(".tree .clr-blue").parents("li").attr("treeId")})
                    }
                }
            });
        }
        $(".btn-find").on("click", findList);
        $(document).keyup(function(evn){
            var e = evn || window.event;
            if (e.keyCode == 13)
            {
                findList();
            }
        });

    });
}(jQuery, window, document));
