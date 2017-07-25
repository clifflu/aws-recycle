
const winston = require('winston')

module.exports = (moduleName, dependencies, payload, facade) => {
  winston.debug(`@deps (${moduleName}, [${dependencies}], ${JSON.stringify(payload)})`)
  function loadDependency (dep) {
    if (!payload.dep[dep]) {
      winston.debug(`Dependency on ${dep} from ${moduleName} not satisfied`)
      payload.dep[dep] = require(`../service/${dep}`)(payload)
    }
    return payload.dep[dep]
  }

  if (payload.dep[moduleName]) {
    winston.debug(`Module cache hit: ${moduleName}, skipping @dep`)
    return payload.dep[moduleName]
  }
  // moduleName first run

  winston.debug(`Module cache miss: ${moduleName}, working on deps`)

  payload.dep[moduleName] = Promise.all(
    dependencies.map(dep => loadDependency(dep))
  )
    .then(() => facade(payload))

  return payload.dep[moduleName]
}
