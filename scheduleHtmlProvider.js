function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {                        
    var table = dom.getElementById("manualArrangeCourseTable");
    return table.outerHTML;
}