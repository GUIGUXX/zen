

// 子过程
export class SubProcess {

  constructor(matchRegex, runnableRegex, runnableFunction) {
    // 匹配的正则表达式
    this.matchRegex = new RegExp(matchRegex);
    // 可运行的正则表达式
    this.runnableRegex = new RegExp(runnableRegex);
    // 正则表达式对应的处理过程
    this.runnableFunction = runnableFunction;
  }

  // 匹配并且运行子处理过程
  match_run(param) {
    // 正则匹配
    if (this.matchRegex.test(param)) {
      var tryRunResult = this.runnableFunction(param);
      return { match: true, result: tryRunResult }
    }
    return { match: false, result: param }
  }
}

// 插件对象
export default class Plugin {
  // 插件对象, 包含插件名称和正则表达式
  constructor(name, subProcess) {
    this.name = name;
    this.nameMatchRegex = new RegExp(`^${name}\\s?.*`);
    this.replaceRegex = new RegExp(`^${name}\\s`);
    this.subProcess = subProcess;
  }

  // 匹配当前输入是否匹配到处理过程
  // 场景 1, 前缀 name 匹配, 后缀参数匹配, 匹配的参数直接执行. 
  // 场景 2, 前缀 name 匹配, 后缀参数不匹配, 排序靠后, 提示正确的入参正则. 
  // 场景 3, 前缀 name 不匹配, 跳过. 
  _p_matches(inputString) {
    var a = this.subProcess.filter(process => {
      if (inputString.match(this.nameMatchRegex)) {
        var pluginParam = inputString.replace(this.replaceRegex, '')
        var match_result = process.match_run(pluginParam)
        // 匹配并且运行
        console.log(match_result)
        return match_result.match
      }
      return {match:false};
    }).length > 0;
    return a;
  }
}
