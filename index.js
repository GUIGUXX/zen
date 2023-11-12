import alfy from 'alfy';
import timer from './time.js'
import Plugin from './plugin.js'




const plugins = [
  new Plugin('t', ['now']),
  new Plugin('sae', ['ip']),
  new Plugin('ran', ['\\d{,2}'])
]

const runInput = alfy.input;

// 匹配当前的输入能匹配到什么插件方法



var items = alfy.matches(runInput, plugins, (pl, input) => {
  return pl._p_matches(input)
}).map(it => {
  if (it) {
    return {
      title: it.name,
      subtitle: it.subCommand ? it.subCommand.join(", ") : "",
      arg: it.name
    }
  }
})
if (items) {
  alfy.output(items);
}


