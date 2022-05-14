const fs = require('fs');
const child = require('child_process')
const path = require('path');
const logger = require("./logger");
const tools = {
    // 去除字符串中的空格
    correctFilename: function(str) {
        return str.replace(/^\s*|\s*$/g, '');
    },
    correctArgs: function(str) {
        return str.replace(/^\s*|\s*$/g, '');
    },
}

// 得到所有的路径
function getJsonFiles() {
    let urlName = [];

    function findJsonFile(url) {
        let files = fs.readdirSync(url);
        files.forEach(function (item, index) {
            let fPath = path.join(url, item);
            let stat = fs.statSync(fPath);
            if (stat.isDirectory() === true) {
                findJsonFile(fPath);
            }
            if (stat.isFile() === true) {
                let baseName = path.basename(fPath)
                if (baseName === 'video.m4s') {
                    urlName.push('./' + path.dirname(fPath).replace(/\\/g, '/'))
                }
            }
        });
    }
    findJsonFile(config.assets);
    return urlName
}

// 分析所有输出的路径
function getJsonRes(urlName) {
    let resList = [];

    urlName.forEach(item => {
        let fileinfo = getJsonFilesInfo(item);
        resList.push(fileinfo);
    })
    return resList;
}

// 生成命令行，执行命令行
function FFmegSync(info) {

    if (!fs.existsSync(info.restUrl)) {
        fs.mkdirSync(info.restUrl, { recursive: true });
    }

    function getComm(url) {
        return fs.existsSync(url) ?  ` -i ${url} `: '';
    }
    let audioComm = getComm(`${info.assetUrl}/audio.m4s`);
    let command = `ffmpeg -i ${info.assetUrl}/video.m4s `+audioComm+` -codec copy "${info.restUrl}/${info.restName}"`;
    if(config.resOverwrite)
        command+=' -y ';
    command+=' 2>&1'; // todo：妥协方案。因不知道为啥，ffmpeg部分日志通过stderr输出。而execSync的pipe模式中stderr的输出不进入返回值，因此把stderr重定向至stdout。
    logger.info(command);

    let arr = child.execSync(command, {maxBuffer: 1024*1024*1024,});
    let log = arr.toString();
    if(config.verbose && log) 
        logger.debug(log);
}

// 获取视频的信息
function getJsonFilesInfo(assetUrl) {
    let entryUrl = path.resolve(assetUrl, '../entry.json')
    let rawdata = fs.readFileSync(entryUrl);
    let fileinfo = JSON.parse(rawdata);

    let info = {}
    info.assetUrl = assetUrl;
    let restUrl = config.res;
    switch (config.vedioIdMode) {
        case 'avid':
            restUrl+=('/'+fileinfo['avid']);
            break;
        case 'title':
            restUrl+=('/'+tools.correctFilename(fileinfo['title']));
            break;
        default:
            Error('error config.vedioIdMode \''+config.vedioIdMode+'\'');
            break;
    }
    info.restUrl = restUrl;
    info.restName = tools.correctFilename(fileinfo['page_data']['part'])+'.mp4';

    return info;
}

function init(newconfig) {
    Object.assign(config, newconfig);
    for (let key in config) {
        if (config.hasOwnProperty(key)) {
            let value = config[key];
            if (typeof(value)=='string')
                config[key] = tools.correctArgs(value);
        }
    }

    if(config.verbose) logger.debug(JSON.stringify(config));
}

let config = {
    assets:'./assets',        // 待合并资源位置
    res:'./res',              // 合并后视频位置
    resOverwrite:true,
    vedioIdMode:'avid',       // avid=以avid为目录，title=以title为目录
    verbose: false,
}
init();
module.exports = {
    init,
    FFmegSync,
    getJsonFiles,
    getJsonRes,
}