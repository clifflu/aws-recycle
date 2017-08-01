/**
 * Remove EC2 resources including:
 * - Spot requests
 * - Instances
 * - EBS
 * - ENI
 * - EIP
 * - Key pairs
 */

const moduleName = 'ec2'
const dependencies = ['asg']

const winston = require('winston')

const config = require('../config')
const dep = require('../helper/dep')
const filename = __filename.split('/').splice(-2).join('/')

// function deleteSpotFleets (payload) {
//   return Promise.resolve(payload)
// }
//
// function deleteSpotRequests (payload) {
//   return payload
// }

function deleteInstances (payload) {
  return payload
}

function deleteKeyPairs (payload) {
  return payload
}

function facade (payload) {
  winston.info(`<${payload.region}> Removing EC2 resources`)

  return Promise.all([
    deleteInstances(payload),
    deleteKeyPairs(payload)
  ]).then(() => winston.info(`<${payload.region}> EC2 completed`))
}

module.exports = payload => dep(moduleName, dependencies, payload, facade)
