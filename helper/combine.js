
const extend = require('extend')

function mix(a, b) {
  return Array.isArray(a)
    ? a.concat(b)
    : extend(a, b)
}

/**
 * Combine multi-page results from promise functions
 *
 * @param fetcher
 * @param param
 */
function combine (fetcher, param, extractor, attr) {
  return new Promise(resolve => {
    fetcher(param)
      .then(raw => {
        let data = extractor(raw)

        if (raw[attr]) {
          let ext = {}
          ext[attr] = raw[attr]
          return fetcher(extend({}, param, ext))
            .then(nextData => resolve(mix(data, nextData)))
        }
        resolve(data)
      })
  })
}

module.exports = combine
