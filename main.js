const ffmeg = require('./ffmeg')
const fs = require('fs');

function main() {
    let config = {
        vedioIdMode: 'title'
    }
    ffmeg.init(config);
    // 待处理资源
    let urlAsset = ffmeg.getJsonFiles();
    // 输出路径
    let urlRes = ffmeg.getJsonRes(urlAsset);
    // 处理
    urlRes.forEach(item => {
        ffmeg.FFmeg(item);
    });
}

function init() {
    main()
    console.log('已合成全部视频');
}

init()