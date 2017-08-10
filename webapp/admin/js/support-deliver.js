/**
 * 本文件的功能
 *@author 鲍哲
 */
(function($, w, d)
{

    $(function()
    {
        var reqId = parent.window.layerViewData.reqId,
        taskId = parent.window.layerViewData.taskId;
        var model = $("#deliver_model");

        $.Huitab("#tab-category .tabBar span","#tab-category .tabCon","current","click","0");
        //提交数据
        function saveData(event)
        {
            var _this = $(this);
            var needInput = $("[con_name]"),
                len = needInput.length;
            var obj = {};

            obj.assignee = model.find("[con_name='assignee']").val();
            obj.businesslogRemark = model.find("[con_name='businesslogRemark']").val();
             obj.reqId = reqId;
             obj.taskId = taskId;
            console.log(obj)
            $.myAjax({
                type:"POST",
                url:window.ajaxUrl + "preSupport/workFlow/transfer",
                data:obj,
                success:function(data)
                {
                    console.log(data);
                    layer.confirm('提交成功', {
                            btn: ['关闭'],
                            shade: false

                        },
                        function()
                        {
                            var index = parent.layer.getFrameIndex(window.name);
                            parent.window.location.replace(parent.window.location.href);
                            parent.layer.close(index);
                        }
                    )


                },
                error:function(data)
                {
                    console.log(data);
                    /*  article_submit(_this,"操作未成功,请重新操作或关闭");*/
                }
            });
        }

        var submitBtn = model.find(".btns-group button").eq(0);
        submitBtn.on("click",saveData);

    })






}(jQuery, window, document))