const { isConnected } = require('../utils')
const nocache = require('./nocache')

const ERROR_HANDLERS = {
  ECONNRESET: (res, error) => {
    nocache(res)
    if (!isConnected) res.status(400).json({ error: 'Internet connection error' })
    else res.status(400).json({ error: 'Connection error' })
  },
  ENOTFOUND: (res, error) => {
    nocache(res)
    if (!isConnected) res.status(400).json({ error: 'Internet connection error' })
    else res.status(400).json({ error: 'Connection error' })
  },
  defaultError: (res, error) => {
    console.error({
      error: error.message,
      name: error.name,
      stack: error.stack,
      code: error.code
    })
    nocache(res)
    res.status(500).end()
  }
}

module.exports = (error, request, response, next) => {
  console.log('I am on the errorHandler middleware 😢')

  const handler =
    ERROR_HANDLERS[error?.name] ||
    ERROR_HANDLERS[error?.code] ||
    ERROR_HANDLERS.defaultError

  handler(response, error)
}
