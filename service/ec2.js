/**
 * Remove EC2 resources including:
 * - Core
 * - Snapshot
 * - Net
 */

const moduleName = 'ec2'
const dependencies = ['asg']

const Promise = require('bluebird')
const winston = require('winston')

const dep = require('../helper/dep')

const core = require('./ec2/core')
const net = require('./ec2/net')
const snapshot = require('./ec2/snapshot')

function facade (payload) {
  winston.info(`<${payload.region}> Removing EC2 resources`)

  return Promise.resolve()
    .then(() => Promise.all([
      core.deleteInstances(payload),
      core.deleteKeyPairs(payload),
      snapshot.deleteAll(payload),
      net.deleteEIP(payload),
    ]))
    .then(() => Promise.all([
      core.deleteEBS(payload),
      net.deleteENI(payload),
    ]))
    .then(() => winston.info(`<${payload.region}> EC2 completed`))
}

module.exports = payload => dep(moduleName, dependencies, payload, facade)
