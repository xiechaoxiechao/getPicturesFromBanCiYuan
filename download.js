var request = require('request');
var fs = require('fs');
var eventProxy = require('eventproxy');
var http = require('http');
var stream = require('stream');
var beginTime = new Date();

var download = function (url, id, path, dirPath) {
        var tipsRre = "[--------------------------------------------------]";
        var tips = tipsRre.split('');
        var indexMassage = require('./index');
        var proMre = -1;
        var max = indexMassage.massage.maxConnectNum;

        var doneCount = 0;
        var failCount = 0;
        if (!(url.length == id.length && url.length == path.length)) {
                console.log('未知错误')
        } else {
                function forDownload(start) {
                        var eq = new eventProxy();
                        eq.after('done', max, function () {
                                forDownload(start + max);
                        })
                        var q = 0;
                        for (var i = start; i < url.length; i++) {
                                if (q >= max) {
                                        break;
                                }
                                var name = dirPath + path[i] + '/' + id[i] + '.jpg';
                                const aim = fs.createWriteStream(name);
                                try {
                                        const imgSm = request(url[i]);
                                        imgSm.pipe(aim);

                                } catch (err) {
                                        eq.emit("done");
                                        failCount++;
                                        var percent = Math.floor(((failCount + doneCount) / url.length) * 50);
                                        if (percent != proMre) {
                                                proMre = percent;
                                                tips[proMre+1] = '#';
                                                console.log(tips.toString().replace(/\,/g,''));
                                        }
                                        if (doneCount + failCount == url.length) {
                                                var doneTime = new Date();
                                                console.log('下载完成，成功下载图片' + doneCount + "张，失败" + failCount + "张,耗时" + (doneTime - beginTime) + "ms");
                                        }
                                }
                                aim.on("finish", (src) => {
                                        doneCount++;
                                        var percent = Math.floor(((failCount + doneCount) / url.length) * 50);
                                        if (percent != proMre) {
                                                proMre = percent;
                                                tips[proMre+1] = '#';
                                                console.log(tips.toString().replace(/\,/g,''));
                                        }
                                        setTimeout(() => {
                                                eq.emit("done");
                                        }, 100);

                                        if (doneCount + failCount == url.length) {
                                                var doneTime = new Date();
                                                console.log('下载完成，成功下载图片' + doneCount + "张，失败" + failCount + "张,耗时" + (doneTime - beginTime) + "ms");
                                        }
                                })
                                aim.on('error', (src) => {
                                        failCount++;
                                        var percent = Math.floor(((failCount + doneCount) / url.length) * 50);
                                        if (percent != proMre) {
                                                proMre = percent;
                                                tips[proMre+1] = '#';
                                                console.log(tips.toString().replace(/\,/g,''));
                                        }
                                        if (doneCount + failCount == url.length) {
                                                var doneTime = new Date();
                                                console.log('下载完成，成功下载图片' + doneCount + "张，失败" + failCount + "张,耗时" + (doneTime - beginTime) + "ms");
                                        }
                                        setTimeout(() => {
                                                eq.emit("done");
                                        }, 100);
                                })

                                q++;
                        }
                }
                forDownload(0);
        }
}
exports.download = download;