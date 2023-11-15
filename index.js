import alfy from 'alfy';
import timer from './timer.js'
import ran from "./ran.js"
import z_string from './z_string.js';

const plugins = [
  timer, ran, z_string
]



const runInput = alfy.input;

// 匹配当前的输入能匹配到什么插件方法

var items = plugins.flatMap(plugin => plugin.run_at(runInput))
  .filter(result => result.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(
    item => {
      return {
        title: item.title.length > 50 ? item.title.slice(0, 20) + '...' + item.title.slice(-30) : item.title,
        subtitle: item.result,
        arg: item.arg
      }
    }
  )


if (items) {
  alfy.output(items);
}


