/**
 * 本文件的功能是出库单查看页js文件
 *@ author 王步华
 */

(function($, w, d){
    'use strict';
    $(function() {
        var libId = parent.window.layerViewData.libId,
            pageSize = 20,
            pageNo = 1,
            sendData = {},
            flag = false,
            flagSave = false,
            onlyCode = true,
            objsbing = 0;

        //添加40个td
        window.getTd($(".form-table"));

        /*
        *请求已有表格信息
        * */
        function tableBok() {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "operation/outboundorder/findById",
                data: {id: libId},
                success: function (data) {
                    if (data && data.success === 0) {
                        var box = $("#table-box");
                        setFormInfo(box, data);
                        $(".outOrderNames").attr("sourceId",data.data.sourceId);
                        $(".storageNames").attr("storageId",data.data.id);
                        var sendData = {
                            pageSize: pageSize,
                            pageNo: pageNo,
                            outOrderId: $(".storageNames").attr("storageId"),
                            sourceId: $(".outOrderNames").attr("sourceId")
                        };
                        findPagelist(sendData);
                    }
                }
            });
        }

        /*
         * setFormInfo填写表单信息方法，传表单jq对象和请求到的数据
         * */
        function setFormInfo (box,data)
        {
            var conNames = box.find('[con_name]'),
                _data = data.data,
                dttrlist = _data.logList,   //快递单号数据
                key = "",
                keyVal = "",
                cust ="",
                _radio = null,
                OTr = null,
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
                            conNames.eq(i).text(keyVal);
                        }
                    }
                }
            }
            $(".detailedList").attr("ids",_data.sourceId);
            /*
             * 回显快递单号
             */
            if(dttrlist != null && dttrlist != ""){
                for(var x=0; x<dttrlist.length; x++){
                    cust ="";
                    cust +='<tr id="'+dttrlist[x].id+'" class="tableCenter">'+
                        '<td>'+
                        '<div class="needChoose widthChange pl-5" value="'+ dttrlist[x].logisticsClassify +'">'+ dttrlist[x].logisticsClassify +'</div>'+
                        '</td>'+
                        '<td>'+
                        '<div class="needChoose widthChange pl-5">'+ dttrlist[x].logisticsCode +'</div>'+
                        '</td>'+
                        '</tr>'

                    $(".expre").append(cust);
                }
            }
            findIds();
        }


        /*
        *获取工单清单数据
        * */
        function findIds() {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "project/proDeviceList/findByIds",
                data: {
                    ids: $(".detailedList").attr("ids")
                },
                success: function (data) {
                    if (data && data.success === 0) {
                        setTable(data);
                    }
                }
            });
        }
        /*
         * 渲染工单清单数据
         * */
        function setTable (data)
        {
            var list = [],
                tbody = $(".tbodyIds"),
                STr = null;

            list = data.data;
            tbody.html("");
            if(list != "" || list != null){
                $.each(list, function (i, v)
                {
                    var atachms = "";
                    if(v.equipmentIcon == "" || v.equipmentIcon == null){
                        atachms = "../../images/temporary/equ_logo.png";
                    }else{
                        atachms = window.ajaxUrl+'project/attachment/downloadImage?id='+ v.equipmentIcon
                    }

                    STr = $('<tr class="text-c" libId="'+ v.id+'"></tr>');//一行

                    STr.append('<td class="text-l pl-3"><img src="'+ atachms +'"><span>'+ ((v.detailName == null || "" || undefined) ? "" : v.detailName) +'</span></td>');

                    STr.append('<td>' + ((v.detailModel == null || "" || undefined) ? "" : v.detailModel) + '</td>');

                    STr.append('<td>' + ((v.detailCompany == null || "" || undefined) ? "" : v.detailCompany) + '</td>');

                    STr.append('<td>' + ((v.detailUnit == null || "" || undefined) ? "" : v.detailUnit) + '</td>');

                    STr.append('<td ><span class="red">'+ ((v.outNum == null || "" || undefined) ? "" : v.outNum) +'</span>/<span>'+ ((v.detailCount == null || "" || undefined) ? "" : v.detailCount) + '</span></td>');

                    STr.append('<td>' + ((v.detailRemark == null || "" || undefined) ? "" : v.detailRemark) + '</td>');

                    tbody.append(STr);
                    /*
                     * tr颜色间隔问题
                     * */
                    var trs = tbody.find("tr");
                    for(var i=0; i<trs.length;i++){
                        if(i%2 == 0){
                            trs.eq(i).css("background","#fff");
                        }else{
                            trs.eq(i).css("background","#eee");
                        }
                    }
                });
            }
        }


        /*
        *获取设备清单数据
        */
        function findPagelist(sendData) {
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "operation/outorderdetall/findPage",
                data: {
                    pageSize: sendData.pageSize,
                    pageNo: sendData.pageNo,
                    outOrderId: sendData.outOrderId,
                    sourceId: sendData.sourceId
                },
                success: function (data) {
                    if (data && data.success === 0) {
                        var _data = data.data.result;
                        equipmentList(_data);

                        laypage({
                            cont: $('#pagination'), //容器。值支持id名、原生dom对象，jquery对象。【如该容器为】：<div id="page1"></div>
                            pages: data.data.pageCount, //通过后台拿到的总页数
                            curr: data.data.pageNo || 1, //当前页
                            first: false,
                            last: false,
                            skip: true, //是否开启跳页
                            jump: function (obj, first) { //触发分页后的回调
                                if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                                    var sendData = {
                                        pageSize: pageSize,
                                        pageNo: obj.curr,
                                        outOrderId: $(".storageNames").attr("storageId"),
                                        sourceId: $(".outOrderNames").attr("sourceId")
                                    };

                                    $.myAjax({
                                        type: "POST",
                                        url: window.ajaxUrl + "operation/outorderdetall/findPage",
                                        data: sendData,
                                        success: function (data) {
                                            if (data && data.success === 0) {
                                                var _data = data.data.result;
                                                equipmentList(_data);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        if ($('.pagination .con_much').size() === 0) {
                            $('.pagination').append('<div class="con_much l">' +
                                '<span>' +
                                '每页<i class="con_list_num">20</i>条' +
                                '</span>' +
                                '<i></i>' +
                                '<ul class="clear">' +
                                '<li class="con_num_5"><span>10</span></li>' +
                                '<li class="con_num_10"><span>20</span></li>' +
                                '<li class="con_num_15"><span>50</span></li>' +
                                '<li class="con_num_20"><span>100</span></li>' +
                                '<li class="con_num_25"><span>200</span></li>' +
                                '<li class="con_num_30"><span>1000</span></li>' +
                                '</ul>' +
                                '</div>');
                            $('.pagination').append("<div class='con_altogether'><span>总共<span class='allpage'>" + data.data.pageCount + "</span>页</span></div>");
                        }
                        $(".allpage").html(data.data.pageCount);
                        //分页结束
                    }
                }
            });
        }
        tableBok();
        /*每页显示多少条*/
        $(".pagination").on("click", ".con_much>i", function()
        {
            var _this = $(this),
                _ul = _this.parents(".con_much").children("ul");

            _ul.css({"display": "block"});
            return false;
        });
        $(".pagination").on("click", "ul span", function ()
        {
            var _num = $(".pagination").find(".con_much .con_list_num"),
                _ul = $(".pagination").find(".con_much").children("ul");
            pageSize = $(this).html();
            _num.html(pageSize);
            _ul.css({"display": "none"});
            sendData = {
                pageSize: pageSize,
                pageNo: pageNo,
                outOrderId: $(".storageNames").attr("storageId"),
                sourceId: $(".outOrderNames").attr("sourceId")
            };
            findPagelist (sendData);
            return false;
        });
        $(document).on("click", function(e)
        {
            var evn = e || window.event;
            if ($(evn.target).parents(".con_much").size() === 0)
            {
                $(".con_much ul").hide();
            }
        });
        //选择每页显示多少条事件

        function equipmentList(data){
           var pmentlist = data;
            if(pmentlist != null || pmentlist != ""){
                    deviceListList(pmentlist);
            }
        }
        //循环设备清单
        function deviceListList(data){
            var list ="",
                objsbing = 0,
                pmentlist = data;
            $(".deviceList").html("");
            for (var x = 0; x < pmentlist.length; x++) {
                objsbing++;
                    var outDetailNum = ((pmentlist[x].outDetailNum == null || "" || undefined) ? "" : pmentlist[x].outDetailNum);                //数量       、、、
                    var atachmentId =  ((pmentlist[x].atachmentId == null || "" || undefined) ? "" : pmentlist[x].atachmentId);                          //设备图片
                    var deviceListCode = ((pmentlist[x].equipmentName == null || "" || undefined) ? "" : pmentlist[x].equipmentName);                  //设备分类   、、、
                    var stockdetailName = ((pmentlist[x].outDetailName == null || "" || undefined) ? "" : pmentlist[x].outDetailName);          //设备名称          、、、
                    var stockdetailModel = ((pmentlist[x].outDetailModel == null || "" || undefined) ? "" : pmentlist[x].outDetailModel);            //型号       、、、
                    var stockdetailCode = ((pmentlist[x].outDetailCode == null || "" || undefined) ? "" : pmentlist[x].outDetailCode);          //设备编号         、、、
                    var baseAssetCode = ((pmentlist[x].baseAssetCode == null || "" || undefined) ? "---" : pmentlist[x].baseAssetCode);                 //资产编号
                    var shelfName = ((pmentlist[x].shelfName == null || "" || undefined) ? "" : pmentlist[x].shelfName);                              //货架位置
                    var stockdetailRemark = ((pmentlist[x].outDetailRemark == null || "" || undefined) ? "" : pmentlist[x].outDetailRemark);         //说明备注     、、、
                list = "";
                var atachms = "";
                if(pmentlist[x].atachmentId == "" || pmentlist[x].atachmentId == null){
                    atachms = "../../images/temporary/equ_logo.png";
                }else{
                    atachms = window.ajaxUrl+'project/attachment/downloadImage?id='+ atachmentId
                }

                list += '<div class="deviceList-li pb-10">' +
                    '<div class="deviceList-li-top">' +
                    '<div class="li-top-si f-l grade">'+ objsbing +'</div>' +
                    '<div class="f-l lineHeight pr-20"><img class="ml-5 mr-5" src="'+ atachms + '">设备分类：<sapn class="colors">' + deviceListCode + '</sapn></div>' +
                    '<div class="f-l lineHeight pr-20">设备名称：<sapn class="colors stockdetailName">' + stockdetailName + '</sapn></div>' +
                    '<div class="f-l lineHeight pr-20">型号：<sapn class="colors">'+ stockdetailModel + '</sapn></div>' +
                    '</div>' +
                    '<div class="deviceList-li-bot">' +
                    '<div class="f-l equipmentNumber">' +
                    '<div class="equipmentNumber-div text-c">' + stockdetailCode + '</div> ' +
                    '<p class="equipmentNumber-p">设备编号</p>' +
                    '</div>' +
                    '<div class="f-l assetNumber">' +
                    '<div class="equipmentNumber-div text-c">' + baseAssetCode + '</div>' +
                    '<p class="equipmentNumber-p">资产编号</p>' +
                    '</div>' +
                    '<div class="f-l shelfPosition">' +
                    '<div class="equipmentNumber-div text-c">' + shelfName + '</div>' +
                    '<p class="equipmentNumber-p">货架位置</p>' +
                    '</div>' +
                    '<div class="f-l number">' +
                    '<div class="equipmentNumber-div">' +
                    '<div class="equipmentNumber-divs">' +
                    '<div class="f-l equipmentNumber-div-left">' +
                    '<a style="text-decoration:none" class="ml-5 " href="javascript:;" title="减">' +
                    '<i class="Hui-iconfont">&#xe6a1;</i>' +
                    '</a>' +
                    '</div>' +
                    '<div class="f-l text-c equipmentNumber-div-main">' + outDetailNum + '</div>' +
                    '<div class="f-l equipmentNumber-div-right">' +
                    '<a style="text-decoration:none" class="ml-5 " href="javascript:;" title="加">' +
                    '<i class="Hui-iconfont">&#xe600;</i>' +
                    '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<p class="equipmentNumber-p text-c">数量</p>' +
                    '</div>' +
                    '<div class="f-l remarks">' +
                    '<div class="outDetailRemark" contenteditable="true">' + stockdetailRemark + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'

                $(".deviceList").append(list);
            }
        }


    });
}(jQuery, window, document));

