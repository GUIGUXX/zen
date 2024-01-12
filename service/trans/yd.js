
import Plugin, { SubProcess } from "../../plugin.js";
import alfy from "alfy";
import crypto from 'crypto'
import axios from "axios";


const APP_KEY = '1fc0ec5327958e30'
const APP_SECRET = 'tZC6Xktht5ymQbCVO2OkcOrA8IylRaTU'
const URL = 'https://openapi.youdao.com/api'
// 随机字符串生成器
var YDTrans = new SubProcess({
  name: "有道",
  matchReg: /^.+/g,
  fullReg: /^.+\s$/g,
  runnable: running_function,
  usage: "输入 `yd 中文/English + 空格结尾.` 触发翻译"
})

function is_pure_english(str) {
  return /^(\S+\s?)+$/.test(str);
}

export function running_function(str) {
  const sha256 = crypto.createHash('sha256');
  var salt = (new Date).getTime();
  var current_time = Math.round(new Date().getTime() / 1000);
  var from = 'auto';
  var to = is_pure_english(str) ? 'zh-CHS' : 'en';
  var contents = APP_KEY + truncate(str) + salt + current_time + APP_SECRET;
  var sign = sha256.update(contents).digest('hex')
  var data = { q: str, from, to, appKey: APP_KEY, salt, sign, signType: 'v3', curtime: current_time }
  return do_request(URL, data)
    .then(transData => {
      var pureTrans = transData.translation?.map(tr => {
        return [tr, `【翻】${str}`, tr]
      })
      var pureDicTrans = transData.basic?.explains?.map(ex => {
        let usPh = '【美】' + (transData.basic['us-phonetic'] || "/")
        let ukPh = '【英】' + (transData.basic['uk-phonetic'] || "/")
        return [ex, usPh + ';' + ukPh, ex]
      })
      var webResults = transData.web?.map(webItem => {
        let webValue = webItem.value.join('；');
        let webKey = "【例】" + webItem.key;
        return [webValue, webKey, webValue]
      })
      return [...pureTrans, ...(pureDicTrans || []), ...(webResults || [])].filter(item => item)
    });
}
function truncate(q) {
  var len = q.length;
  if (len <= 20) return q;
  return q.substring(0, 10) + len + q.substring(len - 10, len);
}

function do_request(url, body) {
  return axios.post(url, body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(response => {
    return response.data;
  }).catch(e => {
    console.log(e)
  })
}

export default new Plugin('yd', [YDTrans])
