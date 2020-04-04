var superagent = require('superagent');
var fs = require('fs');
var cheerio = require('cheerio');
var beginTime = new Date();
var download = require('./download');
var eventproxy = require('eventproxy');
var eq = new eventproxy();

var getAim = function (urlArr, dirPath) {
    var aimPath = [];
    var requestUrl = [];
    var id = [];
    var count = 0;
    var errNum = 0;
    urlArr.forEach((ele, ind, arr) => {
        superagent.get("https://bcy.net/item/detail/" + ele + "?_source_page=cos").end((err, res) => {
            if (err) {
                errNum++;
                console.log("无法连接https://bcy.net/!,可能请求被屏蔽！请调整参数。[" + errNum + ']');
            } else {
                const $ = cheerio.load(res.text);
                var all = $('script')[6].children[0].data.slice(39, -251).replace(/\\["]/g, '"').replace(/\\\\/g, '\\');
                var data = JSON.parse(all).detail.post_data.multi;
                for (let j = 0; j < data.length; j++) {
                    if (data[j].type.match("image") != null) {
                        requestUrl[count] = data[j].path;
                        aimPath[count] = ele;
                        id[count] = data[j].mid;
                        count++;
                    }
                    if (j == data.length - 1 && ind == arr.length - 1) {
                        var setTime=500+arr.length*0.05;
                        setTimeout(() => {
                            let doneTime = new Date();
                            console.log("共找到" + count + "张图片,耗时" + (doneTime - beginTime) + "ms");
                            console.log("开始下载…");
                            download.download(requestUrl, id, aimPath, dirPath);
                        }, setTime);
                    }
                }
            }
        })

    })
}
exports.getAim = getAim;