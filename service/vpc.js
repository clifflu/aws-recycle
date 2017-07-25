/**
 * Remove VPC resources including
 * - Security groups
 * - Network ACL
 * - Subnets
 * - VPC
 *
 */

const moduleName = "vpc"
const dependencies = ['ec2', 'rds', 'lambda']

const AWS = require('aws-sdk')
const Promise = require('bluebird')
const winston = require('winston')

const dep = require('../helper/dep')
const filename = __filename.split('/').splice(-2).join('/')

const ec2 = new AWS.EC2()

function deleteSecurityGroups (payload) {
  return payload
}

function deleteNetworkAcl (payload) {
  return payload
}

function deleteSubnets (payload) {
  return payload
}

function deleteVpcs (payload) {
  return payload
}

function facade (payload) {
  winston.info("Removing VPC resources")
  return Promise.all([
    deleteSecurityGroups(payload),
    deleteNetworkAcl(payload),
  ]).then(() => payload)
  .then(deleteSubnets)
  .then(deleteVpcs)
  .then(r => winston.info("VPC completed") || r)
}

module.exports = payload => dep(moduleName, dependencies, payload, facade)
