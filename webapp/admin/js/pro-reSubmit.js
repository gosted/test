/**
 * 本文件是出库工单退回编辑的js文件
 *@author 王步华
 */

(function($, w, d) {
    'use strict';
    $(function(){
        var pageSize = 1000,
        //selected = false,
            subprojectId = "",
            uploadFile = $(".upload-file"),
            id = parent.window.layerViewData.projectId,
            taskId = parent.window.layerViewData.taskId,
            workType = parent.window.layerViewData.workType;
        window.getTd($(".form-table"));

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
                            conNames.eq(i).val(date);
                        }
                        else if (conNames.eq(i).attr("_type") === "time")
                        {
                            date = window.formatDateTimes(keyVal);
                            conNames.eq(i).val(date);
                        }
                        else
                        {
                            conNames.eq(i).val(keyVal);
                        }
                    }
                }
            }
        }

        /*
         *回显数据
         * */
        function getType()
        {
            $.myAjax({
                // data: {id:id},//传入工单id
                type: "GET",
                url: window.ajaxUrl +"project/workOrder/findWorkOrder/"+id,
                data: {},//传入工单id
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        var box = $("#roleAdd"),
                            list = null,
                            deviceList = null,
                            STr = null,
                            tbody = $(".tbody1"),
                            deviceListStr = null,
                            listStr = null;
                        setFormInfo(box,data);//基本信息

                        $(".project").attr("id",data.data.project);
                        $(".project").attr("site",data.data.site);
                        $(".project").attr("subProjectId",data.data.subProjectId);
                        $("#table-box").attr("workFlowId",data.data.workFlowId);

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
                            data:{
                                workOrderId:id,
                                pageSize:pageSize
                            },
                            datatype:"json",
                            success:function(data)
                            {
                                if(data.data && data.success === 0)
                                {
                                    deviceList = data.data.result;
                                    $.each(deviceList,function(i,v)
                                    {
                                        STr = $('<tr class="text-c" id="'+ v.id+'" equipmentId="'+ v.equipmentId+'"></tr>');//一行
                                        STr.append('<td class="authName" title='+ v.detailName+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange arr" value="'+v.detailName+'"></td>');
                                        STr.append('<td class="authName" title='+ v.detailModel+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange arr" value="'+v.detailModel+'"></td>');
                                        STr.append('<td class="authName" title='+ v.detailCompany+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange arr" value="'+v.detailCompany+'"></td>');
                                        STr.append('<td class="authName" title='+ v.detailUnit+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange arr" value="'+v.detailUnit+'"></td>');
                                        STr.append('<td class="authName" title='+ v.detailCount+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange arr" value="'+v.detailCount+'"></td>');
                                        if(v.equipmentName == null)
                                        {
                                            STr.append('<td class="input-tree"><input type="text" readonly="readonly" disabled="disabled" class="needChoose input-text inp-text widthChange" readonly con_name="equipmentId" value="" equipmentId="'+ v.equipmentId+'"><ul class="tree"></ul></td>');
                                        }
                                        else{
                                            STr.append('<td class="input-tree"><input type="text" readonly="readonly" disabled="disabled" class="needChoose input-text inp-text widthChange" readonly con_name="equipmentId" value="'+ v.equipmentName+'"><ul class="tree"></ul></td>');
                                        }
                                        STr.append('<td class="eidt"><a href="javascript:;" class="edit"><i class="Hui-iconfont changePos" title="编辑" style="font-size: 18px">&#xe70c;</i></a>'+
                                            '<a href="javascript:;" class="del"><i class="Hui-iconfont" title="删除" style="font-size: 18px">&#xe609;</i></a></td>');
                                        tbody.append(STr);
                                    })
                                }

                            }
                        })

                        //请求extensionInfos中的json数据
                        if(data.data.extensionInfos)
                        {
                            list = data.data.extensionInfos;
                            listStr = JSON.parse(list);
                            $.each(listStr,function(i,v){
                                $(".contract").val(v.contract);
                                $(".contractNumber").val(v.contractNumber);
                                $(".consignee").val(v.consignee);
                                $(".consigneePhone").val(v.consigneePhone);
                                $(".consigneeEmail").val(v.consigneeEmail);
                                $(".consigneeAdd").val(v.consigneeAdd);
                                $(".storageName").text(v.storageName);
                                $(".storageName").attr("storageName",v.storageName);
                                getFile(v.attachmentId);
                            })

                        }
                    }
                    getTypes();
                }
            });

        };
        getType();

        /*
         * 请求附件信息
         * */
        function getFile(ids) {
            if(ids == null || ids == undefined || ids == "")
            {

            }
            else
            {
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/attachment/findByIds",
                    data: {ids: ids},
                    success: function (msg) {
                        if (msg && msg.success === 0) {
                            var attachm = msg.data,
                                List="";
                            $.each(attachm, function (i, data) {
                                var plantype = data.attachName,  //文件名称
                                    index = plantype .lastIndexOf(".");
                                plantype  = plantype .substring(index + 1, plantype .length);

                                var planimg;
                                //判断文档类型
                                function planpic() {
                                    if (plantype == "doc" || plantype == "docx") {
                                        planimg = "../../images/commen/doc.png";
                                    }
                                    else if (plantype == "ppt" || plantype == "pptx") {
                                        planimg = "../../images/commen/ppt.png";
                                    }
                                    else if (plantype == "xls" || plantype == "xlsx") {
                                        planimg = "../../images/commen/xlsx.png";
                                    }
                                    else if (plantype == "zip" || plantype == "rar") {
                                        planimg = "../../images/commen/zip.png";
                                    }
                                    else if (plantype == "txt") {
                                        planimg = "../../images/commen/txt.png";
                                    }
                                    else if (plantype == "avi" || plantype == "mp4" || plantype == "wma" || plantype == "rmvb" || plantype == "3GP" || plantype == "flash" || plantype == "rm" || plantype == "mid") {
                                        planimg = "../../images/commen/video.png";
                                    }
                                    else if (plantype == "pdf") {
                                        planimg = "../../images/commen/pdf.png";
                                    }
                                    else if (plantype == "mp3") {
                                        planimg = "../../images/commen/audio.png";
                                    }
                                    else if (plantype == "jpg" || plantype == "png") {
                                        planimg = "../../images/commen/png.png";
                                    }
                                    else {
                                        planimg = "../../images/commen/unknown.png";
                                    }
                                    return planimg;
                                }

                                planpic();

                                List += '<p lastmodified="" attachid="'+data.attachId+'" style="cursor:pointer;">'+
                                    '<img src="'+planimg+'">'+
                                    '<span>'+data.attachName+'</span>'+
                                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="btn btn-success radius ml-10"><i class="Hui-iconfont"></i>删除</a>'+
                                    '</p>'
                            });
                            $(".table-box").find(".file-list").append(List);
                        }
                    }
                })
            }

        }

        /*
        *请求数据
        * */
        function getTypes()
        {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl +"project/project/findProjectByUserId",
                data: {},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        var project = $(".project"),
                            option = null;
                        project.html("");
                        project.append('<option value="">请选择</option>');
                        for (var i = 0, l = data.data.length; i < l; i++)
                        {
                            option = $('<option value="'+ data.data[i].id+'"></option>');
                            option.text(data.data[i].projectName);
                            project.append(option);
                        }
                        var proid =  $(".project").attr("id");
                        $(".project").children('[value="'+proid+'"]').attr("selected","true");

                        if($(".project option[value='"+proid+"']").attr("selected") == "selected"){
                            $(".project").parent(".input-tree").attr("projectId",proid);

                            if(project.parent(".input-tree").attr("projectId")){
                                var worid = $(".project").attr("site");
                                var subProjectId = $(".project").attr("subProjectId");
                                //获取工地
                                $.myAjax({
                                    type:"POST",
                                    url:window.ajaxUrl +"project/workSite/findByProjectId",
                                    data:{projectId:$(".project").parent(".input-tree").attr("projectId")},
                                    dataType:"json",
                                    success:function(data)
                                    {
                                        if(data && data.success === 0)
                                        {
                                            var worksite = $('.worksite'),
                                                workoption = null;
                                            worksite.html("");
                                            worksite.append('<option value="">请选择</option>');
                                            for (var i = 0, l = data.data.length; i < l; i++)
                                            {
                                                workoption = $('<option value="'+ data.data[i].id+'"></option>');
                                                workoption.text(data.data[i].worksiteName);
                                                worksite.append(workoption);
                                            }
                                            $(".worksite option[value='"+worid+"']").attr("selected",true);
                                            $(".worksite").on('change',function(){
                                                $(this).parent(".input-tree").attr("projectId",$(this).val());
                                            });
                                        }
                                    }
                                })

                                //获取子项目
                                $.myAjax({
                                    type:"POST",
                                    url:window.ajaxUrl +"project/subProject/findByProjectId",
                                    data:{projectId:$(".project").parent(".input-tree").attr("projectId")},
                                    dataType:"json",
                                    success:function(data)
                                    {
                                        if(data && data.success === 0)
                                        {
                                            var subProject = $('.subProject'),
                                                suboption = null;
                                            subProject.html("");
                                            subProject.append('<option value="">请选择</option>');
                                            for (var i = 0, l = data.data.length; i < l; i++)
                                            {
                                                suboption = $('<option value="'+ data.data[i].id+'"></option>');
                                                suboption.text(data.data[i].subprojectName);
                                                subProject.append(suboption);

                                            }
                                            $(".subProject option[value='"+ subProjectId +"']").attr("selected",true);
                                            $(".subProject").on('change',function(){
                                                $(this).parent(".input-tree").attr("subProjectId",subProjectId);
                                                //根据子项目获取清单
                                                if(subProject.parent(".input-tree").attr("subProjectId"))
                                                {
                                                    $.myAjax({
                                                        type:"POST",
                                                        url:window.ajaxUrl +"project/subProject/findDetailBySubId",
                                                        data:{subprojectId:subProject.parent(".input-tree").attr("subProjectId"),
                                                            detailType:"QDLX-SB"},
                                                        dataType:"json",
                                                        success:function(data)
                                                        {
                                                            if(data && data.success === 0)
                                                            {
                                                                var list = [],
                                                                    tbody = $(".tbody1"),
                                                                    flag = false, //储存属性对应的value值
                                                                    flagSave = false,
                                                                    STr = null;
                                                                list = data.data;
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
                                                                    if(v.detailType == "QDLX-SB"){
                                                                        STr = $('<tr class="text-c" id="'+ v.id+'" equipmentId="'+ v.equipmentId+'"></tr>');//一行
                                                                        STr.append('<td class="authName" title='+ v.detailName+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange arr" value="'+v.detailName+'"></td>');
                                                                        STr.append('<td class="authName" title='+ v.detailModel+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange arr" value="'+v.detailModel+'"></td>');
                                                                        STr.append('<td class="authName" title='+ v.detailCompany+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange arr" value="'+v.detailCompany+'"></td>');
                                                                        STr.append('<td class="authName" title='+ v.detailUnit+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange arr" value="'+v.detailUnit+'"></td>');
                                                                        STr.append('<td class="authName" title='+ v.detailCount+'><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange arr" value="'+v.detailCount+'"></td>');
                                                                        if(v.equipmentName == null)
                                                                        {
                                                                            STr.append('<td class="input-tree"><input type="text" readonly="readonly" disabled="disabled" class="needChoose input-text inp-text widthChange" readonly con_name="equipmentId" value="" equipmentId="'+ v.equipmentId+'"><ul class="tree"></ul></td>');

                                                                        }
                                                                        else{
                                                                            STr.append('<td class="input-tree"><input type="text" readonly="readonly" disabled="disabled" class="needChoose input-text inp-text widthChange" readonly con_name="equipmentId" value="'+ v.equipmentName+'"><ul class="tree"></ul></td>');

                                                                        }

                                                                        STr.append('<td class="eidt"><a href="javascript:;" class="edit"><i class="Hui-iconfont changePos" title="编辑" style="font-size: 18px">&#xe70c;</i></a>'+
                                                                            '<a href="javascript:;" class="del"><i class="Hui-iconfont" title="删除" style="font-size: 18px">&#xe609;</i></a></td>');
                                                                        tbody.append(STr);
                                                                    }else{

                                                                    }


                                                                });

                                                                var trs = tbody.find("tr");
                                                                tbody.find(".del").on("click", function()
                                                                { //点击删除
                                                                    var _this = $(this);
                                                                    var id = $(this).parent().parent().attr("id");
                                                                    layer.confirm("确定要删除吗？", {
                                                                            shade: 0.1,
                                                                            btn: ['确定', '取消'] //按钮
                                                                        },
                                                                        function() {
                                                                            _this.parents("tr").remove("");
                                                                            $(".layui-layer-shade").hide();
                                                                            $(".layui-layer").hide();
                                                                            var trs = tbody.find("tr");
                                                                        },
                                                                        function() {
                                                                        })
                                                                });


                                                                tbody.find(".edit").on("click", function() { //点击编辑

                                                                    var _this = $(this),
                                                                        len = _this.parents("tr").find(".needChoose").size(),
                                                                        valAdd = "";
                                                                    for(var i = 0; i < len; i++) {
                                                                        valAdd += _this.parents("tr").find(".needChoose").eq(i).val();
                                                                        if(valAdd) {
                                                                            flag = true;
                                                                        } else {
                                                                            layer.confirm("请填入必填项", {
                                                                                    shade: 0.1,
                                                                                    btn: ['确定'] //按钮
                                                                                },
                                                                                function() {
                                                                                    flag = false;
                                                                                    $(".layui-layer-shade").hide();
                                                                                    $(".layui-layer").hide();
                                                                                },
                                                                                function() {

                                                                                });
                                                                            return false;
                                                                        }
                                                                    }
                                                                    if(flag) {
                                                                        if(!flagSave) {
                                                                            $(this).html('<i class="Hui-iconfont" title="保存">&#xe676;</i>');
                                                                            _this.parents("tr").find("input").css({
                                                                                "border": "1px solid #006BFF"
                                                                            });
                                                                            _this.parents("tr").find("input").removeAttr("disabled", "disabled");
                                                                            _this.parents("tr").find("input").removeAttr("readonly", "readonly");
                                                                            var inputTreeEdit = $(".tbody1").find(".text-c").find(".input-tree");
                                                                            setOneTree({
                                                                                ele: inputTreeEdit,
                                                                                url: ajaxUrl + "project/subProject/findTree",
                                                                                type: "POST",
                                                                                data: {id: 0},
                                                                                id: "id",
                                                                                value: "equipmentName",
                                                                                //all: "全部",//是否有所有这一级
                                                                                treeClick: function ()
                                                                                {
                                                                                    var _this = $(this),
                                                                                        id = _this.parents("li").eq(0).attr("treeId"),
                                                                                        equipmentId = "";
                                                                                    if (_this.hasClass("all"))
                                                                                    {
                                                                                        equipmentId = _this.parents("li").eq(0).attr("allId");
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        equipmentId = id;
                                                                                    }
                                                                                    $(".tbody1").find(".text-c").attr({"equipmentId": equipmentId});
                                                                                }
                                                                            });
                                                                            flagSave = true;
                                                                        } else {
                                                                            _this.html('<i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i>');
                                                                            _this.parents("tr").find("input").css({
                                                                                "border": "1px solid rgb(238,238,238)"
                                                                            });
                                                                            _this.parents("tr").find("input").attr("disabled", "disabled");
                                                                            _this.parents("tr").find("input").attr("readonly", "readonly");
                                                                            flagSave = false;
                                                                        }
                                                                    }
                                                                });

                                                            }
                                                        }
                                                    })
                                                }

                                            });
                                        }
                                    }
                                })
                            }

                        }
                    }
                }
            });

        };


        //获取仓库
        $.myAjax({
            type:"POST",
            url:window.ajaxUrl +"operation/storage/find",
            data:{projectId:$(".project").attr("projectId")},
            dataType:"json",
            success:function(data)
            {
                if(data && data.success === 0)
                {
                    var str = $('.str'),
                        stroption = null,
                        storageName = ($(".storageName").attr("storageName"));
                    str.html("");
                    str.append('<option opName="请选择" value="">请选择</option>');
                    for (var i = 0, l = data.data.length; i < l; i++)
                    {
                        stroption = $('<option opName="'+ data.data[i].storageName+'" value="'+ data.data[i].id+'"></option>');
                        stroption.text(data.data[i].storageName);
                        str.append(stroption);
                    }
                    $(".storageName option[opName='"+storageName+"']").attr("selected",true);


                    $(".str").on('change',function(){
                        $(this).parent(".input-tree").attr("strId",$(this).val());
                        if(str.parent(".input-tree").attr("strId"))
                        {

                        }

                    });
                }
            }
        })

        /*下拉树*/
        var setOneTree = function (obj)
        {
            /*
             * treeOnClick树形菜单点击回调函数
             *
             * */
            var ele = obj.ele || $(".input-tree");
            function treeOnClick()
            {
                var _this = $(this),
                    inpt = _this.parents(".input-tree").eq(0).children(".input-text"),
                    tree = _this.parents(".tree").eq(0),
                    treeTxt = _this.parents("li").children("a").children(".tree-txt"),
                    txtArr = [],
                    id = _this.parents("li").eq(0).attr("treeId");

                _this.parents(".tree").eq(0).find(".tree-txt").removeClass("clr-blue");
                _this.addClass("clr-blue");
                $.each(treeTxt, function (i, v)
                {
                    txtArr.push($(v).text());
                });
                txtArr = txtArr.reverse();
                inpt.val(txtArr.join("/"));
                tree.hide();
                _this.parents(".input-tree").eq(0).attr("open_list", "false");
                inpt.blur();
            }
            /*
             * treeInit初始化树形菜单方法
             *
             * */
            function treeInit(obj)
            {
                var tree = ele.find(".tree"),
                    data = obj.data;
                tree.html("");
                if (obj.all)
                {
                    var OLi = $('<li></li>'),
                        OA = $('<a href="javascript:;"></a>'),
                        allId = "";
                    OLi.append('<span class="tree-sw"></span>');
                    if (obj.showIcon === true)
                    {
                        OA.append('<span class="tree-icon"></span>');
                    }
                    OA.append('<span class="tree-txt all"></span>');
                    OA.find(".tree-txt").html(obj.all);
                    OLi.attr("treeId", obj.initSendData[obj.id]);
                    $.each(data, function (i, v){
                        $.each(v, function (j,va)
                        {
                            if (j === obj.id)
                            {
                                allId += "," + va;
                            }
                        });
                    });
                    allId = allId.substr(1);
                    OLi.attr("allId", allId);
                    OLi.append(OA);
                    tree.append(OLi);
                }
                else
                {
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
                }
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
                                data: {id: $(this).parents("li").attr("treeId")},
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

            ele.on("click", ".input-text", function ()
            {
                var _this = $(this),
                    flag = false;
                $(".input-tree .tree").hide();
                $(".input-tree").attr("open_list", "false");
                if (_this.parents(".input-tree").find(".tree li").size() === 0)
                {
                    _this.parents(".input-tree").eq(0).find(".tree").hide();
                    _this.parents(".input-tree").eq(0).attr("open_list", "false");
                }
                flag = (_this.parents(".input-tree").eq(0).attr("open_list") === "false") ||
                    (_this.parents(".input-tree").eq(0).attr("open_list") === undefined);

                if (flag)
                {
                    _this.parents(".input-tree").eq(0).find(".tree").show();
                    _this.parents(".input-tree").eq(0).attr("open_list", "true");
                    if (ele.find(".tree li").size() === 0)
                    {
                        $.myAjax({
                            url: obj.url,
                            type: obj.type || "POST",
                            data: obj.data || "",
                            success: function (data)
                            {
                                if (data && data.success === 0)
                                {
                                    var treeArr =data.data;
                                    treeInit({
                                        ele: ele,
                                        data: treeArr,
                                        id: obj.id || "id",
                                        value: obj.value,
                                        url: obj.url,
                                        type: obj.type || "POST",
                                        all: obj.all || false,
                                        initSendData: obj.data,
                                        treeClick: obj.treeClick || ""
                                    });
                                }
                            }
                        });
                    }
                }
                else
                {
                    _this.parents(".input-tree").eq(0).find(".tree").hide();
                    _this.parents(".input-tree").eq(0).attr("open_list", "false");
                }
            });
            $(document).on("click", function (e){//点击其他地方要关闭树
                var evnt = e || window.event,
                    tar = $(evnt.target);
                if (tar.parents(".input-tree").size() === 0)
                {
                    $(".input-tree .tree").hide();
                    $(".input-tree").attr("open_list", "false");
                }
            });
        };
        /*下拉树结束*/



        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
         * */
        function getFormInfo (box)
        {
            var conNames = box.find('[name]'),
                key = "",
                keyVal = "",
                sendData = {},
                checkboxs = null;
            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("name");

                if (conNames.eq(i).attr("type") === "select")
                {
                    keyVal = $("select[name='"+key+"']").val();
                }
                else if (conNames.eq(i).attr("type") === "checkbox")
                {
                    checkboxs = conNames.eq(i).parents(".rolePermis").find(".check");
                    keyVal = "";
                    $.each(checkboxs, function (i, v)
                    {
                        if ($(v)[0].checked === true)
                        {
                            keyVal += "," + $(v).val();
                        }
                    });
                    keyVal = keyVal.substr(1);
                }
                else
                {
                    keyVal = conNames.eq(i).val();
                }
                sendData[key] = keyVal;
            }
            return sendData;
        }

        var inputTree = $(".listTr").find(".input-tree"),
            equipmentId = null;
        setOneTree({
            ele: inputTree,
            url: ajaxUrl + "project/subProject/findTree",
            type: "POST",
            data: {id: 0},
            id: "id",
            value: "equipmentName",
            //all: "全部",//是否有所有这一级
            treeClick: function ()
            {
                var _this = $(this),
                    id = _this.parents("li").eq(0).attr("treeId");
                if (_this.hasClass("all"))
                {
                    equipmentId = _this.parents("li").eq(0).attr("allId");
                }
                else
                {
                    equipmentId = id;
                }
            }
        });
        /*
         *自定义属性添加
         */
        function addTable(obj1, obj2, obj3)
        {
            var id = 0;
            obj3.on("click", function() {
                var len = obj1.find("th").size(),
                    str = "", //添加input
                    zStr = "", //添加一行
                    flagAdd = false, //添加
                    flagSave = false,
                    flag = false, //储存属性对应的value值
                    strar = [],
                    val = "";
                var add = true;
                obj2.find(".needChoose").each(function(i,o){
                    if($(this).val()==""){
                        add = false;
                    }else{}
                });
                if(!add){
                    flagAdd = false;
                    layer.confirm("请填入必填项", {
                            shade: 0.1,
                            btn: ['确定'] //按钮
                        },
                        function() {
                            $(".layui-layer-shade").hide();
                            $(".layui-layer").hide();
                        },
                        function() {
                            $(".layui-layer-shade").hide();
                            $(".layui-layer").hide();
                        })
                }else{
                    for(var i = 0; i < len; i++) {

                        if(i == len - 1) {
                            str += '<td class="eidt"><a href="javascript:;" class="edit"><i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i></a>' +
                                '<a href="javascript:;" class="del"><i class="Hui-iconfont" title="删除">&#xe609;</i></a></td>';
                        } else {
                            val = obj2.find("input").eq(i).val();
                            str += '<td><input readonly="readonly" disabled="disabled" type="text" class="needChoose input-text widthChange arr" value="' + val + '" /></td>';

                        }

                        flagAdd = true;
                    };


                }
                zStr = '<tr equipmentId="' + equipmentId + '" class="tableCenter">' + str + '</tr>';
                if(flagAdd) {
                    obj2.before(zStr);
                    obj2.find("input").val("");
                    flagAdd = false;
                }
                $(".firstTr").find("input").each(function(i,o){
                    if($(this).hasClass("needChoose")){
                        $(".tableCenter").find("td").eq(i).find("input").addClass("needChoose");
                    }
                });
                var trs = obj1.find("tr");
                obj1.find(".del").on("click", function()
                { //点击删除
                    var _this = $(this);
                    var id = $(this).parent().parent().attr("id");
                    layer.confirm("确定要删除吗？", {
                            shade: 0.1,
                            btn: ['确定', '取消'] //按钮
                        },
                        function() {
                            _this.parents("tr").remove("");
                            $(".layui-layer-shade").hide();
                            $(".layui-layer").hide();
                            var trs = obj1.find("tr");
                        },
                        function() {
                        })
                });
                obj1.find(".edit").on("click", function() { //点击编辑

                    var _this = $(this),
                        len = _this.parents("tr").find(".needChoose").size(),
                        valAdd = "";
                    var arrTd =  _this.parents("tr").find("td");
                    $(arrTd[arrTd.length-2]).addClass("input-tree");
                    $(arrTd[arrTd.length-2]).removeClass("arr");
                    $(arrTd[arrTd.length-2]).append('<ul class="tree"></ul>')
                    for(var i = 0; i < len; i++) {
                        valAdd += _this.parents("tr").find(".needChoose").eq(i).val();
                        if(valAdd) {
                            flag = true;
                        } else {
                            layer.confirm("请填入必填项", {
                                    shade: 0.1,
                                    btn: ['确定'] //按钮
                                },
                                function() {
                                    flag = false;
                                    $(".layui-layer-shade").hide();
                                    $(".layui-layer").hide();
                                },
                                function() {

                                });
                            return false;
                        }
                    }
                    if(flag) {
                        if(!flagSave) {
                            $(this).html('<i class="Hui-iconfont" title="保存">&#xe676;</i>');
                            _this.parents("tr").find("input").css({
                                "border": "1px solid #006BFF"
                            });
                            _this.parents("tr").find("input").removeAttr("disabled", "disabled");
                            _this.parents("tr").find("input").removeAttr("readonly", "readonly");
                            var inputTree = _this.parents("tr").find(".input-tree");
                            setOneTree({
                                ele: inputTree,
                                url: ajaxUrl + "project/subProject/findTree",
                                type: "POST",
                                data: {id: 0},
                                id: "id",
                                value: "equipmentName",
                                //all: "全部",//是否有所有这一级
                                treeClick: function ()
                                {
                                    var _this = $(this),
                                        id = _this.parents("li").eq(0).attr("treeId"),
                                        equipmentId = "";
                                    if (_this.hasClass("all"))
                                    {
                                        equipmentId = _this.parents("li").eq(0).attr("allId");
                                    }
                                    else
                                    {
                                        equipmentId = id;
                                    }
                                    _this.parents("tr").attr({"equipmentId": equipmentId});
                                }
                            });
                            flagSave = true;
                        } else {
                            _this.html('<i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i>');
                            _this.parents("tr").find("input").css({
                                "border": "1px solid rgb(238,238,238)"
                            });
                            _this.parents("tr").find("input").attr("disabled", "disabled");
                            _this.parents("tr").find("input").attr("readonly", "readonly");
                            flagSave = false;
                        }
                    }
                });
            })

        }
        addTable($(".tableList"),$(".firstTr"), $(".addBtn"));

        //请求类型  关联工单
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
        //添加依据
        $(".add-btn").on("click",function()
        {
            var relevantType = $(".relevant-type"),
                relevant = $(".relevant"),
                according = $(".according"),
                accTbody = $(".according tbody"),
                Otr = $('<tr></tr>'),
                val = relevant.val(),//编号
                relTypeVal = "",//类型的id
                relType = "",//类型名
                codeId = "",//编号的id
                detailedVal = "",//导入的值
                workOrderName = "",//依据名称
                workOrderType = "",
                accData = {},
                workOrderId = null,
            //获取复选框值
                getCheckedVal = function (name){
                    var value="";
                    var arr = [];
                    var check=$('[name="'+ name +'"]');
                    for(var i=0; i<check.size(); i++){
                        if(check[i].checked === true){
                            value=check[i].value;
                            arr.push(value);
                        }
                    }
                    return arr.join(",");
                };
            detailedVal = getCheckedVal("detailed");
            /* relTypeVal = relevantType.val();
             relType = relevantType.children('[value="'+ relTypeVal +'"]').text();*/
            workOrderType = relevant.attr("workOrderType");
            workOrderName = relevant.attr("workOrderName");
            codeId = relevant.attr("workOrderNum");
            workOrderId = relevant.attr("workOrderId");


            if(!workOrderName)
            {
                layer.confirm('请输入正确的相关编号', {
                    btn: ['确定'],
                    shade: 0.1
                });
                return false;
            }
            //判断是否已添加
            for(var i = 0,l = accTbody.find("tr").length; i < l; i++)
            {
                //同类型同id不让添加
                if(codeId === accTbody.find("tr").eq(i).attr("code_id") && relType === accTbody.find("tr").eq(i).children().eq(0).text())
                {
                    layer.confirm('已添加', {
                        btn: ['确定'],
                        shade: 0.1
                    });
                    return false;
                }
            }

            Otr.attr({"code_id": codeId});
            Otr.append('<td td_name="workType" class="text-c" workType = "'+workOrderType+'" workOrderId = "'+workOrderId+'">'+ relType +'</td>');
            Otr.append($('<td td_name="workOrderNum" class="text-c"></td>').text(val));
            Otr.append($('<td td_name="workOrderName"></td>').text(workOrderName));
            Otr.append('<td class="text-c">'+
                '<a style="text-decoration:none" class="ml-5 btn-delete" href="javascript:;" title="删除">'+
                '<i class="fa fa-trash fa-lg" aria-hidden="true"></i></a>'
                +'</td>');
            accTbody.append(Otr);
            relevant.val("");
            relevant.removeAttr("spbasisName");
            if(accTbody.find("tr").length > 0)
            {
                according.show();
            }
            else
            {
                according.hide();
            }

            //如果选择导入
            if (detailedVal)
            {
                //accData.dictCodeValue = detailedVal;
                accData.workOrderId = workOrderId;
                accData.detailType = "QDLX-SB";
                //accData.workType = relTypeVal;
                //getDetailed(accData);
            }
        });

        //点击删除依据
        $(".according").on("click", ".btn-delete", function()
        {
            var currTr = $(this).parents("tr").eq(0);
            var ind = layer.confirm('确定要删除吗？', {
                    btn: ['确定', '取消'],
                    shade: 0.1
                },
                function ()
                {
                    layer.close(ind);
                    currTr.remove();
                    if($(".according").find("tr").length === 1)
                    {
                        $(".according").hide();
                    }
                },
                function ()
                {
                    layer.msg('已取消', {icon:5,time:1000});
                });
        });
        function getValData (obj)
        {
            var data = {},
                basiss = [],
                detsils = [],
                box = $(obj.ele),
                arr = obj.arr,
                accTbody = $(".according tbody"),
                accTrs = accTbody.find("tr"),
                OBasiss = null,
                ATemp = [],
                STemp = "",
                reqArrSb = [
                    "detailName",
                    "detailCount",
                    "detailUnit",
                    "equipmentId"
                ],
                reqArrFw = [
                    "detailName"
                ],
                reqArrQt = [
                    "detailName"
                ],
                dataSb = [],
                dataFw = [],
                dataQt = [];

            var getListData = function (obj)
            {
                var box = obj.$ele,
                    reqArr = obj.reqArr,
                    indClass = box.attr("ind"),
                    nowDiv = null,
                    ANowTrConName = null,
                    reg = /[\w\W]+/,
                    text = "",
                    AData = [],
                    ATr = box.find(".tbody tr"),
                    detailType = box.find(".tbody tr.hidden").attr("detailType"),
                    layerInd = "";

                for (var i = 2, l = ATr.size(); i < l; i++)
                {
                    //验证必填项
                    for (var j = 0, le = reqArr.length; j < le; j++)
                    {
                        nowDiv = ATr.eq(i).find('[con_name="'+ reqArr[j] + '"]');
                        text = nowDiv.text();
                        if (!reg.test(text))
                        {
                            $("." + indClass).click();
                            nowDiv.parents("tr").eq(0).find(".deal").click();
                            layerInd = layer.confirm('请正确填写必填项', {
                                btn: ['确定'],
                                shade: 0.1
                            }/*,
                             function ()
                             {
                             layer.close(layerInd);
                             box.find(".tbody .editable").eq(2).find('[con_name="'+ reqArr[j] + '"]').focus();
                             },
                             function ()
                             {
                             box.find(".tbody .editable").eq(2).find('[con_name="'+ reqArr[j] + '"]').focus();
                             }*/);
                            return false;
                        }
                    }
                    //组装数据
                    ANowTrConName = ATr.eq(i).find('[con_name]');
                    var oneJson = {};
                    $.each(ANowTrConName, function (i, v)
                    {
                        var conName = $(v).attr("con_name");
                        oneJson[conName] = $(v).text();
                    });
                    oneJson.detailType = detailType;
                    if (oneJson.equipmentId)
                    {
                        oneJson.equipmentId = ATr.eq(i).find('[con_name="equipmentId"]').attr("equipmentId");
                    }
                    AData.push(oneJson);
                }
                return AData;
            };

            for (var i = 0, len = arr.length; i < len; i++)
            {
                if (arr[i])
                {
                    data[arr[i]] = box.find('[con_name="'+ arr[i] +'"]').val();
                }
            }

            $.each(accTrs, function (i, v)
            {
                var OTemp = {};
                OTemp.id = $(v).find('[td_name="workType"]').attr("workOrderId");
                OTemp.workType = $(v).find('[td_name="workType"]').attr("workType");
                OTemp.workOrderNum = $(v).find('[td_name="workOrderNum"]').text();
                OTemp.workOrderName = $(v).find('[td_name="workOrderName"]').text();
                basiss.push(OTemp);
            });
            data.basisList = JSON.stringify(basiss);

            dataSb = getListData({
                $ele: $(".equipment-cnt"),
                reqArr: reqArrSb
            });
            if (dataSb === false)
            {
                return false;
            }
            detsils = detsils.concat(dataSb);

            dataFw = getListData({
                $ele: $(".server-cnt"),
                reqArr: reqArrFw
            });
            if (dataFw === false)
            {
                return false;
            }
            detsils = detsils.concat(dataFw);

            dataQt = getListData({
                $ele: $(".other-cnt"),
                reqArr: reqArrQt
            });
            if (dataQt === false)
            {
                return false;
            }
            detsils = detsils.concat(dataQt);

            data.deviceList = JSON.stringify(detsils);

            return data;
        }


        $("#table-box").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            datatype: {
                "date": /^\d{4}\-\d{2}\-\d{2}$/,
                "phone": /^0\d{2,3}-?\d{7,8}$/
            },
            beforeSubmit:function(curform){
                var arr = [
                        "subprojectName",
                        "subprojectCode",
                        "startDate",
                        "endDate",
                        "subprojectRemark"
                    ],
                    sendData = getValData({
                        ele: ".table-box",
                        arr:arr
                    });
                if (sendData === false)
                {
                    return false;
                }

                /*
                 * 提交新建角色信息
                 */
                if($("[con_name=roleCode]").parent().siblings().attr("title") == "编码已被使用")
                {
                    $("[con_name=roleCode]").parent().siblings().find("span").addClass("Validform_wrong").removeClass("Validform_right");
                }
                else if($("[con_name=roleName]").parent().siblings().attr("title") == "角色已经使用")
                {
                    $("[con_name=roleName]").parent().siblings().find("span").addClass("Validform_wrong").removeClass("Validform_right");
                }
                if($(".Validform_wrong").length>0)
                {
                    return;
                }
                else
                {
                    var sendData = {};
                    sendData = getFormInfo(curform);

                    var arr3 = [];
                    $("#roleAdd").find('[nameValue]').each(function(i,o){
                        arr3.push($(this).attr("nameValue"));
                    });
                    var ipt = [];
                    $("#roleAdd").each(function(i,o){
                        var hasObj = {};
                        $(this).find('[nameValue]').each(function(i,o){
                            hasObj[arr3[i]] = $(this).val();
                        });
                        hasObj.storageName = $('.str option:selected').text();
                        hasObj.consigneeEmail = $('.consigneeEmail').val();
                        hasObj.consigneeAdd = $('.consigneeAdd').val();
                        ipt.push(hasObj);
                    });

                    sendData.extensionInfos = JSON.stringify(ipt)
                    //获取清单

                    var arr2 = [],
                        strId = "",
                        arrP = $(".file-list p");
                    $.each(arrP, function (i, v)
                    {
                        strId += "," + $(v).attr("attachId");
                    });
                    strId = strId.substr(1);

                    $(".tableList").find(".listTr").find(".arr").each(function(i,o){
                        arr2.push($(this).attr("con_name"));
                    });
                    var objArr = [];
                    $(".tbody1").find("tr").each(function(i,o){
                        var hasObj = {};
                        $(this).find(".arr").each(function(i,o){
                            hasObj[arr2[i]] = $(this).val();
                        });
                        hasObj.equipmentId = $(this).attr("equipmentId");
                        objArr.push(hasObj);
                    });
                    $(".tbody").find(".tableCenter").each(function(i,o){
                        var hasObj = {};
                        $(this).find(".arr").each(function(i,o){
                            hasObj[arr2[i]] = $(this).val();
                        });
                        hasObj.equipmentId = $(this).attr("equipmentId");
                        objArr.push(hasObj);
                    });

                    sendData.deviceList = JSON.stringify(objArr);
                    var checkList = $(".checkbox").find(".check");
                    checkList.eq(0).prop("checked") == true?sendData.isSendEmail = 1:sendData.isSendEmail = 0;
                    checkList.eq(1).prop("checked") == true?sendData.isSendMsg = 1:sendData.isSendMsg = 0;
                    sendData.attachmentId =$("#roleAdd").find(".file-list").attr("attachId");
                    sendData.remark = $("#roleAdd").find(".remark").val();
                    sendData.storageName = $(".str option:selected").text();
                    sendData.attachmentId = strId;                       //附件
                    sendData.workType=1;
                    sendData.step = 1;
                    sendData.taskId = taskId;
                    sendData.id=id;
                    sendData.workFlowId =$("#table-box").attr("workFlowId");
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/workOrder/approval",
                        data: sendData,
                        dataType: "json",
                        success: function(data)
                        {
                            if (data && data.success === 0)
                            {
                                layer.confirm('提交成功', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    },
                                    function()
                                    {
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    },
                                    function(){
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗

                                    })
                            }
                        }
                    });
                }

            },
            callback:function(form){
                return false;
            }
        });

        /*
         *上传文件
         */
        uploadFile.on("change",function ()
        {
            var _this = this;

            fileUpload({
                ths: _this,
                msg: "正在上传文件",
                form: $("#upload"),
                fileList: $(".file-list"),
                createUrl: "project/attachment/create",//增加地址
                infoUrl: "project/attachment/createFileInfo",//返回信息地址
                delUrl: "project/attachment/deleteFileById",//删除的地址
                sendData: {}
            });
        });
        /*文件上传结束*/

        //附件下载
        $(".file-list").on("click","span",function ()
        {
            var _this = $(this),
                DownLoadFile = function (options)
                {
                    var config = $.extend(true, { method: 'post' }, options);
                    var $iframe = $('<iframe id="down-file-iframe" />');
                    var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
                    $form.attr('action', config.url);
                    for (var key in config.data) {
                        $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
                    }
                    $iframe.append($form);
                    $(document.body).append($iframe);
                    $form[0].submit();
                    $iframe.remove();
                };

            DownLoadFile({
                "url": window.ajaxUrl + "project/attachment/download",
                "method": "post",
                "data": {"attachId": _this.parents("p").attr("attachid")}
            });
        });
    });
}(jQuery, window, document));