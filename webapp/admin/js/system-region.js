/**
 * 本文件的功能是地区管理js文件
 *@ author 李明
 */

(function ($, w, d) {
    'use strict';

    $(function () {
        var pageSize = 20,
            pageNo = 1,
            treeArr = [],
            first = true,
            areaIdNow = "",
            arIsCompatibilityNow = "",
            reqSupType = "",
            startTime = "",
            endTime = "",
            unitParentId = "",     //待删
            areaParentId = "",        //新增
            sendData = {};
            //arId =  $.cookie('arId', arId);
        treeInfo(0);
        listInfo(0);
        /*树形参数加载方法*/
        function treeInfo(data, _this) {
            if (_this) {
                if ($(this).hasClass("tree-sw")) {
                    var _this = $(this);
                }
            }
            data == 0 ? areaParentId = 0 : areaParentId = data;
            $.myAjax({
                type: "POST",
                 url:window.ajaxUrl + "general/area/findTree",
                //url: window.ajaxUrl + "/data/backupsSystem/regionInformation.json",
                data: {"id": areaParentId},
                success: function (msg) {
                    if (msg.success === 0 && msg.data) {
                        treeArr = msg.data;
                        if (areaParentId == 0) {
                            var treeArr = msg.data;
                            treeInit({
                                "ele": "#tree",
                                "data": treeArr
                            });
                           /* $('[areaparentid="01"]').find(".tree-txt").eq(0).click();*/
                           /* if(arId != "null" && "undefined"){
                                $('[areaparentid="'+arId+'"]').find(".tree-txt").eq(0).click();
                            }else{
                                $('[areaparentid="01"]').find(".tree-txt").eq(0).click();
                            }
                            $.cookie('arId', null);*/

                        }
                        else {
                            treeChild({
                                ele: _this,
                                data: treeArr
                            });
                        }
                    }
                }
            });
        }

        /*列表参数加载*/
        function listInfo(data, event) {
            if ($(this).hasClass("tree-txt")) {
                var _this = $(target);
            }
            data == 0 ? areaParentId = "" : areaParentId = data;
            $.myAjax({
                type: "POST",
                 url:window.ajaxUrl + "general/area/findPageByIdQuery",
                //url: window.ajaxUrl + "/data/backupsSystem/listInformation.json",
                data: {"areaParentId":areaParentId , "pageNo": pageNo, "pageSize": pageSize},
                success: function (msg) {
                    if (msg.success === 0 && msg.data) {
                        var treeArr = msg.data.result;
                        listInit({
                            "ele": ".tbody",
                            "data": treeArr
                        });
                        $(".allpage").text(msg.data.totalCount);
                        laypage({
                            cont: $('#pagination'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
                            pages: msg.data.pageCount, //通过后台拿到的总页数
                            curr: msg.data.pageNo || 1, //当前页
                            first: '首页',
                            last: '尾页',
                            prev: false,
                            next: false,
                            skip: true, //是否开启跳页
                            jump: function (obj, first) { //触发分页后的回调
                                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                    pageNo = obj.curr
                                    var sendData = {
                                        pageSize: pageSize,
                                        pageNo: obj.curr,
                                        //areaParentId: areaParentId,
                                        areaName : $("[con_name='areaName']").val(),
                                        areaInitial : $("[con_name='areaInitial']").val(),
                                        areaCode : $("[con_name='areaCode']").val()
                                    };
                                    $.myAjax({
                                        type: "POST",
                                        url:window.ajaxUrl + "general/area/findPageByIdQuery",
                                        //url: window.ajaxUrl + "/data/backupsSystem/listInformation.json",
                                        data: sendData,
                                        success: function (data) {
                                            if (data && data.success === 0) {
                                                var treeArr = data.data.result;
                                                listInit({
                                                    "ele": ".tbody",
                                                    "data": treeArr
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        if ($('.pagination .con_much').size() === 0) {
                            $('.pagination').append('<div class="con_much l">' +
                                '<span>' +
                                '每页<i class="con_list_num">20</i>条' +
                                '</span>' +
                                '<i></i>' +
                                '<ul class="clear">' +
                                '<li class="con_num_5"><span>10</span></li>' +
                                '<li class="con_num_10"><span>20</span></li>' +
                                '<li class="con_num_15"><span>50</span></li>' +
                                '<li class="con_num_20"><span>100</span></li>' +
                                '<li class="con_num_25"><span>200</span></li>' +
                                '<li class="con_num_30"><span>1000</span></li>' +
                                '</ul>' +
                                '</div>');
                            $('.pagination').append("<div class='con_altogether'><span>共<span class='allpage'>"+msg.data.totalCount+"</span>条</span></div>");
                        }
                    }
                }
            });
        }

        /*初始化树形内容*/
        function treeInit(obj) {
            var tree = $(obj.ele),
                data = obj.data;
            tree.html("");
            $.each(data, function (i, v) {
                var OLi = $('<li></li>'),
                    OA = $('<a href="javascript:;"></a>');
                OLi.append('<span class="tree-sw"></span>');
                OA.append('<span class="tree-txt"></span>');
                $.each(v, function (j, va) {
                    if (j === "areaNameStr") {
                        OA.find(".tree-txt").html(va);
                    }
                    else if (j === "id") {
                        OLi.attr("areaParentId", va);
                    }
                    else {
                        // OA.attr(j, va);
                    }
                });
                OLi.append(OA);
                tree.append(OLi);
                $(".l").attr({"areaNameId": OLi.attr("areaNameId"), "areaNameStr": OA.attr("areaNameStr")});
            });
            tree.on("click", ".tree-sw", function () {
                var _this = $(this),
                    areaParentId = _this.parent("li").attr("areaParentId");
                $("[con_name='areaName']").val("");
                $("[con_name='areaInitial']").val("");
                $("[con_name='areaCode']").val("");
                if (_this.siblings("ul").length != 0) {
                    treeChild({
                        ele: _this
                    });
                }
                else {
                    treeInfo(areaParentId, _this);
                }
            });
            tree.on("click", ".tree-txt", function () {
                var _this = $(this),
                    areaParentId = _this.parent().parent("li").attr("areaParentId"),
                    areaNameStr = _this.parent().attr("areaNameStr");
                _this.parents(".tree").find(".tree-txt").removeClass("clr-blue");
                _this.addClass("clr-blue");
                $(".l").attr({"areaParentId": areaParentId, "areaNameStr": areaNameStr});
                pageNo = 1;
                $("[con_name='areaName']").val("");
                $("[con_name='areaInitial']").val("");
                $("[con_name='areaCode']").val("");
                listInfo(areaParentId);
            })
        }

        /*树形子节点渲染*/
        function treeChild(_this) {
            var obj = _this.ele;
            if (obj.siblings("ul").length == 0) {
                var data = _this.data;
                var OUL = $("<ul class='organCon'></ul>");
                $.each(data, function (i, v) {
                    var OLi = $('<li></li>'),
                        data = _this.data,
                        OA = $('<a href="javascript:;"></a>');
                    OLi.append('<span class="tree-sw"></span>');
                    OLi.append(OA);
                    OA.append('<span class="tree-txt"></span>');
                    OUL.append(OLi);
                    $.each(v, function (j, w) {
                        if (j === "areaNameStr") {
                            OA.find(".tree-txt").html(w);

                        }
                        else if (j === "id") {
                            OLi.attr("areaParentId", w);
                        }
                        else {
                            // OA.attr(j, w);
                        }
                    });

                });
                obj.parent("li").append(OUL);
            }
            if (obj.hasClass("sw-open")) {
                obj.css({"background": 'url("../../images/commen/tree_0.png") no-repeat center'});
                obj.removeClass("sw-open");
                obj.siblings(".organCon").css({"display": "none"});
            }
            else {
                obj.css({"background": 'url("../../images/commen/tree_1.png") no-repeat center'});
                obj.addClass("sw-open");
                obj.siblings(".organCon").css({"display": "block"});
            }
        }

        /*列表渲染*/
        function listInit(obj) {
            var list = $(obj.ele),
                data = obj.data;
            list.html("");
            if(data == null || ""){
                list.append("<tr class='text-c'>暂无数据</tr>");
            }else {
                $.each(data, function (i, v) {
                    var tr = $("<tr class='text-c'></tr>");
                    tr.attr({"usefulid": v.id, "areaParentId": v.areaParentId});
                    var str = "<td><input type='checkbox' name='' value=''></td><td title='" + v.areaName + "'>" + v.areaName + "</td><td class='text-l pl-3' style='text-align: center !important;' title='" + v.areaInitial + "'>" + v.areaInitial + "</td><td>" + v.areaCode + "</td><td>" + v.areaLevel + "</td><td class='btns'><a style='text-decoration:none' class='mr-5 edi' href='javascript:;' title='编辑' _href='support-lib-edit.html'><i class='Hui-iconfont'>&#xe70c;</i></a><a style='text-decoration:none' class='mr-5 del c-warning' href='javascript:;' title='删除'><i class='Hui-iconfont'>&#xe6e2;</i></a></td>"
                    tr.append(str);
                    list.append(tr);
                    i % 2 == 0 ? tr.css({"background": "#fff"}) : tr.css({"background": "#eee"});
                    /*tr.on("click", function () {
                     var libId = "";
                     var e = event || window.event;
                     var target = e.target || e.srcElement;
                     var tagName = target.tagName.toLowerCase();

                     if (tagName == "i" || tagName == "input") {

                     }
                     else {
                     libId = $(this).attr("usefulid");
                     window.layerShow("查看机构", "system-organ-examine.html?libId=" + libId);
                     }
                     });*/
                });
            }

            function article_submit(obj, str) {
                if (str.indexOf("添加成功") > -1) {
                    layer.confirm("添加成功", {
                            shade: 0.1
                        },
                        function () {
                            suc();
                        },
                        function () {
                            suc();
                        })
                }
                else if (str.indexOf("操作失败") > -1) {
                    layer.confirm("操作失败", {
                            shade: 0.1
                        },
                        function () {
                            defeat();
                        },
                        function () {
                            defeat();
                            layer.msg("已取消", {icon: 5});
                        })
                }
                else {
                    layer.confirm(str, function () {
                            defeat();
                        },
                        function () {
                            defeat();
                            layer.msg("已取消");
                        })
                }
            }

            /*编辑按钮单击事件*/
            list.on("click", ".btns .edi", function () {
                var libId = "",
                    areaNameId = "",
                    data = {};
                libId = $(this).parents("tr").attr("usefulid");
                areaParentId = $(this).parents("tr").attr("areaParentId");
                data.libId = libId;
                data.areaParentId = areaParentId;
                window.layerViewData = data;
                window.layerShow("编辑地区", "system-region-edi.html?libId=" + libId + "&areaParentId=" + areaNameId);
            });
            /*删除按钮单击事件*/
            list.on("click", ".btns .del", function () {
                var _this = $(this);
                var libId = "";
                libId = $(this).parents("tr").attr("usefulid");
                layer.confirm('确定要删除吗？', {
                        btn: ['确定', '取消'],
                        shade: 0.1
                    },
                    function () {
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "general/area/deleteByIds",
                            data: {ids: libId},
                            success: function (data) {
                                $(".layui-layer").remove();
                                $(".layui-layer-shade").remove();
                                if (data.success === 0) {
                                    _this.parents("tr").remove();
                                    $("#tree").find("[unitparentid=" + libId + "]").remove();

                                }
                            }
                        });
                    },
                    function () {

                    });
            });
        }

        /*添加按钮单击事件*/
        $(".btn-add").on("click", function () {
            var libId = "",
                libId = $(this).parents(".l").attr("areaNameId"),
                unitNameStr = $(this).parents(".l").attr("unitNameStr"),
                URL = encodeURI("system-region-add.html?libId=" + libId + "&unitNameStr=" + unitNameStr);
            window.layerShow("添加地区", URL);
        });

        /*条件检索列表展示方法*/
        function findList() {
            var areaName = $("[con_name='areaName']").val(),
                areaInitial = $("[con_name='areaInitial']").val(),
                areaCode = $("[con_name='areaCode']").val(),
                areaParentId = $(".tree .clr-blue").parents("li").attr("areaParentId");

            pageNo = 1;
            $.myAjax({
                type: "POST",
                url:window.ajaxUrl + "general/area/findPageByIdQuery",
                data: {"areaName": areaName, "pageNo": pageNo, "pageSize": pageSize,"areaInitial": areaInitial, "areaCode": areaCode,"areaParentId":areaParentId},
                success: function (msg) {
                    if (msg.success === 0 && msg.data) {
                        var treeArr = msg.data.result;
                        listInit({
                            "ele": ".tbody",
                            "data": treeArr
                        });
                        laypage({
                            cont: $('#pagination'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
                            pages: msg.data.pageCount, //通过后台拿到的总页数
                            curr: msg.data.pageNo || 1, //当前页
                            first: '首页',
                            last: '尾页',
                            prev: false,
                            next: false,
                            skip: true, //是否开启跳页
                            jump: function (obj, first) { //触发分页后的回调
                                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                    pageNo = obj.curr
                                    var sendData = {
                                        pageSize: pageSize,
                                        pageNo: obj.curr,
                                        areaParentId: areaParentId,
                                        areaName : $("[con_name='areaName']").val(),
                                        areaInitial : $("[con_name='areaInitial']").val(),
                                        areaCode : $("[con_name='areaCode']").val(),
                                    };
                                    $.myAjax({
                                        type: "POST",
                                        url:window.ajaxUrl + "general/area/findPageByIdQuery",
                                        //url: window.ajaxUrl + "/data/backupsSystem/listInformation.json",
                                        data: sendData,
                                        success: function (data) {
                                            if (data && data.success === 0) {
                                                var treeArr = data.data.result;
                                                listInit({
                                                    "ele": ".tbody",
                                                    "data": treeArr
                                                });
                                                $(".allpage").text(data.data.totalCount);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        if ($('.pagination .con_much').size() === 0) {
                            $('.pagination').append('<div class="con_much l">' +
                                '<span>' +
                                '每页<i class="con_list_num">10</i>条' +
                                '</span>' +
                                '<i></i>' +
                                '<ul class="clear">' +
                                '<li class="con_num_5"><span>5</span></li>' +
                                '<li class="con_num_10"><span>10</span></li>' +
                                '<li class="con_num_15"><span>15</span></li>' +
                                '<li class="con_num_20"><span>20</span></li>' +
                                '<li class="con_num_25"><span>25</span></li>' +
                                '<li class="con_num_30"><span>30</span></li>' +
                                '</ul>' +
                                '</div>');
                            $('.pagination').append("<div class='con_altogether'><span>共<span class='allpage'>"+msg.data.totalCount+"</span>条</span></div>");
                        }
                        $(".allpage").text(msg.data.totalCount);
                    }
                }
            })
        }

        $(".btn-find").on("click", findList);
        $(document).keyup(function (evn) {
            var e = evn || window.event;
            if (e.keyCode == 13) {
                findList();
            }
        });
        $(".pagination").on("click", ".con_much>i", function () {
            var _this = $(this),
                _ul = _this.parents(".con_much").children("ul"),
                _num = _this.parents(".con_much").find(".con_list_num");

            _ul.css({"display": "block"});
            _ul.find("span").off();
            _ul.find("span").on("click", function () {
                pageSize = $(this).html();
                pageNo = 1;
                _num.html(pageSize);
                _ul.css({"display": "none"});
                listInfo(areaParentId);
            });
            return false;
        });//选择每页显示多少条事件
        /*操作成功关闭弹出框刷新页面*/
        function suc() {
            $(".layui-layer").remove();
            $(".layui-layer-shade").remove();
            parent.window.location.reload();
            $(".layui-layer-shade", parent.document).remove();
            $(".layui-layer", parent.document).remove();
        }

        /*操作失败方法只关闭弹出框*/
        function defeat() {
            $(".layui-layer").remove();
            $(".layui-layer-shade").remove();
        }

        $(document).on("click", function (e) {
            var evn = e || window.event;
            if ($(evn.target).parents(".con_much").size() === 0) {
                $(".con_much ul").hide();
            }
        });
    });

}(jQuery, window, document));
