const ffmeg = require('./ffmeg');
const fs = require('fs');
const logger = require("./logger");
  
function main() {
    let config = {
        logger: logger,
        vedioIdMode: 'title'
    }
    ffmeg.init(config);
    // 待处理资源
    let urlAsset = ffmeg.getJsonFiles();
    // 输出路径
    let urlRes = ffmeg.getJsonRes(urlAsset);
    // 处理
    urlRes.forEach(item => {
        try {
            let log = ffmeg.FFmeg(item);
            if(log) logger.debug(log);
        } catch(e) {
            logger.error(e.message);
        }
    });
}

function init() {
    logger.info('初始化');
    main();
    logger.info('已合成全部视频');
}

init();