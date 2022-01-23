module.exports = (req, res, next) => {
  const Log = require('../models/Log')
  const startTime = Date.now()

  res.on('finish', async () => {
    const { headers, httpVersion, method, socket, url, body, params, query } = req
    const { remoteAddress, remoteFamily } = socket
    const { statusCode, statusMessage } = res
    const responseHeaders = res.getHeaders()

    const endTime = Date.now()
    const processingTime = endTime - startTime

    const debugObject = {
      timestamp: startTime,
      date: new Date(startTime).toISOString(),
      processingTime,
      request: {
        headers,
        httpVersion,
        method,
        remoteAddress,
        remoteFamily,
        url,
        body,
        params,
        query
      },
      response: {
        statusCode,
        statusMessage,
        headers: responseHeaders
      }
    }
    const log = new Log(debugObject)
    await log.save()
    // console.log(savedLog)
  })

  next()
}
