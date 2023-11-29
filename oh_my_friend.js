// 调用文言一心接口，进行翻译
import alfy from "alfy";
import Plugin, { SubProcess } from "./plugin.js";

// 1. 获取 accesskey, 保存在当前文件夹的 app.config 文件

var client_id = ""
var client_secret = ""
var stored_access_token = await get_oh_access_token()


function do_request(url, body) {
  return alfy.fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    transform: responseBody => {
      return responseBody;
    },
    body
  })
}



export async function start_one_chat(trans_words, yield_call) {
  // trans_words 的长度不能超过 200
  if (trans_words.length > 200) {
    return '翻译内容过长，请重新输入'
  }
  var start_one_chat_url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${stored_access_token}`
  var trans_prompt = `请对:${trans_words} 进行中英互译并显示英文示例.要求:1.永远只用JSON文本回答,JSON 的 KEY 为en,zh,enUsage,attention,note,scene;2.语法错误放入attention字段,选填;3.注意事项放入note字段,选填;4.scene字段为1代表中译英,反之为0;`
  var responseBody = await do_request(start_one_chat_url, JSON.stringify({
    "messages": [
      {
        "role": "user",
        "content": trans_prompt
      }
    ]
  }))
  if (responseBody.error_code == 110 && !yield_call) {
    get_oh_access_token(true)
    console.log('TOKEN 无效或者过期，重新获取 token')
    // 再尝试调用一次
    var final_result = await start_one_chat(trans_words, true)
    return final_result ? final_result : 'TOKEN 无效或者过期，重新获取 token'
  }
  return responseBody.result
}

// 获取AccessToken
export async function get_oh_access_token(flush) {
  var stored_access_token = alfy.cache.get("Oh_My_Access_Token");
  if (stored_access_token && !flush) {
    return stored_access_token;
  } else {
    var access_token_url = `https://aip.baidubce.com/oauth/2.0/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`;
    var responseBody = await do_request(access_token_url);
    alfy.cache.set("Oh_My_Access_Token", responseBody.access_token, { maxAge: 1000 * 60 * 60 * 24 * 30 })
    return responseBody.access_token;
  }

}


// 测试一个翻译
var OhTrans = new SubProcess({
  name: "Oh!英语翻译",
  matchReg: /#.+/g,
  fullReg: /#.+#/g,
  runnable: async function (str) {
    var content = str.replace(/#/, '')
    var result = await start_one_chat(content).then((a) => {
      console.log(a)
      return a;
    })
    return result;
  },
  usage: "输入 `#{sentence}#` 进行翻译, 以 # 引用"
})


export default new Plugin("oh", [OhTrans]);

