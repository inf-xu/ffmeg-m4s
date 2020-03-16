const fs = require('fs');
const child = require('child_process')
const path = require('path');

// 得到所有的路径
function getJsonFiles(jsonPath) {
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
    findJsonFile(jsonPath);
    return urlName
}

function FFmeg(limp, name) {
    child.execSync(limp, {maxBuffer: 1024*1024*1024}, function (err) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('成功合并视频:' + name);
        }
    })
}


function makeDir(urlName) {
    let resList = []
    urlName.forEach(item => {
        resList.push(item.replace('assets', 'res').substring(0, 14))
    })
    resList = Array.from(new Set(resList))
    resList.forEach(item => {
        if (!fs.existsSync(item)) {
            fs.mkdirSync(item)
        }
    })
}


module.exports = {
    FFmeg,
    getJsonFiles,
    makeDir,
}