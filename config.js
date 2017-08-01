let seconds = 1000
let minutes = 60 * seconds

module.exports = Object.freeze({
  poll: Object.freeze({
    wait: 2 * seconds,
    timeout: 2 * minutes
  }),
  regions: Object.freeze([
    'us-east-1'
  ]),
  services: Object.freeze([
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
  ])
})
