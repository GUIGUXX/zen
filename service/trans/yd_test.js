import YDTrans, { running_function } from './yd.js';




var s = [
  "You",
  "Concept",
  "商业英语"
]


async function testQueryYd(a) {
  var result = await running_function(a)
  console.log(result) 
}


// s.forEach(a => {
//   testQueryYd(a)
// })


let a = YDTrans.match_process("yd hello there is a test ")
console.log(a)
a.forEach(element => {
  element.then(aa => {
    console.log(aa)
  })
});
