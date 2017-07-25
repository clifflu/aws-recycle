const winston = require('winston')

module.exports = function (level) {
  return winston.getLogger({level})
}
