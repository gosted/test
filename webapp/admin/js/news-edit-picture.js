/**
 * 本文件的功能是编辑图片跳转js文件
 * @ author 李明
 */


(function($, w, d){
    'use strict';

    $(function() {
        var tbody = $(".tbody"),
            pageSize = 20,
            pageNo = 1,
            treeArr = [],
            typeId = parent.window.layerViewData.typeId,
            addId = parent.window.layerViewData.addId,
            first = true,
            sendData = {};


        /*
         * 渲染表格方法传入请求到的数据
         * */
        function setTable (data)
        {

            var list = [],
                tbody = $(".tbody"),
                Str = null;

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
                Str = $('<li class="item">'+
                    '<div class="portfoliobox">'+
                    '<div class="picbox"><a href="javascript:;" data-lightbox="gallery" data-title="描述"><img src=' +v.figureSrc+'></a></div>'+
                    '<div class="textbox" pic-id='+v.pictureId+' figureImg='+v.figureImg+'><p style="display:inline;float:left;width:70px;height:30px;line-height:30px;overflow:hidden;text-overflow: ellipsis;white-space: nowrap">'+
                    v.title +'</p>' +
                    '<a href="javascript:;"   class="btn btn-success radius f-r mr-5 btn-edit">'+
                    '<i class="Hui-iconfont"></i>'+
                    '选择'+
                    '</a>' +
                    '</div>'+
                    '</div>'+
                    '</li>');
                tbody.append(Str);
            });
            $.Huihover(".portfolio-area li");   //hover事件
            $(".btn-edit").on("click",function () {
                var href = "news-list-add.html",
                    title = "添加图片",
                    data = {},
                    figureImg = "";
                figureImg = $(this).parent("div").attr("figureImg");
                var pictureId = $(this).parent("div").attr("pic-id");
                var newsId =  parent.window.layerViewData.newsId;
                if(addId!=""){ //富文本编辑添加图片
                    sessionStorage.setItem("typeId",typeId);
                    sessionStorage.setItem("figureImg",figureImg);
                    sessionStorage.setItem("pictureId",pictureId);
                    sessionStorage.setItem("newsId",newsId);
                    window.location.replace("news-ueditor-cut.html");
                }else{ //主图添加
                    sessionStorage.setItem("typeId",typeId);
                    sessionStorage.setItem("figureImg",figureImg);
                    sessionStorage.setItem("pictureId",pictureId);
                    sessionStorage.setItem("newsId",newsId);
                    window.location.replace("news-pic-cut.html");
                }

            });
        }

        /*渲染表格和分页的方法,传入要向后台传的数据*/
        function renderingPage (sendData)
        {
            /*
             * 获取表格中数据
             * */
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "general/image/findByPage",
                data: sendData,
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        setTable(data);
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
                                    var title = $('.input-text').val();
                                    var sendData = {
                                        pageSize: pageSize,
                                        pageNo: obj.curr,
                                        title:title
                                    };

                                    $.myAjax({
                                        type: "POST",
                                        // url: window.ajaxUrl + "preSupport/requirements/findPageWithArea",
                                        url: window.ajaxUrl + "general/image/findByPage",
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
                                '<li class="con_num_100"><span>100</span></li>'+
                                '<li class="con_num_200"><span>200</span></li>'+
                                '<li class="con_num_1000"><span>1000</span></li>'+
                                '</ul>'+
                                '</div>');
                            $('.pagination').append("<div class='con_altogether'><span>共<span class='allpage'>"+data.data.totalCount+"</span>条</span></div>");
                        }
                        //分页结束
                        $(".allpage").text(data.data.totalCount);
                        // $.Huihover(".portfolio-area li");

                    }
                }
            });
        }
        var title = $('.input-text').val();
        sendData = {
            pageSize: pageSize,
            pageNo: pageNo,
            title:title
        };
        renderingPage (sendData);

        /*查询*/
        function findList()
        {
            var sendData = {};
            var title = $('.input-text').val();
            sendData = {
                pageSize: pageSize,
                pageNo: pageNo,
                title:title
            };
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
                pageNo: pageNo
            };
            renderingPage (sendData);
            return false;
        });
        /*
         * 按钮区按钮点击事件
         * */
        tbody.on("click", ".td-view,.btns .edi", function ()
        {
            var href = "news-editor.html",
                title = "图片编辑",
                data = {},
                src="";
            src = $(this).parent().prev().prev().prev().find(".imgWrap img").attr("src");
            data.src = src;
            window.layerViewData = data;
            window.layerShow(title,href);
        });


        $(".btn-add").on("click", function ()
        {
            var data = {},
                treeId = $(".tree .clr-blue").parents("li").attr("treeId");

            data.treeId = treeId;
            window.layerViewData = data;
            window.layerShow("添加图片","news-pic-add.html");
        });

    });

}(jQuery, window, document));

