/**
 * 本文件是合同添加页js文件
 * @author 彭佳明
 */
(function($, w, d){
    'use strict';

    $(function() {
        var areaId = "",id = "",flag = true,sendData = {},type = "HTFL-HT";
        var projectId = window.parent.layerViewData.projectId;
        var tables = $(".table-box>.form-table");
        var flagNum = true,flagNum1 = true;
        var Reg = /^\d{1,13}((\.\d{1,2})?)$/;
        var RegCount = /^\d{1,14}((\.\d{1,6})?)$/;
        window.getTd(tables);
        window.change = function(){
            $(".tbody").find($(".widthChange")).each(function(i,o){
             var width = $(this).width();
             $(this).parent("td").css({position:"relative",width:width+"px"});
             });
            $(".tbody").on("focus",".change",function(){
                var width = $(this).width();
                $(this).removeClass("text-over");
                $(this).css({height:"auto","zIndex":"10000000000"});
                $(this).parent("td").css({position:"relative",width:width+"px"});
                $(this).addClass("text-change");
                $(this).addClass("bg");
                $(this).text($(this).attr("title"));
                if($(this).attr("con_name") =="detailPrice"&&$(this).text()!=""){
                    if(Reg.test($(this).text())){
                        flagNum = true
                    }else{
                        flagNum = false;
                        $(this).parent().parent().find($('[con_name="detailTotal"]')).text("")
                    }
                }
                if($(this).attr("con_name") =="detailCount"&&$(this).text()!=""){
                    if(RegCount.test($(this).text())){
                        flagNum1 = true
                    }else{
                        flagNum1 = false;
                        $(this).parent().parent().find($('[con_name="detailTotal"]')).text("");
                    }
                }
                if(flagNum&&flagNum1){
                    if($(this).attr("con_name") =="detailTotal"){
                        var sum = Number($(this).parent().parent().find($('[con_name="detailPrice"]')).text())*Number($(this).parent().parent().find($('[con_name="detailCount"]')).text());
                        $(this).text(sum.toFixed(2))
                    }
                }
            });

            $(".tbody").on("blur",".change",function(){
                $(this).attr("title",$(this).text());
                $(this).addClass("text-over");
                $(this).removeClass("bg");
                $(this).css({"zIndex":"100000"});
                if($(this).attr("con_name") =="detailPrice"&&$(this).text()!=""){
                    if(Reg.test($(this).text())){
                        flagNum = true
                    }else{
                        flagNum = false;
                        $(this).parent().parent().find($('[con_name="detailTotal"]')).text("")
                    }
                    var sum = Number($(this).parent().parent().find($('[con_name="detailPrice"]')).text())*Number($(this).parent().parent().find($('[con_name="detailCount"]')).text());

                    $(this).parent().parent().find($('[con_name="detailTotal"]')).text(sum.toFixed(2));
                    if( $(this).parent().parent().find($('[con_name="detailTotal"]')).text() == "0.00" || $(this).parent().parent().find($('[con_name="detailTotal"]')).text() == "NaN"){
                        $(this).parent().parent().find($('[con_name="detailTotal"]')).text("");
                    }
                }
                if($(this).attr("con_name") =="detailCount"&&$(this).text()!=""){
                    if(RegCount.test($(this).text())){
                        flagNum1 = true
                    }else{
                        flagNum1 = false;
                    }
                    var sum = Number($(this).parent().parent().find($('[con_name="detailPrice"]')).text())*Number($(this).parent().parent().find($('[con_name="detailCount"]')).text());

                    $(this).parent().parent().find($('[con_name="detailTotal"]')).text(sum.toFixed(2));
                    if( $(this).parent().parent().find($('[con_name="detailTotal"]')).text() == "0.00" || $(this).parent().parent().find($('[con_name="detailTotal"]')).text() == "NaN"){
                        $(this).parent().parent().find($('[con_name="detailTotal"]')).text("");
                    }
                }
                if(flagNum&&flagNum1){
                        if($(this).attr("con_name") =="detailTotal"){
                            var sum = Number($(this).parent().parent().find($('[con_name="detailPrice"]')).text())*Number($(this).parent().parent().find($('[con_name="detailCount"]')).text());

                            $(this).text(sum.toFixed(2));
                            if($(this).text() == "0.00" || $(this).text() == "NaN"){
                                $(this).text("");
                            }
                        }
                }
            });
        };
        change();
        addTable($(".contract-box .equ"),$(".contract-box .equ .listTr"), $(".contract-box .equ .btnList"));
        addTable($(".contract-box .serList"),$(".contract-box .serList .listTr"), $(".contract-box .serList .serbtnList"));
        addTable($(".contract-box .othList"),$(".contract-box .othList .listTr"), $(".contract-box .othList .othbtnList"));
        addTable($(".agree-box .equ"),$(".agree-box .equ .listTr"), $(".agree-box .equ .btnList"));
        addTable($(".agree-box .serList"),$(".agree-box .serList .listTr"), $(".agree-box .serList .serbtnList"));
        addTable($(".agree-box .othList"),$(".agree-box .othList .listTr"), $(".agree-box .othList .othbtnList"));
        addTable($(".work-box .contractList"),$(".work-box .contractList .listTr"), $(".work-box .contractList .btnList"));
        addTable($(".work-box .serList"),$(".work-box .serList .listTr"), $(".work-box .serList .serbtnList"));
        addTable($(".work-box .othList"),$(".work-box .othList .listTr"), $(".work-box .othList .othbtnList"));
        $(".oth").hide();
        $(".ser").hide();
        $(".equipmen").css({background:"#cfe6ff"});
        //显示清单条数
        function showTipNum (dom,tc)
        {
            var _this = $(tc),
                tw = _this.eq(1).attr('con_na');
            var Num = dom.parents(".table-box").find($("."+tw)).find('.tableCenter').size();
            if (Num > 0)
            {
                dom.parents(".table-box").find(_this).find('.tip-num').text(Num).show();
            }
            else
            {
                //dom.find('.tip-num').hide();
                dom.parents(".table-box").find(_this).find('.tip-num').hide();
            }

        }

        //$('.equipmen').on('DOMNodeInserted',showTipNum).on('DOMNodeRemoved',showTipNum);
        //$('.serve').on('DOMNodeInserted',showTipNum).on('DOMNodeRemoved',showTipNum);
        //$('.othe').on('DOMNodeInserted',showTipNum).on('DOMNodeRemoved',showTipNum);

        $(".equipmen").on("click",function()
        {
            $(this).find(".tip-num").hide();
            $(this).css({background:"#cfe6ff"});
            $(".equ").show();
            $(".ser").hide();
            $(".oth").hide();
            $(this).parent().find($(".serve")).css({background:"none"});
            $(this).parent().find($(".othe")).css({background:"none"});
            showTipNum($(this),".server");
            showTipNum($(this),".other");
            $('.countTotal').text("");
        });
        $(".serve").on("click",function()
        {
            $(this).find(".tip-num").hide();
            $(".equ").hide();
            $(".ser").show();
            $(".oth").hide();
            $(this).parent().find($(".equipmen")).css({background:"none"});
            $(this).parent().find($(".othe")).css({background:"none"});
            $(this).css({background:"#cfe6ff"});
            showTipNum($(this),".equipmen");
            showTipNum($(this),".other");
            $('.countTotal').text("");
        });
        $(".othe").on("click",function()
        {
            $(this).find(".tip-num").hide();
            $(".equ").hide();
            $(".ser").hide();
            $(".oth").show();
            $(this).parent().find($(".equipmen")).css({background:"none"});
            $(this).parent().find($(".serve")).css({background:"none"});
            $(this).css({background:"#cfe6ff"});
            showTipNum($(this),".equipmen");
            showTipNum($(this),".serve");
            $('.countTotal').text("");
        });
        $(".amontNoTax").on("blur",function(){

            var sum =  1+(Number($('.tax option:selected').val())/100);
            if($('.tax option:selected').val() == "0"){
                $(".contractAmont").val(Number($(this).val()))
            }else{
                $(".contractAmont").val((Number($(this).val())/sum).toFixed(2));
            }
        });
        $(".tax").on("change",function(){
            if($(".amontNoTax").val()!=""){
                var sum =  1+(Number($(this).val())/100);
                if($(this).val == "0"){
                    $(".contractAmont").val($(".amontNoTax").val()||"");
                }else{
                    $(".contractAmont").val((Number($(".amontNoTax").val())/sum).toFixed(2)||"");
                }
            }else{}
        });
        function addTable(obj1, obj2, obj3)
        {
            var id = 0;
            obj3.on("click", function() {
                var len = obj1.find("th").size(),
                    str = "", //添加input
                    zStr = "", //添加一行
                    flagAdd = false, //判断必填项
                    flagSave = true, //编辑判断数字
                    flagAdd1 = true, //添加判断数字
                    flag = false, //储存属性对应的value值
                    val = "";
                var that = $(this);
                var type = $(this).attr("detailType");
                var add = true;
                $(this).parent().parent("tr").find(".needChoose").each(function(i,o){
                    if($(this).text()==""){
                        add = false;
                    }else{}
                });
                var valNum = $(this).parent("td").parent("tr").find($('[con_name="detailCount"]')).text();
                var valNum1 = $(this).parent("td").parent("tr").find($('[con_name="detailPrice"]')).text();
                var valNum2 = $(this).parent("td").parent("tr").find($('[con_name="detailTotal"]')).text();

                if(valNum){
                    if(RegCount.test(valNum)){
                        flagAdd1 = true;
                    }else{
                        flagAdd1 = false;
                        layer.confirm("请正确填写数量", {
                            shade: 0.1,
                            btn: ['确定'] //按钮
                        })
                    }
                }
                if(valNum2){
                    if(Reg.test(valNum)){
                        flagAdd1 = true;
                    }else{
                        flagAdd1 = false;
                        layer.confirm("请正确填写数字", {
                            shade: 0.1,
                            btn: ['确定'] //按钮
                        })
                    }
                }
                if(valNum1){
                    if(Reg.test(valNum1)){
                        flagAdd1 = true;
                    }else{
                        flagAdd1 = false;
                        layer.confirm("请正确填写单价", {
                            shade: 0.1,
                            btn: ['确定'] //按钮
                        })
                    }
                }
                if(valNum1&&valNum&&valNum2){
                    if(Reg.test(valNum1)&&RegCount.test(valNum)&&Reg.test(valNum2)){
                        flagAdd1 = true;
                    }else{
                        flagAdd1 = false;
                        layer.confirm("请正确填写总价", {
                            shade: 0.1,
                            btn: ['确定'] //按钮
                        })
                    }
                }


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
                                '<a href="javascript:;" class="del c-warning"><i class="Hui-iconfont" title="删除">&#xe6e2;</i></a></td>';
                        } else {
                            val =$(this).parent().parent("tr").find(".change").eq(i).text();

                            str += '<td><div contenteditable="false" style="z-index:1000" class="change  widthChange text-over" title="'+val+'">'+val+'</div></td>';
                        }
                        flagAdd = true;
                    };

                }
                zStr = '<tr id="' + id + '" detailType ="'+type+'" class="tableCenter">' + str + '</tr>';

                if(flagAdd&&flagAdd1) {
                    obj2.after(zStr);
                    obj1.find(obj2).find(".change").each(function(i,o){
                        $(this).attr("title","").text("").css({"z-index":1000000});
                    });
                    obj1.find(".tbody").find(".widthChange").each(function(i,o){
                        var width = $(this).width();
                        $(this).parent("td").css({position:"relative",width:width+"px"});
                        $(this).addClass("text-change").css({height:"22px"});
                    });
                    flagAdd = false;
                }
                $(obj1).find($(".tableCenter")).each(function(i,o){
                    if(i%2==0){
                        $(this).css({background:"#eee"});
                    }else{
                        $(this).css({background:"#fff"});
                    }
                });
                obj1.find(obj2).find("div").each(function(i,o){
                    if($(this).hasClass("needChoose")){
                        that.parent().parent("tr").next("tr").find("td").eq(i).find("div").addClass("needChoose");
                    }
                    if($(this).hasClass("Wdate")){
                        that.parent().parent("tr").next("tr").find("td").eq(i).find("div").attr("onfocus","WdatePicker()").addClass("Wdate1");
                    }
                    if($(this).attr("con_name")=="detailPrice"){
                        that.parent().parent("tr").next("tr").find("td").eq(i).find("div").attr("con_name","detailPrice");
                    }
                    if($(this).attr("con_name")=="detailCount"){
                        that.parent().parent("tr").next("tr").find("td").eq(i).find("div").attr("con_name","detailCount");
                    }
                    if($(this).attr("con_name")=="detailTotal"){
                        that.parent().parent("tr").next("tr").find("td").eq(i).find("div").attr("con_name","detailTotal");
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
                $(".edit").off("click").on("click", function() { //点击编辑
                    var _this = $(this),
                        len = _this.parents("tr").find(".needChoose").size(),
                        valAdd = "",arr=[];
                    for(var i = 0; i < len; i++) {
                        valAdd = _this.parents("tr").find(".needChoose").eq(i).text();
                        arr.push(valAdd);
                    }

                    for(var j = 0;j<arr.length;j++){
                        if(arr[j] == ""){
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
                        }else{
                            flag = true;
                        }
                    }

                    var valNum = $(this).parent("td").parent("tr").find($('[con_name="detailCount"]')).text();
                    var valNum1 = $(this).parent("td").parent("tr").find($('[con_name="detailPrice"]')).text();
                    var valNum2 = $(this).parent("td").parent("tr").find($('[con_name="detailTotal"]')).text();
                    if(valNum2){
                        if(Reg.test(valNum2)){
                            flag = true;
                        }else{
                            flag = false;
                            layer.confirm("请正确填写数量", {
                                shade: 0.1,
                                btn: ['确定'] //按钮
                            })
                        }
                    }
                    if(valNum1){
                        if(Reg.test(valNum1)){
                            flag = true;
                        }else{
                            flag = false;
                            layer.confirm("请正确填写单价", {
                                shade: 0.1,
                                btn: ['确定'] //按钮
                            })
                        }
                    }
                    if(valNum){
                        if(RegCount.test(valNum)){
                            flag = true;
                        }else{
                            flag = false;
                            layer.confirm("请正确填写数量", {
                                shade: 0.1,
                                btn: ['确定'] //按钮
                            })
                        }
                    }
                    if(valNum&&valNum1&&valNum2){
                        if(Reg.test(valNum1)&&RegCount.test(valNum)&&Reg.test(valNum2)){
                            flag = true;
                        }else{
                            flag = false;
                            layer.confirm("请正确填写总价", {
                                shade: 0.1,
                                btn: ['确定'] //按钮
                            })
                        }
                    }
                    if(flag){
                        if(flagSave) {

                            $(this).html('<i title="保存" class="Hui-iconfont"></i>');
                            _this.parents("tr").find(".change").css({
                                "border": "1px solid #006BFF",
                                "z-index":1000000
                            });
                            _this.parents("tr").find(".change").attr("contenteditable", "true");
                            _this.parents("tr").find(".Wdate1").each(function(i,o){
                                $(this).css({background:""});
                                $(this).addClass("Wdate");
                            });
                            flagSave = false;
                        }
                        else {
                            _this.html('<i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i>');
                            _this.parents("tr").find(".change").css({
                                "border": "1px solid rgb(238,238,238)",
                                "z-index":10000
                            });
                            _this.parents("tr").find(".Wdate1").each(function(i,o){
                                $(this).removeClass("Wdate");
                            });
                            _this.parents("tr").find(".change").removeAttr("contenteditable", "true");
                            flagSave = true;
                        }
                    }
                });
            });

        }
        window.setTree({
            ele: ".company-tree",
            url: ajaxUrl + "project/contract/findUnitTree",
            type: "POST",
            data: {id: 0},
            id: "id",
            value: "unitName",
            treeClick: function (data)
            {
                $("[con_name=settleBranch]").attr("settleBranch",$(this).parent().parent().attr("treeid"));
            }
        });
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/dictionary/findDictionary",
            data: {dictCode:"HB"},
            dataType: "json",
            success: function (msg) {
                if (msg && msg.success === 0) {
                    var str="";
                    for(var i=1;i<msg.data.length;i++){
                        str += '<option value="'+msg.data[i].dictCodeValue+'">'+msg.data[i].dictCodeName+'</option>';
                    }
                    $(".currency").append(str);
                }
            },
            error: function (err) {
                layer.confirm('操作失败', {
                    btn: ['确定','取消'],
                    shade: 0.1
                });
            }
        });
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "general/dictionary/findDictionary",
            data: {dictCode:"TAX"},
            dataType: "json",
            success: function (msg) {
                if (msg && msg.success === 0) {
                    var str="";
                    for(var i=0;i<msg.data.length;i++){
                        str += '<option value="'+msg.data[i].dictCodeValue+'">'+msg.data[i].dictCodeName+'</option>';
                    }
                    $(".tax").append(str);
                }
            },
            error: function (err) {
                layer.confirm('操作失败', {
                    btn: ['确定','取消'],
                    shade: 0.1
                });
            }
        });
        $.myAjax({
            type: "POST",
            url: window.ajaxUrl + "project/contract/findUserInfo",
            data: {},
            dataType: "json",
            success: function (msg) {
                if (msg && msg.success === 0) {
                    var data = msg.data;
                    $("[con_name=baseDepartment]").val(data.unitName);
                    $("[con_name=baseContact]").val(data.userRealName);
                    $("[con_name=basePhone]").val(data.userMobilePhone);
                }
            },
            error: function (err) {
                layer.confirm('操作失败', {
                    btn: ['确定','取消'],
                    shade: 0.1
                });
            }
        });
        var getVal = function(sendData,dom)
        {
            dom.find("input").each(function(i,o)
            {
                if($(this).attr("con_name")){
                    sendData[$(this).attr("con_name")] = $(this).val();
                }
            });
            dom.find("textarea").each(function(i,o)
            {
                if($(this).attr("con_name")){
                    sendData[$(this).attr("con_name")] = $(this).val();
                }
            });
            return sendData;
        };
        $(".agree-box").hide();
        $(".work-box").hide();
        $(".agreeWrap").hide();
        $(".contractPage").css({background:"#cfe6ff"});
        $(".contractPage").on("click",function(){

            $(".agree-box").hide();
            $(".work-box").hide();
            $(".agreeWrap").hide();
            $(".workWrap").hide();

            $(this).css({background:"#cfe6ff"});
            $(".agreementPage").css({background:"none"});
            $(".workPage").css({background:"none"});
            $(".contract-wrap").show();
            $(".contract-box").show();
            $(".contract-box").find(".file-list").show();
            $('.countTotal').text("");
            $(".work-box").find(".file-list").html("");
            $(".agree-box").find(".file-list").html("");
            $(".contract-box").find(".file-list").html("");
            type = $(this).attr("co_name");
            validTap($(".contract-box"),".contract");
        });
        $(".agreementPage").on("click",function(){
            $(".contract-box").find(".file-list").html("");
            $(".contract-box").hide();
            $(".work-box").hide();
            $(".contract-wrap").hide();
            $(".workWrap").hide();
            $(".agreeWrap").show();
            $(".agree-box").show();
            $(this).css({background:"#cfe6ff"});
            $(".contractPage").css({background:"none"});
            $(".workPage").css({background:"none"});
            $('.countTotal').text("");
            $(".work-box").find(".file-list").html("");
            $(".agree-box").find(".file-list").html("");
            getAttach($(".agree-box"),$(".upload-file1"),$("#upload1"),$(".file-list1"));
            type = $(this).attr("co_name");
            validTap($(".agree-box"),".agree");
        });
        $(".workPage").on("click",function(){
            $(".contract-box").hide();
            $(".contrat-wrap").hide();
            $(".agree-box").hide();
            $(".agreeWrap").hide();
            $(".contract-wrap").hide();
            $(".workWrap").show();
            $(".work-box").show();
            $('.countTotal').text("");
            $(this).css({background:"#cfe6ff"});
            $(".agreementPage").css({background:"none"});
            $(".contractPage").css({background:"none"});
            /*addTable($(".work-box .contractList"),$(".contractList .listTr"), $(".contractList .btnList"));
            addTable($(".work-box .serList"),$(".serList .listTr"), $(".serList .serbtnList"));*/
            $(".contract-box").find(".file-list").html("");
            $(".agree-box").find(".file-list").html("");
            $(".work-box").find(".file-list").html("");
            getAttach($(".work-box"),$(".upload-file2"),$("#upload2"),$(".file-list2"));
            type = $(this).attr("co_name");
            validTap($(".work-box"),".work");
        });



        function getData(data,box){
            var detailList = data.data, STr = null, flagSave = true, STr1 = null, STr2 = null,sum = "";
            if (detailList != null) {
                $.each(detailList, function (i, v) {
                    for (var key in v) {
                        if (v[key] == null) {
                            v[key] = "";
                        }
                    }

                    if (v.detailType == "QDLX-SB") {
                        /*if(v.detailName == ""||v.detailUnit==""|| v.detailCount ==""){
                            layer.confirm("有设备清单必填项没有填写，请确认", {
                                shade: 0.1,
                                btn: ['确定'] //按钮
                            })
                        }else{

                        }*/
                        var Id = v.id,
                            view = $('<a style="text-decoration:none" class="ml-5"  href="pro-manage-edit.html"></a>');
                        STr = $('<tr  detailType="QDLX-SB"  class="text-c tableCenter" listId="' + Id + '"></tr>');//一行)
                        STr.append($('<td></td>').append($("<div class='needChoose change widthChange text-over' title='" + v.detailName + "'></div>").text(v.detailName)));
                        STr.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailModel + "' ></div>").text(v.detailModel)));
                        STr.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailCompany + "'></div>").text(v.detailCompany)));
                        STr.append($('<td></td>').append($("<div class='change needChoose widthChange text-over' title='" + v.detailUnit + "' ></div>").text(v.detailUnit)));
                        if(v.detailPrice == "0"){
                            v.detailPrice = "";
                        }
                        STr.append($('<td></td>').append($("<div con_name='detailPrice' class='change widthChange text-over' title='" + v.detailPrice + "' ></div>").text(v.detailPrice)));
                        if(v.detailCount == "0"){
                            v.detailCount = "";
                        }
                        STr.append($('<td></td>').append($("<div con_name='detailCount' class='needChoose change widthChange text-over' title='" + v.detailCount + "' ></div>").text(v.detailCount)));

                        sum = Number(Number(v.detailPrice)*Number(v.detailCount)).toFixed(2);
                        if(sum == "0.00"){
                            sum = "";
                        }
                        STr.append($('<td></td>').append($("<div con_name='detailTotal' class='change widthChange text-over' title='" + v.detailTotal + "' ></div>").text(sum)));
                        STr.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailRemark + "' ></div>").text(v.detailRemark)));

                        var tmpBtn = '<td class="btns">';
                        tmpBtn += '<a href="javascript:;" class="edit"><i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i></a>' +
                            '<a href="javascript:;" detailType="QDLX-SB" class="del c-warning"><i class="Hui-iconfont" title="删除">&#xe609;</i></a>' +
                            '</td>';

                        STr.append(tmpBtn);
                        box.find($(".equ .tableList")).find(".listTr").after(STr);
                        $(".equ").find("tr:even").css({background:"#eee"});
                        $(".equ").find("tr:odd").css({background:"#fff"});

                        if(box.find($(".equipment")).css("background") == "rgb(207, 230, 255) none repeat scroll 0% 0% / auto padding-box border-box"){
                            box.find($(".equipment")).find(".tip-num").hide();
                        }else{
                            box.find($(".equipment")).find(".tip-num").text(box.find($(".equ")).find(".tableCenter").length).show();
                        }
                    }
                    else if (v.detailType == "QDLX-FW") {
                        if(v.detailName == ""){
                           /* layer.confirm("请填写服务清单必填项", {
                                shade: 0.1,
                                btn: ['确定'] //按钮
                            })*/
                        }else{
                            var Id = v.id,
                                view = $('<a  style="text-decoration:none" class="ml-5"  href="pro-manage-edit.html"></a>');
                            STr1 = $('<tr detailType="QDLX-FW" class="text-c tableCenter" listId="' + Id + '"></tr>');//一行)
                            STr1.append($('<td></td>').append($("<div class='needChoose change widthChange text-over' title='" + v.detailName + "'></div>").text(v.detailName)));
                            var date = new Date(v.detailStartDate.time);
                            var date1 = new Date(v.detailEndDate.time);
                            var date2 = window.formatDate(date);
                            if(date2 == "NaN-NaN-NaN"){
                                date2 = "";
                            }
                            var date3 = window.formatDate(date1);
                            if(date3 == "NaN-NaN-NaN"){
                                date3 = "";
                            }
                            if(v.detailCount == "0"){
                                v.detailCount = "";
                            }
                            STr1.append($('<td></td>').append($("<div class='Wdate1 change widthChange text-over' onfocus= 'WdatePicker()' title='" + date2 + "'></div>").text(date2)));
                            STr1.append($('<td></td>').append($("<div class='Wdate1 change widthChange text-over' onfocus= 'WdatePicker()'  title='" +date3 + "'></div>").text(date3)));

                            STr1.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailCount + "'></div>").text(v.detailCount)));
                            STr1.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailUnit + "'></div>").text(v.detailUnit)));
                            STr1.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailRemark + "'></div>").text(v.detailRemark)));

                            var tmpBtn = '<td class="btns">';
                            tmpBtn += '<a href="javascript:;" detailType="QDLX-FW" class="edit"><i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i></a>' +
                                '<a href="javascript:;" class="del c-warning"><i class="Hui-iconfont" title="删除">&#xe609;</i></a>' +
                                '</td>';
                            STr1.append(tmpBtn);
                            box.find($(".ser .tableList")).find(".listTr").after(STr1);
                            $(".ser").find("tr:even").css({background:"#eee"});
                            $(".ser").find("tr:odd").css({background:"#fff"});

                            if(box.find($(".server")).css("background") == "rgb(207, 230, 255) none repeat scroll 0% 0% / auto padding-box border-box"){
                                box.find($(".server")).find(".tip-num").hide();
                            }else{
                                box.find($(".server")).find(".tip-num").text(box.find($(".ser")).find(".tableCenter").length).show();
                            }

                        }

                    }
                    else if (v.detailType == "QDLX-QT") {
                        if(v.detailName == ""){
                           /* layer.confirm("请填写其他清单必填项", {
                                shade: 0.1,
                                btn: ['确定'] //按钮
                            })*/
                        }else{
                            var Id = v.id,
                                view = $('<a  style="text-decoration:none" class="ml-5"  href="pro-manage-edit.html"></a>');
                            STr2 = $('<tr detailType="QDLX-QT" class="text-c tableCenter" listId="' + Id + '"></tr>');//一行)
                            STr2.append($('<td></td>').append($("<div class='needChoose change widthChange text-over' title='" + v.detailName + "'></div>").text(v.detailName)));
                            if(v.detailCount == "0"){
                                v.detailCount = "";
                            }
                            STr2.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailCount + "'></div>").text(v.detailCount)));
                            STr2.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailUnit + "'></div>").text(v.detailUnit)));
                            STr2.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailRemark + "'></div>").text(v.detailRemark)));

                            var tmpBtn = '<td class="btns">';
                            tmpBtn += '<a href="javascript:;" detailType="QDLX-QT" class="edit"><i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i></a>' +
                                '<a href="javascript:;" class="del c-warning"><i class="Hui-iconfont" title="删除">&#xe609;</i></a>' +
                                '</td>';
                            STr2.append(tmpBtn);
                            box.find($(".oth .tableList")).find(".listTr").after(STr2);
                            $(".oth").find("tr:even").css({background:"#eee"});
                            $(".oth").find("tr:odd").css({background:"#fff"});

                            if(box.find($(".other")).css("background") == "rgb(207, 230, 255) none repeat scroll 0% 0% / auto padding-box border-box"){
                                box.find($(".other")).find(".tip-num").hide();
                            }else{
                                box.find($(".other")).find(".tip-num").text(box.find($(".oth")).find(".tableCenter").length).show();
                            }
                        }

                    }
                    validTap($(".work-box"),".work");
                    $(".del").on("click", function () {
                        var _this = $(this);
                        var id = $(this).parent().parent().attr("listId");
                        layer.confirm("确定要删除吗？", {
                                shade: 0.1,
                                btn: ['确定', '取消'] //按钮
                            },
                            function () {
                                _this.parents("tr").remove("");
                                $(".layui-layer-shade").hide();
                                $(".layui-layer").hide();
                            },
                            function () {
                            })
                    });
                    $(".edit").off("click").on("click",function () { //点击编辑
                        var id = $(this).parent().parent().attr("listId");
                        var _this = $(this);
                        var type = $(this).parent().parent("tr").attr("detailType");
                        var arr = [],listAdd = true;
                        _this.parents("tr").find(".needChoose").each(function(i,o){
                            arr.push($(this).text());
                        });
                        $(".tbody").on("blur", ".change", function () {
                            if ($(this).attr("con_name") == "detailPrice" && $(this).text() != "") {
                                if (Reg.test($(this).text())) {
                                    flagNum = true
                                } else {
                                    flagNum = false;
                                }
                            }
                            if ($(this).attr("con_name") == "detailCount" && $(this).text() != "") {
                                if ($(this).text() != "" && RegCount.test($(this).text())) {
                                    flagNum1 = true
                                } else {
                                    flagNum1 = false;
                                }
                            }
                            if (flagNum && flagNum1) {
                                if (_this.parent().parent("tr").find($('[con_name="detailPrice"]')).text() != "" &&_this.parent().parent("tr").find($('[con_name="detailCount"]')).text() != "") {
                                    var sum = Number(_this.parent().parent("tr").find($('[con_name="detailPrice"]')).text()) * Number(_this.parent().parent("tr").find($('[con_name="detailCount"]')).text());
                                    var reg1 = /./g;

                                    if (Reg.test(String(sum))) {
                                        var arr = String(sum).split(".");
                                        if (arr[1]) {
                                            if (arr[1].length == 1) {
                                                var arr1 = arr[1].substring(0, 1);
                                            } else if (arr[1].length > 1) {
                                                var arr1 = arr[1].substring(0, 2);
                                            }
                                        } else {
                                            arr1 = "00";
                                        }

                                        _this.parent().parent("tr").find($('[con_name="detailTotal"]')).text(arr[0] + "." + arr1 + "")
                                    } else {

                                        _this.parent().parent("tr").find($('[con_name="detailTotal"]')).text(sum);
                                    }
                                }
                            }
                        });
                        if (flagSave) {
                            $(this).html('<i title="保存" class="Hui-iconfont"></i>');

                            _this.parents("tr").find(".change").css({
                                "border": "1px solid #006BFF",
                                "z-index": 1000000
                            });
                            _this.parents("tr").find(".change").attr("contenteditable", "true");
                            _this.parents("tr").find(".Wdate1").each(function(i,o){
                                $(this).css({background:""});
                                $(this).addClass("Wdate");
                            });

                            flagSave = false;
                        } else {
                            for(var i = 0;i<arr.length;i++){
                                if(arr[i] == ""){
                                    listAdd = false;
                                    layer.confirm('请输入必填选项', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    });
                                    break;
                                }
                                if(i == arr.length - 1){
                                    _this.html('<i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i>');

                                    _this.parents("tr").find(".change").css({
                                        "border": "1px solid rgb(238,238,238)",
                                        "z-index": 10000
                                    });
                                    _this.parents("tr").find(".change").removeAttr("contenteditable", "true");

                                    _this.parents("tr").find(".Wdate1").each(function(i,o){
                                        $(this).removeClass("Wdate");
                                    });
                                    flagSave = true;
                                    var arr2 = [];
                                    $(this).parent().parent("tr").parent(".tbody").find(".firstTr").find("div").each(function (i, o) {
                                        arr2.push($(this).attr("con_name"));
                                    });
                                    var objArr = [];
                                    var hasObj = {};
                                    _this.parent().parent().find("div").each(function (i, o) {
                                        hasObj[arr2[i]] = $(this).attr("title");
                                    });
                                    if (type == "QDLX-SB") {
                                        hasObj["detailType"] = "QDLX-SB";
                                    } else if (type == "QDLX-FW") {
                                        hasObj["detailType"] = "QDLX-FW";
                                    } else if (type == "QDLX-QT") {
                                        hasObj["detailType"] = "QDLX-QT";
                                    }
                                    $(this).find("div").each(function (i, o) {
                                        hasObj[arr2[i]] = $(this).attr("title");
                                    });
                                    hasObj.contractId = projectId;
                                }
                            }
                        }

                    });
                });
            }
        }
        var upload = $(".load-file");
        upload.on("change",function ()
        {
            excelUpload({
                createUrl: "project/contract/importFileNoSave",//增加地址
                form: $("#load"),
                success: function (data)
                {
                    getData(data,$(".contract-box"));
                }
            });
        });
        var uploadFile1 = $(".load-file1");
        uploadFile1.on("change",function ()
        {
            excelUpload({
                createUrl: "project/contract/importFileNoSave",//增加地址
                form: $("#load1"),
                success: function (data)
                {
                    getData(data,$(".agree-box"));
                }
            });
        });
        var uploadFile2 = $(".load-file2");
        uploadFile2.on("change",function ()
        {
            excelUpload({
                createUrl: "project/contract/importFileNoSave",//增加地址
                form: $("#load2"),
                success: function (data)
                {
                    getData(data,$(".work-box"));
                }
            });
        });
        function validTap(box,btn){
            box.Validform({
                btnSubmit: btn,
                tiptype:2,
                datatype: {
                    "date": /^\d{4}\-\d{2}\-\d{2}$/,
                    "phone": /^0\d{2,3}-?\d{7,8}$/,
                    "Post": /^[0-9][0-9]{5}$/,
                    "Number":/^\d{1,13}((\.\d{1,2})?)$/

                },
                beforeSubmit:function(curform){
                    var arr0 = [],flag = false;
                    box.find($(".tbody")).find(".tableCenter").each(function(i,o)
                    {
                        var that = $(this);
                        if($(this).find("div").eq(0).attr("contenteditable") == "true"){
                            flag = true;
                            arr0.push($(this));
                        }

                    });
                    if(flag)
                    {
                        var ind = layer.confirm('有清单没有确认，请确认', {
                                btn: ['确定'],
                                shade: 0.1
                            },
                            function(){
                                layer.close(ind);
                                box.find(".equ").hide();
                                box.find(".ser").hide();
                                box.find(".oth").hide();
                                box.find(".equipment").css({background:"none"});
                                box.find(".server").css({background:"none"});
                                box.find(".other").css({background:"none"});
                                console.log(arr0);
                                var ca = arr0[0].parents(".table").attr("col_self");
                                $("."+ca+"").css({background:"#cfe6ff"});
                                arr0[0].parents(".table").parent("div").show();
                            });

                    }else{
                        var arr = [];
                        var obj = $(".addSelf");
                        var getAttr1 = obj.find("th");

                        //获取自定义属性
                        obj.find(".tableCenter").each(function(i,o)
                        {
                            var sendArr = {};
                            var name = $(this).find("td input").eq(0).val(),
                                code = $(this).find("td input").eq(1).val();
                            var str="";
                            sendArr[name] = code;
                            str = JSON.stringify(sendArr);
                            arr.push(str);
                        });
                        sendData = getVal({}, box);
                        sendData.contractClassify = type;
                        sendData.currency = $('.currency option:selected').val()||"";
                        sendData.tax = $('.tax option:selected').val()||"";

                        //sendData.contractCustom = "["+arr+"]";
                        //获取清单
                        var arr2 = [],arr3 = [],arr4=[];
                        var objArr = [];
                        box.find($(".tbody")).find(".tableCenter").each(function(i,o){
                            var hasObj = {};
                            var that = $(this);
                            if($(this).attr("detailType") == "QDLX-SB"){
                                box.find($(".contractList")).find(".listTr").find("div").each(function(i,o){
                                    arr2.push($(this).attr("con_name"));
                                });
                                hasObj["detailType"] = "QDLX-SB";
                                that.find("div").each(function(i,o){
                                    hasObj[arr2[i]] = $(this).attr("title");
                                });
                                objArr.push(hasObj);
                            }else if($(this).attr("detailType") == "QDLX-FW"){
                                box.find($(".serList")).find(".listTr").find("div").each(function(i,o){
                                    arr3.push($(this).attr("con_name"));
                                });
                                hasObj["detailType"] = "QDLX-FW";
                                that.find("div").each(function(i,o){
                                    hasObj[arr3[i]] = $(this).attr("title");
                                });
                                objArr.push(hasObj);
                            }else if($(this).attr("detailType") == "QDLX-QT"){
                                hasObj["detailType"] = "QDLX-QT";
                                box.find($(".othList")).find(".listTr").find("div").each(function(i,o){
                                    arr4.push($(this).attr("con_name"));
                                });
                                that.find("div").each(function(i,o){
                                    hasObj[arr4[i]] = $(this).attr("title");
                                });
                                objArr.push(hasObj);
                            }


                        });
                        var arrP = box.find($(".file-list p")),strId = "";
                        if (arrP.size() > 0)
                        {
                            $.each(arrP, function (i, v)
                            {
                                strId += "," + $(v).attr("attachId");
                            });
                            strId = strId.substr(1);
                        }
                        sendData.attachmentId = strId;
                        sendData.projectId = projectId;
                        sendData.detailList = JSON.stringify(objArr);
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/contract/createPContract",
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
                                        function(){
                                            parent.window.location.reload();
                                        });

                                    $(document).on("click",".layui-layer-close",function(){
                                        parent.window.location.reload();
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
        }
        validTap($(".contract-box"),".save");
        $(".contractCode").on("blur",function(){
            var contractCode = $(this).val();
            if(contractCode == ""){
                $(".has-contractCode .Validform_checktip").removeClass("Validform_right");
                $(".contractCode").addClass("Validform_error");
                $(".has-contractCode .Validform_checktip").addClass("Validform_wrong");
                $(".contractCode-tip").attr("title","请输入用户名");
            }else {
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/contract/checkContractCode",
                    data: {contractCode: contractCode},
                    dataType: "json",
                    success: function (msg) {
                        if (msg && msg.success === 0) {
                            if (msg.data == 0) {
                                $(".contractCode").removeClass("Validform_error");
                                $(".has-contractCode .Validform_checktip").removeClass("Validform_wrong");
                                $(".contractCode-tip").attr("title", "该合同编号可以使用");
                                $(".has-contractCode .Validform_checktip").addClass("Validform_right");
                            } else {
                                $(".has-contractCode .Validform_checktip").removeClass("Validform_right");
                                $(".contractCode").addClass("Validform_error");
                                $(".has-contractCode .Validform_checktip").addClass("Validform_wrong");
                                layer.confirm('该合同编号已存在', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    });
                                $(".contractCode-tip").attr("title", "该合同编号已存在");
                            }
                        }
                    },
                    error: function (err) {
                        layer.confirm('操作失败', {
                            btn: ['确定','取消'],
                            shade: 0.1
                        });
                    }
                });
            }
        });
        function getAttach(box,form,attach,list){
            var uploadFile = box.find(form);
            uploadFile.off().on("change",function ()
            {
                var _this = this;
                fileUpload({
                    ths: _this,
                    msg: "正在上传请稍后",
                    form: box.find(attach),
                    fileList: list,
                    createUrl: "project/attachment/create",//增加地址
                    infoUrl: "project/attachment/createFileInfo",//返回信息地址
                    delUrl: "project/attachment/deleteFileById",//删除的地址
                    sendData: {}
                });
            });
        }
        getAttach($(".contract-box"),$(".upload-file0"),$("#upload"),$(".file-list0"));

    });
}(jQuery, window, document));
