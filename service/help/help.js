import Plugin, { SubProcess } from "../../plugin.js";
import { plugins } from "../../index.js"
// 随机字符串生成器
var help = new SubProcess({
  name: "展示所有的可用方法",
  matchReg: /^.+$/g,
  fullReg: /^.+$/g,
  usage: "输入 `help` 获得所有的插件",
  runnable: function (str) {
    let allPluginUsages = plugins.map(plu => {
      return [plu.name, plu.desc || plu.name, plu.name]
    })
    return Promise.resolve(allPluginUsages)
  }
})

export default new Plugin("help", [help], "获取帮助信息")




