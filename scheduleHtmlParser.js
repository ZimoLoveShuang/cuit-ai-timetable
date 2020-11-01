function scheduleHtmlParser(html) {
    String.prototype.replaceAll = function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2);
    }

    // 每节课时间
    var sectionTimes = [
        {
            "section": 1,
            "startTime": "08:20",
            "endTime": "09:05"
        },
        {
            "section": 2,
            "startTime": "09:15",
            "endTime": "10:00"
        },
        {
            "section": 3,
            "startTime": "10:20",
            "endTime": "11:05"
        },
        {
            "section": 4,
            "startTime": "11:15",
            "endTime": "12:00"
        },
        {
            "section": 5,
            "startTime": "14:00",
            "endTime": "14:45"
        },
        {
            "section": 6,
            "startTime": "14:55",
            "endTime": "15:40"
        },
        {
            "section": 7,
            "startTime": "16:00",
            "endTime": "16:45"
        },
        {
            "section": 8,
            "startTime": "16:55",
            "endTime": "17:40"
        },
        {
            "section": 9,
            "startTime": "18:40",
            "endTime": "19:25"
        },
        {
            "section": 10,
            "startTime": "19:35",
            "endTime": "20:20"
        },
        {
            "section": 11,
            "startTime": "20:30",
            "endTime": "21:15"
        }
    ];

    // 保存结果
    var result = [];

    var table = $('table');

    // 遍历表格
    // i代表行，也就是第几节课，j代表列，也就是周几
    table.find('tr').each(function (i,tr) {
        $(this).find('td').each(function (j,td) {
            if (i != 0 && j != 0) {
                var info = unescape($(this).html().replace(/&#x/g, '%u').replace(/;/g, ''));
                if (info.length > 0) {
                    // console.log("周"+j+"第"+i+"节 "+info);
                    var sp = info.split('<br>');
                    var nsp = [];
                    // 去掉sp中的空字符串，放到nsp数组中
                    for (var k = 0; k < sp.length; k++) {
                        if (sp[k] != '') {
                            nsp.push(sp[k].replaceAll('</br>', '').trim());
                        }
                    }

                    // 保存course信息
                    var course = {};
                    course['day'] = j;
                    var sections = [];
                    sections.push(sectionTimes[i - 1]);
                    sections.push(sectionTimes[i]);
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
                                sections = [];
                                sections.push(sectionTimes[i - 1]);
                                sections.push(sectionTimes[i]);
                                course['sections'] = sections;
                                break;
                        }
                    }
                }
            }
        });
    });
    
    return {
        courseInfos: result,
        sectionTimes: sectionTimes
    };
}