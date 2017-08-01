module.exports = (lst, size) => {
  const batches = []
  while (lst.length) {
    let batchSize = Math.min(size, lst.length)
    batches.push(lst.splice(0, batchSize))
  }
  return batches
}
