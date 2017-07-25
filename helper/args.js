const argparse = require('argparse')

function getParser () {
  const parser = new argparse.ArgumentParser({
    addHelp: true,
    description: 'Remove most resources from given AWS account sparing IAM and S3'
  })

  const iamGroup = parser.addMutuallyExclusiveGroup()

  iamGroup.addArgument(
    [ '-i', '--iam' ],
    {
      action: 'storeTrue',
      help: 'remove most IAM resources except for identity and rules used for aws-recycle'
    }
  )

  parser.addArgument(
    [ '--s3' ],
    {
      action: 'storeTrue',
      help: 'remove S3 buckets and objects'
    }
  )

  parser.addArgument(
    [ '-a', '--all' ],
    {
      action: 'storeTrue',
      help: 'enable `--self` and `--s3`'
    }
  )

  const printGroup = parser.addMutuallyExclusiveGroup()

  printGroup.addArgument(
    [ '-q', '--quiet' ],
    {
      action: 'storeTrue',
      help: 'less output'
    }
  )

  printGroup.addArgument(
    [ '-v', '--verbose' ],
    {
      action: 'storeTrue',
      help: 'more output'
    }
  )

  printGroup.addArgument(
    [ '-w', '--very-verbose' ],
    {
      action: 'storeTrue',
      help: 'much more output'
    }
  )

  return parser
}

function getArgs () {
  const args = getParser().parseArgs()
  if (args['all']) {
    args['s3'] = true
    args['iam'] = true
  }
  return Object.freeze(args)
}

module.exports = getArgs
