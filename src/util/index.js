const fs = require('fs')
const path = require('path')

class Util {
  /**
   * @param {Number} ms
   * 把毫秒数转化为人类可读的字符串
   */
  static formatMSToHumanReadable (ms, readable = true) {
    let ret = `${(ms).toFixed(2)} ms`
    if (!readable) return ret
    const ONE_SECOND = 1000
    const ONE_MINUTE = 60 * ONE_SECOND
    const ONE_HORE = 60 * ONE_MINUTE
    // 小于1秒，那么用毫秒为单位
    if (ms >= ONE_SECOND && ms < ONE_MINUTE) {
      // 大于一秒小于一分钟，用秒作为单位
      ret = `${(ms / 1000).toFixed(2)} s`
    } else if (ms >= ONE_MINUTE && ms < ONE_HORE) {
      // 大于一分钟，小于一小时，用分钟作单位
      ret = `${(ms / 1000 / 60).toFixed(2)} m`
    } else if (ms >= ONE_HORE) {
      // 大于一个小时，用小时作单位
      ret = `${(ms / 1000 / 60 / 60).toFixed(2)} h`
    }
    return ret
  }

  static urlNormalize (url) {
    if (!url) return ''
    if (url.startsWith('//')) {
      return `http:${url}`
    }
    if (!/^https?:\/\//.test(url)) {
      return `http://${url}`
    }
    return url
  }
  /**
   * 返回时间格式化
   * @function
   * @param {string} format 格式内容
   * @param {timestamp} timestamp 时间戳 或 字符串
   * 示例：
   * var ut = new Utile()
   * var ut.formatTime("YYYY-MM-DD HH-mm-ss") // 传入时间格式字符
   * ut(Date.now()) // 传入日期字符
   */
  formatTime (format = 'YYYY-MM-DD') {
    const moment = require('moment')
    /**
     * todo 添加额外默认参数 */
    return function (timestamp) {
      return moment(timestamp || Date.now()).format(format)
    }
  }
  /**
   * @param {string} str http://www.baidu.com
   * @returns ["http://www.baidu.com", undefined, "www.", "baidu", "com", index: 0, input: "http://www.baidu.com", groups: undefined]
   * @memberof Util
   */
  regDomain (website) {
    const regular = /^http(s)?:\/\/(\w*\.|^\s)*(.*?)\.(com|w*)/gm
    return regular.exec(website)
  }
  /**
   * 使用柯里化的 compose 合并事件 */
  /**
   * 保存到文件
   * @param {*} data 输出信息
   * @param {*} commit 提交信息，方便区分
   * @param {*} filename 日期文件名(可省) '2018-06-05'
   */
  saveFile (data, filename) {
    if (!data || JSON.stringify(data) === '{}') return
    let initTime = Date.now()
    if (!filename) {
      filename = this.formatTime('YYYY-MM-DD')(initTime) + '.json'
    }
    filename = path.isAbsolute(filename) ? filename : path.join(process.cwd(), filename)
    // todo 判断文件是否存在，存在追加，否则新建内容
    const exist = fs.existsSync(filename)
    let fromFileData = []
    // 为数据新添两个字段
    // data['description'] = message
    // data['createTime'] = this.formatTime('YYYY-MM-DD HH:mm:ss')(initTime)
    const {
      config,
      argv
    } = global.__hiper__
    const {
      url
    } = config
    const {
      message
    } = argv
    data['description'] = {
      createTime: this.formatTime('YYYY-MM-DD HH:mm:ss')(initTime),
      message,
      url
    }
    if (exist) {
      let _fromFileData = fs.readFileSync(filename, 'utf8')
      fromFileData = JSON.parse(_fromFileData)
      if (fromFileData && Array.isArray(fromFileData)) {
        fromFileData.push(data)
      } else {
        fromFileData = data
      }
    } else {
      fromFileData.push(data)
    }

    fs.writeFileSync(filename, JSON.stringify(fromFileData))
  }
}

// const ut = new Util()
// const u = ut.formatTime("YYYY-MM-DD HH-mm-ss")
// console.log(u('2017-10'));
// ut.saveFile({a:1},'hehe')
module.exports = Util
