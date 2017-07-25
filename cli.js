#!/usr/bin/env node

const services = [
  'asg',
  'cloudwatch',
  'ec2',
  'ecr',
  'ecs',
  'iam',
  'lambda',
  'logs',
  'rds',
  's3',
  'sns',
  'sqs',
  'vpc'
]

const winston = require('winston')

const args = require('./helper/args')()

winston.configure({
  level: args.very_verbose
    ? 'silly'
    : args.verbose
      ? 'verbose'
      : args.quiet ? 'warn' : 'info',
  transports: [
    new (winston.transports.Console)()
  ]
})

const payload = {
  dep: {}
}

Promise.all(services.map(service => require(`./service/${service}`)(payload)))
  .then(() => payload)
  .then(console.log)
