/**
 * Created by baozhe  on 2017/03/27.
 * 本文件是施工工单回显的js文件
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){
        var pageSize = 1000,
            subprojectId = "",
            id = parent.window.layerViewData.projectId,
            taskId = parent.window.layerViewData.taskId,
            workType = parent.window.layerViewData.workType;
        window.getTd($(".form-table"));
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "/project/workOrder/findApproval",
            data: {workOrderId:id},
            success: function (data)
            {
                if (data && data.success === 0)
                {
                    $(".approver").text(data.data.apprApprover);
                    var date = new Date(data.data.apprTime);
                    $(".approval-time").text(window.formatDate(date));
                    $(".approval-opinion").text(data.data.apprOption);
                }
            }
        });

        /*
         * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
         * */

        function setFormInfo (box,data)
        {
            var conNames = box.find('[name]'),
                _data = data.data,
                key = "",
                keyVal = "",
                _radio = null,
                chkArr = [],
                date = "";
            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("name");
                keyVal = _data[key];
                if (keyVal)
                {
                     conNames.eq(i).val(keyVal);
                    //$('[con_name="remark"]').keyup();
                }
            }
        }

//显示清单方法
        function showList (data,save,edit)
        {
            var equTbody = $(".equipment-cnt tbody"),
                serbody = $(".server-cnt tbody"),
                othTbody = $(".other-cnt tbody"),
                STr = null;
            $.each(data, function (i, v)
            {
                var id = v.id || "",
                    tempDiv = null,
                    tmpBtn = "";
                if (save === false)
                {
                    id = "";
                }

                if (v.detailType === "QDLX-SB")
                {
                    STr = $('<tr class="text-c" save="'+ save
                        +'" delid="'+ id
                        +'" detailType="'+ v.detailType
                        +'"></tr>');//一行

                    tempDiv = $('<div con_name="detailName"></div>');
                    tempDiv.text(v.detailName || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailModel"></div>');
                    tempDiv.text(v.detailModel || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailCompany"></div>');
                    tempDiv.text(v.detailCompany || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailCount"></div>');
                    tempDiv.text(v.detailCount || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailUnit"></div>');
                    tempDiv.text(v.detailUnit || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="equipmentId" equipmentId="'+ (v.equipmentId || "") +'"></div>');
                    tempDiv.text(v.equipmentName || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailRemark"></div>');
                    tempDiv.text(v.detailRemark || "");
                    STr.append($('<td></td>').append(tempDiv));



                    tmpBtn = '<td class="btns">';
                    tmpBtn += '<a style="text-decoration:none" class="ml-5 deal" href="javascript:;" title="编辑" _href="pro-child-edit.html">'+
                        '<i class="Hui-iconfont">&#xe70c;</i></a>';

                    tmpBtn += '<a style="text-decoration:none" class="ml-5 delete" href="javascript:;" title="删除">'+
                        '<i class="Hui-iconfont">&#xe6e2;</i></a>' +
                        '</td>';

                    STr.append(tmpBtn);
                    equTbody.find("tr").eq(1).after(STr);
                }
                else if (v.detailType === "QDLX-FW")
                {
                    STr = $('<tr class="text-c" save="'+ save
                        +'" delid="'+ id
                        +'" detailType="'+ v.detailType
                        +'"></tr>');//一行

                    tempDiv = $('<div con_name="detailName"></div>');
                    tempDiv.text(v.detailName || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailStartDate"></div>');
                    if (typeof (v.detailStartDate) == "object" && v.detailStartDate.time)
                    {
                        tempDiv.text(window.formatDates(v.detailStartDate.time) || "");
                    }
                    else
                    {
                        tempDiv.text(window.formatDates(v.detailStartDate) || "");
                    }
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailEndDate"></div>');
                    if (typeof (v.detailEndDate) == "object" && v.detailEndDate.time)
                    {
                        tempDiv.text(window.formatDates(v.detailEndDate.time) || "");
                    }
                    else
                    {
                        tempDiv.text(window.formatDates(v.detailEndDate) || "");
                    }
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div  con_name="detailCount"></div>');
                    tempDiv.text(v.detailCount || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailUnit"></div>');
                    tempDiv.text(v.detailUnit || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailRemark"></div>');
                    tempDiv.text(v.detailRemark || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tmpBtn = '<td class="btns">';
                    tmpBtn += '<a style="text-decoration:none" class="ml-5 deal" href="javascript:;" title="编辑" _href="pro-child-edit.html">'+
                        '<i class="Hui-iconfont">&#xe70c;</i></a>';

                    tmpBtn += '<a style="text-decoration:none" class="ml-5 delete" href="javascript:;" title="删除">'+
                        '<i class="Hui-iconfont">&#xe6e2;</i></a>' +
                        '</td>';
                    STr.append(tmpBtn);
                    serbody.find("tr").eq(1).after(STr);
                }
                else
                {
                    STr = $('<tr class="text-c" save="'+ save
                        +'" delid="'+ id
                        +'" detailType="'+ v.detailType
                        +'"></tr>');//一行

                    tempDiv = $('<div con_name="detailName"></div>');
                    tempDiv.text(v.detailName || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailRemark"></div>');
                    tempDiv.text(v.detailRemark || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailCount"></div>');
                    tempDiv.text(v.detailCount || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailUnit"></div>');
                    tempDiv.text(v.detailUnit || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tmpBtn = '<td class="btns">';
                    tmpBtn += '<a style="text-decoration:none" class="ml-5 deal" href="javascript:;" title="编辑" _href="pro-child-edit.html">'+
                        '<i class="Hui-iconfont">&#xe70c;</i></a>';

                    tmpBtn += '<a style="text-decoration:none" class="ml-5 delete" href="javascript:;" title="删除">'+
                        '<i class="Hui-iconfont">&#xe6e2;</i></a>' +
                        '</td>';
                    STr.append(tmpBtn);
                    othTbody.find("tr").eq(1).after(STr);
                    $(".textarea1").val("");
                }
                if (edit === true)
                {
                    STr.find(".deal").click();
                }
            });
        }
        //请求数据
        function getType()
        {
            $.myAjax({
                type: "GET",
                url: window.ajaxUrl +"project/workOrder/findWorkOrder/"+id, //传入工单id
                data: {},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        var box = $("#roleAdd"),
                            list = null,
                            deviceList = null,
                            listStr = null;
                        setFormInfo(box,data);//基本信息

                        //是否发送邮件
                        if(data.data.isSendEmail && data.data.isSendEmail === 1){
                            $(".isSendEmail").attr("checked","checked");//
                        }
                        else{
                        }
                        //是否发送消息
                        if(data.data.isSendMsg && data.data.isSendMsg === 1){
                            $(".isSendMsg").attr("checked","checked");//禁用
                        }
                        else{

                        }
                        //请求清单信息
                        $.myAjax({
                            type:"POST",
                            url: window.ajaxUrl +"project/proDeviceList/findByWorkOrderId",
                            data:{workOrderId:id},
                            datatype:"json",
                            success:function(data)
                            {
                                if(data.data && data.success === 0)
                                {
                                    var equTbody = $(".equipment-cnt tbody"),
                                        serbody = $(".server-cnt tbody"),
                                        othTbody = $(".other-cnt tbody"),
                                        STr = null;
                                    deviceList = data.data.result;
                                    showList (deviceList, false, false);
                                    $.each(deviceList,function(i,v)
                                    {
                                        var id = v.id,
                                            tempDiv = null,
                                            tmpBtn = "";
                                        subprojectId = v.subprojectId || "";

                                    })
                                }

                            }
                        });

                        //请求项目信息
                        if( data.data.project ){
                            $.myAjax({
                                type:"POST",
                                url: window.ajaxUrl +"project/project/findById",
                                data:{id:data.data.project},
                                datatype:"json",
                                success:function(data)
                                {
                                    if(data.data && data.success === 0)
                                    {

                                        $(".project").parent().attr("projectId",data.data.id)
                                        $(".project").append($("<option></option>").text(data.data.projectName).attr("selected","true"));
                                    }

                                }
                            })
                        }
                        //请求工地信息
                        if( data.data.site ){
                            $.myAjax({
                                type:"POST",
                                url:window.ajaxUrl +"project/workSite/findByProjectId",
                                data:{id:data.data.site},
                                datatype:"json",
                                success:function(data)
                                {
                                    if(data.data && data.success === 0)
                                    {
                                        $(".worksite").parent().attr("projectId",data.data.id)
                                        $(".worksite").append($("<option></option>").text(data.data.worksiteName).attr("selected","true"));
                                    }

                                }
                            })
                        }

                        //请求子项目

                        if( data.data.subProject ){
                            $.myAjax({
                                type:"POST",
                                url:window.ajaxUrl +"project/subProject/findByProjectId",
                                data:{id:data.data.subProject},
                                datatype:"json",
                                success:function(data)
                                {
                                    if(data.data && data.success === 0)
                                    {
                                        console.log(data);
                                        $(".subProject").parent().attr("subprojectId",data.data.id)
                                        $(".subProject").append($("<option></option>").text(data.data.subprojectName).attr("selected","true"));
                                    }

                                }
                            })
                        }

                        //请求extensionInfos中的json数据
                        if(data.data.extensionInfos)
                        {

                            list = data.data.extensionInfos;
                            listStr = JSON.parse(list);
                            $.each(listStr,function(i,v){
                                /* console.log( $(".contract"));
                                 console.log(v.contract);*/
                                $(".contract").val(v.contract);
                                $(".contractNumber").val(v.contractNumber);
                                $(".consignee").val(v.consignee);
                                $(".consigneePhone").val(v.consigneePhone);
                                $(".str").find("option").each(function(i,o){
                                    if($(this).text()==v.partnerId){
                                        $(this).attr("selected","true");
                                        $(this).parent().parent().attr("strId",$(this).val());
                                    }
                                })
                            })

                        }
                    }
                }
            });

        };
        getType();

        //请求类型
        (function getTypeo()
        {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/proDeviceList/findDictionaryGDLX",
                data: {},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        var relevantType = $(".relevant-type"),
                            option = null;
                        for (var i = 0, l = data.data.length; i < l; i++)
                        {
                            option = $('<option value="'+ data.data[i].dictCodeValue+'"></option>');
                            option.text(data.data[i].dictCodeName);
                            relevantType.append(option);
                        }

                        //相关编号
                        $(".relevant").on("click", function ()
                        {
                            var subProjectId = $(".subProject option:selected").val();
                            window.layerViewData = {
                                workType :$(".relevant-type option:selected").val(),
                                subProjectId :subProjectId,
                                projectName :$(".project option:selected").text(),
                                subProjectName :$(".subProject option:selected").text()
                            };
                            if(subProjectId !== null && subProjectId !== "" &&
                                subProjectId !== undefined && subProjectId !== "undefined")
                            {
                                window.layerShow("工单","pro-workOder-list.html");
                            }
                            else
                            {
                                layer.msg("请选择子项目")
                            }

                        });
                    }
                }
            });
        })();
        //tab切换
        $(".textarea1").val("");
        $.Huitab("#tab-category .tabBar span","#tab-category .tabCon","current","click",0);


    });
}(jQuery, window, document));