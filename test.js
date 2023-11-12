import Plugin, { SubProcess } from './plugin.js'
import moment from 'moment'

var calculateNow = new SubProcess("^(n|no|now)?$", "^now$", (match) => {
    return new moment().valueOf()
})

var a = new Plugin("t", [calculateNow])

console.log(a._p_matches("t now"))
