/**
 * 本文件的功能是人员管理查看js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var libId = parent.window.layerViewData.libId;
        //添加40个td
        window.getTd($(".table-box>.form-table"));

        //请求已有信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/user/findUserById",
            data: {"id": libId},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    var box = $("#libAdd");

                    setFormInfo(box,data);

                    if(data.data.userState && data.data.userState == 1){
                        //$(".radio_box_jy").attr("checked","checked");//启用禁用
                        $(".userState").text("禁用");
                    }
                    else{
                        //$(".radio_box_qy").attr("checked","checked");
                        $(".userState").text("启用");
                    }
                    if(data.data.userSex && data.data.userSex == 1){
                        //$(".radio_box_na").attr("checked","checked");//女
                        $(".userSex").text("女");
                    }
                    else{
                        //$(".radio_box_nv").attr("checked","checked");
                        $(".userSex").text("男");
                    }

                    $(".userBirthday").text(window.formatDates(data.data.userBirthday));  //出生日期
                    $(".createTime").text(window.formatDateTimesec(data.data.createTime));      //创建时间
                    $(".modifyTime").text(window.formatDateTimesec(data.data.modifyTime));      //修改时间
                    $(".userLastLoginTime").text(window.formatDateTimesec(data.data.userLastLoginTime));  //登录时间
                }
            }
        });

        /*
         * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
         * */
        function setFormInfo (box,data)
        {
            var conNames = box.find('[con_name]'),
                _data = data.data,
                key = "",
                keyVal = "",
                _radio = null,
                chkArr = [],
                date = "";
            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                keyVal = _data[key];
                if (keyVal)
                {
                    if (conNames.eq(i).attr("type") === "radio")
                    {
                        _radio = conNames.eq(i).parents(".radio-box").find('input[value="'+keyVal+'"]');
                        _radio.parents(".iradio-blue").addClass("checked");
                    }
                    else if (conNames.eq(i).attr("type") === "checkbox")
                    {
                        chkArr = keyVal.split(",");
                        for (var j= 0,len2=keyVal.length; j<len2; j++)
                        {
                            conNames.eq(i).parents(".formControls").find('input[value="'+chkArr[j]+'"]').attr("checked","checked");
                        }
                    }
                    else
                    {
                        if (conNames.eq(i).attr("_type") === "date")
                        {
                            date = window.formatDates(keyVal);
                            conNames.eq(i).text(date);
                        }
                        else if (conNames.eq(i).attr("_type") === "time")
                        {
                            date = window.formatDateTimes(keyVal);
                            conNames.eq(i).text(date);
                        }
                        else
                        {
                            conNames.eq(i).text(keyVal);
                        }
                    }
                }
            }
        }

        //我的权限
        function setPowerTable (obj)
        {
            var table = $(obj.table),
                data = obj.data,
                OTr = null;

            for (var i= 0, len=data.length; i<len; i++)
            {
                OTr = $('<tr></tr>');
                OTr.append('<td>'+ data[i].arType +'</td>');
                OTr.append('<td>'+ data[i].areaName +'</td>');
                OTr.append('<td class="yes-no">'+ (data[i].arIsCompatibility === 1 ? "是" : "否") +'</td>');
                table.append(OTr);
            }
        }
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "preSupport/areaRelative/findByUserIdNew",
            data:{"id":libId},
            success: function (data) {
                if (data && data.success === 0)
                {
                    if (data.data[0] && data.data[0] != {})
                    {
                        setPowerTable({
                            table: ".power",
                            data: data.data
                        });
                    }
                    else
                    {
                        $(".power-box").hide();
                    }
                }else{
                    $(".power-box").hide();
                }
            }
        });


        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
         * */
        function getFormInfo (box)
        {
            var conNames = box.find('[con_name]'),
                key = "",
                keyVal = "",
                userState="",
                sendData = {},
                userStateVal = {},
                checkbox = null;

            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                if (conNames.eq(i).attr("type") === "radio")
                {
                    keyVal = $('input[name="userSex"]:checked ').val();
                    userState = $('input[name="userState"]:checked ').val();
                }
                else
                {
                    keyVal = conNames.eq(i).val();
                    userState = conNames.eq(i).val();
                }
                sendData[key] = keyVal;
                userStateVal[key] = userState;
            }
            return sendData;
            return userStateVal;
        }


    });
}(jQuery, window, document));

