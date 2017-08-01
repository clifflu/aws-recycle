/**
 * Remove EC2 resources including:
 * - Key pairs
 * - Instances
 * - EBS
 * - ENI
 * - EIP
 */

const moduleName = 'ec2'
const dependencies = ['asg']

const DELETE_BATCH_SIZE = 1000

const AWS = require('aws-sdk')
const Promise = require('bluebird')
const winston = require('winston')

const chunk = require("../helper/chunk")
const combine = require('../helper/combine')
const config = require('../config')
const dep = require('../helper/dep')

// function deleteSpotFleets (payload) {
//   return Promise.resolve(payload)
// }
//
// function deleteSpotRequests (payload) {
//   return payload
// }

function deleteInstances (payload) {
  const ec2 = new AWS.EC2({region: payload.region})

  const _list = Promise.promisify(ec2.describeInstances, {context: ec2})
  const _terminate = Promise.promisify(ec2.terminateInstances, {context: ec2})

  const filtersAlive = Object.freeze([
    {Name: 'instance-state-name',
      Values: [
        'pending', 'running', 'stopping', 'stopped']}
  ])

  const filtersNotTerminated = Object.freeze([
    {Name: 'instance-state-name',
      Values: [
        'pending', 'running', 'shutting-down',
        'stopping', 'stopped']}
  ])

  function _listInstances (token, filters) {
    // Collect flattened instance info from AWS
    return combine(
      _list,
      {Filters: filters, MaxResults: undefined},
      raw => raw.Reservations.map(r => r.Instances).reduce((a, b) => a.concat(b), []).map(i => i.InstanceId),
      'NextToken'
    )
  }

  function _deleteInstances (instances) {
    return Promise.all(
      chunk(instances, DELETE_BATCH_SIZE)
        .map(batch => {
          winston.info(`<${payload.region}> removing instances: ${batch}`)
          _terminate({InstanceIds: batch})
        })
    )
  }

  function _guardInstances (a) {
    function _checkAliveBoxes (instances) {
      if (instances.length > 0) {
        throw new Error(`<${payload.region}> Running box found after deleteInstances`)
      }
      return instances
    }

    function _waitForTermination () {
      const expiry = Date.now() + config.poll.timeout

      return new Promise((resolve, reject) => {
        (function check () {
          _listInstances(undefined, filtersNotTerminated)
            .then(instances => instances.length === 0
              ? resolve()
              : Date.now() > expiry
                ? reject(new Error(`<${payload.region}> timeout for EC2 termination`))
                : setTimeout(check, config.poll.wait)
            )
        })() // IIFE, check()
      }) // promise
    }

    return _listInstances(undefined, filtersAlive)
      .then(_checkAliveBoxes)
      .then(instances => instances.length && _waitForTermination())
  }

  return _listInstances(undefined, filtersAlive)
    .then(_deleteInstances)
    .then(_guardInstances)
}

function deleteKeyPairs (payload) {
  const ec2 = new AWS.EC2({region: payload.region})
  const _list = Promise.promisify(ec2.describeKeyPairs, {context: ec2})
  const _delete = Promise.promisify(ec2.deleteKeyPair, {context: ec2})

  return _list({})
    .then(d => d.KeyPairs)
    .then(keyPairs => Promise.all(
      keyPairs.map(
        k => _delete({KeyName: k.KeyName})
          .then(winston.info(`<${payload.region}> EC2::KeyPair "${k.KeyName}" deleted`))
      )
    )).then(() => payload)
}

function facade (payload) {
  winston.info(`<${payload.region}> Removing EC2 resources`)

  return Promise.all([
    deleteInstances(payload),
    deleteKeyPairs(payload)
  ])
    .then(() => winston.info(`<${payload.region}> EC2 completed`))
}

module.exports = payload => dep(moduleName, dependencies, payload, facade)
