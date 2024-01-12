import alfy from 'alfy';
import timer from './service/timer/timer.js'
import ran from "./service/ran/ran.js"
import z_string from './service/strings/z_string.js';
import tran from './service/trans/yd.js';
import help from './service/help/help.js'
export const plugins = [
  timer,
  ran,
  z_string,
  tran,
  help
]



const runInput = alfy.input;
// 匹配当前的输入能匹配到什么插件方
var resultPromises = plugins.flatMap(plugin => plugin.match_process(runInput))


Promise.all(resultPromises).then(oneProcessPromise => {
  let items = format_results(oneProcessPromise.flatMap(re => re))
  if (items) {
    alfy.output(items);
  }
})

function format_results(results) {
  return results.sort((a, b) => b.score - a.score)
    .filter(item => item?.title ? item.score > 0 : false)
    .map(
      (item) => {
        return {
          title: item.title.length > 50 ? item.title.slice(0, 20) + '...' + item.title.slice(-30) : item.title,
          subtitle: item.subtitle,
          arg: item.arg
        }
      }
    )
}
