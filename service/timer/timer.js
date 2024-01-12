import moment from 'moment'
import Plugin, { SubProcess } from '../../plugin.js'

// 1637064748000
var nowTimestamp = new SubProcess({
  name: "当前时间戳(13位)",
  matchReg: /^(n|no|now)?$/g,
  fullReg: /^(n|now)$/g,
  runnable: (match) => {
    let nowString = new moment().valueOf()
    return Promise.resolve([[nowString, null, nowString]])
  },
  usage: "输入`n/no/now` 获得当前的时间戳(13位)"
})
// 2023-11-14 21:30:24
var nowTimeString = new SubProcess({
  name: "当前时间(字符串)",
  matchReg: /^(n|ns)?$/g,
  fullReg: /^ns$/g,
  runnable: (input) => {
    let nowInString = new moment().format('YYYY-MM-DD HH:mm:ss');
    return Promise.resolve([[nowInString, null, nowInString]])
  },
  usage: "输入`ns` 获得当前格式化时间字符串"
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
    let timeString = moment(new Number(match)).format('YYYY-MM-DD HH:mm:ss')
    return Promise.resolve([[timeString, null, timeString]])
  },
  usage: "输入`(\d{10}|\d{10})` 转换时间戳为可读时间"
})
// 2023-11-14 21:25:48 => 1637064748000
var readable2timestamp = new SubProcess({
  name: "可读时间 => 时间戳",
  matchReg: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/g,
  fullReg: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g,
  runnable: function (match) {
    let stampString = moment(match, 'YYYY-MM-DD HH:mm:ss').valueOf()
    return Promise.resolve([[stampString, null, stampString]])
  },
  usage: "输入`2023-11-14 21:25:48` 转换可读时间为时间戳"
})



export default new Plugin("time", [nowTimestamp, nowTimeString, timestamp2readable, readable2timestamp]
  , "时间字符串/时间戳，生成/转换插件")

