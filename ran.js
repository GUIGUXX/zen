import Plugin, { SubProcess } from "./plugin.js";

// 随机字符串生成器
var ranString = new SubProcess({
  name: "随机字符串",
  matchReg: /^\d+$/g,
  fullReg: /^\d+$/g,
  runnable: function (str) {
    const chars = '0123456789!@#$%^&*_-abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < Number(str); i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result; 
  },
  usage: "输入 `r 12` 生成 12 位长度的随机字符串, 数字范围 1~32"
})



export default new Plugin("r", [ranString])




