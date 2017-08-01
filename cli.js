#!/usr/bin/env node

const winston = require('winston')

const config = require('./config')
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

const promises = []

for (let region of config.regions) {
  let payload = {region: region, dep: {}}

  promises.push(
    Promise.all(
      config.services.map(svc => require(`./service/${svc}`)(payload))
    ).then(() => payload)
  )
}

Promise.all(promises)
  .then(console.log)
