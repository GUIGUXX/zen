

export class Result {
  constructor(title, subtitle, arg) {
    this.title = title
    this.score = 1;
    this.subtitle = subtitle ? subtitle : this.result;
    this.arg = arg ? arg : this.title
  }
  score_incr(increase) {
    this.score += increase;
  }
}

// 子过程
export class SubProcess {

  constructor(paramInRaw) {
    // 匹配的正则表达式, 可运行的表达式, 运行函数, 子过程名称, 子过程用法
    ['matchReg', 'fullReg', 'runnable', 'name', 'usage',
      'runningParam'].forEach(
        el => {
          this[el] = paramInRaw[el]
        }
      )
  }
  set_running_param(param) {
    this.default_usage()
    this.runningParam = param;
  }
  default_usage() {
    this.result = new Result(this.name, this.usage, null);
    this.result.score_incr(1);
    return this.result;
  }
  // 匹配并且运行子处理过程
  run() {
    // 正则匹配
    if (this.fullReg.test(this.runningParam)) {
      return this.runnable(this.runningParam).then(pureResults => {
        let allResults = pureResults?.map(pr => {
          let result = new Result(...pr)
          result.subtitle = result.subtitle || this.name || this.usage
          result.score_incr(3)
          return result;
        })
        return allResults
      })
    } else if (this.matchReg.test(this.runningParam)) {
      return new Promise(resolve => {
        this.result.score_incr(2);
        resolve([this.result]);
      })
    }
    return Promise.resolve([this.result]);
  }
}

// 插件对象
export default class Plugin {
  // 插件对象, 包含插件名称和正则表达式
  constructor(name, subProcess, desc) {
    this.name = name;
    this.desc = desc;
    this.nameMatchRegex = new RegExp(`^${name}\\s?.*`);
    this.replaceRegex = new RegExp(`^${name}\\s`);
    this.subProcess = subProcess;
  }

  // 匹配当前输入是否匹配到处理过程
  match_process(inputString) {
    if (inputString.match(this.nameMatchRegex)) {
      return this.subProcess.map(process => {
        // 场景 1, 前缀 name 匹配, 后缀参数匹配, 匹配的参数直接执行. 
        var pluginParam = inputString.replace(this.replaceRegex, '')
        process.set_running_param(pluginParam)
        return process.run();
      })
    }
    let reverseReg = new RegExp(`^${inputString}.+`)
    if (this.name.match(reverseReg)) {
      return [Promise.resolve([new Result(this.name, this.desc || this.name, null)])]
    }
  }
}
