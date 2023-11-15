import moment from 'moment'
import Plugin, { SubProcess } from './plugin.js'

// 1637064748000
var nowTimestamp = new SubProcess({
  name: "当前时间戳(13位)",
  matchReg: /^(n|no|now)?$/g,
  fullReg: /^(n|now)$/g,
  runnable: (match) => {
    return new moment().valueOf()
  },
  usage: "输入`t n/now` 获得当前的时间戳(13位)"
})
// 2023-11-14 21:30:24
var nowTimeString = new SubProcess({
  name: "当前时间(字符串)",
  matchReg: /^(n|ns)?$/g,
  fullReg: /^ns$/g,
  runnable: (input) => {
    return new moment().format('YYYY-MM-DD HH:mm:ss');
  },
  usage: "输入`t ns` 获得当前格式化时间字符串"
})
// 1637064748000 => 2021-11-29 16:42:28
var timestamp2readable = new SubProcess({
  name: "时间戳 => 可读时间",
  matchReg: /^\d+$/g,
  fullReg: /^(\d{10}|\d{13})$/g,
  runnable: (match) => {
    if (match.length == 10) {
      match = match + '000';
    }
    return moment(new Number(match)).format('YYYY-MM-DD HH:mm:ss');
  },
  usage: "输入`t (\d{10}|\d{10})` 转换时间戳为可读时间"
})
// 2023-11-14 21:25:48 => 1637064748000
var readable2timestamp = new SubProcess({
  name: "可读时间 => 时间戳",
  matchReg: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/g,
  fullReg: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g,
  runnable: function (match) {
    return moment(match, 'YYYY-MM-DD HH:mm:ss').valueOf();
  },
  usage: "输入`t 2023-11-14 21:25:48` 转换可读时间为时间戳"
})

var quickTimeString = new SubProcess({
  name: "快速生成时间字符串",
  matchReg: /^(\d{1,2}[YyMmDdHhIiSs]:)?(\d{1,2}[YyMmDdHhIiSs])$/g,
  fullReg: /^(\d{1,2}[YyMmDdHhIiSs]:)?(\d{1,2}[YyMmDdHhIiSs])$/g,
  runnable: function (match) {
    // 计算时间范围的字符串
    return match
  },
  usage: "输入`t 10s` 转换为10秒后的时间字符串"
})


export default new Plugin("t", [nowTimestamp, nowTimeString, timestamp2readable, readable2timestamp, quickTimeString])

