import moment from 'moment'
import Plugin from './plugin'

// 将 13 位时间戳转换为时间字符串
function timestamp2formatString(timeCommand) {
  return moment(Number(timeCommand)).format('YYYY-MM-DD HH:mm:ss'); 
}


// 模式选择器
function timeModeRunner(timeCommand) { 
  if (!timeCommand) {
    return new moment().valueOf()
  }
  if (typeof timeCommand === 'number') {
    return timestamp2formatString(command);
  }
}



export default new Plugin("t",)

