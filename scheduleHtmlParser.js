// 字符串转Table
function strParseTable(arg) {
    var objE = document.createElement("table");
    objE.innerHTML = arg;
    return objE;
}

function scheduleHtmlParser(html) {
    // 每节课开始时间
    var times = {
        '1': '8:20',
        '2': '9:15',
        '3': '10:20',
        '4': '11:15',
        '5': '14:00',
        '6': '14:55',
        '8': '16:55',
        '9': '19:30',
        '10': '20:25'
    };

    // 保存结果
    var result = [];

    // 将字符串的表格转换为table对象
    var table = strParseTable(html);

    // 遍历表格
    // i代表行，也就是第几节课，j代表列，也就是周几
    for (var i = 0, rows = table.rows.length; i < rows; i++) {
        for (var j = 0, cells = table.rows[i].cells.length; j < cells; j++) {
            // 跳过表头
            if (i == 0 || j == 0) {
                continue;
            }

            // 两节小课一组，然后好像没有第11节课，先这样写，后期有了在优化
            if (table.rows[i].cells[j].rowSpan != 1) {
                var sp = table.rows[i].cells[j].innerHTML.split('<br>');
                var nsp = [];
                // 去掉sp中的空字符串，放到nsp数组中
                for (var k = 0; k < sp.length; k++) {
                    if (sp[k] != '') {
                        nsp.push(sp[k].trim());
                    }
                }

                // 保存course信息
                var course = {};
                course['day'] = j;
                var sections = [{'section': i, "startTime": times[i + ""], "endTime": ""}, {
                    'section': i + 1,
                    "startTime": times[(i + 1) + ""],
                    "endTime": ""
                }];
                course['sections'] = sections;

                for (var k = 0; k < nsp.length; k++) {
                    var value = nsp[k];
                    switch ((k + 1) % 4) {
                        case 1:
                            course['name'] = value;
                            break;
                        case 2:
                            course['teacher'] = value.substring('教师：'.length);
                            break;
                        case 3:
                            var weekStr = value;
                            weekStr = weekStr.substring("周次：".length, weekStr.length - "周".length);
                            var weekStrSp = weekStr.split("-");
                            var startWeek = parseInt(weekStrSp[0]);
                            var endWeek = parseInt(weekStrSp[1]);
                            var weeks = [];
                            for (var w = startWeek; w <= endWeek; w++) {
                                weeks.push(w);
                            }
                            course['weeks'] = weeks;
                            break;
                        case 0:
                            course['position'] = value.substring('教室：'.length);
                            result.push(course);
                            course = {};
                            course['day'] = j;
                            sections = [{
                                'section': i,
                                "startTime": times[i + ""],
                                "endTime": ""
                            }, {'section': i + 1, "startTime": times[(i + 1) + ""], "endTime": ""}]
                            course['sections'] = sections;
                            break;
                    }
                }
            }
        }
    }
    return {courseInfos: result}
}