const NodeCache = require('node-cache')
const cache = new NodeCache()

module.exports = duration => (req, res, next) => {
  if (req.method !== 'GET') {
    console.log('Not a GET request, passing control to next middleware')
    return next()
  }

  const key = `${req.method}-${req.originalUrl}`
  const cached = cache.get(key)
  if (cached) {
    // console.log('Serving from cache')
    return res.json(cached)
  }

  // console.log('Serving from server')
  res.sendResponse = res.json
  res.json = body => {
    cache.set(key, body, duration)
    res.sendResponse(body)
  }
  next()
}
