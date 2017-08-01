/**
 *
 */

const moduleName = (fn => { let s = __filename.split('/').splice(-1)[0]; return s.substr(0, s.lastIndexOf('.')) })()
const dependencies = []

const winston = require('winston')

const dep = require('../helper/dep')
const filename = __filename.split('/').splice(-2).join('/')

function facade (payload) {
  console.log(`# \`${filename}\` in the works`)
  return payload
}

module.exports = payload => dep(moduleName, dependencies, payload, facade)
