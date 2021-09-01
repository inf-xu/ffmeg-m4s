const ffmeg = require('./ffmeg')
const fs = require('fs');


function main() {
    let urlName = ffmeg.getJsonFiles('./assets')
    // 创建目录
    ffmeg.makeDir(urlName)
    urlName.forEach(item => {
        let filename = ffmeg.getName(item)
        filename = item.replace('assets', 'res').substring(0, 15) + '/' + filename
        filename = filename.replace(/\s*/g,"");
        if (!fs.existsSync(filename)) {
            let url = `FFmpeg -i ${item}/video.m4s -i ${item}/audio.m4s -codec copy ${filename}.mp4`
            ffmeg.FFmeg(url, item)
        }
    })
}



function init() {
    console.log('合成后的视频统一在 res 目录下,以视频id为目录.');
    main()
    console.log('已合成全部视频');
}

init()