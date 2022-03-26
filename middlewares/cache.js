const NodeCache = require('node-cache')
const cache = new NodeCache()

module.exports = duration => (req, res, next) => {
  if (req.method !== 'GET') {
    // console.log('Not a GET request, passing control to next middleware')
    return next()
  }

  const key = `${req.method}-${req.originalUrl}`
  // console.log(res.statusCode)
  const cached = cache.get(key)
  if (cached) {
    // console.log('Serving from cache')
    return res.json(cached)
  }

  // console.log('Serving from server')
  res.sendResponse = res.json
  res.json = body => {
    if (!body.error && duration && duration > 0 && res.statusCode < 400) {
      // console.log('Caching response')
      cache.set(key, body, duration)
    }
    res.sendResponse(body)
  }
  next()
}
