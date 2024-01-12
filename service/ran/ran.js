import Plugin, { SubProcess } from "../../plugin.js";

// 随机字符串生成器
var ranString = new SubProcess({
  name: "随机字符串",
  matchReg: /^\d+$/g,
  fullReg: /^\d+$/g,
  usage: "输入 `12` 生成 12 位长度的随机字符串,默认长度:16",
  runnable: function (str) {
    str = str || '16'
    const chars = '0123456789!@#$%^&*_-abcdefghijklmnopqr!@#$%^&*0123456789_-lmnostuvwxyzABCDEFGHIabcdefghijklmnostuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*_-abcdefghijk';
    let result = '';
    for (let i = 0; i < Number(str); i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return Promise.resolve([[result, '字符长度:' + str, result]])
  }
})


export default new Plugin("ran", [ranString],"随机插件,可生成随机密码，随机数字等")




