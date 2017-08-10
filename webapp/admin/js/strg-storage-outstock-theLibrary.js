/**
 * 本文件的功能是出库信息js文件
 *@ author 王步华
 */

(function($, w, d){
    'use strict';
    $(function() {
        var libId = parent.window.layerViewData.libId,
            pageSize = 20,
            pageNo = 1,
            sendData={},
            flag = false,
            flagSave = false,
            onlyCode = true,
            objsbing = 0,
            arrts = [],
            objsbings=0;

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
                        $(".storageNames").attr("storageId",data.data.storageId);
                        $(".storageNames").attr("gdId",data.data.id);
                    }
                }
            });
        }
        tableBok();
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
                $(".tableCenter").remove();
                for(var x=0; x<dttrlist.length; x++){
                    cust ="";
                    cust +='<tr id="'+dttrlist[x].id+'" class="tableCenter">'+
                        '<td>'+
                        '<div class="needChoose widthChange pl-5" value="'+ dttrlist[x].logisticsClassify +'">'+ dttrlist[x].logisticsClassify +'</div>'+
                        '</td>'+
                        '<td>'+
                        '<div class="needChoose widthChange pl-5">'+ dttrlist[x].logisticsCode +'</div>'+
                        '</td>'+
                        '<td class="eidt">'+
                        '<a href="javascript:;" class="edit ml-5" title="编辑">'+
                        '<i class="Hui-iconfont changePos">&#xe70c;</i>'+
                        '</a>'+
                        '<a href="javascript:;" class="del ml-5" title="删除">'+
                        '<i class="Hui-iconfont">&#xe6e2;</i>'+
                        '</a>'+
                        '</td>'+
                        '</tr>'

                    $(".firstTr").after(cust);
                }
            }
            if(data.data.outOrderType == "CKLX-GD"){
                $(".detailedList").css("display", "block");
                $(".express").css("background-color", "#f6f6f6");
                findIds();
            }else if(data.data.outOrderType == "CKLX-QT"){
                $(".detailedList").css("display", "none");
                $(".express").css("background-color", "#ffffff");
            }

        }


        /*
        *获取工单清单数据
        * */
        function findIds() {
            var detailedLists =  $(".detailedList").attr("ids");
            if(detailedLists != "") {
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "project/proDeviceList/findByIds",
                    data: {
                        ids: detailedLists
                    },
                    success: function (data) {
                        if (data && data.success === 0) {
                            setTable(data);
                        }
                    }
                });
            }
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
            if(list != "" && list != null){
                $.each(list, function (i, v)
                {
                    STr = $('<tr class="text-c" libId="'+ v.id+'"></tr>');//一行

                    if(v.equipmentIcon === "" || v.equipmentIcon == null)
                    {
                        STr.append('<td class="text-l pl-3">' +
                            '<img class="pr-5" src="../../images/temporary/equ_logo.png"/>'+
                            '<span>'+ ((v.detailName == null || "" || undefined) ? "" : v.detailName) +'</span></td>');
                    }
                    else
                    {
                        STr.append('<td class="text-l pl-3">' +
                            '<img class="pr-5" ' +
                            'src="'+window.ajaxUrl+'project/attachment/downloadImage?id='+v.equipmentIcon+'"/>' +
                            '<span>'+ ((v.detailName == null || "" || undefined) ? "" : v.detailName) +'</span></td>');
                    }

                    STr.append('<td>' + ((v.detailModel == null || "" || undefined) ? "" : v.detailModel) + '</td>');

                    STr.append('<td>' + ((v.detailCompany == null || "" || undefined) ? "" : v.detailCompany) + '</td>');

                    STr.append('<td>' + ((v.detailUnit == null || "" || undefined) ? "" : v.detailUnit) + '</td>');

                    STr.append('<td ><span class="red">'+ ((v.outNum == null || "" || undefined) ? "" : v.outNum) +'</span>/<span>'+ ((v.detailCount == null || "" || undefined) ? "" : v.detailCount) + '</span></td>');

                    STr.append('<td title="'+ v.equipmentName+'">' + ((v.equipmentName == null || "" || undefined) ? "" : v.equipmentName) + '</td>');

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
        $(".confirm").on("click",firmEquipm);

        $(document).keyup(function(evn){
            var e = evn || window.event;
            if (e.keyCode == 13)
            {
                firmEquipm();
            }
        });

        function firmEquipm () {
            var mianSoso = $(".mian-soso").find("input").val(),
                sourceId = $(".outOrderNames").attr("sourceId"),
                storageId = $(".storageNames").attr("storageId");
            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "operation/stockdetail/findByCode",
                data: {
                    code: mianSoso,
                    storageId: storageId,
                    sourceId: sourceId
                },
                success: function (data) {
                    if (data && data.success === 0) {
                        var arrts = [],
                            arrtsarrts = data.data;
                        $(".deviceList-list").each(function(){
                            arrts.push($(this).attr("stockDetailId"));
                        });

                        $.each(arrtsarrts, function (i, v) {
                            if (arrtsarrts.length > 1) {
                                equipmentList(arrtsarrts);
                                $(".mian-soso").find("input").val("");
                            } else {
                                if (arrts.indexOf(arrtsarrts[i].id) >= 0) {
                                    layer.confirm('该条数据已存在', {
                                        btn: ['确定'],
                                        shade: 0.1
                                    });
                                } else {
                                    equipmentList(arrtsarrts);
                                    $(".mian-soso").find("input").val("");
                                }
                            }
                        })
                    }
                }
            });
        }

        //请求数据，多条弹框选择
        function equipmentList(data){
           var pmentlist = data;
            if(pmentlist != null && pmentlist != ""){
                if(pmentlist.length == 1) {
                    deviceListList(pmentlist);
                }else if(pmentlist.length > 1){

                    $(".deviceList-list").each(function(){
                        arrts.push($(this).attr("stockDetailId"));
                    });

                    $(".bombBox").css("display","block");
                    var STr=null;
                    $(".tbodys").html("");
                    $.each(pmentlist, function (i, v)
                    {
                        if(arrts.indexOf(v.id)>=0){

                        }else{
                            STr = $('<tr class="text-c" outOrderId="'+ libId+'" storageId="'+ (v.storageId || "")+'" ' +
                                ' shelfId="'+ (v.shelfId || "")+'" outDetailName="'+ (v.stockdetailName || "")+'" equipmentId="'+ (v.equipmentId || "")+'" outDetailCode="'+ (v.stockdetailCode || "")+'"' +
                                ' outDetailModel="'+ (v.stockdetailModel || "")+'" outDetailParam="'+ (v.stockdetailParam || "")+'" outDetailUnit="'+ (v.stockdetailUnit || "")+'" outDetailNum="'+ (v.stockdetailNum || "")+'"' +
                                ' baseAssetCode="'+ (v.baseAssetCode || "")+'" companyAssetCode="'+ (v.companyAssetCode || "")+'"  sourceId="'+ (v.sourceId || "")+'" outDetailRemark="'+ (v.stockdetailRemark || "")+'"' +
                                'attachmentId ="'+ (v.attachmentId || "")+'" deviceListCode="'+ (v.deviceListCode || "")+'" stockdetailName="'+ (v.stockdetailName || "")+'" stockdetailModel="'+ (v.stockdetailModel || "")+'"' +
                                'stockdetailCode ="'+ (v.stockdetailCode || "")+'" shelfName="'+ (v.shelfName || "")+'" stockdetailNum="'+ (v.stockdetailNum || "")+'" stockdetailRemark="'+ (v.stockdetailRemark || "")+'"' +
                                'stockDetailId="'+ v.id+'" price="'+(v.price || "")+'"></tr>');//一行

                            STr.append('<td><input type="checkbox" name="chebox" workOrderName = '+((v.workOrderName == null || "" || undefined) ? "" : v.workOrderName) +'></td>');

                            STr.append('<td class="text-l pl-3 outOrderName">' + ((v.deviceListCode == null || "" || undefined) ? "" : v.deviceListCode) + '</td>');

                            STr.append('<td>' + ((v.stockdetailName == null || "" || undefined) ? "" : v.stockdetailName) + '</td>');

                            STr.append('<td>' + ((v.stockdetailModel == null || "" || undefined) ? "" : v.stockdetailModel) + '</td>');

                            STr.append('<td>' + ((v.baseAssetCode == null || "" || undefined) ? "" : v.baseAssetCode) + '</td>');

                            STr.append('<td>' + ((v.shelfName == null || "" || undefined) ? "" : v.shelfName) + '</td>');

                            STr.append('<td>' + ((v.stockdetailNum == null || "" || undefined) ? "" : v.stockdetailNum) + '</td>');

                            $(".tbodys").append(STr);

                            /*
                             * tr颜色间隔问题
                             * */
                            var trs = $("tbodys").find("tr");
                            for(var i=0; i<trs.length;i++){
                                if(i%2 == 0){
                                    trs.eq(i).css("background","#fff");
                                }else{
                                    trs.eq(i).css("background","#eee");
                                }
                            }
                            /*
                            *将弹框垂直居中
                            */
                            var bombBox_mian = $(".bombBox-mian").height();
                            $(".bombBox-mian").css("margin-top",(bombBox_mian/2)*-1);
                        }
                    });
                }
            }
        }
        $(".layui-layer-close1").on("click",function(){
            $(".bombBox").css("display","none");
        });

        //循环设备清单
        function deviceListList(data){
            var list ="",
                pmentlist = data;

            for (var x = 0; x < pmentlist.length; x++) {
                objsbing++;
                list = "";
                    var  stockDetailId = ((pmentlist[x].id == null || "" || undefined) ? "" : pmentlist[x].id);      //单条数据id
                    var outOrderId = libId;                                                           //关联出库单id
                    var storageId = ((pmentlist[x].storageId == null || "" || undefined) ? "" : pmentlist[x].storageId);                       //单条数据id
                    var shelfId = ((pmentlist[x].shelfId == null || "" || undefined) ? "" : pmentlist[x].shelfId);                              //关联货架id
                    //var outDetailName = ((pmentlist[x].outDetailName == null || "" || undefined) ? "" : pmentlist[x].outDetailName);            //名称
                    var equipmentId = ((pmentlist[x].equipmentId == null || "" || undefined) ? "" : pmentlist[x].equipmentId);                  //关联设备定义id
                    var outDetailCode = ((pmentlist[x].stockdetailCode == null || "" || undefined) ? "" : pmentlist[x].stockdetailCode);           //编号
                    //var outDetailModel = ((pmentlist[x].stockdetailModel == null || "" || undefined) ? "" : pmentlist[x].stockdetailModel);       //型号规格
                    var outDetailParam = ((pmentlist[x].stockdetailParam == null || "" || undefined) ? "" : pmentlist[x].stockdetailParam);        //关键参数
                    var outDetailUnit = ((pmentlist[x].stockdetailUnit == null || "" || undefined) ? "" : pmentlist[x].stockdetailUnit);             //单位
                    var outDetailNum = ((pmentlist[x].stockdetailNum == null || "" || undefined) ? "" : pmentlist[x].stockdetailNum);                //数量
                    var companyAssetCode = ((pmentlist[x].companyAssetCode == null || "" || undefined) ? "" : pmentlist[x].companyAssetCode);   //公司资产编号
                    var sourceId = ((pmentlist[x].sourceId == null || "" || undefined) ? "" : pmentlist[x].sourceId);                               //工单id
                    var outDetailRemark = ((pmentlist[x].stockdetailRemark == null || "" || undefined) ? "" : pmentlist[x].stockdetailRemark);         //备注
                    var outDetailTime  =  ((pmentlist[x].outDetailTime == null || "" || undefined) ? "" : pmentlist[x].outDetailTime);
                    var attachmentId =  ((pmentlist[x].attachmentId == null || "" || undefined) ? "" : pmentlist[x].attachmentId);                          //设备图片
                    var deviceListCode = ((pmentlist[x].deviceListCode == null || "" || undefined) ? "" : pmentlist[x].deviceListCode);                  //设备分类
                    var stockdetailName = ((pmentlist[x].stockdetailName == null || "" || undefined) ? "" : pmentlist[x].stockdetailName);          //设备名称
                    var stockdetailModel = ((pmentlist[x].stockdetailModel == null || "" || undefined) ? "" : pmentlist[x].stockdetailModel);            //型号
                    var stockdetailCode = ((pmentlist[x].stockdetailCode == null || "" || undefined) ? "" : pmentlist[x].stockdetailCode);          //设备编号
                    var baseAssetCode = ((pmentlist[x].baseAssetCode == null || "" || undefined) ? "---" : pmentlist[x].baseAssetCode);                 //资产编号
                    var shelfName = ((pmentlist[x].shelfName == null || "" || undefined) ? "" : pmentlist[x].shelfName);                              //货架位置
                    var stockdetailNum = ((pmentlist[x].stockdetailNum == null || "" || undefined) ? "" : pmentlist[x].stockdetailNum);                  //数量
                    var stockdetailRemark = ((pmentlist[x].stockdetailRemark == null || "" || undefined) ? "" : pmentlist[x].stockdetailRemark);         //说明备注
                    var price = ((pmentlist[x].price == null || "" || undefined) ? "" : pmentlist[x].price);         //单价

                var atachm = "";
                if(pmentlist[x].attachmentId == "" || pmentlist[x].attachmentId == null){
                    atachm = "../../images/temporary/equ_logo.png";
                }else{
                    atachm = window.ajaxUrl+'project/attachment/downloadImage?id='+ attachmentId
                }

                list += '<div class="deviceList-li deviceList-list pb-10" outOrderId="'+ outOrderId+'" storageId="'+ storageId+'" ' +
                    ' shelfId="'+ shelfId+'" outDetailName="'+ stockdetailName+'" equipmentId="'+ equipmentId+'" outDetailCode="'+ outDetailCode+'"' +
                    ' outDetailModel="'+ stockdetailModel +'" outDetailParam="'+ outDetailParam+'" outDetailUnit="'+ outDetailUnit+'" ' +
                    ' baseAssetCode="'+ baseAssetCode+'" companyAssetCode="'+ companyAssetCode+'"  sourceId="'+ sourceId+'" outDetailRemark="'+ stockdetailRemark+'" ' +
                    'stockDetailId ="'+ stockDetailId+'" price="'+price+'">' +
                    '<div class="deviceList-li-top">' +
                    '<div class="li-top-si f-l grade">'+ objsbing +'</div>' +
                    '<div class="f-l lineHeight pr-20"><img class="ml-5 mr-5" src="'+atachm + '">设备分类：<sapn class="colors">' + deviceListCode + '</sapn></div>' +
                    '<div class="f-l lineHeight pr-20">设备名称：<sapn class="colors stockdetailName">' + stockdetailName + '</sapn></div>' +
                    '<div class="f-l lineHeight pr-20">型号：<sapn class="colors">'+ stockdetailModel + '</sapn></div>' +
                    '<div class="f-r lineHeight">' +
                    '<a style="text-decoration:none" class="ml-5 edit" href="javascript:;" title="编辑"><i class="Hui-iconfont">&#xe70c;</i></a>' +
                    '<a style="text-decoration:none" class="ml-5 mr-10 del" href="javascript:;" title="删除"><i class="Hui-iconfont">&#xe6e2;</i></a>' +
                    '</div>' +
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
                    '<div class="f-l text-c equipmentNumber-div-main" number="'+stockdetailNum +'">' + stockdetailNum + '</div>' +
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
                    '<div class="outDetailRemark">' + stockdetailRemark + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'

                $(".deviceList").prepend(list);
            }
            var thisText =$(".deviceList").find(".grade").length;
            objsbing= 0;
            $(this).parents(".deviceList-li").remove();
            for(var i = 0; i < thisText; i++){
                $(".deviceList-li").eq(i).find(".grade").text(i+1);
            }
        }

        /*
         * 弹出框按钮点击事件
         * */
        $(".bombBox-bot").on("click", function ()
        {
            var data = "",
                bot1 = $(".tbodys"),
                attr1 = [],
                detailedList = bot1.find("th"),
                detail = "";

            bot1.find("input:checkbox:checked").each(function ()
            {
                var contArr = {};
                contArr['outOrderId'] = $(this).parent().parent("tr").attr("outOrderId");               //出库单id
                contArr['storageId'] = $(this).parent().parent("tr").attr("storageId");                 //库房id
                contArr['shelfId'] = $(this).parent().parent("tr").attr("shelfId");                      //货架id
                contArr['stockdetailName'] = $(this).parent().parent("tr").attr("stockdetailName");        //设备名称
                contArr['equipmentId'] = $(this).parent().parent("tr").attr("equipmentId");             //设备定义id
                contArr['outDetailCode'] = $(this).parent().parent("tr").attr("outDetailCode");        //设备编号
                contArr['outDetailModel'] = $(this).parent().parent("tr").attr("outDetailModel");      //规格型号
                contArr['outDetailParam'] = $(this).parent().parent("tr").attr("outDetailParam");      //关键参数
                contArr['stockdetailUnit'] = $(this).parent().parent("tr").attr("outDetailUnit");        //单位
                contArr['outDetailNum'] = $(this).parent().parent("tr").attr("outDetailNum");          //数量
                contArr['baseAssetCode'] = $(this).parent().parent("tr").attr("baseAssetCode");        //基地资产编号
                contArr['companyAssetCode'] = $(this).parent().parent("tr").attr("companyAssetCode"); //公司资产编号
                contArr['sourceId'] = $(this).parent().parent("tr").attr("sourceId");                    //工单id/关联出库来源id
                contArr['outDetailRemark'] = $(this).parent().parent("tr").attr("outDetailRemark");   //备注
                contArr['attachmentId'] = $(this).parent().parent("tr").attr("attachmentId");   //设备图片
                //contArr['stockdetailName'] = $(this).parent().parent("tr").attr("stockdetailName");   //设备名称
                contArr['stockdetailModel'] = $(this).parent().parent("tr").attr("stockdetailModel");   //型号
                contArr['stockdetailCode'] = $(this).parent().parent("tr").attr("stockdetailCode");   //设备编号
                contArr['shelfName'] = $(this).parent().parent("tr").attr("shelfName");   //货架位置
                contArr['stockdetailNum'] = $(this).parent().parent("tr").attr("stockdetailNum");   //数量
                contArr['stockdetailRemark'] = $(this).parent().parent("tr").attr("stockdetailRemark");   //说明
                contArr['id'] = $(this).parent().parent("tr").attr("stockDetailId");   //单条数据id
                contArr['deviceListCode']= $(this).parent().parent("tr").attr("deviceListCode"); //设备分类
                contArr['price']= $(this).parent().parent("tr").attr("price"); //设备分类
                detail = JSON.stringify(contArr);
                attr1.push(detail);
            });

            data = "["+attr1.join(",")+"]";
            $(".bombBox").css("display", "none");
            deviceListList($.parseJSON(data))
        });

        //设备清单编辑
        $(".deviceList").on("click",".edit", function(){
            $(this).parents(".deviceList-li").find(".equipmentNumber-div-left").css("display", "block");
            $(this).parents(".deviceList-li").find(".equipmentNumber-div-right").css("display", "block");
            $(this).parents(".deviceList-li").find(".equipmentNumber-div-main").attr("contenteditable",true);
            $(this).parents(".deviceList-li").find(".outDetailRemark").attr("contenteditable",true);
            $(this).parents(".deviceList-li").find(".edit").addClass("submit");
            $(this).parents(".deviceList-li").find(".edit").attr("title","确定");
            $(this).parents(".deviceList-li").find(".edit").html('<i class="Hui-iconfont">&#xe676;</i>');
        });

        //设备清单提交
        $(".deviceList").on("click",".submit", function(){
            var num = $(this).parents(".deviceList-li").find(".equipmentNumber-div-main").attr("number");
            var mainSize = $(this).parents(".deviceList-li").find(".equipmentNumber-div-main").text();
            if(parseInt(mainSize) > parseInt(num)){
                layer.confirm('所填数据不能大于设备最大值，最大值为'+num, {
                    btn: ['确定'],
                    shade: 0.1
                });
            }else {
                $(this).parents(".deviceList-li").find(".equipmentNumber-div-left").css("display", "none");
                $(this).parents(".deviceList-li").find(".equipmentNumber-div-right").css("display", "none");
                $(this).parents(".deviceList-li").find(".equipmentNumber-div-main").attr("contenteditable", false);
                $(this).parents(".deviceList-li").find(".outDetailRemark").attr("contenteditable",false);
                $(this).parents(".deviceList-li").find(".edit").removeClass("submit");
                $(this).parents(".deviceList-li").find(".edit").attr("title", "编辑");
                $(this).parents(".deviceList-li").find(".edit").html('<i class="Hui-iconfont">&#xe70c;</i>');
            }
        });

        //设备清单数量加法
        $("#parentDiv").on("click",".equipmentNumber-div-right",function(){
            var mainSize = parseInt($(this).parents(".deviceList-li").find(".equipmentNumber-div-main").text());
            var num = parseInt($(this).parents(".deviceList-li").find(".equipmentNumber-div-main").attr("number"));
            if(mainSize >= num){
                mainSize = num;
            }else{
                mainSize = parseInt(mainSize) + 1;
                $(this).parents(".deviceList-li").find(".equipmentNumber-div-main").text(mainSize);
            }

        });
        //设备清单数量减法
        $("#parentDiv").on("click", ".equipmentNumber-div-left",function(){
            var mainSize = parseInt($(this).parents(".deviceList-li").find(".equipmentNumber-div-main").text());
            if(mainSize <= 1) {
                mainSize = 1;
            } else {
                mainSize = parseInt(mainSize) - 1;
                $(this).parents(".deviceList-li").find(".equipmentNumber-div-main").text(mainSize);
            }

        });
        //设备清单删除
        $("#parentDiv").find(".deviceList").on("click",".del", function(){
            var thisText =$(".deviceList").find(".grade").length;
                objsbing= 0;
                $(this).parents(".deviceList-li").remove();
             for(var i = 0; i < thisText; i++){
                 $(".deviceList-li").eq(i).find(".grade").text(i+1);
             }
        });

        /*
         单条添加快递单
         */
        $("#parentDiv").find(".addBtn").find("a").on("click",function(){
            var _this = $(this),
                ids = libId;
            if($(this).text()==""){
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
            }else {
                $.myAjax({
                    type: "POST",
                    url: window.ajaxUrl + "operation/logistics/create",
                    data: {
                        outBoundId: ids,
                        logisticsClassify: _this.parents("tr").find(".widthChange").eq(0).text(),
                        logisticsCode: _this.parents("tr").find(".widthChange").eq(1).text()
                    },
                    success: function (data) {
                        if (data && data.success === 0) {
                            $(".expre").find(".tableCenter").remove();
                            $(".firstTr").find(".widthChange").text("");
                            tableBok();
                        }
                    }
                });
            }
        });
        /*
        单条编辑快递单
        */
        $("#parentDiv").find(".addTable").on("click",".edit", function(){
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
                    var _this = $(this),
                        ids = _this.parents("tr").attr("id");

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "operation/logistics/update",
                        data: {
                            id: ids,
                            logisticsClassify : _this.parents("tr").find(".widthChange").eq(0).text(),
                            logisticsCode : _this.parents("tr").find(".widthChange").eq(1).text()
                        },
                        success: function (data) {
                            if (data && data.success === 0) {
                                _this.html('<i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i>');
                                _this.parents("tr").find("div").removeAttr("contenteditable", false);
                                $(".expre").find(".tableCenter").remove();
                                tableBok();
                                flagSave = false;
                            }
                        }
                    });
                }
            }
        });

        /*
        单条删除快递单
        */
        $("#parentDiv").find(".addTable").on("click",".del", function(){
            var _this = $(this),
                outBoundId = libId,
                ids = _this.parents("tr").attr("id");
            layer.confirm("确定要删除吗？", {
                    shade: 0.1,
                    btn: ['确定'] //按钮
                },
                function() {
                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "operation/logistics/delete",
                        data: {
                            outBoundId:outBoundId,
                            id: ids
                        },
                        success: function (data) {
                            if (data && data.success === 0) {
                                $(".expre").find(".tableCenter").remove();
                                tableBok();
                            }
                        }
                    })
                },
                function() {

                });
            ;
        });

        /**********************************回显编辑已出库设备开始***********************************************/
        //tab切换
        //tab切换
        $.Huitab(".tabBar span",".tabCon","current","click",0);

        //显示没有数据
        $(".equipment-details .no-data").eq(0).show();

        $(".equipment-details").find(".history").on("click",function(){
            objsbings=0;
            sendData={
                pageSize: pageSize,
                pageNo: pageNo,
                outOrderId: $(".storageNames").attr("gdId"),      //id
                sourceId: $(".outOrderNames").attr("sourceId")   //sourceId
            }
            findPagelistS(sendData);
            findIds();
        })
        function findPagelistS(sendData) {
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
                        equipmentListS(_data);

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
                                        outOrderId: $(".storageNames").attr("gdId"),      //id
                                        sourceId: $(".outOrderNames").attr("sourceId")   //sourceId
                                    };

                                    $.myAjax({
                                        type: "POST",
                                        url: window.ajaxUrl + "operation/outorderdetall/findPage",
                                        data: sendData,
                                        success: function (data) {
                                            if (data && data.success === 0) {
                                                var _data = data.data.result;
                                                equipmentListS(_data);
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
        //tableBok();
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
                outOrderId: $(".storageNames").attr("gdId"),
                sourceId: $(".outOrderNames").attr("sourceId")
            };
            findPagelistS (sendData);
            return false;
        });

        //选择每页显示多少条事件

        function equipmentListS(data){
            var pmentlist = data;
            if(pmentlist != null && pmentlist !=""){
                $(".equipment-details .no-data").hide();
                deviceListListS(pmentlist);
            }else{
                $(".list-history").html("");
                $(".list-history .no-data").css("display","block");
            }
        }
        //循环设备清单
        function deviceListListS(data){
            var list ="",
                pmentlist = data;
            objsbings=0;
            $(".list-history").html("");
            for (var x = 0; x < pmentlist.length; x++) {
                objsbings++;
                var outDetailNum = ((pmentlist[x].outDetailNum == null || "" || undefined) ? "" : pmentlist[x].outDetailNum);                //数量       、、、
                var attachmentId =  ((pmentlist[x].attachmentId == "" || null || undefined) ? "" : pmentlist[x].attachmentId);                          //设备图片
                var deviceListCode = ((pmentlist[x].equipmentName == null || "" || undefined) ? "" : pmentlist[x].equipmentName);                  //设备分类   、、、
                var stockdetailName = ((pmentlist[x].outDetailName == null || "" || undefined) ? "" : pmentlist[x].outDetailName);          //设备名称          、、、
                var stockdetailModel = ((pmentlist[x].outDetailModel == null || "" || undefined) ? "" : pmentlist[x].outDetailModel);            //型号       、、、
                var stockdetailCode = ((pmentlist[x].outDetailCode == null || "" || undefined) ? "" : pmentlist[x].outDetailCode);          //设备编号         、、、
                var baseAssetCode = ((pmentlist[x].baseAssetCode == null || "" || undefined) ? "---" : pmentlist[x].baseAssetCode);                 //资产编号
                var shelfName = ((pmentlist[x].shelfName == null || "" || undefined) ? "" : pmentlist[x].shelfName);                              //货架位置
                var stockdetailRemark = ((pmentlist[x].outDetailRemark == null || "" || undefined) ? "" : pmentlist[x].outDetailRemark);         //说明备注     、、、
                list = "";
                var atachms = "";
                if(pmentlist[x].attachmentId == "" || pmentlist[x].attachmentId == null){
                    atachms = "../../images/temporary/equ_logo.png";
                }else{
                    atachms = window.ajaxUrl+'project/attachment/downloadImage?id='+ attachmentId
                }

                list += '<div class="deviceList-li pb-10" pid="'+pmentlist[x].id+'" stockDetailId="'+pmentlist[x].stockDetailId+'">' +
                    '<div class="deviceList-li-top">' +
                    '<div class="li-top-si f-l grade">'+ objsbings +'</div>' +
                    '<div class="f-l lineHeight pr-20"><img class="ml-5 mr-5" src="'+atachms + '">设备分类：<sapn class="colors deviceListCode">' + deviceListCode + '</sapn></div>' +
                    '<div class="f-l lineHeight pr-20">设备名称：<sapn class="colors stockdetailName">' + stockdetailName + '</sapn></div>' +
                    '<div class="f-l lineHeight pr-20">型号：<sapn class="colors stockdetailModel">'+ stockdetailModel + '</sapn></div>' +
                    '<div class="f-r lineHeight">' +
                    '<a style="text-decoration:none" class="ml-5 edit" href="javascript:;" title="编辑"><i class="Hui-iconfont">&#xe70c;</i></a>' +
                    '<a style="text-decoration:none" class="ml-5 mr-10 del" href="javascript:;" title="删除"><i class="Hui-iconfont">&#xe6e2;</i></a>' +
                    '</div>' +
                    '</div>' +
                    '<div class="deviceList-li-bot">' +
                    '<div class="f-l equipmentNumber">' +
                    '<div class="equipmentNumber-div text-c stockdetailCode sbbh">' + stockdetailCode + '</div> ' +
                    '<p class="equipmentNumber-p">设备编号</p>' +
                    '</div>' +
                    '<div class="f-l assetNumber">' +
                    '<div class="equipmentNumber-div text-c zcbh">' + baseAssetCode + '</div>' +
                    '<p class="equipmentNumber-p">资产编号</p>' +
                    '</div>' +
                    '<div class="f-l shelfPosition">' +
                    '<div class="equipmentNumber-div text-c hjwz">' + shelfName + '</div>' +
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
                    '<div class="f-l text-c equipmentNumber-div-main shul">' + outDetailNum + '</div>' +
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
                    '<div class="outDetailRemark" contenteditable="true beiz">' + stockdetailRemark + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'

                $(".list-history").append(list);
            }
        }
//设备清单编辑
        $(".list-history").on("click",".edit", function(){
            $(this).parents(".deviceList-li").find(".stockdetailCode").attr("contenteditable",true);
            $(this).parents(".deviceList-li").find(".stockdetailCode").css("border","1px solid #dcdcdc");
            $(this).parents(".deviceList-li").find(".edit").addClass("submit");
            $(this).parents(".deviceList-li").find(".edit").attr("title","确定");
            $(this).parents(".deviceList-li").find(".edit").html('<i class="Hui-iconfont">&#xe676;</i>');
        });

        //设备清单提交
        $(".list-history").on("click",".submit", function(){
            var num = $(this).parents(".deviceList-li").find(".equipmentNumber-div-main").attr("number");
            var mainSize = $(this).parents(".deviceList-li").find(".equipmentNumber-div-main").text();
            if(parseInt(mainSize) > parseInt(num)){
                layer.confirm('所填数据不能大于设备最大值，最大值为'+num, {
                    btn: ['确定'],
                    shade: 0.1
                });
            }else {
                $(this).parents(".deviceList-li").find(".stockdetailCode").attr("contenteditable", false);
                $(this).parents(".deviceList-li").find(".stockdetailCode").css("border","none");
                $(this).parents(".deviceList-li").find(".edit").removeClass("submit");
                $(this).parents(".deviceList-li").find(".edit").attr("title", "编辑");
                $(this).parents(".deviceList-li").find(".edit").html('<i class="Hui-iconfont">&#xe70c;</i>');
            }

            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "operation/outorderdetall/update",
                data: {
                    id:$(this).parents(".deviceList-li").attr("pid"),
                    outDetailCode : $(this).parents(".deviceList-li").find(".sbbh").text(),
                    stockDetailId:$(this).parents(".deviceList-li").attr("stockDetailId")
                },
                dataType: "json",
                success: function (msg) {
                    if(msg && msg.success === 0) {
                        sendData={
                            pageSize: pageSize,
                            pageNo: pageNo,
                            outOrderId: $(".storageNames").attr("gdId"),      //id
                            sourceId: $(".outOrderNames").attr("sourceId")   //sourceId
                        }
                        //findPagelistS(sendData);
                    }
                }
            });
        });

        //设备清单删除
        $("#parentDiv").find(".list-history").on("click",".del", function(){
            objsbings= 0;

            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "operation/outorderdetall/deleteById",
                data: {
                    id:$(this).parents(".deviceList-li").attr("pid")
                },
                dataType: "json",
                success: function (msg) {
                    if(msg && msg.success === 0) {
                        sendData={
                            pageSize: pageSize,
                            pageNo: pageNo,
                            outOrderId: $(".storageNames").attr("gdId"),      //id
                            sourceId: $(".outOrderNames").attr("sourceId")   //sourceId
                        }
                        findPagelistS(sendData);
                        findIds();
                    }
                }
            });
        });

        /********************************回显编辑已出库设备结束*************************************************/
        /*$("#parentDiv").Validform({
            btnSubmit: ".upload-lib",
            tiptype:2,
            datatype:{
                "floatnum":function(gets,obj,curform,regxp)
                {
                    var reg = /^\d{1,13}((\.\d{1,2})?)$/;
                    if(reg.test(obj.val()))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            },
            beforeSubmit:function(curform){
                /!*
                 * 提交跟踪反馈信息
                 *!/
                if (onlyCode === false)
                {
                    $("[con_name=workOrderNum]").parent().siblings().find("span").addClass("Validform_wrong").removeClass("Validform_right");
                    layer.confirm('合同编号已存在', {
                        btn: ['确定'],
                        shade: 0.1
                    });
                    return false;
                }

                if($(".Validform_wrong").length>0)
                {
                    return;
                }
                else
                {
                    var sendData = {},
                        bot1 = $(".deviceList"),
                        attr1 = [],
                        detailedList = bot1.find("th"),
                        detail = "";

                    bot1.find(".deviceList-li").each(function(i,o)
                    {
                        var contArr = {};
                        contArr['outOrderId'] = $(this).attr("outOrderId");               //出库单id
                        contArr['storageId'] = $(this).attr("storageId");                 //库房id
                        contArr['shelfId'] = $(this).attr("shelfId");                      //货架id
                        contArr['outDetailName'] = $(this).attr("outDetailName");        //设备名称
                        contArr['equipmentId'] = $(this).attr("equipmentId");             //设备定义id
                        contArr['outDetailCode'] = $(this).attr("outDetailCode");        //设备编号
                        contArr['outDetailModel'] = $(this).attr("outDetailModel");      //规格型号
                        contArr['outDetailParam'] = $(this).attr("outDetailParam");      //关键参数
                        contArr['outDetailUnit'] = $(this).attr("outDetailUnit");        //单位
                        contArr['outDetailNum'] = $(this).find(".equipmentNumber-div-main").text();          //数量
                        contArr['baseAssetCode'] = $(this).attr("baseAssetCode");        //基地资产编号
                        contArr['companyAssetCode'] = $(this).attr("companyAssetCode"); //公司资产编号
                        contArr['sourceId'] = $(".storageNames").attr("sourceId");                    //工单id/关联出库来源id
                        contArr['outDetailRemark'] = $(this).find(".outDetailRemark").text();   //备注
                        contArr['stockDetailId'] = $(this).attr("stockDetailId");   //单条数据id
                        detail = JSON.stringify(contArr);
                        attr1.push(detail);
                    });

                    var loading = "";
                    sendData.outDetailOrder = "["+attr1.join(",")+"]";      //设备清单
                    loading = layer.msg('请稍后', {
                        time: 0,
                        icon: 16,
                        shade: 0.1
                    });

                    $.myAjax({
                        type: "POST",
                        url: window.ajaxUrl + "operation/outorderdetall/create",
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

            },
            callback:function(form){
                return false;
            }
        });*/

        $("#parentDiv").find(".upload-lib").on("click",function(){
            var sendData = {},
                bot1 = $(".deviceList"),
                attr1 = [],
                detailedList = bot1.find("th"),
                detail = "";

            bot1.find(".deviceList-li").each(function(i,o)
            {
                var contArr = {};
                contArr['outOrderId'] = $(this).attr("outOrderId");               //出库单id
                contArr['storageId'] = $(this).attr("storageId");                 //库房id
                contArr['shelfId'] = $(this).attr("shelfId");                      //货架id
                contArr['outDetailName'] = $(this).attr("outDetailName");        //设备名称
                contArr['equipmentId'] = $(this).attr("equipmentId");             //设备定义id
                contArr['outDetailCode'] = $(this).attr("outDetailCode");        //设备编号
                contArr['outDetailModel'] = $(this).attr("outDetailModel");      //规格型号
                contArr['outDetailParam'] = $(this).attr("outDetailParam");      //关键参数
                contArr['outDetailUnit'] = $(this).attr("outDetailUnit");        //单位
                contArr['outDetailNum'] = $(this).find(".equipmentNumber-div-main").text();          //数量
                contArr['baseAssetCode'] = $(this).attr("baseAssetCode");        //基地资产编号
                contArr['companyAssetCode'] = $(this).attr("companyAssetCode"); //公司资产编号
                contArr['sourceId'] = $(".storageNames").attr("sourceId");                    //工单id/关联出库来源id
                contArr['outDetailRemark'] = $(this).find(".outDetailRemark").text();   //备注
                contArr['stockDetailId'] = $(this).attr("stockDetailId");   //单条数据id
                contArr['price'] = $(this).attr("price");   //单价
                detail = JSON.stringify(contArr);
                attr1.push(detail);
            });

            var loading = "";
            sendData.outDetailOrder = "["+attr1.join(",")+"]";      //设备清单
            loading = layer.msg('请稍后', {
                time: 0,
                icon: 16,
                shade: 0.1
            });

            $.myAjax({
                type: "POST",
                url: window.ajaxUrl + "operation/outorderdetall/create",
                data: sendData,
                dataType: "json",
                success: function(msg)
                {
                    if (msg && msg.success === 0)
                    {
                        arrts = [];
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
        });

    });
}(jQuery, window, document));

