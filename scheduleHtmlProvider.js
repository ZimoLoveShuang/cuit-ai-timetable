function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {                        
    var table = dom.getElementsByClassName("indexpanel")[0];
    return table.outerHTML;
}