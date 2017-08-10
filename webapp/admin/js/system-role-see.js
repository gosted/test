/**
 * Created by baozhe  on 2016/12/22.
 * 本文件的功能
 *@author 鲍哲
 */
(function($, w, d) {
    'use strict';
    $(function(){

        var tbody = $(".tbody"),
            pageSize = 1000,
            pageNo = 1;
        var roleId = parent.window.layerViewData.roleId;
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

                STr = $('<tr class="text-c" userId="'+ v.id+'"></tr>');//一行
                STr.append('<td class="checkbox"><input type="checkbox"></td>');

                STr.append('<td>' + v.userName + '</td>');
                STr.append('<td>' + v.userRealName + '</td>');
                STr.append('<td>' + v.userMajorUnit + '</td>');


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
         * 查询后渲染表格方法传入请求到的数据
         * */
        function searchTable (data)
        {
            var list = [],
                tbody = $(".tbody"),
                STr = null;

            list = data.data;
            tbody.html("");
            console.log(list);
            $.each(list, function (i, v)
            {

                STr = $('<tr class="text-c" userId="'+ v.id+'"></tr>');//一行
                STr.append('<td class="checkbox"><input type="checkbox"></td>');

                STr.append('<td>' + v.userName + '</td>');
                STr.append('<td>' + v.userRealName + '</td>');
                STr.append('<td>' + v.userMajorUnit + '</td>');


                tbody.append(STr);
                /*
                 * tr颜色间隔问题
                 * */
                var trs = tbody.find("tr");
                for(var i=0; i<trs.length;i++){
                    if(i%2 == 0){
                        trs[i].style="background:#fff";
                    }else{
                        trs[i].style="background:#eee";
                    }
                }
            });
        }

        /*
         * 获取表格中数据
         * */
        function initTable (obj)
        {
            console.log("5555",obj.roleId)
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl+"general/role/findPageUserRole",
                data: {pageSize: obj.pageSize, pageNo: obj.pageNo,roleId:roleId},
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        console.log(data);
                        setTable(data);

                    }
                }
            });

        }
        initTable ({pageSize: pageSize, pageNo: pageNo, id: roleId});

        /*
         * 按钮区查询事件
         */
        function findList(){
            var userName = $('input[con_name="userName"]').val();
            var userRealName = $('input[con_name="userRealName"]').val();

            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "general/role/findUserRoleByName",
                data: {
                    pageSize: pageSize,
                    pageNo: pageNo,
                    userName:userName,
                    userRealName:userRealName,
                    roleId :roleId
                },
                success: function (data)
                {
                    console.log(data);
                    if (data && data.success === 0)
                    {
                        searchTable(data);
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
        
        //清空
        $(".btn-empty").on("click",function(){
            $('input[con_name="userName"]').val("");
            $('input[con_name="userRealName"]').val("");
        });







    });
}(jQuery, window, document));