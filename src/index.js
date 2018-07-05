#! /usr/bin/env node --no-warnings
// 接受cli参数
// 装配opts
// 调用broswer拿到数据
// 调用分析模块
// 调用output
/**
 * Module dependencies.
 */
// 命令行对象
const Cli = require('../src/cli')
const Outputer = require('../src/output')
// 性能数据生成对象
const Performance = require('../src/performance')
// 统计分析对象
const Analyzer = require('../src/analyzer')
// 统计分析对象
const Util = require('../src/util')
const cli = new Cli()
const performance = new Performance()
const analyzer = new Analyzer()
const outputer = new Outputer()
const util = new Util()


const fs = require('fs')
// 监听命令行
let opts = cli.monitor()
performance.run(opts).then(async statisticData => {
  let data = await analyzer.statistics(statisticData)

  // fs.writeFileSync('chromeReqTime.txt', statisticData.toString())

  // console.log('statisticData: ', statisticData);
  // console.log('data:', data)
  // console.log('global.__hiper__: ', global.__hiper__);
  const {
    message,
    showchart
  } = global.__hiper__.argv
  console.log({
    message
  })
  if (message) {
    util.saveFile(data.total)
  }
  /**
   * 启动服务并保存图片 */
  if (showchart) {
    var spawn = require('child_process').spawn
    const saveScreenshot = require('./output/screenshot.js')

    const cmd = spawn('./node_modules/http-server/bin/http-server', ['-p 8080'])
    cmd.stdout.on('data', function (data) {
      /**
       * 异常直接退出 */
      // console.log('data: ', data);
      // if(!data){
      //   spawn('kill',[ "-9 $(ps aux | grep './node_modules/http-server/bin/http-server' | awk '{print $2}')" ])
      // }
      //   // await outputer.screenShot('http://127.0.0.1:8080/src/output/echart.html',Date.now()+'.png')
      saveScreenshot('http://127.0.0.1:8080/src/output/echart.html', 'echart' + '.png')
      // 停止服务
      // spawn('kill',["-9 $(ps aux | grep './node_modules/http-server/bin/http-server' | awk '{print $2}')" ])
      // process.exit(0)
      // throw Error()
      // cmd.stderr.on('data', (data) => {
      //   // console.log(`stderr: ${data}`);
      //   spawn('kill',['-9', './kill.sh'])
      // });
    })
    cmd.stderr.on('data', (data) => {
      // console.log(`stderr: ${data}`);
      spawn('kill', ['-9', './kill.sh'])
    })
  }
  outputer.output(data)
})

// console.log(JSON.stringify(opts))
