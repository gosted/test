/**
 * 本文件的功能是固定资产合同编辑js文件
 * @ author 王步华
 */
(function($, w, d){
    'use strict';

    $(function() {
        var libId = parent.window.layerViewData.libId,
            flag = false, //储存自定义属性对应的value值
            flags = false, //储存清单属性对应的value值
            cust="",
            custs="",
            List="",
            flagSave = false,
            flagSaves = false;
        var uploadFile = $(".upload-Enclosure");
        //添加40个td
        window.getTd($(".form-table"));

        //请求已有信息
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "project/contract/findById",
            data: {"id": libId},
            success: function (data)
            {
                function formats (num) {
                    return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
                }
                if (data && data.success === 0)
                {
                    var box = $("#table-box");
                    if(data.data.contRemarks != null &&  data.data.contRemarks != ""){
                        $(".contRemarks-tip").find(".textarea-length").html(data.data.contRemarks.length);
                    }
                    setFormInfo(box,data);
                    var num = data.data.contractAmont;
                    var num1 = data.data.amontNoTax;
                    var currency = data.data.currency;
                    var tax = data.data.tax;
                    /*var contamo = formats(num);
                    $(".contractAmont").val(contamo);
                    $(".amontNoTax").val(formats(num1));*/
                    $(".upload-form").attr("attachmentId",data.data.attachmentId);
                    attachId();
                    /*
                     *币种
                     */
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "general/dictionary/findDictionary",
                        data: {
                            dictCode:"HB"
                        },
                        dataType: "json",
                        success: function (msg) {
                            if(msg && msg.success === 0) {
                                var nameMsg = msg.data,
                                    msgHtml="";
                                for(var i=0; i<nameMsg.length; i++){
                                    msgHtml += '<option value="'+nameMsg[i].dictCodeValue+'">'+nameMsg[i].dictCodeName+'</option>'
                                }
                                $(".currency").append(msgHtml);
                                $(".currency option[value='"+currency+"']").attr("selected",true);
                            }
                        }
                    });
                    /*
                     *增值税率
                     */
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "general/dictionary/findDictionary",
                        data: {
                            dictCode:"TAX"
                        },
                        dataType: "json",
                        success: function (msg) {
                            if(msg && msg.success === 0) {
                                var nameMsg = msg.data,
                                    msgHtml="";
                                for(var i=0; i<nameMsg.length; i++){
                                    msgHtml += '<option value="'+nameMsg[i].dictCodeValue+'">'+nameMsg[i].dictCodeName+'</option>'
                                }
                                $(".tax").append(msgHtml);
                                $(".tax option[value='"+tax+"']").attr("selected",true);
                            }
                        }
                    });
                }
            }
        });
        /*
        *回显附件
        * */
        function attachId() {
            if($(".upload-form").attr("attachmentId") !=""){
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/attachment/findByIds",
                    data: {
                        ids: $(".upload-form").attr("attachmentId")
                    },
                    dataType: "json",
                    success: function (msg) {
                        if (msg && msg.success === 0) {
                            var attachm = msg.data;
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

                                List += '<p lastmodified="" attachId="'+data.attachId+'">'+
                                    '<img src="'+planimg+'">'+
                                    '<span>'+data.attachName+'</span>'+
                                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="btn btn-success radius ml-10 del"><i class="Hui-iconfont mr-5">&#xe6e2</i>删除</a>'+
                                    '</p>'
                            });
                            $(".table-box").find(".file-list").append(List);
                        }
                    }
                });
            }
        }

        //计算不含税金额
        $('[con_name="tax"]').on("change", function ()
        {
            var tax = Number($(this).val()) || 0,
                contractAmont = Number($(".contractAmont").val().replace(/\,/g, "")) || 0,
                amontTax = 0;
            amontTax = (contractAmont/(1+(tax/100))).toFixed(2);
            $(".amontNoTax").val(amontTax);
        });
        $(".contractAmont").on("blur", function ()
        {
            var tax = Number($('.tax option:selected').val()) || 0,
                contractAmont = Number($(this).val().replace(/\,/g, "")) || 0,
                amontTax = 0;
            amontTax = (contractAmont/(1+(tax/100))).toFixed(2);
            $(".amontNoTax").val(amontTax);
        });

        /**
        *自定义属性单条编辑、删除
        **/
        $(".addTable").on("click",".del", function()//点击删除
        {
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
                    var trs = $(".addTable").find("tr");
                },
                function() {
                })
        });
        $(".addTable").on("click",".edit", function() //点击编辑
        {
            var _this=$(this);
            _this.parents("tr").find(".zdy").attr("contenteditable", true);
            _this.parents(".eidt").html('<a href="javascript:;" class="determine" title="确定"><i class="Hui-iconfont">&#xe676;</i></a>' +
                '<a href="javascript:;" class="del" title="删除"><i class="Hui-iconfont">&#xe6e2;</i></a>');

            flagSave = true;
        });
        $(".addTable").on("click",".determine", function() //点击添加
        {
            var _this=$(this),
                adds = true,
                eeli1 =  _this.parents("tr").find(".needChoose").eq(0).text(),
                neeli2 = _this.parents("tr").find(".needChoose").eq(1).text();
                if(eeli1 == "" || neeli2 ==""){
                    adds = false;
                }else{
                    adds = true;
                }

            if(adds == true){
                _this.parents("tr").find(".zdy").attr("contenteditable", false);
                _this.parents(".eidt").html('<a href="javascript:;" class="edit" title="编辑"><i class="Hui-iconfont changePos">&#xe70c;</i></a>' +
                    '<a href="javascript:;" class="del" title="删除"><i class="Hui-iconfont">&#xe6e2;</i></a>');
                flagSave = true;
            }else{
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
                    str = "", //添加div
                    zStr = "", //添加一行
                    flagAdd = false, //添加
                    flagSave = false,
                    val = "";
                var add = true;
                obj2.find(".needChoose").each(function(i,o){
                    if($(this).text()==""){
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
                                '<a href="javascript:;" class="del"><i class="Hui-iconfont" title="删除">&#xe6e2;</i></a></td>';
                        } else {
                            val = obj2.find("div").eq(i).text();

                            str += '<td><div class="needChoose input-text widthChange pl-3">'+ val +'</div></td>';
                        }
                        flagAdd = true;
                    };
                }
                zStr = '<tr id="' + id + '" class="tableCenter">' + str + '</tr>';
                if(flagAdd) {
                    obj2.after(zStr);
                    obj2.find("div").text("");
                    flagAdd = false;
                }
                $(".firstTr").find("div").each(function(i,o){
                    if($(this).hasClass("needChoose")){
                        $(".tableCenter").find("td").eq(i).find("div").addClass("needChoose");
                    }
                });
            })
        }
        addTable($(".addTable"),$(".firstTr"), $(".addBtn"));

        /*****************************************************清单、导入开始*************************************************************/
    //excel导入清单
        var uploadFiles = $(".upload-renderList");
        uploadFiles.on("change",function ()
        {
            excelUpload({
                createUrl: "project/contract/importFileNoSave",//增加地址
                form: $("#upload2"),
                success: function (data)
                {
                    if (data && data.success === 0)
                    {
                        showList(data.data, false, true);
                    }
                }
            });
        });

        //请求清单信息
        function findDetailList() {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/contract/findDetail",
                data: {contractId: libId},
                dataType: "json",
                success: function (data) {
                    if (data && data.success === 0) {
                        var _data = data.data,
                            basissData = _data,
                            detsilsData = _data,
                            according = $(".according"),
                            accTbody = $(".according tbody"),
                            Otr = null,
                            arr = [
                                "detailName",
                                "detailModel",
                                "detailCompany",
                                "detailCount",
                                "detailUnit",
                                "detailPrice",
                                "detailTotal",
                                "detailRemark"
                            ];
                        $.each(arr, function (i, v) {
                            var keyVal = _data[v];
                            if (!(keyVal === null || keyVal === "")) {
                                $('.equipment-cnt [con_name="' + v + '"]').val(keyVal);
                            }
                        });

                        //回显清单
                        showList(_data, true);

                    }
                }
            });
        }
        findDetailList();
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

                if(v.detailPrice != "" && v.detailPrice != undefined){
                    if(v.detailCount != "" && v.detailCount !=undefined){
                        var num = (v.detailPrice)*(v.detailCount);
                        var math =   num.toFixed(2);
                    }else{
                        math =="";
                    }

                }else{
                    math =="";
                }

                if (v.detailType === "QDLX-SB") {
                    STr = $('<tr class="text-c" save="' + save
                        + '" delid="' + id
                        + '" detailType="' + v.detailType
                        + '"></tr>');//一行

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

                    tempDiv = $('<div con_name="detailPrice"></div>');
                    tempDiv.text(v.detailPrice || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailTotal" equipmentId="' + (math || "") + '"></div>');
                    tempDiv.text(math || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tempDiv = $('<div con_name="detailRemark"></div>');
                    tempDiv.text(v.detailRemark || "");
                    STr.append($('<td></td>').append(tempDiv));

                    tmpBtn = '<td class="btns">';
                    tmpBtn += '<a style="text-decoration:none" class="ml-5 deal" href="javascript:;" title="编辑" _href="pro-child-edit.html">' +
                        '<i class="Hui-iconfont">&#xe70c;</i></a>';

                    tmpBtn += '<a style="text-decoration:none" class="ml-5 delete" href="javascript:;" title="删除">' +
                        '<i class="Hui-iconfont">&#xe6e2;</i></a>' +
                        '</td>';

                    STr.append(tmpBtn);
                    equTbody.find("tr").eq(1).after(STr);

                    if (edit === true) {
                        //STr.find(".deal").click();
                    }
                }
            });
        }

        //导入清单方法
        function getDetailed(sendData)
        {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/contract/findQD",
                data: sendData,
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        showList(data.data, false, true);
                    }
                }
            });
        }

        $(".detailedList").on("blur",".detailPrice",function(){
            var _this =$(this),
                detailPrice = Number(_this.val()) || 0,
                detailCount = Number(_this.parents("tr").find(".detailCount").val()) || 0;
            if(detailPrice != "" && detailCount != ""){
                var num = detailPrice*detailCount;
                var math =  num.toFixed(2);
                _this.parents("tr").find(".detailTotal").val(math);
            }else{
                _this.parents("tr").find(".detailTotal").val("");
            }
        });
        $(".detailedList").on("blur",".detailCount",function(){
            var _this =$(this),
                detailPrice = Number(_this.parents("tr").find(".detailPrice").val()) || 0,
                detailCount = Number(_this.val()) || 0;
            if(detailPrice != "" && detailCount != ""){
                var num = detailPrice*detailCount;
                var math =  num.toFixed(2);
                _this.parents("tr").find('[con_name="detailTotal"]').val(math);
            }else{
                _this.parents("tr").find('[con_name="detailTotal"]').val("");
            }
        });

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
                spbasisName = "",//依据名称
                accData = {},
                sendData = {},
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
            relTypeVal = relevantType.val();
            relType = relevantType.children('[value="'+ relTypeVal +'"]').text();
            spbasisName = relevant.attr("spbasisName");
            codeId = relevant.attr("contractId");

            if(!spbasisName)
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
                if(val === accTbody.find("tr").eq(i).children().eq(1).text() && relType === accTbody.find("tr").eq(i).children().eq(0).text())
                {
                    layer.confirm('该依据已经添加过了，不能重复添加！', {
                        btn: ['确定'],
                        shade: 0.1
                    });
                    return false;
                }
            }
            sendData.id = codeId;
            sendData.spbasisType = relType;
            sendData.spbasisCode = val;
            sendData.spbasisName = spbasisName;
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/contract/createBasis",
                data: sendData,
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        Otr.attr({"basis_id": data.data.id});
                        Otr.append('<td td_name="spbasisType" class="text-c">'+ relType +'</td>');
                        Otr.append($('<td td_name="spbasisCode" class="text-c"></td>').text(val));
                        Otr.append($('<td td_name="spbasisName"></td>').text(spbasisName));
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
                            accData.dictCodeValue = detailedVal;
                            accData.id = codeId;
                            accData.according = relTypeVal;
                            getDetailed(accData);
                        }
                    }
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
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/contract/deleteByIdBasis",
                        data: {id: currTr.attr("basis_id")},
                        dataType: "json",
                        success: function(data)
                        {
                            if (data && data.success === 0)
                            {
                                currTr.remove();
                                if($(".according").find("tr").length === 1)
                                {
                                    $(".according").hide();
                                }
                            }
                        }
                    });
                },
                function ()
                {
                    layer.msg('已取消', {icon:5,time:1000});
                });
        });
            //添加清单
        $(".btns .add").on("click",function()
        {
            var _this = $(this),
                tabCon = _this.parents(".equipment-cnt").eq(0),
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
                    "detailPrice",
                    "detailTotal",
                    "detailRemark"
                ];
                reqArr = [
                    "detailName",
                    "detailCount",
                    "detailUnit"
                ];
            }
            //必填验证
            for (var j = 0, len = reqArr.length; j < len; j++)
            {
                var newTr = $('<tr class="text-c"></tr>');
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
                    //reg = /^\d+$/;
                    reg = /^\d{1,14}(\.\d{1,6})?$/;
                    newText = thisTr.find('[con_name="'+ arr[i] +'"]').val();
                    if (newText && !reg.test(newText))
                    {
                        layer.confirm('请正确填写数量，整数部分小于15位，小数部分小于7位。', {
                            btn: ['确定'],
                            shade: 0.1
                        });
                        return false;
                    }
                }
                if (arr[i] === "detailPrice")
                {
                    reg = /^[-+]?\d{1,3}(\,\d{3})*(\.?\d{1,2})?$/;
                    if (newText && !reg.test(newText))
                    {
                        layer.confirm('请正确填写单价', {
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

            newTr.append(tmpBtn);
            sendData.contractId= libId;
            sendData.detailType ="QDLX-SB";

            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/contract/createDetail",
                data: sendData,
                dataType: "json",
                success: function(data)
                {
                    if (data && data.success === 0)
                    {
                        newTr.attr({
                            "save": "true",
                            "delid": data.data
                        });
                        thisTr.after(newTr);
                        thisTr.find(".textarea").val("");

                        //findDetailList();
                    }
                }
            });
        });


        //编辑清单
        $(".equipment-cnt tbody").on("click", ".deal", function ()
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
            editable.attr({
                "save": thisTr.attr("save"),
                "delid": thisTr.attr("delid")
            });
            editable.removeClass("hidden");
            thisTr.hide();
            thisTr.after(editable);

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
                    tabCon = _this.parents(".equipment-cnt").eq(0),
                    newText = "",
                    sendData = {},
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
                        "detailPrice",
                        "detailTotal",
                        "detailRemark"
                    ];
                    reqArr = [
                        "detailName",
                        "detailCount",
                        "detailUnit"
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
                    sendData[arr[i]] = newText;
                    if (arr[i] === "detailCount")
                    {
                        //reg = /^\d+$/;
                        reg = /^\d{1,14}(\.\d{1,6})?$/;
                        if (newText && !reg.test(newText))
                        {
                            layer.confirm('请正确填写数量，整数部分小于15位，小数部分小于7位。', {
                                btn: ['确定'],
                                shade: 0.1
                            });
                            return false;
                        }
                    }
                    if (arr[i] === "detailPrice")
                    {
                        reg = /^[-+]?\d{1,3}(\,\d{3})*(\.?\d{1,2})?$/;
                        if (newText && !reg.test(newText))
                        {
                            layer.confirm('请正确填写单价', {
                                btn: ['确定'],
                                shade: 0.1
                            });
                            return false;
                        }
                    }
                }

                if (thisTr.attr("save") === "false")
                {
                    sendData.contractId = libId;
                    sendData.detailType ="QDLX-SB";
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/contract/createDetail",
                        data: sendData,
                        dataType: "json",
                        success: function(data)
                        {
                            if (data && data.success === 0)
                            {
                                editable.remove();
                                thisTr.show();
                                thisTr.attr("delid",data.data);
                                thisTr.attr({
                                    "save": "true",
                                    "delid": data.data.id
                                });
                            }
                        }
                    });
                }
                else
                {
                    sendData.id = thisTr.attr("delid");
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/contract/updateDetail",
                        data: sendData,
                        dataType: "json",
                        success: function(data)
                        {
                            if (data && data.success === 0)
                            {
                                editable.remove();
                                thisTr.show();
                            }
                        }
                    });
                }
            });
        });

        //删除清单
        $(".equipment-cnt tbody").on("click", ".delete", function ()
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
                    if (thisTr.attr("save") == "true")
                    {
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/contract/deleteDetail",
                            data: {ids:thisTr.attr("delid")},
                            dataType: "json",
                            success: function(data)
                            {
                                if (data && data.success === 0)
                                {
                                    if (thisTr.hasClass("editable"))
                                    {
                                        thisTr.prev("tr").remove();
                                    }
                                    thisTr.remove();
                                    layer.close(ind);
                                }
                            }
                        });
                    }
                    else
                    {
                        if (thisTr.hasClass("editable"))
                        {
                            thisTr.prev("tr").remove();
                        }
                        thisTr.remove();
                        layer.close(ind);
                    }
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
                    "detailUnit",
                    "detailCount"
                ],
                dataSb = [],
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
                    $("." + $ele.parents(".equipment-cnt").eq(0).attr("ind")).click();
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
                    //组装数据
                    ANowTrConName = ATr.eq(i).find('[con_name]');
                    var oneJson = {};
                    $.each(ANowTrConName, function (i, v)
                    {
                        var conName = $(v).attr("con_name");
                        oneJson[conName] = $(v).text();
                        oneJson.id = $(v).parents("tr").attr("delid");
                    });
                    oneJson.detailType ="QDLX-SB";
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

            dataSb = getListData({
                $ele: $(".equipment-cnt"),
                reqArr: reqArrSb
            });
            if (dataSb === false)
            {
                return false;
            }
            detsils = detsils.concat(dataSb);

            data.detailString = JSON.stringify(detsils);

            return data;
        }
        /*****************************************************清单、导入结束*************************************************************/
        /*
        *提交
        */
        $("#parentDiv").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            datatype:{
                "money": function (gets,obj,curform,regxp)
                {
                    var reg = /^[-+]?\d{1,3}(\,\d{3})*(\.?\d{1,2})?$/;
                    function comdify(n){
                        var re=/[-+]?\d{1,3}(?=(\d{3})+$)/g;
                        var n1=Number(n.replace(/\,/g, "")).toFixed(2).toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
                        return n1;
                    }
                    var newVal = comdify(gets);
                    function focusMoney()
                    {
                        if ($(this).val().search(reg) > -1 && Number($(this).val().replace(/\,/g, "")) <= 9999999999999.99)
                        {
                            obj.val($(this).val().replace(/\,/g, ""));
                        }
                    }
                    obj.off("focus");
                    obj.on("focus",focusMoney);
                    if (newVal.search(reg) > -1 && Number(newVal.replace(/\,/g, "")) <= 9999999999999.99)
                    {
                        obj.val(newVal);
                        return true;
                    }
                    return false;
                }
            },
            beforeSubmit:function(curform){
                /*
                 * 提交跟踪反馈信息
                 */
                var sendData = {},
                    arr1 = [],
                    obj1 = $(".addTable"),
                    getAttr1 = obj1.find("th"),
                    strId = "",
                    arrP = $(".file-list p"),
                    str="";

                obj1.find(".tableCenter").each(function(i,o)
                {
                    var name = $(this).find("td div").eq(0).text(),
                        code = $(this).find("td div").eq(1).text();
                    var sendArr = {};
                    sendArr[name] = code;
                    str = JSON.stringify(sendArr);
                    arr1.push(str);
                });

                $.each(arrP, function (i, v)
                {
                    strId += "," + $(v).attr("attachId");
                });
                strId = strId.substr(1);

                var loading = "";
                var arr = [
                        "detailName",
                        "detailModel",
                        "detailCompany",
                        "detailCount",
                        "detailUnit",
                        "detailPrice",
                        "detailTotal"
                    ],
                    DataObj = getValData({
                        ele: ".detailedList",
                        arr:arr
                    });
                if (DataObj === false)
                {
                    return false;
                }

                sendData = getFormInfo(curform);
                sendData.contractCustom = "["+arr1.join(",")+"]";   //自定义属性
                sendData.detailList = DataObj.detailString;      //清单
                sendData.attachmentId = strId;                       //附件
                sendData.contractAmont  = $('[con_name="contractAmont"]').val().replace(/\,/g, "");                       //含税合同金额
                sendData.amontNoTax = $('[con_name="amontNoTax"]').val().replace(/\,/g, "");                           //不含税金额
                sendData.id = libId;
                if($(".Validform_wrong").length>0)
                {
                    return;
                }
                else {
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/contract/updateFAContract",
                        data: sendData,
                        dataType: "json",
                        success: function (msg) {
                            if (msg && msg.success === 0) {
                                layer.confirm('提交成功', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    },
                                    function () {
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    },
                                    function () {
                                        parent.window.location.replace(parent.window.location.href);  //刷新父级页面，同时关闭弹窗
                                    });
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
         * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
         * */
        function setFormInfo (box,data)
        {
            var conNames = box.find('[con_name]'),
                _data = data.data,
                dttrlist = "",
                key = "",
                keyVal = "",
                _radio = null,
                chkArr = [],
                date = "";
            if(_data.contractCustom != null || _data.contractCustom != ""){
                dttrlist = (_data.contractCustom).replace('\"', '"');
            }

            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                keyVal = _data[key];
                if (keyVal || "0")
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
            /*
             * 回显自定义属性
             */
            if(dttrlist != "" || dttrlist != null){
                var objList = $.parseJSON(dttrlist);
                for(var i=0; i<objList.length; i++){
                    $.each(objList[i],function(i,n){
                        cust ="";
                        cust +='<tr id="" class="tableCenter">'+
                            '<td>'+
                            '<div class="needChoose widthChange pl-3 zdy">'+ i +'</div>'+
                            '</td>'+
                            '<td>'+
                            '<div class="needChoose widthChange pl-3 zdy">'+ n +'</div>'+
                            '</td>'+
                            '<td class="eidt">'+
                            '<a href="javascript:;" class="edit" title="编辑">'+
                            '<i class="Hui-iconfont changePos">&#xe70c;</i>'+
                            '</a>'+
                            '<a href="javascript:;" class="del" title="删除">'+
                            '<i class="Hui-iconfont">&#xe6e2;</i>'+
                            '</a>'+
                            '</td>'+
                            '</tr>'

                        $(".firstTr").after(cust);
                    });
                }
            }
        }
        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
         * */
        function getFormInfo (box)
        {
            var conNames =$(".table-box").find('[con_name]'),
                key = "",
                keyVal = "",
                sendData = {},
                checkbox = null;

            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                if (conNames.eq(i).attr("type") === "radio")
                {

                }
                else
                {
                    keyVal = conNames.eq(i).val();
                }
                sendData[key] = keyVal;
            }
            return sendData;
        }
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

        /*回显附件删除*/
        $(".file-list").on("click",".del",function ()
        {
            var _this = $(this),
                id = $(this).parent().attr("attachId");
            $.myAjax({
                type:"POST",
                url:ajaxUrl + "project/attachment/deleteFileById",
                data:{"id":id},

                success:function(data)
                {
                    if(data.success === 0)
                    {
                        _this.parent().remove();
                    }
                }
            });
        });

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

