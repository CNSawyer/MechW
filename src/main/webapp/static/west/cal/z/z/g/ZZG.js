$(document).ready(function () {

    let docx = $("#DOCX");
    let docxtext = $("#DOCXTEXT");

    let zzgSketch = $("#d2");
    let zzgModel = $("#d3");
    let zzgd2d3 = $('#d2d3');

    $("#cal").html("<table id='zzg'></table>");
    let pg = $("#zzg");

    let south = $("#south");
    let currentTabIndex = null;

    $.getJSON("/static/west/cal/z/z/g/ZZG.json", function (result) {

        let columns, rows;

        function zzg2d(h = "h") {

            zzgSketch.empty();

            let width = zzgSketch.width();
            let height = zzgSketch.height();

            let svg = d3.select("#d2").append("svg")
                .attr("width", width).attr("id", "ZZGSVG").attr("height", height);

            // X 轴比例尺
            let xScale = d3.scaleLinear().domain([0, width]).range([0, width]);

            // Y 轴比例尺
            let yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

            // 添加划类线
            let line = d3.line().x(function (d) {
                return xScale(d.x);
            }).y(function (d) {
                return yScale(d.y);
            });

            // 图形边距
            let padding = 100;

            // 直线
            function drawLine(startX, startY, endX, endY) {
                svg.append("path").attr("d", line([
                    {x: startX, y: startY},
                    {x: endX, y: endY}
                ])).classed("sketch", true);
            }

            // 中心线
            function drawCenterLine(startX, startY, endX, endY) {
                svg.append("path").attr("d", line([
                    {x: startX, y: startY},
                    {x: endX, y: endY}
                ])).attr("stroke-dasharray", "25,5,5,5").classed("sketch", true);
            }

            // 尺寸界线-上方垂直
            function extLineTopV(x, y) {
                svg.append("path").attr("d", line([
                    {x: x, y: y - 3},
                    {x: x, y: y - 40}
                ])).classed("sketch", true);
            }

            // 尺寸界线-下方垂直
            function extLineBottomV(x, y) {
                svg.append("path").attr("d", line([
                    {x: x, y: y + 40},
                    {x: x, y: y + 3}
                ])).classed("sketch", true);
            }

            // 尺寸界线-左侧水平
            function extLineLeftH(x, y) {
                svg.append("path").attr("d", line([
                    {x: x - 40, y: y},
                    {x: x - 3, y: y}
                ])).classed("sketch", true);
            }

            // 尺寸界线-右侧水平
            function extLineRightH(x, y) {
                svg.append("path").attr("d", line([
                    {x: x + 3, y: y},
                    {x: x + 40, y: y}
                ])).classed("sketch", true);
            }

            // 顶部水平标注
            function dimTopH(startX, startY, endX, endY, text, id) {

                extLineTopV(startX, startY);
                extLineTopV(endX, endY);
                svg.append("path").classed("arrow sketch", true)
                    .attr("d", line([
                        {x: startX, y: startY - 30},
                        {x: startX + 15, y: startY - 27},
                        {x: startX + 15, y: startY - 33},
                        {x: startX, y: startY - 30}
                    ]));
                svg.append("path").classed("arrow sketch", true)
                    .attr("d", line([
                        {x: endX, y: endY - 30},
                        {x: endX - 15, y: endY - 27},
                        {x: endX - 15, y: endY - 33},
                        {x: endX, y: endY - 30}
                    ]));
                svg.append("path").attr("d", line([
                    {x: startX, y: startY - 30},
                    {x: endX, y: endY - 30}
                ]))
                    .attr("id", id).classed("sketch", true);
                svg.append("g").append("text").attr("x", 0)
                    .attr("y", 0).attr("dy", -5).attr("text-anchor", "middle")
                    .append("textPath").attr("xlink:href", "#" + id)
                    .attr("startOffset", "50%").text(text);

            }

            // 底部水平标注
            function dimBottomH(startX, startY, endX, endY, text, id) {

                extLineBottomV(startX, startY);
                extLineBottomV(endX, endY);
                svg.append("path").classed("arrow sketch", true)
                    .attr("d", line([
                        {x: startX, y: startY + 30},
                        {x: startX + 15, y: startY + 27},
                        {x: startX + 15, y: startY + 33},
                        {x: startX, y: startY + 30}
                    ]));
                svg.append("path").classed("arrow sketch", true)
                    .attr("d", line([
                        {x: endX, y: endY + 30},
                        {x: endX - 15, y: endY + 27},
                        {x: endX - 15, y: endY + 33},
                        {x: endX, y: endY + 30}
                    ]));
                svg.append("path").attr("d", line([
                    {x: startX, y: startY + 30},
                    {x: endX, y: endY + 30}
                ])).attr("id", id).classed("sketch", true);
                svg.append("g")
                    .append("text").attr("x", 0).attr("y", 0).attr("dy", -5).attr("text-anchor", "middle")
                    .append("textPath").attr("xlink:href", "#" + id).attr("startOffset", "50%")
                    .text(text);
            }

            // 左侧垂直标注
            function dimLeftV(startX, startY, endX, endY, text, id) {

                extLineLeftH(startX, startY);
                extLineLeftH(endX, endY);

                svg.append("path").classed("arrow sketch", true)
                    .attr("d", line([
                        {x: startX - 30, y: startY},
                        {x: startX - 27, y: startY - 15},
                        {x: startX - 33, y: startY - 15},
                        {x: startX - 30, y: startY}
                    ]));

                svg.append("path").classed("arrow sketch", true)
                    .attr("d", line([
                        {x: endX - 30, y: endY},
                        {x: endX - 27, y: endY + 15},
                        {x: endX - 33, y: endY + 15},
                        {x: endX - 30, y: endY}
                    ]));

                svg.append("path").attr("d", line([
                    {x: startX - 30, y: startY},
                    {x: endX - 30, y: endY}
                ])).attr("id", id).classed("sketch", true);

                let g2 = svg.append("g");
                let text2 = g2.append("text").attr("x", 0).attr("y", 0).attr("dy", -5).attr("text-anchor", "middle");
                text2.append("textPath").attr("xlink:href", "#" + id).attr("startOffset", "50%").text(text);

            }

            // 右侧侧垂直标注
            function dimRightV(startX, startY, endX, endY, text, id) {

                extLineRightH(startX, startY);
                extLineRightH(endX, endY);

                svg.append("path").classed("arrow sketch", true)
                    .attr("d", line([
                        {x: startX + 30, y: startY},
                        {x: startX + 27, y: startY - 15},
                        {x: startX + 33, y: startY - 15},
                        {x: startX + 30, y: startY}
                    ]));

                svg.append("path").classed("arrow sketch", true)
                    .attr("d", line([
                        {x: endX + 30, y: endY},
                        {x: endX + 27, y: endY + 15},
                        {x: endX + 33, y: endY + 15},
                        {x: endX + 30, y: endY}
                    ]));

                svg.append("path").attr("d", line([
                    {x: startX + 30, y: startY},
                    {x: endX + 30, y: endY}
                ])).attr("id", id).classed("sketch", true);

                svg.append("g").append("text").attr("x", 0).attr("y", 0).attr("dy", -5).attr("text-anchor", "middle")
                    .append("textPath").attr("xlink:href", "#" + id)
                    .attr("startOffset", "50%").text(text);

            }

            // 画圆弧/椭圆弧
            function drawArc(radiusX, radiusY, startX, startY, endX, endY) {
                svg.append("path").attr("d", "M "
                    + startX + " " + startY + " "
                    + "A" + radiusX + " " + radiusY + " "
                    + "1 0 1" + " "
                    + endX + " " + endY
                ).classed("sketch", true);
            }

            let wg = (width - 2 * padding) / 4;
            let hg = (height - 2 * padding) / 4;

            // sketch
            svg.append("path").attr("d", line([
                {x: padding + wg, y: padding},
                {x: padding + wg, y: height - padding},
                {x: width - padding - wg, y: height - padding},
                {x: width - padding - wg, y: padding}
            ])).classed("sketch", true);
            dimLeftV(padding + wg, height - padding, padding + wg, padding, h, "ZZGSketchH");

            // 三角压力表示
            svg.append("path").attr("d", line([
                {x: padding + 3 * wg, y: padding + 0.5 * hg},
                {x: padding + 3 * wg - 15, y: padding + 0.5 * hg + 3},
                {x: padding + 3 * wg - 15, y: padding + 0.5 * hg - 3},
                {x: padding + 3 * wg, y: padding + 0.5 * hg}
            ])).classed("arrow sketch", true);
            svg.append("path").attr("d", line([
                {x: padding + 3 * wg, y: padding + hg},
                {x: padding + 3 * wg - 15, y: padding + hg + 3},
                {x: padding + 3 * wg - 15, y: padding + hg - 3},
                {x: padding + 3 * wg, y: padding + hg}
            ])).classed("arrow sketch", true);
            svg.append("path").attr("d", line([
                {x: padding + 3 * wg, y: padding + 1.5 * hg},
                {x: padding + 3 * wg - 15, y: padding + 1.5 * hg + 3},
                {x: padding + 3 * wg - 15, y: padding + 1.5 * hg - 3},
                {x: padding + 3 * wg, y: padding + 1.5 * hg}
            ])).classed("arrow sketch", true);
            svg.append("path").attr("d", line([
                {x: padding + 3 * wg, y: padding + 2 * hg},
                {x: padding + 3 * wg - 15, y: padding + 2 * hg + 3},
                {x: padding + 3 * wg - 15, y: padding + 2 * hg - 3},
                {x: padding + 3 * wg, y: padding + 2 * hg}
            ])).classed("arrow sketch", true);
            svg.append("path").attr("d", line([
                {x: padding + 3 * wg, y: padding + 2.5 * hg},
                {x: padding + 3 * wg - 15, y: padding + 2.5 * hg + 3},
                {x: padding + 3 * wg - 15, y: padding + 2.5 * hg - 3},
                {x: padding + 3 * wg, y: padding + 2.5 * hg}
            ])).classed("arrow sketch", true);
            svg.append("path").attr("d", line([
                {x: padding + 3 * wg, y: padding + 3 * hg},
                {x: padding + 3 * wg - 15, y: padding + 3 * hg + 3},
                {x: padding + 3 * wg - 15, y: padding + 3 * hg - 3},
                {x: padding + 3 * wg, y: padding + 3 * hg}
            ])).classed("arrow sketch", true);
            svg.append("path").attr("d", line([
                {x: padding + 3 * wg, y: padding + 3.5 * hg},
                {x: padding + 3 * wg - 15, y: padding + 3.5 * hg + 3},
                {x: padding + 3 * wg - 15, y: padding + 3.5 * hg - 3},
                {x: padding + 3 * wg, y: padding + 3.5 * hg}
            ])).classed("arrow sketch", true);

            drawLine(padding + 3 * wg - 15 - 10, padding + 0.5 * hg, padding + 3 * wg - 15, padding + 0.5 * hg);
            drawLine(padding + 3 * wg - 15 - 2 * 10, padding + hg, padding + 3 * wg - 15, padding + hg);
            drawLine(padding + 3 * wg - 15 - 3 * 10, padding + 1.5 * hg, padding + 3 * wg - 15, padding + 1.5 * hg);
            drawLine(padding + 3 * wg - 15 - 4 * 10, padding + 2 * hg, padding + 3 * wg - 15, padding + 2 * hg);
            drawLine(padding + 3 * wg - 15 - 5 * 10, padding + 2.5 * hg, padding + 3 * wg - 15, padding + 2.5 * hg);
            drawLine(padding + 3 * wg - 15 - 6 * 10, padding + 3 * hg, padding + 3 * wg - 15, padding + 3 * hg);
            drawLine(padding + 3 * wg - 15 - 7 * 10, padding + 3.5 * hg, padding + 3 * wg - 15, padding + 3.5 * hg);
        }

        currentTabIndex = zzgd2d3.tabs('getTabIndex', zzgd2d3.tabs('getSelected'));

        // init Sketch
        if (currentTabIndex === 0) {
            zzg2d();
            $("#d2").off("resize").on("resize", function () {
                if ($("#zzg").length > 0) {
                    zzg2d();
                }
            });
        }
        zzgd2d3.tabs({
            onSelect: function (title, index) {
                if (index === 0) {
                    zzg2d();
                    $("#d2").off("resize").on("resize", function () {
                        if ($("#zzg").length > 0) {
                            zzg2d();
                        }
                    });
                }
            }
        });

        let lastIndex;
        pg.propertygrid({
            title: "介质静压力计算",
            data: result,
            showHeader: false,
            showGroup: true,
            scrollbarSize: 0,
            autoRowHeight: true,
            columns: [[
                {
                    field: "name",
                    title: "名称",
                    width: 170,
                    resizable: true,
                    sortable: false,
                    align: "left"
                },
                {
                    field: 'value',
                    title: '值',
                    width: 153,
                    resizable: false,
                    sortable: false,
                    align: "center",
                    styler: function () {
                        return "color:#222222;";
                    }
                }
            ]],
            onClickRow: function (index) {
                if (index !== lastIndex) {
                    pg.datagrid('endEdit', lastIndex);
                }
                pg.propertygrid('beginEdit', index);
                lastIndex = index;
            },
            onBeginEdit: function (index) {

                let dg = $(this);
                let ed = dg.propertygrid('getEditors', index)[0];
                if (!ed) {
                    return;
                }
                let t = $(ed.target);
                if (t.hasClass('combobox-f')) {
                    t.combobox('textbox').bind('focus', function () {
                        t.combobox('showPanel');
                    }).focus();
                    t.combobox({
                        onChange: function () {
                            window.setTimeout(function () {
                                dg.propertygrid('endEdit', index)
                            }, 50);
                        }
                    });
                }
                else {
                    t.textbox('textbox').bind('keydown', function (e) {
                        if (e.keyCode === 13) {
                            dg.propertygrid('endEdit', index);
                        }
                        else if (e.keyCode === 27) {
                            dg.propertygrid('cancelEdit', index);
                        }
                    }).focus();
                }
            },
            onEndEdit: function (index, row, changes) {
                if ((!jQuery.isEmptyObject(changes)) && (!jQuery.isEmptyObject(changes.value))) {

                    // docx button
                    docx.addClass("l-btn-disabled").off("click").attr("href", null);
                    docxtext.html("下载计算书");

                    // sketch & model
                    zzgSketch.empty();
                    zzgModel.empty();

                    // sketch
                    currentTabIndex = zzgd2d3.tabs('getTabIndex', zzgd2d3.tabs('getSelected'));

                    // 初始化 Sketch
                    if (currentTabIndex === 0) {
                        zzg2d();
                        zzgSketch.off("resize").on("resize", function () {
                            if ($("#zzg").length > 0) {
                                zzg2d();
                            }
                        });
                    }
                    zzgd2d3.tabs({
                        onSelect: function (title, index) {
                            if (index === 0) {
                                zzg2d();
                                zzgSketch.off("resize").on("resize", function () {
                                    if ($("#zzg").length > 0) {
                                        zzg2d();
                                    }
                                });
                            }
                        }
                    });

                    // alert
                    south.empty();

                    columns = pg.propertygrid("options").columns;
                    rows = pg.propertygrid("getRows");

                    // 介质密度
                    if (!jQuery.isEmptyObject(rows[0][columns[0][1].field])) {
                        let ZZGD = parseFloat(rows[0][columns[0][1].field]);

                        // h
                        if (!jQuery.isEmptyObject(rows[1][columns[0][1].field])) {
                            let ZZGH = parseFloat(rows[1][columns[0][1].field]);

                            // Sketch
                            if (currentTabIndex === 0) {
                                zzg2d(ZZGH);
                                zzgSketch.off("resize").on("resize", function () {
                                    if ($("#zzg").length > 0) {
                                        zzg2d(ZZGH);
                                    }
                                });
                            }
                            zzgd2d3.tabs({
                                onSelect: function (title, index) {
                                    if (index === 0) {
                                        zzg2d(ZZGH);
                                        zzgSketch.off("resize").on("resize", function () {
                                            if ($("#zzg").length > 0) {
                                                zzg2d(ZZGH);
                                            }
                                        });
                                    }
                                }
                            });

                            let ZZGG = 9.8;

                            let ZZGPS = ZZGD * ZZGG * ZZGH / 1000000000;
                            south.html(
                                "<span style='color:#444444;'>" +
                                "介质静压力：" + ZZGPS.toFixed(4) + " MPa" +
                                "</span>");

                            // pd
                            if (!jQuery.isEmptyObject(rows[2][columns[0][1].field])) {
                                let ZZGPD = parseFloat(rows[2][columns[0][1].field]);

                                let ZZGPSPD = ZZGPS / ZZGPD * 100;
                                south.append(
                                    "<span style='color:#444444;'>" +
                                    "&ensp;|&ensp;" +
                                    "静压力占比：" + ZZGPSPD.toFixed(2) + "%" +
                                    "</span>");

                                let ZZGISCAL;
                                if (ZZGPSPD >= 5) {
                                    ZZGISCAL = "是";
                                    south.append(
                                        "<span style='color:#444444;'>" +
                                        "&ensp;|&ensp;" +
                                        "静压力是否需要计入计算压力：是" +
                                        "</span>");
                                } else {
                                    ZZGISCAL = "否";
                                    south.append(
                                        "<span style='color:#444444;'>" +
                                        "&ensp;|&ensp;" +
                                        "静压力是否需要计入计算压力：否" +
                                        "</span>");
                                }

                                // docx
                                let ZZGPayJS = $('#payjs');

                                function getDocx() {
                                    $.ajax({
                                        type: "POST",
                                        contentType: "application/json; charset=utf-8",
                                        url: "zzgdocx.action",
                                        async: true,
                                        dataType: "json",
                                        data: JSON.stringify({
                                            ribbonName: "ZZG",

                                            d: ZZGD,
                                            g: ZZGG,
                                            h: ZZGH,
                                            pd: ZZGPD.toFixed(4),
                                            ps: ZZGPS.toFixed(4),
                                            pspd: ZZGPSPD.toFixed(4),
                                            isCal: ZZGISCAL
                                        }),
                                        beforeSend: function () {
                                            docxtext.html("生成中" + "<i class='fa fa-spinner fa-pulse fa-fw' style='color:#18bc9c;'></i>");
                                            docx.off("click");
                                        },
                                        success: function (result) {

                                            // 返回状态码
                                            let return_code = parseFloat(result.return_code);

                                            // 获取 QrCode 失败
                                            if (return_code < 1) {
                                                $.messager.alert({
                                                    title: "错 误",
                                                    msg: "获取支付信息失败，请检查网络后重试",
                                                    icon: "error",
                                                    ok: "确定"
                                                });
                                                docxtext.html("下载计算书");
                                                docx.off("click").on("click", getDocx);
                                            }
                                            else {

                                                docxtext.html("生成成功");

                                                /*
                                                收银台
                                                 */
                                                // 二维码地址
                                                let codeUrl = result.code_url;
                                                // 名称
                                                let productName = result.title;
                                                // 价格
                                                let totalFee = result.total_fee;
                                                // 订单号
                                                let outTradeNo = result.out_trade_no;
                                                // payjs 订单号
                                                let payjsOrderId = result.payjs_order_id;
                                                // 初始化收银台
                                                let query = null, status;
                                                ZZGPayJS.dialog({
                                                    title: '收银台',
                                                    width: 450,
                                                    height: 500,
                                                    cache: false,
                                                    closable: false,
                                                    href: '/static/payjs/payjs.html',
                                                    modal: true,
                                                    onLoad: function () {

                                                        // 替换模板数据
                                                        $('#payjs_qrcode').qrcode({
                                                            render: "canvas",
                                                            text: codeUrl,
                                                            width: 145,
                                                            height: 145,
                                                            background: "#ffffff",
                                                            foreground: "#122A0A",
                                                            src: '/favicon.png',
                                                            imgWidth: 32,
                                                            imgHeight: 32
                                                        });
                                                        $("#product_name").html(productName);
                                                        $("#total_fee").html("¥" + totalFee / 100);
                                                        $("#out_trade_no").html(outTradeNo);

                                                        // 取消订单按钮功能
                                                        $("#payjs_cancel").off("click").on("click", function () {

                                                            // 收银台关闭并清空
                                                            ZZGPayJS.dialog("close");
                                                            ZZGPayJS.dialog("clear");
                                                            // 按钮重置
                                                            docx.removeClass("l-btn-disabled").attr("href", null).off("click").on("click", getDocx);
                                                            docxtext.html("下载计算书");
                                                            // 关闭轮询
                                                            if (query != null) {
                                                                query.abort();
                                                            }
                                                            // payjs 关闭订单
                                                            $.ajax({
                                                                type: "POST",
                                                                contentType: "application/json; charset=utf-8",
                                                                url: "payjs/order/cancel_order.action",
                                                                async: true,
                                                                dataType: "json",
                                                                data: JSON.stringify({
                                                                    payjs_order_id: payjsOrderId,
                                                                }),
                                                                beforeSend: function () {
                                                                },
                                                                success: function (result) {
                                                                    if (parseFloat(result) === 1) {
                                                                        $.messager.alert({
                                                                            title: "信息",
                                                                            msg: "成功取消订单",
                                                                            icon: "info",
                                                                            ok: "确定"
                                                                        });
                                                                    }
                                                                },
                                                                error: function () {
                                                                }
                                                            });
                                                        });
                                                    }
                                                });

                                                // 轮询订单状态， 若status 为 1，则获取下载链接
                                                getOrder(outTradeNo);

                                                function getOrder(outTradeNo) {
                                                    query = $.ajax({
                                                        type: "POST",
                                                        contentType: "application/json; charset=utf-8",
                                                        url: "payjs/order/get_order_status.action",
                                                        async: true,
                                                        dataType: "json",
                                                        data: JSON.stringify({
                                                            outTradeNo: outTradeNo,
                                                        }),
                                                        beforeSend: function () {
                                                        },
                                                        success: function (result) {

                                                            // 返回状态码
                                                            status = parseFloat(result);

                                                            // 0 未支付 1 已支付
                                                            if (status < 1) {
                                                                getOrder(outTradeNo);
                                                            }
                                                            else {

                                                                // 获取下载链接
                                                                $.ajax({
                                                                    type: "POST",
                                                                    contentType: "application/json; charset=utf-8",
                                                                    url: "payjs/order/get_order_docxlink.action",
                                                                    async: true,
                                                                    dataType: "json",
                                                                    data: JSON.stringify({
                                                                        outTradeNo: outTradeNo,
                                                                    }),
                                                                    beforeSend: function () {
                                                                    },
                                                                    success: function (result) {

                                                                        // 写入下载地址
                                                                        docx.attr("href", result);
                                                                        docxtext.html("下载地址");

                                                                        // 支付成功跳转页
                                                                        ZZGPayJS.dialog('refresh', '/static/payjs/payjs_success.html');

                                                                        // 倒计时计数器
                                                                        let maxTime = 4, timer;

                                                                        function CountDown() {
                                                                            if (maxTime >= 0) {
                                                                                $("#payjs_timer").html(maxTime);
                                                                                --maxTime;
                                                                            } else {

                                                                                clearInterval(timer);
                                                                                // 关闭并清空收银台
                                                                                ZZGPayJS.dialog('close');
                                                                                ZZGPayJS.dialog('clear');
                                                                            }
                                                                        }

                                                                        timer = setInterval(CountDown, 1000);
                                                                    },
                                                                    error: function () {
                                                                        $.messager.alert({
                                                                            title: "错 误",
                                                                            msg: "获取下载链接失败，请联系站长解决",
                                                                            icon: "error",
                                                                            ok: "确定"
                                                                        });
                                                                    }
                                                                })
                                                            }
                                                        },
                                                        error: function () {
                                                        }
                                                    });
                                                }
                                            }
                                        },
                                        error: function () {
                                            $.messager.alert({
                                                title: "错 误",
                                                msg: "由于网络原因，Word 计算书生成失败，请检查网络后重试",
                                                icon: "error",
                                                ok: "确定"
                                            });
                                            docxtext.html("下载计算书");
                                            docx.off("click").on("click", getDocx);
                                        }
                                    });
                                }

                                docx.removeClass("l-btn-disabled").off("click").on("click", getDocx);
                            }
                        }
                    }
                }
            },
            onLoadSuccess: function () {
                $("#cal").mCustomScrollbar({theme: "minimal-dark"});
            }
        });
    });
});