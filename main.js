const ffmeg = require('./ffmeg');
const program = require('commander');
const logger = require("./logger");

function main() {
    program
    .version('0.0.1', '-v')
    //.command('')
    .description('合并b站离线下载m4s格式视频')
    .option('-h, --help', 'print this')
    .option('-V, --verbose', 'verbose')
    .option('-a, --assets <url>', '待合并资源位置', 'assets')
    .option('-r, --result <url>', '合并后结果位置', 'res')
    .option('-b, --base-result-mode <mode>', '合并后一级目录名模式. e.g:title,avid', 'title')
    .parse(process.argv);

    const options = program.opts();
    if(options.help) {
        console.info(program.helpInformation());
    } else {
        let config = {}
        if(options.verbose) config.verbose = options.verbose;
        if(options.assets) config.assets = options.assets;
        if(options.result) config.res = options.result;
        if(options.baseResultMode) config.vedioIdMode = options.baseResultMode;
        logger.info('初始化配置');
        ffmeg.init(config);

        logger.info('开始合并');
        // 待处理资源
        let urlAsset = ffmeg.getJsonFiles();
        // 输出路径
        let urlRes = ffmeg.getJsonRes(urlAsset);
        // 处理
        let ok=0,fail=0;
        urlRes.forEach(item => {
            try {
                ffmeg.FFmegSync(item);
                ok++;
                logger.info('ok');
            } catch(e) {
                fail++;
                logger.error(e.stack);
            }
        });

        logger.info(`done! (ok=${ok},fail=${fail})`);
    }
}

main();