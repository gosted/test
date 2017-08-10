/**
 * 本文件的功能是固定资产合同添加页js文件
 *@ author 王步华
 */

(function($, w, d){
    'use strict';
    $(function() {
        var uploadFile = $(".upload-Enclosure"),
            listImport = $(".listImport"),
            onlyCode = true,
            cust="",
            custs="";
        //添加40个td
        window.getTd($(".form-table"));

        //判断编码唯一
        $(".contractCode").blur(function(){
            var contractCode = $(this).val();
            if(contractCode == ""){
                $(".contractCode-has .Validform_checktip").removeClass("Validform_right");
                $(".contractCode").addClass("Validform_error");
                $(".contractCode-has .Validform_checktip").addClass("Validform_wrong");
                $(".contractCode-msg").attr("title","编码为1-50位");
            }else {
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/contract/checkContractCode",
                    data: {contractCode: contractCode},
                    dataType: "json",
                    success: function (msg) {
                        if (msg && msg.success === 0) {
                            if (msg.data == 0) {
                                if(contractCode.length > 50){
                                    onlyCode = false;
                                    $(".contractCode-has .Validform_checktip").removeClass("Validform_right");
                                    $(".contractCode").addClass("Validform_error");
                                    $(".contractCode-has .Validform_checktip").addClass("Validform_wrong");
                                    $(".contractCode-msg").attr("title","编码为1-50位")
                                }else{
                                    onlyCode = true;
                                    $(".contractCode").removeClass("Validform_error");
                                    $(".contractCode-has .Validform_checktip").removeClass("Validform_wrong");
                                    $(".contractCode-msg").attr("title", "合同编码可以使用");
                                    $(".contractCode-has .Validform_checktip").addClass("Validform_right");
                                }

                            } else {
                                onlyCode = false;
                                layer.confirm('合同编号已存在', {
                                    btn: ['确定'],
                                    shade: 0.1
                                });
                                $(".contractCode-has .Validform_checktip").removeClass("Validform_right");
                                $(".contractCode").addClass("Validform_error");
                                $(".contractCode-has .Validform_checktip").addClass("Validform_wrong");
                                $(".contractCode-msg").attr("title", "合同编号已存在");
                            }
                        }
                    }
                });
            }
        });

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

                }
            }
        });
        /*
        *不含税金额
        * */
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
                    flag = false, //储存属性对应的text值
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
                            str += '<td class="eidt"><a href="javascript:;" class="edit" title="编辑"><i class="Hui-iconfont changePos">&#xe70c;</i></a>' +
                                '<a href="javascript:;" class="del" title="删除"><i class="Hui-iconfont">&#xe6e2;</i></a></td>';
                        } else {
                            val = obj2.find("div").eq(i).text();

                            str += '<td><div class="needChoose widthChange pl-3">'+ val +'</div></td>';
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
                    for(var i = 0; i < len; i++) {
                        valAdd = _this.parents("tr").find(".needChoose").eq(i).text();
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
                            $(this).html('<i class="Hui-iconfont" title="确定">&#xe676;</i>');
                            _this.parents("tr").find("div").css({
                                "border": "1px solid #006BFF"
                            });
                            _this.parents("tr").find("div").attr("contenteditable", true);
                            flagSave = true;
                        } else {
                            _this.html('<i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i>');
                            /*_this.parents("tr").find("div").css({
                                "border": "1px solid rgb(238,238,238)"
                            });*/
                            _this.parents("tr").find("div").attr("contenteditable", false);
                            flagSave = false;
                        }
                    }
                });
            })

        }
        addTable($(".addTable"),$(".firstTr"), $(".addBtn"));


      /**********************************************************************************************************************/
        //显示清单方法
        function showList (data,edit)
        {
            var equTbody = $(".equipment-cnt tbody"),
                serbody = $(".server-cnt tbody"),
                othTbody = $(".other-cnt tbody"),
                STr = null;
            $.each(data, function (i, v)
            {
                var id = v.id,
                    tempDiv = null,
                    tmpBtn = "";
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

                if (v.detailType === "QDLX-SB")
                {
                    STr = $('<tr class="text-c" delid="' + id + '" detailType="' + v.detailType + '"></tr>');//一行

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
                        showList(data.data, true);
                    }
                }
            });
        }
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
                if(codeId === accTbody.find("tr").eq(i).attr("code_id") && relType === accTbody.find("tr").eq(i).children().eq(0).text())
                {
                    layer.confirm('该依据已经添加过了，不能重复添加！', {
                        btn: ['确定'],
                        shade: 0.1
                    });
                    return false;
                }
            }

            Otr.attr({"code_id": codeId});
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
                        showList(data.data, true);
                    }
                }
            });
        });


        $(".detailedList").on("blur",".detailPrice",function(){
            var _this =$(this),
                detailPrice = Number(_this.val()) || 0,
                detailCount = Number(_this.parents("tr").find(".detailCount").val()) || 0;
            if(detailPrice != "" && detailCount != ""){
                var num = detailPrice*detailCount;
                var math =   num.toFixed(2);
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
                var math =   num.toFixed(2);
                _this.parents("tr").find('[con_name="detailTotal"]').val(math);
            }else{
                _this.parents("tr").find('[con_name="detailTotal"]').val("");
            }
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
                    //reg = /^\d+(\.?\d+)?$/;
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

            var tmpBtn = '<td class="btns">';
            tmpBtn += '<a style="text-decoration:none" class="ml-5 deal" href="javascript:;" title="编辑">'+
                '<i class="Hui-iconfont">&#xe70c;</i></a>';

            tmpBtn += '<a style="text-decoration:none" class="ml-5 delete" href="javascript:;" title="删除">'+
                '<i class="Hui-iconfont">&#xe6e2;</i></a>' +
                '</td>';

            /*var equipmentId = thisTr.find('[con_name="equipmentId"]').attr("equipmentId");
            newTr.find('[con_name="equipmentId"]').attr({"equipmentId": equipmentId});*/
            newTr.append(tmpBtn);
            //sendData.equipmentId = equipmentId;
            thisTr.after(newTr);
            thisTr.find(".textarea").val("");
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
            });

            editable.removeClass("hidden");
            thisTr.hide();
            thisTr.after(editable);

            editable.find(".sure").on("click", function()
            {
                var conName = editable.find('[con_name]');
                $.each(conName, function (i, v)
                {
                    var cnNm = $(v).attr("con_name");
                    thisTr.find('[con_name="'+ cnNm +'"]').text($(v).val());
                });

                var bThis = $(this),
                    tabCon = _this.parents(".equipment-cnt").eq(0),
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
                    if (arr[i] === "detailCount")
                    {
                        //reg = /^\d+(\.?\d+)?$/;
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
                editable.remove();
                thisTr.show();
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
                    if (thisTr.hasClass("editable"))
                    {
                        thisTr.prev("tr").remove();
                    }
                    thisTr.remove();
                    layer.close(ind);
                });
        });
        /*
         * getValData方法获取要提交的数据
         * 传入包含
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
                accTrs = accTbody.find("tr"),
                OBasiss = null,
                ATemp = [],
                STemp = "",
                reqArrSb = [
                    "detailName",
                    "detailUnit",
                    "detailCount"
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
                    });
                        oneJson.detailType ="QDLX-SB"
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
                OTemp.id = $(v).attr("code_id");
                OTemp.spbasisType = $(v).find('[td_name="spbasisType"]').text();
                OTemp.spbasisCode = $(v).find('[td_name="spbasisCode"]').text();
                OTemp.spbasisName = $(v).find('[td_name="spbasisName"]').text();
                basiss.push(OTemp);
            });
            data.detailList = JSON.stringify(basiss);

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

            data.detailString = JSON.stringify(detsils);

            return data;
        }

        /*******************************************************************************************************************/
        $("#parentDiv").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            datatype:{
                "onlyCoding":/^[\w\W]{1,50}$/,
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
                if (onlyCode === false)
                {
                    $("[con_name=contractCode]").parent().siblings().find("span").addClass("Validform_wrong").removeClass("Validform_right");
                    layer.confirm('合同编号已存在', {
                        btn: ['确定'],
                        shade: 0.1
                    });
                    return false;
                }
                /*
                 *清单未填不能提交
                 */
                var len = $(".tableCenters").find(".needChoose").length,
                    valAdd = "",
                    valibj=true,
                    flag =false;
                for(var i = 0; i < len; i++) {
                    valAdd = $(".tableCenters").find(".needChoose").eq(i).text();
                    if (valAdd == "") {
                        $(this).parents("tr").find(".edit").click();
                        valibj=false;
                    }
                }
                if($(".eidt").hasClass("determine")){

                }
                if(valibj) {
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

                if($(".Validform_wrong").length>0)
                {
                    return;
                }
                else
                {
                    if(flag = true){
                        var sendData = {},
                            arr1 = [],
                            obj1 = $(".addTable"),
                            getAttr1 = obj1.find("th"),
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

                        var strId = "",
                            arrP = $(".file-list p");
                        $.each(arrP, function (i, v)
                        {
                            strId += "," + $(v).attr("attachId");
                        });
                        strId = strId.substr(1);
                        var arr = [
                                "detailName",
                                "detailModel",
                                "detailCompany",
                                "detailUnit",
                                "detailCount",
                                "detailPrice",
                                "detailTotal"
                        ],
                        dataobj = getValData({
                            ele: ".table-box",
                            arr: arr
                        });
                        if (dataobj === false)
                        {
                            return false;
                        }

                        var loading = "";
                        sendData = getFormInfo(curform);
                        sendData.contractCustom = "["+arr1.join(",")+"]";   //自定义
                        sendData.detailList = dataobj.detailString;                        //清单
                        sendData.attachmentId = strId;                        //附件
                        sendData.contractAmont  = $('[con_name="contractAmont"]').val().replace(/\,/g, "");                       //含税合同金额
                        sendData.amontNoTax = $('[con_name="amontNoTax"]').val().replace(/\,/g, "");                           //不含税金额
                        loading = layer.msg('请稍后', {
                            time: 0,
                            icon: 16,
                            shade: 0.1
                        });

                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/contract/createFAContract",
                            data: sendData,
                            dataType: "json",
                            success: function(msg)
                            {
                                if (msg && msg.success === 0)
                                {
                                    layer.close(loading);
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
                            }
                        });
                    }
                }
            },
            callback:function(form){
                return false;
            }
        });
        /*
         * getFormInfo获取填写表单信息方法，传表单jq对象，返回表单数据
         * */
        function getFormInfo (box)
        {
            var conNames = $(".table-box").find('[con_name]'),
                key = "",
                keyVal = "",
                sendData = {},
                checkbox = null;

            for (var i= 0, len=conNames.size(); i<len; i++)
            {
                key = conNames.eq(i).attr("con_name");
                if (conNames.eq(i).attr("type") === "radio")
                {
                    keyVal = $('input[name="userSex"]:checked ').val();
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


    });
}(jQuery, window, document));

