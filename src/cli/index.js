const program = require('commander')
const pjson = require('../../package.json')
const path = require('path')
const fs = require('fs')
const Util = require('../util')

const {
  _args,
  version,
  description
} = pjson

module.exports = class Cli {
  parseJSONFile(filePath) {
    filePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath)
    let data = null
    try {
      data = JSON.parse(fs.readFileSync(filePath).toString())
      if (data) {
        let {
          noCache,
          noJavascript,
          noOnline
        } = data
        data.cache = !noCache
        data.javascript = !noJavascript
        data.online = !noOnline
        delete data.noCache
        delete data.noJavascript
        delete data.noOnline
      }
    } catch (error) {

    }
    return data
  }

  headless(b) {
    if (b === 'true') b = true
    if (b === 'false') b = false
    return b
  }

  monitor() {
    let url = null
    program
      .version(version, '-v, --version')
      .usage('[options] [url]')
      .description(description)
      .arguments('<url>')
      // 行参
      .action(u => url = u) // eslint-disable-line
      .option('-n, --count <n>', '指定加载次数（default: 20）', parseInt)
      .option('-c, --config <path>', '载入配置文件', this.parseJSONFile)
      .option('-m, --message <description>', '添加描述信息')
      .option('-u, --useragent <ua>', '设置useragent')
      .option('-e, --executablePath <path>', '使用指定的chrome浏览器')
      .option('-a, --optionArgs <string>', '设置 args 数组,配置忽略 https 无认证（default: "" ）')
      // 判断
      .option('-H, --headless [b]', '是否使用无头模式（default: true）', this.headless)
      .option('-s, --showchart [b]', '是否保存 chart 图 （default: false）', this.headless)
      .option('--no-cache', '禁用缓存（default: false）')
      .option('--no-javascript', '禁用javascript（default: false）')
      .option('--no-online', '离线模式（defalut: false）')
      .parse(process.argv)

    let {
      executablePath,
      count,
      message, // 新添信息
      showchart, // 保存成图表
      optionArgs, // 新添的 可以添加 optionArgs 参数
      headless,
      useragent,
      cache,
      javascript,
      online,
      config
    } = program
    // console.log('count:',count)
    // console.log('optionArgs:',optionArgs)
    // console.log('optionArgs:',optionArgs,typeof optionArgs)
    // console.log('headless:',headless)
    if (!global.__hiper__) global.__hiper__ = {}
    if (!config) config = {}

    url = Util.urlNormalize(url || config.url)

    // 给cli参数赋予默认值
    let myOpts = {
      url: url,
      count: _args.count,
      headless: _args.headless,
      cache: !_args.noCache,
      javascript: !_args.noJavascript,
      online: !_args.noOnline,
      useragent: config.useragent,
      executablePath: config.executablePath,
      cookies: config.cookies && !Array.isArray(config.cookies) && [config.cookies] || null,
      viewport: config.viewport ? {
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false,
        ...config.viewport
      } : null,
      ...program,
      optionArgs:optionArgs?optionArgs:''

    }

    // global.__hiper__ = myOpts
    global.__hiper__.config = myOpts
    global.__hiper__.argv = program
    // console.log('global.__hiper__.argv: ', global.__hiper__.argv);

    return myOpts
    /**
     * global 配置 概览
     *
     globle.__hiper__ = {
       config,
       argv,
       runInterval,
     }
     */
  }
}
