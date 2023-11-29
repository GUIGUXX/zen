

class Result {
  constructor(title, result, score) {
    // 运行结果, 传递到 args , 可以复制
    this.result = result ? result : "";
    this.arg = this.result;
    // 结果评分, 影响排序
    this.score = score ? score : 0;
    this.title = title ? title : this.result;
  }
  set_result(result) {
    this.result = result;
    this.arg = result;
  }
  score_incr(increase) {
    this.score += increase;
  }
  switch_show() {
    // 当正确的结果生成成功, 交换变量, 大头显示正确的结果
    [this.title,this.result] = [this.result,this.title];
  }
}

// 子过程
export class SubProcess {

  constructor(paramInRaw) {
    // 匹配的正则表达式, 可运行的表达式, 运行函数, 子过程名称, 子过程用法
    ['matchReg', 'fullReg', 'runnable', 'name', 'usage'].forEach(
      el => {
        this[el] = paramInRaw[el]
      }
    )
  }

  // 匹配并且运行子处理过程
  run_at(param) {
    // 正则匹配
    var runResult = this.usage
    var result = new Result(this.name, runResult, 1);
    result.set_result(runResult);
    if (this.fullReg.test(param)) {
      result.set_result(this.runnable(param));
      result.score_incr(3)
      result.switch_show()
    } else if (this.matchReg.test(param)) {
      result.score_incr(2)
    }
    return result;
  }
}
// 1
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
  run_at(inputString) {
    if (inputString.match(this.nameMatchRegex)) {
      return this.subProcess.map(process => {
        // 场景 1, 前缀 name 匹配, 后缀参数匹配, 匹配的参数直接执行. 
        var pluginParam = inputString.replace(this.replaceRegex, '')
        return process.run_at(pluginParam)
      }
      )
    }
    // 场景 3, 前缀 name 不匹配, 跳过. 
    return [new Result()];
  }
}
