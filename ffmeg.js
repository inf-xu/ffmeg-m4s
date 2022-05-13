const fs = require('fs');
const child = require('child_process')
const path = require('path');

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

function FFmeg(info) {

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
    console.log(command);
    child.execSync(command, {maxBuffer: 1024*1024*1024}, function (err) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('ok');
        }
    })
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
            restUrl+=('/'+correctFilename(fileinfo['title']));
            break;
        default:
            Error('error config.vedioIdMode \''+config.vedioIdMode+'\'');
            break;
    }
    info.restUrl = restUrl;
    info.restName = correctFilename(fileinfo['page_data']['part'])+'.mp4';

    return info;
}

// 去除字符串中的空格
function correctFilename(str) {
    str = str.replace(/^\s*|\s*$/g, '');
    // if(str.indexOf(' ') >= 0) 
    //     str = '\''+str+'\'';
    return str;
}

function init(newconfig) {
    Object.assign(config, newconfig);
}

let config = {
    assets:'./assets',        // 待合并资源位置
    res:'./res',              // 合并后视频位置
    resOverwrite:true,
    vedioIdMode:'avid'       // avid=以avid为目录，title=以title为目录
}

module.exports = {
    init,
    FFmeg,
    getJsonFiles,
    getJsonRes,
}