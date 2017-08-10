/**
 * 本文件是施工工单的js文件
 *@author 鲍哲
 */

(function($, w, d) {
    'use strict';
    $(function(){

        var pageSize = 1000,
            //selected = false,
            subprojectId = "",
            parentProjectId="",
        pageNo = 1;

        window.getTd($(".form-table"));
        //请求类型
        function getType()
        {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl+"project/project/findProjectByUserId",  //请求工单类型传入固定字符串
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
                        $(".project").on('change',function(){
                            $(this).parent(".input-tree").attr("projectId",$(this).val());

                            if(project.parent(".input-tree").attr("projectId")){
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

                                        }
                                    }
                                })
                            }

                        });
                    }
                }
            });
        };
        $(".subProject").on('change',function(){
            var subProject = $('.subProject');
            $(this).parent(".input-tree").attr("subProjectId",$(this).val());
            if(subProject.parent(".input-tree").attr("subProjectId"))
            {
                //getDetailed({subprojectId:subProject.parent(".input-tree").attr("subProjectId")})
                $.myAjax({
                    type:"POST",
                    url:window.ajaxUrl +"project/subProject/findDetailBySubId",
                    data:{subprojectId:subProject.parent(".input-tree").attr("subProjectId")},
                    dataType:"json",
                    success:function(data)
                    {
                        if(data && data.success === 0)
                        {

                            showList(data.data);

                        }
                    }
                })
            }

        });
        getType();//请求关联数据项目、子项目、工地以及子项目下的清单

        //获取合作伙伴
        $.myAjax({
            type:"POST",
          /*  url:window.ajaxUrl +"general/partner/find",
            data:{partnerType:"hzhb-SG"},*/
            url:window.ajaxUrl +"general/partner/findByQuery",
            data:{partnerType:"HZHB-SG,HZHB-SGGH"},
            dataType:"json",
            success:function(data)
            {
                if(data && data.success === 0)
                {
                    var str = $('.str'),
                        stroption = null;
                    str.html("");
                    str.append('<option value="">请选择</option>');
                    for (var i = 0, l = data.data.length; i < l; i++)
                    {
                        stroption = $('<option value="'+ data.data[i].id+'"></option>');
                        stroption.text(data.data[i].partnerName);
                        str.append(stroption);
                    }
                    $(".str").on('change',function(){
                        $(this).parent(".input-tree").attr("strId",$(this).val());
                        if(str.parent(".input-tree").attr("strId"))
                        {

                        }

                    });
                }
            }
        })

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

                if (conNames.eq(i).attr("type") === "radio")
                {
                    keyVal = $('input[name="roleState"]:checked ').val();
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

                    tempDiv = $('<div con_name="detailRemark"></div>');
                    tempDiv.text(v.detailRemark || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="equipmentId" equipmentId="'+ (v.equipmentId || "") +'"></div>');
                    tempDiv.text(v.equipmentName || "");
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
                }
                if (edit === true)
                {
                    STr.find(".deal").click();
                }
            });
        }

        //导入清单方法
        function getDetailed(sendData)
        {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl +"project/proDeviceList/findByWorkOrderId",
                data: sendData,
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {

                       /* showList(data.data.result)*/
                    }
                }
            });
        }

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
                //accData.workType = relTypeVal;
                getDetailed(accData);
            }
        });

        var uploadFileD = $(".downLoad");
        uploadFileD.on("change",function ()
        {
            excelUpload({
                createUrl: "project/workOrder/importFileNoSave",//增加地址
                form: $("#uploads"),
                success: function (data)
                {
                    showList(data.data, false,false);
                }
            });
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

        //tab切换
        $.Huitab("#tab-category .tabBar span","#tab-category .tabCon","current","click",0);

        //添加清单
        $(".btns .add").on("click",function()
        {
            var _this = $(this),
                tabCon = _this.parents(".tabCon").eq(0),
                thisTr = _this.parents("tr").eq(0),
                thisTbody = _this.parents("tbody").eq(0),
                newTr = $('<tr class="text-c"></tr>'),
                newTd = null,
                newDiv = null,
                newText = "",
                sendData = {},
                arr = [],
                reqArr = [],
                reg = "",
                detailType = "";

            if (tabCon.hasClass("equipment-cnt"))
            {
                arr = [
                    "detailName",
                    "detailModel",
                    "detailCompany",
                    "detailCount",
                    "detailUnit",
                    "detailRemark",
                    "equipmentId"
                ];
                reqArr = [
                    "detailName",
                    "detailCount",
                    "detailUnit",
                    "equipmentId"
                ];
            }
            else if (tabCon.hasClass("server-cnt"))
            {
                arr = [
                    "detailName",
                    "detailStartDate",
                    "detailEndDate",
                    "detailCount",
                    "detailUnit",
                    "detailRemark"
                ];
                reqArr = [
                    "detailName"
                ];
            }
            else
            {
                arr = [
                    "detailName",
                    "detailRemark",
                    "detailCount",
                    "detailUnit"
                ];
                reqArr = [
                    "detailName"
                ];
            }
            //必填验证
            for (var j = 0, len = reqArr.length; j < len; j++)
            {
                reg = /[\w\W]+/;
                newText = thisTr.find('[con_name="'+ reqArr[j] +'"]').val();

                if (!reg.test(newText))
                {
                    layer.confirm('请正确填写必填项', {
                        btn: ['确定'],
                        shade: 0.1
                    });
                    return false;
                }
            }

            for (var i = 0, l = arr.length; i < l; i++)
            {
                newTd = $('<td></td>');
                newDiv = $('<div con_name="'+ arr[i] +'"></div>');
                newText = thisTr.find('[con_name="'+ arr[i] +'"]').val();
                newDiv.text(newText);
                newTd.append(newDiv);
                newTr.append(newTd);
                sendData[arr[i]] = newText;

                if (arr[i] === "detailCount")
                {
                    reg = /^\d+$/;
                    if (newText && !reg.test(newText))
                    {
                        layer.confirm('请正确填写数量', {
                            btn: ['确定'],
                            shade: 0.1
                        });
                        return false;
                    }
                }
            }

            var tmpBtn = '<td class="btns">';
            tmpBtn += '<a style="text-decoration:none" class="ml-5 deal" href="javascript:;" title="编辑">'+
                '<i class="Hui-iconfont">&#xe70c;</i></a>';

            tmpBtn += '<a style="text-decoration:none" class="ml-5 delete" href="javascript:;" title="删除">'+
                '<i class="Hui-iconfont">&#xe6e2;</i></a>' +
                '</td>';

            var equipmentId = thisTr.find('[con_name="equipmentId"]').attr("equipmentId");
            newTr.find('[con_name="equipmentId"]').attr({"equipmentId": equipmentId});
            newTr.append(tmpBtn);
            sendData.equipmentId = equipmentId;
            sendData.projectId = parentProjectId;
            sendData.detailType = thisTr.attr("detailType");
            thisTr.after(newTr);
            thisTr.find(".textarea").val("");
        });


        //编辑清单
        $(".tabCon tbody").on("click", ".deal", function ()
        {
            var _this = $(this),
                thisTbody = _this.parents(".tbody"),
                thisTr = _this.parents("tr").eq(0),
                editable = thisTbody.find(".hidden").clone(),
                thisTrConName = thisTr.find('[con_name]'),
                conName = editable.find('[con_name]');

            if (editable.attr("detailType") === "QDLX-FW")
            {
                editable.find('[con_name="detailStartDate"]').attr("id", "dateStartCopy");
                editable.find('[con_name="detailEndDate"]').attr("id", "dateEndCopy");
            }
            $.each(conName, function (i, v)
            {
                var cnNm = $(v).attr("con_name");
                $(v).val(thisTr.find('[con_name="'+ cnNm +'"]').text());
                if (cnNm === "equipmentId")
                {
                    $(v).attr("equipmentId", thisTr.find('[con_name="'+ cnNm +'"]').attr("equipmentId"));
                }
            });

            editable.removeClass("hidden");
            thisTr.hide();
            thisTr.after(editable);

            var inputTree = editable.find(".input-tree");
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
                    editable.find(".input-text").attr({"equipmentId": equipmentId});
                }
            });


            editable.find(".sure").on("click", function()
            {
                $.each(conName, function (i, v)
                {
                    var cnNm = $(v).attr("con_name");
                    thisTr.find('[con_name="'+ cnNm +'"]').text($(v).val());
                    if (cnNm === "equipmentId")
                    {
                        thisTr.find('[con_name="'+ cnNm +'"]').attr("equipmentId", $(v).attr("equipmentId"));
                    }
                });

                var bThis = $(this),
                    tabCon = _this.parents(".tabCon").eq(0),
                    newText = "",
                    arr = [],
                    reqArr = [],
                    reg = "";

                if (tabCon.hasClass("equipment-cnt"))
                {
                    arr = [
                        "detailName",
                        "detailModel",
                        "detailCompany",
                        "detailCount",
                        "detailUnit",
                        "detailRemark"
                    ];
                    reqArr = [
                        "detailName",
                        "detailCount",
                        "detailUnit",
                        "equipmentId"
                    ];
                }
                else if (tabCon.hasClass("server-cnt"))
                {
                    arr = [
                        "detailName",
                        "detailStartDate",
                        "detailEndDate",
                        "detailCount",
                        "detailUnit",
                        "detailRemark"
                    ];
                    reqArr = [
                        "detailName"
                    ];
                }
                else
                {
                    arr = [
                        "detailName",
                        "detailRemark",
                        "detailCount",
                        "detailUnit"
                    ];
                    reqArr = [
                        "detailName"
                    ];
                }
                //必填验证
                for (var j = 0, len = reqArr.length; j < len; j++)
                {
                    reg = /[\w\W]+/;
                    newText = editable.find('[con_name="'+ reqArr[j] +'"]').val();

                    if (!reg.test(newText))
                    {
                        layer.confirm('请正确填写必填项', {
                            btn: ['确定'],
                            shade: 0.1
                        });
                        return false;
                    }
                }


                for (var i = 0, l = arr.length; i < l; i++)
                {
                    newText = editable.find('[con_name="'+ arr[i] +'"]').val();
                    if (arr[i] === "detailCount")
                    {
                        reg = /^\d+$/;
                        if (newText && !reg.test(newText))
                        {
                            layer.confirm('请正确填写数量', {
                                btn: ['确定'],
                                shade: 0.1
                            });
                            return false;
                        }
                    }
                }
                editable.remove();
                thisTr.show();
            });
        });

        //删除清单
        $(".tabCon tbody").on("click", ".delete", function ()
        {
            var _this = $(this),
                thisTr = _this.parents("tr").eq(0),
                thisTd = _this.parents("td").eq(0),
                thisDivs = thisTr.find(".div-text"),
                ind = "";

            ind = layer.confirm('确定要删除吗？', {
                    btn: ['确定','取消'],
                    shade: 0.1
                },
                function ()
                {
                    thisTr.remove();
                    layer.close(ind);
                });
        });

        setOneTree({
            ele: $(".equipment-cnt .editable-show .input-tree"),
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
                $(".equipment-cnt .editable-show .input-tree").find(".input-text").attr({"equipmentId": equipmentId});
            }
        });

        /*
         * getValData方法获取要提交的数据
         * 传入包含con_name的元素和con_name的数组的对象
         * 返回组装好的数据
         * */
        function getValData (obj)
        {
            var data = {},
                basiss = [],
                detsils = [],
                box = $(obj.ele),
                arr = obj.arr,
                accTbody = $(".according tbody"),
                //accTrs = accTbody.find("tr"),
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
                dataQt = [],
                edtEqu = $(".equipment-cnt .editable"),
                serEqu = $(".server-cnt .editable"),
                othEqu = $(".other-cnt .editable");
            //清单确认
            var sureList = function ($ele)
            {
                if ($ele.size() > 2)
                {
                    layer.confirm('有清单没有确认，请确认！', {
                        btn: ['确定'],
                        shade: 0.1
                    });
                    $("." + $ele.parents(".tabCon").eq(0).attr("ind")).click();
                    return false;
                }
                return true;
            };
            if (sureList(edtEqu) === false)
            {
                return false;
            }
            if (sureList(serEqu) === false)
            {
                return false;
            }
            if (sureList(othEqu) === false)
            {
                return false;
            }
            //清单确认结束

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
                            });
                            return false;
                        }
                    }

                    if (ATr.eq(i).attr("save") === "true")
                    {
                        continue;
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

            /*$.each(accTrs, function (i, v)
             {
             var OTemp = {};
             OTemp.id = $(v).attr("code_id");
             OTemp.spbasisType = $(v).find('[td_name="spbasisType"]').text();
             OTemp.spbasisCode = $(v).find('[td_name="spbasisCode"]').text();
             OTemp.spbasisName = $(v).find('[td_name="spbasisName"]').text();
             basiss.push(OTemp);
             });
             data.basisString = JSON.stringify(basiss);*/

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

        /*
        *
        * 提交表单信息
        * */
        var id = parent.window.layerViewData.projectId,
            taskId = parent.window.layerViewData.taskId,
            workFlowId = parent.window.layerViewData.workFlowId,
            workType = parent.window.layerViewData.workType;
        $(".table-box").Validform({
            btnSubmit: ".save",
            tiptype:2,
            datatype: {
                "date": /^\d{4}\-\d{2}\-\d{2}$/,
                "phone": /^0\d{2,3}-?\d{7,8}$/
            },
            beforeSubmit:function(curform){
                var arr = [

                    ],
                    sendData = getValData({
                        ele: ".table-box",
                        arr:arr
                    });
                if (sendData === false)
                {
                    return false;
                }
                sendData.workOrderName = $(".workOrderName").val();
                sendData.workOrderNum = $(".workOrderNum").val();
                sendData.project = $(".project").parent().attr("projectId");
                sendData.subProject = $(".subProject").parent().attr("subProjectId");
                sendData.site = $(".worksite").parent().attr("projectId");
                sendData.constructor = $(".constructor").parent().attr("strid");
                sendData.subProjectId = $(".subProject").parent().attr("subProjectId");
                sendData.remark = $(".textarea ").val();
                sendData.partnerId = $(".constructor").parent().attr("strid");
                var checkList = $(".checkbox").find(".check");
                checkList.eq(0).prop("checked") == true?sendData.isSendEmail = 1:sendData.isSendEmail = 0;
                checkList.eq(1).prop("checked") == true?sendData.isSendMsg = 1:sendData.isSendMsg = 0;

                var arr3 = [];
                $("#roleAdd").find('[con_name]').each(function(i,o){
                    arr3.push($(this).attr("con_name"));
                });
                var ipt = [];
                $("#roleAdd").each(function(i,o){
                    var hasObj = {};
                    $(this).find('[con_name]').each(function(i,o){
                        hasObj[arr3[i]] = $(this).val();
                    });
                    hasObj.partnerId = $('.str option:selected').text();
                    var strId = "",
                        arrP = $(".file-list p");
                    $.each(arrP, function (i, v)
                    {
                        strId += "," + $(v).attr("attachId");
                    });
                    strId = strId.substr(1);
                    hasObj.attachmentId = strId;
                    ipt.push(hasObj);
                });
                sendData.workType='2';
                sendData.extensionInfos = JSON.stringify(ipt);
                sendData.taskId = taskId;
                sendData.workFlowId = workFlowId;
                sendData.step = 1;
                sendData.id = id;
                sendData.apprResult = 1;
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
                                function(){
                                    parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗

                                })
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
            },
            callback:function(form){
                return false;
            }
        });
        /*
         *上传文件
         */
        var  uploadFile = $(".upload-files");
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
        //excel导入清单
        var uploadFileD = $(".downLoad");
        uploadFileD.on("change",function ()
        {
            excelUpload({
                createUrl: "project/workOrder/importFileNoSave",//增加地址
                form: $("#uploadD"),
                success: function (data)
                {
                    showList(data.data, false,true);
                }
            });
        });
    });
}(jQuery, window, document));