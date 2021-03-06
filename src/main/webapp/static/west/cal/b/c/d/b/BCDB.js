$(document).ready(function () {

    let docx = $("#DOCX");
    let docxtext = $("#DOCXTEXT");

    let bcdbd2 = $("#d2");
    let bcdbd3 = $("#d3");
    let bcdbd2d3 = $('#d2d3');

    $("#cal").html("<table id='bcdb'></table>");
    let pg = $("#bcdb");

    let south = $("#south");
    let currentTabIndex = null;
    $.getJSON("/static/west/cal/b/c/d/b/BCDB.json", function (result) {

        // 设计温度
        let BCDBDT;

        // 许用压缩应力
        let BCDBOTCR = -1;

        // 材料
        let BCDBSCategory, BCDBSCategoryVal, BCDBSType, BCDBSTypeVal, BCDBSSTD, BCDBSSTDVal, BCDBSName,
            BCDBCCategory, BCDBCCategoryVal, BCDBCType, BCDBCTypeVal, BCDBCSTD, BCDBCSTDVal, BCDBCName;

        // propertyGrid
        let columns, rows, ed;

        // 2D Sketch
        function bcdb2d(di = "ϕDi", thksn = "δsn", thksrn = "δsrn",
                        ri = "Ri", thkcn = "δcn", thkcrn = "δcrn",
                        l = "L") {

            bcdbd2.empty();

            let width = bcdbd2.width();
            let height = bcdbd2.height();

            let svg = d3.select("#d2").append("svg").attr("id", "BCDASVG")
                .attr("width", width).attr("height", height);

            // X 轴比例尺
            let xScale = d3.scaleLinear().domain([0, width]).range([0, width]);

            // Y 轴比例尺
            let yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

            // 轮廓线对象
            let line = d3.line().x(function (d) {
                return xScale(d.x);
            }).y(function (d) {
                return yScale(d.y);
            });

            // 图形边距
            let padding = 120;
            let thickness = 10;

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

            // 底部水平标注
            function dimBottomH(startX, startY, endX, endY, text) {

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
                ])).attr("id", "BCDASketchDI").classed("sketch", true);

                let g2 = svg.append("g");
                let text2 = g2.append("text").attr("x", 0).attr("y", 0).attr("dy", -5).attr("text-anchor", "middle");
                text2.append("textPath").attr("xlink:href", "#BCDASketchDI").attr("startOffset", "50%").text(text);

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

            // 画圆弧/椭圆弧
            function drawArc(radiusX, radiusY, startX, startY, endX, endY) {
                svg.append("path").attr("d", "M "
                    + startX + " " + startY + " "
                    + "A" + radiusX + " " + radiusY + " "
                    + "1 0 1" + " "
                    + endX + " " + endY
                ).classed("sketch", true);
            }

            // 筒体内壁
            drawLine(padding, height - padding, width - padding, height - padding);
            drawLine(padding, padding, width - padding, padding);

            // 左侧筒体端部
            drawLine(padding, padding - thickness, padding, height - padding + thickness);

            // 右侧筒体端部
            drawLine(width - padding, padding - thickness, width - padding, height - padding + thickness);

            // 左侧筒体上外壁
            drawLine(padding, padding - thickness, width / 2 + 100, padding - thickness);

            // 左侧筒体下外壁
            drawLine(padding, height - padding + thickness, width / 2 + 100, height - padding + thickness);

            // 右侧侧筒体上外壁
            drawLine(width / 2 + 100, padding - thickness, width - padding, padding - thickness);

            // 右侧侧筒体下外壁
            drawLine(width / 2 + 100, height - padding + thickness, width - padding, height - padding + thickness);

            // 筒体截断线
            drawLine(width / 2 - 100, padding - 2 * thickness, width / 2 - 100, padding - thickness);
            drawLine(width / 2 - 100, height - padding + thickness, width / 2 - 100, height - padding + 2 * thickness);
            drawLine(width / 2 + 100, padding - 2 * thickness, width / 2 + 100, padding - thickness);
            drawLine(width / 2 + 100, height - padding + thickness, width / 2 + 100, height - padding + 2 * thickness);

            // 削边线
            drawLine(width / 2 - 100, padding - 2 * thickness, width / 2 - 100 + 30, padding - 2 * thickness);
            drawLine(width / 2 - 100, height - padding + 2 * thickness, width / 2 - 100 + 30, height - padding + 2 * thickness);
            drawLine(width / 2 + 100 - 30, padding - 2 * thickness, width / 2 + 100, padding - 2 * thickness);
            drawLine(width / 2 + 100 - 30, height - padding + 2 * thickness, width / 2 + 100, height - padding + 2 * thickness);

            // 加强段外壁
            drawLine(width / 2 - 100 + 30, padding - 2 * thickness, width / 2 + 100 - 30, padding - 2 * thickness);
            drawLine(width / 2 - 100 + 30, height - padding + 2 * thickness, width / 2 + 100 - 30, height - padding + 2 * thickness);

            // 封头轮廓
            let BCDARI = height - 2 * padding;
            let BCDARM = height - 2 * padding + thickness;
            let BCDARO = height - 2 * padding + 2 * thickness;

            // 圆心坐标
            let centerX = width / 2 - BCDARI * Math.cos(Math.PI / 6) - thickness;
            let centerY = height / 2;

            // 内壁
            let innerArcTopX = centerX + BCDARI * Math.cos(Math.PI / 6);
            let innerArcTopY = padding;
            let innerArcBottomX = centerX + BCDARI * Math.cos(Math.PI / 6);
            let innerArcBottomY = height - padding;
            drawArc(BCDARI, BCDARI, innerArcTopX, innerArcTopY, innerArcBottomX, innerArcBottomY);

            // 上侧加强段外壁
            let outerArcTopStartX = centerX + Math.sqrt(BCDARO * BCDARO - BCDARI * BCDARI / 4);
            let outerArcTopStartY = padding;
            let outerArcTopEndX = centerX + BCDARO * Math.cos(Math.PI / 12);
            let outerArcTopEndY = centerY - BCDARO * Math.sin(Math.PI / 12);
            drawArc(BCDARO, BCDARO, outerArcTopStartX, outerArcTopStartY, outerArcTopEndX, outerArcTopEndY);

            // 下侧加强段外壁
            let outerArcBottomStartX = outerArcTopEndX;
            let outerArcBottomStartY = height - outerArcTopEndY;
            let outerArcBottomEndX = outerArcTopStartX;
            let outerArcBottomEndY = height - outerArcTopStartY;
            drawArc(BCDARO, BCDARO, outerArcBottomStartX, outerArcBottomStartY, outerArcBottomEndX, outerArcBottomEndY);

            // 球冠区外壁
            let midArcStartX = centerX + Math.sqrt(BCDARM * BCDARM - BCDARI * BCDARI / 4);
            let midArcStartY = padding;
            let midArcEndX = centerX + Math.sqrt(BCDARM * BCDARM - BCDARI * BCDARI / 4);
            let midArcEndY = height - padding;
            drawArc(BCDARM, BCDARM, midArcStartX, midArcStartY, midArcEndX, midArcEndY);

            // 封头削边
            drawLine(centerX + BCDARM * Math.cos(Math.PI / 12), centerY - BCDARM * Math.sin(Math.PI / 12), centerX + BCDARO * Math.cos(Math.PI / 12), centerY - BCDARO * Math.sin(Math.PI / 12));
            drawLine(centerX + BCDARM * Math.cos(Math.PI / 12), centerY + BCDARM * Math.sin(Math.PI / 12), centerX + BCDARO * Math.cos(Math.PI / 12), centerY + BCDARO * Math.sin(Math.PI / 12));

            // 中心线
            drawCenterLine(padding - 10, height / 2, padding + 50, height / 2);
            drawCenterLine(padding + 75, height / 2, width - padding + 10, height / 2);

            // 筒体内直径
            dimLeftV(padding, height - padding, padding, padding, di, "BCDASketchSDI");

            // 筒体厚度
            drawLine(padding - 30, padding - thickness, padding - 30, padding);
            drawLine(padding - 40, padding - thickness, padding - 3, padding - thickness);
            svg.append("path").classed("arrow sketch", true)
                .attr("d", line([
                    {x: padding - 30, y: padding - thickness},
                    {x: padding - 30 - 3, y: padding - thickness - 15},
                    {x: padding - 30 + 3, y: padding - thickness - 15},
                    {x: padding - 30, y: padding - thickness}
                ]));
            svg.append("path").attr("d", line([
                {x: padding - 30, y: padding - thickness - 15},
                {x: padding - 30, y: padding - thickness - 15 - 40}
            ])).attr("id", "BCDASketchTHKSN").classed("sketch", true);
            svg.append("g").append("text").attr("x", 0).attr("y", 0).attr("dy", -5).attr("text-anchor", "middle")
                .append("textPath").attr("xlink:href", "#BCDASketchTHKSN").attr("startOffset", "50%").text(thksn);

            // thksrn
            drawLine(width / 2 - 100 + 50, padding - thickness, width / 2 - 100 + 50, padding - 2 * thickness);
            svg.append("path").classed("arrow sketch", true)
                .attr("d", line([
                    {x: width / 2 - 100 + 50, y: padding - 2 * thickness},
                    {x: width / 2 - 100 + 50 - 3, y: padding - 2 * thickness - 15},
                    {x: width / 2 - 100 + 50 + 3, y: padding - 2 * thickness - 15},
                    {x: width / 2 - 100 + 50, y: padding - 2 * thickness}
                ]));
            svg.append("path").attr("d", line([
                {x: width / 2 - 100 + 50, y: padding - 2 * thickness - 15},
                {x: width / 2 - 100 + 50, y: padding - 2 * thickness - 15 - 40}
            ])).attr("id", "BCDASketchTHKSRN").classed("sketch", true);
            svg.append("g").append("text").attr("x", 0).attr("y", 0).attr("dy", -5).attr("text-anchor", "middle")
                .append("textPath").attr("xlink:href", "#BCDASketchTHKSRN").attr("startOffset", "50%").text(thksrn);
            svg.append("path").classed("arrow sketch", true)
                .attr("d", line([
                    {x: width / 2 - 100 + 50, y: padding - thickness},
                    {x: width / 2 - 100 + 50 - 3, y: padding - thickness + 15},
                    {x: width / 2 - 100 + 50 + 3, y: padding - thickness + 15},
                    {x: width / 2 - 100 + 50, y: padding - thickness}
                ]));
            drawLine(width / 2 - 100 + 50, padding - thickness + 15, width / 2 - 100 + 50, padding - thickness + 30);

            // L
            drawLine(width / 2 - 100, height - padding + 2 * thickness + 3, width / 2 - 100, height - padding + 2 * thickness + 40);
            drawLine(innerArcTopX, height - padding + 3, innerArcTopX, height - padding + 2 * thickness + 40);
            svg.append("path").classed("arrow sketch", true)
                .attr("d", line([
                    {x: innerArcBottomX, y: height - padding + 2 * thickness + 30},
                    {x: innerArcBottomX - 15, y: height - padding + 2 * thickness + 30 - 3},
                    {x: innerArcBottomX - 15, y: height - padding + 2 * thickness + 30 + 3},
                    {x: innerArcBottomX, y: height - padding + 2 * thickness + 30}
                ]));
            svg.append("path").attr("d", line([
                {x: width / 2 - 100 + 15, y: height - padding + 2 * thickness + 30},
                {x: innerArcBottomX - 15, y: height - padding + 2 * thickness + 30}
            ])).attr("id", "BCDASketchLL").classed("sketch", true);
            svg.append("g").append("text").attr("x", 0).attr("y", 0).attr("dy", -5).attr("text-anchor", "middle")
                .append("textPath").attr("xlink:href", "#BCDASketchLL").attr("startOffset", "50%").text(l);
            svg.append("path").classed("arrow sketch", true)
                .attr("d", line([
                    {x: width / 2 - 100, y: height - padding + 2 * thickness + 30},
                    {x: width / 2 - 100 + 15, y: height - padding + 2 * thickness + 30 - 3},
                    {x: width / 2 - 100 + 15, y: height - padding + 2 * thickness + 30 + 3},
                    {x: width / 2 - 100, y: height - padding + 2 * thickness + 30}
                ]));

            // L
            drawLine(width / 2 + 100, height - padding + 2 * thickness + 3, width / 2 + 100, height - padding + 2 * thickness + 40);
            drawLine(outerArcBottomEndX, height - padding + 3, outerArcBottomEndX, height - padding + 2 * thickness + 40);
            svg.append("path").classed("arrow sketch", true)
                .attr("d", line([
                    {x: outerArcBottomEndX, y: height - padding + 2 * thickness + 30},
                    {x: outerArcBottomEndX + 15, y: height - padding + 2 * thickness + 30 - 3},
                    {x: outerArcBottomEndX + 15, y: height - padding + 2 * thickness + 30 + 3},
                    {x: outerArcBottomEndX, y: height - padding + 2 * thickness + 30}
                ]));
            svg.append("path").attr("d", line([
                {x: outerArcBottomEndX + 15, y: height - padding + 2 * thickness + 30},
                {x: width / 2 + 100 - 15, y: height - padding + 2 * thickness + 30}
            ])).attr("id", "BCDASketchLR").classed("sketch", true);
            svg.append("g").append("text").attr("x", 0).attr("y", 0).attr("dy", -5).attr("text-anchor", "middle")
                .append("textPath").attr("xlink:href", "#BCDASketchLR").attr("startOffset", "50%").text(l);
            svg.append("path").classed("arrow sketch", true)
                .attr("d", line([
                    {x: width / 2 + 100, y: height - padding + 2 * thickness + 30},
                    {x: width / 2 + 100 - 15, y: height - padding + 2 * thickness + 30 - 3},
                    {x: width / 2 + 100 - 15, y: height - padding + 2 * thickness + 30 + 3},
                    {x: width / 2 + 100, y: height - padding + 2 * thickness + 30}
                ]));

            // 封头球冠区
            let ang = 4;
            svg.append("path").attr("d", line([
                {x: centerX, y: centerY},
                {x: centerX + BCDARI, y: centerY}
            ])).attr("id", "BCDASketchRi").classed("sketch", true)
                .attr("transform", "rotate(" + -ang + ", " + centerX + " " + centerY + ")");
            svg.append("g").append("text").attr("x", 0).attr("y", 0).attr("dy", -5)
                .attr("text-anchor", "middle")
                .append("textPath")
                .attr("xlink:href", "#BCDASketchRi").attr("startOffset", "50%").text(ri);
            svg.append("path").classed("arrow sketch", true)
                .attr("d", line([
                    {x: centerX + BCDARI, y: centerY},
                    {x: centerX + BCDARI - 15, y: centerY - 3},
                    {x: centerX + BCDARI - 15, y: centerY + 3},
                    {x: centerX + BCDARI, y: centerY}
                ])).attr("transform", "rotate(" + -ang + ", " + centerX + " " + centerY + ")");

            svg.append("path").attr("d", line([
                {x: centerX + BCDARI, y: centerY},
                {x: centerX + BCDARM, y: centerY}
            ])).classed("sketch", true).attr("transform", "rotate(" + -ang + ", " + centerX + " " + centerY + ")");

            svg.append("path").classed("arrow sketch", true)
                .attr("d", line([
                    {x: centerX + BCDARM, y: centerY},
                    {x: centerX + BCDARM + 15, y: centerY - 3},
                    {x: centerX + BCDARM + 15, y: centerY + 3},
                    {x: centerX + BCDARM, y: centerY}
                ])).attr("transform", "rotate(" + -ang + ", " + centerX + " " + centerY + ")");
            svg.append("path").attr("d", line([
                {x: centerX + BCDARM + 15, y: centerY},
                {x: centerX + BCDARM + 60, y: centerY}
            ])).attr("id", "BCDASketchTHKCN").classed("sketch", true)
                .attr("transform", "rotate(" + -ang + ", " + centerX + " " + centerY + ")");
            svg.append("g").append("text").attr("x", 0).attr("y", 0).attr("dy", -5)
                .attr("text-anchor", "middle")
                .append("textPath")
                .attr("xlink:href", "#BCDASketchTHKCN").attr("startOffset", "50%").text(thkcn);

            // thkcrn
            let oppang = Math.asin(BCDARI / 2 / BCDARO) / Math.PI * 180 - ang;
            svg.append("path").classed("arrow sketch", true)
                .attr("d", line([
                    {x: centerX + BCDARM, y: centerY},
                    {x: centerX + BCDARM - 15, y: centerY - 3},
                    {x: centerX + BCDARM - 15, y: centerY + 3},
                    {x: centerX + BCDARM, y: centerY}
                ])).attr("transform", "rotate(" + oppang + ", " + centerX + " " + centerY + ")");
            svg.append("path").attr("d", line([
                {x: centerX + BCDARM - 15, y: centerY},
                {x: centerX + BCDARM - 30, y: centerY}
            ])).classed("sketch", true)
                .attr("transform", "rotate(" + oppang + ", " + centerX + " " + centerY + ")");
            svg.append("path").attr("d", line([
                {x: centerX + BCDARO, y: centerY},
                {x: centerX + BCDARM, y: centerY}
            ])).classed("sketch", true)
                .attr("transform", "rotate(" + oppang + ", " + centerX + " " + centerY + ")");
            svg.append("path").classed("arrow sketch", true)
                .attr("d", line([
                    {x: centerX + BCDARO, y: centerY},
                    {x: centerX + BCDARO + 15, y: centerY - 3},
                    {x: centerX + BCDARO + 15, y: centerY + 3},
                    {x: centerX + BCDARO, y: centerY}
                ])).attr("transform", "rotate(" + oppang + ", " + centerX + " " + centerY + ")");
            svg.append("path").attr("d", line([
                {x: centerX + BCDARO + 15, y: centerY},
                {x: centerX + BCDARO + 50, y: centerY}
            ])).attr("id", "BCDASketchTHKCRN").classed("sketch", true)
                .attr("transform", "rotate(" + oppang + ", " + centerX + " " + centerY + ")");
            svg.append("g").append("text").attr("x", 0).attr("y", 0).attr("dy", -5)
                .attr("text-anchor", "middle")
                .append("textPath")
                .attr("xlink:href", "#BCDASketchTHKCRN").attr("startOffset", "50%").text(thkcrn);
        }

        currentTabIndex = bcdbd2d3.tabs('getTabIndex', bcdbd2d3.tabs('getSelected'));

        // 初始化 Sketch
        if (currentTabIndex === 0) {
            bcdb2d();
            $("#d2").off("resize").on("resize", function () {
                if ($("#bcdb").length > 0) {
                    bcdb2d();
                }
            });
        }
        bcdbd2d3.tabs({
            onSelect: function (title, index) {
                if (index === 0) {
                    bcdb2d();
                    $("#d2").off("resize").on("resize", function () {
                        if ($("#bcdb").length > 0) {
                            bcdb2d();
                        }
                    });
                }
            }
        });

        let lastIndex;
        pg.propertygrid({
            title: "NB/T 47003.1-2009 球冠形中间封头内压计算",
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
                ed = pg.propertygrid("getEditor", {index: index, field: "value"});

                if (index === 4) {
                    $(ed.target).combobox("loadData", BCDBSCategory);
                }
                else if (index === 5) {
                    $(ed.target).combobox("loadData", BCDBSType);
                }
                else if (index === 6) {
                    $(ed.target).combobox("loadData", BCDBSSTD);
                }
                else if (index === 7) {
                    $(ed.target).combobox("loadData", BCDBSName);
                }
                else if (index === 13) {
                    $(ed.target).combobox("loadData", BCDBCCategory);
                }
                else if (index === 14) {
                    $(ed.target).combobox("loadData", BCDBCType);
                }
                else if (index === 15) {
                    $(ed.target).combobox("loadData", BCDBCSTD);
                }
                else if (index === 16) {
                    $(ed.target).combobox("loadData", BCDBCName);
                }

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

                    docx.addClass("l-btn-disabled").off("click").attr("href", null);
                    docxtext.html("下载计算书");

                    // sketch
                    bcdbd2.empty();

                    // model
                    bcdbd3.empty();

                    // sketch
                    currentTabIndex = bcdbd2d3.tabs('getTabIndex', bcdbd2d3.tabs('getSelected'));

                    // 初始化 Sketch
                    if (currentTabIndex === 0) {
                        bcdb2d();
                        bcdbd2.off("resize").on("resize", function () {
                            if ($("#bcdb").length > 0) {
                                bcdb2d();
                            }
                        });
                    }
                    bcdbd2d3.tabs({
                        onSelect: function (title, index) {
                            if (index === 0) {
                                bcdb2d();
                                bcdbd2.off("resize").on("resize", function () {
                                    if ($("#bcdb").length > 0) {
                                        bcdb2d();
                                    }
                                });
                            }
                        }
                    });

                    // alert
                    south.empty();

                    columns = pg.propertygrid("options").columns;
                    rows = pg.propertygrid("getRows");

                    // 温度改变，重新加载 category
                    if (index === 1) {

                        BCDBDT = parseFloat(changes.value);

                        if (BCDBDT <= 100) {
                            BCDBOTCR = 103;
                        }
                        else if (BCDBDT > 100 && BCDBDT <= 200) {
                            BCDBOTCR = 100;
                        }
                        else if (BCDBDT > 200 && BCDBDT <= 250) {
                            BCDBOTCR = 95;
                        }
                        else if (BCDBDT > 250 && BCDBDT <= 350) {
                            BCDBOTCR = 80;
                        }

                        // 将下游级联菜单 category、type、std、name 清空
                        rows[4][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 4);
                        BCDBSCategory = null;
                        rows[5][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 5);
                        BCDBSType = null;
                        rows[6][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 6);
                        BCDBSSTD = null;
                        rows[7][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 7);
                        BCDBSName = null;

                        rows[13][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 13);
                        BCDBCCategory = null;
                        rows[14][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 14);
                        BCDBCType = null;
                        rows[15][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 15);
                        BCDBCSTD = null;
                        rows[16][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 16);
                        BCDBCName = null;

                        // 获取 category 列表
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "web_list_nbt_47003_1_2009_category.action",
                            async: false,
                            dataType: "json",
                            data: JSON.stringify({
                                temp: BCDBDT
                            }),
                            beforeSend: function () {
                            },
                            success: function (result) {
                                BCDBSCategory = [];
                                BCDBCCategory = [];
                                if (result.length <= 0) {
                                    south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                        "&ensp;" + "<span style='color:red;'>" + BCDBDT + "</span>" +
                                        "<span style='color:red;'>&ensp;℃ 下没有可用材料！</span>");
                                } else {
                                    $(result).each(function (index, element) {
                                        BCDBSCategory[index] = {
                                            "value": element,
                                            "text": element
                                        };
                                        BCDBCCategory[index] = {
                                            "value": element,
                                            "text": element
                                        };
                                    });
                                }
                            },
                            error: function () {
                                south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                    "<span style='color:red;'>&ensp;材料类别获取失败，请检查网络后重试</span>");
                            }
                        });
                    }

                    // category 改变，重新加载type
                    else if (index === 4) {

                        BCDBSCategoryVal = changes.value;

                        // 将下游级联菜单 type、std、name 清空
                        rows[5][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 5);
                        BCDBSType = null;
                        rows[6][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 6);
                        BCDBSSTD = null;
                        rows[7][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 7);
                        BCDBSName = null;

                        // 获取 type 列表
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "web_list_nbt_47003_1_2009_type.action",
                            async: false,
                            dataType: "json",
                            data: JSON.stringify({
                                category: BCDBSCategoryVal,
                                temp: BCDBDT
                            }),
                            beforeSend: function () {
                            },
                            success: function (result) {
                                BCDBSType = [];
                                $(result).each(function (index, element) {
                                    BCDBSType[index] = {
                                        "value": element,
                                        "text": element
                                    };
                                });
                            },
                            error: function () {
                                south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                    "<span style='color:red;'>&ensp;材料类型获取失败，请检查网络后重试</span>");
                            }
                        });
                    }

                    // type 改变，重新加载 std
                    else if (index === 5) {

                        BCDBSTypeVal = changes.value;

                        // 将下游级联菜单 std、name 清空
                        rows[6][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 6);
                        BCDBSSTD = null;
                        rows[7][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 7);
                        BCDBSName = null;

                        // 获取 std 列表
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "web_list_nbt_47003_1_2009_std.action",
                            async: false,
                            dataType: "json",
                            data: JSON.stringify({
                                category: BCDBSCategoryVal,
                                type: BCDBSTypeVal,
                                temp: BCDBDT
                            }),
                            beforeSend: function () {
                            },
                            success: function (result) {
                                BCDBSSTD = [];
                                $(result).each(function (index, element) {
                                    BCDBSSTD[index] = {
                                        "value": element,
                                        "text": element
                                    };
                                });
                            },
                            error: function () {
                                south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                    "<span style='color:red;'>&ensp;材料标准号获取失败，请检查网络后重试</span>");
                            }
                        });
                    }

                    // std 改变，重新加载 Name
                    else if (index === 6) {

                        BCDBSSTDVal = changes.value;

                        // 将下游级联菜单name清空
                        rows[7][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 7);
                        BCDBSName = null;

                        // 获取 name 列表
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "web_list_nbt_47003_1_2009_name.action",
                            async: false,
                            dataType: "json",
                            data: JSON.stringify({
                                category: BCDBSCategoryVal,
                                type: BCDBSTypeVal,
                                std: BCDBSSTDVal,
                                temp: BCDBDT
                            }),
                            beforeSend: function () {
                            },
                            success: function (result) {
                                BCDBSName = [];
                                $(result).each(function (index, element) {
                                    BCDBSName[index] = {
                                        "value": element,
                                        "text": element
                                    };
                                });
                            },
                            error: function () {
                                south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                    "<span style='color:red;'>&ensp;材料牌号获取失败，请检查网络后重试</span>");
                            }
                        });
                    }

                    // category 改变，重新加载type
                    else if (index === 13) {

                        BCDBCCategoryVal = changes.value;

                        // 将下游级联菜单 type、std、name 清空
                        rows[14][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 14);
                        BCDBCType = null;
                        rows[15][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 15);
                        BCDBCSTD = null;
                        rows[16][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 16);
                        BCDBCName = null;

                        // 获取 type 列表
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "web_list_nbt_47003_1_2009_type.action",
                            async: false,
                            dataType: "json",
                            data: JSON.stringify({
                                category: BCDBCCategoryVal,
                                temp: BCDBDT
                            }),
                            beforeSend: function () {
                            },
                            success: function (result) {
                                BCDBCType = [];
                                $(result).each(function (index, element) {
                                    BCDBCType[index] = {
                                        "value": element,
                                        "text": element
                                    };
                                });
                            },
                            error: function () {
                                south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                    "<span style='color:red;'>&ensp;材料类型获取失败，请检查网络后重试</span>");
                            }
                        });
                    }

                    // type 改变，重新加载 std
                    else if (index === 14) {

                        BCDBCTypeVal = changes.value;

                        // 将下游级联菜单 std、name 清空
                        rows[15][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 15);
                        BCDBCSTD = null;
                        rows[16][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 16);
                        BCDBCName = null;

                        // 获取 std 列表
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "web_list_nbt_47003_1_2009_std.action",
                            async: false,
                            dataType: "json",
                            data: JSON.stringify({
                                category: BCDBCCategoryVal,
                                type: BCDBCTypeVal,
                                temp: BCDBDT
                            }),
                            beforeSend: function () {
                            },
                            success: function (result) {
                                BCDBCSTD = [];
                                $(result).each(function (index, element) {
                                    BCDBCSTD[index] = {
                                        "value": element,
                                        "text": element
                                    };
                                });
                            },
                            error: function () {
                                south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                    "<span style='color:red;'>&ensp;材料标准号获取失败，请检查网络后重试</span>");
                            }
                        });
                    }

                    // std 改变，重新加载 Name
                    else if (index === 15) {

                        BCDBCSTDVal = changes.value;

                        // 将下游级联菜单name清空
                        rows[16][columns[0][1].field] = null;
                        pg.datagrid('refreshRow', 16);
                        BCDBCName = null;

                        // 获取 name 列表
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "web_list_nbt_47003_1_2009_name.action",
                            async: false,
                            dataType: "json",
                            data: JSON.stringify({
                                category: BCDBCCategoryVal,
                                type: BCDBCTypeVal,
                                std: BCDBCSTDVal,
                                temp: BCDBDT
                            }),
                            beforeSend: function () {
                            },
                            success: function (result) {
                                BCDBCName = [];
                                $(result).each(function (index, element) {
                                    BCDBCName[index] = {
                                        "value": element,
                                        "text": element
                                    };
                                });
                            },
                            error: function () {
                                south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                    "<span style='color:red;'>&ensp;材料牌号获取失败，请检查网络后重试</span>");
                            }
                        });
                    }

                    // name 及其他修改项改变，获取数据，并计算
                    else {

                        // 设计压力
                        if (!jQuery.isEmptyObject(rows[0][columns[0][1].field])) {
                            let BCDBPD = parseFloat(rows[0][columns[0][1].field]);

                            // 静压力
                            if (!jQuery.isEmptyObject(rows[2][columns[0][1].field])) {
                                let BCDBPS = parseFloat(rows[2][columns[0][1].field]);

                                // 计算压力
                                let BCDBPC = BCDBPD + BCDBPS;

                                // 试验类型
                                if (!jQuery.isEmptyObject(rows[3][columns[0][1].field])) {
                                    let BCDBTest = rows[3][columns[0][1].field];

                                    // 筒体材料名称
                                    if (!jQuery.isEmptyObject(rows[7][columns[0][1].field])) {
                                        let BCDBSNameVal = rows[7][columns[0][1].field];

                                        // AJAX 获取筒体材料密度、最大最小厚度
                                        let BCDBDS, BCDBSThkMin, BCDBSThkMax;
                                        $.ajax({
                                            type: "POST",
                                            contentType: "application/json; charset=utf-8",
                                            url: "web_get_nbt_47003_1_2009_index.action",
                                            async: true,
                                            dataType: "json",
                                            data: JSON.stringify({
                                                "category": BCDBSCategoryVal,
                                                "type": BCDBSTypeVal,
                                                "std": BCDBSSTDVal,
                                                "name": BCDBSNameVal,
                                                "temp": BCDBDT
                                            }),
                                            beforeSend: function () {
                                            },
                                            success: function (result) {

                                                BCDBDS = parseFloat(result.density);
                                                BCDBSThkMin = parseFloat(result.thkMin);
                                                BCDBSThkMax = parseFloat(result.thkMax);

                                                // 筒体内直径
                                                if (!jQuery.isEmptyObject(rows[8][columns[0][1].field])) {
                                                    let BCDBSDI = parseFloat(rows[8][columns[0][1].field]);

                                                    // Sketch
                                                    if (currentTabIndex === 0) {
                                                        bcdb2d("Φ" + BCDBSDI);
                                                        bcdbd2.off("resize").on("resize", function () {
                                                            if ($("#bcdb").length > 0) {
                                                                bcdb2d("Φ" + BCDBSDI);
                                                            }
                                                        });
                                                    }
                                                    bcdbd2d3.tabs({
                                                        onSelect: function (title, index) {
                                                            if (index === 0) {
                                                                bcdb2d("Φ" + BCDBSDI);
                                                                bcdbd2.off("resize").on("resize", function () {
                                                                    if ($("#bcdb").length > 0) {
                                                                        bcdb2d("Φ" + BCDBSDI);
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    });

                                                    // 筒体名义厚度
                                                    if (!jQuery.isEmptyObject(rows[9][columns[0][1].field])
                                                        && parseFloat(rows[9][columns[0][1].field]) > BCDBSThkMin
                                                        && parseFloat(rows[9][columns[0][1].field]) <= BCDBSThkMax) {
                                                        let BCDBTHKSN = parseFloat(rows[9][columns[0][1].field]);

                                                        // Sketch
                                                        if (currentTabIndex === 0) {
                                                            bcdb2d("Φ" + BCDBSDI, BCDBTHKSN);
                                                            bcdbd2.off("resize").on("resize", function () {
                                                                if ($("#bcdb").length > 0) {
                                                                    bcdb2d("Φ" + BCDBSDI, BCDBTHKSN);
                                                                }
                                                            });
                                                        }
                                                        bcdbd2d3.tabs({
                                                            onSelect: function (title, index) {
                                                                if (index === 0) {
                                                                    bcdb2d("Φ" + BCDBSDI, BCDBTHKSN);
                                                                    bcdbd2.off("resize").on("resize", function () {
                                                                        if ($("#bcdb").length > 0) {
                                                                            bcdb2d("Φ" + BCDBSDI, BCDBTHKSN);
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        });

                                                        let BCDBSDO = BCDBSDI + 2 * BCDBTHKSN;

                                                        let BCDBOST, BCDBOS, BCDBRSREL, BCDBCS1;
                                                        $.ajax({
                                                            type: "POST",
                                                            contentType: "application/json; charset=utf-8",
                                                            url: "web_get_nbt_47003_1_2009_com_property.action",
                                                            async: true,
                                                            dataType: "json",
                                                            data: JSON.stringify({
                                                                "category": BCDBSCategoryVal,
                                                                "type": BCDBSTypeVal,
                                                                "std": BCDBSSTDVal,
                                                                "name": BCDBSNameVal,
                                                                "thk": BCDBTHKSN,
                                                                "temp": BCDBDT,
                                                                "highLow": 3,
                                                                "isTube": 0,
                                                                "od": BCDBSDO
                                                            }),
                                                            beforeSend: function () {
                                                            },
                                                            success: function (result) {

                                                                BCDBOST = parseFloat(result.ot);
                                                                if (BCDBOST < 0) {
                                                                    south.html("查询材料设计温度许用应力失败！").css("color", "red");
                                                                    return false;
                                                                }
                                                                BCDBOS = parseFloat(result.o);
                                                                if (BCDBOS < 0) {
                                                                    south.html("查询材料常温许用应力失败！").css("color", "red");
                                                                    return false;
                                                                }
                                                                BCDBRSREL = parseFloat(result.rel);
                                                                if (BCDBRSREL < 0) {
                                                                    south.html("查询材料常温屈服强度失败！").css("color", "red");
                                                                    return false;
                                                                }
                                                                BCDBCS1 = parseFloat(result.c1);
                                                                if (BCDBCS1 < 0) {
                                                                    south.html("查询材料厚度负偏差失败！").css("color", "red");
                                                                    return false;
                                                                }

                                                                // 筒体腐蚀裕量
                                                                if (!jQuery.isEmptyObject(rows[10][columns[0][1].field])
                                                                    && parseFloat(rows[10][columns[0][1].field]) < BCDBTHKSN) {
                                                                    let BCDBCS2 = parseFloat(rows[10][columns[0][1].field]);

                                                                    // 筒体焊接接头系数
                                                                    if (!jQuery.isEmptyObject(rows[11][columns[0][1].field])) {
                                                                        let BCDBES = parseFloat(rows[11][columns[0][1].field]);

                                                                        // 筒体厚度附加量C
                                                                        let BCDBCS = BCDBCS1 + BCDBCS2;

                                                                        // 筒体有效厚度
                                                                        let BCDBTHKSE = BCDBTHKSN - BCDBCS;

                                                                        // 筒体计算厚度
                                                                        let BCDBTHKSC = BCDBPC * BCDBSDI / (2 * BCDBOST * BCDBES);

                                                                        // 筒体设计厚度
                                                                        let BCDBTHKSD = BCDBTHKSC + BCDBCS2;

                                                                        // 所需厚度提示信息
                                                                        south.html(
                                                                            "<span style='color:#444444;'>" +
                                                                            "筒体所需厚度：" + (BCDBTHKSD + BCDBCS1).toFixed(2) + " mm" +
                                                                            "</span>");

                                                                        // 筒体厚度校核
                                                                        let BCDBTHKSCHK;
                                                                        if (BCDBTHKSN >= (BCDBTHKSD + BCDBCS1).toFixed(2)) {
                                                                            south.append(
                                                                                "<span style='color:#444444;'>" +
                                                                                "&ensp;|&ensp;" +
                                                                                "输入厚度：" + BCDBTHKSN + " mm" +
                                                                                "</span>");
                                                                            BCDBTHKSCHK = "合格";
                                                                        }
                                                                        else {
                                                                            south.append(
                                                                                "<span style='color:red;'>" +
                                                                                "&ensp;|&ensp;" +
                                                                                "输入厚度：" + BCDBTHKSN + " mm" +
                                                                                "</span>");
                                                                            BCDBTHKSCHK = "不合格";
                                                                        }

                                                                        // 筒体加强板名义厚度
                                                                        if (!jQuery.isEmptyObject(rows[12][columns[0][1].field])
                                                                            && parseFloat(rows[12][columns[0][1].field]) > BCDBSThkMin
                                                                            && parseFloat(rows[12][columns[0][1].field]) <= BCDBSThkMax) {
                                                                            let BCDBTHKSRN = parseFloat(rows[12][columns[0][1].field]);

                                                                            // Sketch
                                                                            if (currentTabIndex === 0) {
                                                                                bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN);
                                                                                bcdbd2.off("resize").on("resize", function () {
                                                                                    if ($("#bcdb").length > 0) {
                                                                                        bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN);
                                                                                    }
                                                                                });
                                                                            }
                                                                            bcdbd2d3.tabs({
                                                                                onSelect: function (title, index) {
                                                                                    if (index === 0) {
                                                                                        bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN);
                                                                                        bcdbd2.off("resize").on("resize", function () {
                                                                                            if ($("#bcdb").length > 0) {
                                                                                                bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN);
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                }
                                                                            });

                                                                            let BCDBSRDO = BCDBSDO + 2 * BCDBTHKSRN;

                                                                            let BCDBOSRT, BCDBOSR, BCDBRSRREL, BCDBCSR1;
                                                                            $.ajax({
                                                                                type: "POST",
                                                                                contentType: "application/json; charset=utf-8",
                                                                                url: "web_get_nbt_47003_1_2009_com_property.action",
                                                                                async: true,
                                                                                dataType: "json",
                                                                                data: JSON.stringify({
                                                                                    "category": BCDBSCategoryVal,
                                                                                    "type": BCDBSTypeVal,
                                                                                    "std": BCDBSSTDVal,
                                                                                    "name": BCDBSNameVal,
                                                                                    "thk": BCDBTHKSRN,
                                                                                    "temp": BCDBDT,
                                                                                    "highLow": 3,
                                                                                    "isTube": 0,
                                                                                    "od": BCDBSRDO
                                                                                }),
                                                                                beforeSend: function () {
                                                                                },
                                                                                success: function (result) {

                                                                                    BCDBOSRT = parseFloat(result.ot);
                                                                                    if (BCDBOSRT < 0) {
                                                                                        south.html("查询材料设计温度许用应力失败！").css("color", "red");
                                                                                        return false;
                                                                                    }
                                                                                    BCDBOSR = parseFloat(result.o);
                                                                                    if (BCDBOSR < 0) {
                                                                                        south.html("查询材料常温许用应力失败！").css("color", "red");
                                                                                        return false;
                                                                                    }
                                                                                    BCDBRSRREL = parseFloat(result.rel);
                                                                                    if (BCDBRSRREL < 0) {
                                                                                        south.html("查询材料常温屈服强度失败！").css("color", "red");
                                                                                        return false;
                                                                                    }
                                                                                    BCDBCSR1 = parseFloat(result.c1);
                                                                                    if (BCDBCSR1 < 0) {
                                                                                        south.html("查询材料厚度负偏差失败！").css("color", "red");
                                                                                        return false;
                                                                                    }

                                                                                    // 筒体加强板厚度附加量
                                                                                    let BCDBCSR = BCDBCSR1;

                                                                                    // 筒体加强段有效厚度
                                                                                    let BCDBTHKSRE = BCDBTHKSRN - BCDBCSR;

                                                                                    // 封头材料名称
                                                                                    if (!jQuery.isEmptyObject(rows[16][columns[0][1].field])) {
                                                                                        let BCDBCNameVal = rows[16][columns[0][1].field];

                                                                                        // AJAX 获取封头材料密度、最大最小厚度
                                                                                        let BCDBDC, BCDBCThkMin,
                                                                                            BCDBCThkMax;
                                                                                        $.ajax({
                                                                                            type: "POST",
                                                                                            contentType: "application/json; charset=utf-8",
                                                                                            url: "web_get_nbt_47003_1_2009_index.action",
                                                                                            async: true,
                                                                                            dataType: "json",
                                                                                            data: JSON.stringify({
                                                                                                "category": BCDBCCategoryVal,
                                                                                                "type": BCDBCTypeVal,
                                                                                                "std": BCDBCSTDVal,
                                                                                                "name": BCDBCNameVal,
                                                                                                "temp": BCDBDT
                                                                                            }),
                                                                                            beforeSend: function () {
                                                                                            },
                                                                                            success: function (result) {

                                                                                                BCDBDC = parseFloat(result.density);
                                                                                                BCDBCThkMin = parseFloat(result.thkMin);
                                                                                                BCDBCThkMax = parseFloat(result.thkMax);

                                                                                                // 封头内半径
                                                                                                if (!jQuery.isEmptyObject(rows[17][columns[0][1].field])
                                                                                                    && parseFloat(rows[17][columns[0][1].field]) >= 0.5 * BCDBSDI) {
                                                                                                    let BCDBCRI = parseFloat(rows[17][columns[0][1].field]);

                                                                                                    // Sketch
                                                                                                    if (currentTabIndex === 0) {
                                                                                                        bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI);
                                                                                                        bcdbd2.off("resize").on("resize", function () {
                                                                                                            if ($("#bcdb").length > 0) {
                                                                                                                bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI);
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                    bcdbd2d3.tabs({
                                                                                                        onSelect: function (title, index) {
                                                                                                            if (index === 0) {
                                                                                                                bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI);
                                                                                                                bcdbd2.off("resize").on("resize", function () {
                                                                                                                    if ($("#bcdb").length > 0) {
                                                                                                                        bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI);
                                                                                                                    }
                                                                                                                });
                                                                                                            }
                                                                                                        }
                                                                                                    });

                                                                                                    // 球壳切线与圆筒壁夹角 alpha(弧度)
                                                                                                    let BCDBALPHA = Math.acos(BCDBSDI / (2 * BCDBCRI));

                                                                                                    // 度数
                                                                                                    let BCDBDEGREE = BCDBALPHA / Math.PI * 180;

                                                                                                    // 封头名义厚度
                                                                                                    if (!jQuery.isEmptyObject(rows[18][columns[0][1].field])
                                                                                                        && parseFloat(rows[18][columns[0][1].field]) > BCDBCThkMin
                                                                                                        && parseFloat(rows[18][columns[0][1].field]) <= BCDBCThkMax) {
                                                                                                        let BCDBTHKCN = parseFloat(rows[18][columns[0][1].field]);

                                                                                                        // Sketch
                                                                                                        if (currentTabIndex === 0) {
                                                                                                            bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN);
                                                                                                            bcdbd2.off("resize").on("resize", function () {
                                                                                                                if ($("#bcdb").length > 0) {
                                                                                                                    bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN);
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                        bcdbd2d3.tabs({
                                                                                                            onSelect: function (title, index) {
                                                                                                                if (index === 0) {
                                                                                                                    bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN);
                                                                                                                    bcdbd2.off("resize").on("resize", function () {
                                                                                                                        if ($("#bcdb").length > 0) {
                                                                                                                            bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN);
                                                                                                                        }
                                                                                                                    });
                                                                                                                }
                                                                                                            }
                                                                                                        });

                                                                                                        let BCDBCRO = BCDBCRI + BCDBTHKCN;

                                                                                                        let BCDBOCT,
                                                                                                            BCDBOC,
                                                                                                            BCDBRCREL,
                                                                                                            BCDBCC1;
                                                                                                        $.ajax({
                                                                                                            type: "POST",
                                                                                                            contentType: "application/json; charset=utf-8",
                                                                                                            url: "web_get_nbt_47003_1_2009_com_property.action",
                                                                                                            async: true,
                                                                                                            dataType: "json",
                                                                                                            data: JSON.stringify({
                                                                                                                "category": BCDBCCategoryVal,
                                                                                                                "type": BCDBCTypeVal,
                                                                                                                "std": BCDBCSTDVal,
                                                                                                                "name": BCDBCNameVal,
                                                                                                                "thk": BCDBTHKCN,
                                                                                                                "temp": BCDBDT,
                                                                                                                "highLow": 3,
                                                                                                                "isTube": 0,
                                                                                                                "od": BCDBCRO * 2
                                                                                                            }),
                                                                                                            beforeSend: function () {
                                                                                                            },
                                                                                                            success: function (result) {

                                                                                                                BCDBOCT = parseFloat(result.ot);
                                                                                                                if (BCDBOCT < 0) {
                                                                                                                    south.html("查询材料设计温度许用应力失败！").css("color", "red");
                                                                                                                    return false;
                                                                                                                }
                                                                                                                BCDBOC = parseFloat(result.o);
                                                                                                                if (BCDBOC < 0) {
                                                                                                                    south.html("查询材料常温许用应力失败！").css("color", "red");
                                                                                                                    return false;
                                                                                                                }
                                                                                                                BCDBRCREL = parseFloat(result.rel);
                                                                                                                if (BCDBRCREL < 0) {
                                                                                                                    south.html("查询材料常温屈服强度失败！").css("color", "red");
                                                                                                                    return false;
                                                                                                                }
                                                                                                                BCDBCC1 = parseFloat(result.c1);
                                                                                                                if (BCDBCC1 < 0) {
                                                                                                                    south.html("查询材料厚度负偏差失败！").css("color", "red");
                                                                                                                    return false;
                                                                                                                }

                                                                                                                // 封头腐蚀裕量
                                                                                                                if (!jQuery.isEmptyObject(rows[19][columns[0][1].field])
                                                                                                                    && parseFloat(rows[19][columns[0][1].field]) < BCDBTHKCN) {
                                                                                                                    let BCDBCC2 = parseFloat(rows[19][columns[0][1].field]);

                                                                                                                    // 封头厚度附加量
                                                                                                                    let BCDBCC = BCDBCC1 + BCDBCC2;

                                                                                                                    // 封头有效厚度
                                                                                                                    let BCDBTHKCE = BCDBTHKCN - BCDBCC;

                                                                                                                    // 封头焊接接头系数
                                                                                                                    if (!jQuery.isEmptyObject(rows[20][columns[0][1].field])) {
                                                                                                                        let BCDBEC = parseFloat(rows[20][columns[0][1].field]);

                                                                                                                        // 封头计算厚度
                                                                                                                        let BCDBTHKCC = BCDBPC * BCDBSDI / (2 * BCDBOCT * BCDBEC);

                                                                                                                        // 设计厚度
                                                                                                                        let BCDBTHKCD = BCDBTHKCC + BCDBCC2;

                                                                                                                        // 所需厚度提示信息
                                                                                                                        south.append(
                                                                                                                            "<span style='color:#444444;'>" +
                                                                                                                            "&ensp;|&ensp;" +
                                                                                                                            "封头所需厚度：" + (BCDBTHKCD + BCDBCC1).toFixed(2) + " mm" +
                                                                                                                            "</span>");

                                                                                                                        // 封头厚度校核
                                                                                                                        let BCDBTHKCCHK;
                                                                                                                        if (BCDBTHKCN >= (BCDBTHKCD + BCDBCC1).toFixed(2)) {
                                                                                                                            south.append(
                                                                                                                                "<span style='color:#444444;'>" +
                                                                                                                                "&ensp;|&ensp;" +
                                                                                                                                "输入厚度：" + BCDBTHKCN + " mm" +
                                                                                                                                "</span>");
                                                                                                                            BCDBTHKCCHK = "合格";
                                                                                                                        } else {
                                                                                                                            south.append(
                                                                                                                                "<span style='color:red;'>" +
                                                                                                                                "&ensp;|&ensp;" +
                                                                                                                                "输入厚度：" + BCDBTHKCN + " mm" +
                                                                                                                                "</span>");
                                                                                                                            BCDBTHKCCHK = "不合格";
                                                                                                                        }

                                                                                                                        // 封头加强板名义厚度
                                                                                                                        if (!jQuery.isEmptyObject(rows[21][columns[0][1].field])
                                                                                                                            && parseFloat(rows[21][columns[0][1].field]) > BCDBCThkMin
                                                                                                                            && parseFloat(rows[21][columns[0][1].field]) <= BCDBCThkMax) {
                                                                                                                            let BCDBTHKCRN = parseFloat(rows[21][columns[0][1].field]);

                                                                                                                            // Sketch
                                                                                                                            if (currentTabIndex === 0) {
                                                                                                                                bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN, BCDBTHKCRN);
                                                                                                                                bcdbd2.off("resize").on("resize", function () {
                                                                                                                                    if ($("#bcdb").length > 0) {
                                                                                                                                        bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN, BCDBTHKCRN);
                                                                                                                                    }
                                                                                                                                });
                                                                                                                            }
                                                                                                                            bcdbd2d3.tabs({
                                                                                                                                onSelect: function (title, index) {
                                                                                                                                    if (index === 0) {
                                                                                                                                        bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN, BCDBTHKCRN);
                                                                                                                                        bcdbd2.off("resize").on("resize", function () {
                                                                                                                                            if ($("#bcdb").length > 0) {
                                                                                                                                                bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN, BCDBTHKCRN);
                                                                                                                                            }
                                                                                                                                        });
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            });

                                                                                                                            // 封头加强段外直径
                                                                                                                            let BCDBCRDO = 2 * (BCDBCRO + BCDBTHKCRN);

                                                                                                                            // 封头加强段性质
                                                                                                                            let BCDBOCRT,
                                                                                                                                BCDBOCR,
                                                                                                                                BCDBRCRREL,
                                                                                                                                BCDBCCR1;
                                                                                                                            $.ajax({
                                                                                                                                type: "POST",
                                                                                                                                contentType: "application/json; charset=utf-8",
                                                                                                                                url: "web_get_nbt_47003_1_2009_com_property.action",
                                                                                                                                async: true,
                                                                                                                                dataType: "json",
                                                                                                                                data: JSON.stringify({
                                                                                                                                    "category": BCDBCCategoryVal,
                                                                                                                                    "type": BCDBCTypeVal,
                                                                                                                                    "std": BCDBCSTDVal,
                                                                                                                                    "name": BCDBCNameVal,
                                                                                                                                    "thk": BCDBTHKCRN,
                                                                                                                                    "temp": BCDBDT,
                                                                                                                                    "highLow": 3,
                                                                                                                                    "isTube": 0,
                                                                                                                                    "od": BCDBCRDO
                                                                                                                                }),
                                                                                                                                beforeSend: function () {
                                                                                                                                },
                                                                                                                                success: function (result) {

                                                                                                                                    BCDBOCRT = parseFloat(result.ot);
                                                                                                                                    if (BCDBOCRT < 0) {
                                                                                                                                        south.html("查询材料设计温度许用应力失败！").css("color", "red");
                                                                                                                                        return false;
                                                                                                                                    }
                                                                                                                                    BCDBOCR = parseFloat(result.o);
                                                                                                                                    if (BCDBOCR < 0) {
                                                                                                                                        south.html("查询材料常温许用应力失败！").css("color", "red");
                                                                                                                                        return false;
                                                                                                                                    }
                                                                                                                                    BCDBRCRREL = parseFloat(result.rel);
                                                                                                                                    if (BCDBRCRREL < 0) {
                                                                                                                                        south.html("查询材料常温屈服强度失败！").css("color", "red");
                                                                                                                                        return false;
                                                                                                                                    }
                                                                                                                                    BCDBCCR1 = parseFloat(result.c1);
                                                                                                                                    if (BCDBCCR1 < 0) {
                                                                                                                                        south.html("查询材料厚度负偏差失败！").css("color", "red");
                                                                                                                                        return false;
                                                                                                                                    }

                                                                                                                                    // 封头加强板厚度附加量
                                                                                                                                    let BCDBCCR = BCDBCCR1;

                                                                                                                                    // 封头加强板有效厚度
                                                                                                                                    let BCDBTHKCRE = BCDBTHKCRN - BCDBCCR;

                                                                                                                                    // t2s
                                                                                                                                    let BCDBT2S = BCDBCRI * BCDBPC;

                                                                                                                                    let BCDBT1 = 0.5 * BCDBCRI * BCDBPC;

                                                                                                                                    let BCDBT2 = 0.5 * BCDBCRI * BCDBPC;

                                                                                                                                    let BCDBWS = 0.6 * Math.sqrt(BCDBCRI * (BCDBTHKSRE + BCDBTHKSE));
                                                                                                                                    south.append(
                                                                                                                                        "<span style='color:#444444;'>" +
                                                                                                                                        "&ensp;|&ensp;" +
                                                                                                                                        "筒体加强板单侧最小宽度：" + BCDBWS.toFixed(4) + " mm" +
                                                                                                                                        "</span>");

                                                                                                                                    // Sketch
                                                                                                                                    if (currentTabIndex === 0) {
                                                                                                                                        bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN, BCDBTHKCRN, ">=" + BCDBWS.toFixed(2));
                                                                                                                                        bcdbd2.off("resize").on("resize", function () {
                                                                                                                                            if ($("#bcdb").length > 0) {
                                                                                                                                                bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN, BCDBTHKCRN, ">=" + BCDBWS.toFixed(2));
                                                                                                                                            }
                                                                                                                                        });
                                                                                                                                    }
                                                                                                                                    bcdbd2d3.tabs({
                                                                                                                                        onSelect: function (title, index) {
                                                                                                                                            if (index === 0) {
                                                                                                                                                bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN, BCDBTHKCRN, ">=" + BCDBWS.toFixed(2));
                                                                                                                                                bcdbd2.off("resize").on("resize", function () {
                                                                                                                                                    if ($("#bcdb").length > 0) {
                                                                                                                                                        bcdb2d("Φ" + BCDBSDI, BCDBTHKSN, BCDBTHKSRN, "SR" + BCDBCRI, BCDBTHKCN, BCDBTHKCRN, ">=" + BCDBWS.toFixed(2));
                                                                                                                                                    }
                                                                                                                                                });
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    });

                                                                                                                                    let BCDBWC = 0.6 * Math.sqrt(BCDBCRI * (BCDBTHKCRE + BCDBTHKCE));
                                                                                                                                    south.append(
                                                                                                                                        "<span style='color:#444444;'>" +
                                                                                                                                        "&ensp;|&ensp;" +
                                                                                                                                        "封头加强板最小宽度：" + BCDBWC.toFixed(4) + " mm" +
                                                                                                                                        "</span>");

                                                                                                                                    let BCDBQ = BCDBT2 * BCDBWC + BCDBT2S * BCDBWS - BCDBT2 * BCDBCRI * Math.sin(BCDBALPHA);

                                                                                                                                    let BCDBA = -1,
                                                                                                                                        BCDBAR = -1,
                                                                                                                                        BCDBARCHK = -1,
                                                                                                                                        BCDBWCSINALPHA = -1,
                                                                                                                                        BCDBRI00752 = -1,
                                                                                                                                        BCDBWCSINALPHACHK = -1;

                                                                                                                                    if (BCDBQ < 0) {

                                                                                                                                        BCDBA = Math.abs(BCDBQ) / BCDBOTCR;
                                                                                                                                        south.append(
                                                                                                                                            "<span style='color:#444444;'>" +
                                                                                                                                            "&ensp;|&ensp;" +
                                                                                                                                            "封头与筒体连接处所需总承压面积：" + BCDBA.toFixed(4) + " mm²" +
                                                                                                                                            "</span>");
                                                                                                                                        BCDBAR = BCDBA - 2 * BCDBWS * (BCDBTHKSRE + BCDBTHKSE) - BCDBWC * (BCDBTHKCRE + BCDBTHKCE);
                                                                                                                                        if (BCDBAR <= 0) {
                                                                                                                                            BCDBARCHK = "合格";
                                                                                                                                            south.append(
                                                                                                                                                "<span style='color:#444444;'>" +
                                                                                                                                                "&ensp;|&ensp;" +
                                                                                                                                                "实际承压面积：" + (2 * BCDBWS * (BCDBTHKSRE + BCDBTHKSE) + BCDBWC * (BCDBTHKCRE + BCDBTHKCE)).toFixed(4) + " mm²" +
                                                                                                                                                "</span>");
                                                                                                                                        } else {
                                                                                                                                            BCDBARCHK = "不合格";
                                                                                                                                            south.append(
                                                                                                                                                "<span style='color:red;'>" +
                                                                                                                                                "&ensp;|&ensp;" +
                                                                                                                                                "实际承压面积：" + (2 * BCDBWS * (BCDBTHKSRE + BCDBTHKSE) + BCDBWC * (BCDBTHKCRE + BCDBTHKCE)).toFixed(4) + " mm²" +
                                                                                                                                                "</span>");
                                                                                                                                        }

                                                                                                                                        BCDBRI00752 = 0.0075 * 2 * BCDBCRI;
                                                                                                                                        south.append(
                                                                                                                                            "<span style='color:#444444;'>" +
                                                                                                                                            "&ensp;|&ensp;" +
                                                                                                                                            "封头与筒体连接处防止失稳所需的加强板最小径向投影长度：" + BCDBRI00752.toFixed(4) + " mm" +
                                                                                                                                            "</span>");

                                                                                                                                        BCDBWCSINALPHA = BCDBWC * Math.sin(BCDBALPHA);
                                                                                                                                        if (BCDBWCSINALPHA >= BCDBRI00752) {
                                                                                                                                            BCDBWCSINALPHACHK = "合格";
                                                                                                                                            south.append(
                                                                                                                                                "<span style='color:#444444;'>" +
                                                                                                                                                "&ensp;|&ensp;" +
                                                                                                                                                "实际径向投影长度：" + BCDBWCSINALPHA.toFixed(4) + " mm" +
                                                                                                                                                "</span>");
                                                                                                                                        } else {
                                                                                                                                            BCDBWCSINALPHACHK = "不合格";
                                                                                                                                            south.append(
                                                                                                                                                "<span style='color:red;'>" +
                                                                                                                                                "&ensp;|&ensp;" +
                                                                                                                                                "实际径向投影长度：" + BCDBWCSINALPHA.toFixed(4) + " mm" +
                                                                                                                                                "</span>");
                                                                                                                                        }

                                                                                                                                    } else {

                                                                                                                                        BCDBA = Math.abs(BCDBQ) / Math.min(BCDBEC * BCDBOCRT, BCDBEC * BCDBOCT, BCDBES * BCDBOSRT, BCDBES * BCDBOST);
                                                                                                                                        south.append(
                                                                                                                                            "<span style='color:#444444;'>" +
                                                                                                                                            "&ensp;|&ensp;" +
                                                                                                                                            "封头与筒体连接处所需总承压面积：" + BCDBA.toFixed(4) + " mm²" +
                                                                                                                                            "</span>");
                                                                                                                                        BCDBAR = BCDBA - 2 * BCDBWS * (BCDBTHKSRE + BCDBTHKSE) - BCDBWC * (BCDBTHKCRE + BCDBTHKCE);
                                                                                                                                        if (BCDBAR <= 0) {
                                                                                                                                            BCDBARCHK = "合格";
                                                                                                                                            south.append(
                                                                                                                                                "<span style='color:#444444;'>" +
                                                                                                                                                "&ensp;|&ensp;" +
                                                                                                                                                "实际承压面积：" + (2 * BCDBWS * (BCDBTHKSRE + BCDBTHKSE) + BCDBWC * (BCDBTHKCRE + BCDBTHKCE)).toFixed(4) + " mm²" +
                                                                                                                                                "</span>");
                                                                                                                                        } else {
                                                                                                                                            BCDBARCHK = "不合格";
                                                                                                                                            south.append(
                                                                                                                                                "<span style='color:red;'>" +
                                                                                                                                                "&ensp;|&ensp;" +
                                                                                                                                                "实际承压面积：" + (2 * BCDBWS * (BCDBTHKSRE + BCDBTHKSE) + BCDBWC * (BCDBTHKCRE + BCDBTHKCE)).toFixed(4) + " mm²" +
                                                                                                                                                "</span>");
                                                                                                                                        }

                                                                                                                                    }

                                                                                                                                    // 试验压力
                                                                                                                                    let BCDBPCT,
                                                                                                                                        BCDBPCRT,
                                                                                                                                        BCDBPST,
                                                                                                                                        BCDBPSRT,
                                                                                                                                        BCDBPT;
                                                                                                                                    if (BCDBTest === "液压试验") {
                                                                                                                                        BCDBPCT = Math.max(1.25 * BCDBPD * BCDBOC / BCDBOCT, 0.05);
                                                                                                                                        BCDBPCRT = Math.max(1.25 * BCDBPD * BCDBOCR / BCDBOCRT, 0.05);
                                                                                                                                        BCDBPST = Math.max(1.25 * BCDBPD * BCDBOS / BCDBOST, 0.05);
                                                                                                                                        BCDBPSRT = Math.max(1.25 * BCDBPD * BCDBOSR / BCDBOSRT, 0.05);
                                                                                                                                        BCDBPT = Math.min(BCDBPCT, BCDBPCRT, BCDBPST, BCDBPSRT);
                                                                                                                                        south.append(
                                                                                                                                            "<span style='color:#444444;'>" +
                                                                                                                                            "&ensp;|&ensp;" +
                                                                                                                                            "压力试验：" + "液压/" + BCDBPT.toFixed(4) + " MPa" +
                                                                                                                                            "</span>");
                                                                                                                                    } else {
                                                                                                                                        BCDBPCT = Math.max(1.10 * BCDBPD * BCDBOC / BCDBOCT, 0.05);
                                                                                                                                        BCDBPCRT = Math.max(1.10 * BCDBPD * BCDBOCR / BCDBOCRT, 0.05);
                                                                                                                                        BCDBPST = Math.max(1.10 * BCDBPD * BCDBOS / BCDBOST, 0.05);
                                                                                                                                        BCDBPSRT = Math.max(1.10 * BCDBPD * BCDBOSR / BCDBOSRT, 0.05);
                                                                                                                                        BCDBPT = Math.min(BCDBPCT, BCDBPCRT, BCDBPST, BCDBPSRT);
                                                                                                                                        south.append(
                                                                                                                                            "<span style='color:#444444;'>" +
                                                                                                                                            "&ensp;|&ensp;" +
                                                                                                                                            "压力试验：" + "气压/" + BCDBPT.toFixed(4) + " MPa" +
                                                                                                                                            "</span>");
                                                                                                                                    }

                                                                                                                                    // docx
                                                                                                                                    let BCDBPayJS = $('#payjs');

                                                                                                                                    function getDocx() {
                                                                                                                                        $.ajax({
                                                                                                                                            type: "POST",
                                                                                                                                            contentType: "application/json; charset=utf-8",
                                                                                                                                            url: "bcdbdocx.action",
                                                                                                                                            async: true,
                                                                                                                                            dataType: "json",
                                                                                                                                            data: JSON.stringify({
                                                                                                                                                ribbonName: "BCDB",

                                                                                                                                                t: BCDBDT,
                                                                                                                                                pd: BCDBPD,
                                                                                                                                                ps: BCDBPS,
                                                                                                                                                sstd: BCDBSSTDVal,
                                                                                                                                                sname: BCDBSNameVal,
                                                                                                                                                di: BCDBSDI,
                                                                                                                                                thksn: BCDBTHKSN,
                                                                                                                                                cs2: BCDBCS2,
                                                                                                                                                es: BCDBES,
                                                                                                                                                thksrn: BCDBTHKSRN,
                                                                                                                                                cstd: BCDBCSTDVal,
                                                                                                                                                cname: BCDBCNameVal,
                                                                                                                                                ri: BCDBCRI,
                                                                                                                                                thkcn: BCDBTHKCN,
                                                                                                                                                cc2: BCDBCC2,
                                                                                                                                                ec: BCDBEC,
                                                                                                                                                thkcrn: BCDBTHKCRN,
                                                                                                                                                test: BCDBTest,
                                                                                                                                                dc: BCDBDC.toFixed(4),
                                                                                                                                                ds: BCDBDS.toFixed(4),
                                                                                                                                                oct: BCDBOCT.toFixed(4),
                                                                                                                                                ost: BCDBOST.toFixed(4),
                                                                                                                                                oc: BCDBOC.toFixed(4),
                                                                                                                                                os: BCDBOS.toFixed(4),
                                                                                                                                                rcrel: BCDBRCREL.toFixed(4),
                                                                                                                                                rsrel: BCDBRSREL.toFixed(4),
                                                                                                                                                cc1: BCDBCC1.toFixed(4),
                                                                                                                                                cs1: BCDBCS1.toFixed(4),
                                                                                                                                                ocrt: BCDBOCRT.toFixed(4),
                                                                                                                                                osrt: BCDBOSRT.toFixed(4),
                                                                                                                                                ocr: BCDBOCR.toFixed(4),
                                                                                                                                                osr: BCDBOSR.toFixed(4),
                                                                                                                                                rcrrel: BCDBRCRREL.toFixed(4),
                                                                                                                                                rsrrel: BCDBRSRREL.toFixed(4),
                                                                                                                                                ccr1: BCDBCCR1.toFixed(4),
                                                                                                                                                csr1: BCDBCSR1.toFixed(4),
                                                                                                                                                pc: BCDBPC.toFixed(4),
                                                                                                                                                cc: BCDBCC.toFixed(4),
                                                                                                                                                thkce: BCDBTHKCE.toFixed(4),
                                                                                                                                                ccr: BCDBCCR.toFixed(4),
                                                                                                                                                thkcre: BCDBTHKCRE.toFixed(4),
                                                                                                                                                cs: BCDBCS.toFixed(4),
                                                                                                                                                thkse: BCDBTHKSE.toFixed(4),
                                                                                                                                                csr: BCDBCSR.toFixed(4),
                                                                                                                                                thksre: BCDBTHKSRE.toFixed(4),
                                                                                                                                                alpha: BCDBDEGREE.toFixed(4),
                                                                                                                                                otcr: BCDBOTCR.toFixed(4),
                                                                                                                                                thkcc: BCDBTHKCC.toFixed(4),
                                                                                                                                                thkcd: BCDBTHKCD.toFixed(4),
                                                                                                                                                thkcchk: BCDBTHKCCHK,
                                                                                                                                                thksc: BCDBTHKSC.toFixed(4),
                                                                                                                                                thksd: BCDBTHKSD.toFixed(4),
                                                                                                                                                thkschk: BCDBTHKSCHK,
                                                                                                                                                t2s: BCDBT2S.toFixed(4),
                                                                                                                                                t1: BCDBT1.toFixed(4),
                                                                                                                                                t2: BCDBT2.toFixed(4),
                                                                                                                                                ws: BCDBWS.toFixed(4),
                                                                                                                                                wc: BCDBWC.toFixed(4),
                                                                                                                                                q: BCDBQ.toFixed(4),
                                                                                                                                                a: BCDBA.toFixed(4),
                                                                                                                                                ar: BCDBAR.toFixed(4),
                                                                                                                                                archk: BCDBARCHK,
                                                                                                                                                wcsinalpha: BCDBWCSINALPHA.toFixed(4),
                                                                                                                                                ri000752: BCDBRI00752.toFixed(4),
                                                                                                                                                wcsinalphachk: BCDBWCSINALPHACHK,
                                                                                                                                                pct: BCDBPCT.toFixed(4),
                                                                                                                                                pcrt: BCDBPCRT.toFixed(4),
                                                                                                                                                pst: BCDBPST.toFixed(4),
                                                                                                                                                psrt: BCDBPSRT.toFixed(4),
                                                                                                                                                pt: BCDBPT.toFixed(4)
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
                                                                                                                                                    let query = null,
                                                                                                                                                        status;
                                                                                                                                                    BCDBPayJS.dialog({
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
                                                                                                                                                                BCDBPayJS.dialog("close");
                                                                                                                                                                BCDBPayJS.dialog("clear");
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
                                                                                                                                                                            BCDBPayJS.dialog('refresh', '/static/payjs/payjs_success.html');

                                                                                                                                                                            // 倒计时计数器
                                                                                                                                                                            let maxTime = 4,
                                                                                                                                                                                timer;

                                                                                                                                                                            function CountDown() {
                                                                                                                                                                                if (maxTime >= 0) {
                                                                                                                                                                                    $("#payjs_timer").html(maxTime);
                                                                                                                                                                                    --maxTime;
                                                                                                                                                                                } else {

                                                                                                                                                                                    clearInterval(timer);
                                                                                                                                                                                    // 关闭并清空收银台
                                                                                                                                                                                    BCDBPayJS.dialog('close');
                                                                                                                                                                                    BCDBPayJS.dialog('clear');
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
                                                                                                                                },
                                                                                                                                error: function () {
                                                                                                                                    south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                                                                                                                        "<span style='color:red;'>&ensp;材料力学特性获取失败，请检查网络后重试</span>");
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }
                                                                                                                        else if (!jQuery.isEmptyObject(rows[21][columns[0][1].field])
                                                                                                                            && parseFloat(rows[21][columns[0][1].field]) <= BCDBCThkMin) {
                                                                                                                            south.html("封头加强板厚度不能小于等于 " + BCDBCThkMin + " mm").css("color", "red");
                                                                                                                        }
                                                                                                                        else if (!jQuery.isEmptyObject(rows[21][columns[0][1].field])
                                                                                                                            && parseFloat(rows[21][columns[0][1].field]) > BCDBCThkMax) {
                                                                                                                            south.html("封头加强板厚度不能大于 " + BCDBCThkMax + " mm").css("color", "red");
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                                else if (!jQuery.isEmptyObject(rows[19][columns[0][1].field])
                                                                                                                    && parseFloat(rows[19][columns[0][1].field]) >= BCDBTHKCN) {
                                                                                                                    south.html("封头腐蚀裕量不能大于等于 " + BCDBTHKCN + " mm").css("color", "red");
                                                                                                                }
                                                                                                            },
                                                                                                            error: function () {
                                                                                                                south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                                                                                                    "<span style='color:red;'>&ensp;材料力学特性获取失败，请检查网络后重试</span>");
                                                                                                            }
                                                                                                        });
                                                                                                    }
                                                                                                    else if (!jQuery.isEmptyObject(rows[18][columns[0][1].field])
                                                                                                        && parseFloat(rows[18][columns[0][1].field]) <= BCDBCThkMin) {
                                                                                                        south.html("封头名义厚度不能小于等于 " + BCDBCThkMin + " mm").css("color", "red");
                                                                                                    }
                                                                                                    else if (!jQuery.isEmptyObject(rows[18][columns[0][1].field])
                                                                                                        && parseFloat(rows[18][columns[0][1].field]) > BCDBCThkMax) {
                                                                                                        south.html("封头名义厚度不能大于 " + BCDBCThkMax + " mm").css("color", "red");
                                                                                                    }
                                                                                                }
                                                                                                else if (!jQuery.isEmptyObject(rows[17][columns[0][1].field])
                                                                                                    && parseFloat(rows[17][columns[0][1].field]) < 0.5 * BCDBSDI) {
                                                                                                    south.html("封头内半径不能小于 " + 0.5 * BCDBSDI + " mm").css("color", "red");
                                                                                                }
                                                                                            },
                                                                                            error: function () {
                                                                                                south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                                                                                    "<span style='color:red;'>&ensp;材料物理性质获取失败，请检查网络后重试</span>");
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                },
                                                                                error: function () {
                                                                                    south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                                                                        "<span style='color:red;'>&ensp;材料力学特性获取失败，请检查网络后重试</span>");
                                                                                }
                                                                            });
                                                                        }
                                                                        else if (!jQuery.isEmptyObject(rows[12][columns[0][1].field])
                                                                            && parseFloat(rows[12][columns[0][1].field]) <= BCDBSThkMin) {
                                                                            south.html("筒体加强板名义厚度不能小于等于 " + BCDBSThkMin + " mm").css("color", "red");
                                                                        }
                                                                        else if (!jQuery.isEmptyObject(rows[12][columns[0][1].field])
                                                                            && parseFloat(rows[12][columns[0][1].field]) > BCDBSThkMax) {
                                                                            south.html("筒体加强板名义厚度不能大于 " + BCDBSThkMax + " mm").css("color", "red");
                                                                        }
                                                                    }
                                                                }
                                                                else if (!jQuery.isEmptyObject(rows[10][columns[0][1].field])
                                                                    && parseFloat(rows[10][columns[0][1].field]) >= BCDBTHKSN) {
                                                                    south.html("筒体腐蚀裕量不能大于等于 " + BCDBTHKSN + " mm").css("color", "red");
                                                                }
                                                            },
                                                            error: function () {
                                                                south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                                                    "<span style='color:red;'>&ensp;材料力学特性获取失败，请检查网络后重试</span>");
                                                            }
                                                        });
                                                    }
                                                    else if (!jQuery.isEmptyObject(rows[9][columns[0][1].field])
                                                        && parseFloat(rows[9][columns[0][1].field]) <= BCDBSThkMin) {
                                                        south.html("筒体名义厚度不能小于等于 " + BCDBSThkMin + " mm").css("color", "red");
                                                    }
                                                    else if (!jQuery.isEmptyObject(rows[9][columns[0][1].field])
                                                        && parseFloat(rows[9][columns[0][1].field]) > BCDBSThkMax) {
                                                        south.html("筒体名义厚度不能大于 " + BCDBSThkMax + " mm").css("color", "red");
                                                    }
                                                }
                                            },
                                            error: function () {
                                                south.html("<i class='fa fa-exclamation-triangle' style='color:red;'></i>" +
                                                    "<span style='color:red;'>&ensp;材料物理性质获取失败，请检查网络后重试</span>");
                                            }
                                        });
                                    }
                                }
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