var request = require('request');
var fs = require('fs');
var request = request.defaults({
    jar: true
});
var pageCount = 0;
var count = 0;
var pageArr = [];
var beginTime = new Date();
var getAim = require('./getAim');
var percentMry=-1;


var main = function (massage) {
    var tips='[--------------------------------------------------]';
    var tipArr=tips.split('');
    
    var aimCount = massage.aimCount;
    var requestUrl = massage.requestUrl;
    console.log('开始获取页面索引…');
    request('https://bcy.net', function () {
        var begin = function () {
            request({
                url: requestUrl,
                method: 'GET',
                headers: {
                    "content-type": 'application/json',
                },
                'sec-fetch-mode': 'illust'
            }, function (err, response, body) {
                var all = JSON.stringify(response.headers);
                let root = JSON.parse(body).data.item_info;
                for (var i = 0; i < root.length; i++) {
                    var main = root[i].item_detail; //主要信息节点
                    // var goodNum=main.like_count;//点赞数
                    pageArr[pageCount] = main.item_id;
                    pageCount++;
                    if(i==root.length-1){
                        var percent=Math.floor(((count+1)/aimCount)*50);
                        if(percent!=percentMry){
                            percentMry=percent;
                            for(var n=0;n<percentMry;n++){
                            tipArr[n+1]="#";}
                            console.log(tipArr.toString().replace(/\,/g,''));
                        }
                    }
                }
                count++;
                if (count < aimCount) {
                    begin();
                } else {
                    var doneTime = new Date();
                    console.log('共请求' + (aimCount) + '次，获取了' + pageCount + '个页面索引,共耗时' + (doneTime - beginTime) + 'ms.');
                    console.log('开始创建文件夹…');
                    createDir(pageArr);
                }


            })
        }
        begin();
    });


    function createDir(arr) {
        var nameArr = beginTime.toString().split('');
        var downloadDir = './download' + nameArr[11] + nameArr[12] + nameArr[13] + nameArr[14] + nameArr[16] + nameArr[17] + nameArr[19] + nameArr[20] + nameArr[22] + nameArr[23] + '/';
        fs.mkdir(downloadDir, (err) => {
            if (!err) {
                console.log(downloadDir + '创建完成！');
                console.log("开始创建分目录…");
                var doneCount = 0;
                for (let i = 0; i < arr.length; i++) {
                    fs.mkdir(downloadDir + arr[i].toString() + '/', (err) => {
                        if (err) {
                            console.log("创建分文件件" + arr[i].toString() + '失败！');
                        } else {
                            doneCount++;
                            if (doneCount == arr.length) {
                                console.log('分目录创建完成！');
                                console.log('开始解析页面资源…');
                                getAim.getAim(arr, downloadDir);
                            }
                        }

                    });
                }
            } else {
                console.log('文件夹创建失败！')
            }
        }); //创建与当前时间有关的文件夹

    }
}
exports.main = main;