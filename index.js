var main = require('./main');
massage = {
    'aimCount': 20, //请求次数，既模拟下滑浏览器面相应次数，控制请求的数据量
    'maxConnectNum': 8, //将下载请求分批次进行，其控制每批任务的最大数量
    'downloadDelay': 200, //控制每批任务完成后开始下批任务的延时
    //以上参数的设置偏激可能导致服务器屏蔽导致爬取失败
    'requestUrl': 'https://bcy.net/apiv3/common/getFeeds?refer=channel&direction=loadmore&cid=6618800694038102275&_signature=qWIHIwAAAABFXnwRiqS896liBzAAPf4'
    //页面异步请求的链接
    //https://bcy.net/apiv3/common/getFeeds?refer=channel&direction=loadmore&cid=6618800694038102275&_signature=leS9qwAAAAB52MaZLQ8Cm5XkvbAAMt4
}
main.main(massage);
exports.massage = massage;