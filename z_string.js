
import Plugin, { SubProcess } from "./plugin.js";
import clipboard from 'clipboardy';
import fs from 'fs';
import path from "path";
import moment from "moment";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 从剪切板中加载字符串进行处理, Json 化, 压缩, 分割

// 通过文件展现剪切板中的字符串
var showClipboardThroughFile = new SubProcess({

  name: "剪切板 => 临时文件 (打开文件)",
  matchReg: /^(2|2f)?$/g,
  fullReg: /^(2f)$/g,
  runnable: (args) => {
    // 1. 从剪切板中获取字符串
    var contents = clipboard.readSync();
    // 2. 创建临时文件,
    // 生成临时文件名  
    var expireTimestamp = new moment().add(1, "days").unix()
    const tmpFilePath = path.join(__dirname, "/temps/" + expireTimestamp + '.txt');
    // 写入文件内容  

    fs.writeFile(tmpFilePath, contents, (err) => {
      return err;
    });
    return "@ " + tmpFilePath;
  },
  usage: "输入 `show 2f` 将剪切板中的内容复制到临时文件"
})

export default new Plugin('show', [showClipboardThroughFile])

