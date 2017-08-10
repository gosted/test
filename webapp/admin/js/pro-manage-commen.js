/**
 * 本文件是合作伙伴公共js文件
 * @author 彭佳明
 */

//2级联动树
/*window.Tree = function (obj)
{
    /!*
     * treeOnClick树形菜单点击回调函数
     *
     * *!/
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
    /!*
     * treeInit初始化树形菜单方法
     *
     * *!/
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

    $(ele).off("click").on("click", ".input-text", function (e)
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
};*/
/*window.Tree({
 ele: ".country-tree",
 url: ajaxUrl + "data/storage/findByParentId.json",
 type: "POST",
 data: {id: 0},
 id: "id",
 value: "areaNameStr",
 treeClick: function ()
 {
 var _this = $(this);
 id = _this.parents("li").eq(0).attr("treeId");
 window.Tree({
 ele:".province",
 url: ajaxUrl + "data/provider/findByParentId.json",
 type: "POST",
 data: {id: id},
 id: "id",
 value: "areaNameStr",
 treeClick: function ()
 {
 var _this = $(this),
 id = _this.parents("li").eq(0).attr("treeId");
 if (_this.hasClass("all"))
 {
 areaId = _this.parents("li").eq(0).attr("allId");
 }
 else
 {
 areaId = id;
 }
 }
 });
 if (_this.hasClass("all"))
 {
 areaId = _this.parents("li").eq(0).attr("allId");
 }
 else
 {
 areaId = id;
 }
 }
 });*/
function addTable(obj1, obj2, obj3)
{
    var id = 0;
    obj3.on("click", function() {
        var len = obj1.find("th").size(),
            str = "", //添加input
            zStr = "", //添加一行
            flagAdd = false, //添加
            flagSave = true,
            flag = false, //储存属性对应的value值
            val = "";
        var that = $(this);
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
                        '<a href="javascript:;" class="del"><i class="Hui-iconfont" title="删除">&#xe609;</i></a></td>';
                } else {
                    val = obj2.find(".change").eq(i).text();

                    str += '<td><div contenteditable="false" style="z-index:1000;background:#ddd" class="change  widthChange" title="'+val+'">'+val+'</div></td>';
                }
                flagAdd = true;
            };

        }
        zStr = '<tr id="' + id + '" class="tableCenter">' + str + '</tr>';
        if(flagAdd) {
            obj2.before(zStr);
            $(".listTr").find(".change").each(function(i,o){
                $(this).attr("title","").text("").css({"z-index":1});
            });
            $(".tbody").find($(".widthChange")).each(function(i,o){
                var width = $(this).width();
                $(this).parent("td").css({position:"relative",width:width+"px"});
                $(this).addClass("text-change").css({"margin-left":-width/2+"px",height:"22px"});
            });
            flagAdd = false;
        }
        $(".firstTr").find("div").each(function(i,o){
            if($(this).hasClass("needChoose")){
                that.parent().parent("tr").prev("tr").find("td").eq(i).find("div").addClass("needChoose");
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
                valAdd = "";
            for(var i = 0; i < len; i++) {
                valAdd += _this.parents("tr").find(".needChoose").eq(i).text();
                if(valAdd) {
                    flag = true;
                } else { //有一个必选为空则提示
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
            if(flag){
                if(flagSave) {
                    $(this).html('<i class="Hui-iconfont" title="保存">&#xe632;</i>');

                    _this.parents("tr").find(".change").css({
                        "border": "1px solid #006BFF",
                        "background":"#fff",
                        "z-index":1000000
                    });
                    _this.parents("tr").find(".change").attr("contenteditable", "true");

                    flagSave = false;
                } else {
                    _this.html('<i class="Hui-iconfont changePos" title="编辑">&#xe70c;</i>');

                    _this.parents("tr").find(".change").css({
                        "border": "1px solid rgb(238,238,238)",
                        "background":"#ddd",
                        "z-index":10000
                    });
                    _this.parents("tr").find(".change").removeAttr("contenteditable", "true");
                    flagSave = true;
                }
            }
        });
    })

}

var uploadFile = $(".upload-file");
uploadFile.on("change",function ()
{
    var _this = this;

    fileUpload({
        ths: _this,
        msg: "正在上传请稍后",
        form: $("#upload"),
        fileList: $(".file-list"),
        createUrl: "general/attachmentPro/createFile",//增加地址
        infoUrl: "general/attachmentPro/createFileInfo",//返回信息地址
        delUrl: "general/attachmentPro/deleteFileById",//删除的地址
        sendData: {}
    });
});