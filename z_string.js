
import Plugin, { SubProcess } from "./plugin.js";
import clipboard from 'clipboardy';
import fs from 'fs';
import path from "path";
import moment from "moment";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const hash = crypto.createHash('md5');


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

var showMd5 = new SubProcess({
  name: "剪切板 => md5",
  matchReg: /^(m|md|md5)$/g,
  fullReg: /^md5$/g,
  runnable: (args) => {
    // 1. 从剪切板中获取字符串
    var contents = clipboard.readSync();
    // 2. 生成 md5 字符串 1
    return crypto.createHash('md5').update(contents).digest('hex');
  },
  usage: "输入 `show md5` 为剪切板中的内容创建 md5 字符串"
})

export default new Plugin('s', [showClipboardThroughFile, showMd5])

