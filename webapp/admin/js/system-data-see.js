/**
 * 本文件的功能是数据字典查看js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var libId = parent.window.layerViewData.libId,
            dictid = parent.window.layerViewData.dictid;

        //添加40个td
        window.getTd($(".form-table"));

        //请求已有信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/dictionary/findByIds",
            data: {"id": libId},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    $(".dictItem").text(dictid);
                    $(".dictCodeName").text(data.data.dictCodeName);                              //字典名称
                    $(".dictCode").text(data.data.dictCode);                                       //字典代码
                    $(".dictCodeValue").text(data.data.dictCodeValue);                           //字典值
                    $(".dictParentId").text(data.data.dictAllName);                                //父级字典
                    $(".dictSort").text(data.data.dictSort);                                       //排序
                    $(".dictRemarks").text(data.data.dictRemarks);                                //备注


                    if(data.data.dictState && data.data.dictState == 1){
                        $(".dictState").text("禁用");
                    }
                    else{
                        $(".dictState").text("启用");//启用禁用
                    }

                }
            }
        });

        //返回
        $(".return").on("click",function(){
            parent.window.location.replace(parent.window.location.href);
        })


    });
}(jQuery, window, document));

