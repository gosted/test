/**
 * Created by baozhe  on 2017/3/13.
 * 本文件的是设备定义编辑页js
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){


        var pageSize = 1000,
            attachmentId = "",
            attachmentName = "",
            areaIdNow = "",
            hasFile = false,
            uploadFile = $(".upload-file"),
            pageNo = 1;
        var libId = parent.window.layerViewData.libId;
        window.getTd($(".form-table"));
        /*
         * 获取设备图标
         * */
        window.equipmentPic = function(){ //关闭上传图片页面时方法调用
            var pictureId = sessionStorage.getItem("pictureId");
            var figureImg = sessionStorage.getItem("figureImg");
            var figureSrc = sessionStorage.getItem("figureSrc");
            $(".listAddImg img").attr("src",window.ajaxUrl+figureImg);
            $(".listAddImg img").attr("pictureId",pictureId);
        }


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
                depreciationRate = ((1-Number(residualRate)/100)/Number(durableYears))*100
                content.val(depreciationRate.toFixed(4))

            }


        }

        $("input[con_name='durableYears']").on('blur',getdepreciationRate);
        $("input[con_name='residualRate']").on('blur',getdepreciationRate);

    //获取出所有数据
    function initTable (obj)
    {

            //请求已有信息
            $.myAjax({
                type: "POST",
                url:  window.ajaxUrl+"operation/equipment/findById",
                data: {"id": libId},
                success: function (data)
                {

                    if (data) {
                        if (data.success === 0) {
                            var box = $("#roleAdd");
                            $('[con_name="equipmentParentId"]').attr("equipmentparId", data.data.equipmentParentId);
                            if (data.data.attachmentId == null || data.data.attachmentId == "") {
                                $(".listAddImg img").attr("src", "");
                                $(".listAddImg img").attr("pictureId", "");
                            }
                            else {
                                $(".listAddImg img").attr("src", window.ajaxUrl + "project/attachment/downloadImage?id=" + data.data.attachmentId);
                                $(".listAddImg img").attr("pictureId", data.data.attachmentId);
                            }
                            /*
                             * 产品线
                             * */


                            //请求入库类型信息
                            (function () {
                                $.myAjax({
                                    type: "POST",
                                    url:window.ajaxUrl + "general/dictionary/findDictionary",
                                    data: {"dictCode":"CPX"},
                                    dataType: "json",
                                    success: function (msg) {
                                        if (msg && msg.success === 0) {
                                            var select = $(".select");
                                            $.each(msg.data, function (i, v) {
                                                var option = $('<option value="' + v.dictCodeValue + '"></option>');
                                                option.text(v.dictCodeName || "");
                                                select.append(option);
                                            });
                                            select.children('[value="' +data.data.productLine + '"]').attr("selected", "true");
                                        }
                                    }
                                });
                            })();

                            setFormInfo(box, data);

                            $('[con_name="equipmentRemark"]').keyup();
                            if (data.data.storeStyle == 0) {
                                $("input[name='storeStyle']")[0].checked = 'checked';
                            }
                            else if (data.data.storeStyle == 1) {
                                $("input[name='storeStyle']")[1].checked = 'checked';

                            }
                        }
                    }
                }
            });

            }


        initTable ({pageSize: pageSize, pageNo: pageNo, id: libId});
        /*
         * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
         * */
        function setFormInfo (box,data)
        {
            var box = $("#roleAdd"),
                conNames = box.find('[con_name]'),
                Names = box.find('[name]'),
                _data = data.data,
                key = "",
                keyVal = "",
                areaVal = "",
                areaStr = "",
                parVal = "",
                _radio = null,
                chkArr = [],
                date = "";
            for (var i= 0, len=Names.size(); i<len; i++)
            {
                key = Names.eq(i).attr("name");
                keyVal = _data[key];
                Names.eq(i).val(keyVal);
                if( key == "equipmentNameStr")
                {
                    areaVal = _data[key];
                    areaStr = areaVal.split("/");
                    areaStr = areaStr[areaStr.length-1]
                    Names.eq(i).val(areaStr);
                    }
                if(key == "equipmentParentId")
                {
                    if( keyVal == 0 )
                    {
                        Names.eq(i).val("全部设备")
                    }
                    else
                    {
                        if(areaVal.lastIndexOf("/") < 0){
                            Names.eq(i).val("全部设备/"+areaVal)
                        }
                        else{
                            parVal = areaVal.split("/");
                            parVal.pop();
                            Names.eq(i).val("全部设备/"+(parVal.join("/")));
                        }
                    }


                    Names.eq(i).attr("equipmentparId",_data[key])
                }


            }


        }

        $("#table-box").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            datatype:{
                "pre":/^\d{1,4}(\.\d{1,4})?$/
            },
            beforeSubmit:function(curform){

                /*
                 * 提交信息
                 */
                if($("[con_name=roleName]").parent().siblings().attr("title") == "角色已经使用")
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
                    $.myAjax({
                        type: "POST",
                        url:  window.ajaxUrl+"operation/equipment/update",
                        data: sendData,
                        dataType: "json",
                        success: function(msg)
                        {
                            if (msg && msg.success === 0)
                            {
                                layer.confirm('提交成功', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    },
                                    function()
                                    {
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    },
                                    function()
                                    {
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗

                                    });

                            }
                            else
                            {
                                layer.msg('操作失败', {icon:5,time:1000});
                            }
                        },
                        error: function(err)
                        {
                            layer.msg('操作失败', {icon:5,time:1000});
                        }
                    });
                }

            },
            callback:function(form){
                return false;
            }
        });




        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
         * */
        $(".ProgramSubmitButton").on("click",getFormInfo);

        function getFormInfo (box)
        {
            var box = $("#roleAdd"),
                conNames = box.find('[con_name]'),
                key = "",
                keyVal = "",
                sendData = {},
                checkboxs = null;
            sendData.id = libId;
            sendData.attachmentId =  $(".listAddImg img").attr("pictureId");

            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                if(key == "equipmentParentId")
                {
                    keyVal = conNames.eq(i).attr("equipmentparId");
                    sendData[key] = keyVal;
                }
                else
                {
                    keyVal = conNames.eq(i).val();
                    sendData[key] = keyVal;
                }
            }
            $("input[name='storeStyle']").eq(0).prop("checked") == true?sendData.storeStyle = 0:sendData.storeStyle = 1;
            $("input[name='storeStyle']").eq(1).prop("checked") == true?sendData.storeStyle = 1:sendData.storeStyle = 0;
            return sendData;
        }
        var setMenuTree = function (obj)
        {
            var open = false;

            /*
             * treeOnClick树形菜单点击回调函数
             *
             * */
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

            /*
             * treeInit初始化树形菜单方法
             *
             * */
            function treeInit(obj)
            {
                var tree = $(obj.ele),
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
                }else{
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


            $(ele).on("click", ".input-text", function ()
            {
                var _this = $(this),
                    flag = false;
                $(".input-tree .tree").show();
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

            treeInit({
                ele: ".tree",
                data: [ {
                    "equipmentName" : "全部设备",
                    "id" : "0"
                }],
                id: obj.id || "id",
                value: obj.value,
                url: obj.url,
                type: obj.type || "POST",
                treeClick: obj.treeClick || ""
            });

            /*$.myAjax({
             url: obj.url,
             type: obj.type || "POST",
             data: {id: $(this).parents("li").attr("treeId")},
             success: function (data)
             {
             if (data && data.success === 0)
             {
             var treeArr = data.data;

             treeInit({
             ele: ".tree",
             data: treeArr,
             id: obj.id || "id",
             value: obj.value,
             url: obj.url,
             type: obj.type || "POST",
             treeClick: obj.treeClick || ""
             });
             }
             }
             });*/
        };

        //请求树形菜单数据
        setMenuTree({
            url:  window.ajaxUrl+"operation/equipment/findTree",
            type: "POST",
            data: {id: 0},
            id: "id",
            value: "equipmentName",
            treeClick: function ()
            {
                var _this = $(this),
                    sendData = {};
                areaIdNow = _this.parents("li").eq(0).attr("treeId");
                $("[con_name=equipmentParentId]").attr("equipmentparId",areaIdNow);
                sendData = {
                    pageSize: pageSize,
                    pageNo: pageNo,
                    id: areaIdNow
                };
            }
        });

        $(".btn-add").on("click", function ()
        {
            var data = {},
                treeId = $(".tree .clr-blue").parents("li").attr("treeId");
            data.treeId = treeId;
            window.layerViewData = data;
            window.layerShow("添加图片","strg-storage-pic.html");
        });

    });
}(jQuery, window, document));