/**
 * 本文件的功能是资产管理js文件
 *@ author 鲍哲
 */

(function($, w, d){
    'use strict';

    $(function() {
        var tbody = $(".tbody"),
            pageSize = 20,
            pageNo = 1,
            first = true,
            treeArr = [],
            setting = {},
            zTreeObj = null;


        /*
         * treeOnClick树形菜单点击回调函数
         *
         * */
        function treeOnClick()
        {
            var _this = $(this),
                id = _this.parents("a").eq(0).attr("dictCodeValue");
            var treeId = $(".tree .clr-blue").parents("li").attr("treeId");
            _this.parents(".tree").find(".tree-txt").removeClass("clr-blue");
            _this.addClass("clr-blue");
          $('input[con_name="asseName"]').val("");
          $('input[con_name="asseCode"]').val("");
            initTable ({pageSize: pageSize, pageNo: pageNo, dictCodeValue: id });
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
                OA.append('<span style="color: orange">【</span><span class="tree-count" style="color: orange"></span><span style="color: orange">】</span>');

                $.each(v, function (j,va)
                {
                    if (j === "children")
                    {

                    }
                    else if (j === "equipmentName")
                    {
                        OA.find(".tree-txt").text(va);
                    }
                    else if (j === "countAll")
                    {
                        OA.find(".tree-count").text(va);
                    }
                    else if (j === "id")
                    {
                        OLi.attr("treeId", va);
                    }
                    else
                    {
                        OA.attr(j, va);
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
                            url:  window.ajaxUrl+"operation/equipment/findTree1",
                            type: "POST",
                            data: {id : $(this).parents("li").attr("treeId")},
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
                                        OA.append('<span style="color: orange">【</span><span class="tree-count" style="color: orange"></span><span style="color: orange">】</span>');

                                        $.each(v, function (j,va)
                                        {
                                            if (j === "children")
                                            {

                                            }
                                            else if (j === "equipmentName")
                                            {
                                                OA.find(".tree-txt").html(va);
                                            }
                                            else if (j === "countAll")
                                            {
                                                OA.find(".tree-count").text(va);
                                            }
                                            else if (j === "id")
                                            {
                                                OLi.attr("treeId", va);
                                            }
                                            else
                                            {
                                                OA.attr(j, va);
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
        }
        var sendData ={};
        //请求树形菜单数据
        $.myAjax({
            url:  window.ajaxUrl+"operation/equipment/findTree1",
            type: "POST",
            data: {id : "0"},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    treeArr =data.data;
                    treeInit({
                        ele: "#tree",
                        data: treeArr
                    });
                }
            }
        });

        /*
         * 渲染表格方法传入请求到的数据
         * */
        function setTable (data)
        {
            var list = [],
                tbody = $(".tbody"),
                STr = null,
                str = null,
                imgSrc = "",
                childStr = null;

            list = data.data.result;
            tbody.html("");
            $.each(list, function (i, v)
            {
                STr = $('<div  equId = '+v.equipmentId+' class="asse_outer l mt-20 mr-20"></div>');
                str = $( '<div class="asse_top"></div>');

                    if(v.attachmentId){
                        imgSrc = window.ajaxUrl+'project/attachment/downloadImage?id='+v.attachmentId;
                    }else{
                        imgSrc = "../../images/temporary/equ_logo.png";
                    }

                    str.append('<img class="pl-10" src="'+imgSrc+'" alt=""/><span class="ml-10">'+ v.equipmentName +'</span>');


                STr.append(str);
                if(v.countInstall == null){
                    v.countInstall = 0;
                }
                STr.append('<div class="asse_left col-my"><span content_name="All" class="num">'+v.countAll+'</span></div>' +
                    '<div class="asse_right col-10"><div class="asTop"><span class="col-3 pl-20 mt-25 txt-right">库存</span> <span  content_name="KC" class="col-2 num mt-25">'+ v.countIn+'</span>' +
                    '<span class="col-3 pl-20 col-offset-1 mt-25 txt-right">现场</span> <span content_name="XC" class="col-2 num mt-25">'+ v.countInstall+'</span></div>' +
                    '<div class="asBot"><span class="col-3 pl-20 mt-25 txt-right">出库</span> <span content_name="DCK" class="col-2 num mt-25">'+ v.countOut+'</span>' +
                    ' <span class="col-3 pl-20 mt-25 col-offset-1 txt-right">其他</span> <span content_name="QT" class="col-2 num mt-25">'+ v.countOther+'</span> </div>' +
                    '</div>');
                tbody.append(STr);

            });
        }
        $(".tbody").on("click",".num",function(){
            var data = {};
            var name = $(this).attr("content_name"),
                equId = $(this).parents(".asse_outer").attr("equId");
            data.equId = equId;
            if(name == "All"){
                data.assetStatus = 0;
            }else if(name == "KC"){
                data.assetStatus = 1;
            }else if(name == "DCK"){
                data.assetStatus = 2;
            }else if(name == "XC"){
                data.assetStatus = 3;
            }else if(name == "QT"){
                data.assetStatus = 4;
            }
            window.layerViewData = data;
            window.layerShow("资产列表","asset-check-detail.html");
            /*window.location.replace();*/
        });
        /*
         * 获取表格中数据
         * */
        function initTable (obj)
        {
            $.myAjax({
                type: "POST",
                url:  window.ajaxUrl+"project/assetRegistration/findPageByEq",
                data: {
                    pageSize: obj.pageSize,
                    pageNo: obj.pageNo,
                    asseName: $('input[con_name="asseName"]').val(),
                    asseCode: $('input[con_name="asseCode"]').val(),
                    equipmentId:$(".tree .clr-blue").parents("li").attr("treeId")
                },
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
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
                                        asseName: $('input[con_name="asseName"]').val(),
                                        asseCode: $('input[con_name="asseCode"]').val(),
                                        equipmentId:$(".tree .clr-blue").parents("li").attr("treeId")
                                    };

                                    $.myAjax({
                                        type: "POST",
                                        url:  window.ajaxUrl+"project/assetRegistration/findPageByEq",
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
                        $(".allpage").text(data.data.totalCount);
                        //分页结束
                    }
                }
            });
        }
        sendData = {
            pageSize: pageSize,
            pageNo: pageNo,
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
                asseName: $('input[con_name="asseName"]').val(),
                asseCode: $('input[con_name="asseCode"]').val(),
                equipmentId:$(".tree .clr-blue").parents("li").attr("treeId")
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



        /*
         * 按钮区查询事件
         */
        //查询
        function findList()
        {
            var treeId = $(".tree .clr-blue").parents("li").attr("treeId");
            if($('input[con_name="asseName"]').val().length > 0)
            {
                var asseName = $('input[con_name="asseName"]').val();
            }
            else {}
            if($('input[con_name="asseCode"]').val().length > 0)
            {
                var asseCode = $('input[con_name="asseCode"]').val();
            }
            else {}

            $.myAjax({
                type: "POST",
                url:  window.ajaxUrl+"project/assetRegistration/findPageByEq",
                data: {
                    pageSize: pageSize,
                    pageNo: pageNo,
                    asseName:asseName,
                    asseCode:asseCode,
                    id:treeId
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
