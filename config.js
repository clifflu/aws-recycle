module.exports = Object.freeze({
  pollWait: 2000,
  regions: Object.freeze([
    'us-east-1',
    'us-west-2'
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
