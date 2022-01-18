// const Redis = require('ioredis')
// const redis = new Redis()

// const cache = (req, res, next) => {
//   const { id } = req.params
//   redis.get(id, (error, result) => {
//     if (error) throw error
//     if (result !== null) {
//       return res.json(JSON.parse(result))
//     } else {
//       return next()
//     }
//   })
// }

// module.exports = cache

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
