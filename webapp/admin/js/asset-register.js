/**
 * 本文件是资产添加文件
 * @author 彭佳明
 */

(function($, w, d)
{
'use strict';
$(function()
{
    function AssetRegister(options){
        this.sendData = {};
        this.num = 0;
    }
    AssetRegister.prototype = {
        constructor:AssetRegister,
        init:function()
        {
            var tables = $(".table-box>.form-table");
            window.getTd(tables);
            this.addRemark(); // 添加tap
            this.getType();  // 获取类型等值
            this.remarkTap(); // tap切换
            this.getRate();
            this.addAttachment($(".file-list"),$("#upload"),".upload-file0"); //附件
            this.addAttachment($(".file-list1"),$("#upload-form1"),".upload-file1"); //附件
            this.Validform($(".table-box"));//验证提交
        },
        getCode:function()
        {
            var that = this;
            //获取编号
            var p = new Promise(function(resolve,reject)
            {
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/assetRegistration/findAssetCodes",
                    data: {},
                    dataType: "json",
                    success: function(data)
                    {
                        if (data && data.success === 0)
                        {
                            $(".assetCode").attr("code",data.data);
                            resolve(data.data);
                        }
                    }
                });
            });
            return p;

        },
        getVal:function(dom)
        {
            var that = this;
            dom.find("input").each(function (i, o) {
                if ($(this).attr("con_name")) {
                    that.sendData[$(this).attr("con_name")] = $(this).val();
                }
            });
            //that.sendData["assetStatus"] = $('.assetStatus option:selected').val();
            //that.sendData["positionStatus"] = $('.positionStatus option:selected').val();
            that.sendData["assetCode"] = $(".assetCode").attr("code");
            that.sendData["assetStatus"] = "ZCZT-SY";
            that.sendData["positionStatus"] = "ZCWZ-XC";
            return that.sendData;
        },
        Validform:function(box)
        {
            var that = this;
            box.Validform({
                btnSubmit: ".save",
                tiptype:2,
                datatype: {
                    "date": /^\d{4}\-\d{2}\-\d{2}$/,
                    "phone": /^0\d{2,3}-?\d{7,8}$/,
                    "Post": /^[0-9][0-9]{5}$/,
                    "Number":/^\d{1,13}((\.\d{1,2})?)$/,
                    "NumberPrice":/^\d{1,13}((\.\d{1,3})?)$/,
                    "pre":/^\d{1,2}(\.\d{1,4})?$/,
                    "pre1":/^\d{1,4}(\.\d{1,4})?$/,
                },
                beforeSubmit:function(curform){
                    //获取input 用Data包装全部数据
                    var Data = that.getVal($(".table-box"));

                    //获取assetTrackInfos
                    var arr = [];

                    that.getCode().then(function(data){
                        return getJson(data);
                    });
                    function getJson(code){
                        var data = {assetPosition:$(".assetPosition").val(),installPeople:$(".installPeople").val(),installTime:$(".installTime").val(),workSiteId:$('.workSite option:selected').val(),subProjectId:$('.subProject option:selected').val(),projectId:$('.projectId option:selected').val(),workSiteName:$(".workSite").find("option:selected").text(),subProjectName:$(".subProject").find("option:selected").text(),projectName:$(".projectId").find("option:selected").text()};
                        $(".asset").find(".remarkTitle").each(function(i,o){
                            var that = $(this);
                            if($(this).html()!=""){
                                var data1 = {};
                                $(this).find("input").each(function(i,o){
                                    data1[$(this).attr("con_na")] = $(this).val();
                                });
                                data1.content = $(this).next("tr").find(".content").val();
                                var str = "";
                                var arrP =that.next().next().next(".remarkAttachContent").find("td").eq(1).find("p");
                                if(arrP){
                                    $.each(arrP, function (i, v)
                                    {
                                        str += "," + $(v).attr("attachId");
                                    });
                                    str = str.substr(1);
                                }
                                data1.relatedAttachId = str;
                                arr.push(data1);
                            }

                        });
                        var strArr = JSON.stringify(arr);
                        data.remark = strArr;
                        Data.equipmentId = that.sendData.equipmentId;
                        Data.assetCode = code;
                        Data.assetTrackInfos = JSON.stringify(data);
                        //附件
                        var arrP = box.find($(".file-list p")),strId = "";
                        if (arrP.size() > 0)
                        {
                            $.each(arrP, function (i, v)
                            {
                                strId += "," + $(v).attr("attachId");
                            });
                            strId = strId.substr(1);
                        }
                        Data.relatedAttachId = strId;
                        getData();
                    }
                    function getData(){
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/assetRegistration/createAssetRegistration",
                            data: Data,
                            dataType: "json",
                            success: function(data)
                            {
                                if (data && data.success === 0)
                                {
                                    layer.confirm('登记成功', {
                                            btn: ['确定'],
                                            shade: 0.1
                                        },
                                        function(){
                                            window.location.replace("asset-check.html");
                                    });
                                    $(document).on("click",".layui-layer-close",function(){
                                        window.location.replace("asset-check.html");
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
        },
        getType:function()
        {
            var that = this;
            //树形菜单
            this.setMyTree({
                ele: ".asset-tree",
                url: ajaxUrl + "project/assetRegistration/findTree",
                type: "POST",
                data: {id: 0},
                id: "id",
                value: "equipmentName",
                treeClick: function (data)
                {
                    that.sendData.equipmentId= $(this).parent("a").parent("li").attr("treeId");
                    var durableYears = $(this).parent("a").parent("li").attr("durableYears");
                    var residualRate = $(this).parent("a").parent("li").attr("residualRate");
                    var depreciationRate = $(this).parent("a").parent("li").attr("depreciationRate");
                    $('[con_name="durableYears"]').val(durableYears);
                    $('[con_name="residualRate"]').val(residualRate);
                    $('[con_name="depreciationRate"]').val(depreciationRate)
                }
            });

            // 项目信息
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/project/findProject",
                data: {},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        var str="";
                        for(var i=0;i<data.data.length;i++){
                            str += '<option value="'+data.data[i].id+'">'+data.data[i].projectName+'</option>';
                        }
                        $(".projectId").append(str);
                    }
                }
            });
            $(".projectId").on("change",function(){
                var val = $(this).val();
                if(val!="choose"){
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/subProject/findByProjectId",
                        data: {projectId:val},
                        dataType: "json",
                        success: function(data)
                        {
                            if (data && data.success === 0)
                            {
                                var str="";
                                for(var i=0;i<data.data.length;i++){
                                    str += '<option class="sub" value="'+data.data[i].id+'">'+data.data[i].subprojectName+'</option>';
                                }
                                $(".subProject").append(str);
                            }
                        }
                    });

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/workSite/findByProjectId",
                        data: {projectId:val},
                        dataType: "json",
                        success: function(data)
                        {
                            if (data && data.success === 0)
                            {
                                var str="";
                                for(var i=0;i<data.data.length;i++){
                                    str += '<option class="wor" value="'+data.data[i].id+'">'+data.data[i].worksiteName+'</option>';
                                }
                                $(".workSite").append(str);
                            }
                        }
                    });
                }else{
                    $(".subProject").val("请选择").find(".sub").hide();
                    $(".workSite").val("请选择").find(".wor").hide();
                }

            });

            //设备状态
            /*$.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/assetRegistration/findDictionary",
                data: {dictCode:"ZCWZ"},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        var str="";
                        for(var i=0;i<data.data.length;i++){
                            str += '<option value="'+data.data[i].dictCodeValue+'">'+data.data[i].dictCodeName+'</option>';
                        }
                        $(".positionStatus").append(str);
                    }
                }
            });*/
            /*$.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/assetRegistration/findDictionary",
                data: {dictCode:"ZCZT"},
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        var str="";
                        for(var i=0;i<data.data.length;i++){
                            str += '<option value="'+data.data[i].dictCodeValue+'">'+data.data[i].dictCodeName+'</option>';
                        }
                        $(".assetStatus").append(str);
                    }
                }
            });*/

        },
        getRate:function()
        {
            function getdepreciationRate()
            {
                var residualRate = null,
                    durableYears = null,
                    depreciationRate = null,
                    content = null;
                residualRate = $("input[con_name='residualRate']").val();
                durableYears = $("input[con_name='durableYears']").val();
                content = $("input[con_name='depreciationRate']");
                if(residualRate.length <= 0 && durableYears.length <= 0 )
                {
                    layer.msg("请输入折旧期限和残值率")
                }
                else if(residualRate.length > 0 && durableYears.length <= 0)
                {
                    layer.msg("请输入折旧期限")
                }
                else if(residualRate.length <= 0 && durableYears.length > 0)
                {
                    layer.msg("请输入残值率");
                }
                else if( residualRate.length > 0 && durableYears.length > 0 && Number(residualRate) > 100)
                {
                    layer.msg("残值率不得大于100");
                }
                else
                {
                    depreciationRate = ((1-Number(residualRate)/100)/Number(durableYears))*100;
                    content.val(depreciationRate.toFixed(4));

                }


            }

            $("input[con_name='durableYears']").on('blur',getdepreciationRate);
            $("input[con_name='residualRate']").on('blur',getdepreciationRate);
        },
        addRemark:function()
        {
            var cb = $.Callbacks(),that = this;
            $(".btn-add").off().on("click",function(){
                var newRemarkTitle = $(".remarkTitle").eq(0).clone(true);
                var newRemarkContent = $(".remarkContent").eq(0).clone(true);
                var remarkAttach = $(".remarkAttach").eq(0).clone(true);
                var remarkAttachContent =
                    "<tr class='remarkAttachContent'>"+
                    "<td class='table-key' colspan='5'></td>"+
                    "<td colspan='35' class='formControls'></td>"+
                    "</tr>";
                newRemarkTitle.find(".btn-tap").show();
                newRemarkTitle.find(".btn-del").show();
                newRemarkTitle.find(".name").val("");
                newRemarkTitle.find(".phone").val("");
                newRemarkTitle.find(".time").val("");
                newRemarkContent.find(".content").val("");
                $(".assetRegister").append(newRemarkTitle);
                $(".assetRegister").append(newRemarkContent);
                $(".assetRegister").append(remarkAttach);
                $(".assetRegister").append(remarkAttachContent);
                cb.fire(that);
            });
            cb.add(this.AttachList);
        },
        remarkTap:function()
        {
            $(".btn-tap").off().on("click",function()
            {
                var that = $(this);
                $(this).parents("tr").next("tr").slideToggle(100,function(){
                    that.toggleClass("fa-minus-circle");
                    that.toggleClass("fa-plus-circle");
                });
                $(this).parents("tr").next("tr").next("tr").slideToggle(100,function(){});
                $(this).parents("tr").next("tr").next("tr").next("tr").slideToggle(100,function(){});
                if($(this).hasClass("fa-minus-circle")){
                    $(this).attr("title","展开")
                }else{
                    $(this).attr("title","收缩")
                }
            });
            $(".btn-del").off().on("click",function()
            {
                var that = $(this);
                $(this).parents("tr").next("tr").next("tr").next("tr").html("");
                $(this).parents("tr").next("tr").next("tr").html("");
                $(this).parents("tr").next("tr").html("");
                $(this).parents("tr").html("");

            })
        },
        AttachList:function(This)
        {
            (This.num)++;
            $(".remarkAttach").eq(-1).find(".upload-form").addClass("newUpLoad"+(This.num));
            $(".remarkAttach").eq(-1).find("input").removeClass("upload-file1").addClass("NewUpload-file"+(This.num));
            $(".remarkAttachContent").eq(-1).find(".formControls").addClass("new-list");
            $(".remarkAttachContent").eq(-1).find(".formControls").addClass("File-list"+(This.num));
            This.addAttachment($(".File-list"+This.num),$(".newUpLoad"+This.num),$(".NewUpload-file"+This.num))
        },
        addAttachment:function(loadBox,loadId,loadDom)
        {
            var uploadFile = $(".assetRegister").find(loadDom);
            uploadFile.on("change",function ()
            {
                var _this = this;
                fileUpload({
                    ths: _this,
                    msg: "正在上传请稍后",
                    form: loadId,
                    fileList:loadBox,
                    createUrl: "project/attachment/create",//增加地址
                    infoUrl: "project/attachment/createFileInfo",//返回信息地址
                    delUrl: "project/attachment/deleteFileById",//删除的地址
                    sendData: {}
                });
            });
        },
        setMyTree:function(obj)
        {
            var ele = obj.ele || ".input-tree";
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

            function treeInit(obj)
            {
                var tree = $(obj.ele).find(".tree"),
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
                            else if (j == 'durableYears')
                            {
                                OLi.attr("durableYears", va||"");
                            }
                            else if (j == 'residualRate')
                            {
                                OLi.attr("residualRate", va||"");
                            }
                            else if (j == 'depreciationRate')
                            {
                                OLi.attr("depreciationRate", va||"");
                            }
                            else if ($.inArray(j, obj.attr) > -1)
                            {
                                OLi.attr(j, va);
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
                                                else if (j == 'durableYears')
                                                {
                                                    OLi.attr("durableYears", va||"");
                                                }
                                                else if (j == 'residualRate')
                                                {
                                                    OLi.attr("residualRate", va||"");
                                                }
                                                else if (j == 'depreciationRate')
                                                {
                                                    OLi.attr("depreciationRate", va||"");
                                                }
                                                else if ($.inArray(j, obj.attr) > -1)
                                                {
                                                    OLi.attr(j, va);
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

            $(ele).on("click", ".input-text", function ()
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
                    if ($(ele).find(".tree li").size() === 0)
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
                                        attr: obj.attr || [],
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
            $(document).on("click", function (e)
            {//点击其他地方要关闭树
                var evnt = e || window.event,
                    tar = $(evnt.target);
                if (tar.parents(".input-tree").size() === 0)
                {
                    $(".input-tree .tree").hide();
                    $(".input-tree").attr("open_list", "false");
                }
            });

        }
    };
    var assetRegister = new AssetRegister();
    assetRegister.init();
});
}(jQuery, window, document));
