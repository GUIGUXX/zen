import OhInPlugin, { get_oh_access_token, start_one_chat } from './oh_my_friend.js';
import alfy from "alfy";

function testGetAccessToken() {
  var access_token =  get_oh_access_token()
  console.log(">", access_token)
  var test_access_token = alfy.config.get('Oh_My_Access_Token')
  console.log("=>", test_access_token)
}

testGetAccessToken()


async function testCallOneChat(){
  var result = await start_one_chat("John: Hi, how are you doing today?")
  console.log(result)
}

// testCallOneChat()


async function testCallRunnable(){
  var results = OhInPlugin.run_at("oh #Hello#")
  results.forEach(async element => {
    var a = await element.arg
    console.log(a)
  });
}


// testCallRunnable()
