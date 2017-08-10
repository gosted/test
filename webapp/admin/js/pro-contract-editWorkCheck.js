/**
 * 本文件是合同编辑页js文件
 * @author 彭佳明
 */

(function ($, w, d) {
    'use strict';

    $(function () {
        var contractId = window.parent.layerViewData.contractId,
            contractType = window.parent.layerViewData.contractType,
            tables = $(".table-box>.form-table"),
            sendData = {};
        var projectId = window.parent.layerViewData.projectId;
        var Reg = /^\d{1,13}((\.\d{1,12})?)$/;
        window.getTd(tables);
        var flagNum = true, flagNum1 = true;
        //请求合同原有信息
        $.myAjax(
            {
                type: "POST",
                url: window.ajaxUrl + "project/contract/findById",
                data: {id: contractId},
                dataType: "json",
                success: function (data) {
                    if (data && data.success === 0) {
                        var _data = data.data, ids = "";
                        var arr = [
                            "contractName",
                            "contractCode",
                            "contractA",
                            "contractB",
                            "contractIntro"
                        ];
                        ids = data.data.attachmentId;
                        if (ids) {
                            $.myAjax({
                                type: "POST",
                                url: window.ajaxUrl + "project/attachment/findByIds",
                                data: {"ids": ids},
                                success: function (data) {
                                    if (data && data.success === 0) {
                                        var needInfo = "";
                                        if (contractType == "HTFL-HT") {
                                            needInfo = $(".contract-box");
                                        } else if (contractType == "HTFL-XY") {
                                            needInfo = $(".agree-box");
                                        } else if (contractType == "HTFL-GD") {
                                            needInfo = $(".work-box");
                                        }
                                        setData(data, needInfo);
                                    }
                                }
                            });
                        }
                        $.each(arr, function (i, v) {
                            var keyVal = _data[v];

                            if (!(keyVal === null || keyVal === "")) {
                                $('[con_name="' + v + '"]').text(keyVal);
                            }
                        });
                        if (contractType == "HTFL-GD") {
                            $(".workWrap").show();
                            $(".work-box").show();

                            addTable($(".work-box .contractList"), $(".work-box .contractList .listTr"), $(".work-box .contractList .btnList"));
                            addTable($(".work-box .serList"), $(".work-box .serList .listTr"), $(".work-box .serList .serbtnList"));
                            addTable($(".work-box .othList"), $(".work-box .othList .listTr"), $(".work-box .othList .othbtnList"));
                            getAttach($(".work-box"), $(".upload-file2"), $("#upload2"));
                            validTap($(".work-box"), ".work");
                            arr.push("settleBranch ", "baseDepartment", "baseDepartment", "baseContact", "basePhone", "settleConfirm", "settlePhone", "supportNum","settleBranch", "manMonth", "contractAmont", "taskSummary", "paymentMode", "workContent");
                        }
                        $.each(arr, function (i, v) {
                            var keyVal = _data[v];

                            if (!(keyVal === null || keyVal === "")) {
                               if (contractType == "HTFL-GD") {
                                    $(".work-box").find($('[con_name="' + v + '"]')).text(keyVal);
                                }

                            }
                        });
                        var signTime = new Date(_data.performTime);
                        var contractEstimated = new Date(_data.endTime);
                        $('[con_name="performTime"]').text(window.formatDate(signTime));
                        $('[con_name="endTime"]').text(window.formatDate(contractEstimated));
                        $('[con_name="explain"]').keyup();
                    }
                }
            });
        function setData(data, beforeBox) {
            var list = [],
                fileList = null,
                STr = null;

            fileList = $(".file-list");
            list = data.data;
            fileList.html("");

            $.each(list, function (i, v) {
                var img = $("<img />"),
                    button = $("<a class='btn btn-success radius ml-10'><i class='Hui-iconfont'>&#xe6e2</i>删除</a>"),
                    arrImg = [
                        "doc",
                        "ppt",
                        "xls",
                        "zip",
                        "txt",
                        "pdf",
                        "htm",
                        "mp3",
                        "mp4",
                        "png"
                    ],
                    nameArr = [],
                    str = "",
                    type = "unknown",
                    p = $('<p></p>');

                if (v.attachName) {
                    nameArr = v.attachName.split(".");
                    str = nameArr[nameArr.length - 1];
                }
                else {
                    return false;
                }
                p.attr("attachId", v.attachId);
                str = str.substr(0, 3);
                $.each(arrImg, function (i, v) {
                    if (str.toLowerCase() === v) {
                        type = v;
                    }
                    else if ((str.toLowerCase() === "avi") || (str.toLowerCase() === "wmv")) {
                        type = "mp4";
                    }
                    else if ((str.toLowerCase() === "gif") || (str.toLowerCase() === "jpg")) {
                        type = "png";
                    }
                    else {

                    }
                });
                img.attr("src", "../../images/commen/" + type + ".png");
                p.append(img);
                p.append('<span title="点击下载文件" style="cursor: pointer">' + v.attachName + '</span>');
                button.on("click", function () {
                    var _this = $(this),
                        id = $(this).parent().attr("attachId");
                    $.myAjax({
                        type: "POST",
                        url: ajaxUrl + "project/attachment/deleteFileById",
                        data: {"id": id},

                        success: function (data) {
                            if (data.success === 0) {
                                _this.parent().remove();
                            }
                        },
                        error: function (msg) {
                            layer.confirm('删除失败', {
                                btn: ['确定', '取消'],
                                shade: 0.1
                            });
                        }
                    });
                });
                fileList.append(p);
            });

            fileList.on("click", "p>span", function () {
                var _this = $(this).parent(),
                    DownLoadFile = function (options) {
                        var config = $.extend(true, {method: 'post'}, options);
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
                    "data": {"attachId": _this.attr("attachId")}
                });
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "general/attachmentPro/checkIsLogin",
                    data: {},
                    dataType: "json",
                    success: function (data) {
                        if (data && data.success === 0) {

                        }
                    }
                });
            });
        }

        $(".ser").hide();
        $(".oth").hide();
        $(".equ").show();
        $(".equipment").css({background: "#cfe6ff"});
        $(".equipment").on("click",function()
        {
            $(".equipment").find(".tip-num").hide();
            $(this).css({background:"#cfe6ff"});
            $(".equ").show();
            $(".ser").hide();
            $(".oth").hide();
            $(".server").css({background:"none"});
            $(".other").css({background:"none"});
            $(".server").find(".tip-num").show();
            $(".other").find(".tip-num").show();
            showTipNum(".server");
            showTipNum(".other");
            $('.countTotal').text("");
        });

        $(".server").on("click",function()
        {
            $(this).find(".tip-num").hide();
            $(".equ").hide();
            $(".oth").hide();
            $(".ser").show();
            $(".equipment").css({background:"none"});
            $(".other").css({background:"none"});
            showTipNum(".equipment");
            showTipNum(".other");
            $(this).css({background:"#cfe6ff"});
            $('.countTotal').text("");
        });
        $(".other").on("click",function()
        {
            $(this).find(".tip-num").hide();
            $(".equ").hide();
            $(".ser").hide();
            $(".oth").show();
            $(".equipment").css({background:"none"});
            $(".server").css({background:"none"});
            $(".equipment").find(".tip-num").show();
            $(".server").find(".tip-num").show();
            showTipNum(".equipment");
            showTipNum(".server");
            $(this).css({background:"#cfe6ff"});
            $('.countTotal').text("");
        });

        var getVal = function (sendData, dom) {
            dom.find("input").each(function (i, o) {
                if ($(this).attr("con_name")) {
                    sendData[$(this).attr("con_name")] = $(this).val();
                }
            });
            dom.find("textarea").each(function(i,o){
                if ($(this).attr("con_name")) {
                    sendData[$(this).attr("con_name")] = $(this).val();
                }
            });
            return sendData;
        };
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
        //请求清单原有信息
        function getData(){
            $.myAjax(
                {
                    type: "POST",
                    url: window.ajaxUrl + "project/contract/findDetail",
                    data: {contractId: contractId},
                    dataType: "json",
                    success: function (msg) {
                        if (msg && msg.success === 0) {
                            getList(msg,"true");
                        }
                    }
                });
        }
        getData();
        function getList(msg,flag){
            var detailList = msg.data, STr = null, flagSave = true, STr1 = null, STr2 = null;
            if (detailList != null) {
                $.each(detailList, function (i, v) {
                    for (var key in v) {
                        if (v[key] == null) {
                            v[key] = "";
                        }
                    }

                    if (v.detailType == "QDLX-SB") {
                        if(v.detailName == ""||v.detailUnit==""|| v.detailCount ==""){
                            /*layer.confirm("请填写设备清单必填项", {
                             shade: 0.1,
                             btn: ['确定'] //按钮
                             })*/
                        }else{
                            var Id = v.id,
                                view = $('<a style="text-decoration:none" class="ml-5"  href="pro-manage-edit.html"></a>');
                            STr = $('<tr save="'+flag+'"  detailType="QDLX-SB"  class="text-c tableCenter" listId="' + Id + '"></tr>');//一行)
                            STr.append($('<td></td>').append($("<div class='needChoose change widthChange text-over' title='" + v.detailName + "'></div>").text(v.detailName)));
                            STr.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailModel + "' ></div>").text(v.detailModel)));
                            STr.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailCompany + "'></div>").text(v.detailCompany)));
                            STr.append($('<td></td>').append($("<div class='change needChoose widthChange text-over' title='" + v.detailUnit + "' ></div>").text(v.detailUnit)));
                            STr.append($('<td></td>').append($("<div con_name='detailPrice' class='change widthChange text-over' title='" + v.detailPrice + "' ></div>").text(v.detailPrice)));
                            if(v.detailCount == "0"){
                                v.detailCount = ""
                            }
                            STr.append($('<td></td>').append($("<div con_name='detailCount' class='needChoose change widthChange text-over' title='" + v.detailCount + "' ></div>").text(v.detailCount)));
                            if(flag == "false"){
                                STr.append($('<td></td>').append($("<div con_name='detailTotal' class='change widthChange text-over' title='" + v.detailTotal + "' ></div>").text(Number(v.detailPrice)*Number(v.detailCount).toFixed(2)))||"");
                            }else{
                                STr.append($('<td></td>').append($("<div con_name='detailTotal' class='change widthChange text-over' title='" + v.detailTotal + "' ></div>").text(v.detailTotal)));
                            }
                            STr.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailRemark + "' ></div>").text(v.detailRemark)));

                            $(".equ .tableList").find(".listTr").after(STr);
                            $(".equ").find("tr:even").css({background:"#eee"});
                            $(".equ").find("tr:odd").css({background:"#fff"});

                            $(".equipment").find(".tip-num").text($(".equ").find(".tableCenter").length).show();
                        }

                    } else if (v.detailType == "QDLX-FW") {
                        if(v.detailName == ""){
                            /*layer.confirm("请填写服务清单必填项", {
                             shade: 0.1,
                             btn: ['确定'] //按钮
                             })*/
                        }else{
                            var Id = v.id,
                                view = $('<a  style="text-decoration:none" class="ml-5"  href="pro-manage-edit.html"></a>');
                            STr1 = $('<tr save="'+flag+'" detailType="QDLX-FW" class="text-c tableCenter" listId="' + Id + '"></tr>');//一行)
                            STr1.append($('<td></td>').append($("<div class='needChoose change widthChange text-over' title='" + v.detailName + "'></div>").text(v.detailName)));
                            if(flag == "false"){
                                var date = new Date(v.detailStartDate.time);
                                var date1 = new Date(v.detailEndDate.time);
                            }else{
                                var date = new Date(v.detailStartDate);
                                var date1 = new Date(v.detailEndDate);
                            }
                            var getDate = window.formatDate(date);
                            var getDate1 = window.formatDate(date1);
                            if(getDate == "NaN-NaN-NaN"){
                                getDate = "";
                            }
                            if(getDate1 == "NaN-NaN-NaN"){
                                getDate1 = "";
                            }
                            STr1.append($('<td></td>').append($("<div class='Wdate1 change widthChange text-over' onfocus= 'WdatePicker()' title='" + getDate + "'></div>").text(getDate)));
                            STr1.append($('<td></td>').append($("<div class='Wdate1 change widthChange text-over' onfocus= 'WdatePicker()'  title='" +getDate1 + "'></div>").text(getDate1)));
                            if(v.detailCount == "0"){
                                v.detailCount = ""
                            }
                            STr1.append($('<td></td>').append($("<div con_name='detailCount' class='change widthChange text-over' title='" + v.detailCount + "'></div>").text(v.detailCount)));
                            STr1.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailUnit + "'></div>").text(v.detailUnit)));
                            STr1.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailRemark + "'></div>").text(v.detailRemark)));

                            $(".ser .tableList").find(".listTr").after(STr1);
                            $(".ser").find("tr:even").css({background:"#eee"});
                            $(".ser").find("tr:odd").css({background:"#fff"});

                            $(".server").find(".tip-num").text($(".ser").find(".tableCenter").length).show();
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
                            STr2 = $('<tr save="'+flag+'" detailType="QDLX-QT" class="text-c tableCenter" listId="' + Id + '"></tr>');//一行)
                            STr2.append($('<td></td>').append($("<div class='needChoose change widthChange text-over' title='" + v.detailName + "'></div>").text(v.detailName)));
                            if(v.detailCount == "0"){
                                v.detailCount = ""
                            }
                            STr2.append($('<td></td>').append($("<div con_name='detailCount' class='change widthChange text-over' title='" + v.detailCount + "'></div>").text(v.detailCount)));
                            STr2.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailUnit + "'></div>").text(v.detailUnit)));
                            STr2.append($('<td></td>').append($("<div class='change widthChange text-over' title='" + v.detailRemark + "'></div>").text(v.detailRemark)));

                            $(".oth .tableList").find(".listTr").after(STr2);
                            $(".oth").find("tr:even").css({background:"#eee"});
                            $(".oth").find("tr:odd").css({background:"#fff"});

                            $(".other").find(".tip-num").text($(".oth").find(".tableCenter").length).show();

                        }

                    }

                });
            }
        }
        function showTipNum (tc)
        {
            var _this = $(tc),
                tw = _this.attr('con_na');
            var Num = $("."+tw).find('.tableCenter').size();
            if (Num > 0)
            {
                _this.find('.tip-num').text(Num).show();
            }
            else
            {
                _this.find('.tip-num').hide();
            }

        }
        //动态表格改变大小
        window.change = function(){
            $(".tbody").find($(".widthChange")).each(function(i,o){
                var width = $(this).width();
                $(this).parent("td").css({position:"relative",width:width+"px"});
            });
            $(".tbody").on("focus",".change",function(){
                var width = $(this).width();
                $(this).removeClass("text-over");
                $(this).css({height:"auto"});
                $(this).parent("td").css({position:"relative",width:width+"px"});
                $(this).addClass("text-change");
                $(this).addClass("bg");
                $(this).text($(this).attr("title"));
                var reg = /[0-9]{1,13}/;
                if($(this).attr("con_name") =="detailPrice"&&$(this).text()!=""){
                    if(Reg.test($(this).text())){
                        flagNum = true
                    }else{
                        flagNum = false;
                        $(this).parent().parent().find($('[con_name="detailTotal"]')).text("")
                    }
                }
                if($(this).attr("con_name") =="detailCount"&&$(this).text()!=""){
                    if(Reg.test($(this).text())){
                        flagNum1 = true
                    }else{
                        flagNum1 = false;
                        $(this).parent().parent().find($('[con_name="detailTotal"]')).text("")
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
                var reg = /[0-9]{1,13}/;
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
                    if(Reg.test($(this).text())){
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
        function addTable(obj1, obj2, obj3) {
            var id = 0;
            obj3.on("click", function () {
                var len = obj1.find("th").size(),
                    str = "", //添加input
                    zStr = "", //添加一行
                    flagAdd = false, //添加
                    flagSave = true,
                    flagAdd1 = true,
                    flag = false, //储存属性对应的value值
                    val = "";
                var that = $(this);
                var add = true;
                var type = $(this).attr("detailType");
                $(this).parent().parent("tr").find(".needChoose").each(function (i, o) {
                    if ($(this).text() == "") {
                        add = false;
                    } else {
                    }
                });
                var valNum = $(this).parent("td").parent("tr").find($('[con_name="detailCount"]')).text();
                var valNum1 = $(this).parent("td").parent("tr").find($('[con_name="detailPrice"]')).text();
                if(valNum){
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
                        layer.confirm("请正确填写数字", {
                            shade: 0.1,
                            btn: ['确定'] //按钮
                        })
                    }
                }
                if(valNum1&&valNum){
                    if(Reg.test(valNum1)&&Reg.test(valNum)){
                        flagAdd1 = true;
                    }else{
                        flagAdd1 = false;
                        layer.confirm("请正确填写数字", {
                            shade: 0.1,
                            btn: ['确定'] //按钮
                        })
                    }
                }
                if (!add) {
                    flagAdd = false;
                    layer.confirm("请填入必填项", {
                            shade: 0.1,
                            btn: ['确定'] //按钮
                        },
                        function () {
                            $(".layui-layer-shade").hide();
                            $(".layui-layer").hide();
                        },
                        function () {
                            $(".layui-layer-shade").hide();
                            $(".layui-layer").hide();
                        })
                } else {
                    for (var i = 0; i < len; i++) {

                        if (i == len - 1) {
                            str += '<td class="eidt"><a href="javascript:;" class="edit"><i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i></a>' +
                                '<a href="javascript:;" class="del c-warning"><i class="Hui-iconfont" title="删除">&#xe6e2;</i></a></td>';
                        } else {
                            val = $(this).parent().parent("tr").find(".change").eq(i).text();

                            str += '<td><div contenteditable="false" style="z-index:1000;" class="change  widthChange" title="' + val + '">' + val + '</div></td>';
                        }
                        flagAdd = true;
                    };

                }
                zStr = '<tr save="true" detailType="' + type + '" id="' + id + '" class="tableCenter">' + str + '</tr>';
                var newAdd = false;

                if (flagAdd && flagAdd1) {
                    obj2.after(zStr);
                    newAdd = true;
                    obj1.find(obj2).find(".change").each(function (i, o) {
                        $(this).attr("title", "").text("").css({"z-index": 1});
                    });
                    obj1.find(".tbody").find(".widthChange").each(function (i, o) {
                        var width = $(this).width();
                        $(this).parent("td").css({position: "relative", width: width + "px"});
                        $(this).addClass("text-change").css({height: "22px"});
                    });
                    flagAdd = false;
                }
                $(obj1).find($(".tableCenter")).each(function(i,o){
                    if(i%2==0){
                        $(this).css({background:"#eee"});
                    }else{
                        $(this).css({background:"#fff"});
                    }
                })
                if (newAdd) {
                    obj1.find(obj2).find("div").each(function (i, o) {
                        if ($(this).hasClass("needChoose")) {
                            that.parent().parent("tr").next("tr").find("td").eq(i).find("div").addClass("needChoose");
                        }
                        if ($(this).hasClass("Wdate")) {
                            that.parent().parent("tr").next("tr").find("td").eq(i).find("div").attr("onfocus", "WdatePicker()").addClass("Wdate1");
                        }
                        if ($(this).hasClass("Wdate")) {
                            that.parent().parent("tr").next("tr").find("td").eq(i).find("div").attr("onfocus", "WdatePicker()").addClass("Wdate1");
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
                    var arr2 = [];
                    $(this).parent().parent("tr").find("div").each(function (i, o) {
                        arr2.push($(this).attr("con_name"));
                    });
                    var detailTYpe = $(this).attr("detailType");
                    var objArr = [];
                    var hasObj = {};
                    $(this).parent().parent().next().find("div").each(function (i, o) {
                        hasObj[arr2[i]] = $(this).attr("title");
                    });
                    if (detailTYpe == "QDLX-SB") {
                        hasObj["detailType"] = "QDLX-SB";
                    } else if (detailTYpe == "QDLX-FW") {
                        hasObj["detailType"] = "QDLX-FW";
                    } else if (detailTYpe == "QDLX-QT") {
                        hasObj["detailType"] = "QDLX-QT";
                    }
                    $(this).find("div").each(function (i, o) {
                        hasObj[arr2[i]] = $(this).attr("title");
                    });
                    hasObj.contractId = contractId;
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "project/contract/createDetail",
                        data: hasObj,
                        dataType: "json",
                        success: function (msg) {
                            if (msg && msg.success === 0) {
                                $(".firstTr").next("tr").attr("listId",msg.data);
                            }
                        }
                    });
                }
            });
        }
        //excel导入清单
        var uploadFile = $(".upload-file1");
        uploadFile.on("change",function ()
        {
            excelUpload({
                createUrl: "project/contract/importFileNoSave",//增加地址
                form: $("#upload1"),
                success: function (data)
                {
                    getList(data,"false");
                }
            });
        });

        $(".work-box").on("click",".del",function () {
            var _this = $(this);
            var id = $(this).parent().parent().attr("listId");
            var flag = $(this).parent().parent().attr("save");
            if(flag == "false"){
                layer.confirm("确定要删除吗？", {
                        shade: 0.1,
                        btn: ['确定', '取消'] //按钮
                    },
                    function () {
                        _this.parents("tr").remove("");
                        $(".layui-layer-shade").hide();
                        $(".layui-layer").hide();
                    })
            }else{
                layer.confirm("确定要删除吗？", {
                        shade: 0.1,
                        btn: ['确定', '取消'] //按钮
                    },
                    function () {
                        _this.parents("tr").remove("");
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/contract/deleteDetail",
                            data: {ids: id},
                            dataType: "json",
                            success: function (msg) {
                                if (msg && msg.success === 0) {

                                }
                            }
                        });
                        $(".layui-layer-shade").hide();
                        $(".layui-layer").hide();
                    })
            }

        });
        var  flagSave = true;
        $(".work-box").on("click",".edit",function () { //点击编辑

            var id = $(this).parent().parent().attr("listId");
            var _this = $(this);
            var type = $(this).parent().parent("tr").attr("detailType");
            var arr = [],listAdd = true;
            _this.parents("tr").find(".needChoose").each(function(i,o){
                arr.push($(this).text());
            });
            _this.parents("tr").find("div").each(function(i,o){
                $(this).attr("title",$(this).text());
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
                var newFlag = true;
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
                        var valNum = $(this).parent("td").parent("tr").find($('[con_name="detailCount"]')).text();
                        var valNum1 = $(this).parent("td").parent("tr").find($('[con_name="detailPrice"]')).text();

                        if(valNum1){
                            if(Reg.test(valNum1)){
                                newFlag = true;
                            }else{
                                newFlag = false;
                                layer.confirm("请正确填写数字", {
                                    shade: 0.1,
                                    btn: ['确定'] //按钮
                                })
                            }
                        }
                        if(valNum){
                            if(Reg.test(valNum)){
                                newFlag = true;
                            }else{
                                newFlag = false;
                                layer.confirm("请正确填写数字", {
                                    shade: 0.1,
                                    btn: ['确定'] //按钮
                                })
                            }
                        }
                        if(valNum&&valNum1){
                            if(Reg.test(valNum)&&Reg.test(valNum1)){
                                newFlag = true;
                            }else{
                                newFlag = false;
                                layer.confirm("请正确填写数字", {
                                    shade: 0.1,
                                    btn: ['确定'] //按钮
                                })
                            }
                        }
                        if(newFlag){
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
                                $(this).attr("title",$(this).text());
                            });
                            $(this).find("div").each(function (i, o) {
                                hasObj[arr2[i]] = $(this).text();
                            });
                            if( _this.parent().parent().attr("save") == "false"){
                                hasObj.contractId = contractId;
                                if(listAdd){
                                    $.myAjax({
                                        type: "POST",
                                        url: window.ajaxUrl + "project/contract/createDetail",
                                        data: hasObj,
                                        dataType: "json",
                                        success: function (msg) {
                                            if (msg && msg.success === 0) {
                                                _this.parent().parent("tr").attr("listId",msg.data);
                                                _this.parent().parent("tr").attr("save","true");
                                            }
                                        }
                                    });
                                }
                            }else if( _this.parent().parent().attr("save") == "true"){
                                var id = _this.parent().parent().attr("listId");
                                hasObj.id = id;
                                if(listAdd){
                                    $.myAjax({
                                        type: "POST",
                                        url: window.ajaxUrl + "project/contract/updateDetail",
                                        data: hasObj,
                                        dataType: "json",
                                        success: function (msg) {
                                            if (msg && msg.success === 0) {
                                            }
                                        }
                                    });
                                }
                            }
                        }else{
                            layer.confirm("请正确填写数字", {
                                shade: 0.1,
                                btn: ['确定'] //按钮
                            })
                        }
                    }
                }
            }

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
                                var ca = arr0[0].parents(".table").attr("col_self");
                                $("."+ca+"").css({background:"#ddd"});
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
                        sendData.contractClassify = contractType;
                        sendData.currency = $('.currency option:selected').val();
                        sendData.tax = $('.tax option:selected').val();
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
                        //sendData.contractCustom = "["+arr+"]";
                        //获取清单
                        var arr2 = [],arr3 = [],arr4=[];
                        var objArr = [];
                        box.find($(".tbody")).find(".tableCenter").each(function(i,o){
                            var hasObj = {};
                            var that = $(this);
                            if($(this).attr("save") == "false"){

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
                                }}
                        });
                        sendData.detailList = JSON.stringify(objArr);
                        sendData.id = contractId;
                        sendData.projectId = projectId;
                        $.myAjax({
                            type: "POST",
                            url: window.ajaxUrl + "project/contract/updatePContract",
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



        function getAttach(box, form, attach) {
            var uploadFile = box.find(form);
            uploadFile.on("change", function () {
                var _this = this;

                fileUpload({
                    ths: _this,
                    msg: "正在上传请稍后",
                    form: box.find(attach),
                    fileList: $(".file-list"),
                    createUrl: "project/attachment/create",//增加地址
                    infoUrl: "project/attachment/createFileInfo",//返回信息地址
                    delUrl: "project/attachment/deleteFileById",//删除的地址
                    sendData: {}
                });
            });
        }

    });
}(jQuery, window, document));
