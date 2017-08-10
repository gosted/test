/**
 * 本文件的功能是图片库编辑查询js文件
 * @ author 彭佳明
 */


(function($, w, d){
    'use strict';

    $(function() {
        var tbody = $(".tbody"),
            pageSize = 20,
            pageNo = 1,
            sendData = {pageSize:pageSize,pageNo:pageNo};

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
                    str += "<tr class='text-c btns' reg-id="+list[i].pictureId+">"+
                        "<td width='25'><input type='checkbox' name='' value=''></td>"+
                        "<td>" +
                        "<div class='imgWrap'>" +
                        "<div pic-id="+list[i].pictureId+" figureImg="+list[i].figureImg+" style='cursor:pointer'><img src=" + list[i].figureSrc+"></div>" +
                        "</div>" +
                        "</td>"+
                        "<td style='text-align:left;text-indent:10px;'>"+list[i].title+"</td>"+
                        "<td width='200'>"+list[i].keyWord+"</td>"+
                        "<td width='120'>"+
                        "<a style='text-decoration:none' class='ml-5 edi' href='javascript:;' title='编辑' _href='support-lib-edit.html'><i class='Hui-iconfont'></i></a>" +
                        "<a style='text-decoration:none' type='delete' class='ml-5 del' href='javascript:;' title='删除'><i class='Hui-iconfont'></i></a>"+
                        "</td>"+
                        "</tr>";
                }
                return str;
            };
            if (list.length === 0)
            {
                $(".no-data").show();
            }
            else
            {
                $(".no-data").hide();
            }
            tbody.html(getData(pageNo));
        }

        /*-----------------------渲染表格和分页的方法,传入要向后台传的数据--------------------*/

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
                                var title = $(".input-text").val();
                                var keyWord = $(".keyWord").val();
                                if(!first){ //点击跳页触发函数自身，并传递当前页：obj.curr
                                    sendData = {
                                        pageSize: pages,
                                        pageNo: obj.curr,
                                        title:title,
                                        keyWord:keyWord

                                    };
                                    $.myAjax({
                                        type: "POST", //此处为获取图片列表接口
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
                            $('.pagination').append("<div class='con_altogether'><span>总共<span class='allpage'>"+pageCount+"</span>页</span></div>");      //总共多少页
                        }
                        //分页结束
                        $(".allpage").html(pageCount);
                    }
                }
            });
        }

        renderingPage (sendData);
        function deletePic(sendData){
            $.myAjax({
                type: "POST", //此处为删除图片接口
                url: window.ajaxUrl + "general/image/deleteFileById",
                data: sendData,
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        layer.msg('已删除', {icon: 1,time:1000});
                        setTimeout(function(){ window.location.replace(window.location.href);},500)

                    }
                }
            });
        }
        /*----------------------------------  查询  --------------------------------*/
        function findList()
        {
            var sendData = {};
            var title = $(".input-text").val();
            var keyWord = $(".keyWord").val();
            if(title!=""||keyWord!=""){
                 sendData = {keyWord:keyWord,title:title,pageNo:pageNo,pageSize:pageSize};
            }else{
                sendData = {keyWord:keyWord,title:title,pageNo:pageNo,pageSize:20};
            }

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
            var title = $(".input-text").val();
            $(".con_list_num").html(_num);
            var sendData = {pageSize:_num,pageNo:1,title:title};
            renderingPage(sendData);
            $(this).parent().parent().css({display:"none"});
        });

         /*-----------------------------   图片编辑点击 -------------------------------*/
        tbody.on("click", ".td-view,.btns .edi", function ()
        {
            var href = "news-editor.html",
                pageTitle = "图片编辑",
                data = {},
                src="";

            src = $(this).parent().prev().prev().prev().find(".imgWrap div").attr("figureImg");
            var reg = /url/g;
            var url = src.match(reg);
            var figure=src.replace(url,"").replace('("',"").replace('")',"");
            var keyWord = $(this).parent().prev().text();
            var title = $(this).parent().prev().prev().text();
            var taskId = $(this).parent().parent().attr("reg-id");
            data.figure = figure;
            data.reqId = taskId;
            data.keyWord = keyWord;
            data.title= title;
            window.layerViewData = data;
            window.layerShow(pageTitle,href);
        });
        /*------------------------------   删除部分 --------------------------*/
        tbody.on("click", ".td-view,.btns .del", function ()
        {
            var picId = $(this).parent().parent().attr("reg-id"),
                sendData = {pictureId:picId};

            layer.confirm('确定删除', {
                    btn: ['确定',"取消"],
                    shade: 0.1
                },
                function () {
                    deletePic(sendData);
                    $(".layui-layer").css({display:"none"});
                    $(".layui-layer-shade").css({display:"none"});
                },
                function(){
                    layer.msg('已取消', {icon: 2,time:1000});
                }
                );
        });
        /*--------------------------------------删除部分结束--------------------------*/
        $(".btn-add").on("click", function ()
        {
            window.layerShow("添加图片","news-pic-add.html?id=0");
        });

    });

}(jQuery, window, document));

